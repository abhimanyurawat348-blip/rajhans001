import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  getDoc,
  deleteDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { 
  GeneratedQuestionPaper,
  StudyResource,
  QuestionPaperBlueprint
} from '../types';

/**
 * Store a generated question paper in the study resources collection
 * @param paper The generated question paper
 * @returns Promise with the stored resource
 */
export const storeGeneratedPaperAsResource = async (
  paper: GeneratedQuestionPaper
): Promise<StudyResource> => {
  try {
    // Convert the generated paper to a study resource
    const resource: StudyResource = {
      id: '',
      title: paper.title,
      subject: paper.subject,
      class: paper.class,
      type: 'sample-paper',
      downloadUrl: paper.pdf_url || '',
      year: new Date().getFullYear().toString(),
      topic_tags: [`CBSE Sample Paper`, `Class ${paper.class}`, paper.subject],
      language: 'English',
      uploaded_by: paper.created_by,
      source_url: paper.pdf_url || '',
      last_verified: new Date(),
      ncert_chapters: [], // Would be populated based on blueprint
      cbse_syllabus_entries: [], // Would be populated based on blueprint
      version: paper.version,
      is_verified: true,
      created_at: paper.created_at,
      updated_at: paper.updated_at,
      broken_report_count: 0
    };

    // Add to study_resources collection
    const docRef = await addDoc(collection(db, 'study_resources'), resource);
    resource.id = docRef.id;

    return resource;
  } catch (error) {
    throw new Error(`Failed to store generated paper as resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get study resources for question papers
 * @param classValue Class filter
 * @param subject Subject filter
 * @returns Promise with question paper resources
 */
export const getQuestionPaperResources = async (
  classValue?: string,
  subject?: string
): Promise<StudyResource[]> => {
  try {
    let q: any = query(
      collection(db, 'study_resources'),
      where('type', '==', 'sample-paper')
    );
    
    if (classValue && classValue !== 'all') {
      q = query(q, where('class', '==', classValue));
    }
    
    if (subject && subject !== 'all') {
      q = query(q, where('subject', '==', subject));
    }
    
    // Order by creation date, newest first
    q = query(q, orderBy('created_at', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const resources: StudyResource[] = [];
    
    querySnapshot.forEach((doc) => {
      resources.push({
        id: doc.id,
        ...(doc.data() as any)
      } as StudyResource);
    });
    
    return resources;
  } catch (error) {
    throw new Error(`Failed to fetch question paper resources: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update a study resource
 * @param resourceId Resource ID
 * @param updates Updates to apply
 * @returns Promise indicating success
 */
export const updateStudyResource = async (
  resourceId: string,
  updates: Partial<StudyResource>
): Promise<void> => {
  try {
    const resourceRef = doc(db, 'study_resources', resourceId);
    await updateDoc(resourceRef, updates);
  } catch (error) {
    throw new Error(`Failed to update study resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a study resource
 * @param resourceId Resource ID
 * @returns Promise indicating success
 */
export const deleteStudyResource = async (
  resourceId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'study_resources', resourceId));
  } catch (error) {
    throw new Error(`Failed to delete study resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Store a question paper blueprint
 * @param blueprint The blueprint to store
 * @returns Promise with the stored blueprint
 */
export const storeBlueprint = async (
  blueprint: Omit<QuestionPaperBlueprint, 'id' | 'created_at' | 'updated_at'>
): Promise<QuestionPaperBlueprint> => {
  try {
    const newBlueprint: QuestionPaperBlueprint = {
      ...blueprint,
      id: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const docRef = await addDoc(collection(db, 'question_paper_blueprints'), newBlueprint);
    newBlueprint.id = docRef.id;

    return newBlueprint;
  } catch (error) {
    throw new Error(`Failed to store blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get blueprints with filters
 * @param classValue Class filter
 * @param subject Subject filter
 * @returns Promise with blueprints
 */
export const getBlueprints = async (
  classValue?: string,
  subject?: string
): Promise<QuestionPaperBlueprint[]> => {
  try {
    let q: any = collection(db, 'question_paper_blueprints');
    
    if (classValue && classValue !== 'all') {
      q = query(q, where('class', '==', classValue));
    }
    
    if (subject && subject !== 'all') {
      q = query(q, where('subject', '==', subject));
    }
    
    // Only get active blueprints
    q = query(q, where('is_active', '==', true));
    
    // Order by creation date, newest first
    q = query(q, orderBy('created_at', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const blueprints: QuestionPaperBlueprint[] = [];
    
    querySnapshot.forEach((doc) => {
      blueprints.push({
        id: doc.id,
        ...(doc.data() as any)
      } as QuestionPaperBlueprint);
    });
    
    return blueprints;
  } catch (error) {
    throw new Error(`Failed to fetch blueprints: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update a blueprint
 * @param blueprintId Blueprint ID
 * @param updates Updates to apply
 * @returns Promise indicating success
 */
export const updateBlueprint = async (
  blueprintId: string,
  updates: Partial<QuestionPaperBlueprint>
): Promise<void> => {
  try {
    const blueprintRef = doc(db, 'question_paper_blueprints', blueprintId);
    await updateDoc(blueprintRef, {
      ...updates,
      updated_at: new Date()
    });
  } catch (error) {
    throw new Error(`Failed to update blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a blueprint
 * @param blueprintId Blueprint ID
 * @returns Promise indicating success
 */
export const deleteBlueprint = async (
  blueprintId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'question_paper_blueprints', blueprintId));
  } catch (error) {
    throw new Error(`Failed to delete blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  storeGeneratedPaperAsResource,
  getQuestionPaperResources,
  updateStudyResource,
  deleteStudyResource,
  storeBlueprint,
  getBlueprints,
  updateBlueprint,
  deleteBlueprint
};