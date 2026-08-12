import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-teacher-dashboard',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ClassroomList,
  ],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.scss',
})
export class TeacherDashboard implements OnInit {
  classrooms: Classroom[] = [];
  isLoading = true;
  private classroomSub!: Subscription;

  constructor(
    private classroomService: ClassroomService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadClassrooms();
    this.classroomSub = this.classroomService.classroomChanged$.subscribe(
      () => {
        this.loadClassrooms();
      },
    );
  }

  loadClassrooms(): void {
    this.isLoading = true;
    this.classroomService.getClassrooms().subscribe({
      next: (data) => {
        this.classrooms = data;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
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
    const dialogRef = this.dialog.open(CreateEditClassroomModal, {
      width: '420px',
      data: classroom,
    });
    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) this.loadClassrooms();
    });
  }

  goToRoster(classroomId: string): void {
    this.router.navigate(['/estudiantes', classroomId]);
  }
}
