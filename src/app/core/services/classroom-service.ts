import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Classroom } from '../models/classroom.model';
import { ClassroomRosterModel, Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private mockClassrooms: Classroom[] = [
    {
      id: '1',
      name: 'Biología 5to Grado',
      description: 'Curso de biología para estudiantes de 5to',
      studentsCount: 28,
      code: 'BIO5G2',
    },
    {
      id: '2',
      name: 'Ciencias Naturales',
      description: 'Curso de ciencias naturales',
      studentsCount: 32,
      code: 'EART1X',
    },
  ];

  private classroomChangedSubject = new Subject<void>();
  classroomChanged$ = this.classroomChangedSubject.asObservable();

  getClassrooms(): Observable<Classroom[]> {
    return of([...this.mockClassrooms]).pipe(delay(600));
  }

  // POST: Crear aula (Genera código de 6 caracteres automáticos)
  createClassroom(data: {
    name: string;
    description: string;
  }): Observable<Classroom> {
    const newClassroom: Classroom = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      studentsCount: 0,
      code: this.generateRandomCode(),
    };
    this.mockClassrooms.push(newClassroom);
    this.classroomChangedSubject.next();
    return of(newClassroom).pipe(delay(600));
  }

  // PUT: Editar aula existente
  updateClassroom(
    id: string,
    data: { name: string; description: string },
  ): Observable<Classroom> {
    const index = this.mockClassrooms.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.mockClassrooms[index] = { ...this.mockClassrooms[index], ...data };
      return of(this.mockClassrooms[index]);
    }
    return throwError(() => new Error('Aula no encontrada'));
  }

  // POST: Unirse por código
  joinClassroomByCode(code: string): Observable<{ message: string }> {
    const found = this.mockClassrooms.find(
      (c) => c.code.toUpperCase() === code.toUpperCase(),
    );
    if (found) {
      return of({ message: 'Te has unido con éxito' }).pipe(delay(800));
    }
    return throwError(() => ({
      status: 404,
      message: 'Código no encontrado',
    })).pipe(delay(800));
  }

  private generateRandomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  //Lista de estudiantes
  getRosterByClassroomId(
    classroomId: string,
  ): Observable<ClassroomRosterModel> {
    const classroom = this.mockClassrooms.find((c) => c.id === classroomId);

    const mockStudentsMap: Record<string, Student[]> = {
      '1': [
        {
          id: '101',
          name: 'Carlos Mendoza',
          email: 'carlos.mendoza@eco.edu',
          joinedAt: '2026-02-10',
        },
        {
          id: '102',
          name: 'Sofía Torres',
          email: 'sofia.torres@eco.edu',
          joinedAt: '2026-02-12',
        },
      ],
      '2': [
        {
          id: '201',
          name: 'Mateo Rossi',
          email: 'mateo.rossi@eco.edu',
          joinedAt: '2026-02-15',
        },
        {
          id: '202',
          name: 'Lucía Fernández',
          email: 'lucia.f@eco.edu',
          joinedAt: '2026-02-18',
        },
        {
          id: '203',
          name: 'Gabriel Silva',
          email: 'gabriel.s@eco.edu',
          joinedAt: '2026-02-20',
        },
      ],
    };

    const students = mockStudentsMap[classroomId] || [];

    return of({
      classroomId,
      classroomName: classroom ? classroom.name : 'Aula Desconocida',
      code: classroom ? classroom.code : 'CODE00',
      studentsCount: students.length,
      students: students,
    });
  }

  removeStudentFromClassroom(
    classroomId: string,
    studentId: string,
  ): Observable<boolean> {
    return of(true);
  }
}
