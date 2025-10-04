import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Briefcase, Heart, MessageCircle } from 'lucide-react';
import CareerGuidanceModal from './CareerGuidanceModal';
import StressReliefModal from './StressReliefModal';
import HomeworkHelpModal from './HomeworkHelpModal';

const FloatingDronacharyaButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [isStressModalOpen, setIsStressModalOpen] = useState(false);
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);

  const handleOpenCareer = () => {
    setIsMenuOpen(false);
    setIsCareerModalOpen(true);
  };

  const handleOpenStress = () => {
    setIsMenuOpen(false);
    setIsStressModalOpen(true);
  };

  const handleOpenHomework = () => {
    setIsMenuOpen(false);
    setIsHomeworkModalOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-4 w-72 border-4 border-amber-400"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-amber-200">
                <h3 className="font-bold text-lg text-gray-800">Talk to Dronacharya</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenCareer}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="font-semibold">Career Guidance</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenStress}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all shadow-md"
                >
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold">Stress Relief</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenHomework}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all shadow-md"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-semibold">Homework Help</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative w-16 h-16 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-amber-500/50 transition-all border-4 border-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-ping opacity-20"></div>
          <Sparkles className="h-8 w-8 text-white relative z-10" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            AI
          </div>
        </motion.button>
      </div>

      <CareerGuidanceModal isOpen={isCareerModalOpen} onClose={() => setIsCareerModalOpen(false)} />
      <StressReliefModal isOpen={isStressModalOpen} onClose={() => setIsStressModalOpen(false)} />
      <HomeworkHelpModal isOpen={isHomeworkModalOpen} onClose={() => setIsHomeworkModalOpen(false)} />
    </>
  );
};

export default FloatingDronacharyaButton;
