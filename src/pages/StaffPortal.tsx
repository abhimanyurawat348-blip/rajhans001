import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useComplaints } from '../contexts/ComplaintContext';
import { useRegistrations } from '../contexts/RegistrationContext';
import { Shield, Eye, Clock, CheckCircle, AlertTriangle, FileText, Download, Trash2, UserCheck, Camera } from 'lucide-react';
import { exportComplaintsToCSV, exportRegistrationsToCSV, exportLoginRecordsToCSV, exportLoginRecordsToPDF } from '../utils/exportUtils';
import EventGallery from '../components/EventGallery';

const StaffPortal: React.FC = () => {
  const { complaints, updateComplaintStatus, deleteComplaint, loadComplaints } = useComplaints();
  const { registrations, updateRegistrationStatus, deleteRegistration, loadRegistrations } = useRegistrations();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'complaints' | 'registrations' | 'logins' | 'gallery'>('complaints');
  const [loginRecords] = useState([
    {
      id: '1',
      email: 'student1@gmail.com',
      ipAddress: '192.168.1.100',
      loginTime: new Date(),
      otpVerified: true
    },
    {
      id: '2',
      email: 'student2@gmail.com',
      ipAddress: '192.168.1.101',
      loginTime: new Date(Date.now() - 3600000),
      otpVerified: true
    }
  ]);

  React.useEffect(() => {
    if (authenticated) {
      loadComplaints();
      loadRegistrations();
    }
  }, [authenticated]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'rajhans_001@gmail.com' && password === 'abhimanyu03*9') {
      setAuthenticated(true);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleComplaintAction = async (id: string, action: 'remove' | 'under-consideration' | 'resolved') => {
    if (action === 'remove') {
      await deleteComplaint(id);
    } else {
      await updateComplaintStatus(id, action);
    }
  };

  const handleRegistrationAction = async (id: string, action: 'remove' | 'under-consideration' | 'approved') => {
    if (action === 'remove') {
      await deleteRegistration(id);
    } else {
      await updateRegistrationStatus(id, action);
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
            <h1 className="text-2xl font-bold text-gray-900">Staff Portal Access</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in-progress':
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Portal</h1>
          <p className="text-gray-600">Manage student data and activities</p>
        </motion.div>

        {}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'complaints', label: 'Complaints', icon: FileText },
              { id: 'registrations', label: 'Registrations', icon: UserCheck },
              { id: 'logins', label: 'Login Records', icon: Shield },
              { id: 'gallery', label: 'Event Gallery', icon: Camera }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'complaints' | 'registrations' | 'logins' | 'gallery')}
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

        {}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {complaints.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">
                  {complaints.filter(c => c.status === 'under-consideration').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {complaints.filter(c => c.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registrations</p>
                <p className="text-2xl font-bold text-purple-600">{registrations.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </motion.div>
        </div>

        {}
        {activeTab === 'complaints' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Student Complaints</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportComplaintsToCSV(complaints)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => exportComplaintsToCSV(complaints)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {complaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No complaints submitted yet.</p>
              </div>
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
          </motion.div>
        )}

        {}
        {activeTab === 'registrations' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Activity Registrations</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportRegistrationsToCSV(registrations)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => exportRegistrationsToCSV(registrations)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {registrations.length === 0 ? (
              <div className="p-12 text-center">
                <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No registrations submitted yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <div key={registration.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{registration.studentName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status || 'pending')}`}>
                            {(registration.status || 'pending').replace('-', ' ')}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span>Class {registration.class}-{registration.section}</span>
                          <span className="mx-2">•</span>
                          <span>{registration.activityType}</span>
                          <span className="mx-2">•</span>
                          <span>{registration.eligibilityCategory}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(registration.registeredAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => setSelectedRegistration(selectedRegistration === registration.id ? null : registration.id)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <Eye className="h-4 w-4" />
                            <span>{selectedRegistration === registration.id ? 'Hide' : 'View'} Details</span>
                          </button>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRegistrationAction(registration.id, 'under-consideration')}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors duration-200"
                            >
                              Under Review
                            </button>
                            <button
                              onClick={() => handleRegistrationAction(registration.id, 'approved')}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors duration-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRegistrationAction(registration.id, 'remove')}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors duration-200 flex items-center space-x-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedRegistration === registration.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Date of Birth:</p>
                            <p className="text-sm text-gray-600">{new Date(registration.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Gender:</p>
                            <p className="text-sm text-gray-600">{registration.gender}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Father's Name:</p>
                            <p className="text-sm text-gray-600">{registration.fatherName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Mother's Name:</p>
                            <p className="text-sm text-gray-600">{registration.motherName}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {}
        {activeTab === 'logins' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Student Login Records</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportLoginRecordsToCSV(loginRecords)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => exportLoginRecordsToPDF(loginRecords, 'login_records_report', 'Student Login Records Report')}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {loginRecords.length === 0 ? (
              <div className="p-12 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No login records available.</p>
              </div>
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
          </motion.div>
        )}

        {}
        {activeTab === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Event Gallery</h2>
              <p className="text-gray-600 mt-1">Manage event photos and create memories for the school community</p>
            </div>
            <EventGallery />
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default StaffPortal;