export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizAttempt {
  studentName: string;
  ip: string;
  class: string;
  subject: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: string;
  timestamp: any;
}

export interface SubjectData {
  name: string;
  color: string;
  icon: string;
}

export interface QuizStats {
  totalAttempts: number;
  class9Attempts: number;
  class10Attempts: number;
  subjectAttempts: { [key: string]: number };
}
