import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Student } from '../types';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

interface AttendanceSummary {
  studentId: string;
  present: number;
  total: number;
  percentage: number;
}

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  attendanceSummary: AttendanceSummary[];
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => Promise<boolean>;
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
  getClassAttendance: (classId: string, section: string, date?: Date) => AttendanceRecord[];
  getAttendanceSummary: (studentId: string) => AttendanceSummary | null;
  loadAttendance: () => Promise<void>;
  loadAttendanceSummary: () => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary[]>([]);

  const loadAttendance = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'attendance'));
      const loadedAttendance: AttendanceRecord[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedAttendance.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate() : data.date instanceof Date ? data.date : new Date(data.date)
        } as AttendanceRecord);
      });
      
      setAttendanceRecords(loadedAttendance);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const loadAttendanceSummary = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'attendanceSummary'));
      const loadedSummary: AttendanceSummary[] = [];
      
      querySnapshot.forEach((doc) => {
        loadedSummary.push({
          studentId: doc.id,
          ...doc.data()
        } as AttendanceSummary);
      });
      
      setAttendanceSummary(loadedSummary);
    } catch (error) {
      console.error('Error loading attendance summary:', error);
    }
  };

  const markAttendance = async (recordData: Omit<AttendanceRecord, 'id'>): Promise<boolean> => {
    try {
      const newRecord: AttendanceRecord = {
        ...recordData,
        id: ''
      };

      const docRef = await addDoc(collection(db, 'attendance'), newRecord);
      newRecord.id = docRef.id;

      setAttendanceRecords(prev => [...prev, newRecord]);

      // Update summary
      await updateAttendanceSummary(recordData.studentId, recordData.status);
      
      return true;
    } catch (error) {
      console.error('Error marking attendance:', error);
      return false;
    }
  };

  const updateAttendanceSummary = async (studentId: string, status: string) => {
    try {
      // Get all attendance records for this student
      const studentRecords = attendanceRecords.filter(record => record.studentId === studentId);
      const total = studentRecords.length + 1; // +1 for the new record
      const present = status === 'present' || status === 'late' ? 
        studentRecords.filter(record => record.status === 'present' || record.status === 'late').length + 1 : 
        studentRecords.filter(record => record.status === 'present' || record.status === 'late').length;
      
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      const summaryData = {
        present,
        total,
        percentage
      };
      
      // Update or create summary document
      const summaryRef = doc(db, 'attendanceSummary', studentId);
      const summarySnap = await getDoc(summaryRef);
      
      if (summarySnap.exists()) {
        await updateDoc(summaryRef, summaryData);
      } else {
        await addDoc(collection(db, 'attendanceSummary'), { ...summaryData, studentId });
      }
      
      // Update local summary state
      setAttendanceSummary(prev => {
        const existingIndex = prev.findIndex(s => s.studentId === studentId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { studentId, ...summaryData };
          return updated;
        } else {
          return [...prev, { studentId, ...summaryData }];
        }
      });
    } catch (error) {
      console.error('Error updating attendance summary:', error);
    }
  };

  const getStudentAttendance = (studentId: string): AttendanceRecord[] => {
    return attendanceRecords.filter(record => record.studentId === studentId);
  };

  const getClassAttendance = (classId: string, section: string, date?: Date): AttendanceRecord[] => {
    return attendanceRecords.filter(record => {
      const matchesClass = record.class === classId && record.section === section;
      if (date) {
        const recordDate = new Date(record.date);
        return matchesClass && 
               recordDate.getDate() === date.getDate() && 
               recordDate.getMonth() === date.getMonth() && 
               recordDate.getFullYear() === date.getFullYear();
      }
      return matchesClass;
    });
  };

  const getAttendanceSummary = (studentId: string): AttendanceSummary | null => {
    const summary = attendanceSummary.find(s => s.studentId === studentId);
    return summary || null;
  };

  useEffect(() => {
    loadAttendance();
    loadAttendanceSummary();
  }, []);

  return (
    <AttendanceContext.Provider value={{
      attendanceRecords,
      attendanceSummary,
      markAttendance,
      getStudentAttendance,
      getClassAttendance,
      getAttendanceSummary,
      loadAttendance,
      loadAttendanceSummary
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};