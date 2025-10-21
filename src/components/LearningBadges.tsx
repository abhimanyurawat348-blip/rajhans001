import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, BookOpen, Target, Zap, Award, Crown, Medal, Flame, CheckCircle } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface LeaderboardEntry {
  id: string;
  name: string;
  badges: number;
  points: number;
  avatar: string;
}

const LearningBadges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges');
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const badges: Badge[] = [
    {
      id: 'first-quiz',
      name: 'Quiz Master',
      description: 'Complete your first quiz',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      earned: true,
      earnedDate: '2025-10-15',
      rarity: 'common'
    },
    {
      id: 'perfect-score',
      name: 'Perfect Score',
      description: 'Achieve 100% in any quiz',
      icon: <Target className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      earned: true,
      earnedDate: '2025-10-18',
      rarity: 'uncommon'
    },
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day study streak',
      icon: <Flame className="h-8 w-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      earned: false,
      progress: 4,
      maxProgress: 7,
      rarity: 'uncommon'
    },
    {
      id: 'top-score',
      name: 'Top Performer',
      description: 'Achieve top 10% in any quiz',
      icon: <Crown className="h-8 w-8" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      earned: true,
      earnedDate: '2025-10-20',
      rarity: 'rare'
    },
    {
      id: 'quick-learner',
      name: 'Quick Learner',
      description: 'Complete 5 quizzes in one day',
      icon: <Zap className="h-8 w-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      earned: false,
      progress: 3,
      maxProgress: 5,
      rarity: 'rare'
    },
    {
      id: 'knowledge-seeker',
      name: 'Knowledge Seeker',
      description: 'Complete 50 quizzes',
      icon: <Trophy className="h-8 w-8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      earned: false,
      progress: 27,
      maxProgress: 50,
      rarity: 'epic'
    },
    {
      id: 'master-scholar',
      name: 'Master Scholar',
      description: 'Achieve 90%+ in 20 quizzes',
      icon: <Award className="h-8 w-8" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      earned: false,
      progress: 12,
      maxProgress: 20,
      rarity: 'legendary'
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete a quiz before 7 AM',
      icon: <Star className="h-8 w-8" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      earned: true,
      earnedDate: '2025-10-10',
      rarity: 'common'
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Rahul Sharma', badges: 12, points: 2450, avatar: 'RS' },
    { id: '2', name: 'Priya Patel', badges: 9, points: 2100, avatar: 'PP' },
    { id: '3', name: 'Amit Kumar', badges: 8, points: 1950, avatar: 'AK' },
    { id: '4', name: 'Sneha Reddy', badges: 7, points: 1800, avatar: 'SR' },
    { id: '5', name: 'Vikram Singh', badges: 6, points: 1650, avatar: 'VS' },
    { id: '6', name: 'Anjali Mehta', badges: 6, points: 1600, avatar: 'AM' },
    { id: '7', name: 'Rohan Gupta', badges: 5, points: 1450, avatar: 'RG' },
    { id: '8', name: 'Neha Desai', badges: 4, points: 1300, avatar: 'ND' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'uncommon': return 'border-green-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const totalBadges = badges.length;
  const earnedBadges = badges.filter(badge => badge.earned).length;
  const totalPoints = badges.filter(badge => badge.earned).reduce((sum, badge) => {
    const points = badge.rarity === 'common' ? 10 : 
                  badge.rarity === 'uncommon' ? 25 : 
                  badge.rarity === 'rare' ? 50 : 
                  badge.rarity === 'epic' ? 100 : 200;
    return sum + points;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🎓 Learning Badges & Leaderboard</h1>
        <p className="text-xl text-gray-600">
          Gamify your learning journey and compete with fellow students
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-full">
              <Medal className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Badges</p>
              <p className="text-3xl font-bold text-blue-900">{earnedBadges}/{totalBadges}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-500 text-white p-3 rounded-full">
              <Star className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Points Earned</p>
              <p className="text-3xl font-bold text-green-900">{totalPoints}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-500 text-white p-3 rounded-full">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-purple-700 font-medium">Rank</p>
              <p className="text-3xl font-bold text-purple-900">#3</p>
            </div>
          </div>
        </motion.div>
      </div>

      {}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-12">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                activeTab === 'badges'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Badges
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                activeTab === 'leaderboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Leaderboard
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'badges' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Badges</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    All
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Earned
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Not Earned
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ y: -5, scale: 1.03 }}
                    onClick={() => setSelectedBadge(badge.id)}
                    className={`rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                      badge.earned
                        ? `${badge.bgColor} ${badge.borderColor} shadow-md`
                        : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-full ${badge.earned ? badge.color : 'text-gray-400'} bg-white`}>
                        {badge.icon}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white`}>
                        {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                      </div>
                    </div>

                    <h3 className={`font-bold text-lg mb-2 ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </h3>
                    <p className={`text-sm mb-4 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {badge.description}
                    </p>

                    {badge.earned ? (
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Earned on {badge.earnedDate}
                      </div>
                    ) : badge.progress !== undefined && badge.maxProgress !== undefined ? (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{badge.progress}/{badge.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                            style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">Locked</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Leaderboard</h2>
              <div className="space-y-4">
                {leaderboard.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                        : index === 2
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-4 ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
                        index === 2 ? 'bg-gradient-to-r from-amber-600 to-orange-600' :
                        'bg-gradient-to-r from-blue-500 to-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.badges} badges • {student.points} points</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Trophy className={`h-5 w-5 mr-2 ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-500' :
                        index === 2 ? 'text-amber-600' :
                        'text-blue-500'
                      }`} />
                      <span className="font-bold text-gray-900">#{index + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">🏆 Weekly Challenge</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Complete 3 quizzes this week to earn the "Knowledge Seeker" badge and 50 bonus points!
        </p>
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 rounded-full p-1">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold">
              2/3 Quizzes Completed
            </div>
          </div>
        </div>
        <div className="w-full bg-white/30 rounded-full h-4 max-w-md mx-auto">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full"
            style={{ width: '66%' }}
          ></div>
        </div>
      </div>

      {}
      {selectedBadge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedBadge(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {badges.filter(b => b.id === selectedBadge).map(badge => (
              <div key={badge.id}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-full ${badge.earned ? badge.color : 'text-gray-400'} bg-white border-2 ${badge.earned ? badge.borderColor : 'border-gray-200'}`}>
                    {badge.icon}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white`}>
                    {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{badge.name}</h3>
                <p className="text-gray-600 mb-6">{badge.description}</p>

                {badge.earned ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Badge Earned!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Congratulations! You earned this badge on {badge.earnedDate}.
                    </p>
                  </div>
                ) : badge.progress !== undefined && badge.maxProgress !== undefined ? (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress to unlock</span>
                      <span className="font-medium">{badge.progress}/{badge.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                        style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                    <p className="text-gray-600 text-center">
                      Complete the required tasks to unlock this badge
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LearningBadges;