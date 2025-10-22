import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Brain, 
  BookOpen, 
  Calendar,
  Award,
  Clock,
  Zap,
  Star,
  ChevronRight,
  Lightbulb,
  RefreshCw,
  TrendingDown,
  Minus,
  Shield,
  Eye,
  FileText,
  Users,
  Activity,
  GitGraph,
  Compass,
  Sparkles
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from 'recharts';
import { getLearningInsights, getCachedInsights, SubjectPerformance as UtilsSubjectPerformance, LearningRecommendation as UtilsLearningRecommendation } from '../utils/learningInsightsUtils';
import { useAuth } from '../contexts/AuthContext';

interface SubjectPerformance {
  subject: string;
  currentScore: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  consistencyIndex: number;
  learningVelocity: number;
}

interface LearningRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  subject: string;
  action: string;
  type: 'weakness' | 'improvement' | 'maintenance' | 'motivation';
}

interface PerformancePrediction {
  week: string;
  predictedScore: number;
  confidence: number;
  explanation: string;
}

interface StudyPattern {
  day: string;
  hours: number;
}

interface PerformancePrediction {
  week: string;
  predictedScore: number;
  confidence: number;
  explanation: string;
}

// Extended interface for Recharts compatibility
interface SubjectDistributionItem {
  name: string;
  value: number;
  color: string;
  [key: string]: any; // Index signature for Recharts compatibility
}

interface Goal {
  id: string;
  subject: string;
  targetScore: number;
  currentProgress: number;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'off-track';
}

interface WeeklyActivity {
  date: string;
  studyHours: number;
  quizScore: number;
  assignmentCompletion: number;
}

const LearningInsightsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'goals' | 'analytics'>('overview');
  
  // State for all dashboard data
  const [dashboardData, setDashboardData] = useState<{
    subjectPerformance: SubjectPerformance[];
    studyPatterns: StudyPattern[];
    learningRecommendations: LearningRecommendation[];
    performancePredictions: PerformancePrediction[];
    subjectDistribution: SubjectDistributionItem[];
    overallPerformance: number;
    earlyWarnings: string[];
    weakTopics: string[];
    goals: Goal[];
    weeklyActivities: WeeklyActivity[];
  }>({
    subjectPerformance: [],
    studyPatterns: [],
    learningRecommendations: [],
    performancePredictions: [],
    subjectDistribution: [],
    overallPerformance: 0,
    earlyWarnings: [],
    weakTopics: [],
    goals: [],
    weeklyActivities: []
  });

  // Fetch learning insights data
  useEffect(() => {
    const fetchInsights = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Try to get cached data first for faster loading
        const cachedData = await getCachedInsights(user.id);
        if (cachedData) {
          setDashboardData({
            subjectPerformance: cachedData.subjectPerformance || [],
            studyPatterns: cachedData.studyPatterns || [],
            learningRecommendations: cachedData.learningRecommendations || [],
            performancePredictions: cachedData.performancePredictions || [],
            subjectDistribution: cachedData.subjectDistribution || [],
            overallPerformance: cachedData.overallPerformance || 0,
            earlyWarnings: [],
            weakTopics: [],
            goals: generateMockGoals(),
            weeklyActivities: generateMockWeeklyActivities()
          });
          setLoading(false);
          return;
        }
        
        // Fetch fresh data
        const data = await getLearningInsights(user.id);
        setDashboardData({
          subjectPerformance: data.subjectPerformance,
          studyPatterns: data.studyPatterns,
          learningRecommendations: data.learningRecommendations,
          performancePredictions: data.performancePredictions,
          subjectDistribution: data.subjectDistribution,
          overallPerformance: data.overallPerformance,
          earlyWarnings: data.earlyWarnings || [],
          weakTopics: data.weakTopics || [],
          goals: generateMockGoals(),
          weeklyActivities: generateMockWeeklyActivities()
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching learning insights:', err);
        setError('Failed to load learning insights. Please try again.');
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, [user?.id, retryCount]);

  // Generate mock goals for demonstration
  const generateMockGoals = (): Goal[] => {
    return [
      {
        id: '1',
        subject: 'Mathematics',
        targetScore: 90,
        currentProgress: 75,
        deadline: '2025-03-31',
        status: 'on-track'
      },
      {
        id: '2',
        subject: 'Science',
        targetScore: 85,
        currentProgress: 68,
        deadline: '2025-03-31',
        status: 'at-risk'
      },
      {
        id: '3',
        subject: 'English',
        targetScore: 95,
        currentProgress: 90,
        deadline: '2025-03-31',
        status: 'on-track'
      }
    ];
  };

  // Generate mock weekly activities for demonstration
  const generateMockWeeklyActivities = (): WeeklyActivity[] => {
    return [
      { date: 'Mon', studyHours: 2.5, quizScore: 85, assignmentCompletion: 100 },
      { date: 'Tue', studyHours: 3.0, quizScore: 92, assignmentCompletion: 100 },
      { date: 'Wed', studyHours: 1.5, quizScore: 78, assignmentCompletion: 50 },
      { date: 'Thu', studyHours: 4.0, quizScore: 88, assignmentCompletion: 100 },
      { date: 'Fri', studyHours: 2.0, quizScore: 95, assignmentCompletion: 100 },
      { date: 'Sat', studyHours: 3.5, quizScore: 82, assignmentCompletion: 75 },
      { date: 'Sun', studyHours: 1.0, quizScore: 0, assignmentCompletion: 0 }
    ];
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Calculate performance trend
  const performanceTrend = useMemo(() => {
    const improvements = dashboardData.subjectPerformance.filter(s => s.trend === 'up').length;
    const declines = dashboardData.subjectPerformance.filter(s => s.trend === 'down').length;
    
    if (improvements > declines) return 'improving';
    if (declines > improvements) return 'declining';
    return 'stable';
  }, [dashboardData.subjectPerformance]);

  // Calculate total study time
  const totalStudyTime = useMemo(() => {
    return dashboardData.studyPatterns.reduce((sum, day) => sum + day.hours, 0);
  }, [dashboardData.studyPatterns]);

  // Get high priority recommendations
  const highPriorityRecommendations = useMemo(() => {
    return dashboardData.learningRecommendations.filter(r => r.priority === 'high');
  }, [dashboardData.learningRecommendations]);

  // Get goal status counts
  const goalStatusCounts = useMemo(() => {
    return dashboardData.goals.reduce((acc, goal) => {
      acc[goal.status] = (acc[goal.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [dashboardData.goals]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your learning patterns with AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Insights</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
                <Sparkles className="h-8 w-8 text-purple-600 mr-3" />
                Learning Insights Dashboard 2.0
              </h1>
              <p className="text-gray-600">AI-powered analytics to boost your academic performance</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button
                onClick={handleRetry}
                className="flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'predictions'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <GitGraph className="h-4 w-4 inline mr-2" />
            Predictions
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'goals'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Target className="h-4 w-4 inline mr-2" />
            Goals
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Analytics
          </button>
        </div>

        {/* Early Warnings */}
        {dashboardData.earlyWarnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg font-medium text-red-800">Early Warnings</h3>
              </div>
              <div className="mt-2 ml-7">
                <ul className="list-disc list-inside text-red-700">
                  {dashboardData.earlyWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overall Performance</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.overallPerformance}%</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${dashboardData.overallPerformance}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Performance Trend</p>
                    <p className="text-xl font-bold text-gray-900">
                      {performanceTrend === 'improving' ? 'Improving' : 
                       performanceTrend === 'declining' ? 'Declining' : 'Stable'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    performanceTrend === 'improving' ? 'bg-green-100' : 
                    performanceTrend === 'declining' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {performanceTrend === 'improving' ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : performanceTrend === 'declining' ? (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    ) : (
                      <Minus className="h-6 w-6 text-yellow-600" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {performanceTrend === 'improving' 
                      ? 'You\'re making progress in most subjects' 
                      : performanceTrend === 'declining' 
                      ? 'Focus on areas that need improvement' 
                      : 'Maintaining consistent performance'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Study Time</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalStudyTime.toFixed(1)}h
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {totalStudyTime > 15 
                      ? 'Great consistency in study time!' 
                      : 'Try to increase your study hours'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Recommendations</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.learningRecommendations.length}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Lightbulb className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {highPriorityRecommendations.length} high priority actions
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Subject Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Subject Performance
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.subjectPerformance}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Score']}
                        labelFormatter={(value) => `Subject: ${value}`}
                      />
                      <Bar dataKey="currentScore" name="Current Score">
                        {dashboardData.subjectPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Weekly Activities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-purple-600" />
                  Weekly Activities
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dashboardData.weeklyActivities}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                      <Tooltip />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="studyHours"
                        name="Study Hours"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="quizScore"
                        name="Quiz Score"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Recommendations and Weak Topics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* AI Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-amber-600" />
                  Personalized AI Recommendations
                </h2>
                <div className="space-y-4">
                  {dashboardData.learningRecommendations.length > 0 ? (
                    dashboardData.learningRecommendations.map((recommendation, index) => (
                      <motion.div
                        key={recommendation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="font-bold text-gray-900">{recommendation.title}</h3>
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                                recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {recommendation.priority.toUpperCase()}
                              </span>
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                recommendation.type === 'weakness' ? 'bg-red-100 text-red-800' :
                                recommendation.type === 'improvement' ? 'bg-blue-100 text-blue-800' :
                                recommendation.type === 'maintenance' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {recommendation.type}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{recommendation.description}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <BookOpen className="h-4 w-4 mr-1" />
                              <span>{recommendation.subject}</span>
                            </div>
                          </div>
                          <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                            {recommendation.action}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Lightbulb className="h-12 w-12 mx-auto text-amber-400 mb-4" />
                      <p>No specific recommendations at this time. Keep up the good work!</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Weak Topics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Areas Needing Attention
                </h2>
                {dashboardData.weakTopics.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.weakTopics.map((topic, index) => (
                      <div 
                        key={index} 
                        className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100"
                      >
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                        <span className="text-red-800 font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="h-12 w-12 mx-auto text-green-400 mb-4" />
                    <p>No weak topics identified. Great job!</p>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Tip:</span> Focus on these areas with additional practice and seek help from teachers if needed.
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Performance Predictions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Performance Prediction
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dashboardData.performancePredictions}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (name === 'predictedScore') {
                            return [`${value}%`, 'Predicted Score'];
                          }
                          return [`${value}%`, 'Confidence'];
                        }}
                        labelFormatter={(value) => `Period: ${value}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predictedScore" 
                        name="Predicted Score" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="confidence" 
                        name="Confidence" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        strokeDasharray="3 3"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Prediction:</span> Based on your current learning patterns and performance trends.
                  </p>
                </div>
              </motion.div>

              {/* Subject Strength Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-amber-600" />
                  Subject Strength Distribution
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.subjectDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                      >
                        {dashboardData.subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Distribution']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Compass className="h-5 w-5 mr-2 text-purple-600" />
                AI-Powered Learning Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Learning Velocity
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Your learning speed has increased by 15% compared to last month.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Faster than 72% of students</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-green-600" />
                    Consistency Index
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Your performance consistency is at 82%, showing stable progress.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Consistent performer</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-100">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-amber-600" />
                    Peer Comparison
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    You're in the top 23% of students in your class.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '77%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Above average performance</p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <>
            {/* Goal Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                Academic Goals Tracker
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="font-bold text-gray-900 mb-2">Mathematics Goal</h3>
                  <p className="text-sm text-gray-600 mb-3">Score 90% by March</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Current progress: 75%</p>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      On Track
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                  <h3 className="font-bold text-gray-900 mb-2">Science Goal</h3>
                  <p className="text-sm text-gray-600 mb-3">Score 85% by March</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Current progress: 68%</p>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      At Risk
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-100">
                  <h3 className="font-bold text-gray-900 mb-2">English Goal</h3>
                  <p className="text-sm text-gray-600 mb-3">Score 95% by March</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Current progress: 90%</p>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      On Track
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Goals List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">All Goals</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.goals.map((goal) => (
                      <tr key={goal.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{goal.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{goal.targetScore}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                goal.status === 'on-track' ? 'bg-green-600' : 
                                goal.status === 'at-risk' ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${goal.currentProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{goal.currentProgress}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(goal.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            goal.status === 'on-track' ? 'bg-green-100 text-green-800' : 
                            goal.status === 'at-risk' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {goal.status.replace('-', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Study Patterns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Weekly Study Patterns
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dashboardData.studyPatterns}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} hours`, 'Study Time']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="hours" 
                        name="Study Hours" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Performance Radar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Radar className="h-5 w-5 mr-2 text-indigo-600" />
                  Performance Radar
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dashboardData.subjectPerformance}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="currentScore"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Study Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
                Personalized Study Recommendations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-blue-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    Focus Areas
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                      <span>Algebra fundamentals</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                      <span>Chemical reactions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                      <span>Grammar practice</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border border-green-200 rounded-xl p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-green-600" />
                    Improvement Strategies
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                      <span>Practice 10 algebra problems daily</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                      <span>Review chemistry notes weekly</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                      <span>Read one chapter per week</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border border-purple-200 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-purple-600" />
                    Quick Wins
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                      <span>Memorize multiplication tables</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                      <span>Complete pending assignments</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                      <span>Join study group for history</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Detailed Subject Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Subject-wise Analysis</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consistency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Velocity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.subjectPerformance.map((subject, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-4 w-4 rounded-full" style={{ backgroundColor: subject.color }}></div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{subject.subject}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subject.currentScore}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subject.previousScore}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {subject.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            ) : subject.trend === 'down' ? (
                              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                            ) : (
                              <Minus className="h-4 w-4 text-yellow-500 mr-1" />
                            )}
                            <span className={`text-sm ${
                              subject.trend === 'up' ? 'text-green-600' : 
                              subject.trend === 'down' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {subject.trend}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${subject.consistencyIndex}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{subject.consistencyIndex}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subject.learningVelocity > 0 ? '+' : ''}{subject.learningVelocity.toFixed(2)}/day
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default LearningInsightsDashboard;