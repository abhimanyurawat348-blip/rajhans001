export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  admissionNumber?: string;
  class?: string;
  section?: string;
}

export interface Complaint {
  id: string;
  studentName: string;
  class: string;
  section: string;
  email: string;
  fatherName?: string;
  complaint: string;
  ipAddress?: string;
  submittedAt: Date;
  status: 'pending' | 'resolved' | 'under-consideration' | 'removed';
}

export interface StudentCouncilMember {
  name: string;
  position: string;
  house?: 'Red' | 'Blue' | 'Yellow' | 'Green';
  category: 'leadership' | 'discipline' | 'sports' | 'house' | 'activity';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'exam' | 'holiday' | 'competition' | 'function' | 'sports' | 'activity';
  category?: string;
  location?: string;
}

export interface Registration {
  id: string;
  studentName: string;
  class: string;
  section: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  fatherName: string;
  motherName: string;
  category: 'sports' | 'activity';
  activityType: string;
  eligibilityCategory: 'Under 14' | 'Under 16' | 'Under 18';
  registeredAt: Date;
  status?: 'pending' | 'approved' | 'under-consideration' | 'removed';
}

export interface LoginRecord {
  id: string;
  email: string;
  ipAddress: string;
  loginTime: Date;
  otpVerified: boolean;
}

export interface StudyResource {
  id: string;
  title: string;
  subject: string;
  class: string;
  type: 'previous-year' | 'sample-paper';
  downloadUrl: string;
  year?: string;
}