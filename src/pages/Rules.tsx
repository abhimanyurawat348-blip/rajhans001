import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, Shirt, Phone, Book, AlertTriangle, CheckCircle } from 'lucide-react';

const Rules: React.FC = () => {
  const ruleCategories = [
    {
      title: 'General Conduct',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      rules: [
        'Students must maintain respectful behavior towards teachers, staff, and fellow students',
        'Use of abusive language or inappropriate behavior is strictly prohibited',
        'Students must follow instructions given by teachers and staff members',
        'Bullying or harassment of any kind will result in immediate disciplinary action',
        'Students should help maintain a clean and healthy school environment'
      ]
    },
    {
      title: 'Attendance & Punctuality',
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-green-500',
      rules: [
        'Students must maintain at least 75% attendance to be eligible for examinations',
        'Late arrival to school must be reported to the office with a valid reason',
        'Students leaving early must have written permission from parents/guardians',
        'Regular attendance is essential for academic progress and will be monitored',
        'Medical certificates are required for absences due to illness exceeding 3 days'
      ]
    },
    {
      title: 'Dress Code & Uniform',
      icon: <Shirt className="h-6 w-6" />,
      color: 'bg-purple-500',
      rules: [
        'School uniform must be worn properly and kept clean at all times',
        'Hair should be neatly groomed; boys must maintain short hair',
        'Girls with long hair must tie it properly with school-approved accessories',
        'Jewelry and accessories should be minimal and non-distracting',
        'Sports uniform is mandatory during physical education classes'
      ]
    },
    {
      title: 'Academic Rules',
      icon: <Book className="h-6 w-6" />,
      color: 'bg-orange-500',
      rules: [
        'Homework and assignments must be completed on time',
        'Cheating or plagiarism in any form will result in zero marks',
        'Students must bring all required textbooks and materials daily',
        'Regular participation in class discussions is encouraged',
        'Seek help from teachers during doubt-clearing sessions'
      ]
    },
    {
      title: 'Technology & Mobile Policy',
      icon: <Phone className="h-6 w-6" />,
      color: 'bg-red-500',
      rules: [
        'Mobile phones must be switched off during school hours',
        'Use of electronic devices without permission is prohibited',
        'Students may not record audio/video without explicit permission',
        'Inappropriate use of technology will result in device confiscation',
        'Report any cyberbullying incidents immediately to staff'
      ]
    },
    {
      title: 'Safety & Security',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'bg-yellow-500',
      rules: [
        'Students must follow all safety protocols and emergency procedures',
        'Running in corridors and staircases is strictly prohibited',
        'Report any suspicious activity or security concerns immediately',
        'Do not bring valuable items or large amounts of money to school',
        'Follow proper procedures when using laboratory equipment and chemicals'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">School Rule Book</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These guidelines ensure a safe, respectful, and productive learning environment for all students at Rajhans Public School.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-12 text-center"
        >
          <CheckCircle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Our Commitment</h2>
          <p className="text-lg opacity-90">
            "Discipline is the bridge between goals and accomplishment. Together, we build character and excellence."
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {ruleCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className={`${category.color} p-6 text-white`}>
                <div className="flex items-center space-x-3">
                  {category.icon}
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <ul className="space-y-4">
                  {category.rules.map((rule, ruleIndex) => (
                    <motion.li
                      key={ruleIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * ruleIndex }}
                      className="flex items-start space-x-3"
                    >
                      <div className="mt-1">
                        <div className={`w-2 h-2 rounded-full ${category.color.replace('bg-', 'bg-')} opacity-60`}></div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{rule}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notice</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Violation of school rules may result in disciplinary action including warnings, detention, 
            suspension, or in serious cases, expulsion. We encourage all students to uphold these standards 
            and contribute to a positive school environment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500">
            For any clarifications or concerns regarding school rules, please contact the administration office.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Rules;