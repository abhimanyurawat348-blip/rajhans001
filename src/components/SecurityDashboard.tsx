import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Database,
  Globe,
  Smartphone,
  Cloud,
  Key,
  FileText,
  Activity,
  Zap,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface SecurityMetric {
  title: string;
  value: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
  description: string;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'access' | 'threat' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  user: string;
  ip: string;
  resolved: boolean;
}

interface ComplianceStatus {
  standard: string;
  status: 'compliant' | 'pending' | 'non-compliant';
  lastAudit: Date;
  nextAudit: Date;
  score: number;
}

const SecurityDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(false);

  // Mock security data
  const securityMetrics: SecurityMetric[] = [
    {
      title: 'Security Score',
      value: '98.7%',
      change: 2.1,
      status: 'good',
      icon: <Shield className="h-6 w-6" />,
      description: 'Overall platform security rating'
    },
    {
      title: 'Active Threats',
      value: '0',
      change: -100,
      status: 'good',
      icon: <AlertTriangle className="h-6 w-6" />,
      description: 'Currently active security threats'
    },
    {
      title: 'Failed Login Attempts',
      value: '23',
      change: -15.2,
      status: 'good',
      icon: <Lock className="h-6 w-6" />,
      description: 'Suspicious login attempts blocked'
    },
    {
      title: 'Data Encryption',
      value: 'AES-256',
      change: 0,
      status: 'good',
      icon: <Key className="h-6 w-6" />,
      description: 'Encryption standard for data at rest'
    },
    {
      title: 'Uptime',
      value: '99.97%',
      change: 0.01,
      status: 'good',
      icon: <Activity className="h-6 w-6" />,
      description: 'Platform availability and reliability'
    },
    {
      title: 'GDPR Compliance',
      value: '100%',
      change: 0,
      status: 'good',
      icon: <CheckCircle className="h-6 w-6" />,
      description: 'Data protection regulation compliance'
    }
  ];

  const securityEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login',
      severity: 'low',
      message: 'Multiple failed login attempts from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: 'unknown',
      ip: '192.168.1.100',
      resolved: true
    },
    {
      id: '2',
      type: 'access',
      severity: 'medium',
      message: 'Unauthorized access attempt to admin panel',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      user: 'john.doe@school.edu',
      ip: '10.0.0.50',
      resolved: true
    },
    {
      id: '3',
      type: 'threat',
      severity: 'high',
      message: 'Potential SQL injection attempt detected',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      user: 'system',
      ip: '203.0.113.45',
      resolved: true
    },
    {
      id: '4',
      type: 'compliance',
      severity: 'low',
      message: 'Monthly security audit completed successfully',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: 'security.system',
      ip: 'internal',
      resolved: true
    }
  ];

  const complianceStatuses: ComplianceStatus[] = [
    {
      standard: 'SOC 2 Type II',
      status: 'compliant',
      lastAudit: new Date('2024-11-15'),
      nextAudit: new Date('2025-11-15'),
      score: 98
    },
    {
      standard: 'GDPR',
      status: 'compliant',
      lastAudit: new Date('2024-10-20'),
      nextAudit: new Date('2025-10-20'),
      score: 100
    },
    {
      standard: 'ISO 27001',
      status: 'compliant',
      lastAudit: new Date('2024-09-30'),
      nextAudit: new Date('2025-09-30'),
      score: 96
    },
    {
      standard: 'FERPA',
      status: 'compliant',
      lastAudit: new Date('2024-08-15'),
      nextAudit: new Date('2025-08-15'),
      score: 99
    }
  ];

  const threatData = [
    { time: '00:00', threats: 0, blocked: 0 },
    { time: '04:00', threats: 1, blocked: 1 },
    { time: '08:00', threats: 3, blocked: 3 },
    { time: '12:00', threats: 2, blocked: 2 },
    { time: '16:00', threats: 5, blocked: 5 },
    { time: '20:00', threats: 1, blocked: 1 }
  ];

  const securityLayers = [
    { name: 'Network Security', value: 25, color: '#3b82f6' },
    { name: 'Application Security', value: 30, color: '#10b981' },
    { name: 'Data Protection', value: 25, color: '#f59e0b' },
    { name: 'Access Control', value: 20, color: '#ef4444' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'non-compliant': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleRefresh = async () => {
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
                Security & Compliance Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Enterprise-grade security monitoring and compliance management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {securityMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    metric.status === 'good' ? 'bg-green-100 dark:bg-green-900' :
                    metric.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-red-100 dark:bg-red-900'
                  }`}>
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  </div>
                </div>
                <div className={`text-right ${getStatusColor(metric.status)}`}>
                  <div className="text-sm">
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Security Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Threat Detection (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="blocked" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Security Layers</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={securityLayers}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {securityLayers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {securityLayers.map((layer) => (
                <div key={layer.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {layer.name}: {layer.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Security Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Security Events</h3>
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    event.severity === 'critical' ? 'bg-red-100 dark:bg-red-900' :
                    event.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900' :
                    event.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-blue-100 dark:bg-blue-900'
                  }`}>
                    {event.type === 'login' && <Lock className="h-4 w-4" />}
                    {event.type === 'access' && <Eye className="h-4 w-4" />}
                    {event.type === 'threat' && <AlertTriangle className="h-4 w-4" />}
                    {event.type === 'compliance' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{event.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{event.user}</span>
                      <span>{event.ip}</span>
                      <span>{event.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(event.severity)}`}>
                    {event.severity}
                  </span>
                  {event.resolved ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Compliance Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Compliance Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceStatuses.map((compliance) => (
              <div key={compliance.standard} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{compliance.standard}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getComplianceColor(compliance.status)}`}>
                    {compliance.status}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Compliance Score</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{compliance.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${compliance.score}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Last Audit</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {compliance.lastAudit.toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Next Audit</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {compliance.nextAudit.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Enterprise Security Features</h3>
            <p className="text-lg mb-8 opacity-90">
              Bank-grade security with comprehensive compliance and threat protection
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-80" />
                <div className="font-semibold mb-1">End-to-End Encryption</div>
                <div className="text-sm opacity-80">AES-256 encryption for all data</div>
              </div>
              <div className="text-center">
                <Eye className="h-12 w-12 mx-auto mb-3 opacity-80" />
                <div className="font-semibold mb-1">Real-time Monitoring</div>
                <div className="text-sm opacity-80">24/7 threat detection and response</div>
              </div>
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto mb-3 opacity-80" />
                <div className="font-semibold mb-1">Compliance Certified</div>
                <div className="text-sm opacity-80">SOC 2, GDPR, FERPA compliant</div>
              </div>
              <div className="text-center">
                <Zap className="h-12 w-12 mx-auto mb-3 opacity-80" />
                <div className="font-semibold mb-1">Zero Trust Architecture</div>
                <div className="text-sm opacity-80">Verify every access request</div>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              View Security Whitepaper
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SecurityDashboard;