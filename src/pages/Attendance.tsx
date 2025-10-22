import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  Target,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const Attendance: React.FC = () => {
  // Mock data for demonstration
  const attendanceData = {
    overall: 92,
    present: 46,
    total: 50,
    trend: 'up'
  };

  const monthlyAttendance = [
    { month: 'September', percentage: 88, present: 22, total: 25 },
    { month: 'October', percentage: 92, present: 23, total: 25 },
    { month: 'November', percentage: 96, present: 24, total: 25 }
  ];

  const dailyAttendance = [
    { date: '2025-10-01', status: 'present', subject: 'Mathematics' },
    { date: '2025-10-02', status: 'present', subject: 'Physics' },
    { date: '2025-10-03', status: 'absent', subject: 'Chemistry' },
    { date: '2025-10-04', status: 'present', subject: 'Biology' },
    { date: '2025-10-05', status: 'present', subject: 'English' },
    { date: '2025-10-08', status: 'present', subject: 'Mathematics' },
    { date: '2025-10-09', status: 'present', subject: 'Physics' },
    { date: '2025-10-10', status: 'present', subject: 'Chemistry' },
    { date: '2025-10-11', status: 'present', subject: 'Biology' },
    { date: '2025-10-12', status: 'present', subject: 'English' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center">
                <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
                Attendance Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitor your attendance and punctuality
              </p>
            </div>
            <Link
              to="/student-home"
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Overall Attendance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Attendance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{attendanceData.overall}%</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${attendanceData.overall}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Days Present</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{attendanceData.present}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Out of {attendanceData.total} total days
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Trend</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {attendanceData.trend === 'up' ? 'Improving' : 'Declining'}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                attendanceData.trend === 'up' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                {attendanceData.trend === 'up' ? (
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400 rotate-180" />
                )}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {attendanceData.trend === 'up' 
                  ? 'Great job maintaining attendance!' 
                  : 'Try to improve your attendance'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Monthly Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Monthly Attendance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyAttendance.map((month, index) => (
              <div 
                key={index} 
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{month.month}</h3>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{month.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${month.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {month.present} present out of {month.total} days
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Daily Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Recent Attendance
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dailyAttendance.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{record.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{record.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.status === 'present' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <XCircle className="h-3 w-3 mr-1" />
                          Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Attendance;