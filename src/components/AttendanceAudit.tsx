import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Clock,
  Moon,
  Trash2,
  Download
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

interface DuplicateRecord {
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  date: Date;
  records: AttendanceRecord[];
}

interface MissingRecord {
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  date: Date;
}

const AttendanceAudit: React.FC = () => {
  const [duplicateRecords, setDuplicateRecords] = useState<DuplicateRecord[]>([]);
  const [missingRecords, setMissingRecords] = useState<MissingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [auditDate, setAuditDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Run audit
  const runAudit = async () => {
    setLoading(true);
    try {
      // Get all attendance records for the selected date
      const q = query(
        collection(db, 'attendance'),
        where('date', '==', new Date(auditDate)),
        orderBy('studentId')
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
          remarks: data.remarks,
          source: data.source,
          recordedBy: data.recordedBy,
          recordedAt: data.recordedAt?.toDate ? data.recordedAt.toDate() : data.recordedAt ? new Date(data.recordedAt) : undefined
        });
      });
      
      // Find duplicates
      const duplicates: DuplicateRecord[] = [];
      const groupedRecords: { [key: string]: AttendanceRecord[] } = {};
      
      records.forEach(record => {
        const key = `${record.studentId}-${record.date.toDateString()}`;
        if (!groupedRecords[key]) {
          groupedRecords[key] = [];
        }
        groupedRecords[key].push(record);
      });
      
      Object.keys(groupedRecords).forEach(key => {
        const records = groupedRecords[key];
        if (records.length > 1) {
          duplicates.push({
            studentId: records[0].studentId,
            studentName: records[0].studentName,
            class: records[0].class,
            section: records[0].section,
            date: records[0].date,
            records
          });
        }
      });
      
      setDuplicateRecords(duplicates);
      
      // For missing records, we would typically compare against a list of enrolled students
      // This is a simplified example - in a real implementation, you would check against
      // the students collection for each class/section
      setMissingRecords([]);
      
    } catch (error) {
      console.error('Error running audit:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Delete duplicate records, keeping only the first one
  const deleteDuplicateRecords = async (records: AttendanceRecord[]) => {
    if (!window.confirm(`Are you sure you want to delete ${records.length - 1} duplicate records?`)) {
      return;
    }
    
    try {
      const batch = writeBatch(db);
      
      // Delete all but the first record
      for (let i = 1; i < records.length; i++) {
        const recordRef = doc(db, 'attendance', records[i].id);
        batch.delete(recordRef);
      }
      
      await batch.commit();
      alert('Duplicate records deleted successfully!');
      // Re-run audit to refresh the list
      runAudit();
    } catch (error) {
      console.error('Error deleting duplicate records:', error);
      alert('Error deleting duplicate records. Please try again.');
    }
  };
  
  // Export audit results to Excel
  const exportAuditResults = () => {
    const duplicateData = duplicateRecords.map(duplicate => ({
      'Student Name': duplicate.studentName,
      'Student ID': duplicate.studentId,
      'Class': duplicate.class,
      'Section': duplicate.section,
      'Date': duplicate.date.toLocaleDateString(),
      'Duplicate Count': duplicate.records.length,
      'Record IDs': duplicate.records.map(r => r.id).join(', ')
    }));
    
    const ws = utils.json_to_sheet(duplicateData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Duplicate Records');
    writeFile(wb, `attendance_audit_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'present':
        return { icon: CheckCircle, color: 'text-green-600' };
      case 'absent':
        return { icon: XCircle, color: 'text-red-600' };
      case 'late':
        return { icon: Clock, color: 'text-yellow-600' };
      case 'excused':
        return { icon: Moon, color: 'text-blue-600' };
      default:
        return { icon: CheckCircle, color: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold text-primary flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Attendance Audit
          </h2>
        </div>
        
        <div className="card-body">
          {/* Audit Controls */}
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-tertiary mb-1">Audit Date</label>
              <input
                type="date"
                value={auditDate}
                onChange={(e) => setAuditDate(e.target.value)}
                className="input"
              />
            </div>
            
            <button
              onClick={runAudit}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Auditing...
                </>
              ) : (
                'Run Audit'
              )}
            </button>
            
            <button
              onClick={exportAuditResults}
              disabled={duplicateRecords.length === 0}
              className="btn btn-outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </button>
          </div>
          
          {/* Duplicate Records */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-warning-600" />
              Duplicate Records
            </h3>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : duplicateRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Class/Section</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Records</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {duplicateRecords.map((duplicate, index) => (
                      <motion.tr 
                        key={`${duplicate.studentId}-${duplicate.date.toDateString()}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-primary">{duplicate.studentName}</div>
                          <div className="text-sm text-tertiary">{duplicate.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                          {duplicate.class}/{duplicate.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                          {duplicate.date.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {duplicate.records.map((record, recordIndex) => {
                              const { icon: StatusIcon, color } = getStatusInfo(record.status);
                              return (
                                <div 
                                  key={record.id} 
                                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                                >
                                  <div className="flex items-center">
                                    <StatusIcon className={`h-4 w-4 ${color} mr-2`} />
                                    <span className="text-sm capitalize">{record.status}</span>
                                  </div>
                                  <div className="text-xs text-tertiary">
                                    {record.source || 'manual'} • {record.recordedBy || 'N/A'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteDuplicateRecords(duplicate.records)}
                            className="flex items-center text-error-600 hover:text-error-900"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Duplicates
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-4" />
                <p className="text-tertiary">No duplicate records found</p>
              </div>
            )}
          </div>
          
          {/* Missing Records */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-error-600" />
              Missing Records
            </h3>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : missingRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Class/Section</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {missingRecords.map((missing, index) => (
                      <motion.tr 
                        key={`${missing.studentId}-${missing.date.toDateString()}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-primary">{missing.studentName}</div>
                          <div className="text-sm text-tertiary">{missing.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                          {missing.class}/{missing.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                          {missing.date.toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-4" />
                <p className="text-tertiary">No missing records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAudit;