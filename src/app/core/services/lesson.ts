import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/lessons';

  createLesson(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  updateLesson(id: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, payload);
  }

  deleteLesson(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
