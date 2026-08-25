export interface Course {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED';
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  courseTitle?: string;
}

export interface Classroom {
  id: string;
  name: string;
  gradeLevel?: string;
}

export interface AssignModulesPayload {
  classroomId: string;
  moduleIds: string[];
}
