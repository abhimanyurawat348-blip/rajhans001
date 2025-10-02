import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Loader } from 'lucide-react';
import { getClientIP } from '../utils/ipUtils';

const QuizStart: React.FC = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!studentName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsLoading(true);
    const ip = await getClientIP();

    localStorage.setItem('quizStudent', JSON.stringify({ name: studentName, ip }));

    setTimeout(() => {
      navigate('/quiz/select-class');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-8"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome to Quiz Zone!
            </h2>
            <p className="text-gray-600">Enter your name to begin the challenge</p>
          </motion.div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 text-lg transition-colors"
                disabled={isLoading}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Loading...
                </span>
              ) : (
                'Start Quiz 🚀'
              )}
            </motion.button>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-semibold">Note:</span> You have 2 minutes to complete the quiz
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizStart;
