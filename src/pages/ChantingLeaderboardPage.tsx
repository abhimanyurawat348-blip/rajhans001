import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Trophy, Crown, Medal } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  deity: string;
  deityName: string;
  religion: string;
  count: number;
  timestamp: Date;
}

const ChantingLeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const q = query(
      collection(db, 'chantingSessions'),
      orderBy('count', 'desc'),
      limit(50) 
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leaderboardData: LeaderboardEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leaderboardData.push({
          id: doc.id,
          userId: data.userId,
          username: data.username,
          deity: data.deity,
          deityName: data.deityName,
          religion: data.religion,
          count: data.count,
          timestamp: data.timestamp?.toDate() || new Date()
        });
      });
      
      setLeaderboard(leaderboardData);
      
      
      if (user) {
        const userIndex = leaderboardData.findIndex(entry => entry.userId === user.id);
        setUserRank(userIndex !== -1 ? userIndex + 1 : null);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    });

    
    return () => unsubscribe();
  }, [user]);

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1: return <Medal className="h-6 w-6 text-gray-400" />;
      case 2: return <Medal className="h-6 w-6 text-amber-700" />;
      default: return <span className="text-lg font-bold text-gray-600">#{index + 1}</span>;
    }
  };

  const getReligionColor = (religion: string): string => {
    switch (religion?.toLowerCase()) {
      case 'hindu': return 'bg-orange-100 text-orange-800';
      case 'sikh': return 'bg-blue-100 text-blue-800';
      case 'christian': return 'bg-purple-100 text-purple-800';
      case 'islamic': return 'bg-green-100 text-green-800';
      case 'jewish': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReligionName = (religion: string): string => {
    switch (religion?.toLowerCase()) {
      case 'hindu': return 'Hindu';
      case 'sikh': return 'Sikh';
      case 'christian': return 'Christian';
      case 'islamic': return 'Islamic';
      case 'jewish': return 'Jewish';
      default: return religion || 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Chanting Leaderboard</h1>
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
            <Trophy className="h-10 w-10" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Spiritual Chanting Champions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See who has chanted the most divine names and achieved spiritual excellence
          </p>
          
          {}
          {user && userRank && (
            <div className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3">
                {userRank <= 3 ? (
                  userRank === 1 ? (
                    <Crown className="h-8 w-8 text-yellow-300" />
                  ) : (
                    <Medal className={`h-8 w-8 ${userRank === 2 ? 'text-gray-300' : 'text-amber-700'}`} />
                  )
                ) : (
                  <span className="text-2xl font-bold">#{userRank}</span>
                )}
                <div>
                  <p className="font-bold text-lg">Your Rank</p>
                  <p className="text-sm opacity-90">You've chanted {leaderboard.find(e => e.userId === user.id)?.count || 0} times</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center p-4 rounded-xl border-2 ${
                    entry.userId === user?.id
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 shadow-md'
                      : index === 0 
                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300' 
                        : index === 1 
                          ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300' 
                          : index === 2 
                            ? 'bg-gradient-to-r from-amber-50 to-yellow-100 border-amber-300' 
                            : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="w-12 flex justify-center mr-4">
                    {getMedalIcon(index)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                          {entry.username}
                          {entry.userId === user?.id && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">You</span>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-600">{entry.deityName || entry.deity}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getReligionColor(entry.religion)}`}>
                            {getReligionName(entry.religion)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-rose-600">{entry.count}</div>
                        <div className="text-sm text-gray-500">chants</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Chanting Records Yet</h3>
            <p className="text-gray-600 mb-6">Be the first to chant and appear on the leaderboard!</p>
            <button
              onClick={() => navigate('/chanting')}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all"
            >
              Start Chanting
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 text-white text-center"
        >
          <Heart className="h-8 w-8 mx-auto mb-3" />
          <p className="text-lg font-medium">
            Keep chanting to climb the leaderboard and spread positivity!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChantingLeaderboardPage;