import React from 'react';
import { motion } from 'framer-motion';

interface HeroBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-primary opacity-10"
        animate={{
          background: [
            'linear-gradient(45deg, var(--primary-500), var(--primary-700))',
            'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
            'linear-gradient(225deg, var(--primary-500), var(--primary-700))',
            'linear-gradient(315deg, var(--primary-600), var(--primary-800))',
            'linear-gradient(45deg, var(--primary-500), var(--primary-700))'
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              x: [-10, 10, -10],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HeroBackground;