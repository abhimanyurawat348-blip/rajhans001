import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Users,
  DollarSign,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  RefreshCw,
  Download,
  Share,
  Settings,
  Eye,
  Award,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface Prediction {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  category: 'growth' | 'risk' | 'opportunity' | 'trend';
  data: any[];
}

interface AIMetric {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  description: string;
}

const PredictiveAnalytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3m' | '6m' | '1y' | '2y'>('6m');
  const [isLoading, setIsLoading] = useState(false);

  // Mock AI-powered predictions
  const predictions: Prediction[] = [
    {
      id: 'user-growth',
      title: 'User Growth Acceleration',
      description: 'AI predicts 35% increase in user acquisition based on current trends and market analysis',
      confidence: 92,
      impact: 'high',
      timeframe: 'Q2 2025',
      category: 'growth',
      data: [
        { month: 'Jan', actual: 12000, predicted: 12500 },
        { month: 'Feb', actual: 13500, predicted: 14200 },
        { month: 'Mar', actual: 14800, predicted: 15600 },
        { month: 'Apr', predicted: 17200 },
        { month: 'May', predicted: 18900 },
        { month: 'Jun', predicted: 20800 }
      ]
    },
    {
      id: 'market-expansion',
      title: 'Emerging Market Opportunity',
      description: 'AI identifies Southeast Asia as high-potential market with 40% adoption rate potential',
      confidence: 88,
      impact: 'high',
      timeframe: '2025',
      category: 'opportunity',
      data: []
    },
    {
      id: 'competition-threat',
      title: 'Competitive Pressure Alert',
      description: 'New competitor entering K-12 education space may impact market share by 8-12%',
      confidence: 76,
      impact: 'medium',
      timeframe: 'Q4 2024',
      category: 'risk',
      data: []
    },
    {
      id: 'feature-adoption',
      title: 'AI Features Adoption Surge',
      description: 'Predictive analytics shows 65% increase in premium feature adoption over next 6 months',
      confidence: 94,
      impact: 'high',
      timeframe: 'Q3 2025',
      category: 'trend',
      data: [
        { feature: 'AI Tutor', current: 45, predicted: 78 },
        { feature: 'Smart Analytics', current: 32, predicted: 65 },
        { feature: 'Auto Grading', current: 28, predicted: 52 },
        { feature: 'Predictive Learning', current: 15, predicted: 45 }
      ]
    }
  ];

  const aiMetrics: AIMetric[] = [
    {
      title: 'Prediction Accuracy',
      value: '94.2%',
      change: 2.1,
      trend: 'up',
      icon: <Target className="h-6 w-6" />,
      description: 'AI model prediction accuracy rate'
    },
    {
      title: 'Data Processing',
      value: '2.8M',
      change: 15.3,
      trend: 'up',
      icon: <Zap className="h-6 w-6" />,
      description: 'Data points processed daily'
    },
    {
      title: 'Insight Generation',
      value: '1,247',
      change: 8.7,
      trend: 'up',
      icon: <Lightbulb className="h-6 w-6" />,
      description: 'Automated insights generated weekly'
    },
    {
      title: 'Model Performance',
      value: '98.7%',
      change: -0.3,
      trend: 'down',
      icon: <Activity className="h-6 w-6" />,
      description: 'Overall AI system performance score'
    }
  ];

  const growthProjection = [
    { month: 'Current', users: 15420, revenue: 89250 },
    { month: '3M', users: 18500, revenue: 112000 },
    { month: '6M', users: 22100, revenue: 138000 },
    { month: '9M', users: 26500, revenue: 172000 },
    { month: '12M', users: 31800, revenue: 215000 },
    { month: '18M', users: 38200, revenue: 268000 },
    { month: '24M', users: 45800, revenue: 335000 }
  ];

  const marketAnalysis = [
    { subject: 'Mathematics', performance: 85, potential: 92, gap: 7 },
    { subject: 'Science', performance: 78, potential: 88, gap: 10 },
    { subject: 'English', performance: 82, potential: 89, gap: 7 },
    { subject: 'History', performance: 75, potential: 85, gap: 10 },
    { subject: 'Computer Science', performance: 88, potential: 95, gap: 7 }
  ];

  const riskAssessment = [
    { factor: 'Market Competition', risk: 25, mitigation: 80 },
    { factor: 'Technology Changes', risk: 15, mitigation: 90 },
    { factor: 'Regulatory Changes', risk: 20, mitigation: 75 },
    { factor: 'Economic Factors', risk: 10, mitigation: 85 },
    { factor: 'Operational Risks', risk: 5, mitigation: 95 }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'growth': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'opportunity': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'risk': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'trend': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => setIsLoading(false), 3000);
  };

  const handleExportInsights = () => {
    console.log('Exporting AI insights...');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Predictive Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Machine learning-powered insights and future projections for strategic decision making
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="3m">3 Months</option>
                <option value="6m">6 Months</option>
                <option value="1y">1 Year</option>
                <option value="2y">2 Years</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Analyzing...' : 'Run Analysis'}
              </button>
              <button
                onClick={handleExportInsights}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* AI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {aiMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Growth Projections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Growth Projections</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={growthProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'users' ? `${value.toLocaleString()} users` : `$${value.toLocaleString()}`,
                name === 'users' ? 'Users' : 'Revenue'
              ]} />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="revenue" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">45.8K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Projected Users (2Y)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$335K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Projected Revenue (2Y)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">197%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">15</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">New Markets</div>
            </div>
          </div>
        </motion.div>

        {/* AI Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(prediction.category)}`}>
                      {prediction.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(prediction.impact)}`}>
                      {prediction.impact} impact
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {prediction.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {prediction.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {prediction.confidence}% confidence
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {prediction.timeframe}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {prediction.data.length > 0 && (
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={150}>
                    {prediction.id === 'user-growth' ? (
                      <LineChart data={prediction.data}>
                        <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                        <Tooltip />
                      </LineChart>
                    ) : (
                      <BarChart data={prediction.data}>
                        <Bar dataKey="current" fill="#3b82f6" />
                        <Bar dataKey="predicted" fill="#10b981" />
                        <Tooltip />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Market Analysis & Risk Assessment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Subject Performance Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={marketAnalysis}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Current Performance" dataKey="performance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Potential" dataKey="potential" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Risk Assessment Matrix</h3>
            <div className="space-y-4">
              {riskAssessment.map((risk) => (
                <div key={risk.factor} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{risk.factor}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-red-600">Risk: {risk.risk}%</span>
                      <span className="text-xs text-green-600">Mitigation: {risk.mitigation}%</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${risk.risk}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${risk.mitigation}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Insights Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white"
        >
          <div className="text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">AI-Powered Strategic Insights</h3>
            <p className="text-lg mb-8 opacity-90">
              Advanced machine learning algorithms provide data-driven predictions and strategic recommendations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">94.2%</div>
                <div className="text-sm opacity-80">Prediction Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">15</div>
                <div className="text-sm opacity-80">Strategic Markets Identified</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">$335K</div>
                <div className="text-sm opacity-80">Revenue Projection (2Y)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">197%</div>
                <div className="text-sm opacity-80">Growth Potential</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                View Detailed Report
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Schedule AI Consultation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;