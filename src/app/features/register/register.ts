import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCard } from '@angular/material/card';

import { AuthService } from '../auth/services/auth.services';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCard,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validaciones
    if (!this.fullName.trim()) {
      this.errorMessage = 'El nombre completo es obligatorio.';
      return;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'El correo electrónico es obligatorio.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Ingresá un correo electrónico válido.';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'La contraseña es obligatoria.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);

        this.loading = false;
        this.successMessage = 'Cuenta creada correctamente.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (error) => {
        console.error('Error de registro:', error);

        this.loading = false;

        if (error.status === 409) {
          this.errorMessage = 'Ya existe una cuenta con ese correo.';
        } else if (error.status === 400) {
          this.errorMessage = 'Los datos ingresados no son válidos.';
        } else {
          this.errorMessage =
            'No se pudo crear la cuenta. Intentá nuevamente.';
        }
      },
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}