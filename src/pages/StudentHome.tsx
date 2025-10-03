import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CareerGuidanceModal from '../components/CareerGuidanceModal';
import StressReliefModal from '../components/StressReliefModal';
import TodoListModal from '../components/TodoListModal';

const StudentHome: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [careerModalOpen, setCareerModalOpen] = useState(false);
  const [stressModalOpen, setStressModalOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);

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
    },
    {
      id: 'stress',
      title: 'Stress Relief',
      description: 'Feeling stressed? Chat with Dronacharya for support.',
      icon: Heart,
      gradient: 'from-pink-500 to-purple-500',
      bgGradient: 'from-pink-50 to-purple-50',
      onClick: () => setStressModalOpen(true),
    },
    {
      id: 'todo',
      title: 'To-Do List',
      description: 'Organize your day and take notes.',
      icon: CheckSquare,
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50',
      onClick: () => setTodoModalOpen(true),
    },
  ];

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

        <div className="grid md:grid-cols-3 gap-8">
          {flashcards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={card.onClick}
              className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300`}
            >
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
      <TodoListModal isOpen={todoModalOpen} onClose={() => setTodoModalOpen(false)} />
    </div>
  );
};

export default StudentHome;
