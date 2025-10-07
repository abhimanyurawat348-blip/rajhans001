import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, setDoc, getDoc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useComplaints } from '../contexts/ComplaintContext';
import { read, utils } from 'xlsx';
import {
  Shield,
  Bell,
  Users,
  FileText,
  Calendar,
  ClipboardList,
  Trash2,
  CheckCircle,
  LogOut,
  MessageSquare,
  Monitor,
  UserPlus,
  BookOpen,
  Upload,
  Download,
  AlertCircle,
  Check,
  Lock,
  Eye,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface StudentDoc {
  id: string;
  username?: string;
  email?: string;
  role?: string;
  class?: string;
  section?: string;
  admissionNumber?: string;
  createdAt?: { seconds?: number } | Date;
}

interface ParentDoc {
  id: string;
  email?: string;
  role?: string;
  studentId?: string;
  studentEmail?: string;
  createdAt?: { seconds?: number } | Date;
}

interface MarksheetUpload {
  class: string;
  section: string;
  subject: string;
  examType: string;
  marksData: Array<{
    studentId: string;
    marks: number;
    maxMarks: number;
    grade?: string;
  }>;
}

interface UnregisteredStudentMarks {
  id?: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  section: string;
  examType: string;
  subject: string;
  marks: number;
  maxMarks: number;
  uploadedAt: Date;
  teacherId: string;
}

const NewStaffPortal: React.FC = () => {
  const navigate = useNavigate();
  const { complaints, loadComplaints, updateComplaintStatus, deleteComplaint } = useComplaints();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // Add the missing state
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'students' | 'registrations' | 'complaints' | 'meetings' | 'notices' | 'marksheets' | 'classes'>('dashboard');
  const [students, setStudents] = useState<StudentDoc[]>([]);
  const [parents, setParents] = useState<ParentDoc[]>([]);
  const [showMarksheetForm, setShowMarksheetForm] = useState(false);
  const [marksheetData, setMarksheetData] = useState<MarksheetUpload>({
    class: '',
    section: '',
    subject: '',
    examType: '',
    marksData: []
  });
  const [selectedClassStudents, setSelectedClassStudents] = useState<StudentDoc[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{ loading: boolean; message: string; error: boolean }>({ loading: false, message: '', error: false });
  const [unregisteredMarks, setUnregisteredMarks] = useState<UnregisteredStudentMarks[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [loginRecords, setLoginRecords] = useState<any[]>([]);

  // Function to auto-link unregistered student marks when a matching student registers
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    localStorage.removeItem('staffPortalAuth');
    setLoginData({ username: '', password: '' });
    navigate('/login');
  };

  const handleComplaintAction = async (id: string, action: 'remove' | 'under-consideration' | 'resolved') => {
    if (action === 'remove') {
      await deleteComplaint(id);
    } else {
      await updateComplaintStatus(id, action);
    }
  };

  const handleRemoveStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        // Remove from users collection
        await deleteDoc(doc(db, 'users', id));
        
        // Reload data
        loadAllData();
      } catch (error) {
        console.error('Error removing student:', error);
        alert('Failed to remove student');
      }
    }
  };

  const handleRemoveParent = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this parent?')) {
      try {
        // Remove from users collection
        await deleteDoc(doc(db, 'users', id));
        
        // Reload data
        loadAllData();
      } catch (error) {
        console.error('Error removing parent:', error);
        alert('Failed to remove parent');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'under-consideration':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under-consideration':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'removed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const autoLinkUnregisteredMarks = useCallback(async () => {
    try {
      // Get all unregistered marks
      const unregisteredMarksSnap = await getDocs(collection(db, 'unregistered_student_marks'));
      
      // For each unregistered mark, check if a matching student now exists
      for (const docSnapshot of unregisteredMarksSnap.docs) {
        const unregisteredMark = { id: docSnapshot.id, ...docSnapshot.data() } as UnregisteredStudentMarks & { id: string };
        
        // Try to find a matching student by admission number or name
        const studentQuery = query(
          collection(db, 'users'),
          where('role', '==', 'student'),
          where('admissionNumber', '==', unregisteredMark.admissionNumber)
        );
        
        const studentSnapshot = await getDocs(studentQuery);
        
        if (!studentSnapshot.empty) {
          // Found a matching student, move the marks to their record
          const student = studentSnapshot.docs[0];
          
          // Save to student's marks collection
          await setDoc(doc(db, 'students', student.id, 'marks', unregisteredMark.examType), {
            [unregisteredMark.examType]: unregisteredMark.marks,
            uploadedAt: unregisteredMark.uploadedAt,
            class: unregisteredMark.class,
            section: unregisteredMark.section,
            subject: unregisteredMark.subject
          }, { merge: true });
          
          // Delete from unregistered marks collection
          await deleteDoc(doc(db, 'unregistered_student_marks', unregisteredMark.id));
        }
      }
    } catch (err) {
      console.error('Error auto-linking unregistered marks:', err);
    }
  }, []);

  // Enhanced loadAllData that also triggers auto-linking
  const loadAllData = useCallback(async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudentDoc[];
      
      setStudents(usersData.filter((u) => (u as { role?: string }).role === 'student'));
      setParents(usersData.filter((u) => (u as { role?: string }).role === 'parent'));
      
      // Load unregistered marks
      const unregisteredMarksSnap = await getDocs(collection(db, 'unregistered_student_marks'));
      const unregisteredMarksData = unregisteredMarksSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UnregisteredStudentMarks[];
      
      setUnregisteredMarks(unregisteredMarksData);
      
      // Trigger auto-linking
      await autoLinkUnregisteredMarks();
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }, [autoLinkUnregisteredMarks]);

  useEffect(() => {
    loadAllData();
    loadComplaints();
    
    // Load login records
    const loadLoginRecords = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'loginRecords'));
        const records: any[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          records.push({
            id: doc.id,
            ...data,
            loginTime: data.loginTime?.toDate ? data.loginTime.toDate() : data.loginTime
          });
        });
        
        setLoginRecords(records);
      } catch (err) {
        console.error('Error loading login records:', err);
      }
    };
    
    loadLoginRecords();
  }, [loadAllData, loadComplaints]);

  const loadStudentsByClass = async (classValue: string, sectionValue: string) => {
    try {
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        where('class', '==', classValue),
        where('section', '==', sectionValue)
      );
      
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudentDoc[];
      
      setSelectedClassStudents(studentsData);
      
      // Initialize marks data
      setMarksheetData(prev => ({
        ...prev,
        marksData: studentsData.map(student => ({
          studentId: student.id,
          marks: 0,
          maxMarks: 100
        }))
      }));
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  // Enhanced error handling for Excel upload
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus({ loading: false, message: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)', error: true });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({ loading: false, message: 'File size exceeds 5MB limit. Please upload a smaller file.', error: true });
      return;
    }

    setExcelFile(file);
    setUploadStatus({ loading: true, message: 'Processing Excel file...', error: false });

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = utils.sheet_to_json(worksheet);
        
        // Validate required columns
        if (jsonData.length > 0) {
          const firstRow = jsonData[0];
          if (typeof firstRow === 'object' && firstRow !== null) {
            const requiredColumns = ['Roll Number', 'Student Name', 'Marks'];
            const missingColumns = requiredColumns.filter(col => 
              !Object.keys(firstRow).includes(col) && 
              !Object.keys(firstRow).includes(col.toLowerCase().replace(' ', '_'))
            );
            
            if (missingColumns.length > 0) {
              setUploadStatus({ 
                loading: false, 
                message: `Missing required columns: ${missingColumns.join(', ')}. Please check your Excel format.`, 
                error: true 
              });
              return;
            }
          }
        }
        
        setExcelData(jsonData);
        setUploadStatus({ loading: false, message: `Loaded ${jsonData.length} records from Excel`, error: false });
      } catch (err) {
        setUploadStatus({ loading: false, message: 'Error processing Excel file. Please check the file format.', error: true });
        console.error('Error reading Excel file:', err);
      }
    };
    reader.onerror = () => {
      setUploadStatus({ loading: false, message: 'Error reading file. Please try again.', error: true });
    };
    reader.readAsArrayBuffer(file);
  };

  // Enhanced processExcelData with logging
  const processExcelData = async (examType: string, classValue: string, sectionValue: string) => {
    if (excelData.length === 0) {
      setUploadStatus({ loading: false, message: 'No data to process. Please upload a valid Excel file.', error: true });
      return;
    }

    setUploadStatus({ loading: true, message: 'Processing and saving marks...', error: false });

    try {
      // Log the upload attempt
      const uploadLog = {
        teacherId: 'current_teacher_id', // This would be the actual teacher ID in real implementation
        class: classValue,
        section: sectionValue,
        examType: examType,
        subject: marksheetData.subject,
        timestamp: new Date(),
        recordCount: excelData.length
      };
      
      await addDoc(collection(db, 'upload_logs'), uploadLog);

      let successCount = 0;
      let errorCount = 0;

      // Process each row
      for (const row of excelData) {
        try {
          const rollNumber = row['Roll Number'] || row['roll_number'] || row['Roll_Number'];
          const studentName = row['Student Name'] || row['student_name'] || row['Student_Name'];
          const marks = parseInt(row['Marks'] || row['marks']) || 0;

          // Validate data
          if (!rollNumber || !studentName) {
            errorCount++;
            continue;
          }

          // Find student by roll number or name
          const student = students.find(s => 
            (s.admissionNumber === rollNumber?.toString()) || 
            (s.username?.toLowerCase() === studentName?.toLowerCase())
          );

          if (student) {
            // Save to student's marks collection with proper structure for report card
            await setDoc(doc(db, 'students', student.id, 'marks', examType), {
              [examType]: marks,
              marks: marks, // Duplicate for easier access
              maxMarks: 100,
              subject: marksheetData.subject,
              class: classValue,
              section: sectionValue,
              examType: examType,
              uploadedAt: new Date(),
              uploadedBy: 'staff' // In a real implementation, this would be the actual teacher ID
            }, { merge: true });
            successCount++;
          } else {
            // Save to unregistered marks collection
            await setDoc(doc(collection(db, 'unregistered_student_marks')), {
              studentName: studentName,
              admissionNumber: rollNumber,
              class: classValue,
              section: sectionValue,
              examType: examType,
              subject: marksheetData.subject,
              marks: marks,
              maxMarks: 100,
              uploadedAt: new Date(),
              teacherId: 'current_teacher_id' // This would be the actual teacher ID in real implementation
            });
            successCount++;
          }
        } catch (rowError) {
          errorCount++;
          console.error('Error processing row:', rowError);
        }
      }

      // Update upload log with results
      await addDoc(collection(db, 'upload_logs'), {
        ...uploadLog,
        completedAt: new Date(),
        successCount: successCount,
        errorCount: errorCount,
        status: errorCount === 0 ? 'completed' : 'completed_with_errors'
      });

      if (errorCount === 0) {
        setUploadStatus({ loading: false, message: `Marks uploaded successfully! ${successCount} records processed.`, error: false });
      } else {
        setUploadStatus({ loading: false, message: `Upload completed with ${errorCount} errors. ${successCount} records processed successfully.`, error: false });
      }
      
      // Reload data
      loadAllData();
      
      // Clear form after 3 seconds
      setTimeout(() => {
        setExcelFile(null);
        setExcelData([]);
        setShowMarksheetForm(false);
      }, 3000);
    } catch (err: any) {
      setUploadStatus({ loading: false, message: 'Error saving marks. Please try again.', error: true });
      console.error('Error saving marks:', err);
      
      // Log error
      await addDoc(collection(db, 'upload_logs'), {
        teacherId: 'current_teacher_id', // This would be the actual teacher ID in real implementation
        class: classValue,
        section: sectionValue,
        examType: examType,
        subject: marksheetData.subject,
        timestamp: new Date(),
        error: err.message || 'Unknown error',
        status: 'failed'
      });
    }
  };

  const handleCreateMarksheet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create marks records for each student
      for (const markData of marksheetData.marksData) {
        await setDoc(doc(db, 'students', markData.studentId, 'marks', marksheetData.examType), {
          [marksheetData.examType]: markData.marks,
          maxMarks: markData.maxMarks,
          subject: marksheetData.subject,
          uploadedAt: new Date(),
          class: marksheetData.class,
          section: marksheetData.section
        }, { merge: true });
      }
      
      setShowMarksheetForm(false);
      setMarksheetData({
        class: '',
        section: '',
        subject: '',
        examType: '',
        marksData: []
      });
      
      loadAllData();
    } catch (err) {
      console.error('Error creating marksheet:', err);
    }
  };

  // Navigation sections
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: Monitor },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'marksheets', label: 'Marksheets', icon: FileText },
    { id: 'registrations', label: 'Registrations', icon: ClipboardList },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'notices', label: 'Notices', icon: Bell }
  ];

  // Enhanced Class Dashboard Component with better UI/UX
  const ClassDashboard = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedExam, setSelectedExam] = useState('');

    const examTypes = [
      { id: 'unit_test_1', name: 'Unit Test 1' },
      { id: 'unit_test_2', name: 'Unit Test 2' },
      { id: 'unit_test_3', name: 'Unit Test 3' },
      { id: 'half_yearly', name: 'Half Yearly' },
      { id: 'final_exam', name: 'Final Exam' }
    ];

    const handleClassChange = (classValue: string) => {
      setSelectedClass(classValue);
      if (selectedSection) {
        loadStudentsByClass(classValue, selectedSection);
      }
    };

    const handleSectionChange = (sectionValue: string) => {
      setSelectedSection(sectionValue);
      if (selectedClass) {
        loadStudentsByClass(selectedClass, sectionValue);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Class Dashboard</h2>
          <p className="text-gray-600 mb-6">Select a class and section to upload marks for your students.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Choose a class</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Section</label>
              <select
                value={selectedSection}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Choose a section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          {selectedClass && selectedSection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Class {selectedClass} - Section {selectedSection}
              </h3>
              <p className="text-gray-600 mb-6">Select an exam type to upload marks for your students.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {examTypes.map((exam) => (
                  <motion.div
                    key={exam.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                      setSelectedExam(exam.id);
                      setMarksheetData({
                        class: selectedClass,
                        section: selectedSection,
                        subject: '',
                        examType: exam.id,
                        marksData: selectedClassStudents.map(student => ({
                          studentId: student.id,
                          marks: 0,
                          maxMarks: 100
                        }))
                      });
                      setShowMarksheetForm(true);
                    }}
                  >
                    <Upload className="h-8 w-8 mb-3" />
                    <h4 className="font-bold text-lg">{exam.name}</h4>
                    <p className="text-blue-100 text-sm mt-1">Upload Excel</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {showMarksheetForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Upload Marks for {selectedExam.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <button
                    onClick={() => setShowMarksheetForm(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={marksheetData.subject}
                      onChange={(e) => setMarksheetData({ ...marksheetData, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter subject name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class & Section</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={marksheetData.class}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      />
                      <input
                        type="text"
                        value={marksheetData.section}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Excel File
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">Excel File Format Requirements:</h4>
                    <ul className="text-blue-700 text-sm list-disc pl-5 space-y-1">
                      <li>Columns must include: <strong>Roll Number</strong>, <strong>Student Name</strong>, and <strong>Marks</strong></li>
                      <li>Roll Number should match student admission numbers</li>
                      <li>Student Name should match registered student names</li>
                      <li>Marks should be numeric values</li>
                    </ul>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 flex flex-col items-center justify-center px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {excelFile ? excelFile.name : 'Click to upload Excel file (.xlsx or .xls)'}
                      </p>
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleExcelUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {excelFile && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => processExcelData(selectedExam, selectedClass, selectedSection)}
                        disabled={uploadStatus.loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center transition-all duration-200"
                      >
                        {uploadStatus.loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Process & Save
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {uploadStatus.message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mt-2 p-3 rounded-lg text-sm ${
                          uploadStatus.error 
                            ? 'bg-red-50 text-red-700' 
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        <div className="flex items-center">
                          {uploadStatus.error ? (
                            <AlertCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          {uploadStatus.message}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {excelData.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h4 className="font-medium text-gray-900">Preview Data</h4>
                    </div>
                    <div className="max-h-60 overflow-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(excelData[0] || {}).map((key) => (
                              <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {excelData.slice(0, 5).map((row, index) => (
                            <tr key={index}>
                              {Object.values(row || {}).map((value: any, i) => (
                                <td key={i} className="px-4 py-2 text-sm text-gray-900">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                          {excelData.length > 5 && excelData[0] && (
                            <tr>
                              <td colSpan={Object.keys(excelData[0]).length} className="px-4 py-2 text-center text-sm text-gray-500">
                                {'... and ' + (excelData.length - 5) + ' more rows'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // Function to generate mock data for testing
  const generateMockData = async () => {
    try {
      // Create mock students for Class 8, Section A
      const mockStudents = [
        { username: 'Rahul Sharma', admissionNumber: 'RHPS001', class: '8', section: 'A' },
        { username: 'Priya Patel', admissionNumber: 'RHPS002', class: '8', section: 'A' },
        { username: 'Amit Kumar', admissionNumber: 'RHPS003', class: '8', section: 'A' },
        { username: 'Sneha Gupta', admissionNumber: 'RHPS004', class: '8', section: 'A' },
        { username: 'Vikash Singh', admissionNumber: 'RHPS005', class: '8', section: 'A' }
      ];

      // Add mock students to database
      for (const student of mockStudents) {
        // Check if student already exists
        const studentQuery = query(
          collection(db, 'users'),
          where('admissionNumber', '==', student.admissionNumber)
        );
        
        const studentSnapshot = await getDocs(studentQuery);
        
        if (studentSnapshot.empty) {
          // Create new student
          const studentData = {
            ...student,
            role: 'student',
            email: `${student.username.replace(' ', '.').toLowerCase()}@gmail.com`,
            createdAt: new Date()
          };
          
          await addDoc(collection(db, 'users'), studentData);
        }
      }

      // Generate mock marks data
      const examTypes = ['unit_test_1', 'unit_test_2', 'unit_test_3', 'half_yearly', 'final_exam'];
      
      for (const student of mockStudents) {
        // Get student ID
        const studentQuery = query(
          collection(db, 'users'),
          where('admissionNumber', '==', student.admissionNumber)
        );
        
        const studentSnapshot = await getDocs(studentQuery);
        
        if (!studentSnapshot.empty) {
          const studentDoc = studentSnapshot.docs[0];
          const studentId = studentDoc.id;
          
          // Generate marks for each exam type
          for (const examType of examTypes) {
            const mockMarks = Math.floor(Math.random() * 40) + 60; // Random marks between 60-100
            
            await setDoc(doc(db, 'students', studentId, 'marks', examType), {
              [examType]: mockMarks,
              uploadedAt: new Date(),
              class: student.class,
              section: student.section,
              subject: 'Mathematics'
            }, { merge: true });
          }
        }
      }

      // Reload data to show mock data
      loadAllData();
      
      alert('Mock data generated successfully for Class 8, Section A!');
    } catch (err) {
      console.error('Error generating mock data:', err);
      alert('Error generating mock data. Check console for details.');
    }
  };

  // Check if user is already authenticated
  useEffect(() => {
    const storedAuth = localStorage.getItem('staffPortalAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      setShowLogin(false);
    }
  }, []);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated credentials as per requirements
    if (loginData.username === 'rajhans_001@gmail.com' && loginData.password === 'abhimanyu001') {
      setIsAuthenticated(true);
      setShowLogin(false);
      localStorage.setItem('staffPortalAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    localStorage.removeItem('staffPortalAuth');
    setLoginData({ username: '', password: '' });
    navigate('/login');
  };

  const handleComplaintAction = async (id: string, action: 'remove' | 'under-consideration' | 'resolved') => {
    if (action === 'remove') {
      await deleteComplaint(id);
    } else {
      await updateComplaintStatus(id, action);
    }
  };

  const handleRemoveStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        // Remove from users collection
        await deleteDoc(doc(db, 'users', id));
        
        // Reload data
        loadAllData();
      } catch (error) {
        console.error('Error removing student:', error);
        alert('Failed to remove student');
      }
    }
  };

  const handleRemoveParent = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this parent?')) {
      try {
        // Remove from users collection
        await deleteDoc(doc(db, 'users', id));
        
        // Reload data
        loadAllData();
      } catch (error) {
        console.error('Error removing parent:', error);
        alert('Failed to remove parent');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'under-consideration':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under-consideration':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'removed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Portal</h1>
            <p className="text-gray-600">Enter your credentials to access the portal</p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Enhanced dashboard with test button
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={generateMockData}
                className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors duration-200"
              >
                Generate Mock Data
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                      <Users className="h-8 w-8 mb-3" />
                      <p className="text-blue-100">Total Students</p>
                      <p className="text-3xl font-bold mt-1">{students.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                      <UserPlus className="h-8 w-8 mb-3" />
                      <p className="text-green-100">Total Parents</p>
                      <p className="text-3xl font-bold mt-1">{parents.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                      <FileText className="h-8 w-8 mb-3" />
                      <p className="text-amber-100">Unregistered Marks</p>
                      <p className="text-3xl font-bold mt-1">{unregisteredMarks.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                      <BookOpen className="h-8 w-8 mb-3" />
                      <p className="text-purple-100">Active Classes</p>
                      <p className="text-3xl font-bold mt-1">12</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'classes' && <ClassDashboard />}

            {activeSection === 'students' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Students</h2>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Student
                      </button>
                    </div>
                  </div>
                  
                  {students.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No students registered</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.map((student) => (
                            <tr key={student.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.username}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.section}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.admissionNumber || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button 
                                  onClick={() => handleRemoveStudent(student.id)}
                                  className="text-red-600 hover:text-red-900 flex items-center"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Parents</h2>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Parent
                      </button>
                    </div>
                  </div>
                  
                  {parents.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No parents registered</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {parents.map((parent) => (
                            <tr key={parent.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parent.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {students.find(s => s.id === parent.studentId)?.username || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parent.studentEmail}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button 
                                  onClick={() => handleRemoveParent(parent.id)}
                                  className="text-red-600 hover:text-red-900 flex items-center"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'marksheets' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Upload Marksheets</h2>
                    <button
                      onClick={() => setShowMarksheetForm(!showMarksheetForm)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Marksheet
                    </button>
                  </div>

                  {showMarksheetForm && (
                    <form onSubmit={handleCreateMarksheet} className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                            <input
                              type="text"
                              value={marksheetData.class}
                              onChange={(e) => {
                                setMarksheetData({ ...marksheetData, class: e.target.value });
                                if (marksheetData.section) {
                                  loadStudentsByClass(e.target.value, marksheetData.section);
                                }
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Enter class (e.g., 10)"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                            <input
                              type="text"
                              value={marksheetData.section}
                              onChange={(e) => {
                                setMarksheetData({ ...marksheetData, section: e.target.value });
                                if (marksheetData.class) {
                                  loadStudentsByClass(marksheetData.class, e.target.value);
                                }
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Enter section (e.g., A)"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input
                              type="text"
                              value={marksheetData.subject}
                              onChange={(e) => setMarksheetData({ ...marksheetData, subject: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Enter subject name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                            <input
                              type="text"
                              value={marksheetData.examType}
                              onChange={(e) => setMarksheetData({ ...marksheetData, examType: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Enter exam type (e.g., Midterm)"
                              required
                            />
                          </div>
                        </div>
                        
                        {selectedClassStudents.length > 0 && (
                          <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Marks for Students</h3>
                            <div className="space-y-3">
                              {selectedClassStudents.map((student, index) => (
                                <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                  <div>
                                    <p className="font-medium text-gray-900">{student.username}</p>
                                    <p className="text-sm text-gray-500">{student.email}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="number"
                                      min="0"
                                      max={marksheetData.marksData[index]?.maxMarks || 100}
                                      value={marksheetData.marksData[index]?.marks || 0}
                                      onChange={(e) => {
                                        const newMarksData = [...marksheetData.marksData];
                                        newMarksData[index] = {
                                          ...newMarksData[index],
                                          marks: parseInt(e.target.value) || 0
                                        };
                                        setMarksheetData({ ...marksheetData, marksData: newMarksData });
                                      }}
                                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                    />
                                    <span className="text-gray-500">/</span>
                                    <input
                                      type="number"
                                      min="1"
                                      value={marksheetData.marksData[index]?.maxMarks || 100}
                                      onChange={(e) => {
                                        const newMarksData = [...marksheetData.marksData];
                                        newMarksData[index] = {
                                          ...newMarksData[index],
                                          maxMarks: parseInt(e.target.value) || 100
                                        };
                                        setMarksheetData({ ...marksheetData, marksData: newMarksData });
                                      }}
                                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Marks
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Display existing marksheets */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Marksheets</h3>
                    <p className="text-gray-500 text-center py-4">No marksheets uploaded yet</p>
                  </div>
                </div>
              </div>
            )}

            {/* Other sections remain the same */}
            {activeSection === 'registrations' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900">Registrations</h2>
                <p className="text-gray-500 mt-4">Registration management features would appear here.</p>
              </div>
            )}

            {activeSection === 'complaints' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Student Complaints</h2>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        Export CSV
                      </button>
                    </div>
                  </div>
                  
                  {complaints.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No complaints submitted yet.</p>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {complaints.map((complaint) => (
                        <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{complaint.studentName}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                  {complaint.status.replace('-', ' ')}
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-600 mb-2">
                                <span>Class {complaint.class}-{complaint.section}</span>
                                <span className="mx-2">•</span>
                                <span>Email: {complaint.email}</span>
                                <span className="mx-2">•</span>
                                <span>{new Date(complaint.submittedAt).toLocaleDateString()}</span>
                                {complaint.ipAddress && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>IP: {complaint.ipAddress}</span>
                                  </>
                                )}
                              </div>

                              <p className="text-gray-700 mb-3 line-clamp-2">{complaint.complaint}</p>

                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => setSelectedComplaint(selectedComplaint === complaint.id ? null : complaint.id)}
                                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>{selectedComplaint === complaint.id ? 'Hide' : 'View'} Details</span>
                                </button>

                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleComplaintAction(complaint.id, 'under-consideration')}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors duration-200"
                                  >
                                    Under Review
                                  </button>
                                  <button
                                    onClick={() => handleComplaintAction(complaint.id, 'resolved')}
                                    className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors duration-200"
                                  >
                                    Mark Solved
                                  </button>
                                  <button
                                    onClick={() => handleComplaintAction(complaint.id, 'remove')}
                                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors duration-200 flex items-center space-x-1"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span>Remove</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {getStatusIcon(complaint.status)}
                            </div>
                          </div>

                          {selectedComplaint === complaint.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="grid md:grid-cols-2 gap-4">
                                {complaint.fatherName && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Father's Name:</p>
                                    <p className="text-sm text-gray-600">{complaint.fatherName}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Email:</p>
                                  <p className="text-sm text-gray-600">{complaint.email}</p>
                                </div>
                              </div>
                              <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700">Full Complaint:</p>
                                <p className="text-sm text-gray-600 mt-1">{complaint.complaint}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'meetings' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900">Meetings</h2>
                <p className="text-gray-500 mt-4">Meeting scheduling features would appear here.</p>
              </div>
            )}

            {activeSection === 'registrations' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Login Records</h2>
                {loginRecords.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No login records available.</p>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {loginRecords.map((record) => (
                      <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{record.email}</h3>
                            <div className="text-sm text-gray-600 mt-1">
                              <span>IP: {record.ipAddress}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(record.loginTime).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {record.otpVerified ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                Unverified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'notices' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900">Notices</h2>
                <p className="text-gray-500 mt-4">Notice board features would appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStaffPortal;