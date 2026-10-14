import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, LogOut } from 'lucide-react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import StaffPortalDashboard from './components/StaffPortalDashboard';
import AttendanceNotifications from './components/AttendanceNotifications';
import { auth, db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const StaffApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

      try {
        const profile = await getDoc(doc(db, 'users', user.uid));
        const role = profile.exists() ? profile.data().role : null;
        setIsAuthenticated(['teacher', 'staff', 'admin'].includes(role));
      } catch {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const credential = await signInWithEmailAndPassword(auth, username.trim(), password);
      const profile = await getDoc(doc(db, 'users', credential.user.uid));
      const role = profile.exists() ? profile.data().role : null;

      if (!['teacher', 'staff', 'admin'].includes(role)) {
        await signOut(auth);
        setError('This account is not authorized for the staff portal.');
        return;
      }

      setIsAuthenticated(true);
      setPassword('');
    } catch {
      setError('Invalid credentials or unavailable authentication service.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Checking authentication…</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Staff Portal Access</h1>
            <p className="text-gray-600 mt-2">Sign in with your authorized staff account</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Eye className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" required autoComplete="username" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" required autoComplete="current-password" />
              </div>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium">Sign in</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center"><Shield className="h-8 w-8 text-blue-600" /><h1 className="ml-2 text-xl font-bold text-gray-900">RHPS Staff Portal</h1></div>
            <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg"><LogOut className="h-4 w-4" /><span>Logout</span></button>
          </div>
        </div>
      </div>
      <StaffPortalDashboard />
      <AttendanceNotifications />
    </div>
  );
};

export default StaffApp;