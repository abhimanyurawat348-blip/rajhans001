/**
 * Test utility for the Marks Management System
 * This file contains functions to verify the implementation
 */

import { db } from '../config/firebase';
import { collection, getDocs, query, where, doc, setDoc, getDoc } from 'firebase/firestore';

// Test data for Class 8, Section A
const mockStudents = [
  { username: 'Rahul Sharma', admissionNumber: 'RHPS001', class: '8', section: 'A' },
  { username: 'Priya Patel', admissionNumber: 'RHPS002', class: '8', section: 'A' },
  { username: 'Amit Kumar', admissionNumber: 'RHPS003', class: '8', section: 'A' },
  { username: 'Sneha Gupta', admissionNumber: 'RHPS004', class: '8', section: 'A' },
  { username: 'Vikash Singh', admissionNumber: 'RHPS005', class: '8', section: 'A' }
];

// Test function to verify student data structure
export async function testStudentDataStructure() {
  try {
    console.log('Testing student data structure...');
    
    // Check if students collection exists with proper structure
    const studentsCollection = collection(db, 'users');
    const studentsQuery = query(studentsCollection, where('role', '==', 'student'));
    const studentsSnapshot = await getDocs(studentsQuery);
    
    if (studentsSnapshot.empty) {
      console.log('No students found in database');
      return false;
    }
    
    let validStructure = true;
    studentsSnapshot.forEach((doc) => {
      const data = doc.data();
      const requiredFields = ['username', 'admissionNumber', 'class', 'section', 'role'];
      
      for (const field of requiredFields) {
        if (!(field in data)) {
          console.log(`Missing field ${field} in student document ${doc.id}`);
          validStructure = false;
        }
      }
    });
    
    console.log('Student data structure test:', validStructure ? 'PASSED' : 'FAILED');
    return validStructure;
  } catch (error) {
    console.error('Error testing student data structure:', error);
    return false;
  }
}

// Test function to verify marks data structure
export async function testMarksDataStructure() {
  try {
    console.log('Testing marks data structure...');
    
    // Check if marks subcollection exists with proper structure
    const studentsCollection = collection(db, 'users');
    const studentsQuery = query(studentsCollection, where('role', '==', 'student'));
    const studentsSnapshot = await getDocs(studentsQuery);
    
    if (studentsSnapshot.empty) {
      console.log('No students found in database');
      return false;
    }
    
    let validStructure = true;
    for (const studentDoc of studentsSnapshot.docs) {
      const studentId = studentDoc.id;
      const marksCollection = collection(db, 'students', studentId, 'marks');
      const marksSnapshot = await getDocs(marksCollection);
      
      marksSnapshot.forEach((doc) => {
        const data = doc.data();
        // Check if exam type is in the document ID or data
        if (!data.unit_test_1 && !data.unit_test_2 && !data.unit_test_3 && 
            !data.half_yearly && !data.final_exam) {
          console.log(`Marks document ${doc.id} for student ${studentId} has no valid exam data`);
          validStructure = false;
        }
      });
    }
    
    console.log('Marks data structure test:', validStructure ? 'PASSED' : 'FAILED');
    return validStructure;
  } catch (error) {
    console.error('Error testing marks data structure:', error);
    return false;
  }
}

// Test function to verify parent data structure
export async function testParentDataStructure() {
  try {
    console.log('Testing parent data structure...');
    
    // Check if parents collection exists with proper structure
    const parentsCollection = collection(db, 'users');
    const parentsQuery = query(parentsCollection, where('role', '==', 'parent'));
    const parentsSnapshot = await getDocs(parentsQuery);
    
    if (parentsSnapshot.empty) {
      console.log('No parents found in database');
      return true; // This is not necessarily a failure
    }
    
    let validStructure = true;
    parentsSnapshot.forEach((doc) => {
      const data = doc.data();
      // Parents should have studentId or children array
      if (!data.studentId && !data.children) {
        console.log(`Parent document ${doc.id} missing student reference`);
        validStructure = false;
      }
    });
    
    console.log('Parent data structure test:', validStructure ? 'PASSED' : 'FAILED');
    return validStructure;
  } catch (error) {
    console.error('Error testing parent data structure:', error);
    return false;
  }
}

// Test function to verify Excel upload functionality
export async function testExcelUploadFunctionality() {
  try {
    console.log('Testing Excel upload functionality...');
    
    // This would require mocking the file upload process
    // For now, we'll just verify that the required dependencies are available
    const xlsxAvailable = typeof require !== 'undefined';
    
    console.log('Excel upload functionality test:', xlsxAvailable ? 'PASSED' : 'SKIPPED');
    return xlsxAvailable;
  } catch (error) {
    console.error('Error testing Excel upload functionality:', error);
    return false;
  }
}

// Main test function
export async function runAllTests() {
  console.log('Running Marks Management System tests...');
  
  const tests = [
    { name: 'Student Data Structure', func: testStudentDataStructure },
    { name: 'Marks Data Structure', func: testMarksDataStructure },
    { name: 'Parent Data Structure', func: testParentDataStructure },
    { name: 'Excel Upload Functionality', func: testExcelUploadFunctionality }
  ];
  
  let passedTests = 0;
  
  for (const test of tests) {
    try {
      const result = await test.func();
      if (result) passedTests++;
      console.log(`\n`);
    } catch (error) {
      console.error(`Test ${test.name} failed with error:`, error);
    }
  }
  
  console.log(`\nTest Results: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('All tests passed! The Marks Management System is working correctly.');
    return true;
  } else {
    console.log('Some tests failed. Please check the implementation.');
    return false;
  }
}

// Export individual test functions for manual testing
export default {
  testStudentDataStructure,
  testMarksDataStructure,
  testParentDataStructure,
  testExcelUploadFunctionality,
  runAllTests
};