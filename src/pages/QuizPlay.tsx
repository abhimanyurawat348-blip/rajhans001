import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { quizData } from '../data/quizQuestions';
import { QuizQuestion } from '../types/quiz';

// Function to randomly select n items from an array
const getRandomQuestions = (questions: QuizQuestion[], count: number): QuizQuestion[] => {
  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  // Return first 'count' items
  return shuffled.slice(0, count);
};

const QuizPlay: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // Store all answers
  const [timeLeft, setTimeLeft] = useState(120);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const student = localStorage.getItem('quizStudent');
    const classNum = localStorage.getItem('quizClass');
    const subject = localStorage.getItem('quizSubject');

    if (!student || !classNum || !subject) {
      navigate('/quiz/start');
      return;
    }

    const quizQuestions = quizData[classNum]?.[subject];
    if (quizQuestions) {
      // Select 10 random questions from the available questions
      const selectedQuestions = getRandomQuestions(quizQuestions, 10);
      setQuestions(selectedQuestions);
      // Initialize selectedAnswers array with null values
      setSelectedAnswers(Array(selectedQuestions.length).fill(null));
    } else {
      navigate('/quiz/start');
    }
  }, [navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleFinishQuiz = () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);

    let score = 0;
    selectedAnswers.forEach((answer, index) => {
      if (questions[index] && answer === questions[index].correctAnswer) {
        score++;
      }
    });

    const quizResults = {
      score,
      totalQuestions: questions.length,
      timeTaken,
      answers: selectedAnswers,
    };

    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    navigate('/quiz/results');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    handleFinishQuiz();
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading quiz...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex]; // Get answer for current question
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
            <div className="text-sm text-gray-600 mb-1">Progress</div>
            <div className="text-2xl font-bold text-gray-800">
              {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>

          <motion.div
            animate={{
              scale: timeLeft <= 30 ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 1, repeat: timeLeft <= 30 ? Infinity : 0 }}
            className={`bg-white rounded-2xl px-6 py-3 shadow-lg ${
              timeLeft <= 30 ? 'border-4 border-red-500' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className={`h-6 w-6 ${timeLeft <= 30 ? 'text-red-600' : 'text-teal-600'}`} />
              <div className="text-3xl font-bold" style={{ color: timeLeft <= 30 ? '#dc2626' : '#0d9488' }}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
          >
            <div className="mb-8">
              <div className="text-sm font-semibold text-teal-600 mb-3">
                Question {currentQuestionIndex + 1}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={`option-${index}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedAnswer === index
                      ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-emerald-50 shadow-lg'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        selectedAnswer === index
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1 text-lg text-gray-800">{option}</div>
                    {selectedAnswer === index && (
                      <CheckCircle className="h-6 w-6 text-teal-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all ${
              currentQuestionIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </motion.button>

          {currentQuestionIndex < questions.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Next
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Finish Quiz
              <CheckCircle className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlay;