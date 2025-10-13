import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Check, Target, Flame, TrendingUp, Lock } from 'lucide-react';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  category: 'daily' | 'weekly' | 'monthly';
}

interface EnhancedTodoListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const motivationalQuotes = [
  "You're closer than you think!",
  "Every step counts!",
  "Keep pushing forward!",
  "You've got this!",
  "Believe in yourself!",
  "Progress, not perfection!",
  "One task at a time!",
];

const EnhancedTodoListModal: React.FC<EnhancedTodoListModalProps> = ({ isOpen, onClose }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showForm, setShowForm] = useState(false);
  const [streak, setStreak] = useState(0);
  const [quote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  const isAuthenticated = !!auth.currentUser;

  useEffect(() => {
    if (!auth.currentUser || !isOpen) return;

    const todosRef = collection(db, 'users', auth.currentUser.uid, 'todos');
    const q = query(todosRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Todo[];
      setTodos(todosData);
      calculateStreak(todosData);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const calculateStreak = (todosData: Todo[]) => {
    const completedTodos = todosData.filter(todo => todo.completed);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dayStart = new Date(checkDate);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasCompletedToday = completedTodos.some(todo => {
        const todoDate = new Date(todo.createdAt);
        return todoDate >= dayStart && todoDate <= dayEnd;
      });

      if (hasCompletedToday) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const handleAddTodo = async () => {
    if (!title.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'todos'), {
        title,
        description,
        category,
        completed: false,
        createdAt: new Date(),
      });
      setTitle('');
      setDescription('');
      setShowForm(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleTodo = async (todoId: string, currentStatus: boolean) => {
    if (!auth.currentUser) return;

    try {
      const todoRef = doc(db, 'users', auth.currentUser.uid, 'todos', todoId);
      await updateDoc(todoRef, {
        completed: !currentStatus,
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!auth.currentUser) return;

    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'todos', todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!isOpen) return null;

  if (!isAuthenticated) {
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              Please log in to access your personal to-do list. Your tasks are private and encrypted, visible only to you.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-semibold shadow-lg"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

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
          className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border-4 border-cyan-400"
          onClick={(e) => e.stopPropagation()}
        >
          {}
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white text-center py-2 font-bold">
            AI Tutor (Dronacharya) - Under Development
          </div>
          
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 p-6 rounded-t-xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-cyan-100" />
                <div>
                  <h2 className="text-2xl font-bold text-white">My Goals</h2>
                  <p className="text-cyan-100 text-sm">{quote}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <Flame className="h-6 w-6 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{streak}</div>
                <div className="text-xs text-cyan-100">Day Streak</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <TrendingUp className="h-6 w-6 text-green-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
                <div className="text-xs text-cyan-100">Completed</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <Check className="h-6 w-6 text-blue-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{completedCount}/{totalCount}</div>
                <div className="text-xs text-cyan-100">Tasks Done</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!showForm && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg mb-6 flex items-center justify-center gap-3"
              >
                <Plus className="h-6 w-6" />
                <span className="text-lg font-semibold">Add New Goal</span>
              </motion.button>
            )}

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 mb-6 shadow-lg border-2 border-cyan-300"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">New Goal</h3>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Goal title"
                  className="w-full px-4 py-3 border-2 border-cyan-300 rounded-lg mb-4 focus:outline-none focus:border-cyan-600 transition-colors"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-cyan-300 rounded-lg mb-4 focus:outline-none focus:border-cyan-600 transition-colors resize-none"
                />
                <div className="flex gap-2 mb-4">
                  {(['daily', 'weekly', 'monthly'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                        category === cat
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddTodo}
                    disabled={!title.trim()}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Goal
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setTitle('');
                      setDescription('');
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            <div className="grid gap-4">
              {todos.length === 0 && !showForm && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No goals yet. Start by adding your first goal!</p>
                </div>
              )}

              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-gradient-to-br rounded-xl p-5 shadow-lg border-2 transition-all ${
                    todo.completed
                      ? 'from-green-100 to-emerald-100 border-green-400'
                      : 'from-white to-cyan-50 border-cyan-300 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleTodo(todo.id, todo.completed)}
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? 'bg-green-500 border-green-600'
                          : 'border-cyan-400 hover:border-cyan-600'
                      }`}
                    >
                      {todo.completed && <Check className="h-5 w-5 text-white" />}
                    </button>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${todo.completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-sm mt-1 ${todo.completed ? 'text-green-700' : 'text-gray-600'}`}>
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          todo.category === 'daily' ? 'bg-blue-200 text-blue-800' :
                          todo.category === 'weekly' ? 'bg-purple-200 text-purple-800' :
                          'bg-orange-200 text-orange-800'
                        }`}>
                          {todo.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {todo.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedTodoListModal;
