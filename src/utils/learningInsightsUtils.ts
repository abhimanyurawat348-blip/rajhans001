import { collection, query, where, getDocs, orderBy, limit, doc, getDoc, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

// Types for our learning insights data
export interface SubjectPerformance {
  subject: string;
  currentScore: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  consistencyIndex: number; // New: Variance in last 5 scores
  learningVelocity: number; // New: Rate of score improvement
}

export interface LearningRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  subject: string;
  action: string;
  type: 'weakness' | 'improvement' | 'maintenance' | 'motivation';
}

export interface StudyPattern {
  day: string;
  hours: number;
}

export interface PerformancePrediction {
  week: string;
  predictedScore: number;
  confidence: number;
  explanation: string; // New: Explanation for the prediction
}

export interface SubjectDistributionItem {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

// New: Interface for learning insights storage
export interface LearningInsights {
  studentId: string;
  subject: string;
  avgScore: number;
  improvementRate: number;
  predictedNextScore: [number, number]; // [min, max]
  weakTopics: string[];
  recommendations: LearningRecommendation[];
  lastUpdated: Date;
  consistencyIndex: number;
  learningVelocity: number;
}

// New: Interface for visualization data cache
export interface InsightsCache {
  studentId: string;
  overallPerformance: number;
  subjectPerformance: SubjectPerformance[];
  studyPatterns: StudyPattern[];
  performancePredictions: PerformancePrediction[];
  subjectDistribution: SubjectDistributionItem[];
  attendanceData?: {
    percentage: number;
    total: number;
    present: number;
  };
  lastCached: Date;
}

// Fetch student's academic performance data
export const fetchStudentPerformance = async (studentId: string) => {
  try {
    // Fetch marks data from student's subcollection
    const marksQuery = query(
      collection(db, 'students', studentId, 'marks'),
      orderBy('uploadedAt', 'desc')
    );
    
    const marksSnapshot = await getDocs(marksQuery);
    const marksData: any[] = [];
    
    marksSnapshot.forEach((doc) => {
      marksData.push({ id: doc.id, ...doc.data() });
    });
    
    return marksData;
  } catch (error) {
    console.error('Error fetching student performance data:', error);
    return [];
  }
};

// Fetch student's homework data
export const fetchStudentHomework = async (studentId: string) => {
  try {
    const homeworkQuery = query(
      collection(db, 'homework'),
      where('studentId', '==', studentId),
      orderBy('dueDate', 'desc')
    );
    
    const homeworkSnapshot = await getDocs(homeworkQuery);
    const homeworkData: any[] = [];
    
    homeworkSnapshot.forEach((doc) => {
      homeworkData.push({ id: doc.id, ...doc.data() });
    });
    
    return homeworkData;
  } catch (error) {
    console.error('Error fetching student homework data:', error);
    return [];
  }
};

// Fetch student's attendance data
export const fetchStudentAttendance = async (studentId: string) => {
  try {
    // Try to get attendance from student's document
    const studentDoc = await getDoc(doc(db, 'students', studentId));
    
    if (studentDoc.exists()) {
      const data = studentDoc.data();
      return {
        id: studentDoc.id,
        ...data,
        attendance: data.attendance || {}
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching student attendance data:', error);
    return null;
  }
};

// New: Calculate consistency index (variance in last 5 scores)
export const calculateConsistencyIndex = (scores: number[]): number => {
  if (scores.length < 2) return 0;
  
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
  
  // Return consistency as inverse of variance (higher = more consistent)
  return Math.round((100 - variance) * 100) / 100;
};

// New: Calculate learning velocity (rate of improvement)
export const calculateLearningVelocity = (scores: number[], dates: Date[]): number => {
  if (scores.length < 2) return 0;
  
  // Calculate slope of scores over time
  const n = scores.length;
  let sumXY = 0, sumX = 0, sumY = 0, sumXX = 0;
  
  for (let i = 0; i < n; i++) {
    const x = dates[i].getTime(); // Time in milliseconds
    const y = scores[i];
    sumXY += x * y;
    sumX += x;
    sumY += y;
    sumXX += x * x;
  }
  
  // Calculate slope (learning velocity)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  // Convert to points per day
  const velocity = slope * 24 * 60 * 60 * 1000; // Points per day
  
  return Math.round(velocity * 100) / 100;
};

// New: Identify weak topics based on recurring low scores
export const identifyWeakTopics = (marksData: any[]): string[] => {
  const topicScores: { [topic: string]: number[] } = {};
  
  marksData.forEach(mark => {
    // Assuming marks data has topic information
    if (mark.topic) {
      if (!topicScores[mark.topic]) {
        topicScores[mark.topic] = [];
      }
      topicScores[mark.topic].push(mark.marks || mark.score || 0);
    }
  });
  
  // Find topics with consistently low scores (< 70%)
  const weakTopics: string[] = [];
  Object.entries(topicScores).forEach(([topic, scores]) => {
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    if (avgScore < 70) {
      weakTopics.push(topic);
    }
  });
  
  return weakTopics;
};

// Generate subject performance data from marks
export const generateSubjectPerformance = (marksData: any[]): SubjectPerformance[] => {
  // Group marks by subject
  const subjectMarks: { [key: string]: any[] } = {};
  
  marksData.forEach((mark) => {
    const subject = mark.subject || 'Unknown';
    if (!subjectMarks[subject]) {
      subjectMarks[subject] = [];
    }
    subjectMarks[subject].push(mark);
  });
  
  // Calculate performance for each subject
  const performanceData: SubjectPerformance[] = [];
  
  Object.keys(subjectMarks).forEach((subject) => {
    const marks = subjectMarks[subject];
    
    // Get recent scores (last 5)
    const recentScores = marks.slice(0, 5).map(mark => {
      // Handle different mark formats
      if (mark.marks !== undefined) return mark.marks;
      if (mark.score !== undefined) return mark.score;
      if (mark.unitTest1 !== undefined) return mark.unitTest1;
      if (mark.unitTest2 !== undefined) return mark.unitTest2;
      if (mark.halfYearly !== undefined) return mark.halfYearly;
      if (mark.final !== undefined) return mark.final;
      return 0;
    });
    
    // Calculate current score (average of recent scores)
    const currentScore = recentScores.length > 0 
      ? Math.round(recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length)
      : 0;
    
    // Calculate previous score (older scores)
    const previousScores = marks.slice(5, 10).map(mark => {
      if (mark.marks !== undefined) return mark.marks;
      if (mark.score !== undefined) return mark.score;
      if (mark.unitTest1 !== undefined) return mark.unitTest1;
      if (mark.unitTest2 !== undefined) return mark.unitTest2;
      if (mark.halfYearly !== undefined) return mark.halfYearly;
      if (mark.final !== undefined) return mark.final;
      return 0;
    });
    
    const previousScore = previousScores.length > 0
      ? Math.round(previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length)
      : 0;
    
    // Determine trend
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (currentScore > previousScore + 5) { // 5% threshold for significant change
      trend = 'up';
    } else if (currentScore < previousScore - 5) {
      trend = 'down';
    }
    
    // Calculate consistency index
    const consistencyIndex = calculateConsistencyIndex(recentScores);
    
    // Calculate learning velocity
    const dates = marks.slice(0, 5).map(mark => 
      mark.uploadedAt?.toDate ? mark.uploadedAt.toDate() : new Date(mark.uploadedAt || Date.now())
    );
    const learningVelocity = calculateLearningVelocity(recentScores, dates);
    
    // Assign color based on performance
    let color = '#f59e0b'; // amber - moderate
    if (currentScore >= 85) {
      color = '#10b981'; // green - strong
    } else if (currentScore < 70) {
      color = '#ef4444'; // red - needs work
    }
    
    performanceData.push({
      subject,
      currentScore,
      previousScore,
      trend,
      color,
      consistencyIndex,
      learningVelocity
    });
  });
  
  return performanceData;
};

// Generate study patterns from homework data
export const generateStudyPatterns = (homeworkData: any[]): StudyPattern[] => {
  // For now, we'll generate mock data since we don't have actual study time tracking
  // In a real implementation, this would come from actual study time data
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const patterns: StudyPattern[] = [];
  
  days.forEach((day, index) => {
    // Generate realistic study hours (0-5 hours)
    const hours = Math.max(0, Math.min(5, Math.round(Math.random() * 4 + 1)));
    patterns.push({ day, hours });
  });
  
  return patterns;
};

// Generate learning recommendations based on performance
export const generateLearningRecommendations = (performanceData: SubjectPerformance[], weakTopics: string[]): LearningRecommendation[] => {
  const recommendations: LearningRecommendation[] = [];
  
  performanceData.forEach((subject) => {
    if (subject.trend === 'down' || subject.currentScore < 75) {
      recommendations.push({
        id: `rec-${subject.subject.toLowerCase().replace(/\s+/g, '-')}`,
        title: `Focus on ${subject.subject}`,
        description: `Your performance in ${subject.subject} has declined. Spend extra time on this subject.`,
        priority: subject.currentScore < 70 ? 'high' : 'medium',
        subject: subject.subject,
        action: 'Study Plan',
        type: 'weakness'
      });
    } else if (subject.trend === 'up' && subject.currentScore >= 85) {
      recommendations.push({
        id: `rec-${subject.subject.toLowerCase().replace(/\s+/g, '-')}-maintain`,
        title: `Maintain Excellence in ${subject.subject}`,
        description: `You're excelling in ${subject.subject}. Continue your good work and help classmates.`,
        priority: 'low',
        subject: subject.subject,
        action: 'Keep Going',
        type: 'maintenance'
      });
    }
    
    // Add consistency-based recommendations
    if (subject.consistencyIndex < 50) {
      recommendations.push({
        id: `rec-${subject.subject.toLowerCase().replace(/\s+/g, '-')}-consistency`,
        title: `Improve Consistency in ${subject.subject}`,
        description: `Your scores in ${subject.subject} vary significantly. Try to maintain steady performance.`,
        priority: 'medium',
        subject: subject.subject,
        action: 'Practice Regularly',
        type: 'improvement'
      });
    }
    
    // Add velocity-based recommendations
    if (subject.learningVelocity < 0.1 && subject.currentScore < 80) {
      recommendations.push({
        id: `rec-${subject.subject.toLowerCase().replace(/\s+/g, '-')}-motivation`,
        title: `Boost Learning in ${subject.subject}`,
        description: `Your progress in ${subject.subject} is slow. Try different study methods or seek help.`,
        priority: 'high',
        subject: subject.subject,
        action: 'Get Help',
        type: 'motivation'
      });
    }
  });
  
  // Add topic-based recommendations
  weakTopics.forEach((topic, index) => {
    recommendations.push({
      id: `rec-topic-${index}`,
      title: `Strengthen ${topic}`,
      description: `You're struggling with ${topic}. Focus on this area with additional practice.`,
      priority: 'high',
      subject: 'Multiple Subjects',
      action: 'Targeted Practice',
      type: 'weakness'
    });
  });
  
  // Add general recommendations if none exist
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-general-1',
      title: 'Consistent Study Schedule',
      description: 'Maintain a regular study schedule to keep up your good performance across all subjects.',
      priority: 'medium',
      subject: 'All Subjects',
      action: 'Set Schedule',
      type: 'improvement'
    });
  }
  
  return recommendations;
};

// Generate performance predictions with AI logic
export const generatePerformancePredictions = (performanceData: SubjectPerformance[]): PerformancePrediction[] => {
  const predictions: PerformancePrediction[] = [];
  
  // Calculate overall current performance
  const overallCurrent = performanceData.length > 0 
    ? Math.round(performanceData.reduce((sum, subject) => sum + subject.currentScore, 0) / performanceData.length)
    : 0;
  
  predictions.push({
    week: 'Current',
    predictedScore: overallCurrent,
    confidence: 100,
    explanation: 'Current performance based on recent assessments'
  });
  
  // Generate predictions for next 4 weeks using rule-based AI
  for (let i = 1; i <= 4; i++) {
    let predictedScore = overallCurrent;
    let explanation = '';
    
    // AI prediction logic based on multiple factors
    const improvingSubjects = performanceData.filter(s => s.trend === 'up').length;
    const decliningSubjects = performanceData.filter(s => s.trend === 'down').length;
    const consistentSubjects = performanceData.filter(s => s.trend === 'stable').length;
    const avgConsistency = performanceData.length > 0 
      ? performanceData.reduce((sum, s) => sum + s.consistencyIndex, 0) / performanceData.length
      : 50;
    const avgVelocity = performanceData.length > 0
      ? performanceData.reduce((sum, s) => sum + s.learningVelocity, 0) / performanceData.length
      : 0;
    
    // Prediction algorithm
    if (improvingSubjects > decliningSubjects) {
      // Overall improvement trend
      predictedScore += Math.min(5, Math.round(improvingSubjects * 0.5));
      explanation = 'Positive trend in multiple subjects';
    } else if (decliningSubjects > improvingSubjects) {
      // Overall decline trend
      predictedScore -= Math.min(5, Math.round(decliningSubjects * 0.5));
      explanation = 'Decline in multiple subjects needs attention';
    }
    
    // Adjust based on consistency
    if (avgConsistency > 70) {
      predictedScore += 2;
      explanation += explanation ? ', ' : '';
      explanation += 'High consistency supports improvement';
    } else if (avgConsistency < 30) {
      predictedScore -= 2;
      explanation += explanation ? ', ' : '';
      explanation += 'Low consistency may hinder progress';
    }
    
    // Adjust based on learning velocity
    if (avgVelocity > 0.5) {
      predictedScore += Math.min(3, Math.round(avgVelocity * 2));
      explanation += explanation ? ', ' : '';
      explanation += 'Positive learning velocity';
    } else if (avgVelocity < -0.5) {
      predictedScore -= Math.min(3, Math.round(Math.abs(avgVelocity) * 2));
      explanation += explanation ? ', ' : '';
      explanation += 'Negative learning velocity';
    }
    
    // Ensure score is within bounds
    predictedScore = Math.max(0, Math.min(100, Math.round(predictedScore)));
    
    // Confidence decreases over time
    const confidence = Math.max(50, 100 - (i * 10));
    
    predictions.push({
      week: `Week ${i}`,
      predictedScore,
      confidence,
      explanation
    });
  }
  
  return predictions;
};

// Generate subject distribution
export const generateSubjectDistribution = (performanceData: SubjectPerformance[]): SubjectDistributionItem[] => {
  let strong = 0;
  let moderate = 0;
  let needsWork = 0;
  
  performanceData.forEach((subject) => {
    if (subject.currentScore >= 85) {
      strong++;
    } else if (subject.currentScore >= 70) {
      moderate++;
    } else {
      needsWork++;
    }
  });
  
  const total = performanceData.length;
  
  return [
    { name: 'Strong', value: total > 0 ? Math.round((strong / total) * 100) : 0, color: '#10b981' },
    { name: 'Moderate', value: total > 0 ? Math.round((moderate / total) * 100) : 0, color: '#f59e0b' },
    { name: 'Needs Work', value: total > 0 ? Math.round((needsWork / total) * 100) : 0, color: '#ef4444' }
  ];
};

// New: Save learning insights to Firestore
export const updateAttendanceSummary = async (studentId: string, attendanceData: any) => {
  try {
    // Get all attendance records for this student
    // This is a placeholder - in a real implementation, this would be passed from the context
    const total = 0;
    const present = 0;
    const percentage = 0;
    
    const summaryData = {
      present,
      total,
      percentage
    };
    
    // Update or create summary document
    const summaryRef = doc(db, 'attendanceSummary', studentId);
    const summarySnap = await getDoc(summaryRef);
    
    if (summarySnap.exists()) {
      await updateDoc(summaryRef, summaryData);
    } else {
      await addDoc(collection(db, 'attendanceSummary'), { ...summaryData, studentId });
    }
    
    return summaryData;
  } catch (error) {
    console.error('Error updating attendance summary:', error);
    return null;
  }
};

export const saveLearningInsights = async (studentId: string, insights: LearningInsights) => {
  try {
    await setDoc(doc(db, 'learning_insights', studentId), {
      ...insights,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error saving learning insights:', error);
  }
};

// New: Update attendance summary in learning insights
export const updateAttendanceSummaryInLearningInsights = async (studentId: string, attendanceSummary: any) => {
  try {
    // Get current learning insights for the student
    const insightsDoc = doc(db, 'learning_insights', studentId);
    const insightsSnap = await getDoc(insightsDoc);
    
    if (insightsSnap.exists()) {
      // Update existing insights with attendance data
      const currentInsights = insightsSnap.data();
      
      // Add attendance metrics to insights
      const updatedInsights = {
        ...currentInsights,
        attendanceRate: attendanceSummary.percentage,
        attendanceTrend: 'stable', // We'll determine trend based on history
        totalDays: attendanceSummary.total || 0,
        presentDays: attendanceSummary.present || 0,
        lastUpdated: new Date()
      };
      
      await updateDoc(insightsDoc, updatedInsights);
      
      // Also update the cached data
      const cacheDoc = doc(db, 'insights_cache', studentId);
      const cacheSnap = await getDoc(cacheDoc);
      
      if (cacheSnap.exists()) {
        const currentCache = cacheSnap.data();
        const updatedCache = {
          ...currentCache,
          attendanceData: {
            percentage: attendanceSummary.percentage,
            total: attendanceSummary.total || 0,
            present: attendanceSummary.present || 0
          },
          lastCached: new Date()
        };
        
        await updateDoc(cacheDoc, updatedCache);
      }
      
      return true;
    } else {
      // Create new insights document with attendance data
      const newInsights = {
        studentId,
        attendanceRate: attendanceSummary.percentage,
        attendanceTrend: 'new',
        totalDays: attendanceSummary.total || 0,
        presentDays: attendanceSummary.present || 0,
        subject: 'Overall',
        avgScore: 0,
        improvementRate: 0,
        predictedNextScore: [0, 0],
        weakTopics: [],
        recommendations: [],
        lastUpdated: new Date(),
        consistencyIndex: 0,
        learningVelocity: 0
      };
      
      await setDoc(insightsDoc, newInsights);
      return true;
    }
  } catch (error) {
    console.error('Error updating attendance summary in learning insights:', error);
    return false;
  }
};

// New: Cache visualization data for fast loading
export const cacheVisualizationData = async (studentId: string, cacheData: InsightsCache) => {
  try {
    await setDoc(doc(db, 'insights_cache', studentId), {
      ...cacheData,
      lastCached: new Date()
    });
  } catch (error) {
    console.error('Error caching visualization data:', error);
  }
};

// New: Detect early warnings (sudden 10-15% decline)
export const detectEarlyWarnings = (performanceData: SubjectPerformance[]): string[] => {
  const warnings: string[] = [];
  
  performanceData.forEach(subject => {
    const declinePercent = subject.previousScore > 0 
      ? ((subject.previousScore - subject.currentScore) / subject.previousScore) * 100 
      : 0;
      
    if (declinePercent >= 10) {
      warnings.push(`${subject.subject}: ${Math.round(declinePercent)}% decline`);
    }
  });
  
  return warnings;
};

// Main function to get all learning insights for a student
export const getLearningInsights = async (studentId: string) => {
  try {
    // Fetch all required data
    const marksData = await fetchStudentPerformance(studentId);
    const homeworkData = await fetchStudentHomework(studentId);
    const attendanceData = await fetchStudentAttendance(studentId);
    
    // Generate insights
    const subjectPerformance = generateSubjectPerformance(marksData);
    const studyPatterns = generateStudyPatterns(homeworkData);
    const weakTopics = identifyWeakTopics(marksData);
    const learningRecommendations = generateLearningRecommendations(subjectPerformance, weakTopics);
    
    // Calculate overall performance
    const overallPerformance = subjectPerformance.length > 0 
      ? Math.round(subjectPerformance.reduce((sum, subject) => sum + subject.currentScore, 0) / subjectPerformance.length)
      : 0;
    
    const performancePredictions = generatePerformancePredictions(subjectPerformance);
    const subjectDistribution = generateSubjectDistribution(subjectPerformance);
    const earlyWarnings = detectEarlyWarnings(subjectPerformance);
    
    // Create learning insights object for storage
    const insights: LearningInsights = {
      studentId,
      subject: 'Overall',
      avgScore: overallPerformance,
      improvementRate: subjectPerformance.filter(s => s.trend === 'up').length,
      predictedNextScore: [
        Math.max(0, performancePredictions[1]?.predictedScore - 5 || 0),
        Math.min(100, performancePredictions[1]?.predictedScore + 5 || 100)
      ],
      weakTopics,
      recommendations: learningRecommendations,
      lastUpdated: new Date(),
      consistencyIndex: subjectPerformance.length > 0 
        ? subjectPerformance.reduce((sum, s) => sum + s.consistencyIndex, 0) / subjectPerformance.length
        : 0,
      learningVelocity: subjectPerformance.length > 0
        ? subjectPerformance.reduce((sum, s) => sum + s.learningVelocity, 0) / subjectPerformance.length
        : 0
    };
    
    // Cache visualization data for fast loading
    const cacheData: InsightsCache = {
      studentId,
      overallPerformance,
      subjectPerformance,
      studyPatterns,
      performancePredictions,
      subjectDistribution,
      lastCached: new Date()
    };
    
    // Save to Firestore
    await saveLearningInsights(studentId, insights);
    await cacheVisualizationData(studentId, cacheData);
    
    return {
      subjectPerformance,
      studyPatterns,
      learningRecommendations,
      performancePredictions,
      subjectDistribution,
      overallPerformance,
      attendanceData,
      earlyWarnings,
      weakTopics,
      insights
    };
  } catch (error) {
    console.error('Error generating learning insights:', error);
    throw error;
  }
};

// New: Get cached insights for fast loading
export const getCachedInsights = async (studentId: string) => {
  try {
    const cacheDoc = await getDoc(doc(db, 'insights_cache', studentId));
    
    if (cacheDoc.exists()) {
      const data = cacheDoc.data();
      // Check if cache is still valid (less than 1 hour old)
      const cacheAge = Date.now() - (data.lastCached?.toDate ? data.lastCached.toDate().getTime() : 0);
      if (cacheAge < 60 * 60 * 1000) { // 1 hour
        return data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching cached insights:', error);
    return null;
  }
};