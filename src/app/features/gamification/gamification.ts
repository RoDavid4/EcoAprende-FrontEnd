import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import {
  GamificationService,
  Badge,
  LeaderboardUser,
} from './services/gamification.service';

@Component({
  selector: 'app-gamification',
  imports: [
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './gamification.html',
  styleUrl: './gamification.scss',
})
export class Gamification implements OnInit {

  private gamificationService = inject(GamificationService);

  totalXp = 0;
  level = 0;
  currentStreak = 0;

  badges: Badge[] = [];
  leaderboard: LeaderboardUser[] = [];

  ngOnInit(): void {
    this.loadProfile();
    this.loadBadges();
    this.loadLeaderboard();
  }

  loadProfile(): void {

    this.gamificationService.getProfile().subscribe({

      next: (data) => {

        console.log('Perfil de gamificación:', data);

        this.totalXp = data.totalXp;
        this.level = data.level;
        this.currentStreak = data.currentStreak;

      },

      error: (error) => {

        console.error(
          'Error al cargar perfil de gamificación:',
          error
        );

      }

    });

  }

  loadBadges(): void {

    this.gamificationService.getBadges().subscribe({

      next: (data) => {

        console.log('Insignias:', data);

        this.badges = data;

      },

      error: (error) => {

        console.error(
          'Error al cargar insignias:',
          error
        );

      }

    });

  }

  loadLeaderboard(): void {

    this.gamificationService.getLeaderboard().subscribe({

      next: (data) => {

        console.log('Leaderboard:', data);

        this.leaderboard = data;

      },

      error: (error) => {

        console.error(
          'Error al cargar leaderboard:',
          error
        );

      }

    });

  }

  getXpProgress(): number {

    const xpPerLevel = 1000;

    return Math.min(
      ((this.totalXp % xpPerLevel) / xpPerLevel) * 100,
      100
    );

  }

}