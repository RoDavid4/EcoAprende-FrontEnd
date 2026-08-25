import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';


import {
  MissionsService,
  Mission,
  MissionSubmission,
} from '../missions.service';

@Component({
  selector: 'app-my-submissions',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './my-submissions.html',
  styleUrl: './my-submissions.scss',
})
export class MySubmissions implements OnInit {

  private missionsService = inject(MissionsService);
  private router = inject(Router);

  submissions: MissionSubmission[] = [];
  missions: Mission[] = [];

  isLoading = true;

  errorMessage = '';


  ngOnInit(): void {
    this.loadSubmissions();
  }

  loadSubmissions(): void {

  this.isLoading = true;
  this.errorMessage = '';

  this.missionsService.getMissions().subscribe({

    next: (missions) => {

      this.missions = missions;

      this.missionsService.getMySubmissions().subscribe({

        next: (submissions) => {

          console.log('Misiones:', missions);
          console.log('Mis entregas:', submissions);

          this.submissions = submissions;

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'Error al cargar mis entregas:',
            error
          );

          this.errorMessage =
            'No se pudieron cargar tus entregas.';

          this.isLoading = false;
        },

      });

    },

    error: (error) => {

      console.error(
        'Error al cargar las misiones:',
        error
      );

      this.errorMessage =
        'No se pudieron cargar tus entregas.';

      this.isLoading = false;
    },

  });
}

  getStatusLabel(
    status: MissionSubmission['status']
  ): string {

    switch (status) {

      case 'PENDING':
        return 'Pendiente de revisión';

      case 'APPROVED':
        return 'Aprobada';

      case 'REJECTED':
        return 'Rechazada';

      default:
        return status;
    }
  }

  getStatusIcon(
    status: MissionSubmission['status']
  ): string {

    switch (status) {

      case 'PENDING':
        return 'schedule';

      case 'APPROVED':
        return 'check_circle';

      case 'REJECTED':
        return 'cancel';

      default:
        return 'help_outline';
    }
  }

  getMissionTitle(missionId: string): string {

  const mission = this.missions.find(
    mission => mission.id === missionId
  );

  return mission?.title ?? 'Misión';
}

  goBack(): void {
    this.router.navigate(['/missions']);
  }

  goToMissions(): void {
    this.router.navigate(['/missions']);
  }
}