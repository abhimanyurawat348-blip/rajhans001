import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FileText, 
  UserCheck, 
  BarChart3, 
  Zap, 
  Target, 
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { useDesignSystem } from '../contexts/DesignSystemContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 font-medium">{change} from last month</span>
        </div>
      )}
    </motion.div>
  );
};

const ModernDashboard: React.FC = () => {
  const { theme } = useDesignSystem();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  // Mock data for dashboard
  const stats = [
    { title: 'Overall Performance', value: '87%', icon: Award, color: 'bg-blue-500', change: '+5%' },
    { title: 'Attendance Rate', value: '92%', icon: UserCheck, color: 'bg-green-500', change: '+2%' },
    { title: 'Study Streak', value: '7 days', icon: Calendar, color: 'bg-purple-500' },
    { title: 'XP Points', value: '1,240', icon: Zap, color: 'bg-yellow-500' },
  ];

  const subjects = [
    { name: 'Mathematics', score: 92, color: 'bg-blue-500' },
    { name: 'Science', score: 88, color: 'bg-green-500' },
    { name: 'English', score: 85, color: 'bg-purple-500' },
    { name: 'Social Studies', score: 78, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your academic progress overview.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex space-x-2">
            {(['week', 'month', 'quarter'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Performance */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Subject Performance</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              View Details
            </button>
          </div>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subject.name}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{subject.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className={`h-2 rounded-full ${subject.color}`} 
                    style={{ width: `${subject.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Completed Mathematics Quiz', time: '2 hours ago', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
              { action: 'Achieved 7-day study streak', time: '1 day ago', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
              { action: 'Submitted Science Homework', time: '1 day ago', icon: FileText, color: 'bg-green-100 text-green-600' },
              { action: 'Joined Study Group', time: '2 days ago', icon: UserCheck, color: 'bg-purple-100 text-purple-600' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className={`p-2 rounded-lg ${activity.color} mr-3`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Learning Goals</h2>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', target: '95%', current: '92%', color: 'bg-blue-500' },
              { subject: 'Science', target: '90%', current: '88%', color: 'bg-green-500' },
              { subject: 'English', target: '85%', current: '85%', color: 'bg-purple-500' },
            ].map((goal, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{goal.subject}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {goal.current}% of {goal.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className={`h-2 rounded-full ${goal.color}`} 
                    style={{ width: `${(parseInt(goal.current) / parseInt(goal.target.replace('%', ''))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recommendations</h2>
          <div className="space-y-4">
            {[
              { title: 'Focus on Algebra', description: 'You scored 75% in last test. Practice more problems.', priority: 'high' },
              { title: 'Review Photosynthesis', description: 'Important topic for upcoming exam.', priority: 'medium' },
              { title: 'Join Study Group', description: 'Collaborate with peers for better understanding.', priority: 'low' },
            ].map((rec, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">{rec.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{rec.description}</p>
                <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;