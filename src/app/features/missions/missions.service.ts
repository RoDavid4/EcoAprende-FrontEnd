import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'DIGITAL' | 'PRACTICAL';
  pointsReward: number;
  instructions?: string;
  imageUrl?: string;
  moduleId?: string;
  createdById: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MissionSubmission {
  id: string;
  missionId: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  evidenceText?: string;
  evidenceUrl?: string;
  feedback?: string;
  reviewedById?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MissionsService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000';

  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(
      `${this.apiUrl}/missions`
    );
  }

  getMission(id: string): Observable<Mission> {
    return this.http.get<Mission>(
      `${this.apiUrl}/missions/${id}`
    );
  }

  getMySubmissions(): Observable<MissionSubmission[]> {
    return this.http.get<MissionSubmission[]>(
      `${this.apiUrl}/missions/submissions/my-submissions`
    );
  }
}