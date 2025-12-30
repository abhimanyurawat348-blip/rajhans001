import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Globe,
  Shield,
  Smartphone,
  Cloud,
  Database,
  Cpu,
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Download,
  Share,
  Settings,
  Eye,
  Calendar,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description: string;
}

interface GrowthData {
  month: string;
  users: number;
  revenue: number;
  engagement: number;
  schools: number;
}

interface InvestorMetrics {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  growthRate: number;
  churnRate: number;
  schoolsOnboarded: number;
  apiCalls: number;
  uptime: number;
}

const InvestorDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from APIs
  const metrics: InvestorMetrics = {
    totalUsers: 15420,
    activeUsers: 12850,
    monthlyRevenue: 89250,
    growthRate: 23.5,
    churnRate: 2.1,
    schoolsOnboarded: 47,
    apiCalls: 2847391,
    uptime: 99.97
  };

  const growthData: GrowthData[] = [
    { month: 'Jan', users: 8500, revenue: 45000, engagement: 78, schools: 25 },
    { month: 'Feb', users: 9200, revenue: 52000, engagement: 82, schools: 28 },
    { month: 'Mar', users: 10100, revenue: 61000, engagement: 85, schools: 32 },
    { month: 'Apr', users: 11200, revenue: 68000, engagement: 88, schools: 35 },
    { month: 'May', users: 12400, revenue: 75000, engagement: 91, schools: 38 },
    { month: 'Jun', users: 13500, revenue: 82000, engagement: 94, schools: 41 },
    { month: 'Jul', users: 14200, revenue: 86000, engagement: 96, schools: 44 },
    { month: 'Aug', users: 14900, revenue: 88500, engagement: 97, schools: 46 },
    { month: 'Sep', users: 15420, revenue: 89250, engagement: 98, schools: 47 }
  ];

  const userSegmentData = [
    { name: 'Students', value: 65, color: '#3b82f6' },
    { name: 'Teachers', value: 20, color: '#10b981' },
    { name: 'Parents', value: 12, color: '#f59e0b' },
    { name: 'Admins', value: 3, color: '#ef4444' }
  ];

  const revenueStreams = [
    { name: 'Subscriptions', value: 68, color: '#6366f1' },
    { name: 'Premium Features', value: 22, color: '#a855f7' },
    { name: 'Integrations', value: 7, color: '#14b8a6' },
    { name: 'Consulting', value: 3, color: '#f43f5e' }
  ];

  const metricCards: MetricCard[] = [
    {
      title: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      change: 12.5,
      changeType: 'positive',
      icon: <Users className="h-6 w-6" />,
      description: 'Active registered users across all platforms'
    },
    {
      title: 'Monthly Revenue',
      value: `$${metrics.monthlyRevenue.toLocaleString()}`,
      change: 18.2,
      changeType: 'positive',
      icon: <DollarSign className="h-6 w-6" />,
      description: 'Recurring revenue from subscriptions and services'
    },
    {
      title: 'Growth Rate',
      value: `${metrics.growthRate}%`,
      change: 5.1,
      changeType: 'positive',
      icon: <TrendingUp className="h-6 w-6" />,
      description: 'Month-over-month user growth percentage'
    },
    {
      title: 'Schools Onboarded',
      value: metrics.schoolsOnboarded.toString(),
      change: 15.8,
      changeType: 'positive',
      icon: <Award className="h-6 w-6" />,
      description: 'Educational institutions using our platform'
    },
    {
      title: 'API Calls',
      value: metrics.apiCalls.toLocaleString(),
      change: -2.3,
      changeType: 'negative',
      icon: <Activity className="h-6 w-6" />,
      description: 'Monthly API requests processed'
    },
    {
      title: 'System Uptime',
      value: `${metrics.uptime}%`,
      change: 0.02,
      changeType: 'positive',
      icon: <Shield className="h-6 w-6" />,
      description: 'Platform availability and reliability'
    }
  ];

  const competitiveAdvantages = [
    {
      title: 'AI-Powered Learning',
      description: 'Advanced AI algorithms for personalized education',
      icon: <Cpu className="h-8 w-8" />,
      metric: '94% accuracy'
    },
    {
      title: 'Multi-Platform Support',
      description: 'Seamless experience across web, mobile, and desktop',
      icon: <Smartphone className="h-8 w-8" />,
      metric: '5 platforms'
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption',
      icon: <Shield className="h-8 w-8" />,
      metric: 'SOC 2 compliant'
    },
    {
      title: 'Global Scalability',
      description: 'Cloud-native architecture supporting millions of users',
      icon: <Globe className="h-8 w-8" />,
      metric: '99.97% uptime'
    }
  ];

  const handleExportData = () => {
    // In real app, this would export comprehensive business metrics
    console.log('Exporting investor data...');
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Investor Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Real-time business metrics and growth analytics for RHPS platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleRefreshData}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metricCards.map((metric, index) => (
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
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                  metric.changeType === 'positive'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : metric.changeType === 'negative'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : metric.changeType === 'negative' ? (
                    <ArrowDown className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Growth & Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="revenue" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Segmentation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={userSegmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userSegmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {userSegmentData.map((segment) => (
                <div key={segment.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {segment.name}: {segment.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Revenue Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Streams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={revenueStreams}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {revenueStreams.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {revenueStreams.map((stream) => (
                <div key={stream.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stream.color }}
                    />
                    <span className="text-gray-900 dark:text-white">{stream.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{stream.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Competitive Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Competitive Advantages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitiveAdvantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    {advantage.icon}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{advantage.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{advantage.description}</p>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{advantage.metric}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Investment Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Investment Opportunities</h3>
            <p className="text-lg mb-6 opacity-90">
              Join us in revolutionizing education technology with our scalable, AI-powered platform
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">$2.5M</div>
                <div className="text-sm opacity-80">Series A Target</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">47</div>
                <div className="text-sm opacity-80">Schools Onboarded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">15K+</div>
                <div className="text-sm opacity-80">Active Users</div>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Schedule Investor Meeting
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestorDashboard;