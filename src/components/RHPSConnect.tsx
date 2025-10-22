import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  Users, 
  Bell, 
  Settings, 
  Hash,
  AtSign,
  Image,
  FileText,
  Mic,
  ThumbsUp,
  Reply,
  Edit,
  Trash2,
  User,
  BookOpen,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  role: 'student' | 'teacher' | 'admin';
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  reactions?: { emoji: string; userIds: string[] }[];
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'link';
  url: string;
}

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
}

interface ForumTopic {
  id: string;
  title: string;
  author: string;
  authorRole: 'student' | 'teacher';
  content: string;
  timestamp: Date;
  replies: number;
  views: number;
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
}

const RHPSConnect: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'forum' | 'notifications'>('messages');
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChannelMenu, setShowChannelMenu] = useState(false);
  
  // Mock data
  const [users] = useState<User[]>([
    { id: '1', name: 'You', avatar: '', status: 'online', role: 'student' },
    { id: '2', name: 'Ms. Sharma', avatar: '', status: 'online', role: 'teacher' },
    { id: '3', name: 'Rahul Patel', avatar: '', status: 'away', role: 'student' },
    { id: '4', name: 'Priya Gupta', avatar: '', status: 'online', role: 'student' },
    { id: '5', name: 'Dr. Verma', avatar: '', status: 'offline', role: 'teacher' }
  ]);
  
  const [channels] = useState<Channel[]>([
    { id: 'general', name: 'general', type: 'public', members: ['1', '2', '3', '4', '5'], unreadCount: 0 },
    { id: 'class-12a', name: 'class-12a', type: 'private', members: ['1', '2', '3', '4'], unreadCount: 3 },
    { id: 'science-club', name: 'science-club', type: 'public', members: ['1', '3', '5'], unreadCount: 1 },
    { id: 'ms-sharma', name: 'Ms. Sharma', type: 'direct', members: ['1', '2'], unreadCount: 0 }
  ]);
  
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'general': [
      { 
        id: '1', 
        senderId: '2', 
        content: 'Welcome to RHPS Connect! This is a place for all students and teachers to collaborate.', 
        timestamp: new Date(Date.now() - 3600000),
        reactions: [{ emoji: '👍', userIds: ['3'] }]
      },
      { 
        id: '2', 
        senderId: '3', 
        content: 'Thanks Ms. Sharma! This looks great.', 
        timestamp: new Date(Date.now() - 3500000) 
      }
    ],
    'class-12a': [
      { 
        id: '3', 
        senderId: '4', 
        content: 'Has anyone finished the math assignment?', 
        timestamp: new Date(Date.now() - 1800000),
        reactions: [{ emoji: '✋', userIds: ['1'] }]
      },
      { 
        id: '4', 
        senderId: '1', 
        content: 'Yes, I just submitted it. Let me know if you need help with any questions.', 
        timestamp: new Date(Date.now() - 1700000) 
      }
    ]
  });
  
  const [forumTopics] = useState<ForumTopic[]>([
    {
      id: '1',
      title: 'Best study techniques for board exams?',
      author: 'Rahul Patel',
      authorRole: 'student',
      content: 'I\'m looking for effective study techniques that have worked for others in preparing for board exams. Any tips?',
      timestamp: new Date(Date.now() - 86400000),
      replies: 12,
      views: 45,
      tags: ['study-tips', 'exams'],
      isPinned: true,
      isLocked: false
    },
    {
      id: '2',
      title: 'Physics lab experiment doubts',
      author: 'Priya Gupta',
      authorRole: 'student',
      content: 'I had some questions about the Newton\'s Laws experiment we did yesterday. Can someone explain the friction part?',
      timestamp: new Date(Date.now() - 43200000),
      replies: 5,
      views: 23,
      tags: ['physics', 'lab'],
      isPinned: false,
      isLocked: false
    },
    {
      id: '3',
      title: 'Important announcement: Exam schedule',
      author: 'Ms. Sharma',
      authorRole: 'teacher',
      content: 'The final exam schedule has been released. Please check the attachments for details.',
      timestamp: new Date(Date.now() - 21600000),
      replies: 2,
      views: 67,
      tags: ['exams', 'announcement'],
      isPinned: true,
      isLocked: false
    }
  ]);
  
  const [notifications] = useState([
    { id: '1', type: 'message', content: 'Ms. Sharma mentioned you in a message', timestamp: new Date(Date.now() - 300000), read: false },
    { id: '2', type: 'forum', content: 'Your forum post received 5 new replies', timestamp: new Date(Date.now() - 600000), read: false },
    { id: '3', type: 'assignment', content: 'New assignment uploaded in Mathematics', timestamp: new Date(Date.now() - 1800000), read: true }
  ]);

  const getCurrentUser = () => users.find(user => user.id === '1') || users[0];
  
  const getChannelMembers = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return [];
    return users.filter(user => channel.members.includes(user.id));
  };
  
  const getChannelName = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    return channel ? channel.name : 'Unknown';
  };
  
  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };
  
  const sendMessage = () => {
    if (messageInput.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1',
      content: messageInput,
      timestamp: new Date()
    };
    
    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMessage]
    }));
    
    setMessageInput('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => {
      const channelMessages = [...(prev[activeChannel] || [])];
      const messageIndex = channelMessages.findIndex(m => m.id === messageId);
      
      if (messageIndex !== -1) {
        const message = { ...channelMessages[messageIndex] };
        const reactionIndex = message.reactions?.findIndex(r => r.emoji === emoji);
        
        if (reactionIndex !== undefined && reactionIndex >= 0) {
          // Add user to existing reaction
          const reaction = { ...message.reactions![reactionIndex] };
          if (!reaction.userIds.includes('1')) {
            reaction.userIds.push('1');
          }
          message.reactions![reactionIndex] = reaction;
        } else {
          // Add new reaction
          if (!message.reactions) message.reactions = [];
          message.reactions.push({ emoji, userIds: ['1'] });
        }
        
        channelMessages[messageIndex] = message;
      }
      
      return {
        ...prev,
        [activeChannel]: channelMessages
      };
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            RHPS Connect
          </h1>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-blue-500">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-blue-500">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-blue-500">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="text-blue-100 text-sm mt-1">Connect, collaborate, and communicate with your school community</p>
      </div>
      
      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'messages'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'forum'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Forum
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-3 text-center text-sm font-medium relative ${
                activeTab === 'notifications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </div>
          
          {/* Messages Tab Content */}
          {activeTab === 'messages' && (
            <div className="flex-1 overflow-hidden">
              {/* Channels */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Channels</h3>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {channels.filter(c => c.type === 'public' || c.type === 'private').map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => setActiveChannel(channel.id)}
                      className={`w-full flex items-center px-2 py-1.5 rounded text-sm ${
                        activeChannel === channel.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Hash className="h-4 w-4 mr-1" />
                      {channel.name}
                      {channel.unreadCount > 0 && (
                        <span className="ml-auto bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Direct Messages */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Direct Messages</h3>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {channels.filter(c => c.type === 'direct').map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => setActiveChannel(channel.id)}
                      className={`w-full flex items-center px-2 py-1.5 rounded text-sm ${
                        activeChannel === channel.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="relative">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${getStatusColor('online')}`}></div>
                      </div>
                      <span className="ml-2">{channel.name}</span>
                      {channel.unreadCount > 0 && (
                        <span className="ml-auto bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Forum Tab Content */}
          {activeTab === 'forum' && (
            <div className="flex-1 overflow-hidden p-3">
              <div className="mb-3">
                <button className="w-full flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  New Topic
                </button>
              </div>
              <div className="space-y-2">
                {forumTopics.filter(t => t.isPinned).map(topic => (
                  <div key={topic.id} className="p-2 bg-yellow-50 rounded border border-yellow-200">
                    <div className="flex items-center">
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded mr-2">Pinned</span>
                      <span className="text-sm font-medium text-gray-900 truncate">{topic.title}</span>
                    </div>
                  </div>
                ))}
                {forumTopics.filter(t => !t.isPinned).map(topic => (
                  <div key={topic.id} className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 truncate">{topic.title}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{topic.replies} replies</span>
                      <span className="mx-2">•</span>
                      <span>{topic.views} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Notifications Tab Content */}
          {activeTab === 'notifications' && (
            <div className="flex-1 overflow-hidden p-3">
              <div className="space-y-2">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {notification.type === 'message' && <MessageSquare className="h-5 w-5 text-blue-500" />}
                        {notification.type === 'forum' && <Users className="h-5 w-5 text-green-500" />}
                        {notification.type === 'assignment' && <FileText className="h-5 w-5 text-purple-500" />}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">{notification.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Main Chat Area */}
        {activeTab === 'messages' && (
          <div className="flex-1 flex flex-col">
            {/* Channel Header */}
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Hash className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">{getChannelName(activeChannel)}</h2>
                <span className="ml-2 text-sm text-gray-500">
                  {getChannelMembers(activeChannel).length} members
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded">
                  <Filter className="h-5 w-5" />
                </button>
                <button 
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded"
                  onClick={() => setShowChannelMenu(!showChannelMenu)}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {(messages[activeChannel] || []).map(message => {
                  const sender = getUserById(message.senderId);
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex hover:bg-gray-100 p-2 rounded-lg"
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {sender?.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline">
                          <span className="font-medium text-gray-900">{sender?.name}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {sender?.role !== 'student' && (
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${getRoleBadge(sender?.role || 'student')}`}>
                              {sender?.role}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 mt-1">{message.content}</p>
                        
                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.reactions.map((reaction, index) => (
                              <button
                                key={index}
                                onClick={() => addReaction(message.id, reaction.emoji)}
                                className="flex items-center text-xs bg-gray-200 rounded-full px-2 py-1 hover:bg-gray-300"
                              >
                                <span>{reaction.emoji}</span>
                                <span className="ml-1">{reaction.userIds.length}</span>
                              </button>
                            ))}
                            <button className="text-xs text-gray-500 hover:text-gray-700">
                              <Smile className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        
                        {/* Message Actions */}
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                          <button className="hover:text-gray-700">Reply</button>
                          <button className="hover:text-gray-700">React</button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* Message Input */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex items-end">
                <div className="flex-1 mr-2">
                  <div className="border border-gray-300 rounded-lg bg-white">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Message #${getChannelName(activeChannel)}`}
                      className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:ring-0 resize-none max-h-32"
                      rows={1}
                    />
                    <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200">
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-500 hover:text-gray-700 rounded">
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700 rounded">
                          <Image className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700 rounded">
                          <AtSign className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => addReaction((messages[activeChannel] || [])[messages[activeChannel]?.length - 1]?.id || '', '👍')}
                          className="p-1 text-gray-500 hover:text-gray-700 rounded"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={messageInput.trim() === ''}
                  className={`p-2 rounded-full ${
                    messageInput.trim() === ''
                      ? 'text-gray-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Forum Content */}
        {activeTab === 'forum' && (
          <div className="flex-1 flex flex-col">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Discussion Forum</h2>
              <p className="text-sm text-gray-500 mt-1">Ask questions, share knowledge, and connect with your peers</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto">
                {forumTopics.map(topic => (
                  <div key={topic.id} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            {topic.author.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{topic.title}</h3>
                            {topic.isPinned && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pinned</span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>{topic.author}</span>
                            {topic.authorRole !== 'student' && (
                              <span className={`ml-2 px-1.5 py-0.5 rounded ${getRoleBadge(topic.authorRole)}`}>
                                {topic.authorRole}
                              </span>
                            )}
                            <span className="mx-2">•</span>
                            <span>{topic.timestamp.toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-700 mt-2">{topic.content}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {topic.tags.map(tag => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <button className="flex items-center hover:text-gray-700">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {topic.replies} replies
                              </button>
                              <span className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {topic.views} views
                              </span>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                              View Topic
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 bg-white">
              <button className="w-full flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                Start New Discussion
              </button>
            </div>
          </div>
        )}
        
        {/* Notifications Content */}
        {activeTab === 'notifications' && (
          <div className="flex-1 flex flex-col">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500 mt-1">Stay updated with all your school activities</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-800 flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Customize which notifications you receive and how you receive them.
                  </p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Manage Settings
                  </button>
                </div>
                
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          {notification.type === 'message' && (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                          {notification.type === 'forum' && (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-green-600" />
                            </div>
                          )}
                          {notification.type === 'assignment' && (
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-900">{notification.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.timestamp.toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Stats */}
      <div className="border-t border-gray-200 bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{users.filter(u => u.status === 'online').length} online</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{Object.values(messages).flat().length} messages</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{forumTopics.length} topics</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            RHPS Connect v2.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHPSConnect;