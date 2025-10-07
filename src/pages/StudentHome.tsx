import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Users, 
  LogOut, 
  User, 
  Award,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import FloatingDronacharyaButton from '../components/FloatingDronacharyaButton';

interface Marksheet {
  id: string;
  unit_test_1?: number;
  unit_test_2?: number;
  unit_test_3?: number;
  half_yearly?: number;
  final_exam?: number;
  subject?: string;
  maxMarks?: number;
  marks?: number; // Added to handle the marks field
  [key: string]: any; // Allow dynamic keys
}

const StudentHome: React.FC = () => {
  const { user, logout } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [marksheets, setMarksheets] = useState<Marksheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;
      
      try {
        // Fetch student data
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          setStudentData(userDoc.data());
        }
        
        // Fetch marks data for all exam types
        const examTypes = ['unit_test_1', 'unit_test_2', 'unit_test_3', 'half_yearly', 'final_exam'];
        const marksData: Marksheet[] = [];
        
        for (const examType of examTypes) {
          const marksDoc = await getDoc(doc(db, 'students', user.id, 'marks', examType));
          if (marksDoc.exists()) {
            marksData.push({
              id: examType,
              ...marksDoc.data()
            } as Marksheet);
          }
        }
        
        setMarksheets(marksData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setLoading(false);
      }
    };

    fetchStudentData();
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

  // Function to get marks for a specific exam
  const getExamMarks = (examId: string) => {
    const examData = marksheets.find(m => m.id === examId);
    if (!examData) return 0;
    
    // Try different ways to get marks
    return examData[examId] || examData.marks || 0;
  };

  // Function to get max marks for a specific exam
  const getExamMaxMarks = (examId: string) => {
    const examData = marksheets.find(m => m.id === examId);
    return examData?.maxMarks || 100;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome, {studentData?.username || 'Student'}</p>
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
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{studentData?.username || 'Student'}</h3>
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
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Marks Dashboard */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                  Academic Performance
                </h2>
              </div>

              {marksheets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {examTypes.map((exam) => {
                    // Find marks for this exam type
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
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No marks data available</h3>
                  <p className="text-gray-500">Your marks will appear here once uploaded by your teachers.</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Class</p>
                    <p className="text-3xl font-bold mt-1">{studentData?.class || 'N/A'}</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Section</p>
                    <p className="text-3xl font-bold mt-1">{studentData?.section || 'N/A'}</p>
                  </div>
                  <Award className="h-10 w-10 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Performance</p>
                    <p className="text-3xl font-bold mt-1">
                      {marksheets.length > 0 
                        ? Math.round(marksheets.reduce((acc, mark) => {
                            const examMarks = getExamMarks(mark.id);
                            const maxMarks = getExamMaxMarks(mark.id);
                            return acc + calculatePercentage(Number(examMarks), maxMarks);
                          }, 0) / marksheets.length) || 'N/A'
                        : 'N/A'}%
                    </p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-purple-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingDronacharyaButton />
    </div>
  );
};

export default StudentHome;