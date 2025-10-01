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

const sampleResources: StudyResource[] = [
  {
    id: '1',
    title: 'Class 10 Science Question Paper 2024',
    subject: 'Science',
    class: '10',
    type: 'previous-year',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2023_24/Science_SQP.pdf',
    year: '2024'
  },
  {
    id: '2',
    title: 'Class 10 Science Question Paper 2023',
    subject: 'Science',
    class: '10',
    type: 'previous-year',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2022_23/Science_SQP.pdf',
    year: '2023'
  },
  {
    id: '3',
    title: 'Class 10 Science Sample Paper 2025',
    subject: 'Science',
    class: '10',
    type: 'sample-paper',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2023_24/Science_SQP.pdf',
    year: '2025'
  },
  {
    id: '4',
    title: 'Class 10 Mathematics Previous Year Paper 2024',
    subject: 'Mathematics',
    class: '10',
    type: 'previous-year',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2023_24/Mathematics_Standard_SQP.pdf',
    year: '2024'
  },
  {
    id: '5',
    title: 'Class 12 Physics Problem Solving & HOTS',
    subject: 'Physics',
    class: '12',
    type: 'sample-paper',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2023_24/Physics_SQP.pdf',
    year: '2025'
  },
  {
    id: '6',
    title: 'Class 12 Physics Question Paper 2024',
    subject: 'Physics',
    class: '12',
    type: 'previous-year',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2023_24/Physics_SQP.pdf',
    year: '2024'
  },
  {
    id: '7',
    title: 'Class 12 Physics Question Paper 2023',
    subject: 'Physics',
    class: '12',
    type: 'previous-year',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2022_23/Physics_SQP.pdf',
    year: '2023'
  },
  {
    id: '8',
    title: 'Class 12 Mathematics HOTS & Problem Solving',
    subject: 'Mathematics',
    class: '12',
    type: 'sample-paper',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2023_24/Mathematics_SQP.pdf',
    year: '2025'
  },
  {
    id: '9',
    title: 'Class 12 Mathematics Question Paper 2024',
    subject: 'Mathematics',
    class: '12',
    type: 'previous-year',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2023_24/Mathematics_SQP.pdf',
    year: '2024'
  },
  {
    id: '10',
    title: 'Class 12 Mathematics Question Paper 2023',
    subject: 'Mathematics',
    class: '12',
    type: 'previous-year',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2022_23/Mathematics_SQP.pdf',
    year: '2023'
  },
  {
    id: '11',
    title: 'Class 12 Chemistry Question Paper 2024',
    subject: 'Chemistry',
    class: '12',
    type: 'previous-year',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2023_24/Chemistry_SQP.pdf',
    year: '2024'
  },
  {
    id: '12',
    title: 'Class 12 Biology Question Paper 2024',
    subject: 'Biology',
    class: '12',
    type: 'previous-year',
    downloadUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2023_24/Biology_SQP.pdf',
    year: '2024'
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