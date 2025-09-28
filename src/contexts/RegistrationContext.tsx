import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Registration } from '../types';

interface RegistrationContextType {
  registrations: Registration[];
  submitRegistration: (registration: Omit<Registration, 'id' | 'registeredAt' | 'eligibilityCategory'>) => Promise<boolean>;
  getRegistrationsByActivity: (activityType: string) => Registration[];
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const useRegistrations = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistrations must be used within a RegistrationProvider');
  }
  return context;
};

const calculateEligibilityCategory = (dateOfBirth: Date): 'Under 14' | 'Under 16' | 'Under 18' => {
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate()) 
    ? age - 1 
    : age;

  if (actualAge < 14) return 'Under 14';
  if (actualAge < 16) return 'Under 16';
  return 'Under 18';
};

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const submitRegistration = async (registrationData: Omit<Registration, 'id' | 'registeredAt' | 'eligibilityCategory'>): Promise<boolean> => {
    try {
      const newRegistration: Registration = {
        ...registrationData,
        id: Date.now().toString(),
        registeredAt: new Date(),
        eligibilityCategory: calculateEligibilityCategory(registrationData.dateOfBirth)
      };

      setRegistrations(prev => [...prev, newRegistration]);
      return true;
    } catch (error) {
      console.error('Error submitting registration:', error);
      return false;
    }
  };

  const getRegistrationsByActivity = (activityType: string) => {
    return registrations.filter(reg => reg.activityType === activityType);
  };

  return (
    <RegistrationContext.Provider value={{
      registrations,
      submitRegistration,
      getRegistrationsByActivity
    }}>
      {children}
    </RegistrationContext.Provider>
  );
};