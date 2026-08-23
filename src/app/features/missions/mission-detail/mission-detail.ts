import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import {
  MissionsService,
  Mission,
  MissionSubmission,
} from '../missions.service';

@Component({
  selector: 'app-mission-detail',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './mission-detail.html',
  styleUrl: './mission-detail.scss',
})
export class MissionDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private missionsService = inject(MissionsService);

  mission: Mission | null = null;

  mySubmission: MissionSubmission | null = null;

  // ================================
  // VARIABLES DE SUBMIT
  // ================================

  evidenceText = '';

  evidenceUrl = '';

  isSubmitting = false;

  submitSuccess = false;

  submitError = '';


  // ================================
  // INICIALIZACIÓN
  // ================================

  ngOnInit(): void {

    const missionId =
      this.route.snapshot.paramMap.get('id');

    if (!missionId) {

      this.router.navigate(['/missions']);

      return;
    }

    this.loadMission(missionId);
  }


  // ================================
  // CARGAR MISIÓN
  // ================================

  loadMission(id: string): void {

    this.missionsService.getMission(id).subscribe({

      next: (data) => {

        console.log(
          'Misión seleccionada:',
          data
        );

        this.mission = data;

        // Comprobar si el usuario
        // ya entregó esta misión.
        this.checkMySubmission();
      },

      error: (error) => {

        console.error(
          'Error al cargar la misión:',
          error
        );

        this.router.navigate(['/missions']);
      },

    });
  }


  // ================================
  // COMPROBAR ENTREGA
  // ================================

  checkMySubmission(): void {

    this.missionsService.getMySubmissions().subscribe({

      next: (submissions) => {

        if (!this.mission) {
          return;
        }

        this.mySubmission =
          submissions.find(
            (submission) =>
              submission.missionId === this.mission!.id
          ) ?? null;

        console.log(
          'Entrega de esta misión:',
          this.mySubmission
        );
      },

      error: (error) => {

        console.error(
          'Error al comprobar la entrega:',
          error
        );

        // Si no podemos consultar las entregas,
        // dejamos el formulario disponible.
        this.mySubmission = null;
      },

    });
  }


  // ================================
  // ENVIAR MISIÓN
  // ================================

  submitMission(): void {

    if (!this.mission) {
      return;
    }

    if (
      !this.evidenceText.trim() &&
      !this.evidenceUrl.trim()
    ) {

      this.submitError =
        'Debés ingresar una explicación o una URL como evidencia.';

      return;
    }

    this.isSubmitting = true;

    this.submitError = '';

    this.missionsService.submitMission(
      this.mission.id,
      this.evidenceText.trim() || undefined,
      this.evidenceUrl.trim() || undefined
    ).subscribe({

      next: (data) => {

        console.log(
          'Misión enviada:',
          data
        );

        this.isSubmitting = false;

        this.submitSuccess = true;

        // Guardamos inmediatamente
        // la entrega recién creada.
        this.mySubmission = data;

      },

      error: (error) => {

        console.error(
          'Error al enviar la misión:',
          error
        );

        this.isSubmitting = false;

        this.submitError =
          'No pudimos enviar la misión. Intentá nuevamente.';
      },

    });
  }


  // ================================
  // VOLVER
  // ================================

  goBack(): void {

    this.router.navigate(['/missions']);
  }

}