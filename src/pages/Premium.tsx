import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Check, 
  ArrowLeft,
  Star,
  Zap,
  Award,
  BookOpen,
  Beaker,
  Users,
  TrendingUp
} from 'lucide-react';

const Premium: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('annual');
  
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '₹299',
      period: 'per month',
      description: 'Perfect for trying out premium features',
      features: [
        'Unlimited flashcards',
        'Advanced analytics',
        'Priority support',
        'Ad-free experience',
        'Early access to new features'
      ]
    },
    {
      id: 'annual',
      name: 'Annual',
      price: '₹2,499',
      period: 'per year',
      description: 'Best value with 30% savings',
      popular: true,
      features: [
        'All Monthly features',
        'Personalized learning paths',
        'AI-powered study recommendations',
        'Offline access to content',
        'Exclusive workshops',
        '1:1 mentoring sessions (2/month)'
      ]
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '₹9,999',
      period: 'one-time',
      description: 'Complete access forever',
      features: [
        'All Annual features',
        'Lifetime updates',
        'Premium certificate',
        'Invitation to alumni network',
        'Personalized career guidance',
        'Unlimited 1:1 mentoring'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center">
                <Crown className="h-8 w-8 text-amber-500 mr-3" />
                Premium Subscription
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Unlock advanced features to supercharge your learning
              </p>
            </div>
            <Link
              to="/student-home"
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Premium Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Premium Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI-Powered Learning</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Personalized study plans and recommendations based on your learning patterns
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Detailed performance insights and progress tracking across all subjects
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Exclusive Content</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Access to premium study materials, practice tests, and expert workshops
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Unlimited Flashcards</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Create and study unlimited flashcards with advanced features
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Beaker className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Virtual Labs</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Premium access to advanced virtual laboratory simulations
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1:1 Mentoring</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Personalized mentoring sessions with expert educators
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular 
                    ? 'ring-2 ring-amber-500 transform scale-105 z-10' 
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400"> {plan.period}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      selectedPlan === plan.id
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : plan.popular
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/50'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg">
              Proceed to Payment
            </button>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
              Secure payment powered by Razorpay. Cancel anytime.
            </p>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">A</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-900 dark:text-white">Ankit Sharma</h4>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                "The AI-powered learning paths helped me improve my grades by 20% in just 2 months!"
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">P</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-900 dark:text-white">Priya Patel</h4>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                "The 1:1 mentoring sessions were a game-changer for my exam preparation."
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">R</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-gray-900 dark:text-white">Rohan Gupta</h4>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                "Unlimited flashcards and virtual labs made complex concepts so much easier to understand."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Premium;