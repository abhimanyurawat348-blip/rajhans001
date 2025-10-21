import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  User, 
  AlertTriangle, 
  BookOpen, 
  Calendar,
  Award,
  Clock,
  Zap,
  Star,
  ChevronRight,
  Lightbulb,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ChildPerformance {
  id: string;
  name: string;
  class: string;
  section: string;
  overallScore: number;
  trend: 'up' | 'down' | 'stable';
  subjects: {
    name: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  attendance: number;
  studyHours: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
}

const ParentLearningInsightsView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState('1');
  const [childPerformance, setChildPerformance] = useState<ChildPerformance | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Mock data for demonstration
  const mockChildren: ChildPerformance[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      class: '10',
      section: 'A',
      overallScore: 81,
      trend: 'up',
      subjects: [
        { name: 'Mathematics', score: 85, trend: 'up' },
        { name: 'Science', score: 72, trend: 'down' },
        { name: 'English', score: 90, trend: 'up' },
        { name: 'Social Studies', score: 78, trend: 'stable' }
      ],
      attendance: 92,
      studyHours: 17.5,
      riskLevel: 'low'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      class: '8',
      section: 'B',
      overallScore: 87,
      trend: 'stable',
      subjects: [
        { name: 'Mathematics', score: 88, trend: 'stable' },
        { name: 'Science', score: 85, trend: 'up' },
        { name: 'English', score: 90, trend: 'stable' },
        { name: 'Social Studies', score: 82, trend: 'down' }
      ],
      attendance: 95,
      studyHours: 14.2,
      riskLevel: 'low'
    }
  ];

  const mockRecommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Support Mathematics Learning',
      description: 'Rahul is struggling with Science. Consider additional tutoring or online resources.',
      priority: 'high',
      action: 'Explore Resources'
    },
    {
      id: '2',
      title: 'Encourage Consistent Study Time',
      description: 'Maintaining 17+ hours of study per week is excellent. Help Rahul keep this routine.',
      priority: 'medium',
      action: 'Set Schedule'
    },
    {
      id: '3',
      title: 'Celebrate English Achievement',
      description: 'Rahul is excelling in English. Acknowledge his hard work and encourage him to help classmates.',
      priority: 'low',
      action: 'Praise Effort'
    }
  ];

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find selected child
      const child = mockChildren.find(c => c.id === selectedChild) || mockChildren[0];
      setChildPerformance(child);
      setRecommendations(mockRecommendations);
      
      setLoading(false);
    };
    
    loadData();
  }, [selectedChild]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <div className="h-4 w-4"></div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your child's insights...</p>
        </div>
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Child's Learning Insights</h1>
              <p className="text-gray-600">Track progress and discover ways to support learning at home</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Select Child</label>
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {mockChildren.map(child => (
                    <option key={child.id} value={child.id}>{child.name} (Class {child.class})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {childPerformance && (
          <>
            {/* Child Overview */}
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
                    <p className="text-3xl font-bold text-gray-900">{childPerformance.overallScore}%</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${childPerformance.overallScore}%` }}
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
                    <p className="text-sm text-gray-600">Attendance</p>
                    <p className="text-3xl font-bold text-gray-900">{childPerformance.attendance}%</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {childPerformance.attendance > 90 
                      ? 'Excellent attendance!' 
                      : childPerformance.attendance > 80 
                      ? 'Good attendance' 
                      : 'Needs improvement'}
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
                    <p className="text-3xl font-bold text-gray-900">{childPerformance.studyHours}h</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {childPerformance.studyHours > 15 
                      ? 'Consistent study habits' 
                      : 'Encourage more study time'}
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
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <p className="text-xl font-bold text-gray-900">
                      {childPerformance.riskLevel.charAt(0).toUpperCase() + childPerformance.riskLevel.slice(1)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${getRiskColor(childPerformance.riskLevel)}`}>
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {childPerformance.riskLevel === 'high' 
                      ? 'Needs immediate attention' 
                      : childPerformance.riskLevel === 'medium' 
                      ? 'Monitor progress' 
                      : 'On track for success'}
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
                      data={childPerformance.subjects}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Score']}
                        labelFormatter={(value) => `Subject: ${value}`}
                      />
                      <Bar dataKey="score" name="Score">
                        {childPerformance.subjects.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.score >= 85 ? '#10b981' : entry.score >= 70 ? '#f59e0b' : '#ef4444'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Performance Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Performance Trend
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', score: 75 },
                        { month: 'Feb', score: 78 },
                        { month: 'Mar', score: 80 },
                        { month: 'Apr', score: 82 },
                        { month: 'May', score: 85 },
                        { month: 'Jun', score: 81 },
                        { month: 'Jul', score: 83 },
                        { month: 'Aug', score: 85 },
                        { month: 'Sep', score: 81 },
                        { month: 'Oct', score: 85 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Score']}
                        labelFormatter={(value) => `Month: ${value}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        name="Performance" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Personalized Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
                  How You Can Help
                </h2>
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <motion.div
                      key={recommendation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
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
                        </div>
                        <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                          {recommendation.action}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-purple-600" />
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  <button className="w-full text-left p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium text-gray-900">Schedule Parent-Teacher Meeting</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium text-gray-900">Explore Learning Resources</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-amber-600 mr-3" />
                      <span className="font-medium text-gray-900">Set Study Goals</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="font-medium text-gray-900">Create Study Schedule</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Subject Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                Subject Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {childPerformance.subjects.map((subject, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900">{subject.name}</h3>
                      <div className={`p-2 rounded-full ${
                        subject.score >= 85 ? 'bg-green-100' : 
                        subject.score >= 70 ? 'bg-amber-100' : 'bg-red-100'
                      }`}>
                        {getTrendIcon(subject.trend)}
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2 ${
                      subject.score >= 85 ? 'text-green-600' : 
                      subject.score >= 70 ? 'text-amber-600' : 'text-red-600'
                    }">
                      {subject.score}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          subject.score >= 85 ? 'bg-green-600' : 
                          subject.score >= 70 ? 'bg-amber-600' : 'bg-red-600'
                        }`} 
                        style={{ width: `${subject.score}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {subject.trend === 'up' 
                        ? 'Improving' 
                        : subject.trend === 'down' 
                        ? 'Needs attention' 
                        : 'Stable'}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentLearningInsightsView;