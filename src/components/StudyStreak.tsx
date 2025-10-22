import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Calendar, 
  Target, 
  Award, 
  Flame,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DailyActivity {
  date: string;
  completed: boolean;
  xp: number;
  activities: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
  xpReward: number;
}

const StudyStreak: React.FC = () => {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [longestStreak, setLongestStreak] = useState(15);
  const [totalXP, setTotalXP] = useState(1240);
  const [todayXP, setTodayXP] = useState(45);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Mock data for daily activities
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([
    { date: '2025-10-20', completed: true, xp: 50, activities: ['Math Quiz', 'Science Flashcards'] },
    { date: '2025-10-19', completed: true, xp: 45, activities: ['English Homework', 'History Reading'] },
    { date: '2025-10-18', completed: true, xp: 60, activities: ['Physics Problems', 'Chemistry Lab'] },
    { date: '2025-10-17', completed: true, xp: 40, activities: ['Biology Quiz', 'Math Practice'] },
    { date: '2025-10-16', completed: true, xp: 55, activities: ['All Subjects Review'] },
    { date: '2025-10-15', completed: true, xp: 35, activities: ['English Essay', 'History Notes'] },
    { date: '2025-10-14', completed: true, xp: 45, activities: ['Math Test', 'Science Flashcards'] },
    { date: '2025-10-13', completed: false, xp: 0, activities: [] },
    { date: '2025-10-12', completed: true, xp: 50, activities: ['Full Day Study'] },
  ]);

  // Mock achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: 'First Steps', description: 'Complete your first study session', icon: CheckCircle, unlocked: true, xpReward: 10 },
    { id: '2', title: 'Week Warrior', description: 'Maintain a 7-day study streak', icon: Flame, unlocked: true, xpReward: 50 },
    { id: '3', title: 'Knowledge Seeker', description: 'Earn 1000 XP', icon: Award, unlocked: true, xpReward: 100 },
    { id: '4', title: 'Month Master', description: 'Maintain a 30-day study streak', icon: Calendar, unlocked: false, xpReward: 200 },
    { id: '5', title: 'Quiz Champion', description: 'Score 100% on 5 quizzes', icon: Target, unlocked: false, xpReward: 75 },
    { id: '6', title: 'Night Owl', description: 'Study between 10 PM and 6 AM', icon: Clock, unlocked: false, xpReward: 30 },
  ]);

  const today = new Date().toISOString().split('T')[0];
  const todayActivity = dailyActivities.find(activity => activity.date === today);

  const handleActivityComplete = (activity: string) => {
    // In a real implementation, this would update the backend
    setTodayXP(prev => prev + 10);
    setTotalXP(prev => prev + 10);
    
    // Update today's activity
    setDailyActivities(prev => 
      prev.map(dayActivity => 
        dayActivity.date === today 
          ? { ...dayActivity, xp: dayActivity.xp + 10, activities: [...dayActivity.activities, activity] } 
          : dayActivity
      )
    );
  };

  // Mock activities that can be completed
  const availableActivities = [
    { id: '1', name: 'Complete Math Quiz', xp: 20 },
    { id: '2', name: 'Review Science Notes', xp: 15 },
    { id: '3', name: 'Practice English Grammar', xp: 10 },
    { id: '4', name: 'Read History Chapter', xp: 25 },
    { id: '5', name: 'Solve Physics Problems', xp: 30 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Streak & XP</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your progress and earn rewards for consistent studying
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Current Streak */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white">
          <div className="flex items-center">
            <Flame className="h-8 w-8" />
            <div className="ml-3">
              <p className="text-sm opacity-90">Current Streak</p>
              <p className="text-2xl font-bold">{currentStreak} days</p>
            </div>
          </div>
        </div>
        
        {/* Longest Streak */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{longestStreak} days</p>
            </div>
          </div>
        </div>
        
        {/* Total XP */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalXP} XP</p>
            </div>
          </div>
        </div>
        
        {/* Today's XP */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's XP</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayXP} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Study Calendar</h2>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before the first of the month */}
          {[...Array(3)].map((_, i) => (
            <div key={`empty-${i}`} className="h-10"></div>
          ))}
          
          {/* Calendar days */}
          {[...Array(31)].map((_, i) => {
            const day = i + 1;
            const dateStr = `2025-10-${day < 10 ? '0' + day : day}`;
            const activity = dailyActivities.find(a => a.date === dateStr);
            const isToday = dateStr === today;
            
            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  isToday 
                    ? 'bg-blue-500 text-white' 
                    : activity?.completed 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {day}
              </motion.div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Not Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Today</span>
          </div>
        </div>
      </div>

      {/* Today's Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Activities</h2>
          
          {todayActivity?.activities.length ? (
            <div className="space-y-3">
              {todayActivity.activities.map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-800 dark:text-gray-200">{activity}</span>
                  <span className="ml-auto text-sm font-medium text-green-600 dark:text-green-400">+10 XP</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No activities yet today</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Complete activities to earn XP and maintain your streak
              </p>
            </div>
          )}
          
          {/* Available Activities */}
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Available Activities</h3>
            <div className="space-y-2">
              {availableActivities.map(activity => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-gray-800 dark:text-gray-200">{activity.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mr-3">+{activity.xp} XP</span>
                    <button 
                      onClick={() => handleActivityComplete(activity.name)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h2>
          
          <div className="space-y-4">
            {achievements.map(achievement => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center p-4 rounded-lg border ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-900/30 dark:to-amber-900/30 dark:border-yellow-700'
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400' 
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className={`font-medium ${
                      achievement.unlocked 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${
                      achievement.unlocked 
                        ? 'text-gray-700 dark:text-gray-300' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      achievement.unlocked 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      +{achievement.xpReward} XP
                    </div>
                    {achievement.unlocked && (
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">Unlocked!</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyStreak;