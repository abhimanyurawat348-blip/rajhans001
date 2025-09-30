import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StudyResource } from '../types';

interface StudyResourcesContextType {
  resources: StudyResource[];
  getResourcesByClass: (className: string) => StudyResource[];
  getResourcesBySubject: (subject: string) => StudyResource[];
  downloadResource: (resource: StudyResource) => void;
}

const StudyResourcesContext = createContext<StudyResourcesContextType | undefined>(undefined);

export const useStudyResources = () => {
  const context = useContext(StudyResourcesContext);
  if (context === undefined) {
    throw new Error('useStudyResources must be used within a StudyResourcesProvider');
  }
  return context;
};

// Sample study resources data
const sampleResources: StudyResource[] = [
  // Class 10 Resources
  {
    id: '1',
    title: 'Mathematics Previous Year Paper 2024',
    subject: 'Mathematics',
    class: '10',
    type: 'previous-year',
    downloadUrl: '/resources/class10/math_2024.pdf',
    year: '2024'
  },
  {
    id: '2',
    title: 'Science Previous Year Paper 2024',
    subject: 'Science',
    class: '10',
    type: 'previous-year',
    downloadUrl: '/resources/class10/science_2024.pdf',
    year: '2024'
  },
  {
    id: '3',
    title: 'English Sample Paper 2025',
    subject: 'English',
    class: '10',
    type: 'sample-paper',
    downloadUrl: '/resources/class10/english_sample_2025.pdf',
    year: '2025'
  },
  {
    id: '4',
    title: 'Social Science Sample Paper 2025',
    subject: 'Social Science',
    class: '10',
    type: 'sample-paper',
    downloadUrl: '/resources/class10/social_sample_2025.pdf',
    year: '2025'
  },
  // Class 12 Resources
  {
    id: '5',
    title: 'Physics Previous Year Paper 2024',
    subject: 'Physics',
    class: '12',
    type: 'previous-year',
    downloadUrl: '/resources/class12/physics_2024.pdf',
    year: '2024'
  },
  {
    id: '6',
    title: 'Chemistry Previous Year Paper 2024',
    subject: 'Chemistry',
    class: '12',
    type: 'previous-year',
    downloadUrl: '/resources/class12/chemistry_2024.pdf',
    year: '2024'
  },
  {
    id: '7',
    title: 'Mathematics Sample Paper 2025',
    subject: 'Mathematics',
    class: '12',
    type: 'sample-paper',
    downloadUrl: '/resources/class12/math_sample_2025.pdf',
    year: '2025'
  },
  {
    id: '8',
    title: 'Biology Sample Paper 2025',
    subject: 'Biology',
    class: '12',
    type: 'sample-paper',
    downloadUrl: '/resources/class12/biology_sample_2025.pdf',
    year: '2025'
  }
];

export const StudyResourcesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resources] = useState<StudyResource[]>(sampleResources);

  const getResourcesByClass = (className: string) => {
    return resources.filter(resource => resource.class === className);
  };

  const getResourcesBySubject = (subject: string) => {
    return resources.filter(resource => resource.subject === subject);
  };

  const downloadResource = (resource: StudyResource) => {
    // Create a mock PDF download
    const link = document.createElement('a');
    link.href = resource.downloadUrl;
    link.download = `${resource.title}.pdf`;
    link.click();
  };

  return (
    <StudyResourcesContext.Provider value={{
      resources,
      getResourcesByClass,
      getResourcesBySubject,
      downloadResource
    }}>
      {children}
    </StudyResourcesContext.Provider>
  );
};