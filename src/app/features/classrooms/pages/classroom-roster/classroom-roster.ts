import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassroomService } from '../../../../core/services/classroom-service';
import {
  ClassroomRosterModel,
  Student,
} from '../../../../core/models/student.model';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

export function paginadorEspanol(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.itemsPerPageLabel = 'Estudiantes por página:';
  intl.nextPageLabel = 'Siguiente';
  intl.previousPageLabel = 'Anterior';
  intl.firstPageLabel = 'Primera página';
  intl.lastPageLabel = 'Última página';
  intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) return `0 de ${length}`;
    const start = page * pageSize + 1;
    const end = Math.min(start + pageSize - 1, length);
    return `${start} - ${end} de ${length}`;
  };
  return intl;
}
@Component({
  selector: 'app-classroom-roster',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginator,
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: paginadorEspanol() }],
  templateUrl: './classroom-roster.html',
  styleUrl: './classroom-roster.scss',
})
export class ClassroomRoster implements OnInit {
  classroomId: string | null = null;
  roster: ClassroomRosterModel | null = null;
  isLoading = true;
  displayedColumns: string[] = ['name', 'email', 'joinedAt', 'actions'];
  students: Student[] = [];
  dataSource = new MatTableDataSource<Student>([]);
  //paginador con viewChild
  @ViewChild(MatPaginator) set paginator(p: MatPaginator | undefined) {
    if (p) this.dataSource.paginator = p;
  }

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

        const students: Student[] = (data.students || []).map((s: any) => ({
          id: s.id,
          fullName: s.fullName,
          email: s.email,
          joinedAt: s.ClassroomStudent?.joinedAt ?? s.joinedAt,
        }));

        this.roster = {
          classroomId: data.id,
          classroomName: data.name,
          code: data.code,
          students,
          studentsCount: students.length,
        };

        this.dataSource.data = students;
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
            this.roster.studentsCount = this.roster.students.length;

            this.dataSource.data = [...this.roster.students];
          }
        });
    }
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
    alert(`Código ${code} copiado al portapapeles`);
  }
}
