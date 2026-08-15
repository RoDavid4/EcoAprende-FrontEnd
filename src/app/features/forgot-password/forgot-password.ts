import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth/services/auth.services'; 

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  forgotPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'El correo electrónico es obligatorio.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Ingresá un correo electrónico válido.';
      return;
    }

    this.loading = true;

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.loading = false;

        this.successMessage =
          'Si existe una cuenta asociada a este correo, recibirás instrucciones para recuperar tu contraseña.';
      },

      error: (error) => {
        console.error('Error al solicitar recuperación:', error);

        this.loading = false;

        this.errorMessage =
          'No se pudo procesar la solicitud. Intentá nuevamente.';
      },
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}