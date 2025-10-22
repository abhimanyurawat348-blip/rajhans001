import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Moon,
  BarChart2,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

const MobileAttendanceView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock attendance data for demonstration
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      studentId: 'student_001',
      studentName: 'Rahul Sharma',
      class: '10',
      section: 'A',
      date: new Date(),
      status: 'present',
      remarks: 'On time'
    },
    {
      id: '2',
      studentId: 'student_002',
      studentName: 'Priya Patel',
      class: '10',
      section: 'A',
      date: new Date(),
      status: 'absent',
      remarks: 'Sick leave'
    },
    {
      id: '3',
      studentId: 'student_003',
      studentName: 'Amit Kumar',
      class: '10',
      section: 'A',
      date: new Date(),
      status: 'late',
      remarks: '5 minutes late'
    }
  ];
  
  // Filter records based on search term
  const filteredRecords = attendanceRecords.filter(record => 
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'present':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'absent':
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'late':
        return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      case 'excused':
        return { icon: Moon, color: 'text-blue-600', bgColor: 'bg-blue-100' };
      default:
        return { icon: CheckCircle, color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };
  
  // Generate calendar days for the current month
  const getCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const calendarDays = getCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Navigate to previous month
  const prevMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-primary">Attendance</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg ${viewMode === 'calendar' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              <Calendar className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              <BarChart2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-primary dark:text-white"
          />
        </div>
        
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300">Present</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">18</p>
          </div>
          <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300">Absent</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">2</p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300">Late</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">1</p>
          </div>
        </div>
      </div>
      
      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              &larr;
            </button>
            <span className="font-medium text-primary">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </span>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              &rarr;
            </button>
          </div>
          
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-12"></div>;
              }
              
              const isToday = day.toDateString() === new Date().toDateString();
              const dayRecord = attendanceRecords.find(record => 
                record.date.toDateString() === day.toDateString()
              );
              
              if (!dayRecord) {
                return (
                  <div 
                    key={index} 
                    className={`h-12 flex items-center justify-center rounded-lg ${
                      isToday ? 'bg-primary-100 dark:bg-primary-900' : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`text-sm ${isToday ? 'font-bold text-primary-600' : 'text-gray-500 dark:text-gray-400'}`}>
                      {day.getDate()}
                    </span>
                  </div>
                );
              }
              
              const { icon: StatusIcon, color, bgColor } = getStatusInfo(dayRecord.status);
              
              return (
                <div 
                  key={index} 
                  className={`h-12 flex flex-col items-center justify-center rounded-lg ${bgColor} ${
                    isToday ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <span className={`text-sm ${isToday ? 'font-bold text-primary-600' : 'text-gray-500 dark:text-gray-400'}`}>
                    {day.getDate()}
                  </span>
                  <StatusIcon className={`h-4 w-4 ${color} mt-1`} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-primary">Attendance Records</h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRecords.map((record) => {
              const { icon: StatusIcon, color, bgColor } = getStatusInfo(record.status);
              
              return (
                <div key={record.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-primary">{record.studentName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {record.class}{record.section} • {record.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`p-2 rounded-full ${bgColor}`}>
                      <StatusIcon className={`h-5 w-5 ${color}`} />
                    </div>
                  </div>
                  
                  {record.remarks && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {record.remarks}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
        <div className="flex justify-between">
          <button className="flex-1 mx-1 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">
            Mark Present
          </button>
          <button className="flex-1 mx-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">
            Mark Absent
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAttendanceView;