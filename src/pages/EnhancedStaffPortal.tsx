import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Bell, Users, Upload, FileText, CheckCircle, Trash2, Eye, AlertCircle } from 'lucide-react';
import { collection, getDocs, query, where, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Student {
  uid: string;
  username: string;
  admissionNumber: string;
  class: string;
  section: string;
  email: string;
  fatherName: string;
  motherName: string;
}

interface ParentNotification {
  id: string;
  type: 'parent_registration';
  parentUid: string;
  parentName: string;
  studentAdmissionNumber: string;
  timestamp: number;
  read: boolean;
}

const EnhancedStaffPortal: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'students' | 'marks' | 'notifications'>('students');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [notifications, setNotifications] = useState<ParentNotification[]>([]);
  const [marksData, setMarksData] = useState({
    studentUid: '',
    subject: '',
    unitTest1: '',
    unitTest2: '',
    unitTest3: '',
    unitTest4: '',
    halfYearly: '',
    final: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticated) {
      loadStudents();
      loadNotifications();
    }
  }, [authenticated]);

  useEffect(() => {
    if (selectedClass && selectedSection) {
      const filtered = students.filter(
        s => s.class === selectedClass && s.section === selectedSection
      );
      setFilteredStudents(filtered);
    } else if (selectedClass) {
      const filtered = students.filter(s => s.class === selectedClass);
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [selectedClass, selectedSection, students]);

  const loadStudents = async () => {
    try {
      const studentsQuery = query(collection(db, 'students'));
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentsData: Student[] = [];
      studentsSnapshot.forEach(doc => {
        studentsData.push({ ...doc.data() } as Student);
      });
      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationsQuery = query(collection(db, 'staffNotifications'));
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notificationsData: ParentNotification[] = [];
      notificationsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.type === 'parent_registration') {
          notificationsData.push({ id: doc.id, ...data } as ParentNotification);
        }
      });
      setNotifications(notificationsData.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'rajhans2019' && password === 'rajhans01') {
      setAuthenticated(true);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleUploadMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const marksId = `${marksData.studentUid}_${marksData.subject}`;
      await setDoc(doc(db, 'marks', marksId), {
        studentUid: marksData.studentUid,
        subject: marksData.subject,
        unitTest1: parseInt(marksData.unitTest1) || 0,
        unitTest2: parseInt(marksData.unitTest2) || 0,
        unitTest3: parseInt(marksData.unitTest3) || 0,
        unitTest4: parseInt(marksData.unitTest4) || 0,
        halfYearly: parseInt(marksData.halfYearly) || 0,
        final: parseInt(marksData.final) || 0,
        uploadedAt: new Date()
      });

      alert('Marks uploaded successfully!');
      setMarksData({
        studentUid: '',
        subject: '',
        unitTest1: '',
        unitTest2: '',
        unitTest3: '',
        unitTest4: '',
        halfYearly: '',
        final: ''
      });
    } catch (error) {
      console.error('Error uploading marks:', error);
      alert('Failed to upload marks');
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'staffNotifications', notificationId), {
        read: true
      });
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteStudent = async (admissionNumber: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await deleteDoc(doc(db, 'students', admissionNumber));
      await loadStudents();
      alert('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  const deleteParent = async (parentUid: string) => {
    if (!confirm('Are you sure you want to delete this parent?')) return;

    try {
      await deleteDoc(doc(db, 'parents', parentUid));
      await deleteDoc(doc(db, 'users', parentUid));
      alert('Parent deleted successfully');
    } catch (error) {
      console.error('Error deleting parent:', error);
      alert('Failed to delete parent');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Enhanced Staff Portal</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong><br />
                Username: rajhans2019<br />
                Password: rajhans01
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Staff Portal</h1>
          <p className="text-gray-600">Manage students, parents, and academic records</p>
        </motion.div>

        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'students', label: 'Student Management', icon: Users },
              { id: 'marks', label: 'Upload Marks', icon: Upload },
              { id: 'notifications', label: `Notifications ${unreadNotifications > 0 ? `(${unreadNotifications})` : ''}`, icon: Bell }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors duration-200 ${
                  activeTab === id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'students' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Filter Students</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedSection('');
                      setSelectedStudent(null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Classes</option>
                    {[3, 4, 5, 6, 7, 8, 9, 10].map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => {
                      setSelectedSection(e.target.value);
                      setSelectedStudent(null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!selectedClass}
                  >
                    <option value="">All Sections</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Students ({filteredStudents.length})
                </h2>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No students found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <div key={student.admissionNumber} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{student.username}</h3>
                          <div className="text-sm text-gray-600 mt-1 space-y-1">
                            <p>Admission No: {student.admissionNumber}</p>
                            <p>Class: {student.class}-{student.section}</p>
                            <p>Email: {student.email}</p>
                            <p>Father: {student.fatherName}</p>
                            <p>Mother: {student.motherName}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedStudent(selectedStudent?.admissionNumber === student.admissionNumber ? null : student)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>{selectedStudent?.admissionNumber === student.admissionNumber ? 'Hide' : 'View'} Details</span>
                          </button>
                          <button
                            onClick={() => deleteStudent(student.admissionNumber)}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {selectedStudent?.admissionNumber === student.admissionNumber && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-blue-50 rounded-lg"
                        >
                          <h4 className="font-semibold text-gray-900 mb-2">Student Performance Summary</h4>
                          <p className="text-sm text-gray-600">
                            View detailed marks, attendance, and homework status for this student in the marks section.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'marks' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Student Marks</h2>

            <form onSubmit={handleUploadMarks} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Admission Number
                  </label>
                  <input
                    type="text"
                    value={marksData.studentUid}
                    onChange={(e) => setMarksData({ ...marksData, studentUid: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter admission number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={marksData.subject}
                    onChange={(e) => setMarksData({ ...marksData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mathematics"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Enter Marks (out of 100)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Test 1
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksData.unitTest1}
                      onChange={(e) => setMarksData({ ...marksData, unitTest1: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Test 2
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksData.unitTest2}
                      onChange={(e) => setMarksData({ ...marksData, unitTest2: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Test 3
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksData.unitTest3}
                      onChange={(e) => setMarksData({ ...marksData, unitTest3: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Test 4
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksData.unitTest4}
                      onChange={(e) => setMarksData({ ...marksData, unitTest4: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Half-Yearly Exam
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksData.halfYearly}
                      onChange={(e) => setMarksData({ ...marksData, halfYearly: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Final Exam
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksData.final}
                      onChange={(e) => setMarksData({ ...marksData, final: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>Upload Marks</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Parent Registration Notifications</h2>
            </div>

            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">New Parent Registration</h3>
                          {!notification.read && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700">
                          Parent <strong>{notification.parentName}</strong> registered for student with admission number{' '}
                          <strong>{notification.studentAdmissionNumber}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Mark Read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedStaffPortal;
