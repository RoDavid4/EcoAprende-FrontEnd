import { inject, Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Classroom, ClassroomDetail } from '../models/classroom.model';
import { ClassroomRosterModel, Student } from '../models/student.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/classrooms';

  private classroomChangedSubject = new Subject<void>();
  classroomChanged$ = this.classroomChangedSubject.asObservable();

  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(this.apiUrl);
  }

  createClassroom(data: {
    name: string;
    description: string;
  }): Observable<Classroom> {
    return this.http
      .post<Classroom>(this.apiUrl, data)
      .pipe(tap(() => this.classroomChangedSubject.next()));
  }

  // PUT: Editar aula existente
  updateClassroom(
    id: string,
    data: { name: string; description: string },
  ): Observable<Classroom> {
    return this.http.patch<Classroom>(`${this.apiUrl}/${id}`, data);
  }

  // POST: Unirse por código
  joinClassroomByCode(code: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/join`, { code });
  }

  //Lista de estudiantes
  getRosterByClassroomId(
    classroomId: string,
  ): Observable<ClassroomRosterModel> {
    return this.http.get<any>(`${this.apiUrl}/${classroomId}/students`);
  }

  removeStudentFromClassroom(
  classroomId: string,
  studentId: string,
): Observable<{ message: string }> {

  return this.http.delete<{ message: string }>(
    `${this.apiUrl}/${classroomId}/students/${studentId}`,
  );
}

  deleteClassroom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getClassroomById(id: string): Observable<ClassroomDetail> {
    return this.http.get<Classroom>(`${this.apiUrl}/${id}`);
  }

  getClassroomStudentCount(classroomId: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/${classroomId}/students/count`,
    );
  }

  getClassroomMetrics(classroomId: string): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/${classroomId}/metrics`
  );
}
}
