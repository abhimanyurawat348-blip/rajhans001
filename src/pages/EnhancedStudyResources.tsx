import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEnhancedStudyResources } from '../contexts/EnhancedStudyResourcesContext';
import { 
  BookOpen, 
  Download, 
  Search, 
  FileText, 
  GraduationCap, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Clock, 
  Languages,
  Verified,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import QuestionPaperDisplay from '../components/QuestionPaperDisplay';
import { StudyResource } from '../types';

const EnhancedStudyResources: React.FC = () => {
  const { 
    resources,
    loading, 
    error, 
    filters, 
    setFilters, 
    downloadResource, 
    reportBrokenLink,
    verifyResource,
    refreshResources,
    openPaperInBrowser,
    getPaperData
  } = useEnhancedStudyResources();

  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: 'user-123', role: 'student' });
  const [displayedPaper, setDisplayedPaper] = useState<any>(null);

  // Filter resources to show only sample papers
  const filteredResources = resources
    .filter(resource => resource.type === 'sample-paper')
    .filter(resource => filters.selectedClass === 'all' || resource.class === filters.selectedClass)
    .filter(resource => filters.selectedSubject === 'all' || resource.subject === filters.selectedSubject)
    .filter(resource => filters.selectedType === 'all' || resource.type === filters.selectedType)
    .filter(resource => filters.selectedLanguage === 'all' || resource.language === filters.selectedLanguage)
    .filter(resource => !filters.verifiedOnly || resource.is_verified)
    .filter(resource => 
      resource.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (resource.topic_tags && resource.topic_tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase())))
    );

  // Available filter options - only for sample papers
  const classes = ['9', '10'];
  const subjects = ['Science'];
  const types = [
    { value: 'sample-paper', label: 'Sample Papers' }
  ];
  const languages = ['English', 'Hindi'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sample-paper': return <GraduationCap className="h-5 w-5" />;
      case 'question-bank': return <FileText className="h-5 w-5" />;
      case 'video': return <Eye className="h-5 w-5" />;
      case 'ppt': return <FileText className="h-5 w-5" />;
      case 'link': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sample-paper': return 'bg-green-100 text-green-800';
      case 'question-bank': return 'bg-amber-100 text-amber-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'ppt': return 'bg-pink-100 text-pink-800';
      case 'link': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReportBrokenLink = async (resourceId: string) => {
    if (currentUser) {
      await reportBrokenLink(resourceId, currentUser.id);
    }
  };

  const handleVerifyResource = async (resourceId: string) => {
    if (currentUser.role === 'teacher' || currentUser.role === 'admin') {
      await verifyResource(resourceId);
    }
  };

  const handleViewPaper = (resource: StudyResource) => {
    const paperData = getPaperData(resource.id);
    if (paperData) {
      setDisplayedPaper({ ...paperData, viewMode: 'full' });
    } else {
      // Fallback to download if no data available
      openPaperInBrowser(resource);
    }
  };

  const handleViewSolutions = (resource: StudyResource) => {
    const paperData = getPaperData(resource.id);
    if (paperData) {
      setDisplayedPaper({ ...paperData, viewMode: 'solutions' });
    } else {
      // Fallback to download solutions if no data available
      downloadResource(resource, true);
    }
  };

  const handleCloseDisplay = () => {
    setDisplayedPaper(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading study resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Resources</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={refreshResources}
            className="flex items-center justify-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Enhanced Study Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access educational resources for CBSE Classes 9-12.
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">Filter Resources</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Class Filter */}
              <div>
                <select
                  value={filters.selectedClass}
                  onChange={(e) => setFilters(prev => ({ ...prev, selectedClass: e.target.value }))}
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
                  value={filters.selectedSubject}
                  onChange={(e) => setFilters(prev => ({ ...prev, selectedSubject: e.target.value }))}
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
                  value={filters.selectedType}
                  onChange={(e) => setFilters(prev => ({ ...prev, selectedType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {types.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <select
                  value={filters.selectedLanguage}
                  onChange={(e) => setFilters(prev => ({ ...prev, selectedLanguage: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Languages</option>
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>

              {/* Verified Only Filter */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verifiedOnly"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="verifiedOnly" className="ml-2 text-gray-700">
                  Verified Only
                </label>
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Summary */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-gray-600 mb-4 md:mb-0">
            Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={refreshResources}
              className="flex items-center px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>

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
                      {types.find(t => t.value === resource.type)?.label || resource.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Class {resource.class}</span>
                    {resource.is_verified && (
                      <Verified className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-2">{resource.subject}</p>
                
                {resource.year && (
                  <p className="text-sm text-gray-500 mb-2">Year: {resource.year}</p>
                )}

                {resource.topic_tags && resource.topic_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.topic_tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {resource.topic_tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{resource.topic_tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    Updated {resource.updated_at ? new Date(resource.updated_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {resource.has_solutions ? (
                    <>
                      <button
                        onClick={() => handleViewPaper(resource)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        <span>See Paper</span>
                      </button>
                      <button
                        onClick={() => handleViewSolutions(resource)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <FileText className="h-4 w-4" />
                        <span>See Solutions</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleViewPaper(resource)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      <span>See Paper</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => downloadResource(resource, false)}
                    className="flex items-center justify-center p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download as PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleReportBrokenLink(resource.id)}
                    className="flex items-center justify-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Report broken link"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </button>
                  
                  {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                    <button
                      onClick={() => handleVerifyResource(resource.id)}
                      className="flex items-center justify-center p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Verify resource"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {resource.broken_report_count && resource.broken_report_count > 0 && (
                  <div className="mt-3 flex items-center text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Reported broken {resource.broken_report_count} time{resource.broken_report_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
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
            Practice regularly with sample papers to boost your confidence and performance.
          </p>
        </motion.div>
      </div>

      {/* Question Paper Display Modal */}
      {displayedPaper && (
        <QuestionPaperDisplay
          resource={displayedPaper}
          onClose={handleCloseDisplay}
          onDownload={(resource, withSolutions) => {
            // Since we're only dealing with StudyResource in this context
            if ('downloadUrl' in resource) {
              downloadResource(resource as StudyResource, withSolutions);
            }
          }}
        />
      )}
    </div>
  );
};

export default EnhancedStudyResources;