export interface User {
  id: string;
  fullName?: string;
  username?: string;
  email: string;
  role: 'student' | 'teacher';
  admissionNumber?: string;
  class?: string;
  section?: string;
  dateOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  ipAddress?: string;
}

export interface Student extends User {
  admissionNumber: string;
  class: string;
  section: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  fullName: string;
}

export interface Complaint {
  id: string;
  studentName: string;
  class: string;
  section: string;
  email: string;
  fatherName?: string;
  motherName?: string;
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

export interface Marksheet {
  id: string;
  unit_test_1?: number;
  unit_test_2?: number;
  unit_test_3?: number;
  half_yearly?: number;
  final_exam?: number;
  subject?: string;
  maxMarks?: number;
  marks?: number;
  [key: string]: any;
}