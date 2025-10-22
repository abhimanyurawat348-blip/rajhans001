import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAttendance } from '../contexts/AttendanceContext';
import { 
  Calendar, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Moon, 
  Save, 
  Download, 
  AlertTriangle,
  Filter,
  Search,
  BarChart2,
  Bell
} from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import { motion } from 'framer-motion';

interface Student {
  id: string;
  fullName: string;
  email: string;
  class: string;
  section: string;
  admissionNumber: string;
  rollNumber?: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  source?: 'manual' | 'qr' | 'biometric';
  recordedBy?: string;
  recordedAt?: Date;
}

const EnhancedAttendanceManager: React.FC = () => {
  const { markAttendance, getStudentAttendance, getClassAttendance } = useAttendance();
  
  // Filter states
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [studentStatuses, setStudentStatuses] = useState<{[key: string]: 'present' | 'absent' | 'late' | 'excused'}>({});
  const [remarks, setRemarks] = useState<{[key: string]: string}>({});
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load students by class and section
  const loadStudents = async () => {
    if (!selectedClass || !selectedSection) return;
    
    setLoading(true);
    try {
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        where('class', '==', selectedClass),
        where('section', '==', selectedSection)
      );
      
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentsData = studentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          fullName: data.fullName || data.username || 'Unknown Student',
          email: data.email || '',
          class: data.class || '',
          section: data.section || '',
          admissionNumber: data.admissionNumber || '',
          rollNumber: data.rollNumber || ''
        } as Student;
      });
      
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      
      // Load existing attendance records for the selected date
      const existingRecords = getClassAttendance(selectedClass, selectedSection, new Date(selectedDate));
      setAttendanceRecords(existingRecords);
      
      // Initialize student statuses with existing records or default to 'present'
      const initialStatuses: {[key: string]: 'present' | 'absent' | 'late' | 'excused'} = {};
      const initialRemarks: {[key: string]: string} = {};
      
      studentsData.forEach(student => {
        const existingRecord = existingRecords.find(record => record.studentId === student.id);
        if (existingRecord) {
          initialStatuses[student.id] = existingRecord.status;
          initialRemarks[student.id] = existingRecord.remarks || '';
        } else {
          initialStatuses[student.id] = 'present';
        }
      });
      
      setStudentStatuses(initialStatuses);
      setRemarks(initialRemarks);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter students based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student => 
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);
  
  // Handle class/section selection
  const handleLoadStudents = () => {
    loadStudents();
  };
  
  // Update student status
  const updateStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setStudentStatuses(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  // Update student remark
  const updateStudentRemark = (studentId: string, remark: string) => {
    setRemarks(prev => ({
      ...prev,
      [studentId]: remark
    }));
  };
  
  // Mark all students with a specific status
  const markAll = (status: 'present' | 'absent') => {
    const newStatuses = {...studentStatuses};
    students.forEach(student => {
      newStatuses[student.id] = status;
    });
    setStudentStatuses(newStatuses);
  };
  
  // Save attendance records
  const saveAttendance = async () => {
    if (!selectedClass || !selectedSection || !selectedDate) return;
    
    setSaving(true);
    try {
      const batch = writeBatch(db);
      
      // Process each student's attendance
      for (const student of students) {
        const status = studentStatuses[student.id] || 'present';
        const remark = remarks[student.id] || '';
        
        // Check if record already exists for this student/date
        const existingRecord = attendanceRecords.find(
          record => record.studentId === student.id && 
                   new Date(record.date).toDateString() === new Date(selectedDate).toDateString()
        );
        
        const attendanceData = {
          studentId: student.id,
          studentName: student.fullName,
          class: selectedClass,
          section: selectedSection,
          date: new Date(selectedDate),
          status,
          remarks: remark,
          source: 'manual',
          recordedBy: 'staff',
          recordedAt: new Date()
        };
        
        if (existingRecord) {
          // Update existing record
          const recordRef = doc(db, 'attendance', existingRecord.id);
          await updateDoc(recordRef, attendanceData);
        } else {
          // Create new record
          await addDoc(collection(db, 'attendance'), attendanceData);
        }
      }
      
      alert('Attendance saved successfully!');
      // Reload data to reflect changes
      loadStudents();
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error saving attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Export attendance to Excel
  const exportToExcel = () => {
    const data = students.map(student => {
      const status = studentStatuses[student.id] || 'present';
      const remark = remarks[student.id] || '';
      
      return {
        'Student Name': student.fullName,
        'Admission Number': student.admissionNumber,
        'Roll Number': student.rollNumber || 'N/A',
        'Class': student.class,
        'Section': student.section,
        'Date': selectedDate,
        'Status': status.charAt(0).toUpperCase() + status.slice(1),
        'Remarks': remark
      };
    });
    
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Attendance');
    writeFile(wb, `attendance_${selectedClass}_${selectedSection}_${selectedDate}.xlsx`);
  };
  
  // Calculate attendance summary
  const getAttendanceSummary = () => {
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: students.length
    };
    
    students.forEach(student => {
      const status = studentStatuses[student.id] || 'present';
      summary[status] = summary[status] + 1;
    });
    
    return summary;
  };
  
  const summary = getAttendanceSummary();
  
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-primary flex items-center">
            <UserCheck className="h-6 w-6 mr-2" />
            Attendance Management
          </h2>
        </div>
        
        <div className="card-body">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input"
              >
                <option value="">Choose a class</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">Select Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="input"
              >
                <option value="">Choose a section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleLoadStudents}
                disabled={!selectedClass || !selectedSection || loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4 mr-2" />
                    Load Students
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Search */}
          {students.length > 0 && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tertiary" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
          )}
          
          {/* Summary */}
          {students.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-3 text-center">
                <p className="text-sm text-tertiary">Present</p>
                <p className="text-xl font-bold text-success-600 dark:text-success-400">{summary.present}</p>
              </div>
              
              <div className="bg-error-50 dark:bg-error-900/20 rounded-lg p-3 text-center">
                <p className="text-sm text-tertiary">Absent</p>
                <p className="text-xl font-bold text-error-600 dark:text-error-400">{summary.absent}</p>
              </div>
              
              <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-3 text-center">
                <p className="text-sm text-tertiary">Late</p>
                <p className="text-xl font-bold text-warning-600 dark:text-warning-400">{summary.late}</p>
              </div>
              
              <div className="bg-secondary-50 dark:bg-secondary-900/20 rounded-lg p-3 text-center">
                <p className="text-sm text-tertiary">Excused</p>
                <p className="text-xl font-bold text-secondary-600 dark:text-secondary-400">{summary.excused}</p>
              </div>
              
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 text-center">
                <p className="text-sm text-tertiary">Total</p>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{summary.total}</p>
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          {students.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => markAll('present')}
                className="btn btn-success btn-sm"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark All Present
              </button>
              
              <button
                onClick={() => markAll('absent')}
                className="btn btn-error btn-sm"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Mark All Absent
              </button>
              
              <button
                onClick={exportToExcel}
                className="btn btn-outline btn-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Export to Excel
              </button>
            </div>
          )}
          
          {/* Student List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Admission No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map((student) => {
                    const status = studentStatuses[student.id] || 'present';
                    const remark = remarks[student.id] || '';
                    
                    return (
                      <motion.tr 
                        key={student.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                              <span className="text-primary-800 dark:text-primary-200 font-medium">
                                {student.fullName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-primary">{student.fullName}</div>
                              <div className="text-sm text-tertiary">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                          {student.admissionNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                          {student.rollNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={status}
                            onChange={(e) => updateStudentStatus(student.id, e.target.value as any)}
                            className={`input py-1 px-2 text-sm ${
                              status === 'present' ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200' :
                              status === 'absent' ? 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-200' :
                              status === 'late' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-200' :
                              'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-200'
                            }`}
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={remark}
                            onChange={(e) => updateStudentRemark(student.id, e.target.value)}
                            placeholder="Remarks (optional)"
                            className="input py-1 px-2 text-sm"
                          />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : selectedClass && selectedSection ? (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-tertiary mx-auto mb-4" />
              <p className="text-tertiary">No students found for the selected class and section</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-tertiary mx-auto mb-4" />
              <p className="text-tertiary">Select a class and section to load students</p>
            </div>
          )}
          
          {/* Save Button */}
          {students.length > 0 && (
            <div className="flex justify-end mt-6">
              <button
                onClick={saveAttendance}
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Attendance
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Attendance Reports */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-primary flex items-center">
            <BarChart2 className="h-6 w-6 mr-2" />
            Attendance Reports
          </h2>
        </div>
        
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-primary rounded-lg p-4">
              <h3 className="font-medium text-primary mb-3">Class-wise Attendance Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Class 10A</span>
                  <span className="font-semibold">92%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-success-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="border border-primary rounded-lg p-4">
              <h3 className="font-medium text-primary mb-3">Absentee Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-error-50 dark:bg-error-900/20 rounded">
                  <div>
                    <p className="font-medium text-primary">Rahul Sharma</p>
                    <p className="text-sm text-tertiary">Class 10A • 3 consecutive days</p>
                  </div>
                  <button className="btn btn-primary btn-sm">
                    <Bell className="h-4 w-4 mr-1" />
                    Notify Parents
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAttendanceManager;