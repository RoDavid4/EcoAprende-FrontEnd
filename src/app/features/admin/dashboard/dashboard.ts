import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../services/admin.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatIconModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);

  stats: any = null;
  loading = true;
  errorMessage = '';
  studentCount = 0;
  teacherCount = 0;
  adminCount = 0;

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getOverviewStats().subscribe({
      next: (response) => {
        console.log('Estadísticas del administrador:', response);

        this.stats = response;
        this.studentCount =
          response.users.byRole.find((role) => role.role === 'STUDENT')
            ?.count ?? 0;

        this.teacherCount =
          response.users.byRole.find((role) => role.role === 'TEACHER')
            ?.count ?? 0;

        this.adminCount =
          response.users.byRole.find((role) => role.role === 'ADMIN')?.count ??
          0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);

        this.errorMessage = 'No se pudieron cargar las estadísticas.';
        this.loading = false;
      },
    });
  }
}
