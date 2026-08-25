import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClassroomService } from '../../../../core/services/classroom-service';
import { Classroom } from '../../../../core/models/classroom.model';
import { CreateEditClassroomModal } from '../../../../shared/components/create-edit-classroom-modal/create-edit-classroom-modal';
import { ClassroomList } from '../../components/classroom-list/classroom-list';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-classroom-management',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ClassroomList,
  ],
  templateUrl: './classroom-management.html',
  styleUrl: './classroom-management.scss',
})
export class ClassroomManagement implements OnInit {
  classrooms: Classroom[] = [];
  isLoading = true;
  userRole: 'TEACHER' | 'STUDENT' | 'ADMIN' | string = 'STUDENT';

  private classroomSub!: Subscription;
  private authService = inject(AuthService);
  constructor(
    private classroomService: ClassroomService,

    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.role) {
      this.userRole = user.role.toUpperCase();
    }

    this.loadClassrooms();

    this.classroomSub = this.classroomService.classroomChanged$.subscribe(
      () => {
        this.loadClassrooms();
      },
    );
  }

  ngOnDestroy(): void {
    if (this.classroomSub) {
      this.classroomSub.unsubscribe();
    }
  }

  loadClassrooms(): void {
    this.isLoading = true;

    this.classroomService.getClassrooms().subscribe({
      next: (list) => {
        if (list.length === 0) {
          this.classrooms = [];
          this.isLoading = false;
          console.log(`Aulas cargadas (${this.userRole}): []`);
          return;
        }

        forkJoin(
          list.map((c) => this.classroomService.getClassroomById(c.id)),
        ).subscribe({
          next: (details) => {
            this.classrooms = list.map((c, i) => ({
              ...c,
              studentsCount: details[i]?.students?.length || 0,
            }));
            this.isLoading = false;
            console.log(`Aulas cargadas (${this.userRole}):`, this.classrooms);
          },
          error: () => {
            this.classrooms = list;
            this.isLoading = false;
            console.warn('No se pudo obtener el detalle de las aulas');
          },
        });
      },
      error: () => {
        this.isLoading = false;
        console.error('Error al cargar aulas');
      },
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(CreateEditClassroomModal, {
      width: '420px',
    });
    dialogRef.afterClosed().subscribe((created) => {
      if (created) this.loadClassrooms();
    });
  }

  openEditModal(classroom: Classroom): void {
    if (this.userRole === 'STUDENT') {
      return;
    }
    const dialogRef = this.dialog.open(CreateEditClassroomModal, {
      width: '420px',
      data: classroom,
    });
    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) this.loadClassrooms();
    });
  }

  goToRoster(classroomId: string): void {
    if (this.userRole === 'STUDENT') {
      return;
    }
    this.router.navigate(['/classrooms', classroomId, 'lista']);
  }

  handleGoToDetail(classroomId: string): void {
    this.router.navigate(['/classrooms', classroomId]);
  }

  onDeleteClassroom(classroom: Classroom): void {
    const confirmacion = confirm(
      `¿Estás seguro de que deseas eliminar el aula "${classroom.name}"?`,
    );

    if (confirmacion && classroom.id) {
      this.classroomService.deleteClassroom(classroom.id).subscribe({
        next: () => {
          this.loadClassrooms();
        },
        error: (err) => console.error('Error al eliminar el aula:', err),
      });
    }
  }
}
