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
  category:
    | 'ECOLOGY'
    | 'ACADEMIC'
    | 'COMMUNITY'
    | 'STREAK'
    | 'SPECIAL';
  isActive: boolean;
  isUnlocked: boolean;
}

export interface BadgeIcon {
  id: string;
  name: string;
  category: string;
  url: string;
}

export interface CreateBadgeRequest {
  code: string;
  name: string;
  description: string;
  iconUrl: string;
  xpValue?: number;
  category?:
    | 'ECOLOGY'
    | 'ACADEMIC'
    | 'COMMUNITY'
    | 'STREAK'
    | 'SPECIAL';
  triggerEvent?:
    | 'STREAK'
    | 'TOTAL_XP'
    | 'LESSONS_COMPLETED'
    | 'QUIZZES_PASSED'
    | 'MISSIONS_APPROVED'
    | 'MANUAL';
  triggerValue?: number;
}

export interface GamificationProfile {
  totalXp: number;
  level: number;
  currentStreak: number;
  badges: Badge[];
}

export interface LeaderboardUser {
  id: string;
  firstName: string;
  lastName: string;
  level: number;
  totalXp: number;
  currentStreak: number;
  rank: number;
}

export interface LeaderboardResponse {
  data: LeaderboardUser[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
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

  getBadgeIcons(): Observable<BadgeIcon[]> {
  return this.http.get<BadgeIcon[]>(
    `${this.apiUrl}/gamification/badges/icons`
  );
}

createBadge(badge: CreateBadgeRequest): Observable<Badge> {
  return this.http.post<Badge>(
    `${this.apiUrl}/gamification/badges`,
    badge
  );
}

  getLeaderboard(): Observable<LeaderboardResponse> {
  return this.http.get<LeaderboardResponse>(
    `${this.apiUrl}/gamification/leaderboard`
  );
}
}