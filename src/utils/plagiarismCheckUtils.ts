import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { PlagiarismCheckResult, StudyResource } from '../types';

/**
 * Calculate similarity score between two texts
 * @param text1 First text
 * @param text2 Second text
 * @returns Similarity score (0-100)
 */
export const calculateSimilarity = (text1: string, text2: string): number => {
  // This is a simplified implementation
  // In a real system, you would use more sophisticated algorithms
  
  // Convert to lowercase and remove whitespace
  const clean1 = text1.toLowerCase().replace(/\s+/g, '');
  const clean2 = text2.toLowerCase().replace(/\s+/g, '');
  
  // Simple character-level similarity
  if (clean1 === clean2) return 100;
  
  // Calculate Jaccard similarity for character sets
  const set1 = new Set(clean1);
  const set2 = new Set(clean2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  if (union.size === 0) return 0;
  
  const jaccardSimilarity = (intersection.size / union.size) * 100;
  
  // Also check for substring matches
  const substringSimilarity = Math.max(
    (clean1.includes(clean2) ? clean2.length / clean1.length : 0) * 100,
    (clean2.includes(clean1) ? clean1.length / clean2.length : 0) * 100
  );
  
  // Return the higher of the two
  return Math.max(jaccardSimilarity, substringSimilarity);
};

/**
 * Check a resource for plagiarism against internal repository
 * @param resourceId The ID of the resource to check
 * @param resourceText The text content of the resource
 * @returns Promise with plagiarism check result
 */
export const checkPlagiarism = async (
  resourceId: string,
  resourceText: string
): Promise<PlagiarismCheckResult> => {
  try {
    // Fetch other resources from the same class/subject for comparison
    const q = query(
      collection(db, 'study_resources'),
      where('id', '!=', resourceId)
    );
    
    const querySnapshot = await getDocs(q);
    const similarResources: { resource_id: string; similarity_percentage: number }[] = [];
    
    // Check similarity with each resource
    for (const doc of querySnapshot.docs) {
      const resource = doc.data() as StudyResource;
      // In a real implementation, you would have the full text content
      // For now, we'll use the title for demonstration
      const similarity = calculateSimilarity(resourceText, resource.title);
      
      if (similarity > 70) { // Threshold for flagging
        similarResources.push({
          resource_id: doc.id,
          similarity_percentage: similarity
        });
      }
    }
    
    // Calculate overall similarity score
    const averageSimilarity = similarResources.length > 0
      ? similarResources.reduce((sum, item) => sum + item.similarity_percentage, 0) / similarResources.length
      : 0;
    
    const plagiarismResult: PlagiarismCheckResult = {
      id: `plagiarism-${Date.now()}`,
      resource_id: resourceId,
      checked_at: new Date(),
      similarity_score: Math.round(averageSimilarity),
      similar_resources: similarResources,
      flagged_for_review: averageSimilarity > 50, // Flag if average similarity is high
      checked_by: 'system'
    };
    
    // Add to Firestore
    await addDoc(collection(db, 'plagiarism_checks'), plagiarismResult);
    
    return plagiarismResult;
  } catch (error) {
    throw new Error(`Failed to check plagiarism: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get plagiarism check results for a resource
 * @param resourceId The ID of the resource
 * @returns Promise with plagiarism check results
 */
export const getResourcePlagiarismChecks = async (
  resourceId: string
): Promise<PlagiarismCheckResult[]> => {
  try {
    const q = query(
      collection(db, 'plagiarism_checks'),
      where('resource_id', '==', resourceId)
    );
    
    const querySnapshot = await getDocs(q);
    const results: PlagiarismCheckResult[] = [];
    
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data()
      } as PlagiarismCheckResult);
    });
    
    return results;
  } catch (error) {
    throw new Error(`Failed to fetch plagiarism checks: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  calculateSimilarity,
  checkPlagiarism,
  getResourcePlagiarismChecks
};