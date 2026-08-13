import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../auth/services/auth.services';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}