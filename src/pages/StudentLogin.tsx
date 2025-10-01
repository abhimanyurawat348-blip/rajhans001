import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  };

  const getDeviceName = (): string => {
    const userAgent = navigator.userAgent;
    let device = 'Unknown Device';

    if (/Windows/i.test(userAgent)) {
      device = 'Windows PC';
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
      device = 'Mac';
    } else if (/Linux/i.test(userAgent)) {
      device = 'Linux PC';
    } else if (/Android/i.test(userAgent)) {
      device = 'Android Device';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      device = 'iOS Device';
    }

    return device;
  };

  const logLoginRecord = async (email: string, userId: string) => {
    try {
      const ipAddress = await getClientIP();
      const deviceName = getDeviceName();
      const loginId = `${userId}_${Date.now()}`;

      const loginRecord = {
        id: loginId,
        userId,
        email,
        ipAddress,
        deviceName,
        loginTime: new Date(),
        timestamp: Date.now()
      };

      await setDoc(doc(db, 'loginRecords', loginId), loginRecord);

      await setDoc(doc(db, 'staffNotifications', `login_${loginId}`), {
        type: 'student_login',
        userId,
        email,
        ipAddress,
        deviceName,
        loginTime: new Date(),
        timestamp: Date.now(),
        read: false
      });
    } catch (error) {
      console.error('Error logging login record:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (!userDoc.exists()) {
        setError('User data not found. Please contact support.');
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      if (userData.role !== 'student') {
        setError('This is a student login. Please use the appropriate portal.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      await logLoginRecord(formData.email, userCredential.user.uid);

      navigate('/registration');
    } catch (err: unknown) {
      const errorObj = err as { code?: string };
      if (errorObj.code === 'auth/invalid-credential' || errorObj.code === 'auth/user-not-found' || errorObj.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (errorObj.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <button
          onClick={() => navigate('/student-dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Login</h1>
          <p className="text-gray-600">Access your student dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </>
            )}
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/student-signup')}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Sign up here
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default StudentLogin;
