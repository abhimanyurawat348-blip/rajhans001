import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Star, Zap, Anchor, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ChantingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedReligion, setSelectedReligion] = useState<string | null>(null);

  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/student-login');
    }
  }, [isAuthenticated, navigate]);

  const religions = [
    { 
      id: 'hindu', 
      name: 'Hindu', 
      icon: <Star className="h-8 w-8" />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    { 
      id: 'sikh', 
      name: 'Sikh', 
      icon: <Zap className="h-8 w-8" />,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    { 
      id: 'christian', 
      name: 'Christian', 
      icon: <Anchor className="h-8 w-8" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    { 
      id: 'islam', 
      name: 'Islamic', 
      icon: <Moon className="h-8 w-8" />,
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-teal-50'
    },
    { 
      id: 'jewish', 
      name: 'Jewish', 
      icon: <Star className="h-8 w-8" />,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50'
    }
  ];

  const handleReligionSelect = (religionId: string) => {
    setSelectedReligion(religionId);
    
    navigate(`/chanting/${religionId}`);
  };

  const handleBack = () => {
    if (selectedReligion) {
      setSelectedReligion(null);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Spiritual Chanting</h1>
          <div></div> {}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <Heart className="h-10 w-10" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Feeling Stressed?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Negative energies impacting you? Let's chant the names of divine beings to find peace and positivity.
          </p>
        </motion.div>

        {!selectedReligion ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8"
          >
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Choose Whose Name to Chant
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {religions.map((religion) => (
                <motion.div
                  key={religion.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReligionSelect(religion.id)}
                  className={`bg-gradient-to-br ${religion.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-${religion.color.split(' ')[0].replace('from-', '')}-300 cursor-pointer`}
                >
                  <div className={`bg-gradient-to-r ${religion.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 mx-auto shadow-md`}>
                    {religion.icon}
                  </div>
                  <h4 className="text-xl font-bold text-center text-gray-900">
                    {religion.name}
                  </h4>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 text-white text-center"
        >
          <Heart className="h-8 w-8 mx-auto mb-3" />
          <p className="text-lg font-medium">
            Chanting divine names brings peace, positivity, and spiritual strength
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChantingPage;