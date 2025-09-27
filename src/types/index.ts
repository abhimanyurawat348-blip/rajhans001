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
  admissionNumber: string;
  class: string;
  section: string;
  fatherName: string;
  email: string;
  complaint: string;
  submittedAt: Date;
  status: 'pending' | 'resolved' | 'in-progress';
}

export interface StudentCouncilMember {
  name: string;
  position: string;
  house?: 'Red' | 'Blue' | 'Yellow' | 'Green';
  category: 'leadership' | 'discipline' | 'sports' | 'house' | 'activity';
}