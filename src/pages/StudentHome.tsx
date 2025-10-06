import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, CheckSquare, LogOut, Calendar, Brain, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import CareerGuidanceModal from '../components/CareerGuidanceModal';
import StressReliefModal from '../components/StressReliefModal';
import EnhancedTodoListModal from '../components/EnhancedTodoListModal';
import HomeworkHelpModal from '../components/HomeworkHelpModal';
import FloatingDronacharyaButton from '../components/FloatingDronacharyaButton';

interface Homework {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  feedback?: string;
}

const StudentHome: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [careerModalOpen, setCareerModalOpen] = useState(false);
  const [stressModalOpen, setStressModalOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [homeworkModalOpen, setHomeworkModalOpen] = useState(false);
  const [homework, setHomework] = useState<Homework[]>([]);

  useEffect(() => {
    if (user?.id) {
      // Set up real-time listener for homework
      const homeworkQuery = query(
        collection(db, 'homework'),
        where('studentId', '==', user.id)
      );
      
      const unsubscribe = onSnapshot(homeworkQuery, (snapshot) => {
        const homeworkData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Homework[];
        setHomework(homeworkData);
      });
      
      return () => unsubscribe();
    }
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/student-dashboard');
  };

  const flashcards = [
    {
      id: 'career',
      title: 'Career Guidance',
      description: 'Confused about your future? Discover careers that match your skills and interests.',
      icon: Briefcase,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      onClick: () => setCareerModalOpen(true),
      isNew: true,
    },
    {
      id: 'stress',
      title: 'Stress Relief',
      description: 'Feeling stressed? Chat with Dronacharya for support.',
      icon: Heart,
      gradient: 'from-pink-500 to-purple-500',
      bgGradient: 'from-pink-50 to-purple-50',
      onClick: () => setStressModalOpen(true),
      isNew: true,
    },
    {
      id: 'todo',
      title: 'To-Do List',
      description: 'Organize your day and take notes.',
      icon: CheckSquare,
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50',
      onClick: () => setTodoModalOpen(true),
      isNew: true,
    },
    {
      id: 'homework',
      title: 'Homework Help',
      description: 'Need help with homework? Ask Dronacharya AI anything!',
      icon: MessageCircle,
      gradient: 'from-yellow-500 to-amber-500',
      bgGradient: 'from-yellow-50 to-amber-50',
      onClick: () => setHomeworkModalOpen(true),
      isNew: true,
    },
    {
      id: 'registrations',
      title: 'Registrations',
      description: 'Register for school events, activities, and programs.',
      icon: Calendar,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      onClick: () => navigate('/registration'),
    },
    {
      id: 'quiz',
      title: 'Quiz Challenge',
      description: 'Test your knowledge with interactive quizzes across subjects.',
      icon: Brain,
      gradient: 'from-violet-500 to-fuchsia-500',
      bgGradient: 'from-violet-50 to-fuchsia-50',
      onClick: () => navigate('/quiz'),
    },
  ];

  // Count pending homework
  const pendingHomeworkCount = homework.filter(hw => hw.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">RHPS Student Portal</h1>
            <p className="text-gray-600">Welcome, {user?.name || 'Student'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Dashboard</h2>
          <p className="text-xl text-gray-600">
            Explore interactive tools designed to help you succeed
          </p>
        </motion.div>

        {/* Homework Summary Card */}
        {homework.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Your Homework</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {pendingHomeworkCount} pending
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {homework.slice(0, 3).map((hw) => (
                <div 
                  key={hw.id} 
                  className={`p-4 rounded-lg border ${
                    hw.status === 'pending' 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : hw.status === 'submitted' 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900">{hw.subject}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      hw.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : hw.status === 'submitted' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {hw.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{hw.title}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Due: {new Date(hw.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/homework')}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View all homework
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {flashcards.slice(0, 4).map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={card.onClick}
              className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 relative overflow-hidden`}
            >
              {card.isNew && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  NEW
                </div>
              )}
              <div className="text-center">
                <div className={`bg-gradient-to-r ${card.gradient} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <card.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
                <p className="text-gray-700 leading-relaxed">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {flashcards.slice(4).map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 4) * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={card.onClick}
              className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 relative overflow-hidden`}
            >
              {card.isNew && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  NEW
                </div>
              )}
              <div className="text-center">
                <div className={`bg-gradient-to-r ${card.gradient} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <card.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
                <p className="text-gray-700 leading-relaxed">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Meet Dronacharya</h3>
            <p className="text-gray-600">
              Your AI mentor inspired by the legendary ancient Indian warrior-sage. Dronacharya is here to guide you through career decisions and provide support when you need it most.
            </p>
          </div>
        </motion.div>
      </div>

      <CareerGuidanceModal isOpen={careerModalOpen} onClose={() => setCareerModalOpen(false)} />
      <StressReliefModal isOpen={stressModalOpen} onClose={() => setStressModalOpen(false)} />
      <EnhancedTodoListModal isOpen={todoModalOpen} onClose={() => setTodoModalOpen(false)} />
      <HomeworkHelpModal isOpen={homeworkModalOpen} onClose={() => setHomeworkModalOpen(false)} />
      <FloatingDronacharyaButton />
    </div>
  );
};

export default StudentHome;