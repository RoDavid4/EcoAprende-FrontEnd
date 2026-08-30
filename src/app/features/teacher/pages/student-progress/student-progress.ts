import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ClassroomService } from '../../../../core/services/classroom-service';

export interface StudentProgress {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  progressPercentage: number;
  totalXp: number;
  level: number;
  currentStreak: number;
  completedLessonsCount: number;
  completedQuizzesCount: number;
  isCompleted: boolean;
}

interface ClassroomMetrics {
  classroom: {
    id: string;
    name: string;
    code: string;
    courseId: string | null;
  };

  students: StudentProgress[];

  summary: {
    totalStudents: number;
    activeStudentsCount: number;
    averageProgress: number;
    averageXp: number;
    averageLevel: number;
    completedStudentsCount: number;
  };
}

@Component({
  selector: 'app-student-progress',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './student-progress.html',
  styleUrl: './student-progress.scss',
})
export class StudentProgress implements OnInit {
  private classroomService = inject(ClassroomService);
  private router = inject(Router);

  students: StudentProgress[] = [];

  totalStudents = 0;
  averageProgress = 0;
  averageXp = 0;
  averageLevel = 0;
  completedStudentsCount = 0;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    this.loading = true;
    this.errorMessage = '';

    this.classroomService.getClassrooms().subscribe({
      next: (classrooms) => {
        if (classrooms.length === 0) {
          this.resetData();
          this.loading = false;
          return;
        }

        const requests = classrooms.map((classroom) =>
          this.classroomService.getClassroomMetrics(classroom.id),
        );

        forkJoin(requests).subscribe({
          next: (metrics: ClassroomMetrics[]) => {
            this.processMetrics(metrics);

            this.loading = false;
          },

          error: (error) => {
            console.error('Error al cargar métricas:', error);

            this.errorMessage =
              'No se pudo cargar el progreso de los estudiantes.';

            this.loading = false;
          },
        });
      },

      error: (error) => {
        console.error('Error al cargar las aulas:', error);

        this.errorMessage = 'No se pudieron cargar las aulas.';

        this.loading = false;
      },
    });
  }

  processMetrics(metrics: ClassroomMetrics[]): void {

  const studentsMap = new Map<string, StudentProgress>();

  let totalProgress = 0;
  let totalXp = 0;
  let totalLevel = 0;

  metrics.forEach((classroomMetrics) => {

    classroomMetrics.students.forEach((student) => {

      if (!studentsMap.has(student.id)) {
        studentsMap.set(student.id, student);
      }

    });

    totalProgress += classroomMetrics.summary.averageProgress;
    totalXp += classroomMetrics.summary.averageXp;
    totalLevel += classroomMetrics.summary.averageLevel;

  });

  this.students = Array.from(studentsMap.values());

  this.totalStudents = this.students.length;

  this.averageProgress =
    metrics.length > 0
      ? Math.round(totalProgress / metrics.length)
      : 0;

      console.log('TOTAL PROGRESS:', totalProgress);
console.log('AVERAGE PROGRESS:', this.averageProgress);
console.log('METRICS:', metrics);

  this.averageXp =
    metrics.length > 0
      ? Math.round(totalXp / metrics.length)
      : 0;

  this.averageLevel =
    metrics.length > 0
      ? Math.round(totalLevel / metrics.length)
      : 0;

  this.completedStudentsCount =
    this.students.filter(
      student => student.isCompleted
    ).length;

  this.students.sort(
    (a, b) =>
      b.progressPercentage - a.progressPercentage
  );
}

  resetData(): void {
    this.students = [];

    this.totalStudents = 0;
    this.averageProgress = 0;
    this.averageXp = 0;
    this.averageLevel = 0;
    this.completedStudentsCount = 0;
  }

  getStudentsByRange(min: number, max: number): number {
  return this.students.filter(
    (student) =>
      student.progressPercentage >= min &&
      student.progressPercentage <= max
  ).length;
}

getProgressBarWidth(value: number): number {
  return Math.min(Math.max(value, 0), 100);
}

getProgressClass(progress: number): string {
  if (progress >= 75) {
    return 'high';
  }

  if (progress >= 50) {
    return 'medium';
  }

  return 'low';
}

//funcion para correccion para el grafico de circulo
getPerformanceCircleStyle(): string {
  const progress = Math.min(
    Math.max(this.averageProgress, 0),
    100
  );

  return `conic-gradient(
    var(--mat-sys-primary) ${progress}%,
    #e5e7eb ${progress}%
  )`;
}

viewStudentDetail(studentId: string): void {
  this.router.navigate(['/teacher/student-detail', studentId]);
}

  goBack(): void {
    this.router.navigate(['/teacher']);
  }
}
