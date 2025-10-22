export interface User {
  id: string;
  fullName?: string;
  username?: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  admissionNumber?: string;
  class?: string;
  section?: string;
  dateOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  ipAddress?: string;
  subject?: string; // For teachers
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

// Paper Generation Request Interface
export interface PaperGenerationRequest {
  id: string;
  class: string;
  subject: string;
  blueprint_id?: string;
  number_of_papers: number;
  number_of_variants: number;
  requested_by: string;
  requested_at: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completion_at?: Date;
  error_message?: string;
  generated_paper_ids?: string[];
}

// Paper Review Queue Interface
export interface PaperReviewQueueItem {
  id: string;
  paper_id: string;
  class: string;
  subject: string;
  title: string;
  variant: number;
  submitted_by: string;
  submitted_at: Date;
  assigned_to?: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'revised';
  reviewer_comments?: string;
  reviewed_at?: Date;
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

// Broken Link Report Interface
export interface BrokenLinkReport {
  id: string;
  resource_id: string;
  reported_by: string;
  reported_at: Date;
  status: 'reported' | 'verified' | 'fixed' | 'replaced' | 'unresolved';
  resolution_notes?: string;
  replacement_url?: string;
  resolved_by?: string;
  resolved_at?: Date;
}

// Resource Verification Log Interface
export interface ResourceVerificationLog {
  id: string;
  resource_id: string;
  verified_at: Date;
  verification_status: 'valid' | 'broken' | 'redirected' | 'expired';
  notes?: string;
  http_status_code?: number;
  redirect_url?: string;
}

// Plagiarism Check Result Interface
export interface PlagiarismCheckResult {
  id: string;
  resource_id: string;
  checked_at: Date;
  similarity_score: number;
  similar_resources: {
    resource_id: string;
    similarity_percentage: number;
  }[];
  flagged_for_review: boolean;
  review_notes?: string;
  checked_by?: string;
}

export interface StudyResource {
  id: string;
  title: string;
  subject: string;
  class: string;
  type: 'previous-year' | 'sample-paper' | 'question-bank' | 'notes' | 'video' | 'ppt' | 'link';
  downloadUrl: string;
  year?: string;
  topic_tags?: string[];
  language?: string;
  uploaded_by?: string;
  source_url?: string;
  last_verified?: Date;
  ncert_chapters?: string[];
  cbse_syllabus_entries?: string[];
  version?: number;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
  broken_report_count?: number;
  accessibility_notes?: string;
  has_solutions?: boolean;
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

// Question Paper Blueprint Interface
export interface QuestionPaperBlueprint {
  id: string;
  class: string;
  subject: string;
  title: string;
  total_marks: number;
  duration: string; // e.g., "3 hours"
  sections: QuestionPaperSection[];
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  chapter_weightage: {
    [chapter: string]: number; // percentage
  };
  bloom_taxonomy_distribution: {
    remember: number;
    understand: number;
    apply: number;
    analyze: number;
    evaluate: number;
    create: number;
  };
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface QuestionPaperSection {
  name: string; // e.g., "Section A"
  question_types: QuestionType[];
  total_marks: number;
  instructions?: string;
}

export interface QuestionType {
  type: 'VSA' | 'SA1' | 'SA2' | 'LA' | 'CaseBased' | 'AssertionReason' | 'HOTS' | 'MCQ' | 'Subjective';
  count: number;
  marks_per_question: number;
  total_marks: number;
}

// Generated Question Paper Interface
export interface GeneratedQuestionPaper {
  id: string;
  blueprint_id: string;
  class: string;
  subject: string;
  title: string;
  variant: number; // 1, 2, 3 for variants
  questions: Question[];
  marking_scheme: MarkingScheme;
  solutions: Solution[];
  pdf_url?: string;
  word_url?: string;
  hindi_pdf_url?: string;
  hindi_word_url?: string;
  is_approved: boolean;
  approved_by?: string;
  approved_at?: Date;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  version: number;
}

export interface Question {
  id: string;
  section: string;
  question_type: string;
  text: string;
  options?: string[]; // For MCQs
  correct_answer: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ncert_chapters: string[];
  topic_tags: string[];
  bloom_level: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  hint?: string;
  estimated_time: number; // in minutes
}

export interface MarkingScheme {
  [questionId: string]: {
    marks: number;
    marking_points: string[];
  };
}

export interface Solution {
  questionId: string;
  detailed_solution: string;
  steps?: string[];
  marking_points: string[];
}