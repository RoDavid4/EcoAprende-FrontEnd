export type CourseStatus = 'DRAFT' | 'PUBLISHED';
export type LessonContentType = 'TEXT' | 'VIDEO' | 'MULTIMEDIA';

export interface Lesson {
  id?: string;
  moduleId?: string;
  title: string;
  contentType: LessonContentType;
  content?: string;
  mediaUrl?: string;
  order: number;
  durationMinutes?: number;
  isActive?: boolean;
}

export interface Module {
  id?: string;
  courseId?: string;
  title: string;
  description?: string;
  order: number;
  status: CourseStatus;
  isActive?: boolean;
  lessons?: Lesson[];
  //quizzes?: { id: string; title: string }[]; //Reemplazar
}

export interface Course {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  status: CourseStatus;
  createdById?: string;
  isActive?: boolean;
  modules?: Module[];
}
