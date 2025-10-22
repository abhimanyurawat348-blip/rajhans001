import React, { useState } from 'react';
import { useAttendance } from '../contexts/AttendanceContext';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck,
  Users,
  Calendar,
  Save,
  AlertTriangle
} from 'lucide-react';

interface EnhancedAttendanceMarkerProps {
  students: any[];
  selectedClass: string;
  selectedSection: string;
  currentDate: Date;
  onAttendanceSaved?: () => void;
}

interface StudentAttendanceStatus {
  [studentId: string]: {
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks: string;
  };
}

const EnhancedAttendanceMarker: React.FC<EnhancedAttendanceMarkerProps> = ({ 
  students, 
  selectedClass, 
  selectedSection, 
  currentDate,
  onAttendanceSaved 
}) => {
  const { markAttendance } = useAttendance();
  const [attendanceStatus, setAttendanceStatus] = useState<StudentAttendanceStatus>({});
  const [bulkAction, setBulkAction] = useState<'present' | 'absent' | 'late' | 'excused' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize attendance status for all students
  React.useEffect(() => {
    const initialStatus: StudentAttendanceStatus = {};
    students.forEach(student => {
      initialStatus[student.id] = {
        status: 'present', // Default to present
        remarks: ''
      };
    });
    setAttendanceStatus(initialStatus);
  }, [students]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleBulkAction = (action: 'present' | 'absent' | 'late' | 'excused') => {
    setBulkAction(action);
    const updatedStatus: StudentAttendanceStatus = {};
    students.forEach(student => {
      updatedStatus[student.id] = {
        status: action,
        remarks: attendanceStatus[student.id]?.remarks || ''
      };
    });
    setAttendanceStatus(updatedStatus);
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      // Save attendance for each student
      const savePromises = students.map(async (student) => {
        const status = attendanceStatus[student.id]?.status || 'present';
        const remarks = attendanceStatus[student.id]?.remarks || '';
        
        return markAttendance({
          studentId: student.id,
          studentName: student.fullName || student.username || 'Unknown Student',
          class: selectedClass,
          section: selectedSection,
          date: currentDate,
          status,
          remarks
        });
      });
      
      await Promise.all(savePromises);
      
      if (onAttendanceSaved) {
        onAttendanceSaved();
      }
      
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error saving attendance. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'excused': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'excused': return <UserCheck className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Action Buttons */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Quick Marking Options
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleBulkAction('present')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              bulkAction === 'present' 
                ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium text-gray-900">Mark All Present</span>
          </button>
          
          <button
            onClick={() => handleBulkAction('absent')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              bulkAction === 'absent' 
                ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <XCircle className="h-8 w-8 text-red-600 mb-2" />
            <span className="font-medium text-gray-900">Mark All Absent</span>
          </button>
          
          <button
            onClick={() => handleBulkAction('late')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              bulkAction === 'late' 
                ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200' 
                : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
            }`}
          >
            <Clock className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="font-medium text-gray-900">Mark All Late</span>
          </button>
          
          <button
            onClick={() => handleBulkAction('excused')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              bulkAction === 'excused' 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <UserCheck className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium text-gray-900">Mark All Excused</span>
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-500" />
            Mark Attendance for {selectedClass}{selectedSection} - {currentDate.toLocaleDateString()}
          </h3>
          <button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const studentStatus = attendanceStatus[student.id] || { status: 'present', remarks: '' };
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-medium">
                            {student.fullName?.charAt(0) || student.username?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.fullName || student.username || 'Unknown Student'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Roll: {student.rollNumber || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.admissionNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {/* Toggle buttons for status */}
                        <button
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`p-2 rounded-full border ${
                            studentStatus.status === 'present'
                              ? 'bg-green-100 border-green-500 text-green-700'
                              : 'border-gray-300 text-gray-500 hover:bg-green-50'
                          }`}
                          title="Present"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`p-2 rounded-full border ${
                            studentStatus.status === 'absent'
                              ? 'bg-red-100 border-red-500 text-red-700'
                              : 'border-gray-300 text-gray-500 hover:bg-red-50'
                          }`}
                          title="Absent"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`p-2 rounded-full border ${
                            studentStatus.status === 'late'
                              ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                              : 'border-gray-300 text-gray-500 hover:bg-yellow-50'
                          }`}
                          title="Late"
                        >
                          <Clock className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange(student.id, 'excused')}
                          className={`p-2 rounded-full border ${
                            studentStatus.status === 'excused'
                              ? 'bg-blue-100 border-blue-500 text-blue-700'
                              : 'border-gray-300 text-gray-500 hover:bg-blue-50'
                          }`}
                          title="Excused"
                        >
                          <UserCheck className="h-5 w-5" />
                        </button>
                        
                        {/* Status badge */}
                        <div className={`ml-2 flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(studentStatus.status)}`}>
                          {getStatusIcon(studentStatus.status)}
                          <span className="ml-1 capitalize">{studentStatus.status}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={studentStatus.remarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        placeholder="Remarks (optional)"
                        className="w-full rounded-lg border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
              <span>
                {students.length} students • 
                Present: {Object.values(attendanceStatus).filter(s => s.status === 'present').length} •
                Absent: {Object.values(attendanceStatus).filter(s => s.status === 'absent').length} •
                Late: {Object.values(attendanceStatus).filter(s => s.status === 'late').length} •
                Excused: {Object.values(attendanceStatus).filter(s => s.status === 'excused').length}
              </span>
            </div>
            <button
              onClick={handleSaveAttendance}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAttendanceMarker;