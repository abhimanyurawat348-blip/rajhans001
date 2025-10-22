import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  Users,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  getClassAttendanceTrends,
  getStudentAttendanceTrends
} from '../utils/attendanceAnalytics';

interface AttendanceHeatmapProps {
  selectedClass: string;
  selectedSection: string;
  students: any[];
}

interface HeatmapCell {
  date: string;
  day: string;
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'no_record';
  value: number;
}

interface WeeklyAttendance {
  week: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

const AttendanceHeatmap: React.FC<AttendanceHeatmapProps> = ({ 
  selectedClass, 
  selectedSection,
  students
}) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Generate mock heatmap data for demonstration
        // In a real implementation, this would fetch actual attendance data
        const today = new Date();
        const heatmap: HeatmapCell[] = [];
        
        // Generate data for the last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          students.forEach(student => {
            // Randomly generate attendance status for demonstration
            const statuses: ('present' | 'absent' | 'late' | 'excused' | 'no_record')[] = 
              ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'absent', 'late', 'excused', 'no_record'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            let value = 0;
            if (randomStatus === 'present') value = 1;
            else if (randomStatus === 'late') value = 0.5;
            else if (randomStatus === 'absent') value = 0;
            
            heatmap.push({
              date: dateStr,
              day: dayName,
              studentId: student.id,
              studentName: student.fullName || student.username || 'Unknown Student',
              status: randomStatus,
              value
            });
          });
        }
        
        setHeatmapData(heatmap);
        
        // Generate weekly attendance data
        const weeks: WeeklyAttendance[] = [];
        for (let i = 4; i >= 0; i--) {
          const weekStart = new Date(today);
          weekStart.setDate(weekStart.getDate() - (i * 7));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
          
          // Generate mock data
          const present = Math.floor(Math.random() * 30) + 70; // 70-99%
          const absent = 100 - present;
          const late = Math.floor(Math.random() * 10); // 0-9%
          
          weeks.push({
            week: weekLabel,
            present,
            absent,
            late,
            total: 100
          });
        }
        
        setWeeklyData(weeks);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedClass && selectedSection && students.length > 0) {
      fetchData();
    }
  }, [selectedClass, selectedSection, students]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10b981'; // green
      case 'absent': return '#ef4444'; // red
      case 'late': return '#f59e0b'; // amber
      case 'excused': return '#3b82f6'; // blue
      default: return '#e5e7eb'; // gray
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'excused': return 'Excused';
      default: return 'No Record';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'absent': return <XCircle className="h-3 w-3 text-red-600" />;
      case 'late': return <Clock className="h-3 w-3 text-yellow-600" />;
      case 'excused': return <CheckCircle className="h-3 w-3 text-blue-600" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter data for selected student if any
  const filteredHeatmapData = selectedStudent 
    ? heatmapData.filter(cell => cell.studentId === selectedStudent)
    : heatmapData;

  // Group data by date for heatmap visualization
  const groupedByDate = filteredHeatmapData.reduce((acc, cell) => {
    if (!acc[cell.date]) {
      acc[cell.date] = [];
    }
    acc[cell.date].push(cell);
    return acc;
  }, {} as Record<string, HeatmapCell[]>);

  // Prepare data for weekly attendance chart
  const weeklyChartData = weeklyData.map(week => ({
    name: week.week,
    present: week.present,
    absent: week.absent,
    late: week.late
  }));

  return (
    <div className="space-y-6">
      {/* Header with student filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-purple-500" />
          Attendance Heatmap - Class {selectedClass}{selectedSection}
        </h3>
        
        <div className="mt-2 md:mt-0">
          <select
            value={selectedStudent || ''}
            onChange={(e) => setSelectedStudent(e.target.value || null)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Students</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.fullName || student.username || 'Unknown Student'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Heatmap Visualization */}
      <div className="bg-white rounded-xl shadow p-6">
        <h4 className="font-medium text-gray-900 mb-4">Daily Attendance Heatmap</h4>
        
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Absent</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Late</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Excused</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">No Record</span>
              </div>
            </div>
            
            {/* Heatmap grid */}
            <div className="grid grid-cols-31 gap-1">
              {/* Header row with dates */}
              <div className="text-xs text-gray-500 text-center p-1"></div>
              {Object.keys(groupedByDate).map(date => (
                <div key={date} className="text-xs text-gray-500 text-center p-1" title={new Date(date).toLocaleDateString()}>
                  {new Date(date).getDate()}
                </div>
              ))}
              
              {/* Student rows */}
              {students.map(student => {
                if (selectedStudent && student.id !== selectedStudent) return null;
                
                return (
                  <React.Fragment key={student.id}>
                    <div className="text-xs text-gray-700 text-center p-1 truncate" title={student.fullName || student.username}>
                      {(student.fullName || student.username || 'S').substring(0, 3)}
                    </div>
                    {Object.keys(groupedByDate).map(date => {
                      const cell = groupedByDate[date].find(c => c.studentId === student.id);
                      return (
                        <div 
                          key={`${student.id}-${date}`}
                          className="w-4 h-4 rounded-sm flex items-center justify-center"
                          style={{ backgroundColor: cell ? getStatusColor(cell.status) : '#e5e7eb' }}
                          title={`${student.fullName || student.username}: ${cell ? getStatusLabel(cell.status) : 'No Record'} - ${new Date(date).toLocaleDateString()}`}
                        >
                          {cell && getStatusIcon(cell.status)}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Attendance Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
          Weekly Attendance Overview
        </h4>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    present: 'Present',
                    absent: 'Absent',
                    late: 'Late'
                  };
                  return [`${value}%`, labels[name] || name];
                }}
                labelFormatter={(value) => `Week: ${value}`}
              />
              <Bar dataKey="present" name="Present" stackId="a">
                {weeklyChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#10b981" />
                ))}
              </Bar>
              <Bar dataKey="late" name="Late" stackId="a">
                {weeklyChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#f59e0b" />
                ))}
              </Bar>
              <Bar dataKey="absent" name="Absent" stackId="a">
                {weeklyChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#ef4444" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Class Summary */}
      <div className="bg-white rounded-xl shadow p-6">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <Users className="h-4 w-4 mr-2 text-green-500" />
          Class Attendance Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">87%</div>
            <div className="text-sm text-gray-600">Average Attendance</div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">92%</div>
            <div className="text-sm text-gray-600">On-time Rate</div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <div className="text-sm text-gray-600">Late Entries</div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-sm text-gray-600">Absent Students</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeatmap;