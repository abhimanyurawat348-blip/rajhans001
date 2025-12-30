import React, { useState } from 'react';
import { X, Sun, Moon, Bell, BookOpen, Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSelector from './ThemeSelector';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { darkMode, toggleDarkMode, theme } = useTheme();
  const [classNotifications, setClassNotifications] = useState(true);
  const [homeworkNotifications, setHomeworkNotifications] = useState(true);
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {darkMode ? (
                        <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        darkMode ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Palette className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Color Theme</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {theme === 'default' ? 'Blue (Default)' : theme}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setThemeSelectorOpen(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              {}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        <span className="font-medium text-gray-900 dark:text-white">Class Reminders</span>
                      </div>
                      <button
                        onClick={() => setClassNotifications(!classNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          classNotifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            classNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        <span className="font-medium text-gray-900 dark:text-white">Homework Reminders</span>
                      </div>
                      <button
                        onClick={() => setHomeworkNotifications(!homeworkNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          homeworkNotifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            homeworkNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      <ThemeSelector
        isOpen={themeSelectorOpen}
        onClose={() => setThemeSelectorOpen(false)}
      />
    </div>
  );
};

export default SettingsDialog;