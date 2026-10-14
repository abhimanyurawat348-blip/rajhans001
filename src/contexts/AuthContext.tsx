import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'student' | 'teacher') => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  otpSent: boolean;
  pendingAuth: { email: string; role: 'student' | 'teacher' } | null;
  updateUserName: (name: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingAuth, setPendingAuth] = useState<{ email: string; role: 'student' | 'teacher' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const isAuthenticated = useMemo(() => !!user, [user]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (!snapshot.exists()) {
          await signOut(auth);
          setUser(null);
        } else {
          setUser({ id: firebaseUser.uid, ...snapshot.data() } as User);
        }
      } catch (error) {
        console.error('Error loading authenticated user:', error);
        await signOut(auth);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const login = useCallback(async (email: string, role: 'student' | 'teacher'): Promise<boolean> => {
    if (authLoading || role !== 'student') return false;
    setAuthLoading(true);

    if (!email.trim().endsWith('@gmail.com')) {
      setAuthLoading(false);
      return false;
    }

    try {
      await sendSignInLinkToEmail(auth, email.trim(), {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true
      });
      window.localStorage.setItem('emailForSignIn', email.trim());
      setPendingAuth({ email: email.trim(), role });
      setOtpSent(true);
      return true;
    } catch (error) {
      console.error('Error sending sign-in link:', error);
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [authLoading]);

  const verifyOTP = useCallback(async (_otp: string): Promise<boolean> => {
    if (authLoading || !pendingAuth) return false;
    setAuthLoading(true);

    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) return false;

      const email = window.localStorage.getItem('emailForSignIn') || pendingAuth.email;
      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');

      const existing = await getDoc(doc(db, 'users', result.user.uid));
      if (!existing.exists()) {
        const profile: User = {
          id: result.user.uid,
          fullName: result.user.displayName || 'Student User',
          email,
          role: 'student'
        };
        await setDoc(doc(db, 'users', result.user.uid), profile);
        setUser(profile);
      } else {
        setUser({ id: result.user.uid, ...existing.data() } as User);
      }

      setPendingAuth(null);
      setOtpSent(false);
      return true;
    } catch (error) {
      console.error('Error verifying email sign-in:', error);
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [authLoading, pendingAuth]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setOtpSent(false);
    setPendingAuth(null);
  }, []);

  const updateUserName = useCallback(async (name: string) => {
    if (!user || authLoading) return;
    setAuthLoading(true);
    try {
      await setDoc(doc(db, 'users', user.id), { fullName: name }, { merge: true });
      setUser({ ...user, fullName: name });
    } finally {
      setAuthLoading(false);
    }
  }, [user, authLoading]);

  const value = useMemo(() => ({
    user,
    login,
    verifyOTP,
    logout,
    isAuthenticated,
    otpSent,
    pendingAuth,
    updateUserName,
    loading
  }), [user, login, verifyOTP, logout, isAuthenticated, otpSent, pendingAuth, updateUserName, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};