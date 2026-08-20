import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl: string;
  xpValue: number;
  category: 'ACADEMIC' | 'COMMUNITY' | 'STREAK' | 'SPECIAL';
  isActive: boolean;
}

export interface GamificationProfile {
  totalXp: number;
  level: number;
  currentStreak: number;
  badges: Badge[];
}

export interface LeaderboardUser {
  id: string;
  fullName: string;
  level: number;
  totalXp: number;
}

@Injectable({
  providedIn: 'root',
})
export class GamificationService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000';

  getProfile(): Observable<GamificationProfile> {
    return this.http.get<GamificationProfile>(
      `${this.apiUrl}/gamification/profile`
    );
  }

  getBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(
      `${this.apiUrl}/gamification/badges`
    );
  }

  getLeaderboard(): Observable<LeaderboardUser[]> {
    return this.http.get<LeaderboardUser[]>(
      `${this.apiUrl}/gamification/leaderboard`
    );
  }
}