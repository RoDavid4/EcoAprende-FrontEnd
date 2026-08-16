export interface Student {
  id: string;
  fullName: string;
  email: string;
  joinedAt: Date | string;
  ClassroomStudent?: {
    joinedAt: string;
  };
}

export interface ClassroomRosterModel {
  classroomId: string;
  classroomName: string;
  code: string;
  studentsCount: number;
  students: Student[];
}
