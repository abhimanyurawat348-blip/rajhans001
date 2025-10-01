import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';
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
  Monitor
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'student_login' | 'new_registration' | 'new_complaint';
  timestamp: number;
  read: boolean;
  [key: string]: unknown;
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

const NewStaffPortal: React.FC = () => {
  // const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'students' | 'registrations' | 'complaints' | 'meetings' | 'notices'>('dashboard');

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [students, setStudents] = useState<StudentDoc[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationDoc[]>([]);
  const [complaints, setComplaints] = useState<ComplaintDoc[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loginRecords, setLoginRecords] = useState<LoginRecordDoc[]>([]);

  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
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
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Shield },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'registrations', label: 'Registrations', icon: FileText },
            { id: 'complaints', label: 'Complaints', icon: MessageSquare },
            { id: 'meetings', label: 'Meetings', icon: Calendar },
            { id: 'notices', label: 'Notice Board', icon: ClipboardList }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as typeof activeSection)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ${
                activeSection === id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">{label}</span>
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
                    <p className="text-sm text-gray-600">Registrations</p>
                    <p className="text-3xl font-bold text-green-600">{registrations.length}</p>
                  </div>
                  <FileText className="h-10 w-10 text-green-600" />
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
                                {notification.category} • {new Date(notification.timestamp).toLocaleString()}
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
                            {new Date(record.timestamp).toLocaleString()}
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Registered Students</h2>
            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No students registered</p>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{student.username}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Joined: {new Date(student.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                          {new Date(complaint.submittedAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
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
      </div>
    </div>
  );
};

export default NewStaffPortal;
