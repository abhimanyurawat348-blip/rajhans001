import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  Star,
  Clock,
  Zap,
  ArrowLeft,
  Brain,
  TrendingUp
} from 'lucide-react';
import FlashcardCollection from '../components/FlashcardCollection';

const FlashcardsHub: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock AI recommendations
  const aiRecommendations = [
    {
      id: '1',
      title: 'Review Quadratic Equations',
      reason: 'Based on your recent test performance',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Practice Physics Formulas',
      reason: 'Upcoming exam in 3 days',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Revise World History',
      reason: 'Low retention rate detected',
      priority: 'high'
    }
  ];

  const handleRecommendationClick = (recommendationId: string) => {
    // In a real implementation, this would navigate to a specific flashcard set
    console.log(`Navigating to recommendation: ${recommendationId}`);
    // For now, we'll just show an alert
    alert(`Navigating to: ${aiRecommendations.find(r => r.id === recommendationId)?.title}`);
  };

  return (
    <div className="min-h-screen bg-primary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center">
                <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
                Flashcards Hub
              </h1>
              <p className="text-tertiary mt-2">
                Manage and study all your flashcards in one place
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Link
                to="/student-home"
                className="btn btn-outline btn-md"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <button className="btn btn-primary btn-md">
                <Zap className="h-4 w-4 mr-2" />
                AI Generate
              </button>
            </div>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-secondary-50 to-warning-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 mb-8 border border-secondary-200 dark:border-gray-700"
        >
          <div className="flex items-center mb-4">
            <Brain className="h-5 w-5 text-secondary-600 dark:text-secondary-400 mr-2" />
            <h2 className="text-lg font-bold text-primary">AI Learning Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecommendations.map((recommendation) => (
              <div 
                key={recommendation.id} 
                className="card cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleRecommendationClick(recommendation.id)}
              >
                <div className="card-body">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-primary">{recommendation.title}</h3>
                    {recommendation.priority === 'high' && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-bold rounded-full bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200">
                        HIGH
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-tertiary mb-3">{recommendation.reason}</p>
                  <button className="text-sm font-medium text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300">
                    Review Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6 bg-secondary rounded-xl p-1 shadow-sm"
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-primary-500 text-white'
                : 'text-secondary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All Flashcards
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-primary-500 text-white'
                : 'text-secondary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setActiveTab('in-progress')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'in-progress'
                ? 'bg-primary-500 text-white'
                : 'text-secondary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-primary-500 text-white'
                : 'text-secondary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-secondary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </motion.div>

        {/* Flashcard Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FlashcardCollection />
        </motion.div>
      </div>
    </div>
  );
};

export default FlashcardsHub;