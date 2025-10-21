import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
  onClick?: () => void;
  color: string;
  special?: boolean;
  isNew?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  link,
  onClick,
  color,
  special = false,
  isNew = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: special ? -10 : 0, scale: special ? 1.05 : 1 }}
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
        special ? 'border-2 border-purple-300 dark:border-purple-500 relative overflow-hidden' : ''
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {isNew && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          NEW
        </div>
      )}
      <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-4 mx-auto shadow-md`}>
        {icon}
      </div>
      <h3 className={`text-xl font-bold mb-3 text-center ${
        special ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : 'text-gray-900 dark:text-white'
      }`}>
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
        {description}
      </p>
      <div className="text-center">
        {link ? (
          <Link
            to={link}
            className={`inline-flex items-center font-semibold transition-colors duration-200 text-sm ${
              special
                ? 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300'
                : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            }`}
          >
            {title === 'Quiz Zone' ? 'Start Quiz Now' : 'Learn More'}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        ) : (
          <button
            className={`inline-flex items-center font-semibold transition-colors duration-200 text-sm ${
              special
                ? 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300'
                : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            }`}
            onClick={onClick}
          >
            Open Now
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureCard;