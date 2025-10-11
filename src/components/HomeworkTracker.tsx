import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'done' | 'not-done';
  createdAt: Date;
}

const HomeworkTracker: React.FC = () => {
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHomework, setNewHomework] = useState({
    subject: '',
    title: '',
    description: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        await loadHomework(user.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadHomework = async (uid: string) => {
    try {
      const homeworkQuery = query(
        collection(db, 'homework'),
        where('studentUid', '==', uid)
      );
      const homeworkSnapshot = await getDocs(homeworkQuery);
      const homeworkData: HomeworkItem[] = [];
      homeworkSnapshot.forEach(doc => {
        homeworkData.push({ id: doc.id, ...doc.data() } as HomeworkItem);
      });
      setHomework(homeworkData.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    } catch (error) {
      console.error('Error loading homework:', error);
    }
  };

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid) return;

    try {
      await addDoc(collection(db, 'homework'), {
        studentUid: userUid,
        subject: newHomework.subject,
        title: newHomework.title,
        description: newHomework.description,
        dueDate: newHomework.dueDate,
        status: 'not-done',
        createdAt: new Date()
      });

      await loadHomework(userUid);
      setNewHomework({ subject: '', title: '', description: '', dueDate: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding homework:', error);
    }
  };

  const toggleHomeworkStatus = async (homeworkId: string, currentStatus: string) => {
    if (!userUid) return;

    try {
      const newStatus = currentStatus === 'done' ? 'not-done' : 'done';
      // Validate that the document exists before updating
      const homeworkRef = doc(db, 'homework', homeworkId);
      const homeworkSnap = await getDoc(homeworkRef);
      
      if (!homeworkSnap.exists()) {
        console.error('Homework document not found');
        return;
      }
      
      await updateDoc(homeworkRef, {
        status: newStatus
      });
      await loadHomework(userUid);
    } catch (error) {
      console.error('Error updating homework status:', error);
    }
  };

  const deleteHomework = async (homeworkId: string) => {
    if (!userUid) return;

    try {
      await deleteDoc(doc(db, 'homework', homeworkId));
      await loadHomework(userUid);
    } catch (error) {
      console.error('Error deleting homework:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completedCount = homework.filter(h => h.status === 'done').length;
  const totalCount = homework.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Homework Tracker</h2>
          <p className="text-gray-600">
            {completedCount} of {totalCount} completed
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Homework</span>
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Homework</h3>
            <form onSubmit={handleAddHomework} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newHomework.subject}
                    onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mathematics"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newHomework.dueDate}
                    onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newHomework.title}
                  onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Chapter 5 Exercise"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newHomework.description}
                  onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Details about the homework..."
                  rows={3}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Homework
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {homework.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No homework added yet</p>
          <p className="text-gray-400 text-sm mt-2">Click "Add Homework" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {homework.map((hw) => (
            <motion.div
              key={hw.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                hw.status === 'done' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{hw.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      hw.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {hw.status === 'done' ? 'Done' : 'Not Done'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{hw.subject}</p>
                  <p className="text-gray-700 mb-3">{hw.description}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(hw.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleHomeworkStatus(hw.id, hw.status)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      hw.status === 'done'
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    {hw.status === 'done' ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <XCircle className="h-6 w-6" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteHomework(hw.id)}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeworkTracker;
