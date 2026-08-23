import { Component, inject, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  MissionsService,
  Mission,
} from './missions.service';

@Component({
  selector: 'app-missions',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './missions.html',
  styleUrl: './missions.scss',
})
export class Missions implements OnInit {

  private missionsService = inject(MissionsService);

  missions: Mission[] = [];

  ngOnInit(): void {
    this.loadMissions();
  }

  loadMissions(): void {
    this.missionsService.getMissions().subscribe({
      next: (data) => {
        console.log('Misiones:', data);

        this.missions = data;
      },

      error: (error) => {
        console.error('Error al cargar las misiones:', error);
      },
    });
  }
}