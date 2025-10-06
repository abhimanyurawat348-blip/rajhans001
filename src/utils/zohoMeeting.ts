/**
 * Utility functions for Zoho Meeting integration
 */

// In a real implementation, this would connect to the Zoho API
// For now, we'll simulate meeting link generation

interface PTMSchedule {
  id: string;
  date: Date;
  time: string;
  teacherIds: string[];
  parentIds: string[];
  studentIds: string[];
  zohoMeetingLink: string;
  createdAt: Date;
}

/**
 * Generate a Zoho meeting link
 * In a real implementation, this would call the Zoho API
 * @param meetingTitle - Title of the meeting
 * @param meetingDate - Date and time of the meeting
 * @returns Simulated Zoho meeting link
 */
export const generateZohoMeetingLink = (meetingTitle: string, meetingDate: Date): string => {
  // In a real implementation, this would:
  // 1. Call Zoho Meeting API to create a meeting
  // 2. Return the actual meeting link
  // 3. Store meeting details securely
  
  // For simulation, we'll generate a mock link
  const timestamp = meetingDate.getTime();
  const randomId = Math.random().toString(36).substring(2, 10);
  return `https://meet.zoho.com/rhps-${randomId}-${timestamp}`;
};

/**
 * Validate if a parent can access a specific PTM
 * @param parentId - ID of the parent
 * @param ptm - PTM schedule data
 * @returns boolean indicating if parent can access the PTM
 */
export const canParentAccessPTM = (parentId: string, ptm: PTMSchedule): boolean => {
  return ptm.parentIds.includes(parentId);
};

/**
 * Get PTMs for a specific parent
 * @param parentId - ID of the parent
 * @param allPTMs - All PTM schedules
 * @returns Array of PTMs accessible to the parent
 */
export const getPTMsForParent = (parentId: string, allPTMs: PTMSchedule[]): PTMSchedule[] => {
  return allPTMs.filter(ptm => canParentAccessPTM(parentId, ptm));
};

/**
 * Format date and time for Indian timezone (IST)
 * @param date - Date object
 * @param time - Time string in HH:MM format
 * @returns Formatted date and time string in IST
 */
export const formatISTDateTime = (date: Date, time: string): string => {
  // Create a new date object with the time
  const [hours, minutes] = time.split(':').map(Number);
  const meetingDate = new Date(date);
  meetingDate.setHours(hours, minutes, 0, 0);
  
  // Format for Indian timezone
  return meetingDate.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};