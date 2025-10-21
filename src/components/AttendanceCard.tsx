import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AttendanceCardProps } from '../contexts/StudyResourcesContext';

export interface AttendanceData {
  percentage: number;
  present: number;
  total: number;
  trend: "up" | "down" | "stable";
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ attendanceData }) => {
  const getTrendIcon = () => {
    switch (attendanceData.trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'stable':
        return <Minus className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getColorClass = () => {
    if (attendanceData.percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (attendanceData.percentage >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBgColorClass = () => {
    if (attendanceData.percentage >= 90) return 'bg-green-500';
    if (attendanceData.percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Attendance</h2>
      
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {attendanceData.percentage}<span className="text-2xl">%</span>
          </div>
          <div className={`text-sm font-medium ${getColorClass()}`}>
            {attendanceData.percentage >= 90 ? 'Excellent' : 
             attendanceData.percentage >= 75 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
          <div 
            className={`h-2.5 rounded-full ${getBgColorClass()}`} 
            style={{ width: `${attendanceData.percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>Target: 90%</span>
          <span>100%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Present Days</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{attendanceData.present}</p>
        </div>
        <div className="bg-purple-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Days</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{attendanceData.total}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {attendanceData.trend === 'up' ? 'Improving' : 
             attendanceData.trend === 'down' ? 'Declining' : 'Stable'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;