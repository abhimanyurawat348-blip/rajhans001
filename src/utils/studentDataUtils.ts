import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';




export const syncStudentData = async (studentData: any) => {
  try {
    
    if (studentData.uid) {
      await updateDoc(doc(db, 'users', studentData.uid), {
        ...studentData,
        updatedAt: new Date()
      });
    }

    
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


export const fetchStudentData = async (userId: string, email: string, admissionNumber?: string) => {
  try {
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }

    
    if (admissionNumber) {
      const studentDoc = await getDoc(doc(db, 'students', admissionNumber));
      if (studentDoc.exists()) {
        return { success: true, data: studentDoc.data() };
      }
    }

    
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


export const fetchStudentMarks = async (userId: string, admissionNumber?: string) => {
  const examTypes = ['unit_test_1', 'unit_test_2', 'unit_test_3', 'half_yearly', 'final_exam'];
  const marksData: any[] = [];

  try {
    
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
      
      
      if (marksData.length > 0) {
        return marksData;
      }
    }

    
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


export const migrateStudentData = async () => {
  try {
    
    console.log('Migration function placeholder');
    return { success: true };
  } catch (error) {
    console.error('Error migrating student data:', error);
    return { success: false, error: 'Failed to migrate student data' };
  }
};