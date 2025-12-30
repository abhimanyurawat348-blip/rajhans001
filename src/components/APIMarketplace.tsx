import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Database,
  Cloud,
  Smartphone,
  Globe,
  Shield,
  BarChart3,
  Users,
  Calendar,
  Mail,
  CreditCard,
  FileText,
  Video,
  MessageSquare,
  Phone,
  MapPin,
  Camera,
  Music,
  Gamepad2,
  BookOpen,
  Calculator,
  Beaker,
  Microscope,
  Star,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface APIEndpoint {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  status: 'active' | 'beta' | 'coming-soon';
  popularity: number;
  requests: number;
  endpoints: string[];
  pricing: {
    free: number;
    basic: number;
    premium: number;
  };
}

interface IntegrationPartner {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  status: 'connected' | 'available' | 'requested';
  users: number;
}

const APIMarketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All APIs', count: 24 },
    { id: 'education', name: 'Education', count: 8 },
    { id: 'communication', name: 'Communication', count: 6 },
    { id: 'analytics', name: 'Analytics', count: 4 },
    { id: 'payment', name: 'Payment', count: 3 },
    { id: 'media', name: 'Media', count: 3 }
  ];

  const apiEndpoints: APIEndpoint[] = [
    {
      id: 'attendance-api',
      name: 'Attendance Management API',
      description: 'Real-time attendance tracking and reporting for students and staff',
      category: 'education',
      icon: <Users className="h-6 w-6" />,
      status: 'active',
      popularity: 95,
      requests: 2847391,
      endpoints: ['/attendance/mark', '/attendance/report', '/attendance/analytics'],
      pricing: { free: 1000, basic: 10000, premium: 100000 }
    },
    {
      id: 'learning-analytics',
      name: 'Learning Analytics API',
      description: 'Advanced AI-powered learning insights and performance analytics',
      category: 'analytics',
      icon: <BarChart3 className="h-6 w-6" />,
      status: 'active',
      popularity: 92,
      requests: 1856234,
      endpoints: ['/analytics/performance', '/analytics/predictions', '/analytics/recommendations'],
      pricing: { free: 500, basic: 5000, premium: 50000 }
    },
    {
      id: 'communication-api',
      name: 'Communication Hub API',
      description: 'Unified messaging, notifications, and parent-teacher communication',
      category: 'communication',
      icon: <MessageSquare className="h-6 w-6" />,
      status: 'active',
      popularity: 88,
      requests: 3421567,
      endpoints: ['/messages/send', '/notifications/push', '/parents/communicate'],
      pricing: { free: 2000, basic: 20000, premium: 200000 }
    },
    {
      id: 'payment-gateway',
      name: 'Payment Gateway API',
      description: 'Secure fee collection, subscription management, and financial reporting',
      category: 'payment',
      icon: <CreditCard className="h-6 w-6" />,
      status: 'active',
      popularity: 85,
      requests: 987654,
      endpoints: ['/payments/collect', '/fees/manage', '/reports/financial'],
      pricing: { free: 100, basic: 1000, premium: 10000 }
    },
    {
      id: 'virtual-lab',
      name: 'Virtual Laboratory API',
      description: 'Interactive science experiments and virtual lab simulations',
      category: 'education',
      icon: <Beaker className="h-6 w-6" />,
      status: 'beta',
      popularity: 78,
      requests: 456789,
      endpoints: ['/labs/simulate', '/experiments/run', '/results/analyze'],
      pricing: { free: 300, basic: 3000, premium: 30000 }
    },
    {
      id: 'ai-tutor',
      name: 'AI Tutor API',
      description: 'Personalized AI tutoring and homework assistance',
      category: 'education',
      icon: <Zap className="h-6 w-6" />,
      status: 'active',
      popularity: 91,
      requests: 1234567,
      endpoints: ['/tutor/ask', '/homework/help', '/explanations/generate'],
      pricing: { free: 800, basic: 8000, premium: 80000 }
    }
  ];

  const integrationPartners: IntegrationPartner[] = [
    {
      id: 'google-classroom',
      name: 'Google Classroom',
      logo: '🎓',
      category: 'Education',
      description: 'Seamless integration with Google Classroom for assignments and grades',
      status: 'connected',
      users: 15420
    },
    {
      id: 'zoom',
      name: 'Zoom',
      logo: '📹',
      category: 'Communication',
      description: 'Integrated video conferencing for virtual classes and meetings',
      status: 'connected',
      users: 12850
    },
    {
      id: 'stripe',
      name: 'Stripe',
      logo: '💳',
      category: 'Payment',
      description: 'Secure payment processing for fees and subscriptions',
      status: 'connected',
      users: 8925
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      logo: '👥',
      category: 'Communication',
      description: 'Enterprise communication and collaboration tools',
      status: 'available',
      users: 0
    },
    {
      id: 'canvas-lms',
      name: 'Canvas LMS',
      logo: '📚',
      category: 'Education',
      description: 'Learning management system integration',
      status: 'requested',
      users: 0
    }
  ];

  const filteredAPIs = apiEndpoints.filter(api => {
    const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory;
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'beta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'coming-soon': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPartnerStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'available': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'requested': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Marketplace & Integrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Connect, integrate, and extend RHPS platform capabilities with our comprehensive API ecosystem
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total APIs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">API Calls/Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8.2M</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Integrations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">47</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">99.97%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search APIs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* API Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAPIs.map((api, index) => (
            <motion.div
              key={api.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    {api.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{api.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(api.status)}`}>
                      {api.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Popularity</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{api.popularity}%</div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{api.description}</p>

              <div className="mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Endpoints</div>
                <div className="flex flex-wrap gap-1">
                  {api.endpoints.slice(0, 2).map((endpoint) => (
                    <span key={endpoint} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-700 dark:text-gray-300">
                      {endpoint}
                    </span>
                  ))}
                  {api.endpoints.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-700 dark:text-gray-300">
                      +{api.endpoints.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Monthly Requests</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {api.requests.toLocaleString()}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Pricing (requests/month)</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Free</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{api.pricing.free.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Basic</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{api.pricing.basic.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Premium</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{api.pricing.premium.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>View Documentation</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Integration Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Integration Partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrationPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{partner.logo}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{partner.name}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{partner.category}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPartnerStatusColor(partner.status)}`}>
                    {partner.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{partner.description}</p>

                {partner.users > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Active Users</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{partner.users.toLocaleString()}</span>
                  </div>
                )}

                <button
                  className={`w-full mt-3 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    partner.status === 'connected'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : partner.status === 'available'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {partner.status === 'connected' ? 'Connected' :
                   partner.status === 'available' ? 'Connect' : 'Request Access'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Developer Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Developer Resources</h3>
            <p className="text-lg mb-6 opacity-90">
              Everything you need to integrate with RHPS platform
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24</div>
                <div className="text-sm opacity-80">APIs Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">99.97%</div>
                <div className="text-sm opacity-80">API Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">&lt;50ms</div>
                <div className="text-sm opacity-80">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm opacity-80">Support</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                View API Documentation
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Get Developer Key
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default APIMarketplace;