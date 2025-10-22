import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Moon,
  BarChart2,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

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

const ParentAttendanceView: React.FC<{ studentId: string }> = ({ studentId }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Load attendance records for the student
  useEffect(() => {
    const loadAttendance = async () => {
      if (!studentId) return;
      
      setLoading(true);
      try {
        const q = query(
          collection(db, 'attendance'),
          where('studentId', '==', studentId),
          orderBy('date', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const records: AttendanceRecord[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          records.push({
            id: doc.id,
            studentId: data.studentId,
            studentName: data.studentName,
            class: data.class,
            section: data.section,
            date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
            status: data.status,
            remarks: data.remarks
          });
        });
        
        setAttendanceRecords(records);
      } catch (error) {
        console.error('Error loading attendance:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAttendance();
  }, [studentId]);

  // Get attendance summary for the current month
  const getMonthlySummary = () => {
    const now = new Date();
    const currentMonthRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === now.getMonth() && 
             recordDate.getFullYear() === now.getFullYear();
    });
    
    const present = currentMonthRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const total = currentMonthRecords.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { present, total, percentage };
  };

  // Get calendar data for a specific month
  const getCalendarData = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const record = attendanceRecords.find(r => {
        const recordDate = new Date(r.date);
        return recordDate.getDate() === day && 
               recordDate.getMonth() === month && 
               recordDate.getFullYear() === year;
      });
      
      calendarDays.push({
        date,
        record
      });
    }
    
    return calendarDays;
  };

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

  const summary = getMonthlySummary();
  const calendarData = getCalendarData(currentMonth, currentYear);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary">Attendance Summary</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewMode('calendar')}
                className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline'}`}
              >
                Calendar View
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
              >
                List View
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-success-100 dark:bg-success-900 rounded-full">
                  <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-tertiary">Present Days</p>
                  <p className="text-xl font-bold text-success-600 dark:text-success-400">
                    {summary.present}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-full">
                  <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-tertiary">Total Days</p>
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    {summary.total}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-warning-100 dark:bg-warning-900 rounded-full">
                  <TrendingUp className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-tertiary">Attendance Rate</p>
                  <p className="text-xl font-bold text-warning-600 dark:text-warning-400">
                    {summary.percentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-tertiary mb-1">
              <span>Attendance Progress</span>
              <span>{summary.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-success-500 h-2 rounded-full" 
                style={{ width: `${summary.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-tertiary mt-2">
              {summary.percentage >= 90 
                ? "Excellent attendance! Keep it up!" 
                : summary.percentage >= 75 
                  ? "Good attendance, but there's room for improvement." 
                  : "Attendance needs improvement. Try to be more regular."}
            </p>
          </div>
        </div>
      </div>
      
      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-primary">Calendar View</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={prevMonth}
                  className="btn btn-outline btn-sm"
                >
                  &larr;
                </button>
                <span className="font-medium">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button 
                  onClick={nextMonth}
                  className="btn btn-outline btn-sm"
                >
                  &rarr;
                </button>
              </div>
            </div>
          </div>
          
          <div className="card-body">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-tertiary py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarData.map((day, index) => {
                    if (!day) {
                      return <div key={index} className="h-16"></div>;
                    }
                    
                    const { date, record } = day;
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    if (!record) {
                      return (
                        <div 
                          key={index} 
                          className={`h-16 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center ${
                            isToday ? 'bg-primary-50 dark:bg-primary-900/30' : ''
                          }`}
                        >
                          <span className={`text-sm ${isToday ? 'font-bold text-primary-600' : 'text-tertiary'}`}>
                            {date.getDate()}
                          </span>
                        </div>
                      );
                    }
                    
                    const { icon: StatusIcon, color, bgColor } = getStatusInfo(record.status);
                    
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className={`h-16 border border-gray-200 dark:border-gray-700 rounded flex flex-col items-center justify-center p-1 ${
                          bgColor
                        } ${isToday ? 'ring-2 ring-primary-500' : ''}`}
                      >
                        <span className={`text-xs ${isToday ? 'font-bold text-primary-600' : 'text-tertiary'}`}>
                          {date.getDate()}
                        </span>
                        <StatusIcon className={`h-4 w-4 ${color} mt-1`} />
                        {record.remarks && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-blue-500"></div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-tertiary">Present</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-sm text-tertiary">Absent</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-yellow-600 mr-1" />
                    <span className="text-sm text-tertiary">Late</span>
                  </div>
                  <div className="flex items-center">
                    <Moon className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm text-tertiary">Excused</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold text-primary">Attendance List</h3>
          </div>
          
          <div className="card-body">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : attendanceRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {attendanceRecords.map((record) => {
                      const recordDate = new Date(record.date);
                      const dayName = recordDate.toLocaleDateString('en-US', { weekday: 'short' });
                      const { icon: StatusIcon, color } = getStatusInfo(record.status);
                      
                      return (
                        <motion.tr 
                          key={record.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            {recordDate.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                            {dayName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <StatusIcon className={`h-4 w-4 ${color} mr-2`} />
                              <span className="capitalize">{record.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary">
                            {record.remarks || 'N/A'}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-tertiary mx-auto mb-4" />
                <p className="text-tertiary">No attendance records found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentAttendanceView;