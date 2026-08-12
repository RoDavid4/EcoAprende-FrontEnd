import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JoinClassModal } from '../../../shared/components/join-class-modal/join-class-modal';
import { CreateEditClassroomModal } from '../../../shared/components/create-edit-classroom-modal/create-edit-classroom-modal';

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
export class Header {
  userRole: 'STUDENT' | 'TEACHER' = 'STUDENT';
  userName = 'Ana Gómez';
  isMobileMenuOpen = false;

  constructor(private dialog: MatDialog) {}

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
    this.userRole = this.userRole === 'STUDENT' ? 'TEACHER' : 'STUDENT';
  }

  get navItems() {
    const items = [
      {
        label: 'Inicio',
        route: '/classrooms/teacher',
        roles: ['STUDENT', 'TEACHER'],
      },
    ];

    if (this.userRole === 'STUDENT') {
      items.push(
        {
          label: 'Mis Aulas',
          route: '/classrooms/student',
          roles: ['STUDENT'],
        },
        {
          label: 'Misiones Eco',
          route: '/misiones',
          roles: ['STUDENT'],
        },
      );
    }

    if (this.userRole === 'TEACHER') {
      items.push(
        {
          label: 'Gestión de Aulas',
          route: '/classrooms/teacher',
          roles: ['TEACHER'],
        },
        {
          label: 'Nómina',
          route: '/classrooms/students',
          roles: ['TEACHER'],
        },
      );
    }

    return items;
  }
}
