import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../auth/services/auth.services';

@Component({
  selector: 'app-home',
  imports: [
     MatButtonModule,
  MatIconModule,
  RouterLink,
  MatCardModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  userName = '';
  userRole = '';

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);

      this.userName = user.fullName;
      this.userRole = user.role;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}