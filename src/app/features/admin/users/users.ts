import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  roleId: number;
  isActive: boolean;
  totalXp: number;
  level: number;
  currentStreak: number;
  lastActivityDate: string | null;
  lessonsCompleted: number;
  quizzesPassed: number;
  missionsApproved: number;
  createdAt: string;
  updatedAt: string;
  role: {
    id: number;
    name: string;
    description: string;
  };
}

interface AdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Component({
  selector: 'app-admin-users',
  imports: [
    MatIconModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class AdminUsers implements OnInit {

  private adminService = inject(AdminService);

  users: AdminUser[] = [];
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';
  selectedUser: AdminUser | null = null;
  showRoleModal = false;
selectedRoleId = 3;

  loading = true;
  errorMessage = '';

  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
  this.loading = true;
  this.errorMessage = '';

  this.adminService.getUsers(
    this.currentPage,
    this.pageSize,
    this.searchTerm,
    this.selectedRole,
     this.selectedStatus
  ).subscribe({
      next: (response: AdminUsersResponse) => {
        console.log('Usuarios del administrador:', response);

        this.users = response.data;
        this.totalUsers = response.total;
        this.totalPages = response.totalPages;

        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);

        this.errorMessage = 'No se pudieron cargar los usuarios.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
  this.currentPage = 1;
  this.loadUsers();
}

onRoleChange(): void {
  this.currentPage = 1;
  this.loadUsers();
}

onStatusChange(): void {
  this.currentPage = 1;
  this.loadUsers();
}

onPageChange(page: number): void {
  if (page < 1 || page > this.totalPages) {
    return;
  }

  this.currentPage = page;
  this.loadUsers();
}

openUserMenu(user: AdminUser): void {
  this.selectedUser =
    this.selectedUser?.id === user.id
      ? null
      : user;
}

viewUser(user: AdminUser): void {
  console.log('Ver usuario:', user);
}

changeUserRole(user: AdminUser): void {
  this.selectedUser = user;
  this.selectedRoleId = user.roleId;
  this.showRoleModal = true;
}

saveUserRole(): void {
  if (!this.selectedUser) {
    return;
  }

  this.adminService.updateUserRole(
    this.selectedUser.id,
    this.selectedRoleId
  ).subscribe({
    next: (response) => {
      console.log('Rol actualizado:', response);

      this.showRoleModal = false;
      this.selectedUser = null;

      this.loadUsers();
    },
    error: (error) => {
      console.error(
        'Error al actualizar el rol:',
        error
      );

      this.errorMessage =
        'No se pudo actualizar el rol del usuario.';
    }
  });
}

closeRoleModal(): void {
  this.showRoleModal = false;
  this.selectedUser = null;
}

toggleUserStatus(user: AdminUser): void {

  const newStatus = !user.isActive;

  const action = newStatus
    ? 'activar'
    : 'desactivar';

  const confirmed = window.confirm(
    `¿Estás seguro de que deseas ${action} a ${user.fullName}?`
  );

  if (!confirmed) {
    return;
  }

  this.adminService.updateUserStatus(
    user.id,
    newStatus
  ).subscribe({
    next: (response) => {
      console.log('Estado actualizado:', response);

      this.selectedUser = null;

      this.loadUsers();
    },

    error: (error) => {
      console.error(
        'Error al actualizar estado del usuario:',
        error
      );

      this.errorMessage =
        'No se pudo actualizar el estado del usuario.';
    }
  });
}


}

