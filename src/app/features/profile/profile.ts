import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../auth/services/auth.services'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  role = '';

  loading = true;
  savingProfile = false;
  savingPassword = false;

  profileMessage = '';
  profileError = '';

  passwordMessage = '';
  passwordError = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;

    this.authService.getProfile().subscribe({
      next: (profile) => {
        console.log('Perfil:', profile);

        this.fullName = profile.fullName;
        this.email = profile.email;
        this.role = profile.role;

        this.loading = false;
      },

      error: (error) => {
        console.error('Error al cargar perfil:', error);

        this.loading = false;
        this.profileError =
          'No se pudo cargar la información del perfil.';
      },
    });
  }

  updateProfile(): void {
    this.profileMessage = '';
    this.profileError = '';

    if (!this.fullName.trim()) {
      this.profileError = 'El nombre completo es obligatorio.';
      return;
    }

    this.savingProfile = true;

    this.authService.updateProfile({
      fullName: this.fullName.trim(),
    }).subscribe({
      next: (response) => {
  console.log('Perfil actualizado:', response);

  this.savingProfile = false;

  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    const user = JSON.parse(storedUser);

    user.fullName = this.fullName;

    localStorage.setItem('user', JSON.stringify(user));
  }

  this.profileMessage = 'Perfil actualizado correctamente.';

  setTimeout(() => {
    this.router.navigate(['/home']);
  }, 1000);
},

      error: (error) => {
        console.error('Error al actualizar perfil:', error);

        this.savingProfile = false;
        this.profileError =
          'No se pudo actualizar el perfil.';
      },
    });
  }

  changePassword(): void {
    this.passwordMessage = '';
    this.passwordError = '';

    if (!this.currentPassword) {
      this.passwordError =
        'Ingresá tu contraseña actual.';
      return;
    }

    if (!this.newPassword) {
      this.passwordError =
        'Ingresá una nueva contraseña.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordError =
        'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError =
        'Las contraseñas no coinciden.';
      return;
    }

    this.savingPassword = true;

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    }).subscribe({
      next: () => {
        this.savingPassword = false;

        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        this.passwordMessage =
          'Contraseña actualizada correctamente.';
      },

      error: (error) => {
        console.error(
          'Error al cambiar contraseña:',
          error
        );

        this.savingPassword = false;

        if (error.status === 401) {
          this.passwordError =
            'La contraseña actual es incorrecta.';
        } else {
          this.passwordError =
            'No se pudo actualizar la contraseña.';
        }
      },
    });
  }
}