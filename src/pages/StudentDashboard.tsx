import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, LogIn, GraduationCap, Sparkles, Bot } from 'lucide-react';
import FloatingDronacharyaButton from '../components/FloatingDronacharyaButton';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <GraduationCap className="h-20 w-20 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Student Portal</h1>
          <p className="text-xl text-gray-600">
            Welcome to RHPS Public School Student Portal
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl shadow-xl p-8 border-4 border-amber-400 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 600\'%3E%3Cpath fill=\'%23d97706\' d=\'M400 300 L450 250 L500 300 L450 350 Z M200 200 L250 150 L300 200 L250 250 Z M600 400 L650 350 L700 400 L650 450 Z\'/%3E%3C/svg%3E")',
            }}
          ></div>
          <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            NEW FEATURE
          </div>
          <div className="flex items-start gap-6 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white flex-shrink-0">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                  Dronacharya AI
                </h2>
                <Sparkles className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Meet your personal AI mentor inspired by the legendary teacher from Indian mythology. Dronacharya AI is here to guide you through career decisions, help you manage stress, and assist with your homework questions. Get personalized advice and support whenever you need it!
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border-2 border-amber-300">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Career Guidance</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border-2 border-rose-300">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Stress Relief</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border-2 border-yellow-300">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Homework Help</span>
                </div>
              </div>
              <p className="text-amber-700 text-sm mt-4 font-medium">
                Look for the glowing AI button at the bottom right to start chatting!
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => navigate('/student-signup')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-gray-600 mb-6">
                Create a new student account to access the portal and register for activities.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  New to RHPS Portal? Start here to create your account.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => navigate('/student-login')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Login</h3>
              <p className="text-gray-600 mb-6">
                Already have an account? Login to access your dashboard and activities.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Existing students can login with their credentials.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            For staff access, please visit the{' '}
            <button
              onClick={() => navigate('/staff-portal')}
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Staff Portal
            </button>
          </p>
        </motion.div>
      </div>

      <FloatingDronacharyaButton />
    </div>
  );
};

export default StudentDashboard;
