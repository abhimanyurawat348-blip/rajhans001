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
  Shield
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { getLearningInsights, getCachedInsights } from '../utils/learningInsightsUtils';
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
  type: string;
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

const LearningInsightsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
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
  }>({
    subjectPerformance: [],
    studyPatterns: [],
    learningRecommendations: [],
    performancePredictions: [],
    subjectDistribution: [],
    overallPerformance: 0,
    earlyWarnings: [],
    weakTopics: []
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
            weakTopics: []
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
          weakTopics: data.weakTopics || []
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your learning patterns...</p>
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Learning Insights Dashboard</h1>
              <p className="text-gray-600">Personalized analytics to boost your academic performance</p>
            </div>
            <div className="mt-4 md:mt-0">
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

        {/* Timeframe Selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['week', 'month', 'quarter'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

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
        </div>

        {/* Additional Charts */}
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
              Personalized Recommendations
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

        {/* Goal Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600" />
            Goal Tracker
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-2">Mathematics Goal</h3>
              <p className="text-sm text-gray-600 mb-3">Score 90% by March</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-500">Current progress: 75%</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
              <h3 className="font-bold text-gray-900 mb-2">Science Goal</h3>
              <p className="text-sm text-gray-600 mb-3">Score 85% by March</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <p className="text-xs text-gray-500">Current progress: 68%</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">English Goal</h3>
              <p className="text-sm text-gray-600 mb-3">Score 95% by March</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <p className="text-xs text-gray-500">Current progress: 90%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningInsightsDashboard;