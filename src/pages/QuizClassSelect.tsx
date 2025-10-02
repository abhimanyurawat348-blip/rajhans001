import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const QuizClassSelect: React.FC = () => {
  const navigate = useNavigate();
  const [class9Count, setClass9Count] = useState(0);
  const [class10Count, setClass10Count] = useState(0);

  useEffect(() => {
    const student = localStorage.getItem('quizStudent');
    if (!student) {
      navigate('/quiz/start');
      return;
    }

    const fetchCounts = async () => {
      try {
        const attemptsRef = collection(db, 'quizAttempts');

        const class9Query = query(attemptsRef, where('class', '==', '9'));
        const class9Snapshot = await getDocs(class9Query);
        setClass9Count(class9Snapshot.size);

        const class10Query = query(attemptsRef, where('class', '==', '10'));
        const class10Snapshot = await getDocs(class10Query);
        setClass10Count(class10Snapshot.size);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, [navigate]);

  const handleClassSelect = (classNum: string) => {
    localStorage.setItem('quizClass', classNum);
    navigate('/quiz/select-subject');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <GraduationCap className="h-20 w-20 text-blue-600 mx-auto mb-4" />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Select Your Class
          </h1>
          <p className="text-xl text-gray-600">Choose your grade level to continue</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => handleClassSelect('9')}
            className="cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl">
                <div className="text-center">
                  <div className="text-8xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
                    9th
                  </div>
                  <div className="text-6xl mb-6">📚</div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Class 9th</h3>
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                    <Users className="h-5 w-5" />
                    <span className="text-lg font-semibold">{class9Count} Students Attempted</span>
                  </div>
                  <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <p className="text-blue-800 font-medium">Click to take quiz for Class 9</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => handleClassSelect('10')}
            className="cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl">
                <div className="text-center">
                  <div className="text-8xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    10th
                  </div>
                  <div className="text-6xl mb-6">🎓</div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Class 10th</h3>
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                    <Users className="h-5 w-5" />
                    <span className="text-lg font-semibold">{class10Count} Students Attempted</span>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <p className="text-purple-800 font-medium">Click to take quiz for Class 10</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QuizClassSelect;
