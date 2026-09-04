import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../services/admin.service';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string | null;

  payload: {
    roleId?: number;
    isActive?: boolean;
  };

  ipAddress: string;
  userAgent: string;
  createdAt: string;

  user?: {
    id: string;
    fullName: string;
    email: string;
    roleId: number;
    isActive: boolean;
  };
}

interface AuditLogsResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Component({
  selector: 'app-admin-audit',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './audit.html',
  styleUrl: './audit.scss'
})
export class AdminAudit implements OnInit {

  private adminService = inject(AdminService);

  logs: AuditLog[] = [];

  loading = true;
  errorMessage = '';

  currentPage = 1;
  pageSize = 10;

  totalLogs = 0;
  totalPages = 0;


  selectedLog: AuditLog | null = null;
showDetailsModal = false;

viewLogDetails(log: AuditLog): void {
  this.selectedLog = log;
  this.showDetailsModal = true;
}

closeDetailsModal(): void {
  this.showDetailsModal = false;
  this.selectedLog = null;
}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  private loadAuditLogs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getAuditLogs(
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response: AuditLogsResponse) => {
        console.log('Registros de auditoría:', response);

        this.logs = response.data;
        this.totalLogs = response.total;
        this.totalPages = response.totalPages;

        this.loading = false;
      },
      error: (error) => {
        console.error(
          'Error al cargar registros de auditoría:',
          error
        );

        this.errorMessage =
          'No se pudieron cargar los registros de auditoría.';

        this.loading = false;
      }
    });
  }

  

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.loadAuditLogs();
  }

  getActionLabel(log: AuditLog): string {
  if (log.action === 'USER_ROLE_UPDATED') {
    return 'Cambio de rol';
  }

  if (log.action === 'USER_STATUS_UPDATED') {
    return log.payload?.isActive
      ? 'Usuario activado'
      : 'Usuario desactivado';
  }

  return log.action;
}

getAuditDescription(log: AuditLog): string {
  if (log.action === 'USER_ROLE_UPDATED') {
    const roleNames: Record<number, string> = {
      1: 'Administrador',
      2: 'Docente',
      3: 'Estudiante'
    };

    const roleName =
      roleNames[log.payload?.roleId ?? 0] ?? 'otro rol';

    return `cambió el rol de un usuario a ${roleName}`;
  }

  if (log.action === 'USER_STATUS_UPDATED') {
    return log.payload?.isActive
      ? 'activó un usuario'
      : 'desactivó un usuario';
  }

  return 'realizó una acción';
}
}