import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { ClassroomService } from '../../../../core/services/classroom-service';

export interface TeacherStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalXp: number;
  level: number;
  currentStreak: number;
  lastActivityDate: string | null;
  progressPercentage: number;
  classroomIds: string[];
  classroomNames: string[];
}

interface ClassroomMetrics {
  classroom: {
    id: string;
    name: string;
    code: string;
    courseId: string | null;
  };

  students: {
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
    lastAccessedAt: string | null;
  }[];

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
  selector: 'app-students',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './students.html',
  styleUrl: './students.scss',
})
export class Students implements OnInit {

  private classroomService = inject(ClassroomService);
  private router = inject(Router);

  students: TeacherStudent[] = [];

  loading = true;
  errorMessage = '';

  totalStudents = 0;
  activeStudents = 0;
  averageProgress = 0;

  ngOnInit(): void {
    this.loadStudents();
  }

  // ==========================================
  // CARGAR ESTUDIANTES
  // ==========================================

  loadStudents(): void {

    this.loading = true;
    this.errorMessage = '';

    this.classroomService.getClassrooms().subscribe({

      next: (classrooms) => {

        if (classrooms.length === 0) {
          this.students = [];
          this.resetMetrics();
          this.loading = false;
          return;
        }

        const requests = classrooms.map((classroom) =>
          this.classroomService.getClassroomMetrics(classroom.id)
        );

        forkJoin(requests).subscribe({

          next: (metrics: ClassroomMetrics[]) => {

            this.processStudents(metrics);

            this.loading = false;
          },

          error: (error) => {

            console.error(
              'Error al cargar métricas de estudiantes:',
              error
            );

            this.errorMessage =
              'No se pudo cargar la información de los estudiantes.';

            this.loading = false;
          },
        });
      },

      error: (error) => {

        console.error(
          'Error al cargar las aulas:',
          error
        );

        this.errorMessage =
          'No se pudieron cargar las aulas.';

        this.loading = false;
      },
    });
  }

  // ==========================================
  // PROCESAR ESTUDIANTES
  // ==========================================

  processStudents(metrics: ClassroomMetrics[]): void {

    const studentsMap =
      new Map<string, TeacherStudent>();

    let activeStudents = 0;
    let progressSum = 0;

    metrics.forEach((classroomMetrics) => {

      classroomMetrics.students.forEach((student) => {

        const existingStudent =
          studentsMap.get(student.id);

        if (existingStudent) {

          // El estudiante ya pertenece
          // a otra aula del docente.

          if (
            !existingStudent.classroomIds.includes(
              classroomMetrics.classroom.id
            )
          ) {

            existingStudent.classroomIds.push(
              classroomMetrics.classroom.id
            );

            existingStudent.classroomNames.push(
              classroomMetrics.classroom.name
            );
          }

        } else {

          const newStudent: TeacherStudent = {

            id: student.id,

            firstName: student.firstName,

            lastName: student.lastName,

            email: '',

            totalXp: student.totalXp,

            level: student.level,

            currentStreak: student.currentStreak,

            lastActivityDate:
              student.lastAccessedAt,

            progressPercentage:
              student.progressPercentage,

            classroomIds: [
              classroomMetrics.classroom.id
            ],

            classroomNames: [
              classroomMetrics.classroom.name
            ],
          };

          studentsMap.set(
            student.id,
            newStudent
          );
        }
      });
    });

    this.students =
      Array.from(studentsMap.values());

    // ==========================================
    // MÉTRICAS GENERALES
    // ==========================================

    this.totalStudents =
      this.students.length;

    this.students.forEach((student) => {

      progressSum +=
        student.progressPercentage;

      if (
        this.isRecentlyActive(
          student.lastActivityDate
        )
      ) {

        activeStudents++;
      }
    });

    this.activeStudents =
      activeStudents;

    this.averageProgress =
      this.totalStudents > 0
        ? Math.round(
            progressSum / this.totalStudents
          )
        : 0;

    // Ordenar por progreso
    this.students.sort(
      (a, b) =>
        b.progressPercentage -
        a.progressPercentage
    );
  }

  // ==========================================
  // ACTIVIDAD RECIENTE
  // ==========================================

  isRecentlyActive(
    date: string | null
  ): boolean {

    if (!date) {
      return false;
    }

    const activityDate =
      new Date(date);

    const threshold =
      new Date();

    threshold.setDate(
      threshold.getDate() - 7
    );

    return activityDate >= threshold;
  }

  getActivityLabel(
    date: string | null
  ): string {

    if (!date) {
      return 'Sin actividad';
    }

    if (
      this.isRecentlyActive(date)
    ) {
      return 'Activo recientemente';
    }

    return 'Inactivo';
  }

  // ==========================================
  // CLASE DE PROGRESO
  // ==========================================

  getProgressClass(
    progress: number
  ): string {

    if (progress >= 75) {
      return 'high';
    }

    if (progress >= 40) {
      return 'medium';
    }

    return 'low';
  }

  // ==========================================
  // VER DETALLE
  // ==========================================

  viewStudent(
    studentId: string
  ): void {

    this.router.navigate([
      '/teacher/student-detail',
      studentId,
    ]);
  }

  // ==========================================
// DESVINCULAR ESTUDIANTE
// ==========================================

removeStudentFromClassroom(
  student: TeacherStudent,
  classroomId: string,
  classroomName: string
): void {

  const confirmed = window.confirm(
    `¿Estás seguro de que deseas desvincular a ${student.firstName} ${student.lastName} del aula "${classroomName}"?`
  );

  if (!confirmed) {
    return;
  }

  this.classroomService
    .removeStudentFromClassroom(
      classroomId,
      student.id
    )
    .subscribe({

      next: () => {

        console.log(
          `Estudiante ${student.id} desvinculado del aula ${classroomId}`
        );

        // Volvemos a cargar los datos para actualizar
        // aulas, progreso y cantidad de estudiantes.
        this.loadStudents();
      },

      error: (error) => {

        console.error(
          'Error al desvincular estudiante:',
          error
        );

        this.errorMessage =
          'No se pudo desvincular al estudiante del aula.';
      },

    });
}

  // ==========================================
  // VOLVER
  // ==========================================

  goBack(): void {

    this.router.navigate([
      '/teacher',
    ]);
  }

  // ==========================================
  // RESET
  // ==========================================

  resetMetrics(): void {

    this.totalStudents = 0;
    this.activeStudents = 0;
    this.averageProgress = 0;
  }
}