import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Demo student data
const demoStudents = [
  {
    id: 'demo-student-1',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    role: 'student',
    admissionNumber: 'RHPS2025001',
    class: '10',
    section: 'A',
    dateOfBirth: '2007-05-15',
    fatherName: 'Amit Sharma',
    motherName: 'Priya Sharma'
  },
  {
    id: 'demo-student-2',
    fullName: 'Sneha Patel',
    email: 'sneha.patel@gmail.com',
    role: 'student',
    admissionNumber: 'RHPS2025002',
    class: '10',
    section: 'A',
    dateOfBirth: '2007-08-22',
    fatherName: 'Rajesh Patel',
    motherName: 'Neha Patel'
  },
  {
    id: 'demo-student-3',
    fullName: 'Vikash Kumar',
    email: 'vikash.kumar@gmail.com',
    role: 'student',
    admissionNumber: 'RHPS2025003',
    class: '10',
    section: 'A',
    dateOfBirth: '2007-03-10',
    fatherName: 'Deepak Kumar',
    motherName: 'Sunita Kumar'
  }
];

// Demo subject marks data
const demoMarksData = [
  // Rahul Sharma's marks
  {
    studentId: 'demo-student-1',
    subject: 'Mathematics',
    unitTest1: 78,
    unitTest2: 82,
    halfYearly: 85,
    final: null,
    uploadedAt: new Date('2025-09-15')
  },
  {
    studentId: 'demo-student-1',
    subject: 'Science',
    unitTest1: 75,
    unitTest2: 72,
    halfYearly: 70,
    final: null,
    uploadedAt: new Date('2025-09-16')
  },
  {
    studentId: 'demo-student-1',
    subject: 'English',
    unitTest1: 88,
    unitTest2: 90,
    halfYearly: 92,
    final: null,
    uploadedAt: new Date('2025-09-17')
  },
  {
    studentId: 'demo-student-1',
    subject: 'Social Studies',
    unitTest1: 80,
    unitTest2: 78,
    halfYearly: 75,
    final: null,
    uploadedAt: new Date('2025-09-18')
  },
  
  // Sneha Patel's marks
  {
    studentId: 'demo-student-2',
    subject: 'Mathematics',
    unitTest1: 92,
    unitTest2: 88,
    halfYearly: 90,
    final: null,
    uploadedAt: new Date('2025-09-15')
  },
  {
    studentId: 'demo-student-2',
    subject: 'Science',
    unitTest1: 85,
    unitTest2: 87,
    halfYearly: 89,
    final: null,
    uploadedAt: new Date('2025-09-16')
  },
  {
    studentId: 'demo-student-2',
    subject: 'English',
    unitTest1: 78,
    unitTest2: 80,
    halfYearly: 82,
    final: null,
    uploadedAt: new Date('2025-09-17')
  },
  {
    studentId: 'demo-student-2',
    subject: 'Social Studies',
    unitTest1: 88,
    unitTest2: 85,
    halfYearly: 87,
    final: null,
    uploadedAt: new Date('2025-09-18')
  },
  
  // Vikash Kumar's marks
  {
    studentId: 'demo-student-3',
    subject: 'Mathematics',
    unitTest1: 65,
    unitTest2: 70,
    halfYearly: 68,
    final: null,
    uploadedAt: new Date('2025-09-15')
  },
  {
    studentId: 'demo-student-3',
    subject: 'Science',
    unitTest1: 72,
    unitTest2: 68,
    halfYearly: 70,
    final: null,
    uploadedAt: new Date('2025-09-16')
  },
  {
    studentId: 'demo-student-3',
    subject: 'English',
    unitTest1: 75,
    unitTest2: 78,
    halfYearly: 80,
    final: null,
    uploadedAt: new Date('2025-09-17')
  },
  {
    studentId: 'demo-student-3',
    subject: 'Social Studies',
    unitTest1: 80,
    unitTest2: 82,
    halfYearly: 78,
    final: null,
    uploadedAt: new Date('2025-09-18')
  }
];

// Demo homework data
const demoHomeworkData = [
  {
    studentId: 'demo-student-1',
    subject: 'Mathematics',
    title: 'Algebra Practice Problems',
    dueDate: new Date('2025-10-20'),
    submitted: true,
    submissionDate: new Date('2025-10-18')
  },
  {
    studentId: 'demo-student-1',
    subject: 'Science',
    title: 'Chapter 5 Exercises',
    dueDate: new Date('2025-10-22'),
    submitted: false,
    submissionDate: null
  },
  {
    studentId: 'demo-student-2',
    subject: 'English',
    title: 'Essay Writing Assignment',
    dueDate: new Date('2025-10-25'),
    submitted: true,
    submissionDate: new Date('2025-10-23')
  }
];

// Demo attendance data
const demoAttendanceData = [
  {
    studentId: 'demo-student-1',
    totalDays: 50,
    presentDays: 46,
    absentDays: 4,
    percentage: 92
  },
  {
    studentId: 'demo-student-2',
    totalDays: 50,
    presentDays: 48,
    absentDays: 2,
    percentage: 96
  },
  {
    studentId: 'demo-student-3',
    totalDays: 50,
    presentDays: 42,
    absentDays: 8,
    percentage: 84
  }
];

// Function to generate demo data in Firestore
export const generateDemoData = async () => {
  try {
    console.log('Generating demo data...');
    
    // Add demo students to users collection
    for (const student of demoStudents) {
      await setDoc(doc(db, 'users', student.id), student);
      console.log(`Added student: ${student.fullName}`);
    }
    
    // Add demo marks data to students' marks subcollections
    for (const mark of demoMarksData) {
      // Create a unique document ID based on student, subject, and exam type
      const docId = `${mark.studentId}-${mark.subject}-${mark.uploadedAt.getTime()}`;
      await setDoc(doc(db, 'students', mark.studentId, 'marks', docId), mark);
      console.log(`Added marks for student ${mark.studentId} in ${mark.subject}`);
    }
    
    // Add demo homework data
    for (const homework of demoHomeworkData) {
      await addDoc(collection(db, 'homework'), homework);
      console.log(`Added homework for student ${homework.studentId}`);
    }
    
    // Add demo attendance data
    for (const attendance of demoAttendanceData) {
      await setDoc(doc(db, 'attendance', attendance.studentId), attendance);
      console.log(`Added attendance for student ${attendance.studentId}`);
    }
    
    console.log('Demo data generation completed successfully!');
    return true;
  } catch (error) {
    console.error('Error generating demo data:', error);
    return false;
  }
};

// Function to clear demo data
export const clearDemoData = async () => {
  try {
    console.log('Clearing demo data is not implemented for safety reasons.');
    console.log('Please manually delete demo data from Firestore if needed.');
    return false;
  } catch (error) {
    console.error('Error clearing demo data:', error);
    return false;
  }
};

export default {
  generateDemoData,
  clearDemoData
};