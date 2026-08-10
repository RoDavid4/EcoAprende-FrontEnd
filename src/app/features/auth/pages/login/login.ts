import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
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


  login(): void {
  this.authService.login({
    email: this.email,
    password: this.password,
  }).subscribe({
    next: (response) => {
      console.log('Login exitoso:', response);

      this.router.navigate(['/home']);
    },
    error: (error) => {
      console.error('Error de login:', error);
    },
  });
}
}