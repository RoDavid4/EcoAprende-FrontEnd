import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/services/auth.services'; 

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';

  newPassword = '';
  confirmPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      this.errorMessage =
        'El enlace de recuperación no es válido o está incompleto.';
    }
  }

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.token) {
      this.errorMessage =
        'No se encontró un token de recuperación válido.';
      return;
    }

    if (!this.newPassword) {
      this.errorMessage = 'La nueva contraseña es obligatoria.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage =
        'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    this.authService.resetPassword({
      token: this.token,
      newPassword: this.newPassword,
    }).subscribe({
      next: () => {
        this.loading = false;

        this.successMessage =
          'Contraseña actualizada correctamente.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (error) => {
        console.error('Error al restablecer contraseña:', error);

        this.loading = false;

        if (error.status === 401) {
          this.errorMessage =
            'El enlace es inválido, expiró o ya fue utilizado.';
        } else if (error.status === 400) {
          this.errorMessage =
            'La nueva contraseña no es válida.';
        } else {
          this.errorMessage =
            'No se pudo actualizar la contraseña. Intentá nuevamente.';
        }
      },
    });
  }
}