import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';

import {
  TeacherSubmissionsService,
  TeacherSubmission,
} from '../service/teacher-submissions.service';

@Component({
  selector: 'app-submission-review',
  imports: [
    FormsModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './submission-review.html',
  styleUrl: './submission-review.scss',
})
export class SubmissionReview implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private submissionsService = inject(TeacherSubmissionsService);

  submission: TeacherSubmission | null = null;

  feedback = '';

  loading = true;
  saving = false;
  errorMessage = '';

  ngOnInit(): void {

    const submissionId = this.route.snapshot.paramMap.get('id');
    const missionId = this.route.snapshot.queryParamMap.get('missionId');

    if (!submissionId || !missionId) {
      this.errorMessage = 'No se encontró la información de la entrega.';
      this.loading = false;
      return;
    }

    this.loadSubmission(submissionId, missionId);
  }

  loadSubmission(submissionId: string, missionId: string): void {

    this.loading = true;
    this.errorMessage = '';

    this.submissionsService
      .getSubmissionsByMission(missionId)
      .subscribe({

        next: (submissions) => {

          const foundSubmission = submissions.find(
            (submission) => submission.id === submissionId
          );

          if (!foundSubmission) {
            this.errorMessage = 'No se encontró la entrega seleccionada.';
            this.loading = false;
            return;
          }

          this.submission = foundSubmission;

          this.feedback = foundSubmission.feedback ?? '';

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Error al cargar la entrega:',
            error
          );

          this.errorMessage =
            'No se pudo cargar la entrega. Intentá nuevamente.';

          this.loading = false;
        },

      });
  }

  approve(): void {
    this.review('APPROVED');
  }

  reject(): void {
    this.review('REJECTED');
  }

  review(status: 'APPROVED' | 'REJECTED'): void {

    if (!this.submission) {
      return;
    }

    if (!this.feedback.trim()) {
      this.errorMessage =
        'Es necesario escribir un feedback antes de continuar.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.submissionsService
      .reviewSubmission(this.submission.id, {
        status,
        feedback: this.feedback.trim(),
      })
      .subscribe({

        next: () => {

          this.saving = false;

          this.router.navigate(['/teacher/submissions']);

        },

        error: (error) => {

          console.error(
            'Error al revisar la entrega:',
            error
          );

          this.errorMessage =
            'No se pudo guardar la revisión. Intentá nuevamente.';

          this.saving = false;
        },

      });
  }

  goBack(): void {
    this.router.navigate(['/teacher/submissions']);
  }
}