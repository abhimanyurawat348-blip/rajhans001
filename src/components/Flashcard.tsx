import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FlashcardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  bgGradient: string;
  link?: string;
  onClick?: () => void;
  isNew?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
  bgGradient,
  link,
  onClick,
  isNew = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 relative overflow-hidden cursor-pointer`}
    >
      {isNew && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          NEW
        </div>
      )}
      <div className={`bg-gradient-to-r ${gradient} w-12 h-12 rounded-full flex items-center justify-center text-white mb-3 mx-auto shadow-md`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-center mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-center text-sm mb-3">
        {description}
      </p>
      <div className="text-center">
        {link ? (
          <Link
            to={link}
            className="inline-flex items-center font-semibold text-sm transition-colors duration-200 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Learn More
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        ) : (
          <button className="inline-flex items-center font-semibold text-sm transition-colors duration-200 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
            Open Now
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Flashcard;