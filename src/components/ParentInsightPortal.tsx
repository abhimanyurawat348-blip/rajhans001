import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  BookOpen, 
  Zap, 
  Bell, 
  MessageSquare, 
  FileText, 
  User, 
  Settings,
  ChevronRight,
  Download,
  Share2,
  Filter,
  Search
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  avatar: string;
}

interface AcademicPerformance {
  subject: string;
  currentScore: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  grade: string;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
}

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'academic' | 'extracurricular' | 'behavioral';
}

const ParentInsightPortal: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'attendance' | 'assignments' | 'achievements'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  
  // Mock data
  const [students] = useState<Student[]>([
    { id: '1', name: 'Rahul Patel', class: '12', section: 'A', avatar: '' },
    { id: '2', name: 'Priya Gupta', class: '10', section: 'B', avatar: '' }
  ]);
  
  const [academicPerformance] = useState<AcademicPerformance[]>([
    { subject: 'Mathematics', currentScore: 85, previousScore: 82, trend: 'up', grade: 'A' },
    { subject: 'Science', currentScore: 78, previousScore: 80, trend: 'down', grade: 'B+' },
    { subject: 'English', currentScore: 92, previousScore: 88, trend: 'up', grade: 'A+' },
    { subject: 'Social Studies', currentScore: 88, previousScore: 85, trend: 'up', grade: 'A' },
    { subject: 'Computer Science', currentScore: 95, previousScore: 93, trend: 'up', grade: 'A+' }
  ]);
  
  const [attendanceData] = useState<AttendanceRecord[]>([
    { date: '2025-10-20', status: 'present' },
    { date: '2025-10-19', status: 'present' },
    { date: '2025-10-18', status: 'late' },
    { date: '2025-10-17', status: 'present' },
    { date: '2025-10-16', status: 'absent' },
    { date: '2025-10-15', status: 'present' },
    { date: '2025-10-14', status: 'present' }
  ]);
  
  const [assignments] = useState<Assignment[]>([
    { id: '1', subject: 'Mathematics', title: 'Algebra Assignment', dueDate: '2025-10-25', status: 'submitted', grade: 'A' },
    { id: '2', subject: 'Science', title: 'Physics Lab Report', dueDate: '2025-10-22', status: 'graded', grade: 'B+' },
    { id: '3', subject: 'English', title: 'Creative Writing', dueDate: '2025-10-30', status: 'pending' },
    { id: '4', subject: 'Social Studies', title: 'History Project', dueDate: '2025-11-05', status: 'pending' }
  ]);
  
  const [achievements] = useState<Achievement[]>([
    { id: '1', title: 'Math Quiz Winner', description: 'Scored 1st place in class math quiz', date: '2025-10-15', type: 'academic' },
    { id: '2', title: 'Science Exhibition', description: 'Participated in school science exhibition', date: '2025-10-10', type: 'extracurricular' },
    { id: '3', title: 'Perfect Attendance', description: 'Maintained 100% attendance for the month', date: '2025-10-01', type: 'behavioral' }
  ]);
  
  const getCurrentStudent = () => {
    return students.find(student => student.id === selectedStudent) || students[0];
  };
  
  const getOverallPerformance = () => {
    const total = academicPerformance.reduce((sum, subject) => sum + subject.currentScore, 0);
    return Math.round(total / academicPerformance.length);
  };
  
  const getAttendancePercentage = () => {
    const presentDays = attendanceData.filter(record => record.status === 'present').length;
    return Math.round((presentDays / attendanceData.length) * 100);
  };
  
  const getPendingAssignments = () => {
    return assignments.filter(assignment => assignment.status === 'pending').length;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <div className="h-4 w-4"></div>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Eye className="h-6 w-6 mr-2" />
              Parent Insight Portal
            </h1>
            <p className="text-blue-100 mt-1">Stay informed about your child's academic progress</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-3">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg border border-blue-400 focus:ring-2 focus:ring-blue-300"
              >
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} (Class {student.class}-{student.section})
                  </option>
                ))}
              </select>
              <button className="p-2 rounded-full hover:bg-blue-500">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Student Info */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold">
            {getCurrentStudent().name.charAt(0)}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900">{getCurrentStudent().name}</h2>
            <p className="text-gray-600">Class {getCurrentStudent().class} - Section {getCurrentStudent().section}</p>
          </div>
          <div className="ml-auto flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {(['week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Overview Stats */}
      {activeTab === 'overview' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overall Performance</p>
                  <p className="text-2xl font-bold text-gray-900">{getOverallPerformance()}%</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${getOverallPerformance()}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{getAttendancePercentage()}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-100">
              <div className="flex items-center">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{getPendingAssignments()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Achievements</p>
                  <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Academic Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Academic Performance</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                <Download className="h-4 w-4 mr-1" />
                Export Report
              </button>
            </div>
            <div className="space-y-4">
              {academicPerformance.map((subject, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-32 text-sm font-medium text-gray-900">{subject.subject}</div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{subject.currentScore}%</span>
                      <span className="text-sm font-medium text-gray-900">{subject.grade}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
                        style={{ width: `${subject.currentScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center">
                    {getTrendIcon(subject.trend)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assignments</h3>
              <div className="space-y-3">
                {assignments.slice(0, 3).map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">{assignment.subject}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                      {assignment.grade && (
                        <span className="ml-2 text-sm font-medium text-gray-900">{assignment.grade}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View All Assignments
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      {achievement.type === 'academic' && <BookOpen className="h-5 w-5 text-blue-500" />}
                      {achievement.type === 'extracurricular' && <Award className="h-5 w-5 text-green-500" />}
                      {achievement.type === 'behavioral' && <Zap className="h-5 w-5 text-amber-500" />}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View All Achievements
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Academics Tab */}
      {activeTab === 'academics' && (
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Academic Performance</h2>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button className="flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Performance</h3>
              <div className="space-y-4">
                {academicPerformance.map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-sm"
                  >
                    <div className="w-32 font-medium text-gray-900">{subject.subject}</div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-gray-900">{subject.currentScore}%</span>
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {subject.grade}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">Previous: {subject.previousScore}%</span>
                          {getTrendIcon(subject.trend)}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
                          style={{ width: `${subject.currentScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Overall Average</span>
                      <span className="font-medium text-gray-900">{getOverallPerformance()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getOverallPerformance()}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Top Performing Subject</span>
                      <span className="font-medium text-gray-900">
                        {academicPerformance.reduce((max, subject) => 
                          subject.currentScore > max.currentScore ? subject : max, 
                          academicPerformance[0]
                        ).subject}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Needs Improvement</span>
                      <span className="font-medium text-gray-900">
                        {academicPerformance.reduce((min, subject) => 
                          subject.currentScore < min.currentScore ? subject : min, 
                          academicPerformance[0]
                        ).subject}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      Focus on Science with additional practice sessions.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800">
                      Continue excelling in Computer Science and English.
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-sm text-amber-800">
                      Consider joining the Math enrichment program.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Attendance Records</h2>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by date..."
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance</h3>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for days before the first of the month */}
                {[...Array(3)].map((_, i) => (
                  <div key={`empty-${i}`} className="h-10"></div>
                ))}
                
                {/* Calendar days */}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const dateStr = `2025-10-${day < 10 ? '0' + day : day}`;
                  const record = attendanceData.find(a => a.date === dateStr);
                  
                  return (
                    <div
                      key={day}
                      className={`h-10 rounded-lg flex items-center justify-center ${
                        record?.status === 'present' 
                          ? 'bg-green-100 text-green-800' 
                          : record?.status === 'absent' 
                            ? 'bg-red-100 text-red-800' 
                            : record?.status === 'late' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center space-x-4 mt-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Late</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Days</span>
                    <span className="font-medium text-gray-900">{attendanceData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Present</span>
                    <span className="font-medium text-gray-900">
                      {attendanceData.filter(r => r.status === 'present').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Absent</span>
                    <span className="font-medium text-gray-900">
                      {attendanceData.filter(r => r.status === 'absent').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Late</span>
                    <span className="font-medium text-gray-900">
                      {attendanceData.filter(r => r.status === 'late').length}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendance Rate</span>
                      <span className="text-xl font-bold text-gray-900">{getAttendancePercentage()}%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${getAttendancePercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Records</h3>
                <div className="space-y-3">
                  {attendanceData.slice(0, 5).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Assignments & Homework</h2>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assignments..."
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Assignment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Subject</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{assignment.title}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{assignment.subject}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {assignment.grade ? (
                          <span className="font-medium text-gray-900">{assignment.grade}</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium text-gray-900">
                      {assignments.filter(a => a.status === 'graded' || a.status === 'submitted').length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(assignments.filter(a => a.status === 'graded' || a.status === 'submitted').length / assignments.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-medium text-gray-900">
                      {getPendingAssignments()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(getPendingAssignments() / assignments.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {assignments
                  .filter(a => a.status === 'pending')
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 3)
                  .map((assignment) => (
                    <div key={assignment.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <span className="text-sm text-gray-600">
                          {Math.ceil((new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{assignment.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Achievements & Recognition</h2>
            <button className="mt-4 md:mt-0 flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4 mr-1" />
              Export Certificate
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                    {achievement.type === 'academic' && <BookOpen className="h-6 w-6 text-blue-600" />}
                    {achievement.type === 'extracurricular' && <Award className="h-6 w-6 text-green-600" />}
                    {achievement.type === 'behavioral' && <Zap className="h-6 w-6 text-amber-600" />}
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {new Date(achievement.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    achievement.type === 'academic' ? 'bg-blue-100 text-blue-800' :
                    achievement.type === 'extracurricular' ? 'bg-green-100 text-green-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {achievements.filter(a => a.type === 'academic').length}
                </div>
                <div className="text-sm text-gray-600">Academic Achievements</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {achievements.filter(a => a.type === 'extracurricular').length}
                </div>
                <div className="text-sm text-gray-600">Extracurricular</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-amber-600">
                  {achievements.filter(a => a.type === 'behavioral').length}
                </div>
                <div className="text-sm text-gray-600">Behavioral</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation Tabs */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          {([
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'academics', label: 'Academics', icon: BookOpen },
            { id: 'attendance', label: 'Attendance', icon: Calendar },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'achievements', label: 'Achievements', icon: Award }
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ParentInsightPortal;