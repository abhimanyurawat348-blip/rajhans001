import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useStudyResources } from '../contexts/StudyResourcesContext';
import { Navigate } from 'react-router-dom';
import { BookOpen, Download, Filter, Search, FileText, GraduationCap } from 'lucide-react';

const StudyResources: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { resources, getResourcesByClass, downloadResource } = useStudyResources();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  const classes = ['10', '12'];
  const subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Physics', 'Chemistry', 'Biology'];
  const types = [
    { value: 'previous-year', label: 'Previous Year Papers' },
    { value: 'sample-paper', label: 'Sample Papers' }
  ];

  const filteredResources = resources
    .filter(resource => selectedClass === 'all' || resource.class === selectedClass)
    .filter(resource => selectedSubject === 'all' || resource.subject === selectedSubject)
    .filter(resource => selectedType === 'all' || resource.type === selectedType)
    .filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getTypeIcon = (type: string) => {
    return type === 'previous-year' ? <FileText className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />;
  };

  const getTypeColor = (type: string) => {
    return type === 'previous-year' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access previous year question papers and sample papers for CBSE Class 10 and 12 examinations.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Class Filter */}
            <div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(resource.type)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                      {resource.type === 'previous-year' ? 'Previous Year' : 'Sample Paper'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">Class {resource.class}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.subject}</p>
                
                {resource.year && (
                  <p className="text-sm text-gray-500 mb-4">Year: {resource.year}</p>
                )}

                <button
                  onClick={() => downloadResource(resource)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center"
        >
          <BookOpen className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Study Smart, Score Better</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            These resources are carefully curated to help you prepare effectively for your CBSE examinations. 
            Practice regularly with previous year papers and sample papers to boost your confidence and performance.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StudyResources;