import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { subjects } from '../data/quizQuestions';

const QuizSubjectSelect: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subjectCounts, setSubjectCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const student = localStorage.getItem('quizStudent');
    const classNum = localStorage.getItem('quizClass');

    if (!student || !classNum) {
      navigate('/quiz/start');
      return;
    }

    setSelectedClass(classNum);

    const fetchCounts = async () => {
      try {
        const attemptsRef = collection(db, 'quizAttempts');
        const counts: { [key: string]: number } = {};

        const availableSubjects = subjects[classNum as '9' | '10'];

        for (const subject of availableSubjects) {
          const subjectQuery = query(
            attemptsRef,
            where('class', '==', classNum),
            where('subject', '==', subject.name)
          );
          const snapshot = await getDocs(subjectQuery);
          counts[subject.name] = snapshot.size;
        }

        setSubjectCounts(counts);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, [navigate]);

  const handleSubjectSelect = (subjectName: string) => {
    localStorage.setItem('quizSubject', subjectName);
    navigate('/quiz/play');
  };

  if (!selectedClass) return null;

  const availableSubjects = subjects[selectedClass as '9' | '10'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <BookOpen className="h-20 w-20 text-rose-600 mx-auto mb-4" />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-3">
            Choose Your Subject
          </h1>
          <p className="text-xl text-gray-600">Class {selectedClass} - Select a subject to begin</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {availableSubjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => handleSubjectSelect(subject.name)}
              className="cursor-pointer group"
            >
              <div className="relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${subject.color} rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300`}></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="text-7xl mb-6">{subject.icon}</div>
                    <h3 className={`text-3xl font-bold bg-gradient-to-r ${subject.color} bg-clip-text text-transparent mb-4`}>
                      {subject.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
                      <Users className="h-5 w-5" />
                      <span className="text-lg font-semibold">
                        {subjectCounts[subject.name] || 0} Students
                      </span>
                    </div>
                    <div className={`bg-gradient-to-r ${subject.color} bg-opacity-10 rounded-xl p-4 border-2 ${subject.color.includes('blue') ? 'border-blue-200' : subject.color.includes('green') ? 'border-green-200' : subject.color.includes('orange') ? 'border-orange-200' : subject.color.includes('purple') ? 'border-purple-200' : subject.color.includes('teal') ? 'border-teal-200' : 'border-red-200'}`}>
                      <p className="font-medium text-gray-800">10 Questions • 2 Minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/quiz/select-class')}
            className="text-gray-600 hover:text-gray-800 font-semibold underline"
          >
            ← Change Class
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizSubjectSelect;
