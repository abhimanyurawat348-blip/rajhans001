import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  RotateCcw, 
  Star, 
  Clock, 
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface FlashcardProps {
  id: string;
  front: string;
  back: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

const EnhancedFlashcard: React.FC<FlashcardProps> = ({
  id,
  front,
  back,
  subject,
  difficulty,
  tags = [],
  onBookmark,
  isBookmarked = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userRating, setUserRating] = useState<'easy' | 'medium' | 'hard' | null>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowAnswer(true);
    }
  };

  const handleRating = (rating: 'easy' | 'medium' | 'hard') => {
    setUserRating(rating);
    // In a real implementation, this would be sent to a backend
    console.log(`User rated card ${id} as ${rating}`);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="relative h-64 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <AnimatePresence>
          <motion.div
            key={isFlipped ? 'back' : 'front'}
            initial={{ rotateY: isFlipped ? 90 : -90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: isFlipped ? -90 : 90 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full preserve-3d"
          >
            <div className="relative w-full h-full rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col">
              {/* Card Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {subject}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor()}`}>
                  {difficulty}
                </span>
              </div>
              
              {/* Card Content */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {isFlipped ? back : front}
                </div>
                
                {!isFlipped && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Click to reveal answer
                  </div>
                )}
                
                {isFlipped && (
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRating('easy');
                      }}
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRating('medium');
                      }}
                      className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRating('hard');
                      }}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Card Footer */}
              <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1">
                  {tags.slice(0, 2).map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {tags.length > 2 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      +{tags.length - 2}
                    </span>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark?.(id);
                  }}
                  className={`p-1 rounded-full ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Controls */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(false);
            setShowAnswer(false);
            setUserRating(null);
          }}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </button>
        
        {showAnswer && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            {userRating ? (
              <span className="capitalize">{userRating} rated</span>
            ) : (
              <span>How well did you know this?</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedFlashcard;