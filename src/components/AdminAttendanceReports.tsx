import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, writeBatch, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  BarChart2, 
  Download, 
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Moon,
  Trash2,
  Edit,
  Save
} from 'lucide-react';
import { utils, writeFile } from 'xlsx';
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
  source?: 'manual' | 'qr' | 'biometric';
  recordedBy?: string;
  recordedAt?: Date;
}

interface ClassSummary {
  class: string;
  section: string;
  present: number;
  total: number;
  percentage: number;
}

const AdminAttendanceReports: React.FC = () => {
  // Filter states
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  
  // Data states
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [classSummaries, setClassSummaries] = useState<ClassSummary[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<'daily' | 'range'>('daily');
  
  // Load attendance records
  const loadAttendanceRecords = async () => {
    setLoading(true);
    try {
      let q;
      
      if (reportType === 'daily' && selectedDate) {
        // Load records for a specific date
        q = query(
          collection(db, 'attendance'),
          where('date', '==', new Date(selectedDate)),
          orderBy('class'),
          orderBy('section')
        );
      } else if (reportType === 'range' && dateRange.start && dateRange.end) {
        // Load records for a date range
        q = query(
          collection(db, 'attendance'),
          orderBy('date'),
          orderBy('class'),
          orderBy('section')
        );
      } else {
        // Load all records
        q = query(
          collection(db, 'attendance'),
          orderBy('date', 'desc'),
          orderBy('class'),
          orderBy('section')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const records: AttendanceRecord[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const recordDate = data.date?.toDate ? data.date.toDate() : new Date(data.date);
        
        // Filter by date range if needed
        if (reportType === 'range' && dateRange.start && dateRange.end) {
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          if (recordDate < startDate || recordDate > endDate) {
            return; // Skip this record
          }
        }
        
        records.push({
          id: doc.id,
          studentId: data.studentId,
          studentName: data.studentName,
          class: data.class,
          section: data.section,
          date: recordDate,
          status: data.status,
          remarks: data.remarks,
          source: data.source,
          recordedBy: data.recordedBy,
          recordedAt: data.recordedAt?.toDate ? data.recordedAt.toDate() : data.recordedAt ? new Date(data.recordedAt) : undefined
        });
      });
      
      setAttendanceRecords(records);
      setFilteredRecords(records);
      
      // Calculate class summaries
      calculateClassSummaries(records);
    } catch (error) {
      console.error('Error loading attendance records:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate class-wise summaries
  const calculateClassSummaries = (records: AttendanceRecord[]) => {
    const summaryMap: { [key: string]: { present: number; total: number } } = {};
    
    records.forEach(record => {
      const key = `${record.class}-${record.section}`;
      if (!summaryMap[key]) {
        summaryMap[key] = { present: 0, total: 0 };
      }
      
      summaryMap[key].total += 1;
      if (record.status === 'present' || record.status === 'late') {
        summaryMap[key].present += 1;
      }
    });
    
    const summaries: ClassSummary[] = Object.keys(summaryMap).map(key => {
      const [classId, section] = key.split('-');
      const { present, total } = summaryMap[key];
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      return {
        class: classId,
        section,
        present,
        total,
        percentage
      };
    });
    
    setClassSummaries(summaries);
  };
  
  // Filter records based on search term and filters
  useEffect(() => {
    let filtered = attendanceRecords;
    
    // Apply class filter
    if (selectedClass) {
      filtered = filtered.filter(record => record.class === selectedClass);
    }
    
    // Apply section filter
    if (selectedSection) {
      filtered = filtered.filter(record => record.section === selectedSection);
    }
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredRecords(filtered);
  }, [attendanceRecords, selectedClass, selectedSection, searchTerm]);
  
  // Export to Excel
  const exportToExcel = () => {
    const data = filteredRecords.map(record => ({
      'Date': record.date.toLocaleDateString(),
      'Student Name': record.studentName,
      'Student ID': record.studentId,
      'Class': record.class,
      'Section': record.section,
      'Status': record.status.charAt(0).toUpperCase() + record.status.slice(1),
      'Remarks': record.remarks || '',
      'Source': record.source || 'manual',
      'Recorded By': record.recordedBy || 'N/A',
      'Recorded At': record.recordedAt ? record.recordedAt.toLocaleString() : 'N/A'
    }));
    
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Attendance Reports');
    writeFile(wb, `attendance_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  // Delete attendance record
  const deleteRecord = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'attendance', recordId));
      // Reload records
      loadAttendanceRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Error deleting record. Please try again.');
    }
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

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-primary flex items-center">
            <BarChart2 className="h-6 w-6 mr-2" />
            Admin Attendance Reports
          </h2>
        </div>
        
        <div className="card-body">
          {/* Report Type Selector */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setReportType('daily')}
              className={`btn ${reportType === 'daily' ? 'btn-primary' : 'btn-outline'}`}
            >
              Daily Report
            </button>
            <button
              onClick={() => setReportType('range')}
              className={`btn ${reportType === 'range' ? 'btn-primary' : 'btn-outline'}`}
            >
              Date Range Report
            </button>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input"
              >
                <option value="">All Classes</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>{i + 1}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">Select Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="input"
              >
                <option value="">All Sections</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            
            {reportType === 'daily' ? (
              <div>
                <label className="block text-sm font-medium text-tertiary mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-tertiary mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tertiary mb-1">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="input"
                  />
                </div>
              </>
            )}
            
            <div className="flex items-end">
              <button
                onClick={loadAttendanceRecords}
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tertiary" />
              <input
                type="text"
                placeholder="Search by student name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={exportToExcel}
              disabled={filteredRecords.length === 0}
              className="btn btn-outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </button>
          </div>
          
          {/* Class Summaries */}
          {classSummaries.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-primary mb-4">Class-wise Attendance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classSummaries.map((summary, index) => (
                  <motion.div
                    key={`${summary.class}-${summary.section}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-primary rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-primary">
                        Class {summary.class} - Section {summary.section}
                      </h4>
                      <span className="text-lg font-bold text-primary">
                        {summary.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${
                          summary.percentage >= 90 ? 'bg-success-500' : 
                          summary.percentage >= 75 ? 'bg-warning-500' : 'bg-error-500'
                        }`} 
                        style={{ width: `${summary.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-tertiary">
                      <span>{summary.present} present</span>
                      <span>{summary.total} total</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Attendance Records Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Class/Section</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Remarks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRecords.map((record) => {
                    const { icon: StatusIcon, color, bgColor } = getStatusInfo(record.status);
                    
                    return (
                      <motion.tr 
                        key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                          {record.date.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-primary">{record.studentName}</div>
                          <div className="text-sm text-tertiary">{record.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                          {record.class}/{record.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {record.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-secondary">
                          {record.remarks || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                          {record.source || 'manual'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => deleteRecord(record.id)}
                              className="text-error-600 hover:text-error-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-tertiary mx-auto mb-4" />
              <p className="text-tertiary">No attendance records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceReports;