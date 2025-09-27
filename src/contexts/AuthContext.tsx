import React, { createContext, useContext, useState, ReactNode } from 'react';
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

  const login = async (email: string, role: 'student' | 'teacher'): Promise<boolean> => {
    // Mock email validation
    if (!email.endsWith('@gmail.com') && !email.endsWith('@rajhansschool.edu.in')) {
      return false;
    }

    // Simulate sending OTP
    setPendingAuth({ email, role });
    setOtpSent(true);
    
    // Mock OTP: 123456
    console.log('Mock OTP sent: 123456');
    
    return true;
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    if (otp === '123456' && pendingAuth) {
      const mockUser: User = {
        id: '1',
        name: pendingAuth.role === 'student' ? 'Student User' : 'Teacher User',
        email: pendingAuth.email,
        role: pendingAuth.role,
        ...(pendingAuth.role === 'student' && {
          admissionNumber: 'RPS2025001',
          class: '12',
          section: 'A'
        })
      };
      
      setUser(mockUser);
      setPendingAuth(null);
      setOtpSent(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setOtpSent(false);
    setPendingAuth(null);
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