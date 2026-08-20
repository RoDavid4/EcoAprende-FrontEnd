import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GamificationProfile {
  totalXp: number;
  level: number;
  currentStreak: number;
  badges: any[];
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

  getBadges(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/gamification/badges`
    );
  }
}