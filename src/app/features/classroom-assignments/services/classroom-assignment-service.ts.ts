import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Classroom,
  CourseModule,
  AssignModulesPayload,
} from '../models/classroom-assignment.model';

@Injectable({
  providedIn: 'root',
})
export class ClassroomAssignmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/classrooms`);
  }

  getClassroomById(classroomId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/classrooms/${classroomId}`);
  }

  getAvailableModules(): Observable<CourseModule[]> {
    return this.http.get<CourseModule[]>(`${this.apiUrl}/modules`);
  }

  getClassroomModules(classroomId: string): Observable<CourseModule[]> {
    return this.http.get<CourseModule[]>(
      `${this.apiUrl}/classrooms/${classroomId}/modules`,
    );
  }

  assignModuleToClassroom(
    classroomId: string,
    moduleId: string,
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/classrooms/${classroomId}/modules`,
      { moduleId },
    );
  }

  removeModuleFromClassroom(
    classroomId: string,
    moduleId: string,
  ): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/classrooms/${classroomId}/modules/${moduleId}`,
    );
  }
}
