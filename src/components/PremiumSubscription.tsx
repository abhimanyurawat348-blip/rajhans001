import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Check, 
  X, 
  Star, 
  Zap, 
  Award, 
  BookOpen, 
  Beaker, 
  Users, 
  TrendingUp, 
  Shield, 
  CreditCard, 
  Calendar,
  Gift,
  Bell,
  Download,
  FileText
} from 'lucide-react';

interface Feature {
  name: string;
  description: string;
  basic: boolean;
  premium: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  description: string;
  features: string[];
  isPopular?: boolean;
}

const PremiumSubscription: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  
  const features: Feature[] = [
    {
      name: 'AI-Powered Learning Insights',
      description: 'Advanced analytics and personalized recommendations',
      basic: true,
      premium: true,
      icon: TrendingUp
    },
    {
      name: 'Unlimited Flashcards',
      description: 'Create and study unlimited flashcards with AI generation',
      basic: true,
      premium: true,
      icon: BookOpen
    },
    {
      name: 'Virtual Lab Access',
      description: 'Interactive physics, chemistry, and biology simulations',
      basic: false,
      premium: true,
      icon: Beaker
    },
    {
      name: 'Personalized Learning Paths',
      description: 'AI-generated study plans based on your progress',
      basic: true,
      premium: true,
      icon: Award
    },
    {
      name: 'Advanced Study Streaks',
      description: 'Detailed streak analytics and achievement badges',
      basic: true,
      premium: true,
      icon: Zap
    },
    {
      name: 'Priority AI Tutor Access',
      description: 'Faster responses from Dronacharya AI Mentor',
      basic: false,
      premium: true,
      icon: Users
    },
    {
      name: 'Offline Content Access',
      description: 'Download study materials for offline learning',
      basic: false,
      premium: true,
      icon: Download
    },
    {
      name: 'Exclusive Study Resources',
      description: 'Access to premium textbooks and video lectures',
      basic: false,
      premium: true,
      icon: FileText
    },
    {
      name: 'Ad-Free Experience',
      description: 'Distraction-free learning environment',
      basic: false,
      premium: true,
      icon: Shield
    },
    {
      name: 'Early Access to New Features',
      description: 'Be the first to try new educational tools',
      basic: false,
      premium: true,
      icon: Gift
    }
  ];
  
  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      period: 'monthly',
      description: 'Essential features for effective learning',
      features: [
        'AI Learning Insights',
        'Unlimited Flashcards',
        'Personalized Learning Paths',
        'Study Streak Tracking'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: selectedPlan === 'yearly' ? 799 : 99,
      period: selectedPlan,
      description: 'Unlock all features for maximum learning potential',
      features: [
        'All Basic features',
        'Virtual Lab Access',
        'Priority AI Tutor',
        'Offline Content',
        'Exclusive Resources',
        'Ad-Free Experience',
        'Early Access Features'
      ],
      isPopular: true
    }
  ];
  
  const handleSubscribe = () => {
    setShowPaymentForm(true);
  };
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would process the payment
    alert('Payment processed successfully! Welcome to RHPS Premium!');
    setShowPaymentForm(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Crown className="h-8 w-8 text-yellow-500 mr-3" />
          RHPS Premium Subscription
        </h1>
        <p className="text-gray-600 mt-2">Unlock advanced features to accelerate your learning journey</p>
      </div>
      
      {/* Plan Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              selectedPlan === 'monthly'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`px-4 py-2 text-sm font-medium rounded-md relative ${
              selectedPlan === 'yearly'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>
      
      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -5 }}
            className={`border rounded-2xl p-6 relative ${
              plan.isPopular 
                ? 'border-yellow-300 ring-2 ring-yellow-100 bg-gradient-to-br from-yellow-50 to-amber-50' 
                : 'border-gray-200'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-xl">
                MOST POPULAR
              </div>
            )}
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
              <div className="mt-2">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{plan.price}
                </span>
                <span className="text-gray-600">/{plan.period === 'yearly' ? 'year' : 'month'}</span>
              </div>
              <p className="text-gray-600 mt-2">{plan.description}</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={plan.id === 'premium' ? handleSubscribe : undefined}
              className={`w-full py-3 px-4 rounded-lg font-medium ${
                plan.isPopular
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {plan.id === 'premium' ? 'Get Premium' : 'Current Plan'}
            </button>
          </motion.div>
        ))}
      </div>
      
      {/* Features Comparison */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Feature</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Basic</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{feature.name}</div>
                          <div className="text-sm text-gray-500">{feature.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feature.basic ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feature.premium ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">What Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-4">
                "RHPS Premium has transformed my study routine. The virtual labs and AI tutor have helped me understand complex concepts much better."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Student Name</div>
                  <div className="text-gray-500 text-xs">Class 12</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              question: 'Can I cancel my subscription anytime?',
              answer: 'Yes, you can cancel your subscription at any time. You will continue to have access to premium features until the end of your billing period.'
            },
            {
              question: 'Is there a free trial available?',
              answer: 'Yes, we offer a 7-day free trial for new Premium subscribers. No credit card required to start your trial.'
            },
            {
              question: 'What payment methods do you accept?',
              answer: 'We accept all major credit/debit cards, UPI payments, and net banking options.'
            },
            {
              question: 'Can I switch between monthly and yearly plans?',
              answer: 'Yes, you can switch between plans at any time. If switching to a lower plan, the change will take effect at the end of your current billing period.'
            }
          ].map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">{faq.question}</h3>
              <p className="text-gray-600 mt-2 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Complete Your Purchase</h3>
                <button 
                  onClick={() => setShowPaymentForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">Premium Subscription</div>
                    <div className="text-sm text-gray-600">
                      {selectedPlan === 'yearly' ? 'Yearly plan' : 'Monthly plan'}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    ₹{selectedPlan === 'yearly' ? '799' : '99'}/
                    {selectedPlan === 'yearly' ? 'year' : 'month'}
                  </div>
                </div>
              </div>
              
              <form onSubmit={handlePayment}>
                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium ${
                        paymentMethod === 'upi'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium ${
                        paymentMethod === 'netbanking'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Net Banking
                    </button>
                  </div>
                </div>
                
                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="Full name as on card"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                )}
                
                {/* UPI Payment Form */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You will be redirected to your UPI app to complete the payment
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Net Banking Form */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Select your bank</option>
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Punjab National Bank</option>
                      </select>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You will be redirected to your bank's website to complete the payment
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Pay Now
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PremiumSubscription;