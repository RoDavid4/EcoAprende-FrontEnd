import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../auth/services/auth.services';

import { GamificationService,LeaderboardUser } from '../gamification/services/gamification.service'; 

@Component({
  selector: 'app-home',
  imports: [
     MatButtonModule,
  MatIconModule,
  RouterLink,
  MatCardModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private gamificationService = inject(GamificationService);

  leaderboard: LeaderboardUser[] = [];
  userName = '';
  userRole = '';

  totalXp = 0;
  level = 0;
  currentStreak = 0;

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);

      this.userName = user.fullName;
      this.userRole = user.role;
    }
     this.loadGamification();
     this.loadLeaderboard();
  }

   loadGamification(): void {
    this.gamificationService.getProfile().subscribe({
      next: (data) => {
        console.log('Perfil de gamificación:', data);

        this.totalXp = data.totalXp;
        this.level = data.level;
        this.currentStreak = data.currentStreak;
      },
      error: (error) => {
        console.error('Error al cargar gamificación:', error);
      }
    });

  }


getXpProgress(): number {
  const xpPerLevel = 1000;

  return Math.min(
    (this.totalXp % xpPerLevel) / xpPerLevel * 100,
    100
  );
}

loadLeaderboard(): void {
  this.gamificationService.getLeaderboard().subscribe({
    next: (data) => {
      console.log('Leaderboard:', data);
      this.leaderboard = data;
    },
    error: (error) => {
      console.error('Error al cargar leaderboard:', error);
    }
  });
}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}