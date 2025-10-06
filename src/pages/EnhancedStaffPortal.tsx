import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, updateDoc, doc, deleteDoc, addDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
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
  Video,
  Clock
} from 'lucide-react';
import { generateZohoMeetingLink } from '../utils/zohoMeeting';

interface Notification {
  id: string;
  type: 'student_login' | 'new_registration' | 'new_complaint';
  timestamp: number;
  read: boolean;
  email?: string;
  deviceName?: string;
  ipAddress?: string;
  studentName?: string;
  activityType?: string;
  class?: string;
  section?: string;
  category?: string;
}

interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  attendees: string[];
  createdAt: Date;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  createdBy: string;
}

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

interface RegistrationDoc {
  id: string;
  studentName?: string;
  class?: string;
  section?: string;
  activityType?: string;
  eligibilityCategory?: string;
}

interface ComplaintDoc {
  id: string;
  studentName?: string;
  class?: string;
  section?: string;
  email?: string;
  fatherName?: string;
  motherName?: string;
  complaint?: string;
  ipAddress?: string;
  submittedAt?: { seconds?: number } | Date;
}

interface LoginRecordDoc {
  id: string;
  email?: string;
  ipAddress?: string;
  deviceName?: string;
  timestamp?: number;
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

// Helpers to safely convert Firestore-like timestamps to milliseconds
function toMillis(input?: Date | { seconds?: number }): number {
  if (!input) return Date.now();
  if (input instanceof Date) return input.getTime();
  const seconds = (input as { seconds?: number }).seconds;
  return typeof seconds === 'number' ? seconds * 1000 : Date.now();
}

const EnhancedStaffPortal: React.FC = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'students' | 'registrations' | 'complaints' | 'meetings' | 'notices' | 'marksheets' | 'ptm'>('dashboard');

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [students, setStudents] = useState<StudentDoc[]>([]);
  const [parents, setParents] = useState<ParentDoc[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationDoc[]>([]);
  const [complaints, setComplaints] = useState<ComplaintDoc[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loginRecords, setLoginRecords] = useState<LoginRecordDoc[]>([]);
  const [marksheets, setMarksheets] = useState<any[]>([]);
  const [ptmSchedules, setPtmSchedules] = useState<PTMSchedule[]>([]);
  const [showPTMForm, setShowPTMForm] = useState(false);
  const [newPTM, setNewPTM] = useState({
    date: '',
    time: '',
    teacherIds: [] as string[],
    studentRollNumbers: '',
    title: '',
    description: ''
  });

  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showMarksheetForm, setShowMarksheetForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: ''
  });
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [marksheetData, setMarksheetData] = useState<MarksheetUpload>({
    class: '',
    section: '',
    subject: '',
    examType: '',
    marksData: []
  });
  const [selectedClassStudents, setSelectedClassStudents] = useState<StudentDoc[]>([]);

  useEffect(() => {
    if (authenticated) {
      loadAllData();
    }
  }, [authenticated]);

  const loadAllData = async () => {
    try {
      const notificationsSnap = await getDocs(
        query(collection(db, 'staffNotifications'), orderBy('timestamp', 'desc'), limit(50))
      );
      const notificationsData = notificationsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(notificationsData);

      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudentDoc[];
      
      setStudents(usersData.filter((u) => (u as { role?: string }).role === 'student'));
      setParents(usersData.filter((u) => (u as { role?: string }).role === 'parent'));

      const registrationsSnap = await getDocs(collection(db, 'registrations'));
      const registrationsData = registrationsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RegistrationDoc[];
      setRegistrations(registrationsData);

      const complaintsSnap = await getDocs(collection(db, 'complaints'));
      const complaintsData = complaintsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComplaintDoc[];
      setComplaints(complaintsData);

      const loginRecordsSnap = await getDocs(
        query(collection(db, 'loginRecords'), orderBy('timestamp', 'desc'), limit(50))
      );
      const loginRecordsData = loginRecordsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LoginRecordDoc[];
      setLoginRecords(loginRecordsData);

      const meetingsSnap = await getDocs(collection(db, 'meetings'));
      const meetingsData = meetingsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Meeting[];
      setMeetings(meetingsData);

      const noticesSnap = await getDocs(collection(db, 'notices'));
      const noticesData = noticesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Notice[];
      setNotices(noticesData);

      const marksheetsSnap = await getDocs(collection(db, 'marks'));
      const marksheetsData = marksheetsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setMarksheets(marksheetsData);

      // Load PTM schedules
      const ptmSnap = await getDocs(collection(db, 'ptm_schedule'));
      const ptmData = ptmSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      })) as PTMSchedule[];
      setPtmSchedules(ptmData);

    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'rajhans_001@gmail.com' && password === 'abhimanyu0304') {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'staffNotifications', id), { read: true });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'staffNotifications', id));
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'meetings'), {
        title: newMeeting.title,
        date: new Date(newMeeting.date),
        time: newMeeting.time,
        location: newMeeting.location,
        attendees: newMeeting.attendees.split(',').map(a => a.trim()),
        createdAt: new Date()
      });
      setShowMeetingForm(false);
      setNewMeeting({ title: '', date: '', time: '', location: '', attendees: '' });
      loadAllData();
    } catch (err) {
      console.error('Error creating meeting:', err);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'notices'), {
        title: newNotice.title,
        content: newNotice.content,
        priority: newNotice.priority,
        createdBy: 'Staff',
        createdAt: new Date()
      });
      setShowNoticeForm(false);
      setNewNotice({ title: '', content: '', priority: 'medium' });
      loadAllData();
    } catch (err) {
      console.error('Error creating notice:', err);
    }
  };

  const handleCreateMarksheet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create marks records for each student
      for (const markData of marksheetData.marksData) {
        await addDoc(collection(db, 'marks'), {
          studentId: markData.studentId,
          subject: marksheetData.subject,
          examType: marksheetData.examType,
          marks: markData.marks,
          maxMarks: markData.maxMarks,
          grade: markData.grade,
          class: marksheetData.class,
          section: marksheetData.section,
          createdAt: new Date()
        });
      }
      
      setShowMarksheetForm(false);
      setMarksheetData({
        class: '',
        section: '',
        subject: '',
        examType: '',
        marksData: []
      });
      setSelectedClassStudents([]);
      
      loadAllData();
    } catch (err) {
      console.error('Error creating marksheet:', err);
    }
  };

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

  const deleteMeeting = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'meetings', id));
      setMeetings(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting meeting:', err);
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notices', id));
      setNotices(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notice:', err);
    }
  };

  const handleCreatePTM = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Parse roll numbers, handling both commas and ranges (e.g., "1-10")
      const rollNumberInput = newPTM.studentRollNumbers.split(',').map(r => r.trim()).filter(r => r);
      const rollNumbers: string[] = [];
      
      for (const item of rollNumberInput) {
        if (item.includes('-')) {
          // Handle range format (e.g., "1-10")
          const [start, end] = item.split('-').map(Number);
          if (!isNaN(start) && !isNaN(end) && start <= end) {
            for (let i = start; i <= end; i++) {
              rollNumbers.push(i.toString());
            }
          }
        } else {
          // Handle single number
          const num = Number(item);
          if (!isNaN(num)) {
            rollNumbers.push(item);
          }
        }
      }
      
      // Get parent IDs based on roll numbers
      const parentIds: string[] = [];
      const studentIds: string[] = [];
      
      // In a real implementation, we would query the database to find parents based on roll numbers
      // For now, we'll simulate this
      for (const roll of rollNumbers) {
        // Try both padded and non-padded formats for admission numbers
        const paddedRoll = roll.padStart(3, '0');
        const admissionNumbersToTry = [`RHPS${paddedRoll}`, `RHPS${roll}`];
        
        let studentFound = false;
        for (const admissionNumber of admissionNumbersToTry) {
          if (studentFound) break;
          
          const studentQuery = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            where('admissionNumber', '==', admissionNumber)
          );
          
          const studentSnapshot = await getDocs(studentQuery);
          if (!studentSnapshot.empty) {
            studentFound = true;
            studentSnapshot.forEach(studentDoc => {
              studentIds.push(studentDoc.id);
              
              // Find parent for this student
              const parentQuery = query(
                collection(db, 'users'),
                where('role', '==', 'parent'),
                where('studentId', '==', studentDoc.id)
              );
              
              getDocs(parentQuery).then(parentSnapshot => {
                parentSnapshot.forEach(parentDoc => {
                  if (!parentIds.includes(parentDoc.id)) {
                    parentIds.push(parentDoc.id);
                  }
                });
              });
            });
          }
        }
      }
      
      // Generate Zoho meeting link
      const meetingDate = new Date(`${newPTM.date}T${newPTM.time}`);
      const zohoLink = generateZohoMeetingLink(newPTM.title, meetingDate);
      
      // Create PTM schedule
      await addDoc(collection(db, 'ptm_schedule'), {
        date: new Date(newPTM.date),
        time: newPTM.time,
        teacherIds: newPTM.teacherIds,
        parentIds: parentIds,
        studentIds: studentIds,
        zohoMeetingLink: zohoLink,
        title: newPTM.title,
        description: newPTM.description,
        createdAt: new Date()
      });
      
      setShowPTMForm(false);
      setNewPTM({
        date: '',
        time: '',
        teacherIds: [],
        studentRollNumbers: '',
        title: '',
        description: ''
      });
      
      loadAllData();
    } catch (err) {
      console.error('Error creating PTM:', err);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Portal</h1>
            <p className="text-gray-600">RHPS Public School</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              Access Portal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
                <p className="text-sm text-gray-600">RHPS Public School</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </div>
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-7 gap-4 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Shield },
            { id: 'students', label: 'Students/Parents', icon: Users },
            { id: 'registrations', label: 'Registrations', icon: FileText },
            { id: 'complaints', label: 'Complaints', icon: MessageSquare },
            { id: 'meetings', label: 'Meetings', icon: Calendar },
            { id: 'ptm', label: 'PTM Schedule', icon: Video },
            { id: 'notices', label: 'Notice Board', icon: ClipboardList },
            { id: 'marksheets', label: 'Marksheets', icon: BookOpen }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as typeof activeSection)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 text-xs ${
                activeSection === id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Parents</p>
                    <p className="text-3xl font-bold text-purple-600">{parents.length}</p>
                  </div>
                  <UserPlus className="h-10 w-10 text-purple-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Complaints</p>
                    <p className="text-3xl font-bold text-red-600">{complaints.length}</p>
                  </div>
                  <MessageSquare className="h-10 w-10 text-red-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">New Notifications</p>
                    <p className="text-3xl font-bold text-orange-600">{unreadNotifications}</p>
                  </div>
                  <Bell className="h-10 w-10 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Notifications</h2>
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notifications</p>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {notification.type === 'student_login' && (
                            <>
                              <div className="flex items-center space-x-2 mb-2">
                                <Monitor className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-900">New Student Login</h3>
                              </div>
                              <p className="text-sm text-gray-600">
                                <strong>{notification.email}</strong> logged in from {notification.deviceName}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                IP: {notification.ipAddress} • {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </>
                          )}
                          {notification.type === 'new_registration' && (
                            <>
                              <div className="flex items-center space-x-2 mb-2">
                                <FileText className="h-5 w-5 text-green-600" />
                                <h3 className="font-semibold text-gray-900">New Registration</h3>
                              </div>
                              <p className="text-sm text-gray-600">
                                <strong>{notification.studentName}</strong> registered for{' '}
                                {notification.activityType}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Class {notification.class}-{notification.section} •{' '}
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </>
                          )}
                          {notification.type === 'new_complaint' && (
                            <>
                              <div className="flex items-center space-x-2 mb-2">
                                <MessageSquare className="h-5 w-5 text-red-600" />
                                <h3 className="font-semibold text-gray-900">New Complaint</h3>
                              </div>
                              <p className="text-sm text-gray-600">
                                <strong>{notification.studentName}</strong> submitted a complaint
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Class {notification.class}-{notification.section} • {notification.email} • {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Login Records</h2>
              {loginRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No login records</p>
              ) : (
                <div className="space-y-4">
                  {loginRecords.slice(0, 10).map((record) => (
                    <div key={record.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{record.email}</p>
                          <p className="text-sm text-gray-600">
                            {record.deviceName} • IP: {record.ipAddress}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(record.timestamp ?? Date.now()).toLocaleString()}
                          </p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
                            <button className="text-red-600 hover:text-red-900">Remove</button>
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
                            <button className="text-red-600 hover:text-red-900">Remove</button>
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

        {activeSection === 'registrations' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Registrations</h2>
            {registrations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No registrations</p>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <div key={reg.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{reg.studentName}</p>
                        <p className="text-sm text-gray-600">
                          {reg.activityType} • Class {reg.class}-{reg.section}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{reg.eligibilityCategory}</p>
                      </div>
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'complaints' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Student Complaints</h2>
            {complaints.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No complaints</p>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{complaint.studentName}</p>
                        <p className="text-sm text-gray-600">
                          Class {complaint.class}-{complaint.section} • Email: {complaint.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          Father: {complaint.fatherName || 'N/A'} • Mother: {complaint.motherName || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">{complaint.complaint}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          IP: {complaint.ipAddress || 'Unknown'} •{' '}
                          {new Date(toMillis(complaint.submittedAt)).toLocaleDateString()}
                        </p>
                      </div>
                      <MessageSquare className="h-6 w-6 text-red-600" />
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Meetings</h2>
                <button
                  onClick={() => setShowMeetingForm(!showMeetingForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Schedule Meeting
                </button>
              </div>

              {showMeetingForm && (
                <form onSubmit={handleCreateMeeting} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Meeting Title"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="date"
                        value={newMeeting.date}
                        onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                      <input
                        type="time"
                        value={newMeeting.time}
                        onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Location"
                      value={newMeeting.location}
                      onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Attendees (comma separated)"
                      value={newMeeting.attendees}
                      onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Create Meeting
                    </button>
                  </div>
                </form>
              )}

              {meetings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No meetings scheduled</p>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {meeting.date?.toLocaleDateString()} at {meeting.time}
                          </p>
                          <p className="text-sm text-gray-600">{meeting.location}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Attendees: {meeting.attendees.join(', ')}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteMeeting(meeting.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'notices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Notice Board</h2>
                <button
                  onClick={() => setShowNoticeForm(!showNoticeForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Post Notice
                </button>
              </div>

              {showNoticeForm && (
                <form onSubmit={handleCreateNotice} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Notice Title"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <textarea
                      placeholder="Notice Content"
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows={4}
                      required
                    />
                    <select
                      value={newNotice.priority}
                      onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Post Notice
                    </button>
                  </div>
                </form>
              )}

              {notices.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notices posted</p>
              ) : (
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className={`p-4 rounded-lg border ${
                        notice.priority === 'high'
                          ? 'bg-red-50 border-red-200'
                          : notice.priority === 'medium'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                notice.priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : notice.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {notice.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{notice.content}</p>
                          <p className="text-xs text-gray-500">
                            Posted by {notice.createdBy} • {notice.createdAt?.toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteNotice(notice.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                        <div className="space-y-3 max-h-96 overflow-y-auto">
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
                {marksheets.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No marksheets uploaded yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {marksheets.map((marksheet) => (
                      <div key={marksheet.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{marksheet.subject}</h4>
                            <p className="text-sm text-gray-600">{marksheet.examType}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Class {marksheet.class}-{marksheet.section}
                            </p>
                          </div>
                          <BookOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {new Date(marksheet.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => deleteDoc(doc(db, 'marks', marksheet.id))}
                            className="text-red-600 hover:text-red-700"
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

        {activeSection === 'ptm' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Parent-Teacher Meetings</h2>
                <button
                  onClick={() => setShowPTMForm(!showPTMForm)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Schedule PTM
                </button>
              </div>

              {showPTMForm && (
                <form onSubmit={handleCreatePTM} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
                      <input
                        type="text"
                        value={newPTM.title}
                        onChange={(e) => setNewPTM({ ...newPTM, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter meeting title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={newPTM.description}
                        onChange={(e) => setNewPTM({ ...newPTM, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter meeting description (optional)"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={newPTM.date}
                          onChange={(e) => setNewPTM({ ...newPTM, date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input
                          type="time"
                          value={newPTM.time}
                          onChange={(e) => setNewPTM({ ...newPTM, time: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student Roll Numbers</label>
                      <input
                        type="text"
                        value={newPTM.studentRollNumbers}
                        onChange={(e) => setNewPTM({ ...newPTM, studentRollNumbers: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter roll numbers (e.g., 1-10 or 1,2,3,4)"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter roll numbers separated by commas or ranges (e.g., 1-5)</p>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </button>
                  </div>
                </form>
              )}

              {/* Display existing PTM schedules */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming PTM Schedules</h3>
                {ptmSchedules.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No PTM schedules created yet</p>
                ) : (
                  <div className="space-y-4">
                    {ptmSchedules
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((ptm) => (
                        <div key={ptm.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{ptm.title}</h4>
                              {ptm.description && (
                                <p className="text-sm text-gray-600 mt-1">{ptm.description}</p>
                              )}
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="inline-flex items-center text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(ptm.date).toLocaleDateString()}
                                </span>
                                <span className="inline-flex items-center text-sm text-gray-600">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {ptm.time}
                                </span>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Students:</span> {ptm.studentIds.length}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Parents:</span> {ptm.parentIds.length}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <a
                                href={ptm.zohoMeetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                              >
                                <Video className="h-4 w-4 mr-1" />
                                Join Meeting
                              </a>
                              <button
                                onClick={() => deleteDoc(doc(db, 'ptm_schedule', ptm.id))}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
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
  );
};

export default EnhancedStaffPortal;