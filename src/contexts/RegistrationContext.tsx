import React, { createContext, useContext, useState, ReactNode } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { generateMotivationalMessage } from '../config/gemini';
import { Registration } from '../types';

interface RegistrationContextType {
  registrations: Registration[];
  submitRegistration: (registration: Omit<Registration, 'id' | 'registeredAt' | 'eligibilityCategory' | 'status'>) => Promise<{ success: boolean; message?: string }>;
  getRegistrationsByActivity: (activityType: string) => Registration[];
  updateRegistrationStatus: (id: string, status: Registration['status']) => Promise<void>;
  deleteRegistration: (id: string) => Promise<boolean>;
  loadRegistrations: () => Promise<void>;
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

  const loadRegistrations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'registrations'));
      const loadedRegistrations: Registration[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedRegistrations.push({
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth.toDate(),
          registeredAt: data.registeredAt.toDate()
        } as Registration);
      });
      
      setRegistrations(loadedRegistrations);
    } catch (error) {
      console.error('Error loading registrations:', error);
    }
  };

  const submitRegistration = async (registrationData: Omit<Registration, 'id' | 'registeredAt' | 'eligibilityCategory' | 'status'>): Promise<{ success: boolean; message?: string }> => {
    try {
      const newRegistration: Registration = {
        ...registrationData,
        id: '', // Firestore will generate this
        registeredAt: new Date(),
        eligibilityCategory: calculateEligibilityCategory(registrationData.dateOfBirth),
        status: 'pending'
      };

      const docRef = await addDoc(collection(db, 'registrations'), newRegistration);
      newRegistration.id = docRef.id;

      setRegistrations(prev => [...prev, newRegistration]);

      await addDoc(collection(db, 'staffNotifications'), {
        type: 'new_registration',
        registrationId: docRef.id,
        studentName: registrationData.studentName,
        activityType: registrationData.activityType,
        category: registrationData.category,
        class: registrationData.class,
        section: registrationData.section,
        timestamp: Date.now(),
        createdAt: new Date(),
        read: false
      });

      const motivationalMessage = await generateMotivationalMessage(
        registrationData.studentName,
        registrationData.activityType,
        newRegistration.eligibilityCategory
      );

      return { success: true, message: motivationalMessage };
    } catch (error) {
      console.error('Error submitting registration:', error);
      return { success: false };
    }
  };

  const getRegistrationsByActivity = (activityType: string) => {
    return registrations.filter(reg => reg.activityType === activityType);
  };

  const updateRegistrationStatus = async (id: string, status: Registration['status']) => {
    try {
      // Validate that the document exists before updating
      const registrationRef = doc(db, 'registrations', id);
      const registrationSnap = await getDoc(registrationRef);
      
      if (!registrationSnap.exists()) {
        console.error('Registration document not found');
        return;
      }
      
      await updateDoc(registrationRef, { status });
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === id ? { ...reg, status } : reg
        )
      );
    } catch (error) {
      console.error('Error updating registration status:', error);
    }
  };

  const deleteRegistration = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'registrations', id));
      setRegistrations(prev => prev.filter(reg => reg.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting registration:', error);
      return false;
    }
  };

  return (
    <RegistrationContext.Provider value={{
      registrations,
      submitRegistration,
      getRegistrationsByActivity,
      updateRegistrationStatus,
      deleteRegistration,
      loadRegistrations
    }}>
      {children}
    </RegistrationContext.Provider>
  );
};