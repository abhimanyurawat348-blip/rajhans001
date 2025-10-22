import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Zap, 
  FileText, 
  UserCheck, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Map,
  Beaker,
  Crown,
  LogOut,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UnifiedSidebar from '../components/UnifiedSidebar';
import StudentAttendanceDashboard from '../components/StudentAttendanceDashboard';

const StudentHome: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-primary">
      <UnifiedSidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">
              Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <div className="text-2xl font-bold text-primary">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-tertiary">
                  {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-error btn-md"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome back, Student!</h2>
              <p className="text-primary-100 mb-6">Ready to continue your learning journey today?</p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/flashcards')}
                  className="btn btn-primary btn-lg"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Review Flashcards
                </button>
                <button 
                  onClick={() => navigate('/learning-insights')}
                  className="btn btn-outline btn-lg text-white border-white hover:bg-white/10"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Insights
                </button>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="card-body flex-between">
                  <div>
                    <p className="text-sm text-tertiary">Today's Progress</p>
                    <p className="text-2xl font-bold text-primary">75%</p>
                  </div>
                  <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                    <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div className="px-md pb-md">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body flex-between">
                  <div>
                    <p className="text-sm text-tertiary">This Week</p>
                    <p className="text-2xl font-bold text-primary">12 hrs</p>
                  </div>
                  <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full">
                    <Calendar className="h-6 w-6 text-success-600 dark:text-success-400" />
                  </div>
                </div>
                <div className="px-md pb-md">
                  <p className="text-sm text-tertiary">+2 hrs from last week</p>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body flex-between">
                  <div>
                    <p className="text-sm text-tertiary">Streak</p>
                    <p className="text-2xl font-bold text-primary">7 days</p>
                  </div>
                  <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full">
                    <Award className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                  </div>
                </div>
                <div className="px-md pb-md">
                  <p className="text-sm text-tertiary">Keep it up!</p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-2xl font-bold text-primary">Quick Actions</h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => navigate('/study-resources')}
                    className="flex flex-col items-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2" />
                    <span className="font-medium text-primary">Study Resources</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/homework')}
                    className="flex flex-col items-center p-6 bg-success-50 dark:bg-success-900/20 rounded-xl hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
                  >
                    <FileText className="h-8 w-8 text-success-600 dark:text-success-400 mb-2" />
                    <span className="font-medium text-primary">Homework</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/attendance')}
                    className="flex flex-col items-center p-6 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors"
                  >
                    <UserCheck className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mb-2" />
                    <span className="font-medium text-primary">Attendance</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/results')}
                    className="flex flex-col items-center p-6 bg-warning-50 dark:bg-warning-900/20 rounded-xl hover:bg-warning-100 dark:hover:bg-warning-900/30 transition-colors"
                  >
                    <Award className="h-8 w-8 text-warning-600 dark:text-warning-400 mb-2" />
                    <span className="font-medium text-primary">Results</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Attendance Dashboard Preview */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-2xl font-bold text-primary">Attendance Overview</h2>
              </div>
              <div className="card-body">
                {user?.id ? (
                  <StudentAttendanceDashboard studentId={user.id} />
                ) : (
                  <p className="text-tertiary">Loading attendance data...</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;