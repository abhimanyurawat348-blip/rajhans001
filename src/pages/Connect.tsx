import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Search, 
  Filter, 
  Send,
  ArrowLeft,
  Plus,
  User,
  BookOpen,
  Calendar,
  Bell
} from 'lucide-react';

const Connect: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data
  const conversations = [
    {
      id: '1',
      name: 'Mathematics Group',
      lastMessage: 'Can someone explain question 5?',
      time: '2 min ago',
      unread: 3,
      type: 'group'
    },
    {
      id: '2',
      name: 'Physics Study Group',
      lastMessage: 'The test is moved to next week',
      time: '1 hour ago',
      unread: 0,
      type: 'group'
    },
    {
      id: '3',
      name: 'Ms. Gupta',
      lastMessage: 'Your assignment looks good!',
      time: '3 hours ago',
      unread: 0,
      type: 'teacher'
    },
    {
      id: '4',
      name: 'Study Buddies',
      lastMessage: 'Meeting at 3 PM today',
      time: '5 hours ago',
      unread: 1,
      type: 'group'
    }
  ];

  const announcements = [
    {
      id: '1',
      title: 'School Annual Function',
      content: 'The annual function will be held on December 15th. All students are requested to participate.',
      author: 'Admin',
      time: '1 day ago',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Exam Schedule',
      content: 'The half-yearly exam schedule has been updated. Please check the notice board for details.',
      author: 'Exam Department',
      time: '2 days ago',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Library Hours Extended',
      content: 'The library will remain open until 8 PM on weekdays for exam preparation.',
      author: 'Library Department',
      time: '3 days ago',
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
                RHPS Connect
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Connect with classmates, teachers, and stay updated with announcements
              </p>
            </div>
            <Link
              to="/student-home"
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'messages'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Messages
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'announcements'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Bell className="h-4 w-4 inline mr-2" />
                Announcements
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'groups'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Groups
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id} 
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          {conversation.type === 'teacher' ? (
                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        {conversation.unread > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">{conversation.unread}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 dark:text-white">{conversation.name}</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{conversation.time}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-5 w-5 mr-2" />
                    New Message
                  </button>
                </div>
              </div>
            )}

            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search announcements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div 
                      key={announcement.id} 
                      className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{announcement.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          announcement.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          announcement.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{announcement.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <User className="h-4 w-4 mr-1" />
                          {announcement.author}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{announcement.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Groups Tab */}
            {activeTab === 'groups' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h2>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Group
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mathematics Study Group</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">For students preparing for mathematics exams</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Users className="h-4 w-4 mr-1" />
                      24 members
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Join Group
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 border border-green-200 dark:border-green-800">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Science Club</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Weekly science discussions and experiments</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Users className="h-4 w-4 mr-1" />
                      32 members
                    </div>
                    <button className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Join Group
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Class 12-A</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Official class group for all announcements</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Users className="h-4 w-4 mr-1" />
                      45 members
                    </div>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                      Join Group
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Connect;