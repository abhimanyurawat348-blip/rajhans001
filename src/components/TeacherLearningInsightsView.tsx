import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  BookOpen, 
  Calendar,
  Award,
  Clock,
  Zap,
  Star,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

interface StudentPerformance {
  id: string;
  name: string;
  class: string;
  section: string;
  overallScore: number;
  trend: 'up' | 'down' | 'stable';
  subjects: {
    name: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  attendance: number;
  studyHours: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ClassAnalytics {
  className: string;
  averageScore: number;
  studentCount: number;
  subjectAverages: {
    name: string;
    average: number;
  }[];
  attendanceRate: number;
  atRiskStudents: number;
}

const TeacherLearningInsightsView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformance[]>([]);
  const [classAnalytics, setClassAnalytics] = useState<ClassAnalytics | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  // Mock data for demonstration
  const mockStudentPerformance: StudentPerformance[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      class: '10',
      section: 'A',
      overallScore: 81,
      trend: 'up',
      subjects: [
        { name: 'Mathematics', score: 85, trend: 'up' },
        { name: 'Science', score: 72, trend: 'down' },
        { name: 'English', score: 90, trend: 'up' },
        { name: 'Social Studies', score: 78, trend: 'stable' }
      ],
      attendance: 92,
      studyHours: 17.5,
      riskLevel: 'low'
    },
    {
      id: '2',
      name: 'Sneha Patel',
      class: '10',
      section: 'A',
      overallScore: 87,
      trend: 'up',
      subjects: [
        { name: 'Mathematics', score: 90, trend: 'stable' },
        { name: 'Science', score: 87, trend: 'up' },
        { name: 'English', score: 82, trend: 'stable' },
        { name: 'Social Studies', score: 85, trend: 'up' }
      ],
      attendance: 96,
      studyHours: 15.2,
      riskLevel: 'low'
    },
    {
      id: '3',
      name: 'Vikash Kumar',
      class: '10',
      section: 'A',
      overallScore: 73,
      trend: 'down',
      subjects: [
        { name: 'Mathematics', score: 68, trend: 'stable' },
        { name: 'Science', score: 70, trend: 'up' },
        { name: 'English', score: 80, trend: 'up' },
        { name: 'Social Studies', score: 78, trend: 'down' }
      ],
      attendance: 84,
      studyHours: 12.8,
      riskLevel: 'medium'
    },
    {
      id: '4',
      name: 'Anjali Reddy',
      class: '10',
      section: 'A',
      overallScore: 68,
      trend: 'down',
      subjects: [
        { name: 'Mathematics', score: 65, trend: 'down' },
        { name: 'Science', score: 68, trend: 'stable' },
        { name: 'English', score: 72, trend: 'down' },
        { name: 'Social Studies', score: 70, trend: 'stable' }
      ],
      attendance: 78,
      studyHours: 10.5,
      riskLevel: 'high'
    }
  ];

  const mockClassAnalytics: ClassAnalytics = {
    className: '10A',
    averageScore: 77.25,
    studentCount: 35,
    subjectAverages: [
      { name: 'Mathematics', average: 77 },
      { name: 'Science', average: 74 },
      { name: 'English', average: 81 },
      { name: 'Social Studies', average: 77 }
    ],
    attendanceRate: 87.5,
    atRiskStudents: 5
  };

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setLoading(true);
      
      // In a real implementation, we would fetch data from Firestore:
      /*
      const studentsQuery = query(
        collection(db, 'users'),
        where('class', '==', selectedClass),
        where('section', '==', selectedSection),
        where('role', '==', 'student')
      );
      
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentsData: StudentPerformance[] = [];
      
      for (const doc of studentsSnapshot.docs) {
        const studentData = doc.data();
        // Fetch performance data for each student
        // ...
        studentsData.push(processedStudentData);
      }
      
      setStudentPerformance(studentsData);
      */
      
      // Using mock data for demonstration
      setStudentPerformance(mockStudentPerformance);
      setClassAnalytics(mockClassAnalytics);
      
      setLoading(false);
    };
    
    loadData();
  }, [selectedClass, selectedSection]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <div className="h-4 w-4"></div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Class Learning Insights</h1>
              <p className="text-gray-600">Analytics and performance overview for your students</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <button className="flex items-center px-3 py-1 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 text-sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Class Analytics */}
        {classAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Class Average</p>
                  <p className="text-3xl font-bold text-gray-900">{classAnalytics.averageScore}%</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{classAnalytics.studentCount}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{classAnalytics.attendanceRate}%</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">At-Risk Students</p>
                  <p className="text-3xl font-bold text-gray-900">{classAnalytics.atRiskStudents}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Top Subject</p>
                  <p className="text-lg font-bold text-gray-900">
                    {classAnalytics.subjectAverages.reduce((max, subject) => 
                      subject.average > max.average ? subject : max, 
                      classAnalytics.subjectAverages[0]
                    )?.name || 'N/A'}
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Averages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Subject Averages
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={classAnalytics?.subjectAverages || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Average Score']}
                    labelFormatter={(value) => `Subject: ${value}`}
                  />
                  <Bar dataKey="average" name="Average Score">
                    {classAnalytics?.subjectAverages.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.average >= 85 ? '#10b981' : entry.average >= 70 ? '#f59e0b' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Student Performance Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Performance Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Excellent (85-100)', value: studentPerformance.filter(s => s.overallScore >= 85).length },
                      { name: 'Good (70-84)', value: studentPerformance.filter(s => s.overallScore >= 70 && s.overallScore < 85).length },
                      { name: 'Needs Improvement (0-69)', value: studentPerformance.filter(s => s.overallScore < 70).length }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                  >
                    <Cell key="cell-0" fill="#10b981" />
                    <Cell key="cell-1" fill="#f59e0b" />
                    <Cell key="cell-2" fill="#ef4444" />
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Student Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Student Performance Overview
            </h2>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="quarter">Quarter</option>
                </select>
              </div>
              <button className="flex items-center px-3 py-1 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 text-sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Subjects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentPerformance.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">Class {student.class}{student.section}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.overallScore}%</div>
                      <div className="flex items-center text-sm text-gray-500">
                        {getTrendIcon(student.trend)}
                        <span className="ml-1">
                          {student.trend === 'up' ? 'Improving' : student.trend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.subjects.slice(0, 2).map((subject, idx) => (
                          <div key={idx} className="flex items-center">
                            <span>{subject.name}: {subject.score}%</span>
                            <span className="ml-2">{getTrendIcon(subject.trend)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.attendance}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.studyHours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(student.riskLevel)}`}>
                        {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Actionable Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-amber-600" />
            Class Insights & Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                At-Risk Students
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                5 students showing declining performance trends. Consider additional support sessions.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Details →
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                Subject Focus
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Science scores are 8% below target. Recommend additional practical sessions.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Details →
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                Upcoming Assessments
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Mathematics quarterly exam in 2 weeks. Schedule review sessions.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Details →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherLearningInsightsView;