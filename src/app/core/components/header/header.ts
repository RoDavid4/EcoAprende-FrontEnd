import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JoinClassModal } from '../../../shared/components/join-class-modal/join-class-modal';
import { CreateEditClassroomModal } from '../../../shared/components/create-edit-classroom-modal/create-edit-classroom-modal';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  userRole: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT';
  userName = '';
  isMobileMenuOpen = false;

  constructor(
    private dialog: MatDialog,
    private authService: Auth,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userName = user.name;
        this.userRole = user.role;
        console.log('Header: Usuario cargado:', user);
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  openJoinModal(): void {
    const dialogRef = this.dialog.open(JoinClassModal, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(
          'El estudiante se unió con éxito. Aquí puedes recargar la lista de aulas.',
        );
      }
    });
  }

  openCreateClassroomModal(): void {
    const dialogRef = this.dialog.open(CreateEditClassroomModal, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(
          'El estudiante se unió con éxito. Aquí puedes recargar la lista de aulas.',
        );
      }
    });
  }

  onPrimaryAction(): void {
    if (this.userRole === 'STUDENT') {
      this.openJoinModal();
    } else {
      this.openCreateClassroomModal();
    }
  }

  toggleRoleSimulated(): void {
    // Función rápida para probar cómo cambia la vista
    const roles: ('STUDENT' | 'TEACHER' | 'ADMIN')[] = [
      'STUDENT',
      'TEACHER',
      'ADMIN',
    ];
    const currentIndex = roles.indexOf(this.userRole);
    const nextIndex = (currentIndex + 1) % roles.length;
    this.authService.setRole(roles[nextIndex]);
    const newRole = roles[nextIndex];

    this.authService.setRole(newRole);

    const names = {
      STUDENT: 'Ana Gómez',
      TEACHER: 'Prof. García',
      ADMIN: 'Admin Eco',
    };
    this.userName = names[this.userRole];
    this.userRole = newRole;

    this.redirectByRole(newRole);

    console.log(`Rol cambiado a: ${newRole} - Redirigiendo...`);
  }

  private redirectByRole(role: 'STUDENT' | 'TEACHER' | 'ADMIN'): void {
    const routes = {
      STUDENT: '/classrooms/estudiante',
      TEACHER: '/classrooms/profesor',
      ADMIN: '/classrooms/profesor',
    };

    const targetRoute = routes[role];

    if (this.router.url === targetRoute) {
      console.log(`Ya estás en ${targetRoute}`);
      return;
    }

    console.log(`Navegando a: ${targetRoute}`);
    this.router.navigate([targetRoute]);
  }

  get navItems() {
    const items = [];
    items.push({
      label: 'Inicio',
      route:
        this.userRole === 'STUDENT'
          ? '/classrooms/estudiante'
          : '/classrooms/profesor',
    });

    if (this.userRole === 'STUDENT') {
      items.push(
        {
          label: 'Mis Aulas',
          route: '/classrooms/estudiante',
        },
        {
          label: 'Misiones Eco',
          route: '/misiones',
        },
      );
    }

    if (this.userRole === 'TEACHER' || this.userRole === 'ADMIN') {
      items.push({
        label: 'Gestión de Aulas',
        route: '/classrooms/profesor',
      });
    }

    return items;
  }
}
