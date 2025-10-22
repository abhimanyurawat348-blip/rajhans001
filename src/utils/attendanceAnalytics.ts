import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export interface AttendanceSummary {
  studentId: string;
  present: number;
  total: number;
  percentage: number;
}

export interface AttendanceTrend {
  date: string;
  percentage: number;
}

export interface ClassAttendanceSummary {
  class: string;
  section: string;
  present: number;
  total: number;
  percentage: number;
}

export interface AttendancePrediction {
  studentId: string;
  riskLevel: 'low' | 'medium' | 'high';
  predictedAttendance: number;
  explanation: string;
}

/**
 * Calculate attendance trends for a student over time
 */
export async function getStudentAttendanceTrends(studentId: string, days: number = 30): Promise<AttendanceTrend[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const q = query(
      collection(db, 'attendance'),
      where('studentId', '==', studentId),
      where('date', '>=', cutoffDate),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const records: AttendanceRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
      } as AttendanceRecord);
    });
    
    // Group by date and calculate daily percentages
    const dailyAttendance: { [date: string]: { present: number; total: number } } = {};
    
    records.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      if (!dailyAttendance[dateStr]) {
        dailyAttendance[dateStr] = { present: 0, total: 0 };
      }
      dailyAttendance[dateStr].total += 1;
      if (record.status === 'present' || record.status === 'late') {
        dailyAttendance[dateStr].present += 1;
      }
    });
    
    // Convert to trend data
    const trends: AttendanceTrend[] = Object.keys(dailyAttendance).map(date => ({
      date,
      percentage: Math.round((dailyAttendance[date].present / dailyAttendance[date].total) * 100)
    }));
    
    return trends.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error fetching student attendance trends:', error);
    return [];
  }
}

/**
 * Calculate class-wise attendance trends
 */
export async function getClassAttendanceTrends(classId: string, section: string, days: number = 30): Promise<AttendanceTrend[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const q = query(
      collection(db, 'attendance'),
      where('class', '==', classId),
      where('section', '==', section),
      where('date', '>=', cutoffDate),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const records: AttendanceRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
      } as AttendanceRecord);
    });
    
    // Group by date and calculate daily percentages
    const dailyAttendance: { [date: string]: { present: number; total: number } } = {};
    
    records.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      if (!dailyAttendance[dateStr]) {
        dailyAttendance[dateStr] = { present: 0, total: 0 };
      }
      dailyAttendance[dateStr].total += 1;
      if (record.status === 'present' || record.status === 'late') {
        dailyAttendance[dateStr].present += 1;
      }
    });
    
    // Convert to trend data
    const trends: AttendanceTrend[] = Object.keys(dailyAttendance).map(date => ({
      date,
      percentage: Math.round((dailyAttendance[date].present / dailyAttendance[date].total) * 100)
    }));
    
    return trends.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error fetching class attendance trends:', error);
    return [];
  }
}

/**
 * Predict attendance risk for students based on patterns
 */
export async function predictAttendanceRisk(studentId: string): Promise<AttendancePrediction> {
  try {
    // Get recent attendance data
    const trends = await getStudentAttendanceTrends(studentId, 30);
    
    if (trends.length < 5) {
      return {
        studentId,
        riskLevel: 'low',
        predictedAttendance: 90,
        explanation: 'Insufficient data for accurate prediction'
      };
    }
    
    // Calculate recent trend (last 7 days vs previous 7 days)
    const recentTrends = trends.slice(-7);
    const previousTrends = trends.slice(-14, -7);
    
    const recentAvg = recentTrends.reduce((sum, trend) => sum + trend.percentage, 0) / recentTrends.length;
    const previousAvg = previousTrends.length > 0 
      ? previousTrends.reduce((sum, trend) => sum + trend.percentage, 0) / previousTrends.length 
      : recentAvg;
    
    const trendChange = recentAvg - previousAvg;
    
    // Calculate consistency (variance)
    const mean = trends.reduce((sum, trend) => sum + trend.percentage, 0) / trends.length;
    const variance = trends.reduce((sum, trend) => sum + Math.pow(trend.percentage - mean, 2), 0) / trends.length;
    const consistency = 100 - Math.sqrt(variance); // Higher is more consistent
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let explanation = '';
    
    if (recentAvg < 70) {
      riskLevel = 'high';
      explanation = 'Attendance below 70%';
    } else if (recentAvg < 80) {
      riskLevel = 'medium';
      explanation = 'Attendance between 70-80%';
    } else if (trendChange < -5) {
      riskLevel = 'medium';
      explanation = 'Declining attendance trend';
    } else if (consistency < 60) {
      riskLevel = 'medium';
      explanation = 'Inconsistent attendance pattern';
    } else {
      riskLevel = 'low';
      explanation = 'Good attendance record';
    }
    
    return {
      studentId,
      riskLevel,
      predictedAttendance: Math.max(0, Math.min(100, Math.round(recentAvg + trendChange))),
      explanation
    };
  } catch (error) {
    console.error('Error predicting attendance risk:', error);
    return {
      studentId,
      riskLevel: 'low',
      predictedAttendance: 90,
      explanation: 'Error in prediction algorithm'
    };
  }
}

/**
 * Get class-wise attendance summaries
 */
export async function getClassAttendanceSummaries(): Promise<ClassAttendanceSummary[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'attendance'));
    const records: AttendanceRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
      } as AttendanceRecord);
    });
    
    // Group by class and section
    const classAttendance: { [key: string]: { present: number; total: number } } = {};
    
    records.forEach(record => {
      const key = `${record.class}-${record.section}`;
      if (!classAttendance[key]) {
        classAttendance[key] = { present: 0, total: 0 };
      }
      classAttendance[key].total += 1;
      if (record.status === 'present' || record.status === 'late') {
        classAttendance[key].present += 1;
      }
    });
    
    // Convert to summary data
    const summaries: ClassAttendanceSummary[] = Object.keys(classAttendance).map(key => {
      const [classId, section] = key.split('-');
      const { present, total } = classAttendance[key];
      const percentage = Math.round((present / total) * 100);
      
      return {
        class: classId,
        section,
        present,
        total,
        percentage
      };
    });
    
    return summaries;
  } catch (error) {
    console.error('Error fetching class attendance summaries:', error);
    return [];
  }
}

/**
 * Identify students with frequent absences
 */
export async function getFrequentAbsentees(threshold: number = 80): Promise<{ studentId: string; studentName: string; percentage: number }[]> {
  try {
    // This would typically use the attendanceSummary collection
    // For now, we'll simulate the data
    return [];
  } catch (error) {
    console.error('Error fetching frequent absentees:', error);
    return [];
  }
}

export default {
  getStudentAttendanceTrends,
  getClassAttendanceTrends,
  predictAttendanceRisk,
  getClassAttendanceSummaries,
  getFrequentAbsentees
};