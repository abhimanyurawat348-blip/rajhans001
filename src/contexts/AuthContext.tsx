import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink,
  signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'student' | 'teacher') => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  otpSent: boolean;
  pendingAuth: { email: string; role: 'student' | 'teacher' } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingAuth, setPendingAuth] = useState<{ email: string; role: 'student' | 'teacher' } | null>(null);

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  };

  const logLoginRecord = async (email: string, otpVerified: boolean) => {
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
  };

  const login = async (email: string, role: 'student' | 'teacher'): Promise<boolean> => {
    // Validate email format
    if (role === 'student' && !email.endsWith('@gmail.com')) {
      return false;
    }
    
    if (role === 'teacher' && !email.endsWith('@rhpsschool.edu.in')) {
      return false;
    }

    try {
      // For students, send OTP via email link
      if (role === 'student') {
        const actionCodeSettings = {
          url: window.location.origin + '/verify-email',
          handleCodeInApp: true,
        };
        
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        
        setPendingAuth({ email, role });
        setOtpSent(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Fallback to mock OTP for demo
      setPendingAuth({ email, role });
      setOtpSent(true);
      console.log('Mock OTP sent: 123456');
      return true;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      if (pendingAuth) {
        // Check if it's an email link sign-in
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            email = pendingAuth.email;
          }
          
          const result = await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          
          const mockUser: User = {
            id: result.user.uid,
            name: 'Student User',
            email: email,
            role: 'student'
          };
          
          // Store user in Firestore
          await setDoc(doc(db, 'users', result.user.uid), mockUser);
          
          // Log login record
          await logLoginRecord(email, true);
          
          setUser(mockUser);
          setPendingAuth(null);
          setOtpSent(false);
          return true;
        }
        
        // Fallback to mock OTP verification
        if (otp === '123456') {
          const mockUser: User = {
            id: '1',
            name: pendingAuth.role === 'student' ? 'Student User' : 'Teacher User',
            email: pendingAuth.email,
            role: pendingAuth.role,
            ...(pendingAuth.role === 'student' && {
              admissionNumber: 'RHPS2025001',
              class: '12',
              section: 'A'
            })
          };
          
          // Log login record
          await logLoginRecord(pendingAuth.email, true);
          
          setUser(mockUser);
          setPendingAuth(null);
          setOtpSent(false);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      setOtpSent(false);
      setPendingAuth(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      verifyOTP,
      logout,
      isAuthenticated: !!user,
      otpSent,
      pendingAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};