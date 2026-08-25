import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClassroomAssignmentService } from '../../../classroom-assignments/services/classroom-assignment-service.ts';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BtnCreate } from '../../../../shared/components/btn-create/btn-create.js';
import { AuthService } from '../../../auth/services/auth.services.js';

@Component({
  selector: 'app-classroom-detail',
  imports: [MatIconModule, CommonModule, RouterLink, BtnCreate],
  templateUrl: './classroom-detail.html',
  styleUrl: './classroom-detail.scss',
})
export class ClassroomDetail implements OnInit {
  classroomId: string = '';
  classroom: any = null;
  assignedModules: any[] = [];
  userRole: 'TEACHER' | 'STUDENT' | 'ADMIN' | string = 'STUDENT';

  metrics = {
    totalStudents: 0,
    averageProgress: 0,
  };

  recentActivities: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentService: ClassroomAssignmentService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.role) {
      this.userRole = user.role.toUpperCase();
    }
    this.classroomId = this.route.snapshot.paramMap.get('id') || '';
    if (this.classroomId) {
      this.loadClassroomDetail();
    }
  }
  get isStudent(): boolean {
    return this.userRole === 'STUDENT';
  }

  get isAdminOrTeacher(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'TEACHER';
  }

  loadClassroomDetail(): void {
    this.assignmentService.getClassroomModules(this.classroomId).subscribe({
      next: (modules: any[]) => {
        this.assignedModules = modules.map((mod) => ({
          ...mod,
          id: mod.id || mod.moduleId,
          title: mod.title || mod.name || 'Módulo sin nombre',
          courseTitle: mod.course?.title || mod.courseTitle || null,
        }));
      },
      error: (err) => console.error('Error cargando módulos del aula:', err),
    });

    if (this.assignmentService.getClassroomById) {
      this.assignmentService.getClassroomById(this.classroomId).subscribe({
        next: (data) => {
          this.classroom = data;

          this.metrics.totalStudents =
            data.studentsCount ??
            data.totalStudents ??
            (Array.isArray(data.students) ? data.students.length : 0);

          this.metrics.averageProgress =
            data.averageProgress ?? data.progress ?? 0;

          console.log('Respuesta de Classroom Detail:', data);
        },
        error: (err) => console.error('Error cargando aula:', err),
      });
    }
  }

  goToAssignModules(): void {
    this.router.navigate(['/classrooms', this.classroomId, 'assignments']);
  }

  viewModuleDetail(moduleId: string): void {
    this.router.navigate(['/modules', moduleId]);
  }
}
