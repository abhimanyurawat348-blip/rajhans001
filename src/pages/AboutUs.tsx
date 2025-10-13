import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Lightbulb, Globe, Award } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About RHPS Group</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meet the visionary leaders behind India's first fully digital school ecosystem
          </p>
        </motion.div>

        {}
        <div className="space-y-8">
          {}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/3 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center mb-6" />
                <h2 className="text-2xl font-bold mb-2">Abhimanyu Rawat</h2>
                <p className="text-blue-100 mb-4">Founder & CEO</p>
                <div className="bg-blue-400/20 px-4 py-2 rounded-full text-sm font-medium">
                  Age: 17
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Founder & Owner</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Abhimanyu Rawat is the Founder and driving force behind RHPS Group, an emerging EdTech initiative aiming to create India's first hybrid e-school platform. At just 17, Abhimanyu has led the entire concept, design, and development of the RHPS Web Portal.
                </p>
                
                <div className="flex items-center mb-4">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Vision</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  To build India's first fully digital school ecosystem that simplifies learning, strengthens student–teacher communication, and makes education affordable for everyone.
                </p>
                
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">The Idea</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  The idea for RHPS was born from a simple observation: students often face communication gaps, delays, and accessibility issues in traditional school systems. Abhimanyu's goal is to bridge these gaps using technology that schools can adopt easily — without heavy costs.
                </p>
                
                <div className="flex items-center mb-4">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Upcoming Features</h4>
                </div>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>AI-based academic assistance</li>
                  <li>Career counselling modules</li>
                  <li>Homework help systems</li>
                  <li>Digital marketplace for uniforms, books, and school merchandise</li>
                </ul>
                
                <div className="flex items-center mt-6">
                  <Award className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "Education should not be limited by geography or financial status. My mission is to design a future-ready school experience that brings learning, resources, and interaction to every student's fingertips."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/3 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center mb-6" />
                <h2 className="text-2xl font-bold mb-2">Akshat Rawat</h2>
                <p className="text-purple-100 mb-4">Co-Founder & Operations Lead</p>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Co-Founder</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Akshat Rawat serves as the Co-Founder and Operations Lead at RHPS Group. He plays an important role in coordinating daily operations, partnerships, and future collaborations with schools and vendors.
                </p>
                
                <div className="flex items-center mb-4">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Role & Focus</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Akshat's focus is on the business and partnership side of RHPS — helping identify schools, managing resource planning, and assisting in the platform's overall workflow design. His practical thinking and organizational approach balance the project's technical vision.
                </p>
                
                <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Leadership</h4>
                  <p className="text-purple-700 dark:text-purple-300">
                    Together, Abhimanyu and Akshat form the core leadership team of RHPS Group — young innovators working to redefine how schools, students, and teachers interact in the digital age.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          <div className="text-center">
            <Globe className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              To revolutionize the education sector by creating a seamless digital ecosystem that empowers students, teachers, and parents with accessible, affordable, and innovative learning solutions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;