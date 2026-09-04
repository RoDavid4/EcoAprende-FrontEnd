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

export interface CreateMissionRequest {
  title: string;
  description: string;
  type: 'DIGITAL' | 'PRACTICAL';
  pointsReward: number;
  instructions?: string;
  imageUrl?: string;
  moduleId?: string;
  isActive?: boolean;
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

  createMission(
  mission: CreateMissionRequest
): Observable<Mission> {
  return this.http.post<Mission>(
    `${this.apiUrl}/missions`,
    mission
  );
}

updateMission(
  id: string,
  mission: Partial<CreateMissionRequest>
): Observable<Mission> {
  return this.http.patch<Mission>(
    `${this.apiUrl}/missions/${id}`,
    mission
  );
}

deleteMission(id: string): Observable<void> {
  return this.http.delete<void>(
    `${this.apiUrl}/missions/${id}`
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

  submitMission(
  id: string,
  evidenceText?: string,
  evidenceUrl?: string
): Observable<MissionSubmission> {

  return this.http.post<MissionSubmission>(
    `${this.apiUrl}/missions/${id}/submit`,
    {
      evidenceText,
      evidenceUrl
    }
  );
}
}