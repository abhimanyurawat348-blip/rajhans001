import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, TrendingUp, Home, Sparkles } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';

const QuizResults: React.FC = () => {
  const navigate = useNavigate();
  const [rank, setRank] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const student = JSON.parse(localStorage.getItem('quizStudent') || '{}');
  const classNum = localStorage.getItem('quizClass') || '';
  const subject = localStorage.getItem('quizSubject') || '';
  const results = JSON.parse(localStorage.getItem('quizResults') || '{}');

  const { score = 0, totalQuestions = 10, timeTaken = 0 } = results;
  const accuracy = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    const saveAndCalculateRank = async () => {
      try {
        const attemptsRef = collection(db, 'quizAttempts');

        const attemptData = {
          studentName: student.name,
          ip: student.ip,
          class: classNum,
          subject: subject,
          score: score,
          totalQuestions: totalQuestions,
          accuracy: accuracy,
          timeTaken: formatTime(timeTaken),
          timestamp: serverTimestamp(),
        };

        await addDoc(attemptsRef, attemptData);

        const subjectQuery = query(
          attemptsRef,
          where('class', '==', classNum),
          where('subject', '==', subject)
        );
        const snapshot = await getDocs(subjectQuery);

        const attempts = snapshot.docs.map((doc) => doc.data());
        attempts.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.timeTaken.localeCompare(b.timeTaken);
        });

        setTotalStudents(attempts.length);

        const userRank = attempts.findIndex(
          (attempt) =>
            attempt.studentName === student.name &&
            attempt.score === score &&
            attempt.timeTaken === formatTime(timeTaken)
        );

        setRank(userRank + 1);
        setLoading(false);
      } catch (error) {
        console.error('Error saving results:', error);
        setLoading(false);
      }
    };

    saveAndCalculateRank();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getMotivationalMessage = () => {
    if (accuracy >= 90) {
      return {
        message: 'Outstanding! You\'re a genius! 🌟',
        emoji: '🏆',
        color: 'from-yellow-500 to-orange-500',
      };
    } else if (accuracy >= 85) {
      return {
        message: 'Excellent! You\'re among the toppers! 🚀',
        emoji: '🎯',
        color: 'from-green-500 to-emerald-500',
      };
    } else if (accuracy >= 70) {
      return {
        message: 'Great job! Keep up the good work! 💪',
        emoji: '⭐',
        color: 'from-blue-500 to-cyan-500',
      };
    } else if (accuracy >= 60) {
      return {
        message: 'Good effort! You\'re improving! 🔥',
        emoji: '📈',
        color: 'from-purple-500 to-pink-500',
      };
    } else {
      return {
        message: 'Keep practicing! You\'ll do better next time! 💪',
        emoji: '🎓',
        color: 'from-orange-500 to-red-500',
      };
    }
  };

  const motivation = getMotivationalMessage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4"
          >
            🎯
          </motion.div>
          <div className="text-2xl font-bold text-gray-700">Calculating your results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-9xl mb-4"
          >
            {motivation.emoji}
          </motion.div>
          <h1 className={`text-5xl font-extrabold bg-gradient-to-r ${motivation.color} bg-clip-text text-transparent mb-4`}>
            Quiz Complete!
          </h1>
          <p className="text-2xl text-gray-700 font-semibold">{motivation.message}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-extrabold text-gray-800 mb-2">
                {score}/{totalQuestions}
              </div>
              <div className="text-lg text-gray-600 font-semibold">Your Score</div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-extrabold text-gray-800 mb-2">{accuracy}%</div>
              <div className="text-lg text-gray-600 font-semibold">Accuracy</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {formatTime(timeTaken)}
              </div>
              <div className="text-lg text-gray-600 font-semibold">Time Taken</div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                #{rank}
              </div>
              <div className="text-lg text-gray-600 font-semibold">
                Rank out of {totalStudents}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-center text-white mb-8 shadow-2xl"
        >
          <Sparkles className="h-12 w-12 mx-auto mb-4" />
          <div className="text-2xl font-bold mb-2">Class {classNum} • {subject}</div>
          <div className="text-lg opacity-90">
            You answered {score} out of {totalQuestions} questions correctly
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStorage.removeItem('quizStudent');
              localStorage.removeItem('quizClass');
              localStorage.removeItem('quizSubject');
              localStorage.removeItem('quizResults');
              navigate('/');
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Home className="h-6 w-6" />
            Go to Home Page
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStorage.removeItem('quizResults');
              navigate('/quiz/select-class');
            }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Take Another Quiz
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizResults;
