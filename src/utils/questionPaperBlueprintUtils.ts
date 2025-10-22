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
  deleteDoc
} from 'firebase/firestore';
import { 
  QuestionPaperBlueprint, 
  QuestionPaperSection, 
  QuestionType, 
  GeneratedQuestionPaper,
  Question,
  MarkingScheme,
  Solution
} from '../types';

/**
 * Create a new question paper blueprint
 * @param blueprint The blueprint data
 * @returns Promise with the created blueprint
 */
export const createBlueprint = async (
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
    throw new Error(`Failed to create blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get all blueprints for a class and subject
 * @param classValue The class (9, 10, 11, 12)
 * @param subject The subject
 * @returns Promise with blueprints
 */
export const getBlueprintsByClassAndSubject = async (
  classValue: string,
  subject: string
): Promise<QuestionPaperBlueprint[]> => {
  try {
    const q = query(
      collection(db, 'question_paper_blueprints'),
      where('class', '==', classValue),
      where('subject', '==', subject),
      where('is_active', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const blueprints: QuestionPaperBlueprint[] = [];

    querySnapshot.forEach((doc) => {
      blueprints.push({
        id: doc.id,
        ...doc.data()
      } as QuestionPaperBlueprint);
    });

    return blueprints;
  } catch (error) {
    throw new Error(`Failed to fetch blueprints: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a specific blueprint by ID
 * @param blueprintId The blueprint ID
 * @returns Promise with the blueprint
 */
export const getBlueprintById = async (
  blueprintId: string
): Promise<QuestionPaperBlueprint | null> => {
  try {
    const docRef = doc(db, 'question_paper_blueprints', blueprintId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as QuestionPaperBlueprint;
    }

    return null;
  } catch (error) {
    throw new Error(`Failed to fetch blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update a blueprint
 * @param blueprintId The blueprint ID
 * @param updates The updates to apply
 * @returns Promise indicating success
 */
export const updateBlueprint = async (
  blueprintId: string,
  updates: Partial<QuestionPaperBlueprint>
): Promise<void> => {
  try {
    const docRef = doc(db, 'question_paper_blueprints', blueprintId);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date()
    });
  } catch (error) {
    throw new Error(`Failed to update blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a blueprint
 * @param blueprintId The blueprint ID
 * @returns Promise indicating success
 */
export const deleteBlueprint = async (blueprintId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'question_paper_blueprints', blueprintId));
  } catch (error) {
    throw new Error(`Failed to delete blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate a question paper based on a blueprint
 * @param blueprint The blueprint to use
 * @param variant The variant number (1, 2, 3, etc.)
 * @param createdBy The user creating the paper
 * @returns Promise with the generated question paper
 */
export const generateQuestionPaper = async (
  blueprint: QuestionPaperBlueprint,
  variant: number,
  createdBy: string
): Promise<GeneratedQuestionPaper> => {
  try {
    // In a real implementation, this would:
    // 1. Pull questions from an internal question bank
    // 2. Generate new questions using AI where needed
    // 3. Apply randomization for variants
    // 4. Create marking schemes and solutions
    
    // For now, we'll create a mock question paper
    const questions: Question[] = [];
    const markingScheme: MarkingScheme = {};
    const solutions: Solution[] = [];
    
    // Generate mock questions based on blueprint sections
    blueprint.sections.forEach((section, sectionIndex) => {
      section.question_types.forEach((questionType, typeIndex) => {
        for (let i = 0; i < questionType.count; i++) {
          const questionId = `q-${sectionIndex}-${typeIndex}-${i}`;
          const question: Question = {
            id: questionId,
            section: section.name,
            question_type: questionType.type,
            text: `Sample ${questionType.type} question for ${blueprint.subject} (Variant ${variant})`,
            options: questionType.type === 'MCQ' ? [
              'Option A',
              'Option B', 
              'Option C',
              'Option D'
            ] : undefined,
            correct_answer: questionType.type === 'MCQ' ? 'Option A' : 'Sample answer',
            marks: questionType.marks_per_question,
            difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
            ncert_chapters: [`Chapter ${sectionIndex + 1}`],
            topic_tags: [`Topic ${sectionIndex + 1}.${typeIndex + 1}`],
            bloom_level: i % 6 === 0 ? 'remember' : 
                        i % 6 === 1 ? 'understand' : 
                        i % 6 === 2 ? 'apply' : 
                        i % 6 === 3 ? 'analyze' : 
                        i % 6 === 4 ? 'evaluate' : 'create',
            estimated_time: questionType.marks_per_question * 2, // 2 minutes per mark
            hint: 'Hint for the question'
          };
          
          questions.push(question);
          
          // Create marking scheme
          markingScheme[questionId] = {
            marks: questionType.marks_per_question,
            marking_points: [
              'Point 1',
              'Point 2',
              'Point 3'
            ]
          };
          
          // Create solution
          solutions.push({
            questionId: questionId,
            detailed_solution: `Detailed solution for question ${questionId}`,
            steps: [
              'Step 1',
              'Step 2',
              'Step 3'
            ],
            marking_points: [
              'Point 1',
              'Point 2',
              'Point 3'
            ]
          });
        }
      });
    });
    
    const generatedPaper: GeneratedQuestionPaper = {
      id: '',
      blueprint_id: blueprint.id,
      class: blueprint.class,
      subject: blueprint.subject,
      title: `${blueprint.title} - Variant ${variant}`,
      variant: variant,
      questions: questions,
      marking_scheme: markingScheme,
      solutions: solutions,
      is_approved: false,
      created_by: createdBy,
      created_at: new Date(),
      updated_at: new Date(),
      version: 1
    };

    const docRef = await addDoc(collection(db, 'generated_question_papers'), generatedPaper);
    generatedPaper.id = docRef.id;

    return generatedPaper;
  } catch (error) {
    throw new Error(`Failed to generate question paper: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get generated papers by blueprint
 * @param blueprintId The blueprint ID
 * @returns Promise with generated papers
 */
export const getGeneratedPapersByBlueprint = async (
  blueprintId: string
): Promise<GeneratedQuestionPaper[]> => {
  try {
    const q = query(
      collection(db, 'generated_question_papers'),
      where('blueprint_id', '==', blueprintId)
    );

    const querySnapshot = await getDocs(q);
    const papers: GeneratedQuestionPaper[] = [];

    querySnapshot.forEach((doc) => {
      papers.push({
        id: doc.id,
        ...doc.data()
      } as GeneratedQuestionPaper);
    });

    return papers;
  } catch (error) {
    throw new Error(`Failed to fetch generated papers: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Approve a generated question paper
 * @param paperId The paper ID
 * @param approvedBy The user approving the paper
 * @returns Promise indicating success
 */
export const approveQuestionPaper = async (
  paperId: string,
  approvedBy: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'generated_question_papers', paperId);
    await updateDoc(docRef, {
      is_approved: true,
      approved_by: approvedBy,
      approved_at: new Date(),
      updated_at: new Date()
    });
  } catch (error) {
    throw new Error(`Failed to approve question paper: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get papers pending approval for a teacher
 * @param teacherId The teacher ID
 * @returns Promise with papers pending approval
 */
export const getPapersPendingApproval = async (
  teacherId: string
): Promise<GeneratedQuestionPaper[]> => {
  try {
    // In a real implementation, you would filter by subject assigned to the teacher
    const q = query(
      collection(db, 'generated_question_papers'),
      where('is_approved', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const papers: GeneratedQuestionPaper[] = [];

    querySnapshot.forEach((doc) => {
      papers.push({
        id: doc.id,
        ...doc.data()
      } as GeneratedQuestionPaper);
    });

    return papers;
  } catch (error) {
    throw new Error(`Failed to fetch papers pending approval: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  createBlueprint,
  getBlueprintsByClassAndSubject,
  getBlueprintById,
  updateBlueprint,
  deleteBlueprint,
  generateQuestionPaper,
  getGeneratedPapersByBlueprint,
  approveQuestionPaper,
  getPapersPendingApproval
};