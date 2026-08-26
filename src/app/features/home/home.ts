import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../auth/services/auth.services';

import { GamificationService,LeaderboardUser, Badge, BadgeIcon } from '../gamification/services/gamification.service';
import { MissionsService } from '../missions/missions.service';
import { Mission } from '../missions/missions.service';


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
  private missionsService = inject(MissionsService);
  private router = inject(Router);
  private gamificationService = inject(GamificationService);

  leaderboard: LeaderboardUser[] = [];
  userName = '';
  userRole = '';

  totalXp = 0;
  level = 0;
  currentStreak = 0;
  missions: Mission[] = [];
  badges: Badge[] = [];
  badgeIcons: BadgeIcon[] = [];

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    

    if (storedUser) {
      const user = JSON.parse(storedUser);

      this.userName = user.fullName;
      this.userRole = user.role;
    }
     this.loadGamification();
     this.loadLeaderboard();
     this.loadMissions();
     this.loadBadges();
     this.loadBadgeIcons();
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

  loadMissions(): void {
  this.missionsService.getMissions().subscribe({
    next: (data) => {
      this.missions = data;

      console.log('Misiones:', this.missions);
    },
    error: (error) => {
      console.error('Error al cargar misiones:', error);
    }
  });
}


loadBadges(): void {
  this.gamificationService.getBadges().subscribe({
    next: (data) => {
      console.log('Insignias:', data);

      this.badges = data.slice(0, 3);
    },
    error: (error) => {
      console.error('Error al cargar insignias:', error);
    }
  });
}

loadBadgeIcons(): void {
  this.gamificationService.getBadgeIcons().subscribe({
    next: (data) => {
      console.log('Iconos de insignias:', data);

      this.badgeIcons = data;
    },
    error: (error) => {
      console.error(
        'Error al cargar iconos de insignias:',
        error
      );
    }
  });
}

getBadgeIconUrl(iconId: string): string {
  const icon = this.badgeIcons.find(
    (badgeIcon) => badgeIcon.id === iconId
  );

  return icon?.url ?? '';
}

getXpProgress(): number {
  const currentLevel = this.level;

  const currentLevelMinXp =
    Math.pow(currentLevel - 1, 2) * 100;

  const nextLevelMinXp =
    Math.pow(currentLevel, 2) * 100;

  const xpInLevel =
    this.totalXp - currentLevelMinXp;

  const xpRequiredForLevel =
    nextLevelMinXp - currentLevelMinXp;

  if (xpRequiredForLevel <= 0) {
    return 100;
  }

  return Math.min(
    Math.max(
      (xpInLevel / xpRequiredForLevel) * 100,
      0
    ),
    100
  );
}

getXpToNextLevel(): number {
  const nextLevel = this.level + 1;

  const nextLevelXp = Math.pow(nextLevel - 1, 2) * 100;

  return Math.max(nextLevelXp - this.totalXp, 0);
}

loadLeaderboard(): void {
  this.gamificationService.getLeaderboard().subscribe({
    next: (data) => {
  console.log('Leaderboard:', data);

  this.leaderboard = data.data;
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