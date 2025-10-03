import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface TodoListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TodoListModal: React.FC<TodoListModalProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!auth.currentUser || !isOpen) return;

    const notesRef = collection(db, 'users', auth.currentUser.uid, 'todoList');
    const q = query(notesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Note[];
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const handleAddNote = async () => {
    if (!title.trim() || !content.trim() || !auth.currentUser) return;

    try {
      if (editingId) {
        const noteRef = doc(db, 'users', auth.currentUser.uid, 'todoList', editingId);
        await updateDoc(noteRef, {
          title,
          content,
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'users', auth.currentUser.uid, 'todoList'), {
          title,
          content,
          createdAt: new Date(),
        });
      }
      setTitle('');
      setContent('');
      setShowForm(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!auth.currentUser) return;

    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'todoList', noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditNote = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setShowForm(false);
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
          className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col border-4 border-green-500"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Check className="h-8 w-8 text-green-100" />
              <div>
                <h2 className="text-2xl font-bold text-white">To-Do List</h2>
                <p className="text-green-100 text-sm">Organize your day and take notes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!showForm && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all shadow-lg mb-6 flex items-center justify-center gap-3"
              >
                <Plus className="h-6 w-6" />
                <span className="text-lg font-semibold">Add New Note</span>
              </motion.button>
            )}

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 mb-6 shadow-lg border-2 border-green-300"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {editingId ? 'Edit Note' : 'New Note'}
                </h3>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg mb-4 focus:outline-none focus:border-green-600 transition-colors"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note here..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg mb-4 focus:outline-none focus:border-green-600 transition-colors resize-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddNote}
                    disabled={!title.trim() || !content.trim()}
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingId ? 'Update' : 'Add'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              {notes.length === 0 && !showForm && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No notes yet. Add your first note!</p>
                </div>
              )}

              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl p-6 shadow-md border-2 border-green-200 hover:border-green-400 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-all"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap mb-3">{note.content}</p>
                  <p className="text-sm text-gray-500">
                    {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodoListModal;
