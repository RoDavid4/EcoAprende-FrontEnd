export interface ClassroomStudentMetric {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  progressPercentage: number;
  isCompleted: boolean;
  totalXp: number;
  level: number;
  currentStreak: number;
  completedLessonsCount: number;
  completedQuizzesCount: number;
  lastAccessedAt: Date | string | null;
}

export interface ClassroomMetricsSummary {
  totalStudents: number;
  activeStudentsCount: number;
  averageProgress: number;
  averageXp: number;
  averageLevel: number;
  completedStudentsCount: number;
}

export interface ClassroomInfo {
  id: string;
  name: string;
  code: string;
  courseId: string;
}

export interface ClassroomMetricsResponse {
  classroom: ClassroomInfo;
  summary: ClassroomMetricsSummary;
  students: ClassroomStudentMetric[];
}
