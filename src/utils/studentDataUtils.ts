import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Utility functions for managing student data consistency across Firestore collections
 */

/**
 * Ensures student data consistency between users and students collections
 * @param studentData - The student data to synchronize
 */
export const syncStudentData = async (studentData: any) => {
  try {
    // Update users collection
    if (studentData.uid) {
      await updateDoc(doc(db, 'users', studentData.uid), {
        ...studentData,
        updatedAt: new Date()
      });
    }

    // Update students collection
    if (studentData.admissionNumber) {
      await setDoc(doc(db, 'students', studentData.admissionNumber), {
        ...studentData,
        updatedAt: new Date()
      }, { merge: true });
    }

    return true;
  } catch (error) {
    console.error('Error syncing student data:', error);
    return false;
  }
};

/**
 * Fetches student data with fallback mechanisms
 * @param userId - Firebase user ID
 * @param email - User email
 * @param admissionNumber - Student admission number
 */
export const fetchStudentData = async (userId: string, email: string, admissionNumber?: string) => {
  try {
    // Primary: Try to fetch from users collection
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }

    // Secondary: Try to fetch from students collection by admission number
    if (admissionNumber) {
      const studentDoc = await getDoc(doc(db, 'students', admissionNumber));
      if (studentDoc.exists()) {
        return { success: true, data: studentDoc.data() };
      }
    }

    // Tertiary: Try to fetch from students collection by email
    const studentsQuery = query(
      collection(db, 'students'),
      where('email', '==', email)
    );
    const studentsSnapshot = await getDocs(studentsQuery);
    
    if (!studentsSnapshot.empty) {
      const studentDoc = studentsSnapshot.docs[0];
      return { success: true, data: studentDoc.data() };
    }

    return { success: false, error: 'Student data not found' };
  } catch (error) {
    console.error('Error fetching student data:', error);
    return { success: false, error: 'Failed to fetch student data' };
  }
};

/**
 * Fetches student marks with fallback mechanisms
 * @param userId - Firebase user ID
 * @param admissionNumber - Student admission number
 */
export const fetchStudentMarks = async (userId: string, admissionNumber?: string) => {
  const examTypes = ['unit_test_1', 'unit_test_2', 'unit_test_3', 'half_yearly', 'final_exam'];
  const marksData: any[] = [];

  try {
    // Try to fetch marks using admission number (preferred method)
    if (admissionNumber) {
      for (const examType of examTypes) {
        try {
          const marksDoc = await getDoc(doc(db, 'students', admissionNumber, 'marks', examType));
          if (marksDoc.exists()) {
            marksData.push({
              id: examType,
              ...marksDoc.data()
            });
          }
        } catch (examError) {
          console.warn(`Failed to fetch marks for ${examType}:`, examError);
        }
      }
      
      // If we found marks using admission number, return them
      if (marksData.length > 0) {
        return marksData;
      }
    }

    // Fallback: Try to fetch marks using user ID
    for (const examType of examTypes) {
      try {
        const marksDoc = await getDoc(doc(db, 'students', userId, 'marks', examType));
        if (marksDoc.exists()) {
          marksData.push({
            id: examType,
            ...marksDoc.data()
          });
        }
      } catch (examError) {
        console.warn(`Failed to fetch marks for ${examType}:`, examError);
      }
    }

    return marksData;
  } catch (error) {
    console.error('Error fetching student marks:', error);
    return [];
  }
};

/**
 * Migrates student data from old structure to new structure
 * This function can be used to migrate existing data to the new consistent structure
 */
export const migrateStudentData = async () => {
  try {
    // This would be implemented based on specific migration needs
    console.log('Migration function placeholder');
    return { success: true };
  } catch (error) {
    console.error('Error migrating student data:', error);
    return { success: false, error: 'Failed to migrate student data' };
  }
};