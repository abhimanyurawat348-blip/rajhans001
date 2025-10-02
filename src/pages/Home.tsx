import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { School, Users, FileText, BookOpen, Calendar, ArrowRight, Brain } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Quiz Zone',
      description: 'Challenge yourself with interactive quizzes and compete with peers',
      link: '/quiz',
      color: 'bg-gradient-to-r from-pink-500 to-purple-500',
      special: true
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Student Council',
      description: 'Meet our inspiring student leaders for 2025-26',
      link: '/student-council',
      color: 'bg-blue-500'
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Planners & Registrations',
      description: 'View school events and register for activities',
      link: '/planners-registrations',
      color: 'bg-indigo-500'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Submit Complaints',
      description: 'Voice your concerns and suggestions',
      link: '/complaints',
      color: 'bg-green-500'
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Study Resources',
      description: 'Download previous year papers and sample papers',
      link: '/study-resources',
      color: 'bg-orange-500'
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'School Rules',
      description: 'Guidelines for a better learning environment',
      link: '/rules',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <School className="h-20 w-20 text-blue-600 mx-auto mb-4" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            RHPS Public School
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl text-gray-600 mb-4"
          >
            Miyanwala, Dehradun
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
          >
            <p className="text-2xl font-semibold mb-8">
              "Excellence in Education, Character in Life"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex space-x-4 justify-center"
          >
            <Link
              to="/student-dashboard"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Student Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/staff-portal"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Staff Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              School Portal Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for a connected school experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, scale: feature.special ? 1.05 : 1 }}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  feature.special ? 'border-4 border-purple-300 relative overflow-hidden' : ''
                }`}
              >
                {feature.special && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    NEW
                  </div>
                )}
                <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 mx-auto shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 text-center ${
                  feature.special ? 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {feature.description}
                </p>
                <div className="text-center">
                  <Link
                    to={feature.link}
                    className={`inline-flex items-center font-semibold transition-colors duration-200 ${
                      feature.special
                        ? 'text-purple-600 hover:text-purple-700'
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {feature.special ? 'Start Quiz Now' : 'Learn More'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-8">Our School Community</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-xl">Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-xl">Teachers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">25+</div>
                <div className="text-xl">Years of Excellence</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

