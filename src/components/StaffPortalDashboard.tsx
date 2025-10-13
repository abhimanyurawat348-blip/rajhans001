import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useComplaints } from '../contexts/ComplaintContext';
import { useRegistrations } from '../contexts/RegistrationContext';
import { read, utils, writeFile } from 'xlsx';
import { getDeviceInfo, getDeviceType } from '../utils/deviceUtils';
import { getClientIP } from '../utils/ipUtils';
import { exportToCSV } from '../utils/exportUtils';
import {
  Users,
  FileText,
  MessageSquare,
  Bell,
  Calendar,
  ClipboardList,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  BarChart2,
  BookOpen,
  Upload,
  Check,
  X,
  Plus,
  Edit,
  Save,
  ExternalLink
} from 'lucide-react';


interface Student {
  id: string;
  fullName: string;
  email: string;
  class: string;
  section: string;
  admissionNumber: string;
  rollNumber?: string;
  schoolName?: string;
  ipAddress?: string;
  deviceInfo?: string;
  createdAt?: Date;
}

interface Complaint {
  id: string;
  studentName: string;
  email: string;
  class: string;
  section: string;
  ipAddress?: string;
  deviceInfo?: string;
  title: string;
  description: string;
  submittedAt: Date;
  status: 'pending' | 'resolved' | 'in-progress';
  category: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  venue?: string;
  dateTime: Date;
  targetAudience: string;
  priority: 'normal' | 'important' | 'urgent';
  createdAt: Date;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue?: string;
  meetingUrl?: string;
  participants: string;
  createdAt: Date;
}

interface Registration {
  id: string;
  studentName: string;
  class: string;
  section: string;
  activity: string;
  registrationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  contactDetails: string;
}

interface MarksheetEntry {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  rollNumber: string;
  marks: number;
  maxMarks: number;
}

interface SubjectMarks {
  [subject: string]: MarksheetEntry[];
}


interface StudentMarksEntry {
  id: string;
  name: string;
  rollNumber: string;
  admissionNumber: string;
  subjects: { [subject: string]: { marks: number; maxMarks: number } };
}

const StaffPortalDashboard: React.FC = () => {
  const { complaints, loadComplaints, updateComplaintStatus, deleteComplaint } = useComplaints();
  const { registrations, loadRegistrations, updateRegistrationStatus, deleteRegistration } = useRegistrations();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'students' | 'complaints' | 'classes' | 'results' | 'notices' | 'meetings' | 'registrations'
  >('dashboard');
  
  
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  
  
  const [examType, setExamType] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marksData, setMarksData] = useState<SubjectMarks>({});
  const [showMarksEntry, setShowMarksEntry] = useState(false);
  
  
  const [enhancedResultsMode, setEnhancedResultsMode] = useState(false);
  const [studentEntries, setStudentEntries] = useState<StudentMarksEntry[]>([]);
  const [currentStudent, setCurrentStudent] = useState({
    name: '',
    rollNumber: '',
    admissionNumber: ''
  });
  const [classForMarks, setClassForMarks] = useState('');
  const [sectionForMarks, setSectionForMarks] = useState('');
  const [examTypeForMarks, setExamTypeForMarks] = useState('');
  
  
  const [notices, setNotices] = useState<Notice[]>([]);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    venue: '',
    dateTime: '',
    targetAudience: 'all',
    priority: 'normal' as 'normal' | 'important' | 'urgent'
  });
  
  
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    meetingUrl: '',
    participants: 'all'
  });
  
  
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ loading: false, message: '', error: false });
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);

  
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'student'));
      const usersSnapshot = await getDocs(usersQuery);
      const studentsData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Student));
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      
      
      const noticesQuery = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      const noticesSnapshot = await getDocs(noticesQuery);
      const noticesData = noticesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notice));
      setNotices(noticesData);
      
      
      const meetingsQuery = query(collection(db, 'meetings'), orderBy('date', 'desc'));
      const meetingsSnapshot = await getDocs(meetingsQuery);
      const meetingsData = meetingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Meeting));
      setMeetings(meetingsData);
      
      
      loadComplaints();
      loadRegistrations();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [loadComplaints, loadRegistrations]);

  
  useEffect(() => {
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (classFilter) {
      filtered = filtered.filter(student => student.class === classFilter);
    }
    
    if (sectionFilter) {
      filtered = filtered.filter(student => student.section === sectionFilter);
    }
    
    setFilteredStudents(filtered);
  }, [students, searchTerm, classFilter, sectionFilter]);

  
  const loadStudentsByClassSection = async (classValue: string, sectionValue: string) => {
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
      } as Student));
      
      setClassStudents(studentsData);
    } catch (error) {
      console.error('Error loading students by class/section:', error);
    }
  };

  
  const handleClassSectionSelect = () => {
    if (selectedClass && selectedSection) {
      loadStudentsByClassSection(selectedClass, selectedSection);
      
      
      const classNum = parseInt(selectedClass);
      let classSubjects: string[] = [];
      
      if (classNum >= 1 && classNum <= 2) {
        classSubjects = ['English', 'Hindi', 'Mathematics', 'EVS', 'Art/Craft', 'PE'];
      } else if (classNum >= 3 && classNum <= 5) {
        classSubjects = ['English', 'Hindi', 'Mathematics', 'EVS', 'Science', 'Social Science', 'Art', 'PE'];
      } else if (classNum >= 6 && classNum <= 8) {
        classSubjects = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer/IT', 'Art/Music', 'PE', 'Third Language'];
      } else if (classNum >= 9 && classNum <= 10) {
        classSubjects = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer/IT', 'PE', 'Work Education'];
      } else if (classNum >= 11 && classNum <= 12) {
        
        classSubjects = ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Physical Education'];
      }
      
      setSubjects(classSubjects);
      setShowMarksEntry(true);
    }
  };

  
  const initializeMarksData = (subject: string) => {
    const initialMarksData: MarksheetEntry[] = classStudents.map(student => ({
      studentId: student.id,
      studentName: student.fullName,
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber || '',
      marks: 0,
      maxMarks: 100
    }));
    
    setMarksData(prev => ({
      ...prev,
      [subject]: initialMarksData
    }));
  };

  
  const updateStudentMarks = (subject: string, studentIndex: number, marks: number) => {
    setMarksData(prev => {
      const updatedSubjectData = [...(prev[subject] || [])];
      updatedSubjectData[studentIndex] = {
        ...updatedSubjectData[studentIndex],
        marks: Math.max(0, Math.min(updatedSubjectData[studentIndex].maxMarks, marks))
      };
      
      return {
        ...prev,
        [subject]: updatedSubjectData
      };
    });
  };

  
  const saveMarks = async () => {
    try {
      setLoading(true);
      
      
      for (const [subject, subjectMarks] of Object.entries(marksData)) {
        for (const studentMarks of subjectMarks) {
          await addDoc(collection(db, 'students', studentMarks.studentId, 'marks'), {
            examType,
            subject,
            marks: studentMarks.marks,
            maxMarks: studentMarks.maxMarks,
            class: selectedClass,
            section: selectedSection,
            uploadedAt: new Date(),
            uploadedBy: 'staff'
          });
        }
      }
      
      alert('Marks saved successfully!');
      setShowMarksEntry(false);
      setMarksData({});
    } catch (error) {
      console.error('Error saving marks:', error);
      alert('Error saving marks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const exportStudentsToExcel = () => {
    const data = filteredStudents.map(student => ({
      'Student Name': student.fullName,
      'Class': student.class,
      'Section': student.section,
      'Admission Number': student.admissionNumber,
      'Roll Number': student.rollNumber || '',
      'School Name': student.schoolName || 'RHPS',
      'IP Address': student.ipAddress || '',
      'Email': student.email
    }));
    
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Students');
    writeFile(wb, 'students.xlsx');
  };

  
  const removeStudent = async (studentId: string) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        
        await updateDoc(doc(db, 'users', studentId), {
          status: 'removed',
          removedAt: new Date()
        });
        
        
        loadAllData();
        alert('Student removed successfully!');
      } catch (error) {
        console.error('Error removing student:', error);
        alert('Error removing student. Please try again.');
      }
    }
  };

  
  const addNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'notices'), {
        ...newNotice,
        createdAt: new Date(),
        dateTime: new Date(newNotice.dateTime)
      });
      
      setNewNotice({
        title: '',
        content: '',
        venue: '',
        dateTime: '',
        targetAudience: 'all',
        priority: 'normal'
      });
      
      
      const noticesQuery = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      const noticesSnapshot = await getDocs(noticesQuery);
      const noticesData = noticesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notice));
      setNotices(noticesData);
      
      alert('Notice added successfully!');
    } catch (error) {
      console.error('Error adding notice:', error);
      alert('Error adding notice. Please try again.');
    }
  };

  
  const deleteNotice = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await deleteDoc(doc(db, 'notices', id));
        
        
        const noticesQuery = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
        const noticesSnapshot = await getDocs(noticesQuery);
        const noticesData = noticesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Notice));
        setNotices(noticesData);
        
        alert('Notice deleted successfully!');
      } catch (error) {
        console.error('Error deleting notice:', error);
        alert('Error deleting notice. Please try again.');
      }
    }
  };

  
  const addStudentEntry = () => {
    if (currentStudent.name && currentStudent.rollNumber) {
      const newStudent: StudentMarksEntry = {
        id: Date.now().toString(),
        name: currentStudent.name,
        rollNumber: currentStudent.rollNumber,
        admissionNumber: currentStudent.admissionNumber,
        subjects: {}
      };
      
      setStudentEntries([...studentEntries, newStudent]);
      setCurrentStudent({ name: '', rollNumber: '', admissionNumber: '' });
    }
  };

  
  const addSubjectMarks = (studentId: string, subject: string, marks: number, maxMarks: number) => {
    setStudentEntries(prev => prev.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          subjects: {
            ...student.subjects,
            [subject]: { marks, maxMarks }
          }
        };
      }
      return student;
    }));
  };

  
  const removeStudentEntry = (studentId: string) => {
    setStudentEntries(prev => prev.filter(student => student.id !== studentId));
  };

  
  const saveAllMarks = async () => {
    try {
      setLoading(true);
      
      
      for (const student of studentEntries) {
        for (const [subject, marksData] of Object.entries(student.subjects)) {
          
          const studentQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            where('fullName', '==', student.name),
            where('class', '==', classForMarks),
            where('section', '==', sectionForMarks)
          );
          
          const studentSnapshot = await getDocs(studentQuery);
          
          if (!studentSnapshot.empty) {
            const studentDoc = studentSnapshot.docs[0];
            
            await addDoc(collection(db, 'students', studentDoc.id, 'marks'), {
              examType: examTypeForMarks,
              subject,
              marks: marksData.marks,
              maxMarks: marksData.maxMarks,
              class: classForMarks,
              section: sectionForMarks,
              uploadedAt: new Date(),
              uploadedBy: 'staff'
            });
          }
        }
      }
      
      alert('All marks saved successfully!');
      setEnhancedResultsMode(false);
      setStudentEntries([]);
      setClassForMarks('');
      setSectionForMarks('');
      setExamTypeForMarks('');
    } catch (error) {
      console.error('Error saving marks:', error);
      alert('Error saving marks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const exportMarksToExcel = () => {
    if (studentEntries.length === 0) {
      alert('No data to export');
      return;
    }

    
    const allSubjects = Array.from(
      new Set(studentEntries.flatMap(student => Object.keys(student.subjects)))
    );

    
    const exportData = studentEntries.map(student => {
      const rowData: any = {
        'Student Name': student.name,
        'Roll Number': student.rollNumber,
        'Admission Number': student.admissionNumber
      };

      
      allSubjects.forEach(subject => {
        const subjectMarks = student.subjects[subject];
        if (subjectMarks) {
          rowData[`${subject} (${subjectMarks.maxMarks})`] = `${subjectMarks.marks}/${subjectMarks.maxMarks}`;
        } else {
          rowData[`${subject} (100)`] = '';
        }
      });

      return rowData;
    });

    
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Marks');
    writeFile(wb, `marks_${classForMarks}_${sectionForMarks}_${examTypeForMarks}.xlsx`);
  };

  
  const addMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'meetings'), {
        ...newMeeting,
        createdAt: new Date()
      });
      
      setNewMeeting({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        meetingUrl: '',
        participants: 'all'
      });
      
      
      const meetingsQuery = query(collection(db, 'meetings'), orderBy('date', 'desc'));
      const meetingsSnapshot = await getDocs(meetingsQuery);
      const meetingsData = meetingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Meeting));
      setMeetings(meetingsData);
      
      alert('Meeting added successfully!');
    } catch (error) {
      console.error('Error adding meeting:', error);
      alert('Error adding meeting. Please try again.');
    }
  };

  
  const deleteMeeting = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await deleteDoc(doc(db, 'meetings', id));
        
        
        const meetingsQuery = query(collection(db, 'meetings'), orderBy('date', 'desc'));
        const meetingsSnapshot = await getDocs(meetingsQuery);
        const meetingsData = meetingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Meeting));
        setMeetings(meetingsData);
        
        alert('Meeting deleted successfully!');
      } catch (error) {
        console.error('Error deleting meeting:', error);
        alert('Error deleting meeting. Please try again.');
      }
    }
  };

  
  const exportComplaintsToExcel = () => {
    const data = complaints.map(complaint => ({
      'Complaint ID': complaint.id,
      'Student Name': complaint.studentName,
      'Email': complaint.email,
      'Class': complaint.class,
      'Section': complaint.section,
      'IP Address': complaint.ipAddress || '',
      'Device Name': complaint.ipAddress || '',
      'Complaint Title': complaint.studentName,
      'Complaint Description': complaint.complaint,
      'Submitted At': complaint.submittedAt.toLocaleString(),
      'Status': complaint.status
    }));
    
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Complaints');
    writeFile(wb, 'complaints.xlsx');
  };

  
  const exportRegistrationsToExcel = () => {
    const data = registrations.map(reg => ({
      'Student Name': reg.studentName,
      'Class': reg.class,
      'Section': reg.section,
      'Activity/Sport/Event': reg.activityType,
      'Registration Date': reg.registeredAt.toLocaleString(),
      'Status': reg.status,
      'Contact Details': `${reg.fatherName}, ${reg.motherName}`
    }));
    
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Registrations');
    writeFile(wb, 'registrations.xlsx');
  };

  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'results', label: 'Results', icon: FileText },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'registrations', label: 'Registrations', icon: ClipboardList }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome, Teacher
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-2xl font-semibold text-gray-900">{students.length}</p>
                    </div>
                  </div>
                </div>
                
                {}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                      <p className="text-2xl font-semibold text-gray-900">{complaints.length}</p>
                    </div>
                  </div>
                </div>
                
                {}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Complaints</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {complaints.filter(c => c.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                {}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Bell className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Notices</p>
                      <p className="text-2xl font-semibold text-gray-900">{notices.length}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {complaints.slice(0, 5).map(complaint => (
                    <div key={complaint.id} className="flex items-start">
                      <div className="flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{complaint.studentName}</p>
                        <p className="text-sm text-gray-500">
                          {complaint.studentName} • {complaint.submittedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {}
          {activeTab === 'students' && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
                <button
                  onClick={exportStudentsToExcel}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Export to Excel</span>
                </button>
              </div>
              
              {}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, admission number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      value={classFilter}
                      onChange={(e) => setClassFilter(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Classes</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                      value={sectionFilter}
                      onChange={(e) => setSectionFilter(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Sections</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setClassFilter('');
                        setSectionFilter('');
                      }}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
                
                {}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.fullName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.section}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.admissionNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.schoolName || 'RHPS'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.ipAddress || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => removeStudent(student.id)}
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
                
                {filteredStudents.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No students found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {}
          {activeTab === 'complaints' && (
            <motion.div
              key="complaints"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Complaints Management</h2>
                <button
                  onClick={exportComplaintsToExcel}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Export to Excel</span>
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {complaints.map((complaint) => (
                        <tr key={complaint.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.id.substring(0, 8)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.studentName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.class}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.section}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.ipAddress || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.ipAddress || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.studentName}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{complaint.complaint}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {complaint.submittedAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateComplaintStatus(complaint.id, 'under-consideration')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteComplaint(complaint.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {complaints.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No complaints found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {}
          {activeTab === 'classes' && (
            <motion.div
              key="classes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Class Management</h2>
              
              <div className="bg-white rounded-xl shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose a section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={handleClassSectionSelect}
                  disabled={!selectedClass || !selectedSection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Show Students
                </button>
                
                {classStudents.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Class {selectedClass} - Section {selectedSection} ({classStudents.length} students)
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Details</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {classStudents.map((student) => (
                            <tr key={student.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.fullName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.admissionNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {}
          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Results Management</h2>
              
              {!enhancedResultsMode ? (
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Select Mode</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {}
                    <div 
                      className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      onClick={() => {
                        setEnhancedResultsMode(false);
                        setShowMarksEntry(false);
                      }}
                    >
                      <h4 className="text-md font-semibold text-gray-900 mb-2">Subject-wise Entry</h4>
                      <p className="text-gray-600 text-sm mb-4">Enter marks for one subject at a time</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Use Subject-wise Entry
                      </button>
                    </div>
                    
                    {}
                    <div 
                      className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                      onClick={() => {
                        setEnhancedResultsMode(true);
                        setShowMarksEntry(false);
                      }}
                    >
                      <h4 className="text-md font-semibold text-gray-900 mb-2">Student-wise Entry</h4>
                      <p className="text-gray-600 text-sm mb-4">Enter marks for all subjects per student</p>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Use Student-wise Entry
                      </button>
                    </div>
                  </div>
                  
                  {}
                  {!enhancedResultsMode && showMarksEntry && (
                    <div className="mt-6">
                      {}
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Enter Marks for Class {selectedClass} - Section {selectedSection}
                        </h3>
                        <button
                          onClick={() => setShowMarksEntry(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
                        <div className="flex space-x-2">
                          <select
                            value={selectedSubject}
                            onChange={(e) => {
                              setSelectedSubject(e.target.value);
                              if (e.target.value && !marksData[e.target.value]) {
                                initializeMarksData(e.target.value);
                              }
                            }}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Choose a subject</option>
                            {subjects.map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              if (selectedSubject && !marksData[selectedSubject]) {
                                initializeMarksData(selectedSubject);
                              }
                            }}
                            disabled={!selectedSubject || !!marksData[selectedSubject]}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {selectedSubject && marksData[selectedSubject] && (
                        <div className="mb-6">
                          <h4 className="text-md font-medium text-gray-900 mb-4">{selectedSubject} Marks</h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Number</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {marksData[selectedSubject].map((student, index) => (
                                  <tr key={student.studentId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.admissionNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <input
                                        type="number"
                                        min="0"
                                        max={student.maxMarks}
                                        value={student.marks}
                                        onChange={(e) => updateStudentMarks(selectedSubject, index, parseInt(e.target.value) || 0)}
                                        className="w-24 rounded-lg border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                      <span className="text-gray-500 ml-2">/ {student.maxMarks}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setShowMarksEntry(false);
                            setMarksData({});
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveMarks}
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Marks
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {}
                  {!showMarksEntry && !enhancedResultsMode && (
                    <div className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                          <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Choose a section</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                          <select
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select exam type</option>
                            <option value="unit_test_1">Unit Test 1</option>
                            <option value="unit_test_2">Unit Test 2</option>
                            <option value="unit_test_3">Unit Test 3</option>
                            <option value="half_yearly">Half Yearly</option>
                            <option value="final_exam">Final Exam</option>
                          </select>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleClassSectionSelect}
                        disabled={!selectedClass || !selectedSection || !examType}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Proceed to Marks Entry
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Student-wise Marks Entry</h3>
                    <button
                      onClick={() => setEnhancedResultsMode(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {}
                  {!classForMarks || !sectionForMarks || !examTypeForMarks ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                        <select
                          value={classForMarks}
                          onChange={(e) => setClassForMarks(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          value={sectionForMarks}
                          onChange={(e) => setSectionForMarks(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Choose a section</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                        <select
                          value={examTypeForMarks}
                          onChange={(e) => setExamTypeForMarks(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select exam type</option>
                          <option value="unit_test_1">Unit Test 1</option>
                          <option value="unit_test_2">Unit Test 2</option>
                          <option value="unit_test_3">Unit Test 3</option>
                          <option value="half_yearly">Half Yearly</option>
                          <option value="final_exam">Final Exam</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <>
                      {}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="text-md font-medium text-gray-900 mb-3">Add Student</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Student Name</label>
                            <input
                              type="text"
                              value={currentStudent.name}
                              onChange={(e) => setCurrentStudent({...currentStudent, name: e.target.value})}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter student name"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Roll Number</label>
                            <input
                              type="text"
                              value={currentStudent.rollNumber}
                              onChange={(e) => setCurrentStudent({...currentStudent, rollNumber: e.target.value})}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter roll number"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Admission Number</label>
                            <input
                              type="text"
                              value={currentStudent.admissionNumber}
                              onChange={(e) => setCurrentStudent({...currentStudent, admissionNumber: e.target.value})}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter admission number"
                            />
                          </div>
                          
                          <div className="flex items-end">
                            <button
                              onClick={addStudentEntry}
                              disabled={!currentStudent.name || !currentStudent.rollNumber}
                              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
                            >
                              Add Student
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {}
                      {studentEntries.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-md font-medium text-gray-900 mb-4">Enter Subject Marks</h4>
                          
                          {studentEntries.map((student) => (
                            <div key={student.id} className="border border-gray-200 rounded-lg mb-4">
                              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                                <div>
                                  <span className="font-medium">{student.name}</span>
                                  <span className="text-gray-600 text-sm ml-2">(Roll: {student.rollNumber})</span>
                                </div>
                                <button
                                  onClick={() => removeStudentEntry(student.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {}
                                  {(() => {
                                    const classNum = parseInt(classForMarks);
                                    let classSubjects: string[] = [];
                                    
                                    if (classNum >= 1 && classNum <= 2) {
                                      classSubjects = ['English', 'Hindi', 'Mathematics', 'EVS', 'Art/Craft', 'PE'];
                                    } else if (classNum >= 3 && classNum <= 5) {
                                      classSubjects = ['English', 'Hindi', 'Mathematics', 'EVS', 'Science', 'Social Science', 'Art', 'PE'];
                                    } else if (classNum >= 6 && classNum <= 8) {
                                      classSubjects = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer/IT', 'Art/Music', 'PE', 'Third Language'];
                                    } else if (classNum >= 9 && classNum <= 10) {
                                      classSubjects = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer/IT', 'PE', 'Work Education'];
                                    } else if (classNum >= 11 && classNum <= 12) {
                                      classSubjects = ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Physical Education'];
                                    }
                                    
                                    return classSubjects.map(subject => {
                                      const subjectMarks = student.subjects[subject] || { marks: 0, maxMarks: 100 };
                                      return (
                                        <div key={subject} className="flex items-center space-x-2">
                                          <span className="text-sm font-medium text-gray-700 w-24 truncate">{subject}:</span>
                                          <input
                                            type="number"
                                            min="0"
                                            max={subjectMarks.maxMarks}
                                            value={subjectMarks.marks}
                                            onChange={(e) => addSubjectMarks(student.id, subject, parseInt(e.target.value) || 0, subjectMarks.maxMarks)}
                                            className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          />
                                          <span className="text-gray-500 text-sm">/</span>
                                          <input
                                            type="number"
                                            min="1"
                                            value={subjectMarks.maxMarks}
                                            onChange={(e) => addSubjectMarks(student.id, subject, subjectMarks.marks, parseInt(e.target.value) || 100)}
                                            className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          />
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {}
                      <div className="flex justify-between">
                        <button
                          onClick={() => {
                            setEnhancedResultsMode(false);
                            setStudentEntries([]);
                            setClassForMarks('');
                            setSectionForMarks('');
                            setExamTypeForMarks('');
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        
                        <div className="space-x-3">
                          <button
                            onClick={exportMarksToExcel}
                            disabled={studentEntries.length === 0}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                          >
                            <Download className="h-4 w-4 inline mr-1" />
                            Export to Excel
                          </button>
                          
                          <button
                            onClick={saveAllMarks}
                            disabled={studentEntries.length === 0 || loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save All Marks
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {}
          {activeTab === 'notices' && (
            <motion.div
              key="notices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Notices Management</h2>
              
              {}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Notice</h3>
                <form onSubmit={addNotice} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notice Title</label>
                      <input
                        type="text"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={newNotice.priority}
                        onChange={(e) => setNewNotice({...newNotice, priority: e.target.value as any})}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="important">Important</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description/Content</label>
                    <textarea
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue (Optional)</label>
                      <input
                        type="text"
                        value={newNotice.venue}
                        onChange={(e) => setNewNotice({...newNotice, venue: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <input
                        type="datetime-local"
                        value={newNotice.dateTime}
                        onChange={(e) => setNewNotice({...newNotice, dateTime: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                      <select
                        value={newNotice.targetAudience}
                        onChange={(e) => setNewNotice({...newNotice, targetAudience: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Students</option>
                        <option value="class">Specific Class</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Notice
                    </button>
                  </div>
                </form>
              </div>
              
              {}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Notices</h3>
                <div className="space-y-4">
                  {notices.map(notice => (
                    <div key={notice.id} className={`border rounded-lg p-4 ${
                      notice.priority === 'urgent' ? 'border-red-200 bg-red-50' :
                      notice.priority === 'important' ? 'border-yellow-200 bg-yellow-50' :
                      'border-gray-200 bg-white'
                    }`}>
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{notice.title}</h4>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            notice.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            notice.priority === 'important' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                          </span>
                          <button
                            onClick={() => deleteNotice(notice.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2">{notice.content}</p>
                      <div className="flex justify-between mt-3 text-sm text-gray-500">
                        <span>{notice.venue && `Venue: ${notice.venue}`}</span>
                        <span>{new Date(notice.dateTime).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {notices.length === 0 && (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No notices found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {}
          {activeTab === 'meetings' && (
            <motion.div
              key="meetings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Meetings Management</h2>
              
              {}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Meeting</h3>
                <form onSubmit={addMeeting} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                      <input
                        type="text"
                        value={newMeeting.title}
                        onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={newMeeting.date}
                        onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={newMeeting.time}
                        onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                      <select
                        value={newMeeting.participants}
                        onChange={(e) => setNewMeeting({...newMeeting, participants: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Students</option>
                        <option value="class">Specific Class</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newMeeting.description}
                      onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue (Optional)</label>
                      <input
                        type="text"
                        value={newMeeting.venue}
                        onChange={(e) => setNewMeeting({...newMeeting, venue: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meeting URL (Optional)</label>
                      <input
                        type="url"
                        value={newMeeting.meetingUrl}
                        onChange={(e) => setNewMeeting({...newMeeting, meetingUrl: e.target.value})}
                        placeholder="https://meet.google.com/..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Schedule Meeting
                    </button>
                  </div>
                </form>
              </div>
              
              {}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Meetings</h3>
                <div className="space-y-4">
                  {meetings.map(meeting => (
                    <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                        <button
                          onClick={() => deleteMeeting(meeting.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-gray-600 mt-2">{meeting.description}</p>
                      <div className="flex justify-between mt-3 text-sm text-gray-500">
                        <div>
                          <span>{meeting.venue && `Venue: ${meeting.venue}`}</span>
                          {meeting.meetingUrl && (
                            <span className="ml-4">
                              <a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                Join Meeting <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </span>
                          )}
                        </div>
                        <span>{meeting.date} at {meeting.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {meetings.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No meetings scheduled</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {}
          {activeTab === 'registrations' && (
            <motion.div
              key="registrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Registrations Management</h2>
                <button
                  onClick={exportRegistrationsToExcel}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Export to Excel</span>
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity/Sport/Event</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registrations.map(reg => (
                        <tr key={reg.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.studentName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.class}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.section}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.activityType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reg.registeredAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {reg.status ? reg.status.charAt(0).toUpperCase() + reg.status.slice(1) : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${reg.fatherName}, ${reg.motherName}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateRegistrationStatus(reg.id, 'approved')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateRegistrationStatus(reg.id, 'removed')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteRegistration(reg.id)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {registrations.length === 0 && (
                  <div className="text-center py-8">
                    <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No registrations found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StaffPortalDashboard;