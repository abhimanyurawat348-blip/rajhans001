import React, { createContext, useContext, useState, ReactNode } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Complaint } from '../types';

interface ComplaintContextType {
  complaints: Complaint[];
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'submittedAt' | 'status' | 'ipAddress'>) => Promise<boolean>;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  deleteComplaint: (id: string) => Promise<boolean>;
  loadComplaints: () => Promise<void>;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  };

  const loadComplaints = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'complaints'));
      const loadedComplaints: Complaint[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedComplaints.push({
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate ? data.submittedAt.toDate() : new Date()
        } as Complaint);
      });
      
      setComplaints(loadedComplaints);
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  };

  const submitComplaint = async (complaintData: Omit<Complaint, 'id' | 'submittedAt' | 'status' | 'ipAddress'>): Promise<boolean> => {
    try {
      const ipAddress = await getClientIP();

      const newComplaint: Complaint = {
        ...complaintData,
        id: '', 
        submittedAt: new Date(),
        status: 'pending',
        ipAddress
      };

      const docRef = await addDoc(collection(db, 'complaints'), newComplaint);
      newComplaint.id = docRef.id;

      setComplaints(prev => [...prev, newComplaint]);

      await addDoc(collection(db, 'staffNotifications'), {
        type: 'new_complaint',
        complaintId: docRef.id,
        studentName: complaintData.studentName,
        class: complaintData.class,
        section: complaintData.section,
        email: complaintData.email,
        timestamp: Date.now(),
        createdAt: new Date(),
        read: false
      });

      return true;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      return false;
    }
  };

  const updateComplaintStatus = async (id: string, status: Complaint['status']) => {
    try {
      
      if (!id) {
        console.error('Invalid complaint ID');
        return;
      }
      
      
      const complaintRef = doc(db, 'complaints', id);
      const complaintSnap = await getDoc(complaintRef);
      
      if (!complaintSnap.exists()) {
        console.error('Complaint document not found');
        return;
      }
      
      await updateDoc(complaintRef, { status });
      setComplaints(prev =>
        prev.map(complaint =>
          complaint.id === id ? { ...complaint, status } : complaint
        )
      );
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const deleteComplaint = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'complaints', id));
      setComplaints(prev => prev.filter(complaint => complaint.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting complaint:', error);
      return false;
    }
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      submitComplaint,
      updateComplaintStatus,
      deleteComplaint,
      loadComplaints
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};