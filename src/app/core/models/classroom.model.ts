import { Student } from './student.model';

export interface Classroom {
  id: string;
  name: string;
  description: string;
  studentsCount: number;
  code: string;
  createdAt?: Date;
}
export interface ClassroomDetail extends Classroom {
  students?: Student[];
}
