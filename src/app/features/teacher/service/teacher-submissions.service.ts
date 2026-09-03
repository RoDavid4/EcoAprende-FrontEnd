import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeacherSubmission {
  id: string;
  missionId: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  evidenceText: string | null;
  evidenceUrl: string | null;
  feedback: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;

  student: {
    id: string;
    fullName: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TeacherSubmissionsService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/missions';

  getSubmissionsByMission(
    missionId: string
  ): Observable<TeacherSubmission[]> {

    return this.http.get<TeacherSubmission[]>(
      `${this.apiUrl}/${missionId}/submissions`
    );
  }

  reviewSubmission(
    submissionId: string,
    data: {
      status: 'APPROVED' | 'REJECTED';
      feedback?: string;
    }
  ): Observable<TeacherSubmission> {

    return this.http.patch<TeacherSubmission>(
      `http://localhost:3000/missions/submissions/${submissionId}/review`,
      data
    );
  }
}