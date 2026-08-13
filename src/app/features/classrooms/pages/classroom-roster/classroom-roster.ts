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

  constructor(
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
  ) {}

  ngOnInit(): void {
    this.classroomId = this.route.snapshot.paramMap.get('id');
    if (this.classroomId) {
      this.loadRoster(this.classroomId);
    }
  }

  loadRoster(id: string): void {
    this.isLoading = true;
    this.classroomService.getRosterByClassroomId(id).subscribe({
      next: (data) => {
        this.roster = data;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  removeStudent(student: Student): void {
    if (confirm(`¿Estás seguro de remover a ${student.name} del aula?`)) {
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
