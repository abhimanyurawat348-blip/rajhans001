import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Star, Zap, Anchor, Moon, RotateCcw, Trophy, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const ChantingCounterPage: React.FC = () => {
  const navigate = useNavigate();
  const { religionId, deityId } = useParams<{ religionId: string; deityId: string }>();
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);


  
  const deities: Record<string, Record<string, { name: string; subtitle: string; icon: string; phrase: string }>> = {
    hindu: {
      ram: { name: 'Ram', subtitle: 'Jai Shree Ram', icon: '🔴', phrase: 'Jai Shree Ram' },
      hanuman: { name: 'Hanuman', subtitle: 'Jai Hanuman', icon: '🐵', phrase: 'Jai Hanuman' },
      shiva: { name: 'Shiva (Bolenath)', subtitle: 'Har Har Mahadev', icon: '🔹', phrase: 'Har Har Mahadev' },
      vishnu: { name: 'Vishnu', subtitle: 'Jai Bhagwan Vishnu', icon: '🔵', phrase: 'Jai Bhagwan Vishnu' },
      durga: { name: 'Durga', subtitle: 'Jai Mata Durga', icon: '👸', phrase: 'Jai Mata Durga' },
      kali: { name: 'Kali', subtitle: 'Jai Maa Kali', icon: '🖤', phrase: 'Jai Maa Kali' },
      lakshmi: { name: 'Lakshmi', subtitle: 'Jai Maa Lakshmi', icon: '💰', phrase: 'Jai Maa Lakshmi' },
      saraswati: { name: 'Saraswati', subtitle: 'Jai Maa Saraswati', icon: '📚', phrase: 'Jai Maa Saraswati' },
      brahma: { name: 'Brahma', subtitle: 'Om Brahmdevay Namah', icon: '🌟', phrase: 'Om Brahmdevay Namah' },
      ganesh: { name: 'Ganesh', subtitle: 'Jai Bappa Morya', icon: '🐘', phrase: 'Jai Bappa Morya' },
      krishna: { name: 'Krishna', subtitle: 'Jai Shree Krishna', icon: ' flute', phrase: 'Jai Shree Krishna' },
      radha: { name: 'Radha', subtitle: 'Jai Radhe Shyam', icon: '🌹', phrase: 'Jai Radhe Shyam' },
      'radhe-krishna': { name: 'Radhe Krishna', subtitle: 'Jai Radhe Krishna', icon: '❤️', phrase: 'Jai Radhe Krishna' }
    },
    sikh: {
      'guru-nanak': { name: 'Guru Nanak', subtitle: 'Sat Sri Akal', icon: '☬', phrase: 'Sat Sri Akal' },
      'guru-granth-sahib': { name: 'Guru Granth Sahib', subtitle: 'Guru Granth Sahib Ji', icon: ' Granth', phrase: 'Guru Granth Sahib Ji' },
      'guru-gobind-singh': { name: 'Guru Gobind Singh', subtitle: 'Deg Tegh Fateh', icon: '⚔️', phrase: 'Deg Tegh Fateh' },
      waheguru: { name: 'Waheguru', subtitle: 'Waheguru Ji Ka Khalsa', icon: '⚡', phrase: 'Waheguru Ji Ka Khalsa' }
    },
    christian: {
      jesus: { name: 'Jesus Christ', subtitle: 'Hallelujah', icon: '✝️', phrase: 'Hallelujah' },
      'god-the-father': { name: 'God the Father', subtitle: 'Our Father in Heaven', icon: ' 👑', phrase: 'Our Father in Heaven' },
      'holy-spirit': { name: 'Holy Spirit', subtitle: 'Come Holy Spirit', icon: ' 💨', phrase: 'Come Holy Spirit' },
      mary: { name: 'Virgin Mary', subtitle: 'Hail Mary', icon: ' 👩', phrase: 'Hail Mary' },
      'archangel-michael': { name: 'Archangel Michael', subtitle: 'Saint Michael the Archangel', icon: ' ⚔️', phrase: 'Saint Michael the Archangel' }
    },
    islam: {
      allah: { name: 'Allah', subtitle: 'Allahu Akbar', icon: '☪️', phrase: 'Allahu Akbar' },
      muhammad: { name: 'Prophet Muhammad', subtitle: 'Peace Be Upon Him', icon: ' ☪️', phrase: 'Peace Be Upon Him' },
      quran: { name: 'Quran', subtitle: 'Bismillah', icon: ' 📖', phrase: 'Bismillah' },
      kaaba: { name: 'Kaaba', subtitle: 'Allah Hu Akbar', icon: ' 🕋', phrase: 'Allah Hu Akbar' }
    },
    jewish: {
      yahweh: { name: 'Yahweh', subtitle: 'Hallelujah', icon: '✡️', phrase: 'Hallelujah' },
      torah: { name: 'Torah', subtitle: 'Baruch Hashem', icon: ' 📜', phrase: 'Baruch Hashem' },
      abraham: { name: 'Abraham', subtitle: 'Lech Lecha', icon: ' 🕍', phrase: 'Lech Lecha' },
      moses: { name: 'Moses', subtitle: 'Shema Yisrael', icon: ' 📜', phrase: 'Shema Yisrael' }
    }
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

  
  const getDeityInfo = () => {
    if (!religionId || !deityId || !deities[religionId] || !deities[religionId][deityId]) {
      return null;
    }
    return deities[religionId][deityId];
  };

  const deityInfo = getDeityInfo();
  const religionIcon = religionId ? religionIcons[religionId] : null;
  const religionColor = religionId ? getReligionColor(religionId) : '';

  
  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };

  
  const resetCount = () => {
    setCount(0);
  };

  
  const saveAndShowLeaderboard = async () => {
    if (!user || count === 0) {
      navigate('/chanting-leaderboard');
      return;
    }

    setIsSaving(true);
    try {
      
      const sessionId = `${user.id}_${Date.now()}`;
      
      
      await setDoc(doc(db, 'chantingSessions', sessionId), {
        id: sessionId,
        userId: user.id,
        username: user.name || 'Anonymous User',
        religion: religionId,
        deity: deityId,
        deityName: deityInfo?.name,
        count: count,
        timestamp: serverTimestamp()
      });
      
      setIsSaved(true);
      
      setTimeout(() => {
        navigate('/chanting-leaderboard');
      }, 1000);
    } catch (error) {
      console.error('Error saving chanting data:', error);
      
      navigate('/chanting-leaderboard');
    } finally {
      setIsSaving(false);
    }
  };

  
  const handleBack = () => {
    navigate(-1);
  };

  
  if (!deityInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deity Not Found</h2>
          <p className="text-gray-600 mb-6">The selected deity is not available.</p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className={`bg-gradient-to-r ${religionColor} w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg`}>
            {religionIcon}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Chanting {deityInfo.name}
          </h2>
          <p className="text-xl text-gray-600">
            {deityInfo.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-8">{deityInfo.icon}</div>
          
          <div className="mb-10">
            <p className="text-2xl font-semibold text-gray-800 mb-2">Chanting Phrase:</p>
            <p className="text-3xl font-bold text-rose-600">{deityInfo.phrase}</p>
          </div>

          <div className="mb-10">
            <p className="text-lg text-gray-600 mb-4">Tap the button below to count your chants</p>
            <div className="text-6xl font-bold text-rose-600 mb-8">{count}</div>
            <button
              onClick={incrementCount}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-2xl font-bold px-12 py-6 rounded-full shadow-lg hover:from-rose-600 hover:to-pink-600 transition-all transform hover:scale-105 active:scale-95"
            >
              <Heart className="inline mr-3" />
              Chant
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={resetCount}
              className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </button>
            <button
              onClick={saveAndShowLeaderboard}
              disabled={isSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <Check className="h-5 w-5" />
                  Saved! See Leaderboard
                </>
              ) : (
                <>
                  <Trophy className="h-5 w-5" />
                  End Chant & See Leaderboard
                </>
              )}
            </button>
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
            Each chant brings you closer to peace and spiritual strength
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChantingCounterPage;