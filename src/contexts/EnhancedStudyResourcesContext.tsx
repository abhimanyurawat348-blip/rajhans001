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
  downloadResource: (resource: StudyResource) => void;
  reportBrokenLink: (resourceId: string, userId: string) => Promise<void>;
  verifyResource: (resourceId: string) => Promise<void>;
  getResourceVerificationLogs: (resourceId: string) => Promise<ResourceVerificationLog[]>;
  getResourcePlagiarismCheck: (resourceId: string) => Promise<PlagiarismCheckResult | null>;
  getResourceBrokenReports: (resourceId: string) => Promise<BrokenLinkReport[]>;
  refreshResources: () => Promise<void>;
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
    broken_report_count: 0
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

  const downloadResource = (resource: StudyResource) => {
    // Generate PDF content based on resource ID
    if (resource.id === 'sample-9-science') {
      generateClass9SciencePaper();
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

  const generateClass9SciencePaper = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Class 9 Science Sample Paper - Maximum Marks 80', 105, 20, { align: 'center' });
    
    // Add general instructions
    doc.setFontSize(12);
    doc.text('General Instructions:', 20, 35);
    doc.setFontSize(10);
    doc.text('1. All questions are compulsory.', 25, 42);
    doc.text('2. Internal choices are provided in some questions.', 25, 48);
    doc.text('3. The question paper consists of five sections A-E.', 25, 54);
    doc.text('4. Use of a calculator is not allowed.', 25, 60);
    doc.text('5. Wherever necessary, neat and labeled diagrams should be drawn.', 25, 66);
    
    // Add section information
    doc.setFontSize(12);
    doc.text('SECTION A - Very Short Answer Questions (1 mark each)', 20, 80);
    doc.text('Questions 1 to 5 - 1 × 5 = 5 marks', 20, 87);
    doc.text('1. Define matter.', 25, 94);
    doc.text('2. State the law of conservation of mass with an example.', 25, 101);
    doc.text('3. What is the SI unit of acceleration?', 25, 108);
    doc.text('4. Name the structural and functional unit of life.', 25, 115);
    doc.text('5. Mention one method of separation used for separating salt and water mixture.', 25, 122);
    
    doc.text('SECTION B - Short Answer Type-I (2 marks each)', 20, 135);
    doc.text('Questions 6 to 10 - 2 × 5 = 10 marks', 20, 142);
    doc.text('6. Differentiate between homogeneous and heterogeneous mixtures with examples.', 25, 149);
    doc.text('7. What is meant by displacement? How is it different from distance?', 25, 156);
    doc.text('8. Write two differences between unicellular and multicellular organisms.', 25, 163);
    doc.text('9. Explain how the motion of a body changes when an unbalanced force acts on it.', 25, 170);
    doc.text('10. List any two functions of cell membrane.', 25, 177);
    
    doc.text('SECTION C - Short Answer Type-II (3 marks each)', 20, 190);
    doc.text('Questions 11 to 16 - 3 × 6 = 18 marks', 20, 197);
    doc.text('11. Write the postulates of Dalton’s Atomic Theory. Mention one limitation.', 25, 204);
    doc.text('12. Derive the relation between acceleration, initial velocity, final velocity, and time.', 25, 211);
    doc.text('13. Draw a neat labeled diagram of a plant cell.', 25, 218);
    doc.text('14. Write three differences between solids, liquids, and gases based on particle arrangement and compressibility.', 25, 225);
    doc.text('15. Define inertia. State Newton’s First Law of Motion and give one example from daily life.', 25, 232);
    doc.text('16. Explain the process of evaporation and list any three factors affecting its rate.', 25, 239);
    
    doc.text('SECTION D - Long Answer Type (5 marks each)', 20, 252);
    doc.text('Questions 17 to 20 - 5 × 4 = 20 marks', 20, 259);
    doc.text('17. (a) Define velocity and acceleration.', 25, 266);
    doc.text('    (b) A car accelerates uniformly from rest to a speed of 72 km/h in 10 seconds. Calculate:', 25, 273);
    doc.text('        (i) The acceleration.', 30, 280);
    doc.text('        (ii) The distance covered.', 30, 287);
    doc.text('        (iii) Draw a velocity-time graph for the motion.', 30, 294);
    
    doc.text('18. (a) Explain the structure of an atom according to Bohr’s model.', 25, 307);
    doc.text('    (b) Define valency and atomic number with examples.', 25, 314);
    
    doc.text('19. (a) Draw a neat labeled diagram of the human digestive system.', 25, 327);
    doc.text('    (b) Describe the function of any two digestive glands.', 25, 334);
    
    doc.text('20. (a) Explain the role of decomposers in an ecosystem.', 25, 347);
    doc.text('    (b) What will happen if all decomposers are removed from the environment?', 25, 354);
    doc.text('    (c) Suggest any two methods to reduce non-biodegradable waste.', 25, 361);
    
    doc.text('SECTION E - Case-Based / Source-Based Questions (4 marks each)', 20, 374);
    doc.text('Questions 21 to 23 - 4 × 3 = 12 marks', 20, 381);
    
    doc.text('Q21. (Physics – Motion)', 25, 388);
    doc.text('A train starts from rest and accelerates uniformly for 10 seconds to reach a velocity of 20 m/s.', 30, 395);
    doc.text('Then it runs at this velocity for 40 seconds and finally decelerates uniformly to stop in 10 seconds.', 30, 402);
    doc.text('Read the passage and answer:', 30, 409);
    doc.text('a. What is the acceleration during the first 10 seconds?', 35, 416);
    doc.text('b. Draw a velocity-time graph for the motion.', 35, 423);
    doc.text('c. Calculate total distance travelled by the train.', 35, 430);
    doc.text('d. State one use of velocity-time graph.', 35, 437);
    
    doc.text('Q22. (Chemistry – Matter Around Us)', 25, 450);
    doc.text('A student was given a mixture of sand, salt, and water. He was asked to separate all three components.', 30, 457);
    doc.text('a. List the steps he should follow in correct order.', 35, 464);
    doc.text('b. Write the principle involved in each step.', 35, 471);
    doc.text('c. Mention one change you will observe at each stage of separation.', 35, 478);
    doc.text('d. Identify physical and chemical changes involved, if any.', 35, 485);
    
    doc.text('Q23. (Biology – Tissues)', 25, 498);
    doc.text('Read the following passage and answer:', 30, 505);
    doc.text('A student observed thin slices of potato and onion under a microscope. He found differences in shape,', 30, 512);
    doc.text('size, and internal structure of cells.', 30, 519);
    doc.text('a. Identify the types of tissues observed in both cases.', 35, 526);
    doc.text('b. Write two functions of parenchyma.', 35, 533);
    doc.text('c. State one difference between plant and animal tissues.', 35, 540);
    doc.text('d. Explain how plant tissues are classified broadly.', 35, 547);
    
    // Save the PDF
    doc.save('Class-9-Science-Sample-Paper.pdf');
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