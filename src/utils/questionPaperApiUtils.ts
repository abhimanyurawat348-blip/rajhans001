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
  QuestionPaperBlueprint, 
  GeneratedQuestionPaper,
  PaperGenerationRequest,
  PaperReviewQueueItem,
  StudyResource
} from '../types';
import { 
  createBlueprint as createBlueprintUtil,
  getBlueprintsByClassAndSubject,
  generateQuestionPaper,
  approveQuestionPaper,
  getPapersPendingApproval
} from './questionPaperBlueprintUtils';

/**
 * API function to get study resources with filters
 * @param classValue Class filter
 * @param subject Subject filter
 * @param type Resource type filter
 * @returns Promise with filtered resources
 */
export const getStudyResources = async (
  classValue?: string,
  subject?: string,
  type?: string
): Promise<StudyResource[]> => {
  try {
    let q: any = collection(db, 'study_resources');
    
    if (classValue && classValue !== 'all') {
      q = query(q, where('class', '==', classValue));
    }
    
    if (subject && subject !== 'all') {
      q = query(q, where('subject', '==', subject));
    }
    
    if (type && type !== 'all') {
      q = query(q, where('type', '==', type));
    }
    
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
    throw new Error(`Failed to fetch study resources: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * API function to request question paper generation
 * @param request Generation request data
 * @returns Promise with the created request
 */
export const requestPaperGeneration = async (
  request: Omit<PaperGenerationRequest, 'id' | 'requested_at' | 'status'>
): Promise<PaperGenerationRequest> => {
  try {
    const generationRequest: PaperGenerationRequest = {
      ...request,
      id: '',
      requested_at: new Date(),
      status: 'pending'
    };

    const docRef = await addDoc(collection(db, 'paper_generation_requests'), generationRequest);
    generationRequest.id = docRef.id;

    return generationRequest;
  } catch (error) {
    throw new Error(`Failed to request paper generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * API function to process paper generation requests
 * This would typically run as a background function
 * @returns Promise with processing results
 */
export const processPaperGenerationRequests = async (): Promise<{
  processedCount: number;
  successCount: number;
  errorCount: number;
}> => {
  try {
    // Find pending requests
    const q = query(
      collection(db, 'paper_generation_requests'),
      where('status', '==', 'pending'),
      limit(10) // Process max 10 at a time
    );

    const querySnapshot = await getDocs(q);
    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const doc of querySnapshot.docs) {
      try {
        const request = {
          id: doc.id,
          ...doc.data()
        } as PaperGenerationRequest;

        // Update status to processing
        const requestRef = doc.ref;
        await updateDoc(requestRef, {
          status: 'processing',
          completion_at: new Date()
        });

        // Get blueprint
        const blueprint = await getBlueprintsByClassAndSubject(request.class, request.subject);
        if (blueprint.length === 0) {
          throw new Error(`No blueprint found for class ${request.class} subject ${request.subject}`);
        }

        const selectedBlueprint = blueprint[0];
        const generatedPaperIds: string[] = [];

        // Generate papers
        for (let i = 0; i < request.number_of_papers; i++) {
          for (let variant = 1; variant <= request.number_of_variants; variant++) {
            const paper = await generateQuestionPaper(selectedBlueprint, variant, request.requested_by);
            generatedPaperIds.push(paper.id);
          }
        }

        // Update request status to completed
        await updateDoc(requestRef, {
          status: 'completed',
          completion_at: new Date(),
          generated_paper_ids: generatedPaperIds
        });

        processedCount++;
        successCount++;
      } catch (error) {
        // Update request status to failed
        const requestRef = doc.ref;
        await updateDoc(requestRef, {
          status: 'failed',
          completion_at: new Date(),
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });

        processedCount++;
        errorCount++;
      }
    }

    return {
      processedCount,
      successCount,
      errorCount
    };
  } catch (error) {
    throw new Error(`Failed to process paper generation requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * API function to get generated papers with filters
 * @param classValue Class filter
 * @param subject Subject filter
 * @param approved Approval status filter
 * @returns Promise with filtered papers
 */
export const getGeneratedPapers = async (
  classValue?: string,
  subject?: string,
  approved?: boolean
): Promise<GeneratedQuestionPaper[]> => {
  try {
    let q: any = collection(db, 'generated_question_papers');
    
    if (classValue && classValue !== 'all') {
      q = query(q, where('class', '==', classValue));
    }
    
    if (subject && subject !== 'all') {
      q = query(q, where('subject', '==', subject));
    }
    
    if (approved !== undefined) {
      q = query(q, where('is_approved', '==', approved));
    }
    
    // Order by creation date, newest first
    q = query(q, orderBy('created_at', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const papers: GeneratedQuestionPaper[] = [];
    
    querySnapshot.forEach((doc) => {
      papers.push({
        id: doc.id,
        ...(doc.data() as any)
      } as GeneratedQuestionPaper);
    });
    
    return papers;
  } catch (error) {
    throw new Error(`Failed to fetch generated papers: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * API function to get paper variants
 * @param paperId Base paper ID
 * @returns Promise with paper variants
 */
export const getPaperVariants = async (
  paperId: string
): Promise<GeneratedQuestionPaper[]> => {
  try {
    // Get the base paper to determine blueprint and variant info
    const paperRef = doc(db, 'generated_question_papers', paperId);
    const paperSnap = await getDoc(paperRef);
    
    if (!paperSnap.exists()) {
      throw new Error('Paper not found');
    }
    
    const basePaper = {
      id: paperSnap.id,
      ...paperSnap.data()
    } as GeneratedQuestionPaper;
    
    // Find all papers with the same blueprint
    const q = query(
      collection(db, 'generated_question_papers'),
      where('blueprint_id', '==', basePaper.blueprint_id),
      orderBy('variant')
    );
    
    const querySnapshot = await getDocs(q);
    const variants: GeneratedQuestionPaper[] = [];
    
    querySnapshot.forEach((doc) => {
      variants.push({
        id: doc.id,
        ...(doc.data() as any)
      } as GeneratedQuestionPaper);
    });
    
    return variants;
  } catch (error) {
    throw new Error(`Failed to fetch paper variants: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * API function to approve a question paper
 * @param paperId Paper ID
 * @param approvedBy User ID of approver
 * @returns Promise indicating success
 */
export const approveGeneratedPaper = async (
  paperId: string,
  approvedBy: string
): Promise<void> => {
  try {
    await approveQuestionPaper(paperId, approvedBy);
  } catch (error) {
    throw new Error(`Failed to approve paper: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * API function to add a paper to the review queue
 * @param paperId Paper ID
 * @param submittedBy User ID of submitter
 * @returns Promise with the created queue item
 */
export const addToReviewQueue = async (
  paperId: string,
  submittedBy: string
): Promise<PaperReviewQueueItem> => {
  try {
    // Get the paper details
    const paperRef = doc(db, 'generated_question_papers', paperId);
    const paperSnap = await getDoc(paperRef);
    
    if (!paperSnap.exists()) {
      throw new Error('Paper not found');
    }
    
    const paper = {
      id: paperSnap.id,
      ...paperSnap.data()
    } as GeneratedQuestionPaper;
    
    // Create queue item
    const queueItem: PaperReviewQueueItem = {
      id: '',
      paper_id: paperId,
      class: paper.class,
      subject: paper.subject,
      title: paper.title,
      variant: paper.variant,
      submitted_by: submittedBy,
      submitted_at: new Date(),
      status: 'pending'
    };

    const docRef = await addDoc(collection(db, 'paper_review_queue'), queueItem);
    queueItem.id = docRef.id;

    return queueItem;
  } catch (error) {
    throw new Error(`Failed to add paper to review queue: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * API function to get papers in review queue for a teacher
 * @param teacherId Teacher ID
 * @returns Promise with papers in review queue
 */
export const getPapersInReviewQueue = async (
  teacherId: string
): Promise<PaperReviewQueueItem[]> => {
  try {
    // In a real implementation, you would filter by subject assigned to the teacher
    const q = query(
      collection(db, 'paper_review_queue'),
      where('status', '==', 'pending'),
      orderBy('submitted_at', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const queueItems: PaperReviewQueueItem[] = [];

    querySnapshot.forEach((doc) => {
      queueItems.push({
        id: doc.id,
        ...(doc.data() as any)
      } as PaperReviewQueueItem);
    });

    return queueItems;
  } catch (error) {
    throw new Error(`Failed to fetch review queue: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  getStudyResources,
  requestPaperGeneration,
  processPaperGenerationRequests,
  getGeneratedPapers,
  getPaperVariants,
  approveGeneratedPaper,
  addToReviewQueue,
  getPapersInReviewQueue
};