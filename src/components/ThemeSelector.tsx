import React from 'react';
import { useTheme, ThemeVariant } from '../contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeOption {
  name: string;
  value: ThemeVariant;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    name: 'Default',
    value: 'default',
    colors: {
      primary: '#3b82f6',
      secondary: '#0ea5e9',
      accent: '#6366f1'
    }
  },
  {
    name: 'Emerald',
    value: 'emerald',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#047857'
    }
  },
  {
    name: 'Purple',
    value: 'purple',
    colors: {
      primary: '#a855f7',
      secondary: '#9333ea',
      accent: '#7c3aed'
    }
  },
  {
    name: 'Rose',
    value: 'rose',
    colors: {
      primary: '#f43f5e',
      secondary: '#e11d48',
      accent: '#be185d'
    }
  },
  {
    name: 'Amber',
    value: 'amber',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#b45309'
    }
  },
  {
    name: 'Indigo',
    value: 'indigo',
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#4338ca'
    }
  },
  {
    name: 'Teal',
    value: 'teal',
    colors: {
      primary: '#14b8a6',
      secondary: '#0d9488',
      accent: '#0f766e'
    }
  }
];

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Palette className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Choose Theme
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select a beautiful theme for your experience
          </p>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {themeOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setTheme(option.value);
                  onClose();
                }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  theme === option.value
                    ? 'border-primary-500 shadow-lg'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  {/* Color preview */}
                  <div className="flex space-x-1">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: option.colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: option.colors.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: option.colors.accent }}
                    />
                  </div>

                  {/* Theme preview mockup */}
                  <div className="w-full bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: option.colors.primary }}
                      />
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded flex-1" />
                      <div className="h-2 bg-gray-300 dark:bg-gray-500 rounded w-8" />
                    </div>
                    <div className="mt-2 flex space-x-1">
                      <div
                        className="h-1.5 rounded flex-1"
                        style={{ backgroundColor: option.colors.secondary }}
                      />
                      <div
                        className="h-1.5 rounded w-6"
                        style={{ backgroundColor: option.colors.accent }}
                      />
                    </div>
                  </div>

                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {option.name}
                  </span>
                </div>

                {theme === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThemeSelector;