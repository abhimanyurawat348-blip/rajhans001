import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  Bell, 
  X, 
  CheckCircle,
  XCircle,
  Clock,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AttendanceAlert {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  date: Date;
  status: 'absent' | 'late';
  consecutiveDays?: number;
  parentId?: string;
  parentEmail?: string;
  notified: boolean;
  notifiedAt?: Date;
}

const AttendanceNotifications: React.FC = () => {
  const [alerts, setAlerts] = useState<AttendanceAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Load attendance alerts
  const loadAttendanceAlerts = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would check for:
      // 1. Students marked as absent
      // 2. Students marked as late multiple times
      // 3. Students with consecutive absences
      
      // For this example, we'll simulate some alerts
      const mockAlerts: AttendanceAlert[] = [
        {
          id: '1',
          studentId: 'student_001',
          studentName: 'Rahul Sharma',
          class: '10',
          section: 'A',
          date: new Date(),
          status: 'absent',
          consecutiveDays: 3,
          parentId: 'parent_001',
          parentEmail: 'rahul.parent@gmail.com',
          notified: false
        },
        {
          id: '2',
          studentId: 'student_002',
          studentName: 'Priya Patel',
          class: '9',
          section: 'B',
          date: new Date(),
          status: 'late',
          parentId: 'parent_002',
          parentEmail: 'priya.parent@gmail.com',
          notified: false
        }
      ];
      
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading attendance alerts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Send notification to parent
  const sendNotification = async (alert: AttendanceAlert) => {
    try {
      // In a real implementation, this would:
      // 1. Send an email/SMS to the parent
      // 2. Update the alert record to mark it as notified
      // 3. Record the notification timestamp
      
      // For this example, we'll just update the local state
      setAlerts(prev => prev.map(a => 
        a.id === alert.id ? { ...a, notified: true, notifiedAt: new Date() } : a
      ));
      
      window.alert(`Notification sent to ${alert.parentEmail}`);
    } catch (error) {
      console.error('Error sending notification:', error);
      window.alert('Error sending notification. Please try again.');
    }
  };
  
  // Dismiss notification
  const dismissNotification = async (alertId: string) => {
    try {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };
  
  // Get status icon and color
  const getStatusInfo = (status: string, consecutiveDays?: number) => {
    if (status === 'absent') {
      if (consecutiveDays && consecutiveDays >= 3) {
        return { 
          icon: XCircle, 
          color: 'text-error-600', 
          bgColor: 'bg-error-100',
          message: `Absent for ${consecutiveDays} consecutive days`
        };
      }
      return { 
        icon: XCircle, 
        color: 'text-error-600', 
        bgColor: 'bg-error-100',
        message: 'Absent today'
      };
    } else {
      return { 
        icon: Clock, 
        color: 'text-warning-600', 
        bgColor: 'bg-warning-100',
        message: 'Late today'
      };
    }
  };
  
  // Load alerts when component mounts
  useEffect(() => {
    loadAttendanceAlerts();
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Notification Button */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </button>
      
      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-primary">Attendance Alerts</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : alerts.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {alerts.map((alert) => {
                    const { icon: StatusIcon, color, bgColor, message } = getStatusInfo(alert.status, alert.consecutiveDays);
                    
                    return (
                      <div key={alert.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className={`p-2 rounded-full ${bgColor}`}>
                              <StatusIcon className={`h-5 w-5 ${color}`} />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-primary">{alert.studentName}</h4>
                              <p className="text-sm text-tertiary">
                                Class {alert.class}{alert.section} • {message}
                              </p>
                              <p className="text-xs text-tertiary mt-1">
                                {alert.date.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => dismissNotification(alert.id)}
                            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => sendNotification(alert)}
                            disabled={alert.notified}
                            className={`flex-1 flex items-center justify-center px-3 py-1 text-sm rounded ${
                              alert.notified 
                                ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-200' 
                                : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                          >
                            {alert.notified ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Notified
                              </>
                            ) : (
                              'Send Alert'
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-tertiary mx-auto mb-4" />
                  <p className="text-tertiary">No attendance alerts</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceNotifications;