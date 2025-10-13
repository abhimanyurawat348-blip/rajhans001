import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart, Bot, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { dronacharyaChat } from '../utils/dronacharyaChat';
import { cohereChat } from '../utils/cohereChat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface StressReliefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StressReliefModal: React.FC<StressReliefModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState<'gemini' | 'cohere'>('gemini'); 
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: Message = {
        role: 'assistant',
        content: "Hi, I'm Dronacharya 👋 What's on your mind? Feel free to share what's bothering you.",
      };
      setMessages([initialMessage]);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

      
      let response = '';
      if (aiProvider === 'cohere') {
        response = await cohereChat(input, 'stress', conversationHistory);
      } else {
        response = await dronacharyaChat(input, 'stress', conversationHistory);
      }

      const aiMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, aiMessage]);

      if (auth.currentUser) {
        await addDoc(collection(db, 'users', auth.currentUser.uid, 'stressChats'), {
          sessionId: Date.now().toString(),
          messages: [...messages, userMessage, aiMessage],
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get response from AI. Please try again.');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleAiProvider = () => {
    setAiProvider(prev => prev === 'gemini' ? 'cohere' : 'gemini');
    setError(null);
  };

  const checkApiKey = () => {
    const apiKey = aiProvider === 'cohere' 
      ? import.meta.env.VITE_COHERE_API_KEY 
      : import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setError(`API key not configured for ${aiProvider === 'cohere' ? 'Cohere' : 'Gemini'}. Please contact support.`);
      return false;
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col border-4 border-pink-400"
          onClick={(e) => e.stopPropagation()}
        >
          {}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center py-2 font-bold">
            AI Tutor (Dronacharya) - Under Development
          </div>
          
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-pink-100" />
              <div>
                <h2 className="text-2xl font-bold text-white">Stress Relief</h2>
                <p className="text-pink-100 text-sm">Your supportive guide</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAiProvider}
                className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-full text-sm transition-all"
              >
                <Bot className="h-4 w-4" />
                {aiProvider === 'gemini' ? 'Gemini' : 'Cohere'}
              </button>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={`message-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-4 rounded-2xl shadow-md ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border-2 border-pink-300'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && index === messages.length - 1 && (
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      Powered by {aiProvider === 'gemini' ? 'Google Gemini' : 'Cohere AI'}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start items-start gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-none border-2 border-pink-300 shadow-md">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t-4 border-pink-300 rounded-b-xl">
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1 px-4 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={() => {
                  if (checkApiKey()) {
                    handleSend();
                  }
                }}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Dronacharya AI provides educational and motivational guidance only — not medical or clinical advice.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StressReliefModal;