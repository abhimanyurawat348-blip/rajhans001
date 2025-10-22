import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
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
  BookOpen,
  Brain,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  BarChart3,
  PieChart,
  Upload,
  Save,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Blueprint {
  id: string;
  class: string;
  subject: string;
  title: string;
  total_marks: number;
  duration: string;
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  topics: string[];
  is_active: boolean;
  created_at: Date;
  created_by: string;
}

interface GeneratedPaper {
  id: string;
  blueprint_id: string;
  class: string;
  subject: string;
  title: string;
  variant: number;
  is_approved: boolean;
  created_by: string;
  created_at: Date;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  type: 'mcq' | 'short' | 'long' | 'very_long';
}

interface AnalyticsData {
  blueprint_id: string;
  avg_difficulty_score: number;
  topic_coverage: { topic: string; coverage: number }[];
  question_quality_score: number;
  student_performance_prediction: number;
}

const AIQuestionPaperGenerator: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'blueprints' | 'generated' | 'pending' | 'analytics'>('blueprints');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Mock data for demonstration
  const [blueprints, setBlueprints] = useState<Blueprint[]>([
    {
      id: '1',
      class: '10',
      subject: 'Mathematics',
      title: 'Algebra & Geometry Blueprint',
      total_marks: 80,
      duration: '3 hours',
      difficulty_distribution: {
        easy: 30,
        medium: 50,
        hard: 20
      },
      topics: ['Algebra', 'Geometry', 'Trigonometry'],
      is_active: true,
      created_at: new Date('2025-10-15'),
      created_by: 'Teacher A'
    },
    {
      id: '2',
      class: '12',
      subject: 'Physics',
      title: 'Mechanics & Thermodynamics',
      total_marks: 70,
      duration: '3 hours',
      difficulty_distribution: {
        easy: 25,
        medium: 55,
        hard: 20
      },
      topics: ['Mechanics', 'Thermodynamics', 'Waves'],
      is_active: true,
      created_at: new Date('2025-10-10'),
      created_by: 'Teacher B'
    }
  ]);
  
  const [generatedPapers, setGeneratedPapers] = useState<GeneratedPaper[]>([
    {
      id: '101',
      blueprint_id: '1',
      class: '10',
      subject: 'Mathematics',
      title: 'Algebra & Geometry Blueprint - Variant 1',
      variant: 1,
      is_approved: true,
      created_by: 'Teacher A',
      created_at: new Date('2025-10-20'),
      questions: [
        {
          id: 'q1',
          text: 'Solve the quadratic equation: x² - 5x + 6 = 0',
          marks: 3,
          difficulty: 'easy',
          topic: 'Algebra',
          type: 'short'
        },
        {
          id: 'q2',
          text: 'Prove that the sum of angles in a triangle is 180°',
          marks: 5,
          difficulty: 'medium',
          topic: 'Geometry',
          type: 'long'
        }
      ]
    },
    {
      id: '102',
      blueprint_id: '1',
      class: '10',
      subject: 'Mathematics',
      title: 'Algebra & Geometry Blueprint - Variant 2',
      variant: 2,
      is_approved: false,
      created_by: 'Teacher A',
      created_at: new Date('2025-10-20'),
      questions: [
        {
          id: 'q1',
          text: 'Factorize: x² - 9',
          marks: 2,
          difficulty: 'easy',
          topic: 'Algebra',
          type: 'short'
        }
      ]
    }
  ]);
  
  const [pendingPapers, setPendingPapers] = useState<GeneratedPaper[]>([
    {
      id: '201',
      blueprint_id: '2',
      class: '12',
      subject: 'Physics',
      title: 'Mechanics & Thermodynamics - Variant 1',
      variant: 1,
      is_approved: false,
      created_by: 'Teacher B',
      created_at: new Date('2025-10-18'),
      questions: [
        {
          id: 'q1',
          text: 'State Newton\'s First Law of Motion',
          marks: 2,
          difficulty: 'easy',
          topic: 'Mechanics',
          type: 'short'
        }
      ]
    }
  ]);
  
  // Mock analytics data
  const [analyticsData] = useState<AnalyticsData[]>([
    {
      blueprint_id: '1',
      avg_difficulty_score: 2.3,
      topic_coverage: [
        { topic: 'Algebra', coverage: 40 },
        { topic: 'Geometry', coverage: 35 },
        { topic: 'Trigonometry', coverage: 25 }
      ],
      question_quality_score: 8.2,
      student_performance_prediction: 72
    },
    {
      blueprint_id: '2',
      avg_difficulty_score: 2.7,
      topic_coverage: [
        { topic: 'Mechanics', coverage: 50 },
        { topic: 'Thermodynamics', coverage: 30 },
        { topic: 'Waves', coverage: 20 }
      ],
      question_quality_score: 7.8,
      student_performance_prediction: 68
    }
  ]);
  
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
    },
    topics: '' // Comma-separated topics
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    class: 'all',
    subject: 'all',
    searchTerm: ''
  });

  const handleCreateBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBlueprint: Blueprint = {
      id: (blueprints.length + 1).toString(),
      ...blueprintForm,
      topics: blueprintForm.topics.split(',').map(topic => topic.trim()).filter(topic => topic),
      is_active: true,
      created_at: new Date(),
      created_by: user?.fullName || 'Teacher'
    };
    
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
      },
      topics: ''
    });
  };

  const handleGeneratePapers = (blueprintId: string) => {
    const blueprint = blueprints.find(b => b.id === blueprintId);
    if (!blueprint) return;
    
    // Generate 3 variants
    for (let i = 1; i <= 3; i++) {
      const newPaper: GeneratedPaper = {
        id: `${blueprintId}${i}`,
        blueprint_id: blueprintId,
        class: blueprint.class,
        subject: blueprint.subject,
        title: `${blueprint.title} - Variant ${i}`,
        variant: i,
        is_approved: false,
        created_by: user?.fullName || 'Teacher',
        created_at: new Date(),
        questions: []
      };
      
      setGeneratedPapers([...generatedPapers, newPaper]);
    }
    
    alert(`Generated 3 variants for ${blueprint.title}`);
  };

  const handleApprovePaper = (paperId: string) => {
    setPendingPapers(pendingPapers.filter(p => p.id !== paperId));
    const paper = generatedPapers.find(p => p.id === paperId);
    if (paper) {
      const updatedPaper = { ...paper, is_approved: true };
      setGeneratedPapers(generatedPapers.map(p => p.id === paperId ? updatedPaper : p));
    }
  };

  const handleRejectPaper = (paperId: string) => {
    setPendingPapers(pendingPapers.filter(p => p.id !== paperId));
    setGeneratedPapers(generatedPapers.filter(p => p.id !== paperId));
  };

  const viewAnalytics = (blueprintId: string) => {
    setSelectedBlueprint(blueprints.find(b => b.id === blueprintId) || null);
    setShowAnalytics(true);
  };

  const getAnalyticsForBlueprint = (blueprintId: string) => {
    return analyticsData.find(a => a.blueprint_id === blueprintId);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
            AI Question Paper Generator
          </h2>
          <p className="text-gray-600">Create, generate, and manage question papers with AI assistance</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
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
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
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
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
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
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topics (comma separated)</label>
              <input
                type="text"
                value={blueprintForm.topics}
                onChange={(e) => setBlueprintForm({...blueprintForm, topics: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Algebra, Geometry, Trigonometry"
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Easy Questions (%)</label>
                <input
                  type="number"
                  value={blueprintForm.difficulty_distribution.easy}
                  onChange={(e) => setBlueprintForm({
                    ...blueprintForm, 
                    difficulty_distribution: {
                      ...blueprintForm.difficulty_distribution,
                      easy: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medium Questions (%)</label>
                <input
                  type="number"
                  value={blueprintForm.difficulty_distribution.medium}
                  onChange={(e) => setBlueprintForm({
                    ...blueprintForm, 
                    difficulty_distribution: {
                      ...blueprintForm.difficulty_distribution,
                      medium: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hard Questions (%)</label>
                <input
                  type="number"
                  value={blueprintForm.difficulty_distribution.hard}
                  onChange={(e) => setBlueprintForm({
                    ...blueprintForm, 
                    difficulty_distribution: {
                      ...blueprintForm.difficulty_distribution,
                      hard: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
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

      {/* Analytics Modal */}
      {showAnalytics && selectedBlueprint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Analytics for {selectedBlueprint.title}</h3>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                    Difficulty Distribution
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Easy</span>
                        <span className="font-medium">{selectedBlueprint.difficulty_distribution.easy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${selectedBlueprint.difficulty_distribution.easy}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Medium</span>
                        <span className="font-medium">{selectedBlueprint.difficulty_distribution.medium}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${selectedBlueprint.difficulty_distribution.medium}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Hard</span>
                        <span className="font-medium">{selectedBlueprint.difficulty_distribution.hard}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${selectedBlueprint.difficulty_distribution.hard}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Target className="h-5 w-5 text-purple-600 mr-2" />
                    Performance Prediction
                  </h4>
                  <div className="flex items-center justify-center h-32">
                    {getAnalyticsForBlueprint(selectedBlueprint.id) ? (
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600">
                          {getAnalyticsForBlueprint(selectedBlueprint.id)?.student_performance_prediction}%
                        </div>
                        <div className="text-gray-600 mt-2">Predicted Average Score</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No data available</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-5 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <PieChart className="h-5 w-5 text-green-600 mr-2" />
                    Topic Coverage
                  </h4>
                  {getAnalyticsForBlueprint(selectedBlueprint.id) ? (
                    <div className="space-y-3">
                      {getAnalyticsForBlueprint(selectedBlueprint.id)?.topic_coverage.map((topic, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{topic.topic}</span>
                            <span className="font-medium">{topic.coverage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${topic.coverage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">No data available</div>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Zap className="h-5 w-5 text-amber-600 mr-2" />
                    Quality Metrics
                  </h4>
                  {getAnalyticsForBlueprint(selectedBlueprint.id) ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Question Quality Score</span>
                          <span className="font-medium">{getAnalyticsForBlueprint(selectedBlueprint.id)?.question_quality_score}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(getAnalyticsForBlueprint(selectedBlueprint.id)?.question_quality_score || 0) * 10}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Average Difficulty</span>
                          <span className="font-medium">{getAnalyticsForBlueprint(selectedBlueprint.id)?.avg_difficulty_score?.toFixed(1)}/3</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${((getAnalyticsForBlueprint(selectedBlueprint.id)?.avg_difficulty_score || 0) / 3) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No data available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Difficulty</span>
                      <span className="font-medium">
                        E:{blueprint.difficulty_distribution.easy}% 
                        M:{blueprint.difficulty_distribution.medium}% 
                        H:{blueprint.difficulty_distribution.hard}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {blueprint.topics.slice(0, 3).map((topic, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {topic}
                        </span>
                      ))}
                      {blueprint.topics.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{blueprint.topics.length - 3} more
                        </span>
                      )}
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
                    <button 
                      onClick={() => viewAnalytics(blueprint.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                    >
                      <BarChart3 className="h-4 w-4" />
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
                        <div className="text-sm text-gray-500">By {paper.created_by}</div>
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
                          <button className="text-gray-600 hover:text-gray-900">
                            <Upload className="h-4 w-4" />
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
                      <button
                        onClick={() => handleRejectPaper(paper.id)}
                        className="flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Preview Questions</h4>
                    <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                      {paper.questions.length > 0 ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {paper.questions.slice(0, 3).map((q, index) => (
                            <li key={index} className="truncate">• {q.text}</li>
                          ))}
                          {paper.questions.length > 3 && (
                            <li className="text-gray-500">+{paper.questions.length - 3} more questions</li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No questions generated yet</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Blueprints</p>
                  <p className="text-2xl font-bold text-gray-900">{blueprints.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Generated Papers</p>
                  <p className="text-2xl font-bold text-gray-900">{generatedPapers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
              <div className="flex items-center">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPapers.length}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Blueprint Performance Overview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blueprint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papers Generated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Quality Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blueprints.map((blueprint) => {
                    const analytics = getAnalyticsForBlueprint(blueprint.id);
                    const paperCount = generatedPapers.filter(p => p.blueprint_id === blueprint.id).length;
                    
                    return (
                      <tr key={blueprint.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{blueprint.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {blueprint.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {blueprint.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {paperCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {analytics ? `${analytics.question_quality_score.toFixed(1)}/10` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {analytics ? `${analytics.student_performance_prediction}%` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => viewAnalytics(blueprint.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Features Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 text-purple-600 mr-2" />
          AI-Powered Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Zap className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-900">Smart Question Generation</h4>
            </div>
            <p className="text-sm text-gray-600">
              AI generates questions aligned with NCERT/CBSE curriculum and difficulty levels.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-gray-900">Blueprint Validation</h4>
            </div>
            <p className="text-sm text-gray-600">
              Automatically validates blueprints against curriculum guidelines and learning objectives.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-amber-600 mr-2" />
              <h4 className="font-medium text-gray-900">Performance Analytics</h4>
            </div>
            <p className="text-sm text-gray-600">
              Analyze question paper effectiveness based on student performance data.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
              <h4 className="font-medium text-gray-900">Adaptive Difficulty</h4>
            </div>
            <p className="text-sm text-gray-600">
              Adjusts question difficulty based on student performance trends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuestionPaperGenerator;