import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Complaint } from '../types';

interface ComplaintContextType {
  complaints: Complaint[];
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'submittedAt' | 'status'>) => Promise<boolean>;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const submitComplaint = async (complaintData: Omit<Complaint, 'id' | 'submittedAt' | 'status'>): Promise<boolean> => {
    try {
      const newComplaint: Complaint = {
        ...complaintData,
        id: Date.now().toString(),
        submittedAt: new Date(),
        status: 'pending'
      };

      setComplaints(prev => [...prev, newComplaint]);
      
      // Mock email sending
      console.log('Complaint submitted and email sent to school administration:', newComplaint);
      
      return true;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      return false;
    }
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev =>
      prev.map(complaint =>
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      submitComplaint,
      updateComplaintStatus
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};