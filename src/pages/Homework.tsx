import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BookOpen, Calendar, CheckCircle, Clock, FileText, LogOut } from 'lucide-react';

interface Homework {
  id: string;
  studentId: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: Date;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  feedback?: string;
  attachments?: string[];
}

const Homework: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [homework, setHomework] = useState<Homework[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  useEffect(() => {
    if (user?.id) {
      
      const homeworkQuery = query(
        collection(db, 'homework'),
        where('studentId', '==', user.id)
      );
      
      const unsubscribe = onSnapshot(homeworkQuery, (snapshot) => {
        const homeworkData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Homework[];
        setHomework(homeworkData);
      });
      
      return () => unsubscribe();
    }
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/student-dashboard');
  };

  const markAsSubmitted = async (homeworkId: string) => {
    try {
      
      const homeworkRef = doc(db, 'homework', homeworkId);
      const homeworkSnap = await getDoc(homeworkRef);
      
      if (!homeworkSnap.exists()) {
        console.error('Homework document not found');
        return;
      }
      
      await updateDoc(homeworkRef, {
        status: 'submitted',
        submittedDate: new Date()
      });
    } catch (error) {
      console.error('Error updating homework status:', error);
    }
  };

  const filteredHomework = homework.filter(hw => {
    if (filter === 'all') return true;
    return hw.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: Date) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Homework Portal</h1>
            <p className="text-gray-600">Welcome, {user?.name || 'Student'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Homework</h2>
          <p className="text-gray-600">Manage and track all your assignments</p>
        </motion.div>

        {}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'all', label: 'All Homework' },
              { id: 'pending', label: 'Pending' },
              { id: 'submitted', label: 'Submitted' },
              { id: 'graded', label: 'Graded' }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filter === id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-blue-600">{homework.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {homework.filter(hw => hw.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-blue-600">
                  {homework.filter(hw => hw.status === 'submitted').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Graded</p>
                <p className="text-2xl font-bold text-green-600">
                  {homework.filter(hw => hw.status === 'graded').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {}
        <div className="space-y-6">
          {filteredHomework.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No homework found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? "You don't have any homework assignments yet." 
                  : `You don't have any ${filter} homework assignments.`}
              </p>
            </div>
          ) : (
            filteredHomework.map((hw) => (
              <motion.div
                key={hw.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                  isOverdue(hw.dueDate) && hw.status === 'pending'
                    ? 'border-red-500'
                    : hw.status === 'pending'
                    ? 'border-yellow-500'
                    : hw.status === 'submitted'
                    ? 'border-blue-500'
                    : 'border-green-500'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{hw.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(hw.status)}`}>
                        {hw.status.charAt(0).toUpperCase() + hw.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{hw.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{hw.subject}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Assigned: {new Date(hw.assignedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                      </div>
                      {isOverdue(hw.dueDate) && hw.status === 'pending' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                    {hw.grade && (
                      <div className="mt-3 flex items-center">
                        <span className="font-medium text-gray-700">Grade:</span>
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {hw.grade}
                        </span>
                      </div>
                    )}
                    {hw.feedback && (
                      <div className="mt-3">
                        <span className="font-medium text-gray-700">Feedback:</span>
                        <p className="mt-1 text-gray-600">{hw.feedback}</p>
                      </div>
                    )}
                  </div>
                  {hw.status === 'pending' && (
                    <button
                      onClick={() => markAsSubmitted(hw.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Submitted
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Homework;