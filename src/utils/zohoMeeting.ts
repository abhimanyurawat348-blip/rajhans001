




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


export const generateZohoMeetingLink = (meetingTitle: string, meetingDate: Date): string => {
  
  
  
  
  
  
  const timestamp = meetingDate.getTime();
  const randomId = Math.random().toString(36).substring(2, 10);
  return `https://meet.zoho.com/rhps-${randomId}-${timestamp}`;
};


export const canParentAccessPTM = (parentId: string, ptm: PTMSchedule): boolean => {
  return ptm.parentIds.includes(parentId);
};


export const getPTMsForParent = (parentId: string, allPTMs: PTMSchedule[]): PTMSchedule[] => {
  return allPTMs.filter(ptm => canParentAccessPTM(parentId, ptm));
};


export const formatISTDateTime = (date: Date, time: string): string => {
  
  const [hours, minutes] = time.split(':').map(Number);
  const meetingDate = new Date(date);
  meetingDate.setHours(hours, minutes, 0, 0);
  
  
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