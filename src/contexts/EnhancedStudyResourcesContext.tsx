import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyResource, BrokenLinkReport, ResourceVerificationLog, PlagiarismCheckResult } from '../types';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { jsPDF } from 'jspdf';

interface EnhancedStudyResourcesContextType {
  resources: StudyResource[];
  filteredResources: StudyResource[];
  loading: boolean;
  error: string | null;
  filters: {
    selectedClass: string;
    selectedSubject: string;
    selectedType: string;
    selectedLanguage: string;
    verifiedOnly: boolean;
    searchTerm: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    selectedClass: string;
    selectedSubject: string;
    selectedType: string;
    selectedLanguage: string;
    verifiedOnly: boolean;
    searchTerm: string;
  }>>;
  getResourcesByClass: (className: string) => StudyResource[];
  getResourcesBySubject: (subject: string) => StudyResource[];
  downloadResource: (resource: StudyResource, withSolutions?: boolean) => void;
  reportBrokenLink: (resourceId: string, userId: string) => Promise<void>;
  verifyResource: (resourceId: string) => Promise<void>;
  getResourceVerificationLogs: (resourceId: string) => Promise<ResourceVerificationLog[]>;
  getResourcePlagiarismCheck: (resourceId: string) => Promise<PlagiarismCheckResult | null>;
  getResourceBrokenReports: (resourceId: string) => Promise<BrokenLinkReport[]>;
  refreshResources: () => Promise<void>;
  // Add new function to open paper in browser
  openPaperInBrowser: (resource: StudyResource) => void;
  // Add function to get paper data for display
  getPaperData: (resourceId: string) => any;
}

const EnhancedStudyResourcesContext = createContext<EnhancedStudyResourcesContextType | undefined>(undefined);

export const useEnhancedStudyResources = () => {
  const context = useContext(EnhancedStudyResourcesContext);
  if (context === undefined) {
    throw new Error('useEnhancedStudyResources must be used within an EnhancedStudyResourcesProvider');
  }
  return context;
};

// Enhanced sample resources with only the two sample papers
const enhancedSampleResources: StudyResource[] = [
  {
    id: 'sample-9-science',
    title: 'Class 9 Science Sample Paper - Maximum Marks 80',
    subject: 'Science',
    class: '9',
    type: 'sample-paper',
    downloadUrl: '/sample-papers/class9-science.pdf',
    year: '2024',
    topic_tags: ['Matter', 'Motion', 'Force', 'Work', 'Living Organisms', 'Environment'],
    language: 'English',
    uploaded_by: 'Admin',
    source_url: '/sample-papers/class9-science.pdf',
    last_verified: new Date('2024-01-22'),
    ncert_chapters: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6', 'Chapter 7', 'Chapter 8', 'Chapter 9', 'Chapter 10', 'Chapter 11', 'Chapter 12', 'Chapter 13'],
    cbse_syllabus_entries: ['Matter - Its Nature and Behaviour', 'Organisation in the Living World', 'Motion, Force and Work', 'Our Environment'],
    version: 1,
    is_verified: true,
    created_at: new Date('2024-01-22'),
    updated_at: new Date('2024-01-22'),
    broken_report_count: 0,
    has_solutions: true
  },
  {
    id: 'sample-10-science',
    title: 'Class 10 Science Sample Paper - Maximum Marks 80',
    subject: 'Science',
    class: '10',
    type: 'sample-paper',
    downloadUrl: '/sample-papers/class10-science.pdf',
    year: '2024',
    topic_tags: ['Chemical Substances', 'Acids Bases Salts', 'Metals Non-metals', 'Carbon Compounds', 'Life Processes', 'Control Coordination', 'Electricity', 'Magnetic Effects of Electric Current', 'Light Reflection Refraction'],
    language: 'English',
    uploaded_by: 'Admin',
    source_url: '/sample-papers/class10-science.pdf',
    last_verified: new Date('2024-01-22'),
    ncert_chapters: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 6', 'Chapter 7', 'Chapter 8', 'Chapter 9', 'Chapter 10', 'Chapter 11', 'Chapter 12', 'Chapter 13', 'Chapter 14'],
    cbse_syllabus_entries: ['Chemical Substances', 'Acids Bases Salts', 'Metals Non-metals', 'Carbon Compounds', 'Life Processes', 'Control Coordination', 'Electricity', 'Magnetic Effects of Electric Current', 'Light Reflection Refraction'],
    version: 1,
    is_verified: true,
    created_at: new Date('2024-01-22'),
    updated_at: new Date('2024-01-22'),
    broken_report_count: 0
  }
];

export const EnhancedStudyResourcesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<StudyResource[]>(enhancedSampleResources);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    selectedClass: 'all',
    selectedSubject: 'all',
    selectedType: 'all',
    selectedLanguage: 'all',
    verifiedOnly: false,
    searchTerm: ''
  });

  // Filter resources based on current filters
  const filteredResources = resources
    .filter(resource => filters.selectedClass === 'all' || resource.class === filters.selectedClass)
    .filter(resource => filters.selectedSubject === 'all' || resource.subject === filters.selectedSubject)
    .filter(resource => filters.selectedType === 'all' || resource.type === filters.selectedType)
    .filter(resource => filters.selectedLanguage === 'all' || resource.language === filters.selectedLanguage)
    .filter(resource => !filters.verifiedOnly || resource.is_verified)
    .filter(resource => 
      resource.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (resource.topic_tags && resource.topic_tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase())))
    );

  const getResourcesByClass = (className: string) => {
    return resources.filter(resource => resource.class === className);
  };

  const getResourcesBySubject = (subject: string) => {
    return resources.filter(resource => resource.subject === subject);
  };

  const downloadResource = (resource: StudyResource, withSolutions = false) => {
    // Generate PDF content based on resource ID
    if (resource.id === 'sample-9-science') {
      generateClass9SciencePaper(withSolutions);
    } else if (resource.id === 'sample-10-science') {
      generateClass10SciencePaper();
    } else {
      // Fallback for other resources
      const link = document.createElement('a');
      link.href = resource.downloadUrl;
      link.download = `${resource.title}.pdf`;
      link.target = '_blank';
      link.click();
    }
  };

  // New function to open paper in browser
  const openPaperInBrowser = (resource: StudyResource) => {
    // This will be handled by the UI component that uses this context
    // We just need to expose this function in the context
  };

  const generateClass9SciencePaper = (withAnswers = false) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('CBSE Sample Papers for Class 9 Science – Set 1', 105, 20, { align: 'center' });
    
    // Add general instructions
    doc.setFontSize(12);
    doc.text('General Instructions', 20, 35);
    doc.setFontSize(10);
    doc.text('This question paper consists of 39 questions divided into three sections:', 25, 42);
    doc.text('Section A – Biology, Section B – Chemistry, and Section C – Physics.', 25, 48);
    doc.text('All questions are compulsory. However, internal choices are provided.', 25, 54);
    doc.text('Students are expected to attempt only one of the alternatives in such cases.', 25, 60);
    
    // Add time and marks
    doc.setFontSize(12);
    doc.text('Time: 3 Hours', 150, 35);
    doc.text('Max. Marks: 80', 150, 42);
    
    // Section A - Biology
    doc.setFontSize(14);
    doc.text('Section – A (Biology)', 20, 80);
    
    doc.setFontSize(10);
    doc.text('Question 1.', 20, 90);
    doc.text('Which of the following structures helps in gaseous exchange in plants? [1]', 25, 97);
    doc.text('(a) Cuticle', 30, 104);
    doc.text('(b) Stomata', 30, 111);
    doc.text('(c) Lenticels', 30, 118);
    doc.text('(d) Both (b) and (c)', 30, 125);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (d) Both (b) and (c)', 30, 132);
      doc.setFont('helvetica', 'normal');
      doc.text('Explanation:', 30, 139);
      doc.text('Stomata are small pores on leaves, and lenticels are openings on woody stems that help in exchange of gases.', 35, 146);
    }
    
    doc.text('Question 2.', 20, 160);
    doc.text('Xylem and phloem together form which type of tissue? [1]', 25, 167);
    doc.text('(a) Permanent tissue', 30, 174);
    doc.text('(b) Simple tissue', 30, 181);
    doc.text('(c) Complex tissue', 30, 188);
    doc.text('(d) Meristematic tissue', 30, 195);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c) Complex tissue', 30, 202);
      doc.setFont('helvetica', 'normal');
      doc.text('Explanation:', 30, 209);
      doc.text('Xylem and phloem consist of more than one type of cell performing a common function — hence called complex tissues.', 35, 216);
    }
    
    doc.text('Question 3.', 20, 230);
    doc.text('Which of the following is a plant hormone that promotes cell division? [1]', 25, 237);
    doc.text('(a) Auxin', 30, 244);
    doc.text('(b) Gibberellin', 30, 251);
    doc.text('(c) Cytokinin', 30, 258);
    doc.text('(d) Abscisic acid', 30, 265);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c) Cytokinin', 30, 272);
      doc.setFont('helvetica', 'normal');
      doc.text('Explanation:', 30, 279);
      doc.text('Cytokinins promote cell division in plant tissues, especially in roots and shoots.', 35, 286);
    }
    
    doc.text('Question 4.', 20, 300);
    doc.text('Which organelle is responsible for detoxifying harmful substances in liver cells? [1]', 25, 307);
    doc.text('(a) Ribosome', 30, 314);
    doc.text('(b) Lysosome', 30, 321);
    doc.text('(c) Smooth Endoplasmic Reticulum', 30, 328);
    doc.text('(d) Mitochondria', 30, 335);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c) Smooth Endoplasmic Reticulum', 30, 342);
    }
    
    doc.text('Question 5.', 20, 355);
    doc.text('Identify the correctly matched pair. [1]', 25, 362);
    doc.text('(a) Guard cells – Transpiration', 30, 369);
    doc.text('(b) Root hair – Photosynthesis', 30, 376);
    doc.text('(c) Stomata – Water absorption', 30, 383);
    doc.text('(d) Xylem – Transport of food', 30, 390);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (a) Guard cells – Transpiration', 30, 397);
    }
    
    doc.text('Question 6.', 20, 410);
    doc.text('Which among the following is a rabi crop? [1]', 25, 417);
    doc.text('(a) Paddy', 30, 424);
    doc.text('(b) Maize', 30, 431);
    doc.text('(c) Mustard', 30, 438);
    doc.text('(d) Groundnut', 30, 445);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c) Mustard', 30, 452);
    }
    
    doc.text('Question 7.', 20, 465);
    doc.text('Rearing of fish for commercial purposes is called: [1]', 25, 472);
    doc.text('(a) Apiculture', 30, 479);
    doc.text('(b) Sericulture', 30, 486);
    doc.text('(c) Pisciculture', 30, 493);
    doc.text('(d) Floriculture', 30, 500);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c) Pisciculture', 30, 507);
    }
    
    doc.text('Question 8.', 20, 520);
    doc.text('Assertion (A): Phloem transports food from leaves to other parts of the plant.', 25, 527);
    doc.text('Reason (R): Phloem conducts only water and minerals. [1]', 25, 534);
    doc.text('(a) Both A and R are true and R is the correct explanation of A.', 30, 541);
    doc.text('(b) Both A and R are true but R is not the correct explanation of A.', 30, 548);
    doc.text('(c) A is true but R is false.', 30, 555);
    doc.text('(d) A is false but R is true.', 30, 562);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c) A is true but R is false.', 30, 569);
    }
    
    doc.text('Question 9.', 20, 582);
    doc.text('Assertion (A): Root hair increases the surface area for water absorption.', 25, 589);
    doc.text('Reason (R): Root hair transports food materials to different plant organs. [1]', 25, 596);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c) A is true but R is false.', 30, 603);
    }
    
    doc.addPage();
    
    doc.text('Question 10.', 20, 20);
    doc.text('Why are mitochondria called the “powerhouse of the cell”? [2]', 25, 27);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 34);
      doc.setFont('helvetica', 'normal');
      doc.text('Mitochondria produce energy in the form of ATP during cellular respiration. This ATP acts as the main energy currency for all cellular activities.', 30, 41);
    }
    
    doc.text('Question 11.', 20, 58);
    doc.text('Attempt either A or B. [2]', 25, 65);
    doc.text('A. Write any two advantages of using biofertilisers in crop production.', 30, 72);
    doc.text('Answer:', 30, 79);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('1. They increase soil fertility naturally without harming soil microorganisms.', 35, 86);
      doc.text('2. They are eco-friendly and cost-effective compared to chemical fertilisers.', 35, 93);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Or', 30, 100);
    doc.text('B. Explain the importance of crop rotation.', 30, 107);
    doc.text('Answer:', 30, 114);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('1. Crop rotation prevents depletion of specific nutrients from the soil.', 35, 121);
      doc.text('2. It reduces pest attacks and helps in maintaining soil fertility.', 35, 128);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 12.', 20, 142);
    doc.text('Differentiate between smooth and striated muscles. [2]', 25, 149);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 156);
      doc.setFont('helvetica', 'normal');
      doc.text('Feature          Smooth Muscle     Striated Muscle', 30, 163);
      doc.text('Structure        Non-striated,     Striated,', 30, 170);
      doc.text('                 spindle-shaped    cylindrical', 45, 177);
      doc.text('Control          Involuntary       Voluntary', 30, 184);
      doc.text('Location         Internal organs   Skeletal muscles', 30, 191);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 13.', 20, 205);
    doc.text('Draw a neat diagram of a neuron and label any three parts. [3]', 25, 212);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 219);
      doc.setFont('helvetica', 'normal');
      doc.text('Students should draw a neuron showing dendrite, axon, and nucleus.', 30, 226);
      doc.text('Explanation: Neurons transmit electrical impulses from one part of the body to another.', 30, 233);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 14.', 20, 247);
    doc.text('What will happen if we place a plant cell in: [3]', 25, 254);
    doc.text('(a) Distilled water', 30, 261);
    doc.text('(b) Concentrated salt solution', 30, 268);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 275);
      doc.setFont('helvetica', 'normal');
      doc.text('(a) The cell will swell up (endosmosis).', 30, 282);
      doc.text('(b) The cell will shrink (exosmosis).', 30, 289);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 15.', 20, 303);
    doc.text('Attempt either A or B [4]', 25, 310);
    doc.text('A. Why are guard cells kidney-shaped?', 30, 317);
    doc.text('Answer:', 30, 324);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('Guard cells are kidney-shaped to control the opening and closing of stomatal pores for gas exchange.', 35, 331);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Or', 30, 338);
    doc.text('B. Why are white blood cells called the soldiers of the body?', 30, 345);
    doc.text('Answer:', 30, 352);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('Because they defend the body from infections and destroy disease-causing microbes.', 35, 359);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 16.', 20, 373);
    doc.text('Attempt either A or B [5]', 25, 380);
    doc.text('A. How does irrigation affect crop yield? Mention two methods of irrigation.', 30, 387);
    doc.text('Answer:', 30, 394);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('Irrigation provides regular water supply, ensuring better growth.', 35, 401);
      doc.text('Methods: Sprinkler and Drip irrigation.', 35, 408);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Or', 30, 415);
    doc.text('B. Explain briefly how hybridisation helps in crop improvement.', 30, 422);
    doc.text('Answer:', 30, 429);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('Hybridisation combines the best traits of two varieties (like disease resistance and high yield), resulting in improved crops.', 35, 436);
      doc.setFont('helvetica', 'bold');
    }
    
    // Section B - Chemistry
    doc.addPage();
    
    doc.setFontSize(14);
    doc.text('Section – B (Chemistry)', 20, 20);
    doc.setFontSize(10);
    
    doc.text('Question 17.', 20, 35);
    doc.text('Which process changes water vapour directly into ice? [1]', 25, 42);
    doc.text('(a) Condensation', 30, 49);
    doc.text('(b) Freezing', 30, 56);
    doc.text('(c) Sublimation', 30, 63);
    doc.text('(d) Deposition', 30, 70);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (d) Deposition', 30, 77);
    }
    
    doc.text('Question 18.', 20, 90);
    doc.text('Which of the following is a colloidal solution? [1]', 25, 97);
    doc.text('(a) Salt in water', 30, 104);
    doc.text('(b) Mud in water', 30, 111);
    doc.text('(c) Milk', 30, 118);
    doc.text('(d) Alcohol in water', 30, 125);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c) Milk', 30, 132);
    }
    
    doc.text('Question 19.', 20, 145);
    doc.text('Calculate the formula mass of calcium chloride (CaCl₂). [1]', 25, 152);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 159);
      doc.setFont('helvetica', 'normal');
      doc.text('= 40 + (35.5 × 2) = 111 u', 30, 166);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 20.', 20, 180);
    doc.text('Which of the following represents a physical change? [1]', 25, 187);
    doc.text('(a) Burning of paper', 30, 194);
    doc.text('(b) Rusting of iron', 30, 201);
    doc.text('(c) Dissolving sugar in water', 30, 208);
    doc.text('(d) Digestion of food', 30, 215);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c) Dissolving sugar in water', 30, 222);
    }
    
    doc.text('Question 21.', 20, 235);
    doc.text('Which law is verified by the equation:', 25, 242);
    doc.text('2Mg + O₂ → 2MgO [1]', 25, 249);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 256);
      doc.setFont('helvetica', 'normal');
      doc.text('Law of Conservation of Mass', 30, 263);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 22.', 20, 277);
    doc.text('Which statement is correct about isotopes? [1]', 25, 284);
    doc.text('(a) They have different numbers of protons.', 30, 291);
    doc.text('(b) They have same atomic number but different mass numbers.', 30, 298);
    doc.text('(c) They have different chemical properties.', 30, 305);
    doc.text('(d) They have different electronic configurations.', 30, 312);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (b)', 30, 319);
    }
    
    doc.text('Question 23.', 20, 332);
    doc.text('An element X has 13 electrons and 14 neutrons. Represent the atom symbolically. [1]', 25, 339);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 346);
      doc.setFont('helvetica', 'normal');
      doc.text('¹³₂₇X', 30, 353);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 24.', 20, 367);
    doc.text('Assertion (A): All compounds obey the law of constant proportions.', 25, 374);
    doc.text('Reason (R): Compounds have fixed composition by mass. [1]', 25, 381);
    doc.text('(a) Both A and R are true and R is the correct explanation of A.', 30, 388);
    doc.text('(b) Both A and R are true but R is not the correct explanation of A.', 30, 395);
    doc.text('(c) A is true but R is false.', 30, 402);
    doc.text('(d) A is false but R is true.', 30, 409);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (a) Both A and R are true and R is the correct explanation of A.', 30, 416);
    }
    
    doc.text('Question 25.', 20, 430);
    doc.text('Write the electronic configuration of an atom with atomic number 17. [2]', 25, 437);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 444);
      doc.setFont('helvetica', 'normal');
      doc.text('K = 2, L = 8, M = 7 → 2, 8, 7', 30, 451);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 26.', 20, 465);
    doc.text('Attempt either A or B [3]', 25, 472);
    doc.text('A. Explain how evaporation causes cooling.', 30, 479);
    doc.text('Answer:', 30, 486);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('When a liquid evaporates, it absorbs heat from its surroundings, lowering the temperature.', 35, 493);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Or', 30, 500);
    doc.text('B. Explain how diffusion takes place in gases.', 30, 507);
    doc.text('Answer:', 30, 514);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('Particles of gases move freely and mix without stirring due to high kinetic energy.', 35, 521);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 27.', 20, 535);
    doc.text('Differentiate between true solution, suspension, and colloid. [3]', 25, 542);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 549);
      doc.setFont('helvetica', 'normal');
      doc.text('Property         True Solution    Colloid         Suspension', 30, 556);
      doc.text('Particle size    <1 nm            1–1000 nm       >1000 nm', 30, 563);
      doc.text('Stability        Stable           Stable          Unstable', 30, 570);
      doc.text('Tyndall effect   No               Yes             Sometimes', 30, 577);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 28.', 20, 591);
    doc.text('Isotopes of hydrogen are protium, deuterium, and tritium. Write one use of each. [4]', 25, 598);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 605);
      doc.setFont('helvetica', 'normal');
      doc.text('Protium: Used in hydrogen fuel cells.', 30, 612);
      doc.text('Deuterium: Used in nuclear reactors as moderator.', 30, 619);
      doc.text('Tritium: Used in luminous paints and nuclear weapons.', 30, 626);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 29.', 20, 640);
    doc.text('Attempt either A or B [5]', 25, 647);
    doc.text('A. Explain Rutherford’s experiment and state its conclusions.', 30, 654);
    doc.text('Answer:', 30, 661);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('Rutherford bombarded α-particles on a gold foil and observed that most passed straight, few deflected, and very few bounced back.', 35, 668);
      doc.text('Conclusions:', 35, 675);
      doc.text('1. Atom has a small, dense, positively charged nucleus.', 40, 682);
      doc.text('2. Most of the atom is empty space.', 40, 689);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Or', 30, 696);
    doc.text('B. State the postulates of Bohr’s model of atom.', 30, 703);
    doc.text('Answer:', 30, 710);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('1. Electrons revolve in fixed orbits around the nucleus.', 35, 717);
      doc.text('2. Energy of each orbit is fixed.', 35, 724);
      doc.text('3. Energy is absorbed or emitted when electrons jump between orbits.', 35, 731);
      doc.setFont('helvetica', 'bold');
    }
    
    // Section C - Physics
    doc.addPage();
    
    doc.setFontSize(14);
    doc.text('Section – C (Physics)', 20, 20);
    doc.setFontSize(10);
    
    doc.text('Question 30.', 20, 35);
    doc.text('Which of the following statements is correct? [1]', 25, 42);
    doc.text('(a) Speed has both magnitude and direction.', 30, 49);
    doc.text('(b) Velocity is a scalar quantity.', 30, 56);
    doc.text('(c) Displacement can be zero even when distance is not.', 30, 63);
    doc.text('(d) Acceleration is always positive.', 30, 70);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c)', 30, 77);
    }
    
    doc.text('Question 31.', 20, 90);
    doc.text('Sound cannot travel through: [1]', 25, 97);
    doc.text('(a) Air', 30, 104);
    doc.text('(b) Water', 30, 111);
    doc.text('(c) Vacuum', 30, 118);
    doc.text('(d) Iron', 30, 125);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (c) Vacuum', 30, 132);
    }
    
    doc.text('Question 32.', 20, 145);
    doc.text('Assertion (A): When velocity is constant, acceleration is zero.', 25, 152);
    doc.text('Reason (R): Acceleration measures the rate of change of velocity. [1]', 25, 159);
    doc.text('(a) Both A and R are true and R is the correct explanation of A.', 30, 166);
    doc.text('(b) Both A and R are true but R is not the correct explanation of A.', 30, 173);
    doc.text('(c) A is true but R is false.', 30, 180);
    doc.text('(d) A is false but R is true.', 30, 187);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer: (a) Both A and R are true and R is the correct explanation of A.', 30, 194);
    }
    
    doc.text('Question 33.', 20, 207);
    doc.text('A car accelerates from rest at 2 m/s² for 5 seconds. Find its final velocity and distance covered. [2]', 25, 214);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 221);
      doc.setFont('helvetica', 'normal');
      doc.text('v = u + at = 0 + 2×5 = 10 m/s', 30, 228);
      doc.text('s = ut + ½at² = 0 + ½×2×25 = 25 m', 30, 235);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 34.', 20, 249);
    doc.text('Attempt either A or B [3]', 25, 256);
    doc.text('A. Define echo and state one condition for hearing it.', 30, 263);
    doc.text('Answer:', 30, 270);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('Echo is the repetition of sound due to reflection.', 35, 277);
      doc.text('Condition: The obstacle must be at least 17 m away.', 35, 284);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Or', 30, 291);
    doc.text('B. Why is the speed of sound greater in solids than in gases?', 30, 298);
    doc.text('Answer:', 30, 305);
    if (withAnswers) {
      doc.setFont('helvetica', 'normal');
      doc.text('Because particles in solids are closely packed, allowing faster transfer of vibrations.', 35, 312);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 35.', 20, 326);
    doc.text('A 500 g stone is thrown vertically upward with a velocity of 10 m/s. Find its potential energy at maximum height. [3]', 25, 333);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 340);
      doc.setFont('helvetica', 'normal');
      doc.text('At max height, KE = 0, all energy = PE = ½mv²', 30, 347);
      doc.text('= ½ × 0.5 × 100 = 25 J', 30, 354);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 36.', 20, 368);
    doc.text('A 4 kg object is lifted to a height of 2 m. Calculate its potential energy. [2]', 25, 375);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 382);
      doc.setFont('helvetica', 'normal');
      doc.text('PE = mgh = 4 × 9.8 × 2 = 78.4 J', 30, 389);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 37.', 20, 403);
    doc.text('A sound wave travels 660 m in 2 seconds. Calculate its speed. [2]', 25, 410);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 417);
      doc.setFont('helvetica', 'normal');
      doc.text('v = d/t = 660/2 = 330 m/s', 30, 424);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 38.', 20, 438);
    doc.text('A force of 20 N acts on a 2 kg object for 3 seconds. Calculate acceleration and final velocity. [4]', 25, 445);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 452);
      doc.setFont('helvetica', 'normal');
      doc.text('a = F/m = 20/2 = 10 m/s²', 30, 459);
      doc.text('v = u + at = 0 + 10×3 = 30 m/s', 30, 466);
      doc.setFont('helvetica', 'bold');
    }
    
    doc.text('Question 39.', 20, 480);
    doc.text('State the law of conservation of energy with an example. [2]', 25, 487);
    
    if (withAnswers) {
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', 25, 494);
      doc.setFont('helvetica', 'normal');
      doc.text('Energy can neither be created nor destroyed, only transformed from one form to another.', 30, 501);
      doc.text('Example: In a pendulum, potential energy converts into kinetic energy and back.', 30, 508);
      doc.setFont('helvetica', 'bold');
    }
    
    // Add debugging information
    doc.setFontSize(8);
    doc.text('PDF Generation Debug Info:', 20, 520);
    doc.text('Page 3 - End of Physics Section', 20, 525);
    doc.text('Questions 30-39 included', 20, 530);
    doc.text('Total Questions: 39', 20, 535);
    
    // Save the PDF
    doc.save(withAnswers ? 'Class-9-Science-Sample-Paper-With-Solutions.pdf' : 'Class-9-Science-Sample-Paper.pdf');
  };

  const generateClass10SciencePaper = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Class 10 Science Sample Paper - Maximum Marks 80', 105, 20, { align: 'center' });
    
    // Add general instructions
    doc.setFontSize(12);
    doc.text('General Instructions:', 20, 35);
    doc.setFontSize(10);
    doc.text('1. All questions are compulsory.', 25, 42);
    doc.text('2. The question paper consists of five sections A-E.', 25, 48);
    doc.text('3. Internal choices are provided in some questions.', 25, 54);
    doc.text('4. Use of a calculator is not allowed.', 25, 60);
    doc.text('5. Wherever necessary, draw neat, labeled diagrams.', 25, 66);
    
    // Add section information
    doc.setFontSize(12);
    doc.text('SECTION A (1 Mark each)', 20, 80);
    doc.text('Questions 1-7 - 1 × 7 = 7 Marks', 20, 87);
    doc.text('1. Define valency. Give the valency of magnesium.', 25, 94);
    doc.text('2. Why is respiration considered an exothermic reaction?', 25, 101);
    doc.text('3. What is the role of the iris in the human eye?', 25, 108);
    doc.text('4. State Ohm’s Law.', 25, 115);
    doc.text('5. Why are LEDs preferred over filament bulbs?', 25, 122);
    doc.text('6. What are trophic levels?', 25, 129);
    doc.text('7. State one property that makes carbon an essential element for life.', 25, 136);
    
    doc.text('SECTION B (2 Marks each)', 20, 149);
    doc.text('Questions 8-12 - 2 × 5 = 10 Marks', 20, 156);
    doc.text('8. Write the chemical formula of washing soda and mention its two uses.', 25, 163);
    doc.text('9. State two differences between arteries and veins.', 25, 170);
    doc.text('10. What is the role of the diaphragm in respiration?', 25, 177);
    doc.text('11. Write two advantages of connecting electrical devices in parallel.', 25, 184);
    doc.text('12. Explain why excessive use of fertilizers is harmful to the environment.', 25, 191);
    
    doc.text('SECTION C (3 Marks each)', 20, 204);
    doc.text('Questions 13-18 - 3 × 6 = 18 Marks', 20, 211);
    doc.text('13. Explain the reactivity trends in the modern periodic table.', 25, 218);
    doc.text('14. Write the balanced chemical equation for:', 25, 225);
    doc.text('    (a) Thermal decomposition of calcium carbonate.', 30, 232);
    doc.text('    (b) Reaction between zinc and dilute sulphuric acid.', 30, 239);
    doc.text('15. Explain the process of nutrition in Amoeba with a neat labeled diagram.', 25, 246);
    doc.text('16. Differentiate between convex and concave lenses with one use of each.', 25, 253);
    doc.text('17. Draw a circuit diagram for the combination of three resistors R₁, R₂, and R₃ connected in parallel.', 25, 260);
    doc.text('    Derive the formula for the equivalent resistance.', 25, 267);
    doc.text('18. State the three R’s used for conservation of environment. Give one example for each.', 25, 274);
    
    doc.text('SECTION D (5 Marks each)', 20, 287);
    doc.text('Questions 19-22 - 5 × 4 = 20 Marks', 20, 294);
    doc.text('19. (a) Write the steps involved in the extraction of metals from ores.', 25, 301);
    doc.text('    (b) Explain why copper and aluminium are used for making electrical wires.', 25, 308);
    doc.text('    (c) Distinguish between calcination and roasting.', 25, 315);
    
    doc.text('20. (a) Draw a neat labeled diagram of the human heart.', 25, 328);
    doc.text('    (b) Describe the flow of blood through it.', 25, 335);
    doc.text('    (c) State one function each of arteries, veins, and capillaries.', 25, 342);
    
    doc.text('21. (a) Explain the formation of an image by a concave mirror when the object is placed:', 25, 355);
    doc.text('        Between the pole and focus.', 30, 362);
    doc.text('        Beyond the center of curvature.', 30, 369);
    doc.text('    (b) Write one use of concave mirror.', 25, 376);
    doc.text('    (c) Define focal length.', 25, 383);
    
    doc.text('22. (a) Define electric power.', 25, 396);
    doc.text('    (b) State and derive the formula for power in terms of current and resistance.', 25, 403);
    doc.text('    (c) A 60 W bulb is used for 5 hours daily. Calculate energy consumed in one month (30 days) in kWh.', 25, 410);
    
    doc.text('SECTION E (Case-Based / Source-Based Questions)', 20, 423);
    doc.text('Questions 23-25 - 4 × 3 = 12 Marks', 20, 430);
    
    doc.text('Q23. (Chemistry – Acids, Bases, and Salts)', 25, 437);
    doc.text('A student tested four solutions – A, B, C, and D – using litmus paper and pH paper.', 30, 444);
    doc.text('The pH values were found to be 2, 5, 8, and 12 respectively.', 30, 451);
    doc.text('a. Which solution is strongly acidic and which is strongly basic?', 35, 458);
    doc.text('b. Write the effect of each on blue and red litmus paper.', 35, 465);
    doc.text('c. Identify which one could be a dilute solution of sodium hydroxide.', 35, 472);
    doc.text('d. Explain the importance of maintaining pH in our digestive system.', 35, 479);
    
    doc.text('Q24. (Biology – Control and Coordination)', 25, 492);
    doc.text('Ravi accidentally touches a hot object and immediately withdraws his hand.', 30, 499);
    doc.text('Later, while smelling food, his mouth starts watering.', 30, 506);
    doc.text('a. Differentiate between the two responses.', 35, 513);
    doc.text('b. Name the parts of the nervous system involved in each case.', 35, 520);
    doc.text('c. What is the role of the spinal cord?', 35, 527);
    doc.text('d. Explain how hormones control responses differently from nerves.', 35, 534);
    
    doc.text('Q25. (Physics – Effects of Electric Current)', 25, 547);
    doc.text('An electric heater of 1000 W is operated for 30 minutes in a 220 V circuit.', 30, 554);
    doc.text('a. Calculate the current drawn by the heater.', 35, 561);
    doc.text('b. Calculate the heat produced in joules.', 35, 568);
    doc.text('c. If the same heater is used for 2 hours daily, find total energy consumed in one week in kWh.', 35, 575);
    doc.text('d. Mention two devices that use the heating effect of electric current.', 35, 582);
    
    // Add internal assessment section
    doc.text('INTERNAL ASSESSMENT - 20 Marks', 20, 595);
    doc.text('Component                            Marks', 20, 602);
    doc.text('Periodic Tests                        10', 20, 609);
    doc.text('Notebook Submission                  5', 20, 616);
    doc.text('Practical Work (Lab Record + Viva)   5', 20, 623);
    doc.text('Total                                20 Marks', 20, 630);
    
    // Save the PDF
    doc.save('Class-10-Science-Sample-Paper.pdf');
  };

  const reportBrokenLink = async (resourceId: string, userId: string) => {
    try {
      // In a real implementation, this would:
      // 1. Add a report to the broken_links collection
      // 2. Increment the broken_report_count for the resource
      // 3. Notify admins for review
      
      const resource = resources.find(r => r.id === resourceId);
      if (resource) {
        // Update local state to reflect the report
        setResources(prev => prev.map(r => 
          r.id === resourceId 
            ? { ...r, broken_report_count: (r.broken_report_count || 0) + 1 } 
            : r
        ));
        
        // Add to Firestore broken_links collection
        await addDoc(collection(db, 'broken_links'), {
          resource_id: resourceId,
          reported_by: userId,
          reported_at: new Date(),
          status: 'reported'
        });
        
        console.log(`Broken link reported for resource ${resourceId}`);
      }
    } catch (err) {
      console.error('Error reporting broken link:', err);
      setError('Failed to report broken link. Please try again.');
    }
  };

  const verifyResource = async (resourceId: string) => {
    try {
      // In a real implementation, this would:
      // 1. Check if the resource URL is accessible
      // 2. Update the last_verified date
      // 3. Update the is_verified status
      // 4. Add to verification logs
      
      const resource = resources.find(r => r.id === resourceId);
      if (resource) {
        // Simulate verification process
        const verificationResult = {
          isAccessible: true, // In real implementation, we would check the URL
          statusCode: 200,
          redirectUrl: null
        };
        
        // Update local state
        setResources(prev => prev.map(r => 
          r.id === resourceId 
            ? { 
                ...r, 
                is_verified: verificationResult.isAccessible,
                last_verified: new Date()
              } 
            : r
        ));
        
        // Add to Firestore verification logs
        await addDoc(collection(db, 'resource_verification_logs'), {
          resource_id: resourceId,
          verified_at: new Date(),
          verification_status: verificationResult.isAccessible ? 'valid' : 'broken',
          http_status_code: verificationResult.statusCode,
          notes: `Verified by system at ${new Date().toISOString()}`
        });
        
        console.log(`Resource ${resourceId} verified`);
      }
    } catch (err) {
      console.error('Error verifying resource:', err);
      setError('Failed to verify resource. Please try again.');
    }
  };

  const getResourceVerificationLogs = async (resourceId: string): Promise<ResourceVerificationLog[]> => {
    try {
      // In a real implementation, this would fetch from Firestore
      // For now, we'll return mock data
      return [
        {
          id: 'log-1',
          resource_id: resourceId,
          verified_at: new Date(),
          verification_status: 'valid',
          http_status_code: 200,
          notes: 'Initial verification'
        }
      ];
    } catch (err) {
      console.error('Error fetching verification logs:', err);
      return [];
    }
  };

  const getResourcePlagiarismCheck = async (resourceId: string): Promise<PlagiarismCheckResult | null> => {
    try {
      // In a real implementation, this would fetch from Firestore
      // For now, we'll return mock data
      return {
        id: 'plagiarism-1',
        resource_id: resourceId,
        checked_at: new Date(),
        similarity_score: 5,
        similar_resources: [],
        flagged_for_review: false
      };
    } catch (err) {
      console.error('Error fetching plagiarism check:', err);
      return null;
    }
  };

  const getResourceBrokenReports = async (resourceId: string): Promise<BrokenLinkReport[]> => {
    try {
      // In a real implementation, this would fetch from Firestore
      // For now, we'll return mock data
      return [
        {
          id: 'report-1',
          resource_id: resourceId,
          reported_by: 'user-123',
          reported_at: new Date(),
          status: 'verified',
          resolution_notes: 'Link is working correctly'
        }
      ];
    } catch (err) {
      console.error('Error fetching broken reports:', err);
      return [];
    }
  };

  const refreshResources = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from Firestore
      // For now, we'll just use the sample data
      setResources(enhancedSampleResources);
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing resources:', err);
      setError('Failed to refresh resources. Please try again.');
      setLoading(false);
    }
  };

  return (
    <EnhancedStudyResourcesContext.Provider value={{
      resources,
      filteredResources,
      loading,
      error,
      filters,
      setFilters,
      getResourcesByClass,
      getResourcesBySubject,
      downloadResource,
      openPaperInBrowser, // Add this new function
      getPaperData: (resourceId: string) => {
        // Return structured data for the question papers
        if (resourceId === 'sample-9-science') {
          return {
            id: 'sample-9-science',
            title: "CBSE Sample Papers for Class 9 Science – Set 1",
            time: "3 Hours",
            maxMarks: "80",
            instructions: [
              "This question paper consists of 39 questions divided into three sections:",
              "Section A – Biology, Section B – Chemistry, and Section C – Physics.",
              "All questions are compulsory. However, internal choices are provided.",
              "Students are expected to attempt only one of the alternatives in such cases."
            ],
            sections: [
              {
                name: "Section – A (Biology)",
                questions: [
                  {
                    id: 1,
                    text: "Which of the following structures helps in gaseous exchange in plants?",
                    marks: 1,
                    options: ["(a) Cuticle", "(b) Stomata", "(c) Lenticels", "(d) Both (b) and (c)"],
                    answer: "(d) Both (b) and (c)",
                    explanation: "Stomata are small pores on leaves, and lenticels are openings on woody stems that help in exchange of gases."
                  },
                  {
                    id: 2,
                    text: "Xylem and phloem together form which type of tissue?",
                    marks: 1,
                    options: ["(a) Permanent tissue", "(b) Simple tissue", "(c) Complex tissue", "(d) Meristematic tissue"],
                    answer: "(c) Complex tissue",
                    explanation: "Xylem and phloem consist of more than one type of cell performing a common function — hence called complex tissues."
                  },
                  {
                    id: 3,
                    text: "Which of the following is a plant hormone that promotes cell division?",
                    marks: 1,
                    options: ["(a) Auxin", "(b) Gibberellin", "(c) Cytokinin", "(d) Abscisic acid"],
                    answer: "(c) Cytokinin",
                    explanation: "Cytokinins promote cell division in plant tissues, especially in roots and shoots."
                  },
                  {
                    id: 4,
                    text: "Which organelle is responsible for detoxifying harmful substances in liver cells?",
                    marks: 1,
                    options: ["(a) Ribosome", "(b) Lysosome", "(c) Smooth Endoplasmic Reticulum", "(d) Mitochondria"],
                    answer: "(c) Smooth Endoplasmic Reticulum"
                  },
                  {
                    id: 5,
                    text: "Identify the correctly matched pair.",
                    marks: 1,
                    options: ["(a) Guard cells – Transpiration", "(b) Root hair – Photosynthesis", "(c) Stomata – Water absorption", "(d) Xylem – Transport of food"],
                    answer: "(a) Guard cells – Transpiration"
                  },
                  {
                    id: 6,
                    text: "Which among the following is a rabi crop?",
                    marks: 1,
                    options: ["(a) Paddy", "(b) Maize", "(c) Mustard", "(d) Groundnut"],
                    answer: "(c) Mustard"
                  },
                  {
                    id: 7,
                    text: "Rearing of fish for commercial purposes is called:",
                    marks: 1,
                    options: ["(a) Apiculture", "(b) Sericulture", "(c) Pisciculture", "(d) Floriculture"],
                    answer: "(c) Pisciculture"
                  },
                  {
                    id: 8,
                    text: "Assertion (A): Phloem transports food from leaves to other parts of the plant.\nReason (R): Phloem conducts only water and minerals.",
                    marks: 1,
                    options: [
                      "(a) Both A and R are true and R is the correct explanation of A.",
                      "(b) Both A and R are true but R is not the correct explanation of A.",
                      "(c) A is true but R is false.",
                      "(d) A is false but R is true."
                    ],
                    answer: "(c) A is true but R is false."
                  },
                  {
                    id: 9,
                    text: "Assertion (A): Root hair increases the surface area for water absorption.\nReason (R): Root hair transports food materials to different plant organs.",
                    marks: 1,
                    answer: "(c) A is true but R is false."
                  },
                  {
                    id: 10,
                    text: "Why are mitochondria called the “powerhouse of the cell”?",
                    marks: 2,
                    answer: "Mitochondria produce energy in the form of ATP during cellular respiration. This ATP acts as the main energy currency for all cellular activities."
                  },
                  {
                    id: 11,
                    text: "Attempt either A or B.",
                    marks: 2,
                    subQuestions: [
                      {
                        id: "11A",
                        text: "A. Write any two advantages of using biofertilisers in crop production.",
                        answer: "1. They increase soil fertility naturally without harming soil microorganisms.\n2. They are eco-friendly and cost-effective compared to chemical fertilisers."
                      },
                  {
                    id: "11B",
                    text: "B. Explain the importance of crop rotation.",
                    answer: "1. Crop rotation prevents depletion of specific nutrients from the soil.\n2. It reduces pest attacks and helps in maintaining soil fertility."
                  }
                ]
              },
              {
                id: 12,
                text: "Differentiate between smooth and striated muscles.",
                marks: 2,
                answer: "Feature          Smooth Muscle     Striated Muscle\nStructure        Non-striated,     Striated,\n                 spindle-shaped    cylindrical\nControl          Involuntary       Voluntary\nLocation         Internal organs   Skeletal muscles"
              },
              {
                id: 13,
                text: "Draw a neat diagram of a neuron and label any three parts.",
                marks: 3,
                answer: "Students should draw a neuron showing dendrite, axon, and nucleus.\nExplanation: Neurons transmit electrical impulses from one part of the body to another."
              },
              {
                id: 14,
                text: "What will happen if we place a plant cell in:\n(a) Distilled water\n(b) Concentrated salt solution",
                marks: 3,
                answer: "(a) The cell will swell up (endosmosis).\n(b) The cell will shrink (exosmosis)."
              },
              {
                id: 15,
                text: "Attempt either A or B",
                marks: 4,
                subQuestions: [
                  {
                    id: "15A",
                    text: "A. Why are guard cells kidney-shaped?",
                    answer: "Guard cells are kidney-shaped to control the opening and closing of stomatal pores for gas exchange."
                  },
                  {
                    id: "15B",
                    text: "B. Why are white blood cells called the soldiers of the body?",
                    answer: "Because they defend the body from infections and destroy disease-causing microbes."
                  }
                ]
              },
              {
                id: 16,
                text: "Attempt either A or B",
                marks: 5,
                subQuestions: [
                  {
                    id: "16A",
                    text: "A. How does irrigation affect crop yield? Mention two methods of irrigation.",
                    answer: "Irrigation provides regular water supply, ensuring better growth.\nMethods: Sprinkler and Drip irrigation."
                  },
                  {
                    id: "16B",
                    text: "B. Explain briefly how hybridisation helps in crop improvement.",
                    answer: "Hybridisation combines the best traits of two varieties (like disease resistance and high yield), resulting in improved crops."
                  }
                ]
              }
                ]
              },
              {
                name: "Section – B (Chemistry)",
                questions: [
                  {
                    id: 17,
                    text: "Which process changes water vapour directly into ice?",
                    marks: 1,
                    options: ["(a) Condensation", "(b) Freezing", "(c) Sublimation", "(d) Deposition"],
                    answer: "(d) Deposition"
                  },
                  {
                    id: 18,
                    text: "Which of the following is a colloidal solution?",
                    marks: 1,
                    options: ["(a) Salt in water", "(b) Mud in water", "(c) Milk", "(d) Alcohol in water"],
                    answer: "(c) Milk"
                  },
                  {
                    id: 19,
                    text: "Calculate the formula mass of calcium chloride (CaCl₂).",
                    marks: 1,
                    answer: "= 40 + (35.5 × 2) = 111 u"
                  },
                  {
                    id: 20,
                    text: "Which of the following represents a physical change?",
                    marks: 1,
                    options: [
                      "(a) Burning of paper",
                      "(b) Rusting of iron",
                      "(c) Dissolving sugar in water",
                      "(d) Digestion of food"
                    ],
                    answer: "(c) Dissolving sugar in water"
                  },
                  {
                    id: 21,
                    text: "Which law is verified by the equation:\n2Mg + O₂ → 2MgO",
                    marks: 1,
                    answer: "Law of Conservation of Mass"
                  },
                  {
                    id: 22,
                    text: "Which statement is correct about isotopes?",
                    marks: 1,
                    options: [
                      "(a) They have different numbers of protons.",
                      "(b) They have same atomic number but different mass numbers.",
                      "(c) They have different chemical properties.",
                      "(d) They have different electronic configurations."
                    ],
                    answer: "(b)"
                  },
                  {
                    id: 23,
                    text: "An element X has 13 electrons and 14 neutrons. Represent the atom symbolically.",
                    marks: 1,
                    answer: "¹³₂₇X"
                  },
                  {
                    id: 24,
                    text: "Assertion (A): All compounds obey the law of constant proportions.\nReason (R): Compounds have fixed composition by mass.",
                    marks: 1,
                    options: [
                      "(a) Both A and R are true and R is the correct explanation of A.",
                      "(b) Both A and R are true but R is not the correct explanation of A.",
                      "(c) A is true but R is false.",
                      "(d) A is false but R is true."
                    ],
                    answer: "(a) Both A and R are true and R is the correct explanation of A."
                  },
                  {
                    id: 25,
                    text: "Write the electronic configuration of an atom with atomic number 17.",
                    marks: 2,
                    answer: "K = 2, L = 8, M = 7 → 2, 8, 7"
                  },
                  {
                    id: 26,
                    text: "Attempt either A or B",
                    marks: 3,
                    subQuestions: [
                      {
                        id: "26A",
                        text: "A. Explain how evaporation causes cooling.",
                        answer: "When a liquid evaporates, it absorbs heat from its surroundings, lowering the temperature."
                      },
                      {
                        id: "26B",
                        text: "B. Explain how diffusion takes place in gases.",
                        answer: "Particles of gases move freely and mix without stirring due to high kinetic energy."
                      }
                    ]
                  },
                  {
                    id: 27,
                    text: "Differentiate between true solution, suspension, and colloid.",
                    marks: 3,
                    answer: "Property         True Solution    Colloid         Suspension\nParticle size    <1 nm            1–1000 nm       >1000 nm\nStability        Stable           Stable          Unstable\nTyndall effect   No               Yes             Sometimes"
                  },
                  {
                    id: 28,
                    text: "Isotopes of hydrogen are protium, deuterium, and tritium. Write one use of each.",
                    marks: 4,
                    answer: "Protium: Used in hydrogen fuel cells.\nDeuterium: Used in nuclear reactors as moderator.\nTritium: Used in luminous paints and nuclear weapons."
                  },
                  {
                    id: 29,
                    text: "Attempt either A or B",
                    marks: 5,
                    subQuestions: [
                      {
                        id: "29A",
                        text: "A. Explain Rutherford’s experiment and state its conclusions.",
                        answer: "Rutherford bombarded α-particles on a gold foil and observed that most passed straight, few deflected, and very few bounced back.\nConclusions:\n1. Atom has a small, dense, positively charged nucleus.\n2. Most of the atom is empty space."
                      },
                      {
                        id: "29B",
                        text: "B. State the postulates of Bohr’s model of atom.",
                        answer: "1. Electrons revolve in fixed orbits around the nucleus.\n2. Energy of each orbit is fixed.\n3. Energy is absorbed or emitted when electrons jump between orbits."
                      }
                    ]
                  }
                ]
              },
              {
                name: "Section – C (Physics)",
                questions: [
                  {
                    id: 30,
                    text: "Which of the following statements is correct?",
                    marks: 1,
                    options: [
                      "(a) Speed has both magnitude and direction.",
                      "(b) Velocity is a scalar quantity.",
                      "(c) Displacement can be zero even when distance is not.",
                      "(d) Acceleration is always positive."
                    ],
                    answer: "(c)"
                  },
                  {
                    id: 31,
                    text: "Sound cannot travel through:",
                    marks: 1,
                    options: ["(a) Air", "(b) Water", "(c) Vacuum", "(d) Iron"],
                    answer: "(c) Vacuum"
                  },
                  {
                    id: 32,
                    text: "Assertion (A): When velocity is constant, acceleration is zero.\nReason (R): Acceleration measures the rate of change of velocity.",
                    marks: 1,
                    options: [
                      "(a) Both A and R are true and R is the correct explanation of A.",
                      "(b) Both A and R are true but R is not the correct explanation of A.",
                      "(c) A is true but R is false.",
                      "(d) A is false but R is true."
                    ],
                    answer: "(a) Both A and R are true and R is the correct explanation of A."
                  },
                  {
                    id: 33,
                    text: "A car accelerates from rest at 2 m/s² for 5 seconds. Find its final velocity and distance covered.",
                    marks: 2,
                    answer: "v = u + at = 0 + 2×5 = 10 m/s\ns = ut + ½at² = 0 + ½×2×25 = 25 m"
                  },
                  {
                    id: 34,
                    text: "Attempt either A or B",
                    marks: 3,
                    subQuestions: [
                      {
                        id: "34A",
                        text: "A. Define echo and state one condition for hearing it.",
                        answer: "Echo is the repetition of sound due to reflection.\nCondition: The obstacle must be at least 17 m away."
                      },
                      {
                        id: "34B",
                        text: "B. Why is the speed of sound greater in solids than in gases?",
                        answer: "Because particles in solids are closely packed, allowing faster transfer of vibrations."
                      }
                    ]
                  },
                  {
                    id: 35,
                    text: "A 500 g stone is thrown vertically upward with a velocity of 10 m/s. Find its potential energy at maximum height.",
                    marks: 3,
                    answer: "At max height, KE = 0, all energy = PE = ½mv²\n= ½ × 0.5 × 100 = 25 J"
                  },
                  {
                    id: 36,
                    text: "A 4 kg object is lifted to a height of 2 m. Calculate its potential energy.",
                    marks: 2,
                    answer: "PE = mgh = 4 × 9.8 × 2 = 78.4 J"
                  },
                  {
                    id: 37,
                    text: "A sound wave travels 660 m in 2 seconds. Calculate its speed.",
                    marks: 2,
                    answer: "v = d/t = 660/2 = 330 m/s"
                  },
                  {
                    id: 38,
                    text: "A force of 20 N acts on a 2 kg object for 3 seconds. Calculate acceleration and final velocity.",
                    marks: 4,
                    answer: "a = F/m = 20/2 = 10 m/s²\nv = u + at = 0 + 10×3 = 30 m/s"
                  },
                  {
                    id: 39,
                    text: "State the law of conservation of energy with an example.",
                    marks: 2,
                    answer: "Energy can neither be created nor destroyed, only transformed from one form to another.\nExample: In a pendulum, potential energy converts into kinetic energy and back."
                  }
                ]
              }
            ]
          };
        } else if (resourceId === 'sample-10-science') {
          return {
            id: 'sample-10-science',
            title: "Class 10 Science Sample Paper - Maximum Marks 80",
            time: "",
            maxMarks: "80",
            instructions: [
              "All questions are compulsory.",
              "The question paper consists of five sections A-E.",
              "Internal choices are provided in some questions.",
              "Use of a calculator is not allowed.",
              "Wherever necessary, draw neat, labeled diagrams."
            ],
            sections: [
              {
                name: "SECTION A (1 Mark each)",
                questions: [
                  {
                    id: 1,
                    text: "Define valency. Give the valency of magnesium.",
                    marks: 1
                  },
                  {
                    id: 2,
                    text: "Why is respiration considered an exothermic reaction?",
                    marks: 1
                  },
                  {
                    id: 3,
                    text: "What is the role of the iris in the human eye?",
                    marks: 1
                  },
                  {
                    id: 4,
                    text: "State Ohm's Law.",
                    marks: 1
                  },
                  {
                    id: 5,
                    text: "Why are LEDs preferred over filament bulbs?",
                    marks: 1
                  },
                  {
                    id: 6,
                    text: "What are trophic levels?",
                    marks: 1
                  },
                  {
                    id: 7,
                    text: "State one property that makes carbon an essential element for life.",
                    marks: 1
                  }
                ]
              },
              {
                name: "SECTION B (2 Marks each)",
                questions: [
                  {
                    id: 8,
                    text: "Write the chemical formula of washing soda and mention its two uses.",
                    marks: 2
                  },
                  {
                    id: 9,
                    text: "State two differences between arteries and veins.",
                    marks: 2
                  },
                  {
                    id: 10,
                    text: "What is the role of the diaphragm in respiration?",
                    marks: 2
                  },
                  {
                    id: 11,
                    text: "Write two advantages of connecting electrical devices in parallel.",
                    marks: 2
                  },
                  {
                    id: 12,
                    text: "Explain why excessive use of fertilizers is harmful to the environment.",
                    marks: 2
                  }
                ]
              },
              {
                name: "SECTION C (3 Marks each)",
                questions: [
                  {
                    id: 13,
                    text: "Explain the reactivity trends in the modern periodic table.",
                    marks: 3
                  },
                  {
                    id: 14,
                    text: "Write the balanced chemical equation for:\n(a) Thermal decomposition of calcium carbonate.\n(b) Reaction between zinc and dilute sulphuric acid.",
                    marks: 3
                  },
                  {
                    id: 15,
                    text: "Explain the process of nutrition in Amoeba with a neat labeled diagram.",
                    marks: 3
                  },
                  {
                    id: 16,
                    text: "Differentiate between convex and concave lenses with one use of each.",
                    marks: 3
                  },
                  {
                    id: 17,
                    text: "Draw a circuit diagram for the combination of three resistors R₁, R₂, and R₃ connected in parallel.\nDerive the formula for the equivalent resistance.",
                    marks: 3
                  },
                  {
                    id: 18,
                    text: "State the three R's used for conservation of environment. Give one example for each.",
                    marks: 3
                  }
                ]
              },
              {
                name: "SECTION D (5 Marks each)",
                questions: [
                  {
                    id: 19,
                    text: "(a) Write the steps involved in the extraction of metals from ores.\n(b) Explain why copper and aluminium are used for making electrical wires.\n(c) Distinguish between calcination and roasting.",
                    marks: 5
                  },
                  {
                    id: 20,
                    text: "(a) Draw a neat labeled diagram of the human heart.\n(b) Describe the flow of blood through it.\n(c) State one function each of arteries, veins, and capillaries.",
                    marks: 5
                  },
                  {
                    id: 21,
                    text: "(a) Explain the formation of an image by a concave mirror when the object is placed:\nBetween the pole and focus.\nBeyond the center of curvature.\n(b) Write one use of concave mirror.\n(c) Define focal length.",
                    marks: 5
                  },
                  {
                    id: 22,
                    text: "(a) Define electric power.\n(b) State and derive the formula for power in terms of current and resistance.\n(c) A 60 W bulb is used for 5 hours daily. Calculate energy consumed in one month (30 days) in kWh.",
                    marks: 5
                  }
                ]
              },
              {
                name: "SECTION E (Case-Based / Source-Based Questions)",
                questions: [
                  {
                    id: 23,
                    text: "(Chemistry – Acids, Bases, and Salts)\nA student tested four solutions – A, B, C, and D – using litmus paper and pH paper.\nThe pH values were found to be 2, 5, 8, and 12 respectively.\na. Which solution is strongly acidic and which is strongly basic?\nb. Write the effect of each on blue and red litmus paper.\nc. Identify which one could be a dilute solution of sodium hydroxide.\nd. Explain the importance of maintaining pH in our digestive system.",
                    marks: 4
                  },
                  {
                    id: 24,
                    text: "(Biology – Control and Coordination)\nRavi accidentally touches a hot object and immediately withdraws his hand.\nLater, while smelling food, his mouth starts watering.\na. Differentiate between the two responses.\nb. Name the parts of the nervous system involved in each case.\nc. What is the role of the spinal cord?\nd. Explain how hormones control responses differently from nerves.",
                    marks: 4
                  },
                  {
                    id: 25,
                    text: "(Physics – Effects of Electric Current)\nAn electric heater of 1000 W is operated for 30 minutes in a 220 V circuit.\na. Calculate the current drawn by the heater.\nb. Calculate the heat produced in joules.\nc. If the same heater is used for 2 hours daily, find total energy consumed in one week in kWh.\nd. Mention two devices that use the heating effect of electric current.",
                    marks: 4
                  }
                ]
              },
              {
                name: "INTERNAL ASSESSMENT - 20 Marks",
                questions: [
                  {
                    id: 26,
                    text: "Component                            Marks\nPeriodic Tests                        10\nNotebook Submission                  5\nPractical Work (Lab Record + Viva)   5\nTotal                                20 Marks",
                    marks: 20
                  }
                ]
              }
            ]
          };
        }
        return null;
      },
      reportBrokenLink,
      verifyResource,
      getResourceVerificationLogs,
      getResourcePlagiarismCheck,
      getResourceBrokenReports,
      refreshResources
    }}>
      {children}
    </EnhancedStudyResourcesContext.Provider>
  );
};