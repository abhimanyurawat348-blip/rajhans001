import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Check, 
  X, 
  Eye, 
  Download, 
  Filter,
  Search,
  Clock,
  User,
  Calendar,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  createBlueprint, 
  getBlueprintsByClassAndSubject, 
  generateQuestionPaper,
  getGeneratedPapersByBlueprint,
  approveQuestionPaper,
  getPapersPendingApproval
} from '../utils/questionPaperBlueprintUtils';
import { QuestionPaperBlueprint, GeneratedQuestionPaper } from '../types';

const QuestionPaperManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'blueprints' | 'generated' | 'pending'>('blueprints');
  const [blueprints, setBlueprints] = useState<QuestionPaperBlueprint[]>([]);
  const [generatedPapers, setGeneratedPapers] = useState<GeneratedQuestionPaper[]>([]);
  const [pendingPapers, setPendingPapers] = useState<GeneratedQuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Form states
  const [blueprintForm, setBlueprintForm] = useState({
    class: '10',
    subject: 'Mathematics',
    title: '',
    total_marks: 80,
    duration: '3 hours',
    difficulty_distribution: {
      easy: 30,
      medium: 50,
      hard: 20
    }
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    class: 'all',
    subject: 'all',
    searchTerm: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load blueprints
      const loadedBlueprints = await getBlueprintsByClassAndSubject('10', 'Mathematics');
      setBlueprints(loadedBlueprints);
      
      // Load generated papers
      if (loadedBlueprints.length > 0) {
        const papers = await getGeneratedPapersByBlueprint(loadedBlueprints[0].id);
        setGeneratedPapers(papers);
      }
      
      // Load pending papers (for teachers)
      if (user.role === 'teacher') {
        const pending = await getPapersPendingApproval(user.id);
        setPendingPapers(pending);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleCreateBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newBlueprint = await createBlueprint({
        ...blueprintForm,
        sections: [
          {
            name: 'Section A',
            question_types: [
              {
                type: 'MCQ',
                count: 10,
                marks_per_question: 1,
                total_marks: 10
              }
            ],
            total_marks: 10
          }
        ],
        chapter_weightage: {},
        bloom_taxonomy_distribution: {
          remember: 20,
          understand: 30,
          apply: 25,
          analyze: 15,
          evaluate: 7,
          create: 3
        },
        is_active: true
      });
      
      setBlueprints([...blueprints, newBlueprint]);
      setShowCreateForm(false);
      setBlueprintForm({
        class: '10',
        subject: 'Mathematics',
        title: '',
        total_marks: 80,
        duration: '3 hours',
        difficulty_distribution: {
          easy: 30,
          medium: 50,
          hard: 20
        }
      });
    } catch (err) {
      setError('Failed to create blueprint');
    }
  };

  const handleGeneratePapers = async (blueprintId: string) => {
    if (!user) return;
    
    try {
      const blueprint = blueprints.find(b => b.id === blueprintId);
      if (!blueprint) return;
      
      // Generate 3 variants
      for (let i = 1; i <= 3; i++) {
        const paper = await generateQuestionPaper(blueprint, i, user.id);
        setGeneratedPapers([...generatedPapers, paper]);
      }
    } catch (err) {
      setError('Failed to generate papers');
    }
  };

  const handleApprovePaper = async (paperId: string) => {
    if (!user) return;
    
    try {
      await approveQuestionPaper(paperId, user.id);
      setPendingPapers(pendingPapers.filter(p => p.id !== paperId));
    } catch (err) {
      setError('Failed to approve paper');
    }
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
          <X className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Question Paper Management</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Blueprint
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('blueprints')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'blueprints'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Blueprints
          </button>
          <button
            onClick={() => setActiveTab('generated')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'generated'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Generated Papers
          </button>
          {user?.role === 'teacher' && (
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Approval
            </button>
          )}
        </nav>
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
                  placeholder="Search..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create Blueprint Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-6 mb-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Blueprint</h3>
          <form onSubmit={handleCreateBlueprint} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={blueprintForm.class}
                  onChange={(e) => setBlueprintForm({...blueprintForm, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={blueprintForm.subject}
                  onChange={(e) => setBlueprintForm({...blueprintForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={blueprintForm.title}
                onChange={(e) => setBlueprintForm({...blueprintForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter blueprint title"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                <input
                  type="number"
                  value={blueprintForm.total_marks}
                  onChange={(e) => setBlueprintForm({...blueprintForm, total_marks: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={blueprintForm.duration}
                  onChange={(e) => setBlueprintForm({...blueprintForm, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3 hours"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Blueprint
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Blueprints Tab */}
      {activeTab === 'blueprints' && (
        <div>
          {blueprints.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No blueprints found</h3>
              <p className="text-gray-500">Get started by creating a new question paper blueprint.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blueprints.map((blueprint) => (
                <motion.div
                  key={blueprint.id}
                  whileHover={{ y: -5 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{blueprint.title}</h3>
                      <p className="text-sm text-gray-500">Class {blueprint.class} • {blueprint.subject}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Marks</span>
                      <span className="font-medium">{blueprint.total_marks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-medium">{blueprint.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGeneratePapers(blueprint.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Generate Papers
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Generated Papers Tab */}
      {activeTab === 'generated' && (
        <div>
          {generatedPapers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No generated papers</h3>
              <p className="text-gray-500">Generate papers from existing blueprints.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedPapers.map((paper) => (
                    <tr key={paper.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{paper.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.variant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {paper.is_approved ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pending Approval Tab */}
      {activeTab === 'pending' && user?.role === 'teacher' && (
        <div>
          {pendingPapers.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No papers pending approval</h3>
              <p className="text-gray-500">All papers have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPapers.map((paper) => (
                <motion.div
                  key={paper.id}
                  whileHover={{ y: -2 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{paper.title}</h3>
                      <p className="text-sm text-gray-500">Class {paper.class} • {paper.subject} • Variant {paper.variant}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>Created by {paper.created_by}</span>
                        <Calendar className="h-4 w-4 ml-3 mr-1" />
                        <span>{paper.created_at.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprovePaper(paper.id)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button className="flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionPaperManagement;