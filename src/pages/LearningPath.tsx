import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Map, 
  BookOpen, 
  Target, 
  CheckCircle,
  ArrowLeft,
  Play,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';

const LearningPath: React.FC = () => {
  const [completedTopics, setCompletedTopics] = useState<string[]>(['topic-1', 'topic-2']);
  
  // Mock learning path data
  const learningPath = [
    {
      id: 'topic-1',
      title: 'Algebra Basics',
      description: 'Introduction to algebraic expressions and equations',
      duration: '45 min',
      difficulty: 'Beginner',
      subject: 'Mathematics',
      status: 'completed'
    },
    {
      id: 'topic-2',
      title: 'Linear Equations',
      description: 'Solving linear equations with one variable',
      duration: '60 min',
      difficulty: 'Beginner',
      subject: 'Mathematics',
      status: 'completed'
    },
    {
      id: 'topic-3',
      title: 'Quadratic Equations',
      description: 'Solving quadratic equations using various methods',
      duration: '90 min',
      difficulty: 'Intermediate',
      subject: 'Mathematics',
      status: 'in-progress'
    },
    {
      id: 'topic-4',
      title: 'Polynomials',
      description: 'Understanding polynomial expressions and operations',
      duration: '75 min',
      difficulty: 'Intermediate',
      subject: 'Mathematics',
      status: 'locked'
    },
    {
      id: 'topic-5',
      title: 'Functions',
      description: 'Introduction to mathematical functions and their properties',
      duration: '120 min',
      difficulty: 'Advanced',
      subject: 'Mathematics',
      status: 'locked'
    }
  ];

  const toggleCompletion = (id: string) => {
    if (completedTopics.includes(id)) {
      setCompletedTopics(completedTopics.filter(topicId => topicId !== id));
    } else {
      setCompletedTopics([...completedTopics, id]);
    }
  };

  const getTopicStatus = (topic: any) => {
    if (completedTopics.includes(topic.id)) return 'completed';
    if (topic.id === 'topic-3') return 'in-progress';
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center">
                <Map className="h-8 w-8 text-blue-600 mr-3" />
                Personalized Learning Path
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Follow your customized learning journey
              </p>
            </div>
            <Link
              to="/student-home"
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Topics Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">2/5</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: '40%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Topic</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">Quadratic Equations</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                90 minutes of learning content
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Learning Streak</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">7 days</p>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep up the great work!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Your Learning Journey
          </h2>
          
          <div className="space-y-6">
            {learningPath.map((topic, index) => {
              const status = getTopicStatus(topic);
              const isCompleted = status === 'completed';
              const isInProgress = status === 'in-progress';
              const isLocked = status === 'locked';
              
              return (
                <div 
                  key={topic.id} 
                  className={`relative pl-8 pb-6 border-l-2 ${
                    isCompleted ? 'border-green-500' : 
                    isInProgress ? 'border-blue-500' : 
                    'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {/* Connector dot */}
                  <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${
                    isCompleted ? 'bg-green-500' : 
                    isInProgress ? 'bg-blue-500 animate-pulse' : 
                    'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  
                  <div className={`p-6 rounded-xl ${
                    isCompleted ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 
                    isInProgress ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 
                    'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{topic.title}</h3>
                          {isCompleted && (
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </span>
                          )}
                          {isInProgress && (
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              <Play className="h-3 w-3 mr-1" />
                              In Progress
                            </span>
                          )}
                          {isLocked && (
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              Locked
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{topic.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {topic.subject}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            <Clock className="h-3 w-3 mr-1" />
                            {topic.duration}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            topic.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {topic.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0">
                        {isCompleted ? (
                          <button
                            onClick={() => toggleCompletion(topic.id)}
                            className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </button>
                        ) : isInProgress ? (
                          <Link
                            to="/study-resources"
                            className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="flex items-center px-4 py-2 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Locked
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            AI Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Focus on Weak Areas</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Based on your recent performance, we recommend spending extra time on quadratic equations.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Maintain Your Streak</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You're on a 7-day learning streak! Keep going to build a strong foundation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningPath;