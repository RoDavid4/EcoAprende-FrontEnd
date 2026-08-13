export interface Student {
  id: string;
  name: string;
  email: string;
  joinedAt: Date | string;
  avatarUrl?: string;
}

export interface ClassroomRosterModel {
  classroomId: string;
  classroomName: string;
  code: string;
  studentsCount: number;
  students: Student[];
}
