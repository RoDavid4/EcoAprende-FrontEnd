import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JoinClassModal } from '../../../shared/components/join-class-modal/join-class-modal';
import { CreateEditClassroomModal } from '../../../shared/components/create-edit-classroom-modal/create-edit-classroom-modal';
import { AuthService } from '../../../features/auth/services/auth.services';
import { BtnCreate } from '../../../shared/components/btn-create/btn-create';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    BtnCreate,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  userRole: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT';
  userName = '';
  userEmail = '';
  isMobileMenuOpen = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userName = user.fullName || 'Usuario';
        this.userEmail = user.email || '';
        this.userRole =
          (user.role?.toUpperCase() as 'STUDENT' | 'TEACHER' | 'ADMIN') ||
          'STUDENT';
      } catch (e) {
        console.error('Error al parsear el usuario:', e);
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.userName = '';
    this.router.navigate(['/login']);
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
          route: '/classrooms',
        },
        // {
        //   label: 'Misiones Eco',
        //   route: '/misiones',
        // },
      );
    }

    if (this.userRole === 'TEACHER' || this.userRole === 'ADMIN') {
      items.push(
        {
          label: 'Gestión de Aulas',
          route: '/classrooms',
        },
        {
          label: 'Cursos',
          route: '/courses',
        },
      );
    }

    return items;
  }
}
