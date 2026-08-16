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
      next: (data) => {
        this.classrooms = data;
        this.isLoading = false;
        console.log(`Aulas cargadas (${this.userRole}):`, data);
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
}
