import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, setDoc, getDoc, updateDoc, addDoc, deleteDoc, orderBy } from 'firebase/firestore';
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
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Award
} from 'lucide-react';

interface StudentDoc {
  id: string;
  username?: string;
  name?: string;
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
    attendance?: 'present' | 'absent' | 'late';
    remarks?: string;
  }>;
}

interface PerformanceEntry {
  studentId: string;
  marks: number;
  maxMarks: number;
  attendance: 'present' | 'absent' | 'late';
  remarks: string;
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
  attendance?: 'present' | 'absent' | 'late';
  remarks?: string;
}


interface StudentMarks {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  marks: number;
  maxMarks: number;
  attendance?: 'present' | 'absent' | 'late';
  remarks?: string;
}

interface ResultRecord {
  id: string;
  class: string;
  section: string;
  examType: string;
  subject: string;
  uploadedAt: Date;
  uploadedBy: string;
  studentCount: number;
}

const NewStaffPortal: React.FC = () => {
  const navigate = useNavigate();
  const { complaints, loadComplaints, updateComplaintStatus, deleteComplaint } = useComplaints();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'students' | 'registrations' | 'complaints' | 'meetings' | 'notices' | 'marksheets' | 'classes' | 'insights' | 'performance' | 'analytics'>('dashboard');
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
  const [notices, setNotices] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'normal' | 'important' | 'urgent'
  });
  const [newMeeting, setNewMeeting] = useState({
    topic: '',
    date: '',
    time: '',
    url: '',
    description: ''
  });

  
  const [marksheetStep, setMarksheetStep] = useState<number>(1);
  const [numberOfStudents, setNumberOfStudents] = useState<number>(0);
  const [studentMarks, setStudentMarks] = useState<StudentMarks[]>([]);
  const [resultRecords, setResultRecords] = useState<ResultRecord[]>([]);
  const [selectedResultRecord, setSelectedResultRecord] = useState<string | null>(null);
  const [showAllMarksheetView, setShowAllMarksheetView] = useState(false);

  



  
  const loadAllData = useCallback(async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ensure we have both username and name fields for compatibility
        username: doc.data().username || doc.data().name || 'Unknown',
        name: doc.data().name || doc.data().username || 'Unknown'
      })) as StudentDoc[];
      
      // Log student data for debugging
      const studentData = usersData.filter((u) => (u as { role?: string }).role === 'student');
      console.log('Student data loaded:', studentData);
      
      setStudents(studentData);
      setParents(usersData.filter((u) => (u as { role?: string }).role === 'parent'));
      
      
      const unregisteredMarksSnap = await getDocs(collection(db, 'unregistered_student_marks'));
      const unregisteredMarksData = unregisteredMarksSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UnregisteredStudentMarks[];
      
      setUnregisteredMarks(unregisteredMarksData);
      
      
      const resultRecordsSnap = await getDocs(collection(db, 'result_records'));
      const resultRecordsData = resultRecordsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ResultRecord[];
      
      setResultRecords(resultRecordsData);
      
      
      try {
        
        const unregisteredMarksSnap = await getDocs(collection(db, 'unregistered_student_marks'));
        
        
        for (const docSnapshot of unregisteredMarksSnap.docs) {
          const unregisteredMark = { id: docSnapshot.id, ...docSnapshot.data() } as UnregisteredStudentMarks & { id: string };
          
          
          const studentQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            where('admissionNumber', '==', unregisteredMark.admissionNumber)
          );
          
          const studentSnapshot = await getDocs(studentQuery);
          
          if (!studentSnapshot.empty) {
            
            const student = studentSnapshot.docs[0];
            
            
            await setDoc(doc(db, 'students', student.id, 'marks', unregisteredMark.examType), {
              [unregisteredMark.examType]: unregisteredMark.marks,
              uploadedAt: unregisteredMark.uploadedAt,
              class: unregisteredMark.class,
              section: unregisteredMark.section,
              subject: unregisteredMark.subject,
              attendance: 'present',
              remarks: ''
            }, { merge: true });
            
            
            await deleteDoc(doc(db, 'unregistered_student_marks', unregisteredMark.id));
          }
        }
      } catch (err) {
        console.error('Error auto-linking unregistered marks:', err);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }, []);

  
  const loadNotices = useCallback(async () => {
    try {
      const noticesQuery = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      const noticesSnapshot = await getDocs(noticesQuery);
      const noticesData = noticesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotices(noticesData);
    } catch (err) {
      console.error('Error loading notices:', err);
    }
  }, []);

  
  const loadMeetings = useCallback(async () => {
    try {
      const meetingsQuery = query(collection(db, 'meetings'), orderBy('date', 'desc'));
      const meetingsSnapshot = await getDocs(meetingsQuery);
      const meetingsData = meetingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMeetings(meetingsData);
    } catch (err) {
      console.error('Error loading meetings:', err);
    }
  }, []);

  
  const addNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'notices'), {
        title: newNotice.title,
        content: newNotice.content,
        priority: newNotice.priority,
        createdAt: new Date(),
        createdBy: 'staff'
      });
      
      setNewNotice({
        title: '',
        content: '',
        priority: 'normal'
      });
      
      loadNotices();
    } catch (err) {
      console.error('Error adding notice:', err);
    }
  };

  
  const deleteNotice = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notices', id));
      loadNotices();
    } catch (err) {
      console.error('Error deleting notice:', err);
    }
  };

  
  const addMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'meetings'), {
        topic: newMeeting.topic,
        date: newMeeting.date,
        time: newMeeting.time,
        url: newMeeting.url,
        description: newMeeting.description,
        createdAt: new Date(),
        createdBy: 'staff'
      });
      
      setNewMeeting({
        topic: '',
        date: '',
        time: '',
        url: '',
        description: ''
      });
      
      loadMeetings();
    } catch (err) {
      console.error('Error adding meeting:', err);
    }
  };

  
  const deleteMeeting = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'meetings', id));
      loadMeetings();
    } catch (err) {
      console.error('Error deleting meeting:', err);
    }
  };

  useEffect(() => {
    
    const storedAuth = localStorage.getItem('staffPortalAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    loadAllData();
    loadComplaints();
    loadNotices();
    loadMeetings();
    
    
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
  }, [loadAllData, loadComplaints, loadNotices, loadMeetings]);

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
      
      
      setMarksheetData(prev => ({
        ...prev,
        marksData: studentsData.map(student => ({
          studentId: student.id,
          marks: 0,
          maxMarks: 100,
          attendance: 'present',
          remarks: ''
        }))
      }));
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus({ loading: false, message: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)', error: true });
      return;
    }

    
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

  
  const processExcelData = async (examType: string, classValue: string, sectionValue: string) => {
    if (excelData.length === 0) {
      setUploadStatus({ loading: false, message: 'No data to process. Please upload a valid Excel file.', error: true });
      return;
    }

    setUploadStatus({ loading: true, message: 'Processing and saving marks...', error: false });

    try {
      
      const uploadLog = {
        teacherId: 'current_teacher_id', 
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

      
      for (const row of excelData) {
        try {
          const rollNumber = row['Roll Number'] || row['roll_number'] || row['Roll_Number'];
          const studentName = row['Student Name'] || row['student_name'] || row['Student_Name'];
          const marks = parseInt(row['Marks'] || row['marks']) || 0;

          
          if (!rollNumber || !studentName) {
            errorCount++;
            continue;
          }

          
          const student = students.find(s => 
            (s.admissionNumber === rollNumber?.toString()) || 
            (s.username?.toLowerCase() === studentName?.toLowerCase())
          );

          if (student) {
            
            await setDoc(doc(db, 'students', student.id, 'marks', examType), {
              [examType]: marks,
              marks: marks, 
              maxMarks: 100,
              subject: marksheetData.subject,
              class: classValue,
              section: sectionValue,
              examType: examType,
              uploadedAt: new Date(),
              uploadedBy: 'staff',
              attendance: 'present',
              remarks: ''
            }, { merge: true });
            successCount++;
          } else {
            
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
              teacherId: 'current_teacher_id',
              attendance: 'present',
              remarks: ''
            });
            successCount++;
          }
        } catch (rowError) {
          errorCount++;
          console.error('Error processing row:', rowError);
        }
      }

      
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
      
      
      loadAllData();
      
      
      setTimeout(() => {
        setExcelFile(null);
        setExcelData([]);
        setShowMarksheetForm(false);
      }, 3000);
    } catch (err: any) {
      setUploadStatus({ loading: false, message: 'Error saving marks. Please try again.', error: true });
      console.error('Error saving marks:', err);
      
      
      await addDoc(collection(db, 'upload_logs'), {
        teacherId: 'current_teacher_id', 
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
      
      for (const markData of marksheetData.marksData) {
        await setDoc(doc(db, 'students', markData.studentId, 'marks', marksheetData.examType), {
          [marksheetData.examType]: markData.marks,
          maxMarks: markData.maxMarks,
          subject: marksheetData.subject,
          uploadedAt: new Date(),
          class: marksheetData.class,
          section: marksheetData.section,
          attendance: markData.attendance || 'present',
          remarks: markData.remarks || ''
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

  
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: Monitor },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'performance', label: 'Performance Entry', icon: Upload },
    { id: 'marksheets', label: 'Marksheets', icon: FileText },
    { id: 'insights', label: 'Learning Insights', icon: BarChart3 },
    { id: 'analytics', label: 'Student Analytics', icon: TrendingUp },
    { id: 'registrations', label: 'Registrations', icon: ClipboardList },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'notices', label: 'Notices', icon: Bell }
  ];

  
  const getSubjectsByClass = (classValue: string) => {
    const classNum = parseInt(classValue);
    
    if (classNum >= 6 && classNum <= 8) {
      return ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer'];
    } else if (classNum >= 9 && classNum <= 10) {
      return ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Information Technology', 'Sanskrit (Optional)'];
    } else if (classNum >= 11 && classNum <= 12) {
      
      
      return ['English Core', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Physical Education'];
    }
    
    return [];
  };

  
  const getMaxMarksByExamType = (examType: string) => {
    if (examType.includes('unit_test')) {
      return 20;
    }
    return 100;
  };

  
  const resetMarksheetWorkflow = () => {
    setMarksheetStep(1);
    setMarksheetData({
      class: '',
      section: '',
      subject: '',
      examType: '',
      marksData: []
    });
    setNumberOfStudents(0);
    setStudentMarks([]);
    setShowMarksheetForm(false);
  };

  
  const handleClassSectionSelect = () => {
    if (marksheetData.class && marksheetData.section) {
      setMarksheetStep(2);
    }
  };

  
  const handleExamTypeSelect = () => {
    if (marksheetData.examType) {
      setMarksheetStep(3);
    }
  };

  
  const handleStudentCountSubmit = () => {
    if (numberOfStudents > 0 && numberOfStudents <= 50) {
      
      const initialStudentMarks: StudentMarks[] = [];
      for (let i = 1; i <= numberOfStudents; i++) {
        initialStudentMarks.push({
          id: `student-${i}`,
          studentId: '',
          studentName: '',
          admissionNumber: '',
          marks: 0,
          maxMarks: getMaxMarksByExamType(marksheetData.examType),
          attendance: 'present',
          remarks: ''
        });
      }
      setStudentMarks(initialStudentMarks);
      setMarksheetStep(4);
    }
  };

  
  const handleMarksEntry = (index: number, field: keyof StudentMarks, value: string | number) => {
    const updatedStudentMarks = [...studentMarks];
    updatedStudentMarks[index] = {
      ...updatedStudentMarks[index],
      [field]: value
    };
    setStudentMarks(updatedStudentMarks);
  };

  
  const saveMarks = async () => {
    try {
      
      for (const studentMark of studentMarks) {
        if (studentMark.studentId) {
          
          await setDoc(doc(db, 'students', studentMark.studentId, 'marks', `${marksheetData.examType}_${marksheetData.subject}`), {
            examType: marksheetData.examType,
            subject: marksheetData.subject,
            marks: studentMark.marks,
            maxMarks: studentMark.maxMarks,
            class: marksheetData.class,
            section: marksheetData.section,
            uploadedAt: new Date(),
            uploadedBy: 'staff',
            attendance: studentMark.attendance || 'present',
            remarks: studentMark.remarks || ''
          }, { merge: true });
        } else {
          
          await setDoc(doc(collection(db, 'unregistered_student_marks')), {
            studentName: studentMark.studentName,
            admissionNumber: studentMark.admissionNumber,
            class: marksheetData.class,
            section: marksheetData.section,
            examType: marksheetData.examType,
            subject: marksheetData.subject,
            marks: studentMark.marks,
            maxMarks: studentMark.maxMarks,
            uploadedAt: new Date(),
            teacherId: 'current_teacher_id',
            attendance: studentMark.attendance || 'present',
            remarks: studentMark.remarks || ''
          });
        }
      }
      
      
      const resultRecord: ResultRecord = {
        id: Date.now().toString(),
        class: marksheetData.class,
        section: marksheetData.section,
        examType: marksheetData.examType,
        subject: marksheetData.subject,
        uploadedAt: new Date(),
        uploadedBy: 'staff',
        studentCount: numberOfStudents
      };
      
      await addDoc(collection(db, 'result_records'), resultRecord);
      
      
      loadAllData();
      
      
      resetMarksheetWorkflow();
      
      alert('Marks saved successfully!');
    } catch (err) {
      console.error('Error saving marks:', err);
      alert('Error saving marks. Please try again.');
    }
  };

  
  const exportMarksheet = () => {
    
    alert('Export functionality would be implemented here');
  };

  
  const viewAllStudentsMarksheet = () => {
    setShowAllMarksheetView(true);
  };

  
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
                          maxMarks: 100,
                          attendance: 'present',
                          remarks: ''
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



  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Staff Portal</h1>
          <div className="space-x-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`text-white px-4 py-2 rounded-lg ${
                  activeSection === section.id ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                <section.icon className="h-5 w-5 mr-2" />
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-6">
        {activeSection === 'dashboard' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
            <p className="text-gray-600 mb-6">Welcome to the Staff Portal. Here you can manage students, complaints, meetings, notices, and more.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Users className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Students</h3>
                <p className="text-gray-600">Manage student records and attendance.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <ClipboardList className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Registrations</h3>
                <p className="text-gray-600">Handle new student registrations.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <MessageSquare className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Complaints</h3>
                <p className="text-gray-600">View and resolve student complaints.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Calendar className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Meetings</h3>
                <p className="text-gray-600">Schedule and manage parent-teacher meetings.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Bell className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Notices</h3>
                <p className="text-gray-600">Publish important notices to students and parents.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <FileText className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Marksheets</h3>
                <p className="text-gray-600">Upload and manage student marksheets.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <BookOpen className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Classes</h3>
                <p className="text-gray-600">View and manage class schedules and attendance.</p>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'students' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Students</h2>
            <p className="text-gray-600 mb-6">Manage student records and attendance.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Users className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Total Students</h3>
                <p className="text-gray-600">{students.length}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <ClipboardList className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Registrations</h3>
                <p className="text-gray-600">Handle new student registrations.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <MessageSquare className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Complaints</h3>
                <p className="text-gray-600">View and resolve student complaints.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Calendar className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Meetings</h3>
                <p className="text-gray-600">Schedule and manage parent-teacher meetings.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Bell className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Notices</h3>
                <p className="text-gray-600">Publish important notices to students and parents.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <FileText className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Marksheets</h3>
                <p className="text-gray-600">Upload and manage student marksheets.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <BookOpen className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Classes</h3>
                <p className="text-gray-600">View and manage class schedules and attendance.</p>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'marksheets' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Marksheet Management</h2>
                <button
                  onClick={() => {
                    setShowMarksheetForm(!showMarksheetForm);
                    if (!showMarksheetForm) {
                      resetMarksheetWorkflow();
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Create New Marksheet
                </button>
              </div>

              {showMarksheetForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
                >
                  {}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Create Marksheet</h3>
                      <button
                        onClick={resetMarksheetWorkflow}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {}
                    <div className="flex items-center justify-between mb-8">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            marksheetStep === step 
                              ? 'bg-blue-600 text-white' 
                              : marksheetStep > step 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-200 text-gray-500'
                          }`}>
                            {marksheetStep > step ? <Check className="h-4 w-4" /> : step}
                          </div>
                          {step < 4 && (
                            <div className={`w-16 h-1 mx-2 ${
                              marksheetStep > step ? 'bg-green-600' : 'bg-gray-200'
                            }`}></div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {}
                    {marksheetStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <h4 className="text-lg font-semibold text-gray-900">Step 1: Select Class and Section</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                            <select
                              value={marksheetData.class}
                              onChange={(e) => setMarksheetData({ ...marksheetData, class: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select Class</option>
                              {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                            <select
                              value={marksheetData.section}
                              onChange={(e) => setMarksheetData({ ...marksheetData, section: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select Section</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={handleClassSectionSelect}
                            disabled={!marksheetData.class || !marksheetData.section}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </motion.div>
                    )}
                    
                    {}
                    {marksheetStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <h4 className="text-lg font-semibold text-gray-900">Step 2: Select Exam Type</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { id: 'unit_test_1', name: 'Unit Test 1', maxMarks: 20 },
                            { id: 'unit_test_2', name: 'Unit Test 2', maxMarks: 20 },
                            { id: 'unit_test_3', name: 'Unit Test 3', maxMarks: 20 },
                            { id: 'half_yearly', name: 'Half Yearly', maxMarks: 100 },
                            { id: 'final_exam', name: 'Final Exam', maxMarks: 100 }
                          ].map((exam) => (
                            <div
                              key={exam.id}
                              onClick={() => setMarksheetData({ ...marksheetData, examType: exam.id })}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                marksheetData.examType === exam.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <h5 className="font-medium text-gray-900">{exam.name}</h5>
                              <p className="text-sm text-gray-500">Max Marks: {exam.maxMarks}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between">
                          <button
                            onClick={() => setMarksheetStep(1)}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleExamTypeSelect}
                            disabled={!marksheetData.examType}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </motion.div>
                    )}
                    
                    {}
                    {marksheetStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <h4 className="text-lg font-semibold text-gray-900">Step 3: Enter Number of Students</h4>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Students (Max 50)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={numberOfStudents || ''}
                            onChange={(e) => setNumberOfStudents(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter number of students"
                          />
                        </div>
                        <div className="flex justify-between">
                          <button
                            onClick={() => setMarksheetStep(2)}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleStudentCountSubmit}
                            disabled={!numberOfStudents || numberOfStudents > 50 || numberOfStudents < 1}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </motion.div>
                    )}
                    
                    {}
                    {marksheetStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <h4 className="text-lg font-semibold text-gray-900">Step 4: Enter Marks</h4>
                        
                        {}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                          <select
                            value={marksheetData.subject}
                            onChange={(e) => setMarksheetData({ ...marksheetData, subject: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Subject</option>
                            {getSubjectsByClass(marksheetData.class).map((subject) => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                        </div>
                        
                        {}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                            <input
                              type="text"
                              value={marksheetData.class}
                              readOnly
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                            <input
                              type="text"
                              value={marksheetData.section}
                              readOnly
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                            />
                          </div>
                        </div>
                        
                        {}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                          <input
                            type="text"
                            value={
                              marksheetData.examType === 'unit_test_1' ? 'Unit Test 1' :
                              marksheetData.examType === 'unit_test_2' ? 'Unit Test 2' :
                              marksheetData.examType === 'unit_test_3' ? 'Unit Test 3' :
                              marksheetData.examType === 'half_yearly' ? 'Half Yearly' :
                              'Final Exam'
                            }
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          />
                        </div>
                        
                        {}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Marks (Max: {getMaxMarksByExamType(marksheetData.examType)})
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {studentMarks.map((student, index) => (
                                <tr key={student.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={student.studentName}
                                      onChange={(e) => handleMarksEntry(index, 'studentName', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded"
                                      placeholder="Enter student name"
                                    />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={student.admissionNumber}
                                      onChange={(e) => handleMarksEntry(index, 'admissionNumber', e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded"
                                      placeholder="Enter admission number"
                                    />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                      type="number"
                                      min="0"
                                      max={getMaxMarksByExamType(marksheetData.examType)}
                                      value={student.marks}
                                      onChange={(e) => handleMarksEntry(index, 'marks', parseInt(e.target.value) || 0)}
                                      className="w-24 px-2 py-1 border border-gray-300 rounded"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="flex justify-between">
                          <button
                            onClick={() => setMarksheetStep(3)}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Back
                          </button>
                          <div className="space-x-2">
                            <button
                              onClick={saveMarks}
                              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Save Marks
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Result Records</h3>
                {resultRecords.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No result records found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {resultRecords.map((record) => (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.class}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.section}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.examType === 'unit_test_1' ? 'Unit Test 1' :
                               record.examType === 'unit_test_2' ? 'Unit Test 2' :
                               record.examType === 'unit_test_3' ? 'Unit Test 3' :
                               record.examType === 'half_yearly' ? 'Half Yearly' :
                               'Final Exam'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.studentCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.uploadedAt.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => {
                                  setSelectedResultRecord(selectedResultRecord === record.id ? null : record.id);
                                }}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                {selectedResultRecord === record.id ? 'Hide' : 'View'}
                              </button>
                              <button
                                onClick={exportMarksheet}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Export
                              </button>
                              <button
                                onClick={viewAllStudentsMarksheet}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                View All
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
          </div>
        )}
        {activeSection === 'registrations' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registrations</h2>
            <p className="text-gray-600 mb-6">Handle new student registrations.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Users className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Total Students</h3>
                <p className="text-gray-600">{students.length}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <ClipboardList className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Registrations</h3>
                <p className="text-gray-600">Handle new student registrations.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <MessageSquare className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Complaints</h3>
                <p className="text-gray-600">View and resolve student complaints.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Calendar className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Meetings</h3>
                <p className="text-gray-600">Schedule and manage parent-teacher meetings.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Bell className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Notices</h3>
                <p className="text-gray-600">Publish important notices to students and parents.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <FileText className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Marksheets</h3>
                <p className="text-gray-600">Upload and manage student marksheets.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <BookOpen className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Classes</h3>
                <p className="text-gray-600">View and manage class schedules and attendance.</p>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'complaints' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complaints</h2>
            <p className="text-gray-600 mb-6">View and resolve student complaints.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Users className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Total Students</h3>
                <p className="text-gray-600">{students.length}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <ClipboardList className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Registrations</h3>
                <p className="text-gray-600">Handle new student registrations.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <MessageSquare className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Complaints</h3>
                <p className="text-gray-600">View and resolve student complaints.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Calendar className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Meetings</h3>
                <p className="text-gray-600">Schedule and manage parent-teacher meetings.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Bell className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Notices</h3>
                <p className="text-gray-600">Publish important notices to students and parents.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <FileText className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Marksheets</h3>
                <p className="text-gray-600">Upload and manage student marksheets.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <BookOpen className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Classes</h3>
                <p className="text-gray-600">View and manage class schedules and attendance.</p>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'meetings' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Meetings</h2>
            <p className="text-gray-600 mb-6">Schedule and manage parent-teacher meetings.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Users className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Total Students</h3>
                <p className="text-gray-600">{students.length}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <ClipboardList className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Registrations</h3>
                <p className="text-gray-600">Handle new student registrations.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <MessageSquare className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Complaints</h3>
                <p className="text-gray-600">View and resolve student complaints.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Calendar className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Meetings</h3>
                <p className="text-gray-600">Schedule and manage parent-teacher meetings.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Bell className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Notices</h3>
                <p className="text-gray-600">Publish important notices to students and parents.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <FileText className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Marksheets</h3>
                <p className="text-gray-600">Upload and manage student marksheets.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <BookOpen className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Classes</h3>
                <p className="text-gray-600">View and manage class schedules and attendance.</p>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'notices' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notices</h2>
            <p className="text-gray-600 mb-6">Publish important notices to students and parents.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Users className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Total Students</h3>
                <p className="text-gray-600">{students.length}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <ClipboardList className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Registrations</h3>
                <p className="text-gray-600">Handle new student registrations.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <MessageSquare className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Complaints</h3>
                <p className="text-gray-600">View and resolve student complaints.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Calendar className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Meetings</h3>
                <p className="text-gray-600">Schedule and manage parent-teacher meetings.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Bell className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Notices</h3>
                <p className="text-gray-600">Publish important notices to students and parents.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <FileText className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Marksheets</h3>
                <p className="text-gray-600">Upload and manage student marksheets.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <BookOpen className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Classes</h3>
                <p className="text-gray-600">View and manage class schedules and attendance.</p>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'marksheets' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Marksheets</h2>
            <p className="text-gray-600 mb-6">Upload and manage student marksheets.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Users className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Total Students</h3>
                <p className="text-gray-600">{students.length}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <ClipboardList className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Registrations</h3>
                <p className="text-gray-600">Handle new student registrations.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <MessageSquare className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Complaints</h3>
                <p className="text-gray-600">View and resolve student complaints.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Calendar className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Meetings</h3>
                <p className="text-gray-600">Schedule and manage parent-teacher meetings.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Bell className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Notices</h3>
                <p className="text-gray-600">Publish important notices to students and parents.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <FileText className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Marksheets</h3>
                <p className="text-gray-600">Upload and manage student marksheets.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <BookOpen className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Classes</h3>
                <p className="text-gray-600">View and manage class schedules and attendance.</p>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'classes' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Classes</h2>
            <p className="text-gray-600 mb-6">View and manage class schedules and attendance.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Users className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Total Students</h3>
                <p className="text-gray-600">{students.length}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <ClipboardList className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Registrations</h3>
                <p className="text-gray-600">Handle new student registrations.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <MessageSquare className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Complaints</h3>
                <p className="text-gray-600">View and resolve student complaints.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Calendar className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Meetings</h3>
                <p className="text-gray-600">Schedule and manage parent-teacher meetings.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Bell className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Notices</h3>
                <p className="text-gray-600">Publish important notices to students and parents.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <FileText className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Marksheets</h3>
                <p className="text-gray-600">Upload and manage student marksheets.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <BookOpen className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Classes</h3>
                <p className="text-gray-600">View and manage class schedules and attendance.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginData.username === 'rajhans_001@gmail.com' && loginData.password === 'abhimanyu03*9') {
      setIsAuthenticated(true);
      localStorage.setItem('staffPortalAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('staffPortalAuth');
    setLoginData({ username: '', password: '' });
    navigate('/login');
  };

  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'under-consideration':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'under-consideration':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
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
        
        await deleteDoc(doc(db, 'users', id));
        
        
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
        
        await deleteDoc(doc(db, 'users', id));
        
        
        loadAllData();
      } catch (error) {
        console.error('Error removing parent:', error);
        alert('Failed to remove parent');
      }
    }
  };

  
  const generateMockData = async () => {
    try {
      
      const mockStudents = [];
      
      
      for (let classNum = 6; classNum <= 12; classNum++) {
        for (const section of ['A', 'B', 'C']) {
          for (let i = 1; i <= 25; i++) {
            const admissionNumber = `RHPS${classNum}${section}${String(i).padStart(2, '0')}`;
            const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikash', 'Anjali', 'Rohan', 'Neha', 'Deepak', 'Pooja', 
                               'Suresh', 'Kavita', 'Manoj', 'Sunita', 'Rajesh', 'Meena', 'Vijay', 'Shalini', 'Ashok', 'Rekha',
                               'Sanjay', 'Rita', 'Mohan', 'Sangeeta', 'Prakash'];
            const lastNames = ['Sharma', 'Patel', 'Kumar', 'Gupta', 'Singh', 'Yadav', 'Verma', 'Jain', 'Mehta', 'Reddy',
                              'Nair', 'Iyer', 'Pillai', 'Desai', 'Chopra', 'Malhotra', 'Bose', 'Mukherjee', 'Das', 'Banerjee',
                              'Chatterjee', 'Sen', 'Roy', 'Mishra', 'Pandey'];
          
            const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const username = `${randomFirstName} ${randomLastName}`;
          
            mockStudents.push({ 
              username, 
              admissionNumber, 
              class: classNum.toString(), 
              section 
            });
          }
        }
      }

      
      let addedCount = 0;
      for (const student of mockStudents) {
        
        const studentQuery = query(
          collection(db, 'users'),
          where('admissionNumber', '==', student.admissionNumber)
        );
      
        const studentSnapshot = await getDocs(studentQuery);
      
        if (studentSnapshot.empty) {
          
          const studentData = {
            ...student,
            name: student.username, // Add name field for compatibility
            role: 'student',
            email: `${student.username.replace(' ', '.').toLowerCase()}@gmail.com`,
            createdAt: new Date()
          };
        
          await addDoc(collection(db, 'users'), studentData);
          addedCount++;
        }
      }

      
      const examTypes = ['unit_test_1', 'unit_test_2', 'unit_test_3', 'half_yearly', 'final_exam'];
      const subjects = ['English', 'Hindi', 'SST', 'Maths', 'Science', 'Computer', 'Sanskrit'];
    
      
      for (let i = 0; i < Math.min(5, mockStudents.length); i++) {
        const student = mockStudents[i];
      
        
        const studentQuery = query(
          collection(db, 'users'),
          where('admissionNumber', '==', student.admissionNumber)
        );
      
        const studentSnapshot = await getDocs(studentQuery);
      
        if (!studentSnapshot.empty) {
          const studentDoc = studentSnapshot.docs[0];
          const studentId = studentDoc.id;
        
          
          for (const examType of examTypes) {
            for (const subject of subjects) {
              
              let maxMarks = 100;
              if (examType.includes('unit_test')) {
                maxMarks = 20;
              }
            
              const mockMarks = Math.floor(Math.random() * (maxMarks - 40)) + 40; 
            
              await setDoc(doc(db, 'students', studentId, 'marks', `${examType}_${subject}`), {
                [examType]: mockMarks,
                marks: mockMarks,
                maxMarks: maxMarks,
                subject: subject,
                uploadedAt: new Date(),
                class: student.class,
                section: student.section,
                examType: examType
              }, { merge: true });
            }
          }
        }
      }

      
      loadAllData();
    
      alert(`Mock data generated successfully! Added ${addedCount} students across all classes and sections.`);
    } catch (err) {
      console.error('Error generating mock data:', err);
      alert('Error generating mock data. Check console for details.');
    }
  };

  
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
            
            {}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Test Credentials:</strong><br />
                Username: rajhans_001@gmail.com<br />
                Password: abhimanyu03*9
              </p>
            </div>
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
          {}
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

          {}
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
                      <button 
                        onClick={loadAllData}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Data
                      </button>
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.username || student.name || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.section || 'N/A'}</td>
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
                                {students.find(s => s.id === parent.studentId)?.username || students.find(s => s.id === parent.studentId)?.name || 'N/A'}
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
                    <h2 className="text-xl font-bold text-gray-900">Marksheet Management</h2>
                    <button
                      onClick={() => {
                        setShowMarksheetForm(!showMarksheetForm);
                        if (!showMarksheetForm) {
                          resetMarksheetWorkflow();
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Create New Marksheet
                    </button>
                  </div>

                  {showMarksheetForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
                    >
                      {}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-gray-900">Create Marksheet</h3>
                          <button
                            onClick={resetMarksheetWorkflow}
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                          >
                            ✕
                          </button>
                        </div>
                        
                        {}
                        <div className="flex items-center justify-between mb-8">
                          {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                marksheetStep === step 
                                  ? 'bg-blue-600 text-white' 
                                  : marksheetStep > step 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-200 text-gray-500'
                              }`}>
                                {marksheetStep > step ? <Check className="h-4 w-4" /> : step}
                              </div>
                              {step < 4 && (
                                <div className={`w-16 h-1 mx-2 ${
                                  marksheetStep > step ? 'bg-green-600' : 'bg-gray-200'
                                }`}></div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {}
                        {marksheetStep === 1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <h4 className="text-lg font-semibold text-gray-900">Step 1: Select Class and Section</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                <select
                                  value={marksheetData.class}
                                  onChange={(e) => setMarksheetData({ ...marksheetData, class: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Select Class</option>
                                  {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                                <select
                                  value={marksheetData.section}
                                  onChange={(e) => setMarksheetData({ ...marksheetData, section: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Select Section</option>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={handleClassSectionSelect}
                                disabled={!marksheetData.class || !marksheetData.section}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          </motion.div>
                        )}
                        
                        {}
                        {marksheetStep === 2 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <h4 className="text-lg font-semibold text-gray-900">Step 2: Select Exam Type</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {[
                                { id: 'unit_test_1', name: 'Unit Test 1', maxMarks: 20 },
                                { id: 'unit_test_2', name: 'Unit Test 2', maxMarks: 20 },
                                { id: 'unit_test_3', name: 'Unit Test 3', maxMarks: 20 },
                                { id: 'half_yearly', name: 'Half Yearly', maxMarks: 100 },
                                { id: 'final_exam', name: 'Final Exam', maxMarks: 100 }
                              ].map((exam) => (
                                <div
                                  key={exam.id}
                                  onClick={() => setMarksheetData({ ...marksheetData, examType: exam.id })}
                                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    marksheetData.examType === exam.id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <h5 className="font-medium text-gray-900">{exam.name}</h5>
                                  <p className="text-sm text-gray-500">Max Marks: {exam.maxMarks}</p>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between">
                              <button
                                onClick={() => setMarksheetStep(1)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                              >
                                Back
                              </button>
                              <button
                                onClick={handleExamTypeSelect}
                                disabled={!marksheetData.examType}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          </motion.div>
                        )}
                        
                        {}
                        {marksheetStep === 3 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <h4 className="text-lg font-semibold text-gray-900">Step 3: Enter Number of Students</h4>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Students (Max 50)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="50"
                                value={numberOfStudents || ''}
                                onChange={(e) => setNumberOfStudents(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter number of students"
                              />
                            </div>
                            <div className="flex justify-between">
                              <button
                                onClick={() => setMarksheetStep(2)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                              >
                                Back
                              </button>
                              <button
                                onClick={handleStudentCountSubmit}
                                disabled={!numberOfStudents || numberOfStudents > 50 || numberOfStudents < 1}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          </motion.div>
                        )}
                        
                        {}
                        {marksheetStep === 4 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <h4 className="text-lg font-semibold text-gray-900">Step 4: Enter Marks</h4>
                            
                            {}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                              <select
                                value={marksheetData.subject}
                                onChange={(e) => setMarksheetData({ ...marksheetData, subject: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Select Subject</option>
                                {getSubjectsByClass(marksheetData.class).map((subject) => (
                                  <option key={subject} value={subject}>{subject}</option>
                                ))}
                              </select>
                            </div>
                            
                            {}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                <input
                                  type="text"
                                  value={marksheetData.class}
                                  readOnly
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                                <input
                                  type="text"
                                  value={marksheetData.section}
                                  readOnly
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                              </div>
                            </div>
                            
                            {}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                              <input
                                type="text"
                                value={
                                  marksheetData.examType === 'unit_test_1' ? 'Unit Test 1' :
                                  marksheetData.examType === 'unit_test_2' ? 'Unit Test 2' :
                                  marksheetData.examType === 'unit_test_3' ? 'Unit Test 3' :
                                  marksheetData.examType === 'half_yearly' ? 'Half Yearly' :
                                  'Final Exam'
                                }
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                              />
                            </div>
                            
                            {}
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Marks (Max: {getMaxMarksByExamType(marksheetData.examType)})
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {studentMarks.map((student, index) => (
                                    <tr key={student.id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                          type="text"
                                          value={student.studentName}
                                          onChange={(e) => handleMarksEntry(index, 'studentName', e.target.value)}
                                          className="w-full px-2 py-1 border border-gray-300 rounded"
                                          placeholder="Enter student name"
                                        />
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                          type="text"
                                          value={student.admissionNumber}
                                          onChange={(e) => handleMarksEntry(index, 'admissionNumber', e.target.value)}
                                          className="w-full px-2 py-1 border border-gray-300 rounded"
                                          placeholder="Enter admission number"
                                        />
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                          type="number"
                                          min="0"
                                          max={getMaxMarksByExamType(marksheetData.examType)}
                                          value={student.marks}
                                          onChange={(e) => handleMarksEntry(index, 'marks', parseInt(e.target.value) || 0)}
                                          className="w-24 px-2 py-1 border border-gray-300 rounded"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            <div className="flex justify-between">
                              <button
                                onClick={() => setMarksheetStep(3)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                              >
                                Back
                              </button>
                              <div className="space-x-2">
                                <button
                                  onClick={saveMarks}
                                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                  Save Marks
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Result Records</h3>
                    {resultRecords.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No result records found</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {resultRecords.map((record) => (
                              <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.class}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.section}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {record.examType === 'unit_test_1' ? 'Unit Test 1' :
                                   record.examType === 'unit_test_2' ? 'Unit Test 2' :
                                   record.examType === 'unit_test_3' ? 'Unit Test 3' :
                                   record.examType === 'half_yearly' ? 'Half Yearly' :
                                   'Final Exam'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.studentCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {record.uploadedAt.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <button
                                    onClick={() => {
                                      setSelectedResultRecord(selectedResultRecord === record.id ? null : record.id);
                                    }}
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                  >
                                    {selectedResultRecord === record.id ? 'Hide' : 'View'}
                                  </button>
                                  <button
                                    onClick={exportMarksheet}
                                    className="text-green-600 hover:text-green-900 mr-3"
                                  >
                                    Export
                                  </button>
                                  <button
                                    onClick={viewAllStudentsMarksheet}
                                    className="text-purple-600 hover:text-purple-900"
                                  >
                                    View All
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
              </div>
            )}

            {activeSection === 'performance' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Entry</h2>
                  <p className="text-gray-600 mb-6">Enter student marks, attendance, and remarks for assessments.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Quick Entry</h3>
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="text-blue-100 mb-4">Enter marks for a single student or class</p>
                      <button 
                        onClick={() => {
                          setMarksheetStep(1);
                          setShowMarksheetForm(true);
                        }}
                        className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        Start Entry
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Bulk Upload</h3>
                        <FileText className="h-6 w-6" />
                      </div>
                      <p className="text-green-100 mb-4">Upload marks for multiple students via Excel</p>
                      <button 
                        onClick={() => {
                          setShowMarksheetForm(true);
                          setMarksheetStep(1);
                        }}
                        className="w-full bg-white text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-green-50 transition-colors duration-200"
                      >
                        Upload File
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Entry Guidelines</h3>
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <ul className="text-amber-100 text-sm space-y-2 mb-4">
                        <li>• Select correct class and section</li>
                        <li>• Choose appropriate exam type</li>
                        <li>• Enter valid marks within range</li>
                        <li>• Add remarks for improvement</li>
                      </ul>
                      <button className="w-full bg-white text-amber-600 font-semibold py-2 px-4 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                        View Full Guide
                      </button>
                    </div>
                  </div>
                  
                  {showMarksheetForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
                    >
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-gray-900">Performance Entry Form</h3>
                          <button
                            onClick={resetMarksheetWorkflow}
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mb-8">
                          {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                marksheetStep === step 
                                  ? 'bg-blue-600 text-white' 
                                  : marksheetStep > step 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-200 text-gray-500'
                              }`}>
                                {marksheetStep > step ? <Check className="h-4 w-4" /> : step}
                              </div>
                              {step < 4 && (
                                <div className={`w-16 h-1 mx-2 ${
                                  marksheetStep > step ? 'bg-green-600' : 'bg-gray-200'
                                }`}></div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {marksheetStep === 1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <h4 className="text-lg font-semibold text-gray-900">Step 1: Select Class and Section</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                <select
                                  value={marksheetData.class}
                                  onChange={(e) => setMarksheetData({ ...marksheetData, class: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Select Class</option>
                                  {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                                <select
                                  value={marksheetData.section}
                                  onChange={(e) => setMarksheetData({ ...marksheetData, section: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Select Section</option>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={handleClassSectionSelect}
                                disabled={!marksheetData.class || !marksheetData.section}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          </motion.div>
                        )}
                        
                        {marksheetStep === 2 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <h4 className="text-lg font-semibold text-gray-900">Step 2: Select Subject and Exam Type</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <select
                                  value={marksheetData.subject}
                                  onChange={(e) => setMarksheetData({ ...marksheetData, subject: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Select Subject</option>
                                  {getSubjectsByClass(marksheetData.class).map((subject) => (
                                    <option key={subject} value={subject}>{subject}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                                <select
                                  value={marksheetData.examType}
                                  onChange={(e) => setMarksheetData({ ...marksheetData, examType: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Select Exam Type</option>
                                  <option value="unit_test_1">Unit Test 1</option>
                                  <option value="unit_test_2">Unit Test 2</option>
                                  <option value="unit_test_3">Unit Test 3</option>
                                  <option value="half_yearly">Half Yearly</option>
                                  <option value="final_exam">Final Exam</option>
                                  <option value="assignment">Assignment</option>
                                  <option value="project">Project</option>
                                  <option value="practical">Practical</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <button
                                onClick={() => setMarksheetStep(1)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                              >
                                Back
                              </button>
                              <button
                                onClick={handleExamTypeSelect}
                                disabled={!marksheetData.examType || !marksheetData.subject}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          </motion.div>
                        )}
                        
                        {marksheetStep === 3 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <h4 className="text-lg font-semibold text-gray-900">Step 3: Enter Student Performance Data</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-800 font-medium">Class: {marksheetData.class}</p>
                              </div>
                              <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-800 font-medium">Section: {marksheetData.section}</p>
                              </div>
                              <div className="bg-amber-50 p-4 rounded-lg">
                                <p className="text-sm text-amber-800 font-medium">Subject: {marksheetData.subject}</p>
                              </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Marks</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {selectedClassStudents.map((student, index) => (
                                    <tr key={student.id}>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {student.username || student.name || 'N/A'}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {student.admissionNumber || 'N/A'}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <input
                                          type="number"
                                          min="0"
                                          max={getMaxMarksByExamType(marksheetData.examType)}
                                          value={marksheetData.marksData[index]?.marks || ''}
                                          onChange={(e) => {
                                            const updatedMarksData = [...marksheetData.marksData];
                                            updatedMarksData[index] = {
                                              ...updatedMarksData[index],
                                              marks: parseInt(e.target.value) || 0
                                            };
                                            setMarksheetData({ ...marksheetData, marksData: updatedMarksData });
                                          }}
                                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {getMaxMarksByExamType(marksheetData.examType)}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <select
                                          value={marksheetData.marksData[index]?.attendance || 'present'}
                                          onChange={(e) => {
                                            const updatedMarksData = [...marksheetData.marksData];
                                            updatedMarksData[index] = {
                                              ...updatedMarksData[index],
                                              attendance: e.target.value as 'present' | 'absent' | 'late'
                                            };
                                            setMarksheetData({ ...marksheetData, marksData: updatedMarksData });
                                          }}
                                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                                        >
                                          <option value="present">Present</option>
                                          <option value="absent">Absent</option>
                                          <option value="late">Late</option>
                                        </select>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <input
                                          type="text"
                                          value={marksheetData.marksData[index]?.remarks || ''}
                                          onChange={(e) => {
                                            const updatedMarksData = [...marksheetData.marksData];
                                            updatedMarksData[index] = {
                                              ...updatedMarksData[index],
                                              remarks: e.target.value
                                            };
                                            setMarksheetData({ ...marksheetData, marksData: updatedMarksData });
                                          }}
                                          className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                                          placeholder="Remarks"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            <div className="flex justify-between">
                              <button
                                onClick={() => setMarksheetStep(2)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                              >
                                Back
                              </button>
                              <div className="space-x-2">
                                <button
                                  onClick={saveMarks}
                                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Save Performance Data
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Performance Entries</h3>
                    {resultRecords.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No performance entries found</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {resultRecords.slice(0, 5).map((record) => (
                              <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.class}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.section}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {record.examType === 'unit_test_1' ? 'Unit Test 1' :
                                   record.examType === 'unit_test_2' ? 'Unit Test 2' :
                                   record.examType === 'unit_test_3' ? 'Unit Test 3' :
                                   record.examType === 'half_yearly' ? 'Half Yearly' :
                                   record.examType === 'final_exam' ? 'Final Exam' :
                                   record.examType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.studentCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {record.uploadedAt.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <button
                                    onClick={() => {
                                      setSelectedResultRecord(selectedResultRecord === record.id ? null : record.id);
                                    }}
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                  >
                                    {selectedResultRecord === record.id ? 'Hide' : 'View'}
                                  </button>
                                  <button
                                    onClick={exportMarksheet}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Export
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
              </div>
            )}

            {activeSection === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Analytics</h2>
                  <p className="text-gray-600 mb-6">View performance analytics and insights for your students.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Class Performance</h3>
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <p className="text-blue-100 mb-4">View average performance across different classes</p>
                      <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                        View Analytics
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Subject Trends</h3>
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <p className="text-green-100 mb-4">Analyze performance trends by subject</p>
                      <button className="w-full bg-white text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-green-50 transition-colors duration-200">
                        View Trends
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">At-Risk Students</h3>
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <p className="text-amber-100 mb-4">Identify students who need additional support</p>
                      <button className="w-full bg-white text-amber-600 font-semibold py-2 px-4 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                        View Alerts
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Interactive charts and analytics will appear here</p>
                          <p className="text-sm text-gray-400 mt-2">Select a class or subject to view detailed analytics</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Insights</h3>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Mathematics Performance Improving</h4>
                            <p className="text-sm text-gray-600">Class 10A showing 15% improvement in last 3 assessments</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center">
                          <div className="bg-amber-100 p-2 rounded-full mr-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">3 Students at Risk in Science</h4>
                            <p className="text-sm text-gray-600">Students with declining performance in Class 9B</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Award className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Top Performers in English</h4>
                            <p className="text-sm text-gray-600">5 students scoring above 90% consistently</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status || 'pending')}`}>
                                  {(complaint.status || 'pending').replace('-', ' ')}
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

            {activeSection === 'meetings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Meeting Management</h2>
                  <p className="text-gray-600 mb-6">Schedule and manage meetings that will be displayed on the student council dashboard.</p>
                  
                  {}
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule New Meeting</h3>
                    <form onSubmit={addMeeting} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Topic</label>
                        <input
                          type="text"
                          value={newMeeting.topic}
                          onChange={(e) => setNewMeeting({ ...newMeeting, topic: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter meeting topic"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                          <input
                            type="date"
                            value={newMeeting.date}
                            onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                          <input
                            type="time"
                            value={newMeeting.time}
                            onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meeting URL</label>
                        <input
                          type="url"
                          value={newMeeting.url}
                          onChange={(e) => setNewMeeting({ ...newMeeting, url: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={newMeeting.description}
                          onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter meeting description"
                          rows={3}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </button>
                    </form>
                  </div>
                  
                  {}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Scheduled Meetings</h3>
                    {meetings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No meetings scheduled yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {meetings.map((meeting) => (
                          <div key={meeting.id} className="p-4 rounded-lg border bg-white border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-2">{meeting.topic}</h4>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{meeting.date} at {meeting.time}</span>
                                  </div>
                                  {meeting.url && (
                                    <a 
                                      href={meeting.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                      <span className="mr-1">🔗</span>
                                      Join Meeting
                                    </a>
                                  )}
                                </div>
                                {meeting.description && (
                                  <p className="text-gray-700 mb-3">{meeting.description}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                  Scheduled on {meeting.createdAt?.toDate ? meeting.createdAt.toDate().toLocaleString() : 'N/A'}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteMeeting(meeting.id)}
                                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notices' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notices Management</h2>
                  <p className="text-gray-600 mb-6">Create and manage school notices that will be displayed on the home dashboard.</p>
                  
                  {}
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Notice</h3>
                    <form onSubmit={addNotice} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={newNotice.title}
                          onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter notice title"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <textarea
                          value={newNotice.content}
                          onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter notice content"
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select
                          value={newNotice.priority}
                          onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value as any })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="normal">Normal</option>
                          <option value="important">Important</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Publish Notice
                      </button>
                    </form>
                  </div>
                  
                  {}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Published Notices</h3>
                    {notices.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No notices published yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notices.map((notice) => (
                          <div 
                            key={notice.id} 
                            className={`p-4 rounded-lg border ${
                              notice.priority === 'urgent' 
                                ? 'bg-red-50 border-red-200' 
                                : notice.priority === 'important' 
                                  ? 'bg-yellow-50 border-yellow-200' 
                                  : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-bold text-gray-900">{notice.title}</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    notice.priority === 'urgent' 
                                      ? 'bg-red-100 text-red-800' 
                                      : notice.priority === 'important' 
                                        ? 'bg-yellow-100 text-yellow-800' 
                                        : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                                  </span>
                                </div>
                                <p className="text-gray-700 mb-2">{notice.content}</p>
                                <p className="text-sm text-gray-500">
                                  Published on {notice.createdAt?.toDate ? notice.createdAt.toDate().toLocaleString() : 'N/A'}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteNotice(notice.id)}
                                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewStaffPortal;