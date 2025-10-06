import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, BookOpen } from 'lucide-react';
import { dronacharyaChat } from '../utils/dronacharyaChat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface HomeworkHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HomeworkHelpModal: React.FC<HomeworkHelpModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: Message = {
        role: 'assistant',
        content: 'Namaste! I am Dronacharya, your homework guide. I am here to help you understand and solve your homework problems. What subject or topic do you need help with today?',
      };
      setMessages([initialMessage]);
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

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

      const homeworkPrompt = `You are Dronacharya, a wise teacher helping a student with their homework. The student asks: "${input}". Provide a clear, educational response that guides them to understand the concept rather than just giving the answer. Support Hindi, English, and Hinglish. Keep it encouraging and educational.`;

      const response = await dronacharyaChat(homeworkPrompt, 'stress', conversationHistory);
      const aiMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
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
          className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col border-4 border-amber-700 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d97706" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        >
          <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 p-6 rounded-t-xl flex justify-between items-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 600\'%3E%3Cpath fill=\'%23ffffff\' d=\'M400 300 L450 250 L500 300 L450 350 Z M200 200 L250 150 L300 200 L250 250 Z M600 400 L650 350 L700 400 L650 450 Z\'/%3E%3C/svg%3E")',
              }}
            ></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-amber-200 flex items-center justify-center shadow-lg border-2 border-white">
                <BookOpen className="h-6 w-6 text-amber-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Homework Help</h2>
                <p className="text-amber-100 text-sm">Chat with Dronacharya</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all relative z-10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-4 rounded-2xl shadow-md ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border-2 border-amber-400'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start items-start gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-none border-2 border-amber-400 shadow-md">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t-4 border-amber-400 rounded-b-xl">
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your homework question..."
                className="flex-1 px-4 py-3 border-2 border-amber-400 rounded-xl focus:outline-none focus:border-amber-700 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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

export default HomeworkHelpModal;
