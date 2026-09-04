import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth.services';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;

  loading = false;
  errorMessage = '';

  login(): void {
    this.errorMessage = '';

    // Validaciones
    if (!this.email.trim()) {
      this.errorMessage = 'El correo electrónico es obligatorio.';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'La contraseña es obligatoria.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Ingresá un correo electrónico válido.';
      return;
    }

    this.loading = true;

    this.authService
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          this.loading = false;

          const role = response.user.role;

          if (role === 'TEACHER') {
            this.router.navigate(['/teacher']);
          } else if (role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        },

        error: (error) => {
          console.error('Error de login:', error);

          this.loading = false;

          if (error.status === 401) {
            this.errorMessage = 'El correo o la contraseña son incorrectos.';
          } else if (error.status === 400) {
            this.errorMessage = 'Los datos ingresados no son válidos.';
          } else {
            this.errorMessage =
              'No se pudo iniciar sesión. Intentá nuevamente.';
          }
        },
      });
  }

  togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
