import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, FileText } from 'lucide-react';

const PlannersRegistrations: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Planner & Registration</h1>
          <p className="text-lg text-gray-600">Choose where you want to go</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => navigate('/yearly-planner')}
            className="bg-white w-full text-left rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 text-white w-14 h-14 rounded-xl flex items-center justify-center">
                <Calendar className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Planner</h2>
                <p className="text-gray-600">View the academic year planner</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => navigate('/registration')}
            className="bg-white w-full text-left rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-emerald-600 text-white w-14 h-14 rounded-xl flex items-center justify-center">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Registration</h2>
                <p className="text-gray-600">Register for school activities</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PlannersRegistrations;



