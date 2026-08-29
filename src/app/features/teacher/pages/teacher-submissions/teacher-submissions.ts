import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  TeacherSubmissionsService,
  TeacherSubmission,
} from '../../service/teacher-submissions.service';

import {
  MissionsService,
  Mission,
} from '../../../missions/missions.service';

@Component({
  selector: 'app-teacher-submissions',
  imports: [
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './teacher-submissions.html',
  styleUrl: './teacher-submissions.scss',
})
export class TeacherSubmissions implements OnInit {

  private submissionsService = inject(TeacherSubmissionsService);
  private missionsService = inject(MissionsService);
  private router = inject(Router);

  submissions: TeacherSubmission[] = [];

  loading = false;

  errorMessage = '';

  ngOnInit(): void {
    this.loadSubmissions();
  }

  // ================================
  // CARGAR ENTREGAS
  // ================================

  loadSubmissions(): void {

    this.loading = true;
    this.errorMessage = '';

    this.missionsService.getMissions().subscribe({

      next: (missions: Mission[]) => {

        console.log('Misiones para revisar:', missions);

        if (missions.length === 0) {

          this.submissions = [];
          this.loading = false;

          return;
        }

        const requests = missions.map((mission) =>
          this.submissionsService.getSubmissionsByMission(
            mission.id
          )
        );

        forkJoin(requests).subscribe({

          next: (submissionsByMission) => {

            console.log(
              'Entregas de todas las misiones:',
              submissionsByMission
            );

            this.submissions = submissionsByMission
              .flat()
              .filter(
                (submission) =>
                  submission.status === 'PENDING'
              );

            console.log(
              'Entregas pendientes:',
              this.submissions
            );

            this.loading = false;
          },

          error: (error) => {

            console.error(
              'Error al cargar las entregas:',
              error
            );

            this.errorMessage =
              'No se pudieron cargar las entregas. Intentá nuevamente.';

            this.loading = false;
          },

        });

      },

      error: (error) => {

        console.error(
          'Error al cargar las misiones:',
          error
        );

        this.errorMessage =
          'No se pudieron cargar las misiones. Intentá nuevamente.';

        this.loading = false;
      },

    });
  }

  

reviewSubmission(submission: TeacherSubmission): void {
  this.router.navigate(['/teacher/submissions', submission.id], {
    queryParams: {
      missionId: submission.missionId,
    },
  });
}

  // ================================
  // NAVEGACIÓN
  // ================================

  goBack(): void {
    this.router.navigate(['/teacher']);
  }

  // ================================
  // FECHA
  // ================================

  getSubmissionDate(date: string): string {

    return new Date(date).toLocaleDateString(
      'es-AR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );
  }

}
