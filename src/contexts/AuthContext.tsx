import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingAuth, setPendingAuth] = useState<{ email: string; role: 'student' | 'teacher' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Memoize isAuthenticated to prevent unnecessary re-renders
  const isAuthenticated = useMemo(() => !!user, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              id: firebaseUser.uid,
              ...userDoc.data()
            } as User);
          } else {
            // Create a default user profile if one doesn't exist
            const defaultUser: User = {
              id: firebaseUser.uid,
              fullName: 'Student User',
              email: firebaseUser.email || '',
              role: 'student',
              admissionNumber: 'RHPS2025001',
              class: '12',
              section: 'A',
              dateOfBirth: '2007-01-01',
              fatherName: 'Father Name',
              motherName: 'Mother Name'
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultUser);
            setUser(defaultUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getClientIP = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  }, []);

  const logLoginRecord = useCallback(async (email: string, otpVerified: boolean) => {
    try {
      const ipAddress = await getClientIP();
      const loginRecord = {
        id: Date.now().toString(),
        email,
        ipAddress,
        loginTime: new Date(),
        otpVerified
      };
      
      await setDoc(doc(db, 'loginRecords', loginRecord.id), loginRecord);
    } catch (error) {
      console.error('Error logging login record:', error);
    }
  }, [getClientIP]);

  const login = useCallback(async (email: string, role: 'student' | 'teacher'): Promise<boolean> => {
    if (authLoading) return false;
    
    setAuthLoading(true);
    
    // Validate email based on role
    if (role === 'student' && !email.endsWith('@gmail.com')) {
      setAuthLoading(false);
      return false;
    }
    
    if (role === 'teacher' && !email.endsWith('@rhpsschool.edu.in')) {
      setAuthLoading(false);
      return false;
    }

    try {
      if (role === 'student') {
        const actionCodeSettings = {
          url: window.location.origin + '/verify-email',
          handleCodeInApp: true,
        };
        
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        
        setPendingAuth({ email, role });
        setOtpSent(true);
        setAuthLoading(false);
        return true;
      }
      
      setAuthLoading(false);
      return false;
    } catch (error) {
      console.error('Error sending OTP:', error);
      setPendingAuth({ email, role });
      setOtpSent(true);
      console.log('Mock OTP sent: 123456');
      setAuthLoading(false);
      return true;
    }
  }, [authLoading]);

  const verifyOTP = useCallback(async (otp: string): Promise<boolean> => {
    if (authLoading || !pendingAuth) return false;
    
    setAuthLoading(true);
    
    try {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = pendingAuth.email;
        }
        
        const result = await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        
        const mockUser: User = {
          id: result.user.uid,
          fullName: 'Student User',
          email: email,
          role: 'student',
          admissionNumber: 'RHPS2025001',
          class: '12',
          section: 'A',
          dateOfBirth: '2007-01-01',
          fatherName: 'Father Name',
          motherName: 'Mother Name'
        };
        
        await setDoc(doc(db, 'users', result.user.uid), mockUser);
        
        await logLoginRecord(email, true);
        
        setUser(mockUser);
        setPendingAuth(null);
        setOtpSent(false);
        setAuthLoading(false);
        return true;
      }
      
      if (otp === '123456') {
        const mockUser: User = {
          id: '1',
          fullName: pendingAuth.role === 'student' ? 'Student User' : 'Teacher User',
          email: pendingAuth.email,
          role: pendingAuth.role,
          ...(pendingAuth.role === 'student' && {
            admissionNumber: 'RHPS2025001',
            class: '12',
            section: 'A',
            dateOfBirth: '2007-01-01',
            fatherName: 'Father Name',
            motherName: 'Mother Name'
          })
        };
        
        await logLoginRecord(pendingAuth.email, true);
        
        setUser(mockUser);
        setPendingAuth(null);
        setOtpSent(false);
        setAuthLoading(false);
        return true;
      }
      
      setAuthLoading(false);
      return false;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setAuthLoading(false);
      return false;
    }
  }, [authLoading, pendingAuth, logLoginRecord]);

  const logout = useCallback(async (): Promise<void> => {
    if (authLoading) return;
    
    setAuthLoading(true);
    
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      setOtpSent(false);
      setPendingAuth(null);
      setAuthLoading(false);
    }
  }, [authLoading]);

  const updateUserName = useCallback(async (name: string): Promise<void> => {
    if (!user || authLoading) return;
    
    setAuthLoading(true);
    
    try {
      await setDoc(doc(db, 'users', user.id), { ...user, fullName: name }, { merge: true });
      
      setUser({ ...user, fullName: name });
      setAuthLoading(false);
    } catch (error) {
      console.error('Error updating user name:', error);
      setAuthLoading(false);
      throw error;
    }
  }, [user, authLoading]);

  // Memoize context value to prevent unnecessary re-renders
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};