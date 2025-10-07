import React, { useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NamePromptModal from './NamePromptModal';

interface ChantingFlashcardProps {
  title?: string;
  description?: string;
  isNew?: boolean;
}

const ChantingFlashcard: React.FC<ChantingFlashcardProps> = ({ 
  title = "Spiritual Chanting", 
  description = "Feeling stressed? Find peace through divine chanting",
  isNew = true 
}) => {
  const navigate = useNavigate();
  const { user, updateUserName } = useAuth();
  const [isNamePromptOpen, setIsNamePromptOpen] = useState(false);

  const handleNameSubmit = async (name: string) => {
    try {
      await updateUserName(name);
      setIsNamePromptOpen(false);
      navigate('/chanting');
    } catch (error) {
      console.error('Error updating name:', error);
      // Still navigate even if name update fails
      setIsNamePromptOpen(false);
      navigate('/chanting');
    }
  };

  const handleClick = () => {
    // Check if user has a name, if not prompt for it
    if (user && (!user.name || user.name === 'Student User')) {
      setIsNamePromptOpen(true);
    } else {
      navigate('/chanting');
    }
  };

  return (
    <>
      <div 
        onClick={handleClick}
        className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-rose-300 relative overflow-hidden cursor-pointer"
      >
        {isNew && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            NEW
          </div>
        )}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 mx-auto shadow-lg">
          <Heart className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-center mb-3 text-gray-900">
          {title}
        </h3>
        <p className="text-gray-700 text-center text-sm">
          {description}
        </p>
        <div className="text-center mt-4">
          <button className="inline-flex items-center font-semibold text-sm transition-colors duration-200 text-rose-600 hover:text-rose-700">
            Start Chanting
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
      
      <NamePromptModal
        isOpen={isNamePromptOpen}
        onClose={() => setIsNamePromptOpen(false)}
        onSubmit={handleNameSubmit}
      />
    </>
  );
};

export default ChantingFlashcard;