import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Beaker, 
  Search, 
  Filter, 
  Play,
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  FlaskConical,
  Microscope,
  Atom
} from 'lucide-react';

const VirtualLab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  // Mock virtual lab experiments
  const experiments = [
    {
      id: '1',
      title: 'Chemical Reactions',
      subject: 'Chemistry',
      description: 'Observe and analyze different types of chemical reactions',
      duration: '45 min',
      difficulty: 'Beginner',
      rating: 4.8,
      participants: 1240,
      icon: FlaskConical
    },
    {
      id: '2',
      title: 'Newton\'s Laws of Motion',
      subject: 'Physics',
      description: 'Explore the fundamental laws governing motion',
      duration: '60 min',
      difficulty: 'Intermediate',
      rating: 4.9,
      participants: 980,
      icon: Atom
    },
    {
      id: '3',
      title: 'Cell Structure',
      subject: 'Biology',
      description: 'Examine different types of cells and their structures',
      duration: '50 min',
      difficulty: 'Beginner',
      rating: 4.7,
      participants: 1150,
      icon: Microscope
    },
    {
      id: '4',
      title: 'Electric Circuits',
      subject: 'Physics',
      description: 'Build and analyze different types of electric circuits',
      duration: '70 min',
      difficulty: 'Advanced',
      rating: 4.6,
      participants: 890,
      icon: Atom
    },
    {
      id: '5',
      title: 'Acids and Bases',
      subject: 'Chemistry',
      description: 'Test and identify different acids and bases using indicators',
      duration: '55 min',
      difficulty: 'Intermediate',
      rating: 4.8,
      participants: 1020,
      icon: FlaskConical
    },
    {
      id: '6',
      title: 'Genetics and Heredity',
      subject: 'Biology',
      description: 'Understand the principles of genetics and inheritance',
      duration: '80 min',
      difficulty: 'Advanced',
      rating: 4.9,
      participants: 760,
      icon: Microscope
    }
  ];

  const subjects = ['all', 'Physics', 'Chemistry', 'Biology'];
  
  const filteredExperiments = experiments.filter(experiment => {
    const matchesSearch = experiment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          experiment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || experiment.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center">
                <Beaker className="h-8 w-8 text-blue-600 mr-3" />
                Virtual Laboratory
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Conduct experiments and explore scientific concepts in a virtual environment
              </p>
            </div>
            <Link
              to="/student-home"
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Beaker className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Experiments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5,240</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Hours Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12,450</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search experiments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            {/* Subject Filter */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Reset Button */}
            <div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('all');
                }}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Experiments Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredExperiments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiments.map((experiment, index) => {
                const Icon = experiment.icon;
                return (
                  <motion.div
                    key={experiment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex items-center text-amber-500">
                          <Star className="h-5 w-5 fill-current" />
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">{experiment.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{experiment.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{experiment.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {experiment.subject}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          <Clock className="h-3 w-3 mr-1" />
                          {experiment.duration}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          experiment.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          experiment.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {experiment.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          {experiment.participants} participants
                        </div>
                        <Link
                          to={`/virtual-lab/${experiment.id}`}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Experiment
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No experiments found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('all');
                }}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VirtualLab;