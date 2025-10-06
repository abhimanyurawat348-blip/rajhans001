import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, LogIn, Users, AlertCircle } from 'lucide-react';

const ParentPortal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Users className="h-20 w-20 text-teal-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Parent Portal</h1>
          <p className="text-xl text-gray-600">
            Stay connected with your child's academic journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 flex items-start space-x-4">
            <AlertCircle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-2">Important: Registration Process</h2>
              <p className="text-amber-800 leading-relaxed">
                First register the student, then parent registration with same credentials.
                Parents can only register if their child is already registered in the Student Portal.
                You will need your child's admission number, class, section, and the password they set during registration.
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
            onClick={() => navigate('/parent-signup')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-gray-600 mb-6">
                Create a new parent account to track your child's progress and performance.
              </p>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <p className="text-sm text-teal-800">
                  New parent? Register here to get started.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => navigate('/parent-login')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Login</h3>
              <p className="text-gray-600 mb-6">
                Already have an account? Login to access your parent dashboard.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Existing parents can login with their credentials.
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
          <h3 className="text-2xl font-bold text-gray-900 mb-4">What You Can Do</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">Track Performance</h4>
              <p className="text-gray-600 text-sm">
                View your child's marks from unit tests, half-yearly, and final exams
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">Monitor Homework</h4>
              <p className="text-gray-600 text-sm">
                Check homework completion status and stay updated
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">Parent-Teacher Meetings</h4>
              <p className="text-gray-600 text-sm">
                Access interactive meeting schedules and updates
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            For student access, visit the{' '}
            <button
              onClick={() => navigate('/student-dashboard')}
              className="text-teal-600 hover:text-teal-700 font-semibold underline"
            >
              Student Portal
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentPortal;
