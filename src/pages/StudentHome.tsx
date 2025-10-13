import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { fetchStudentData, fetchStudentMarks } from '../utils/studentDataUtils';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Users, 
  LogOut, 
  User, 
  Award,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Edit3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import FloatingDronacharyaButton from '../components/FloatingDronacharyaButton';
import ChantingFlashcard from '../components/ChantingFlashcard';
import StudentProfileEditModal from '../components/StudentProfileEditModal';

interface Marksheet {
  id: string;
  unit_test_1?: number;
  unit_test_2?: number;
  unit_test_3?: number;
  half_yearly?: number;
  final_exam?: number;
  subject?: string;
  maxMarks?: number;
  marks?: number;
  [key: string]: any;
}

const StudentHome: React.FC = () => {
  const { user, logout } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [marksheets, setMarksheets] = useState<Marksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchStudentDataAsync = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        
        const studentResult = await fetchStudentData(user.id, user.email);
        if (studentResult.success && studentResult.data) {
          setStudentData(studentResult.data);
          
          
          const marksData = await fetchStudentMarks(
            user.id, 
            studentResult.data.admissionNumber
          );
          setMarksheets(marksData);
        } else {
          setError(studentResult.error || 'Failed to load student data');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDataAsync();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  const examTypes = [
    { id: 'unit_test_1', name: 'UT1', color: 'bg-blue-500' },
    { id: 'unit_test_2', name: 'UT2', color: 'bg-green-500' },
    { id: 'unit_test_3', name: 'UT3', color: 'bg-yellow-500' },
    { id: 'half_yearly', name: 'Half-Yearly', color: 'bg-purple-500' },
    { id: 'final_exam', name: 'Final', color: 'bg-red-500' }
  ];

  const calculatePercentage = (marks: number, maxMarks: number = 100) => {
    return Math.round((marks / maxMarks) * 100);
  };

  
  const prepareChartData = () => {
    const chartData = examTypes.map(exam => {
      const examMarks = getExamMarks(exam.id);
      const maxMarks = getExamMaxMarks(exam.id);
      const percentage = calculatePercentage(Number(examMarks), maxMarks);
      
      return {
        name: exam.name,
        marks: Number(examMarks),
        maxMarks: maxMarks,
        percentage: percentage
      };
    });
    
    return chartData;
  };

  
  
  const calculateRank = () => {
    
    
    return Math.floor(Math.random() * 50) + 1; 
  };

  
  const getExamMarks = (examId: string) => {
    const examData = marksheets.find(m => m.id === examId);
    if (!examData) return 0;
    
    
    return examData[examId] || examData.marks || 0;
  };

  
  const getExamMaxMarks = (examId: string) => {
    const examData = marksheets.find(m => m.id === examId);
    return examData?.maxMarks || 100;
  };

  const handleProfileUpdate = (updatedData: any) => {
    setStudentData(updatedData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome, {studentData?.fullName || studentData?.username || 'Student'}</p>
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
          {}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Student Information</h2>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{studentData?.fullName || studentData?.username || 'Student'}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="font-semibold text-gray-900">{studentData?.class || 'N/A'}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Section</p>
                    <p className="font-semibold text-gray-900">{studentData?.section || 'N/A'}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Admission No</p>
                    <p className="font-semibold text-gray-900">{studentData?.admissionNumber || 'N/A'}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-semibold text-gray-900">
                      {studentData?.dateOfBirth ? new Date(studentData.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cyan-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Father's Name</p>
                    <p className="font-semibold text-gray-900">{studentData?.fatherName || 'N/A'}</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Mother's Name</p>
                    <p className="font-semibold text-gray-900">{studentData?.motherName || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="lg:col-span-2 space-y-8">
            {}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                  Academic Performance (Read-Only)
                </h2>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  <span className="font-bold">Rank: #{calculateRank()}</span>
                </div>
              </div>

              {marksheets.length > 0 ? (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {examTypes.map((exam) => {
                    
                    const examMarks = getExamMarks(exam.id);
                    const maxMarks = getExamMaxMarks(exam.id);
                    
                    return (
                      <motion.div
                        key={exam.id}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-gray-900">{exam.name}</h3>
                          <div className={`w-3 h-3 rounded-full ${exam.color}`}></div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-gray-900">
                              {examMarks}
                              <span className="text-sm font-normal text-gray-500">/{maxMarks}</span>
                            </span>
                            <span className="text-lg font-semibold text-gray-700">
                              {calculatePercentage(Number(examMarks), maxMarks)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${exam.color}`}
                              style={{ width: `${calculatePercentage(Number(examMarks), maxMarks)}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Performance Chart
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareChartData()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          labelFormatter={(value) => `Exam: ${value}`}
                        />
                        <Legend />
                        <Bar dataKey="percentage" name="Percentage" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Performance Trend
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prepareChartData()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          labelFormatter={(value) => `Exam: ${value}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="percentage" 
                          name="Performance" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No marks data available</h3>
                  <p className="text-gray-500">Your marks will appear here once uploaded by your teachers.</p>
                </div>
              )}
            </div>

            {}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Wellness & Spirituality</h2>
              <ChantingFlashcard />
            </div>
          </div>
        </div>
      </div>

      <StudentProfileEditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        studentData={studentData}
        onUpdate={handleProfileUpdate}
      />

      <FloatingDronacharyaButton />
    </div>
  );
};

export default StudentHome;