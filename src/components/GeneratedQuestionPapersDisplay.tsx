import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Filter,
  Search,
  BookOpen,
  CheckCircle,
  Clock
} from 'lucide-react';
import { getGeneratedPapers } from '../utils/questionPaperApiUtils';
import { GeneratedQuestionPaper } from '../types';
import QuestionPaperDisplay from './QuestionPaperDisplay';

const GeneratedQuestionPapersDisplay: React.FC = () => {
  const [papers, setPapers] = useState<GeneratedQuestionPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<GeneratedQuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [displayedPaper, setDisplayedPaper] = useState<GeneratedQuestionPaper | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    class: 'all',
    subject: 'all',
    searchTerm: ''
  });

  // Load papers on component mount
  useEffect(() => {
    loadPapers();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [papers, filters]);

  const loadPapers = async () => {
    try {
      setLoading(true);
      // Load only approved papers for students/parents
      const loadedPapers = await getGeneratedPapers(undefined, undefined, true);
      setPapers(loadedPapers);
      setLoading(false);
    } catch (err) {
      setError('Failed to load question papers');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...papers];
    
    if (filters.class !== 'all') {
      result = result.filter(paper => paper.class === filters.class);
    }
    
    if (filters.subject !== 'all') {
      result = result.filter(paper => paper.subject === filters.subject);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(paper => 
        paper.title.toLowerCase().includes(term) ||
        paper.subject.toLowerCase().includes(term)
      );
    }
    
    setFilteredPapers(result);
  };

  const handleDownload = (paper: GeneratedQuestionPaper) => {
    // In a real implementation, this would download the actual PDF
    alert(`Downloading ${paper.title}`);
  };

  const handlePreview = (paper: GeneratedQuestionPaper) => {
    // Open paper in browser instead of just showing an alert
    setDisplayedPaper(paper);
  };

  const handleCloseDisplay = () => {
    setDisplayedPaper(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question papers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">CBSE Sample Question Papers</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 rounded-lg p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={filters.class}
                onChange={(e) => setFilters({...filters, class: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Classes</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Social Science">Social Science</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredPapers.length} approved CBSE sample paper{filteredPapers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No question papers found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <motion.div
              key={paper.id}
              whileHover={{ y: -5 }}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{paper.title}</h3>
                  <p className="text-sm text-gray-500">Class {paper.class} • {paper.subject}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>Variant {paper.variant}</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreview(paper)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => handleDownload(paper)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start">
          <BookOpen className="h-6 w-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">About CBSE Sample Papers</h3>
            <p className="text-blue-800">
              These sample question papers are generated according to the latest CBSE pattern and syllabus. 
              They include section-wise distribution, marking schemes, and solutions to help you prepare effectively 
              for your board examinations. Practice regularly to improve your performance.
            </p>
          </div>
        </div>
      </div>

      {/* Question Paper Display Modal */}
      {displayedPaper && (
        <QuestionPaperDisplay
          resource={displayedPaper}
          onClose={handleCloseDisplay}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default GeneratedQuestionPapersDisplay;