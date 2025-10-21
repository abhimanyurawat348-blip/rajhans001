import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { School, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import RHPSLogo from './RHPSLogo';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Memoize navigation items to prevent unnecessary re-renders
  const navItems = useMemo(() => [
    { path: '/', label: 'Home', authRequired: false },
    { path: '/about-us', label: 'About Us', authRequired: false },
    { path: '/yearly-planner', label: 'Yearly Planner', authRequired: false },
    { path: '/monthly-planner', label: 'Monthly Planner', authRequired: false },
    { path: '/registration', label: 'Registration', authRequired: false },
    { path: '/complaints', label: 'Complaints', authRequired: true },
    { path: '/study-resources', label: 'Study Resources', authRequired: true },
    { path: '/rules', label: 'Rule Book', authRequired: false },
    { path: '/student-council', label: 'Student Council', authRequired: false },
    { path: '/smart-marketplace', label: 'E Mall', authRequired: false },
    { path: '/staff-portal', label: 'Staff Portal', authRequired: true },
  ], []);

  const isActive = (path: string) => location.pathname === path;

  // Filter navigation items based on authentication status
  const filteredNavItems = useMemo(() => 
    navItems.filter(item => 
      !item.authRequired || isAuthenticated
    ), [navItems, isAuthenticated]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
            <RHPSLogo size="md" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900 dark:text-white">R.H.P.S.</span>
              <span className="text-xs text-gray-500 dark:text-gray-300">Royal Hindustan</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                  Welcome, {user?.fullName || user?.username}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-expanded={mobileMenuOpen}
              aria-label="Main menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-700">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center px-3">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 w-full text-left"
                  >
                    {darkMode ? (
                      <>
                        <Sun className="h-5 w-5 mr-2" />
                        Switch to Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mr-2" />
                        Switch to Dark Mode
                      </>
                    )}
                  </button>
                </div>
                {isAuthenticated && (
                  <>
                    <div className="mt-3 px-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        Welcome, {user?.fullName || user?.username}
                      </p>
                    </div>
                    <div className="mt-3 px-3">
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/50"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;