import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Star, Zap, Anchor, Moon } from 'lucide-react';

interface Deity {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
}

const DeitySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { religionId } = useParams<{ religionId: string }>();
  const [selectedDeity, setSelectedDeity] = useState<string | null>(null);

  
  const deities: Record<string, Deity[]> = {
    hindu: [
      { id: 'ram', name: 'Ram', subtitle: 'Jai Shree Ram', icon: '🔴' },
      { id: 'hanuman', name: 'Hanuman', subtitle: 'Jai Hanuman', icon: '🐵' },
      { id: 'shiva', name: 'Shiva (Bolenath)', subtitle: 'Har Har Mahadev', icon: '🔹' },
      { id: 'vishnu', name: 'Vishnu', subtitle: 'Jai Bhagwan Vishnu', icon: '🔵' },
      { id: 'durga', name: 'Durga', subtitle: 'Jai Mata Durga', icon: '👸' },
      { id: 'kali', name: 'Kali', subtitle: 'Jai Maa Kali', icon: '🖤' },
      { id: 'lakshmi', name: 'Lakshmi', subtitle: 'Jai Maa Lakshmi', icon: '💰' },
      { id: 'saraswati', name: 'Saraswati', subtitle: 'Jai Maa Saraswati', icon: '📚' },
      { id: 'brahma', name: 'Brahma', subtitle: 'Om Brahmdevay Namah', icon: '🌟' },
      { id: 'ganesh', name: 'Ganesh', subtitle: 'Jai Bappa Morya', icon: '🐘' },
      { id: 'krishna', name: 'Krishna', subtitle: 'Jai Shree Krishna', icon: ' flute' },
      { id: 'radha', name: 'Radha', subtitle: 'Jai Radhe Shyam', icon: '🌹' },
      { id: 'radhe-krishna', name: 'Radhe Krishna', subtitle: 'Jai Radhe Krishna', icon: '❤️' }
    ],
    sikh: [
      { id: 'guru-nanak', name: 'Guru Nanak', subtitle: 'Sat Sri Akal', icon: '☬' },
      { id: 'guru-granth-sahib', name: 'Guru Granth Sahib', subtitle: 'Guru Granth Sahib Ji', icon: ' Granth' },
      { id: 'guru-gobind-singh', name: 'Guru Gobind Singh', subtitle: 'Deg Tegh Fateh', icon: '⚔️' },
      { id: 'waheguru', name: 'Waheguru', subtitle: 'Waheguru Ji Ka Khalsa', icon: '⚡' }
    ],
    christian: [
      { id: 'jesus', name: 'Jesus Christ', subtitle: 'Hallelujah', icon: '✝️' },
      { id: 'god-the-father', name: 'God the Father', subtitle: 'Our Father in Heaven', icon: ' 👑' },
      { id: 'holy-spirit', name: 'Holy Spirit', subtitle: 'Come Holy Spirit', icon: ' 💨' },
      { id: 'mary', name: 'Virgin Mary', subtitle: 'Hail Mary', icon: ' 👩' },
      { id: 'archangel-michael', name: 'Archangel Michael', subtitle: 'Saint Michael the Archangel', icon: ' ⚔️' }
    ],
    islam: [
      { id: 'allah', name: 'Allah', subtitle: 'Allahu Akbar', icon: '☪️' },
      { id: 'muhammad', name: 'Prophet Muhammad', subtitle: 'Peace Be Upon Him', icon: ' ☪️' },
      { id: 'quran', name: 'Quran', subtitle: 'Bismillah', icon: ' 📖' },
      { id: 'kaaba', name: 'Kaaba', subtitle: 'Allah Hu Akbar', icon: ' 🕋' }
    ],
    jewish: [
      { id: 'yahweh', name: 'Yahweh', subtitle: 'Hallelujah', icon: '✡️' },
      { id: 'torah', name: 'Torah', subtitle: 'Baruch Hashem', icon: ' 📜' },
      { id: 'abraham', name: 'Abraham', subtitle: 'Lech Lecha', icon: ' 🕍' },
      { id: 'moses', name: 'Moses', subtitle: 'Shema Yisrael', icon: ' 📜' }
    ]
  };

  const religionNames: Record<string, string> = {
    hindu: 'Hindu',
    sikh: 'Sikh',
    christian: 'Christian',
    islam: 'Islamic',
    jewish: 'Jewish'
  };

  const religionIcons: Record<string, JSX.Element> = {
    hindu: <Star className="h-6 w-6" />,
    sikh: <Zap className="h-6 w-6" />,
    christian: <Anchor className="h-6 w-6" />,
    islam: <Moon className="h-6 w-6" />,
    jewish: <Star className="h-6 w-6" />
  };

  const getReligionColor = (religion: string): string => {
    switch (religion) {
      case 'hindu': return 'from-orange-500 to-red-500';
      case 'sikh': return 'from-blue-500 to-indigo-500';
      case 'christian': return 'from-purple-500 to-pink-500';
      case 'islam': return 'from-green-500 to-teal-500';
      case 'jewish': return 'from-yellow-500 to-amber-500';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const handleDeitySelect = (deityId: string) => {
    setSelectedDeity(deityId);
    
    navigate(`/chanting/${religionId}/${deityId}`);
  };

  const handleBack = () => {
    if (selectedDeity) {
      setSelectedDeity(null);
    } else {
      navigate(-1);
    }
  };

  if (!religionId || !deities[religionId]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Religion Not Found</h2>
          <p className="text-gray-600 mb-6">The selected religion is not available.</p>
          <button
            onClick={() => navigate('/chanting')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all"
          >
            Back to Selection
          </button>
        </div>
      </div>
    );
  }

  const currentDeities = deities[religionId];
  const religionName = religionNames[religionId];
  const religionIcon = religionIcons[religionId];
  const religionColor = getReligionColor(religionId);

  return (
    <div className={`min-h-screen ${
      religionId === 'hindu' ? 'bg-gradient-to-br from-orange-50 via-orange-100 to-red-100' :
      religionId === 'sikh' ? 'bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100' :
      religionId === 'christian' ? 'bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100' :
      religionId === 'islam' ? 'bg-gradient-to-br from-green-50 via-green-100 to-teal-100' :
      religionId === 'jewish' ? 'bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-100' :
      'bg-gradient-to-br from-rose-50 via-white to-pink-50'
    }`}>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className={`bg-gradient-to-r ${religionColor} w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg`}>
            {religionIcon}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {religionName} Deities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a deity to begin chanting their sacred names
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDeities.map((deity) => (
              <motion.div
                key={deity.id}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDeitySelect(deity.id)}
                className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-${religionColor.split(' ')[0].replace('from-', '')}-300 cursor-pointer`}
              >
                <div className="text-4xl mb-4 text-center">{deity.icon}</div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                  {deity.name}
                </h3>
                <p className="text-gray-600 text-center">
                  {deity.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

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

export default DeitySelectionPage;