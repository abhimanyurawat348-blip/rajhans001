import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearningInsightsFlashcard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 relative overflow-hidden"
    >
      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
        NEW
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center text-white mb-4 mx-auto shadow-lg">
        <BarChart3 className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-center mb-3 text-gray-900">
        Learning Insights
      </h3>
      <p className="text-gray-700 text-center text-sm mb-4">
        Get personalized analytics and AI-powered recommendations to boost your academic performance
      </p>
      <div className="text-center">
        <Link
          to="/learning-insights"
          className="inline-flex items-center font-semibold text-sm transition-colors duration-200 text-blue-600 hover:text-blue-700"
        >
          Explore Insights
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="absolute -bottom-6 -right-6 text-blue-200">
        <Zap className="h-24 w-24 opacity-30" />
      </div>
    </motion.div>
  );
};

export default LearningInsightsFlashcard;