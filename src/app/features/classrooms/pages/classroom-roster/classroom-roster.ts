import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassroomService } from '../../../../core/services/classroom-service';
import {
  ClassroomRosterModel,
  Student,
} from '../../../../core/models/student.model';

@Component({
  selector: 'app-classroom-roster',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './classroom-roster.html',
  styleUrl: './classroom-roster.scss',
})
export class ClassroomRoster implements OnInit {
  classroomId: string | null = null;
  roster: ClassroomRosterModel | null = null;
  isLoading = true;
  displayedColumns: string[] = ['name', 'email', 'joinedAt', 'actions'];
  students: Student[] = [];

  constructor(
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
  ) {}

  ngOnInit(): void {
    this.classroomId = this.route.snapshot.paramMap.get('id');
    if (this.classroomId) {
      this.loadRoster(this.classroomId);
    } else {
      console.error('No se encontró ningún parámetro "id" en la ruta activa.');
      this.isLoading = false;
    }
  }

  loadRoster(id: string): void {
    this.isLoading = true;
    this.classroomService.getClassroomById(id).subscribe({
      next: (data: any) => {
        console.log('Respuesta completa:', data);

        this.roster = {
          classroomId: data.id,
          classroomName: data.name,
          code: data.code,
          students: (data.students || []).map((s: any) => ({
            id: s.id,
            fullName: s.fullName,
            email: s.email,
            joinedAt: s.ClassroomStudent?.joinedAt || new Date(),
          })),
          studentsCount: data.students?.length || 0,
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar nómina:', error);
      },
    });
  }

  removeStudent(student: Student): void {
    if (confirm(`¿Estás seguro de remover a ${student.fullName} del aula?`)) {
      this.classroomService
        .removeStudentFromClassroom(this.classroomId!, student.id)
        .subscribe(() => {
          if (this.roster) {
            this.roster.students = this.roster.students.filter(
              (s) => s.id !== student.id,
            );
          }
        });
    }
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
    alert(`Código ${code} copiado al portapapeles`);
  }
}
