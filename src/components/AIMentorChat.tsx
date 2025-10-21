import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, BookOpen, Calculator, Beaker, Globe, Zap, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  subject?: string;
}

const AIMentorChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Dronacharya, your AI mentor. How can I help you with your studies today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'bg-blue-500' },
    { id: 'science', name: 'Science', icon: Beaker, color: 'bg-green-500' },
    { id: 'english', name: 'English', icon: BookOpen, color: 'bg-purple-500' },
    { id: 'social', name: 'Social Studies', icon: Globe, color: 'bg-amber-500' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText, selectedSubject),
        sender: 'ai',
        timestamp: new Date(),
        subject: selectedSubject || undefined
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, subject: string | null): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (subject === 'math') {
      if (lowerInput.includes('quadratic') || lowerInput.includes('equation')) {
        return "A quadratic equation is in the form ax² + bx + c = 0. You can solve it using the quadratic formula: x = (-b ± √(b² - 4ac)) / (2a). Would you like me to walk through an example?";
      }
      if (lowerInput.includes('algebra') || lowerInput.includes('factor')) {
        return "Algebra involves using symbols to represent numbers in equations. Factoring means breaking down expressions into simpler components. For example, x² - 9 = (x + 3)(x - 3). What specific algebra concept would you like to explore?";
      }
      return "I see you're asking about math! I can help with algebra, geometry, calculus, and more. Could you be more specific about what you need help with?";
    }
    
    if (subject === 'science') {
      if (lowerInput.includes('photosynthesis')) {
        return "Photosynthesis is the process by which plants convert light energy into chemical energy. The equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. This process occurs in the chloroplasts of plant cells. Would you like to know more about the stages?";
      }
      if (lowerInput.includes('gravity') || lowerInput.includes('newton')) {
        return "Newton's law of universal gravitation states that every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between them: F = G(m₁m₂)/r². How can I help you understand this better?";
      }
      return "Science is fascinating! I can help with physics, chemistry, biology, and more. What specific topic would you like to explore?";
    }
    
    if (subject === 'english') {
      if (lowerInput.includes('metaphor') || lowerInput.includes('figure of speech')) {
        return "A metaphor is a figure of speech that directly compares two unrelated subjects by stating one is the other. For example, 'Time is money' suggests time is as valuable as money. Unlike a simile, metaphors don't use 'like' or 'as'. Would you like to analyze some examples?";
      }
      if (lowerInput.includes('essay') || lowerInput.includes('write')) {
        return "A good essay has three parts: introduction (with thesis statement), body paragraphs (with evidence), and conclusion (summarizing main points). Start with an outline to organize your thoughts. What topic are you writing about?";
      }
      return "I can help with grammar, literature analysis, creative writing, and more! What aspect of English would you like assistance with?";
    }
    
    if (subject === 'social') {
      if (lowerInput.includes('constitution') || lowerInput.includes('india')) {
        return "The Indian Constitution came into effect on January 26, 1950. It's the longest written constitution in the world with 448 articles. Key features include federalism, parliamentary system, and fundamental rights. Which aspect would you like to know more about?";
      }
      if (lowerInput.includes('industrial') || lowerInput.includes('revolution')) {
        return "The Industrial Revolution (1760-1840) transformed economies from agricultural to manufacturing. It began in Britain and spread globally, leading to urbanization, technological advances, and social changes. What specific impact interests you?";
      }
      return "Social studies covers history, geography, economics, and civics. What topic would you like to explore?";
    }
    
    // General responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello there! I'm Dronacharya, your AI mentor. I can help with any subject. Which subject would you like to focus on today?";
    }
    
    if (lowerInput.includes('thank')) {
      return "You're welcome! I'm here to help you succeed. Is there anything else I can assist you with?";
    }
    
    return "I'm Dronacharya, your AI mentor. I can help with Mathematics, Science, English, and Social Studies. What subject would you like to focus on today? Just let me know what specific topic you need help with!";
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    
    const subjectName = subjects.find(s => s.id === subjectId)?.name || '';
    const aiResponse: Message = {
      id: Date.now().toString(),
      text: `Great! I'll focus on ${subjectName}. What specific topic or question do you have?`,
      sender: 'ai',
      timestamp: new Date(),
      subject: subjectId
    };
    
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 z-40 w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-purple-500/50 transition-all border-4 border-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full animate-ping opacity-20"></div>
        <MessageCircle className="h-6 w-6 text-white relative z-10" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          AI
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col border-4 border-purple-400"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Dronacharya AI Mentor</h2>
                    <p className="text-purple-200 text-sm">Your personal learning assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden flex flex-col">
                {!selectedSubject && messages.length === 1 && (
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-b">
                    <h3 className="font-bold text-gray-800 mb-3">Select a Subject to Get Started:</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {subjects.map((subject) => {
                        const Icon = subject.icon;
                        return (
                          <motion.button
                            key={subject.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSubjectSelect(subject.id)}
                            className={`${subject.color} text-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-md hover:shadow-lg transition-all`}
                          >
                            <Icon className="h-8 w-8" />
                            <span className="font-semibold">{subject.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none shadow-md border'
                        }`}
                      >
                        {message.subject && message.sender === 'ai' && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${
                              message.subject === 'math' ? 'bg-blue-500' :
                              message.subject === 'science' ? 'bg-green-500' :
                              message.subject === 'english' ? 'bg-purple-500' :
                              'bg-amber-500'
                            }`}></div>
                            <span className="text-xs font-semibold">
                              {subjects.find(s => s.id === message.subject)?.name}
                            </span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none shadow-md border p-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask Dronacharya anything..."
                      className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      disabled={inputText.trim() === ''}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full p-3 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Dronacharya AI can make mistakes. Verify important information.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIMentorChat;