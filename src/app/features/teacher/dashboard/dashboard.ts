import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ClassroomService } from '../../../core/services/classroom-service';
import {
  TeacherSubmissionsService,
  TeacherSubmission,
} from '../service/teacher-submissions.service';

import { MissionsService, Mission } from '../../missions/missions.service'

@Component({
  selector: 'app-teacher-dashboard',
  imports: [
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class TeacherDashboard implements OnInit {

  private classroomService = inject(ClassroomService);
  private submissionsService = inject(TeacherSubmissionsService);
  private missionsService = inject(MissionsService);

  classrooms: any[] = [];

  totalStudents = 0;
  averageProgress = 0;

  pendingSubmissions: TeacherSubmission[] = [];
  pendingSubmissionsCount = 0;

  ngOnInit(): void {
    this.loadClassrooms();
    this.loadPendingSubmissions();
  }

  // ================================
  // AULAS
  // ================================

  loadClassrooms(): void {
    this.classroomService.getClassrooms().subscribe({
      next: (data) => {
        console.log('Aulas del docente:', data);

        this.classrooms = data;

        this.loadClassroomMetrics();
      },
      error: (error) => {
        console.error('Error al cargar las aulas:', error);
      },
    });
  }

  loadClassroomMetrics(): void {

    if (this.classrooms.length === 0) {
      this.totalStudents = 0;
      this.averageProgress = 0;
      return;
    }

    const requests = this.classrooms.map((classroom) =>
      this.classroomService.getClassroomMetrics(classroom.id)
    );

    forkJoin(requests).subscribe({
      next: (metrics) => {

        console.log('Métricas de aulas:', metrics);

        this.totalStudents = metrics.reduce(
          (total, classroomMetrics) =>
            total + classroomMetrics.summary.totalStudents,
          0
        );

        const progressTotal = metrics.reduce(
          (total, classroomMetrics) =>
            total + classroomMetrics.summary.averageProgress,
          0
        );

        this.averageProgress =
          metrics.length > 0
            ? Math.round(progressTotal / metrics.length)
            : 0;
      },

      error: (error) => {
        console.error(
          'Error al cargar métricas de las aulas:',
          error
        );
      },
    });
  }

  // ================================
  // ENTREGAS PENDIENTES
  // ================================

  loadPendingSubmissions(): void {

  this.missionsService.getMissions().subscribe({
    next: (missions: Mission[]) => {

      console.log('Misiones para revisar:', missions);

      if (missions.length === 0) {
        this.pendingSubmissions = [];
        this.pendingSubmissionsCount = 0;
        return;
      }

      const requests = missions.map((mission) =>
        this.submissionsService.getSubmissionsByMission(mission.id)
      );

      forkJoin(requests).subscribe({
        next: (submissionsByMission) => {

          console.log(
            'Entregas de todas las misiones:',
            submissionsByMission
          );

          this.pendingSubmissions =
            submissionsByMission
              .flat()
              .filter(
                (submission) =>
                  submission.status === 'PENDING'
              );

          this.pendingSubmissionsCount =
            this.pendingSubmissions.length;

          console.log(
            'Entregas pendientes:',
            this.pendingSubmissions
          );

          console.log(
            'Cantidad de entregas pendientes:',
            this.pendingSubmissionsCount
          );
        },

        error: (error) => {
          console.error(
            'Error al cargar las entregas:',
            error
          );
        },
      });
    },

    error: (error) => {
      console.error(
        'Error al cargar las misiones:',
        error
      );
    },
  });
}
}