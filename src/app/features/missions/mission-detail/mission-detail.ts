import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MissionsService, Mission } from '../missions.service';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-mission-detail',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './mission-detail.html',
  styleUrl: './mission-detail.scss',
})
export class MissionDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private missionsService = inject(MissionsService);

  mission: Mission | null = null;

  //variables de submit
    evidenceText = '';
    evidenceUrl = '';

    isSubmitting = false;
    submitSuccess = false;
    submitError = '';

  ngOnInit(): void {
    const missionId = this.route.snapshot.paramMap.get('id');

    if (!missionId) {
      this.router.navigate(['/missions']);
      return;
    }

    this.loadMission(missionId);
  }

  loadMission(id: string): void {
    this.missionsService.getMission(id).subscribe({
      next: (data) => {
        console.log('Misión seleccionada:', data);

        this.mission = data;
      },
      error: (error) => {
        console.error('Error al cargar la misión:', error);

        this.router.navigate(['/missions']);
      }
    });
  }

  //funcion de envio 
  submitMission(): void {

  if (!this.mission) {
    return;
  }

  if (!this.evidenceText.trim() && !this.evidenceUrl.trim()) {
    this.submitError = 'Debés ingresar una explicación o una URL como evidencia.';
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

      console.log('Misión enviada:', data);

      this.isSubmitting = false;
      this.submitSuccess = true;

    },

    error: (error) => {

      console.error('Error al enviar la misión:', error);

      this.isSubmitting = false;
      this.submitError =
        'No pudimos enviar la misión. Intentá nuevamente.';
    }

  });
}

  goBack(): void {
    this.router.navigate(['/missions']);
  }
}