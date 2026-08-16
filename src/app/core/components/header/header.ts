import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JoinClassModal } from '../../../shared/components/join-class-modal/join-class-modal';
import { CreateEditClassroomModal } from '../../../shared/components/create-edit-classroom-modal/create-edit-classroom-modal';
import { AuthMock } from '../../services/auth-mock';

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
  userRole: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'TEACHER';
  userName = '';
  isMobileMenuOpen = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthMock,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userName = user.fullName || 'Usuario';
        this.userRole = user.role as 'STUDENT' | 'TEACHER' | 'ADMIN';
        console.log('Header:', user);
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
          'El student se unió con éxito. Aquí puedes recargar la lista de aulas.',
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
          'El student se unió con éxito. Aquí puedes recargar la lista de aulas.',
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
    const roles: ('STUDENT' | 'TEACHER' | 'ADMIN')[] = [
      'STUDENT',
      'TEACHER',
      'ADMIN',
    ];
    const currentIndex = roles.indexOf(this.userRole);
    const nextIndex = (currentIndex + 1) % roles.length;
    const newRole = roles[nextIndex];

    this.authService.setRole(newRole);

    const names = {
      STUDENT: 'Ana Gómez',
      TEACHER: 'Prof. García',
      ADMIN: 'Admin Eco',
    };
    this.userName = names[newRole];
    this.userRole = newRole;

    this.redirectByRole(newRole);

    console.log(`Rol cambiado a: ${newRole} - Redirigiendo...`);
  }

  private redirectByRole(role: 'STUDENT' | 'TEACHER' | 'ADMIN'): void {
    const routes = {
      STUDENT: '/classrooms/student',
      TEACHER: '/classrooms/teacher',
      ADMIN: '/classrooms/teacher',
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
      route: this.userRole === 'STUDENT' ? '/home' : '/home',
    });

    if (this.userRole === 'STUDENT') {
      items.push(
        {
          label: 'Mis Aulas',
          route: '/classrooms/student',
        },
        // {
        //   label: 'Misiones Eco',
        //   route: '/misiones',
        // },
      );
    }

    if (this.userRole === 'TEACHER' || this.userRole === 'ADMIN') {
      items.push({
        label: 'Gestión de Aulas',
        route: '/classrooms/teacher',
      });
    }

    return items;
  }
}
