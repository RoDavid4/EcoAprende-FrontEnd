import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminOverviewStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    byRole: {
      role: string;
      count: number;
    }[];
  };

  courses: {
    total: number;
    active: number;
    published: number;
    modules: number;
    lessons: number;
    quizzes: number;
  };

  classrooms: {
    total: number;
    avgStudentsPerClassroom: number;
  };

  gamification: {
    totalXp: number;
    totalBadgesGranted: number;
  };

  engagement: {
    totalLessonsCompleted: number;
    totalQuizzesPassed: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/admin';

  getOverviewStats(): Observable<AdminOverviewStats> {
    return this.http.get<AdminOverviewStats>(
      `${this.apiUrl}/stats/overview`
    );
  }

  getUsers(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  role: string = '',
  isActive: string = ''
): Observable<any> {

  let url =
    `${this.apiUrl}/users?page=${page}&limit=${limit}`;

  if (search.trim()) {
    url += `&search=${encodeURIComponent(search.trim())}`;
  }

  if (role) {
    url += `&role=${encodeURIComponent(role)}`;
  }

  if (isActive !== '') {
    url += `&isActive=${isActive}`;
  }

  return this.http.get<any>(url);
}

updateUserStatus(
  userId: string,
  isActive: boolean
): Observable<any> {
  return this.http.patch<any>(
    `${this.apiUrl}/users/${userId}/status`,
    { isActive }
  );
}

updateUserRole(
  userId: string,
  roleId: number
): Observable<any> {
  return this.http.patch<any>(
    `${this.apiUrl}/users/${userId}/role`,
    { roleId }
  );
}
}

