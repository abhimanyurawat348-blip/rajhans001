import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  BookOpen, 
  Calendar, 
  FileText, 
  Users,
  LogOut,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Video
} from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { formatISTDateTime } from '../utils/zohoMeeting';

interface StudentData {
  id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  admissionNumber: string;
  marks?: {
    [key: string]: any;
  };
}

interface Homework {
  id: string;
  subject: string;
  title: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
}

interface AttendanceRecord {
  date: Date;
  status: 'present' | 'absent' | 'late';
}

interface Marksheet {
  id: string;
  subject: string;
  examType: string;
  marks: number;
  maxMarks: number;
  grade?: string;
}

interface PTMSchedule {
  id: string;
  date: Date;
  time: string;
  teacherIds: string[];
  parentIds: string[];
  studentIds: string[];
  zohoMeetingLink: string;
  createdAt: Date;
  title: string;
  description?: string;
}

const ParentPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    studentEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [parentData, setParentData] = useState<any>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [marksheets, setMarksheets] = useState<Marksheet[]>([]);
  const [meetingFlashcards, setMeetingFlashcards] = useState<any[]>([]);
  const [ptmSchedules, setPtmSchedules] = useState<PTMSchedule[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateStudentEmail = async (email: string): Promise<boolean> => {
    try {
      // Check if student exists in the database
      const studentQuery = query(collection(db, 'users'), where('email', '==', email), where('role', '==', 'student'));
      const studentSnapshot = await getDocs(studentQuery);
      
      if (studentSnapshot.empty) {
        return false;
      }
      
      const studentDoc = studentSnapshot.docs[0];
      setStudentData({
        id: studentDoc.id,
        name: studentDoc.data().username || 'Student',
        email: studentDoc.data().email,
        class: studentDoc.data().class || 'N/A',
        section: studentDoc.data().section || 'N/A',
        admissionNumber: studentDoc.data().admissionNumber || 'N/A'
      });
      
      return true;
    } catch (err) {
      console.error('Error validating student:', err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent, action: 'login' | 'signup') => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (action === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        // Validate student email
        const isStudentValid = await validateStudentEmail(formData.studentEmail);
        if (!isStudentValid) {
          setError('Invalid student email. Please check with the school.');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const parentData = {
          uid: userCredential.user.uid,
          email: formData.email,
          role: 'parent',
          studentId: studentData?.id,
          studentEmail: formData.studentEmail,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), parentData);
        setParentData(parentData);
        setActiveTab('dashboard');
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (!userDoc.exists()) {
          setError('User data not found. Please contact support.');
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        if (userData.role !== 'parent') {
          setError('This is a parent portal. Please use the appropriate login.');
          await signOut(auth);
          setLoading(false);
          return;
        }

        setParentData(userData);
        
        // Load student data
        if (userData.studentId) {
          const studentDoc = await getDoc(doc(db, 'users', userData.studentId));
          if (studentDoc.exists()) {
            setStudentData({
              id: studentDoc.id,
              name: studentDoc.data().username || 'Student',
              email: studentDoc.data().email,
              class: studentDoc.data().class || 'N/A',
              section: studentDoc.data().section || 'N/A',
              admissionNumber: studentDoc.data().admissionNumber || 'N/A'
            });
          }
        }
        
        setActiveTab('dashboard');
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else {
        setError('Operation failed. Please try again.');
      }
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setParentData(null);
      setStudentData(null);
      setActiveTab('login');
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        studentEmail: ''
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const loadStudentData = async () => {
    if (!studentData?.id) return;

    try {
      // Load homework
      const homeworkQuery = query(collection(db, 'homework'), where('studentId', '==', studentData.id));
      const homeworkSnapshot = await getDocs(homeworkQuery);
      const homeworkData = homeworkSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Homework[];
      setHomework(homeworkData);

      // Load attendance
      const attendanceQuery = query(collection(db, 'attendance'), where('studentId', '==', studentData.id));
      const attendanceSnapshot = await getDocs(attendanceQuery);
      const attendanceData = attendanceSnapshot.docs.map(doc => ({
        ...doc.data()
      })) as AttendanceRecord[];
      setAttendance(attendanceData);

      // Load marksheets
      const marksQuery = query(collection(db, 'marks'), where('studentId', '==', studentData.id));
      const marksSnapshot = await getDocs(marksQuery);
      const marksData = marksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Marksheet[];
      setMarksheets(marksData);

      // Load meeting flashcards
      const meetingsQuery = query(collection(db, 'parentTeacherMeetings'));
      const meetingsSnapshot = await getDocs(meetingsQuery);
      const meetingsData = meetingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMeetingFlashcards(meetingsData);

      // Load PTM schedules for this parent
      if (parentData?.id) {
        const ptmQuery = query(collection(db, 'ptm_schedule'));
        const ptmSnapshot = await getDocs(ptmQuery);
        const ptmData = ptmSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...(doc.data() as any),
            date: doc.data().date?.toDate(),
            createdAt: doc.data().createdAt?.toDate()
          }))
          .filter(ptm => {
            // Check if parentIds exists and includes the current parent
            const parentIds = (ptm as any).parentIds || [];
            return parentIds.includes(parentData.id);
          }) as PTMSchedule[];
        setPtmSchedules(ptmData);
      }
    } catch (err) {
      console.error('Error loading student data:', err);
    }
  };

  // Function to load student marks for flashcards
  const loadStudentMarksForFlashcards = async () => {
    if (!studentData?.id) return;

    try {
      // Load marks for all exam types
      const examTypes = ['unit_test_1', 'unit_test_2', 'unit_test_3', 'half_yearly', 'final_exam'];
      const marksData: any = {};

      for (const examType of examTypes) {
        const marksDoc = await getDoc(doc(db, 'students', studentData.id, 'marks', examType));
        if (marksDoc.exists()) {
          marksData[examType] = marksDoc.data();
        }
      }

      // Update state with marks data
      setStudentData(prev => prev ? {
        ...prev,
        marks: marksData
      } : null);
    } catch (err) {
      console.error('Error loading student marks:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard' && studentData?.id) {
      loadStudentData();
      loadStudentMarksForFlashcards();
    }
  }, [activeTab, studentData?.id]);

  // Helper function to get marks for a specific exam
  const getExamMarks = (examType: string) => {
    if (!studentData?.marks || !studentData.marks[examType]) return 'N/A';
    const examData = studentData.marks[examType];
    // Return the marks value
    return examData.marks || examData[examType] || 'N/A';
  };

  // Parent Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parent Portal</h1>
            <p className="text-gray-600">Welcome, Parent of {studentData?.name || 'Student'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Student Information</h2>
              {studentData ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{studentData.name}</h3>
                      <p className="text-gray-600">{studentData.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Class</p>
                      <p className="font-semibold text-gray-900">{studentData.class}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Section</p>
                      <p className="font-semibold text-gray-900">{studentData.section}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Admission No</p>
                      <p className="font-semibold text-gray-900">{studentData.admissionNumber}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Loading student information...</p>
              )}
            </div>

            {/* Attendance Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance</h2>
              {attendance.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-semibold text-gray-900">
                      {attendance.filter(a => a.status === 'present').length}/{attendance.length} days
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(attendance.filter(a => a.status === 'present').length / attendance.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-2xl font-bold text-green-600">
                        {attendance.filter(a => a.status === 'present').length}
                      </p>
                      <p className="text-xs text-gray-600">Present</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2">
                      <p className="text-2xl font-bold text-red-600">
                        {attendance.filter(a => a.status === 'absent').length}
                      </p>
                      <p className="text-xs text-gray-600">Absent</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2">
                      <p className="text-2xl font-bold text-yellow-600">
                        {attendance.filter(a => a.status === 'late').length}
                      </p>
                      <p className="text-xs text-gray-600">Late</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No attendance data available</p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Child Progress Flashcards */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Child Progress</h2>
              {studentData ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{studentData.name}</h3>
                        <p className="text-blue-100">Class {studentData.class} - Section {studentData.section}</p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-blue-200" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="bg-blue-400/20 rounded-lg p-2">
                        <p className="text-xs text-blue-100">Unit Test 1</p>
                        <p className="font-bold">{getExamMarks('unit_test_1')}/100</p>
                      </div>
                      <div className="bg-blue-400/20 rounded-lg p-2">
                        <p className="text-xs text-blue-100">Unit Test 2</p>
                        <p className="font-bold">{getExamMarks('unit_test_2')}/100</p>
                      </div>
                      <div className="bg-blue-400/20 rounded-lg p-2">
                        <p className="text-xs text-blue-100">Unit Test 3</p>
                        <p className="font-bold">{getExamMarks('unit_test_3')}/100</p>
                      </div>
                      <div className="bg-blue-400/20 rounded-lg p-2">
                        <p className="text-xs text-blue-100">Half Yearly</p>
                        <p className="font-bold">{getExamMarks('half_yearly')}/100</p>
                      </div>
                      <div className="bg-blue-400/20 rounded-lg p-2">
                        <p className="text-xs text-blue-100">Final Exam</p>
                        <p className="font-bold">{getExamMarks('final_exam')}/100</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Loading child progress...</p>
              )}
            </div>

            {/* Academic Performance */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Performance</h2>
              {marksheets.length > 0 ? (
                <div className="space-y-4">
                  {marksheets.map((marksheet) => (
                    <div key={marksheet.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-900">{marksheet.subject}</h3>
                        <span className="text-sm text-gray-600">{marksheet.examType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {marksheet.marks}/{marksheet.maxMarks}
                          </p>
                          {marksheet.grade && (
                            <p className="text-sm text-gray-600">Grade: {marksheet.grade}</p>
                          )}
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              (marksheet.marks / marksheet.maxMarks) >= 0.8 
                                ? 'bg-green-500' 
                                : (marksheet.marks / marksheet.maxMarks) >= 0.6 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`} 
                            style={{ 
                              width: `${(marksheet.marks / marksheet.maxMarks) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No academic records available</p>
              )}
            </div>

            {/* Homework Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Homework & Assignments</h2>
              {homework.length > 0 ? (
                <div className="space-y-4">
                  {homework.map((hw) => (
                    <div key={hw.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{hw.title}</h3>
                          <p className="text-sm text-gray-600">{hw.subject}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hw.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : hw.status === 'submitted' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {hw.status.charAt(0).toUpperCase() + hw.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Due: {new Date(hw.dueDate).toLocaleDateString()}
                        </p>
                        {hw.grade && (
                          <p className="text-sm font-semibold text-gray-900">Grade: {hw.grade}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No homework assignments available</p>
              )}
            </div>

            {/* Parent-Teacher Meetings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Parent-Teacher Meetings</h2>
              {ptmSchedules.length > 0 ? (
                <div className="space-y-4">
                  {ptmSchedules
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((meeting) => (
                      <motion.div
                        key={meeting.id}
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-bl-full opacity-20"></div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900">{meeting.title}</h3>
                            <Video className="h-5 w-5 text-purple-600" />
                          </div>
                          
                          {meeting.description && (
                            <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>
                          )}
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{new Date(meeting.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{formatISTDateTime(new Date(meeting.date), meeting.time)}</span>
                            </div>
                          </div>
                          
                          <a
                            href={meeting.zohoMeetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center block"
                          >
                            Join Meeting
                          </a>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming meetings scheduled</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;