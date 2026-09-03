export interface Option {
  id?: string;
  questionId?: string;
  text: string;
  isCorrect: boolean;
  order?: number;
}

export interface Question {
  id?: string;
  quizId?: string;
  statement: string;
  explanation?: string;
  order?: number;
  points: number;
  isActive?: boolean;
  options: Option[];
}

export interface Quiz {
  id?: string;
  moduleId: string;
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes?: number;
  isActive?: boolean;
  questions: Question[];
  myAttempts?: any[];
  isPassed?: boolean;
  highestScore?: number;
  attemptsCount?: number;
  isCompleted?: boolean;
}
