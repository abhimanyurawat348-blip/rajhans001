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
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { GeneratedQuestionPaper } from '../types';

/**
 * Track when a question paper is downloaded
 * @param paperId The paper ID
 * @param userId The user ID
 * @param userType The user type (student, parent, teacher)
 * @returns Promise indicating success
 */
export const trackPaperDownload = async (
  paperId: string,
  userId: string,
  userType: 'student' | 'parent' | 'teacher'
): Promise<void> => {
  try {
    await addDoc(collection(db, 'paper_download_logs'), {
      paper_id: paperId,
      user_id: userId,
      user_type: userType,
      downloaded_at: new Date(),
      action: 'download'
    });
  } catch (error) {
    console.error('Failed to track paper download:', error);
  }
};

/**
 * Track when a question paper is previewed
 * @param paperId The paper ID
 * @param userId The user ID
 * @param userType The user type (student, parent, teacher)
 * @returns Promise indicating success
 */
export const trackPaperPreview = async (
  paperId: string,
  userId: string,
  userType: 'student' | 'parent' | 'teacher'
): Promise<void> => {
  try {
    await addDoc(collection(db, 'paper_preview_logs'), {
      paper_id: paperId,
      user_id: userId,
      user_type: userType,
      previewed_at: new Date(),
      action: 'preview'
    });
  } catch (error) {
    console.error('Failed to track paper preview:', error);
  }
};

/**
 * Track student performance on a question paper
 * @param paperId The paper ID
 * @param studentId The student ID
 * @param score The score achieved
 * @param maxScore The maximum possible score
 * @returns Promise indicating success
 */
export const trackStudentPerformance = async (
  paperId: string,
  studentId: string,
  score: number,
  maxScore: number
): Promise<void> => {
  try {
    const percentage = Math.round((score / maxScore) * 100);
    
    await addDoc(collection(db, 'paper_performance_logs'), {
      paper_id: paperId,
      student_id: studentId,
      score: score,
      max_score: maxScore,
      percentage: percentage,
      recorded_at: new Date()
    });
  } catch (error) {
    console.error('Failed to track student performance:', error);
  }
};

/**
 * Get download statistics for a paper
 * @param paperId The paper ID
 * @returns Promise with download statistics
 */
export const getPaperDownloadStats = async (
  paperId: string
): Promise<{
  totalDownloads: number;
  downloadsByUserType: {
    student: number;
    parent: number;
    teacher: number;
  };
  lastDownloaded: Date | null;
}> => {
  try {
    const q = query(
      collection(db, 'paper_download_logs'),
      where('paper_id', '==', paperId)
    );
    
    const querySnapshot = await getDocs(q);
    let totalDownloads = 0;
    const downloadsByUserType = {
      student: 0,
      parent: 0,
      teacher: 0
    };
    let lastDownloaded: Date | null = null;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalDownloads++;
      downloadsByUserType[data.user_type as keyof typeof downloadsByUserType]++;
      
      if (data.downloaded_at && (!lastDownloaded || data.downloaded_at > lastDownloaded)) {
        lastDownloaded = data.downloaded_at.toDate ? data.downloaded_at.toDate() : data.downloaded_at;
      }
    });
    
    return {
      totalDownloads,
      downloadsByUserType,
      lastDownloaded
    };
  } catch (error) {
    throw new Error(`Failed to get paper download stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get performance statistics for a paper
 * @param paperId The paper ID
 * @returns Promise with performance statistics
 */
export const getPaperPerformanceStats = async (
  paperId: string
): Promise<{
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  scoreDistribution: {
    '0-20': number;
    '21-40': number;
    '41-60': number;
    '61-80': number;
    '81-100': number;
  };
}> => {
  try {
    const q = query(
      collection(db, 'paper_performance_logs'),
      where('paper_id', '==', paperId)
    );
    
    const querySnapshot = await getDocs(q);
    let totalAttempts = 0;
    let totalScore = 0;
    let highestScore = 0;
    let lowestScore = 100;
    const scoreDistribution = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0
    };
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalAttempts++;
      totalScore += data.percentage;
      
      if (data.percentage > highestScore) highestScore = data.percentage;
      if (data.percentage < lowestScore) lowestScore = data.percentage;
      
      if (data.percentage <= 20) scoreDistribution['0-20']++;
      else if (data.percentage <= 40) scoreDistribution['21-40']++;
      else if (data.percentage <= 60) scoreDistribution['41-60']++;
      else if (data.percentage <= 80) scoreDistribution['61-80']++;
      else scoreDistribution['81-100']++;
    });
    
    const averageScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;
    
    // Handle edge case where no attempts were made
    if (totalAttempts === 0) {
      lowestScore = 0;
    }
    
    return {
      totalAttempts,
      averageScore,
      highestScore,
      lowestScore,
      scoreDistribution
    };
  } catch (error) {
    throw new Error(`Failed to get paper performance stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get usage analytics for all papers
 * @returns Promise with usage analytics
 */
export const getUsageAnalytics = async (): Promise<{
  totalPapers: number;
  totalDownloads: number;
  totalPreviews: number;
  mostDownloadedPaper: {
    paperId: string;
    title: string;
    downloads: number;
  } | null;
  mostPerformedPaper: {
    paperId: string;
    title: string;
    averageScore: number;
  } | null;
}> => {
  try {
    // Get all papers
    const papersSnapshot = await getDocs(collection(db, 'generated_question_papers'));
    const papers: GeneratedQuestionPaper[] = [];
    
    papersSnapshot.forEach((doc) => {
      papers.push({
        id: doc.id,
        ...(doc.data() as any)
      } as GeneratedQuestionPaper);
    });
    
    // Get download stats for all papers
    const downloadStats: { [key: string]: number } = {};
    let totalDownloads = 0;
    
    for (const paper of papers) {
      const stats = await getPaperDownloadStats(paper.id);
      downloadStats[paper.id] = stats.totalDownloads;
      totalDownloads += stats.totalDownloads;
    }
    
    // Get performance stats for all papers
    const performanceStats: { [key: string]: number } = {};
    let totalAttempts = 0;
    
    for (const paper of papers) {
      const stats = await getPaperPerformanceStats(paper.id);
      performanceStats[paper.id] = stats.averageScore;
      totalAttempts += stats.totalAttempts;
    }
    
    // Find most downloaded paper
    let mostDownloadedPaper = null;
    let maxDownloads = 0;
    
    for (const [paperId, downloads] of Object.entries(downloadStats)) {
      if (downloads > maxDownloads) {
        maxDownloads = downloads;
        const paper = papers.find(p => p.id === paperId);
        if (paper) {
          mostDownloadedPaper = {
            paperId,
            title: paper.title,
            downloads
          };
        }
      }
    }
    
    // Find most performed paper (highest average score)
    let mostPerformedPaper = null;
    let maxAverageScore = 0;
    
    for (const [paperId, averageScore] of Object.entries(performanceStats)) {
      if (averageScore > maxAverageScore) {
        maxAverageScore = averageScore;
        const paper = papers.find(p => p.id === paperId);
        if (paper) {
          mostPerformedPaper = {
            paperId,
            title: paper.title,
            averageScore
          };
        }
      }
    }
    
    return {
      totalPapers: papers.length,
      totalDownloads,
      totalPreviews: 0, // Would need to implement preview tracking
      mostDownloadedPaper,
      mostPerformedPaper
    };
  } catch (error) {
    throw new Error(`Failed to get usage analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Send feedback on a question paper
 * @param paperId The paper ID
 * @param userId The user ID
 * @param rating The rating (1-5)
 * @param feedback The feedback text
 * @returns Promise indicating success
 */
export const sendPaperFeedback = async (
  paperId: string,
  userId: string,
  rating: number,
  feedback: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'paper_feedback'), {
      paper_id: paperId,
      user_id: userId,
      rating: rating,
      feedback: feedback,
      submitted_at: new Date()
    });
  } catch (error) {
    throw new Error(`Failed to send paper feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get feedback for a paper
 * @param paperId The paper ID
 * @returns Promise with feedback
 */
export const getPaperFeedback = async (
  paperId: string
): Promise<{
  averageRating: number;
  totalFeedback: number;
  feedbackItems: {
    userId: string;
    rating: number;
    feedback: string;
    submittedAt: Date;
  }[];
}> => {
  try {
    const q = query(
      collection(db, 'paper_feedback'),
      where('paper_id', '==', paperId),
      orderBy('submitted_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    let totalRating = 0;
    const feedbackItems: {
      userId: string;
      rating: number;
      feedback: string;
      submittedAt: Date;
    }[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalRating += data.rating;
      feedbackItems.push({
        userId: data.user_id,
        rating: data.rating,
        feedback: data.feedback,
        submittedAt: data.submitted_at.toDate ? data.submitted_at.toDate() : data.submitted_at
      });
    });
    
    const averageRating = feedbackItems.length > 0 ? totalRating / feedbackItems.length : 0;
    
    return {
      averageRating,
      totalFeedback: feedbackItems.length,
      feedbackItems
    };
  } catch (error) {
    throw new Error(`Failed to get paper feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  trackPaperDownload,
  trackPaperPreview,
  trackStudentPerformance,
  getPaperDownloadStats,
  getPaperPerformanceStats,
  getUsageAnalytics,
  sendPaperFeedback,
  getPaperFeedback
};