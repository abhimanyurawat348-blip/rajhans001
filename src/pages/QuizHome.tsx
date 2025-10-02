import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const QuizHome: React.FC = () => {
  const navigate = useNavigate();
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const attemptsRef = collection(db, 'quizAttempts');
        const snapshot = await getDocs(attemptsRef);
        setTotalAttempts(snapshot.size);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Quiz Zone 🎯
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Challenge Yourself & Compete with Others!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/quiz/start')}
          className="relative group cursor-pointer mb-12"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-white rounded-3xl p-12 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <Users className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {totalAttempts}
                </div>
                <p className="text-gray-600 font-medium">Students Attempted</p>
              </div>

              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  Start Quiz Now!
                </div>
                <p className="text-gray-600">Test your knowledge and compete</p>
              </div>

              <div className="text-center">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <ArrowRight className="h-10 w-10 text-white" />
                </motion.div>
                <p className="text-gray-600 font-medium mt-4">Click to Begin</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-3">🏆</div>
            <h3 className="text-2xl font-bold mb-2">Compete & Win</h3>
            <p className="text-pink-100">Challenge yourself and see where you rank!</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-3">⏱️</div>
            <h3 className="text-2xl font-bold mb-2">2 Minutes</h3>
            <p className="text-purple-100">Fast-paced quiz to test your speed and accuracy</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-3">📊</div>
            <h3 className="text-2xl font-bold mb-2">Track Progress</h3>
            <p className="text-yellow-100">Get instant results and performance insights</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizHome;
