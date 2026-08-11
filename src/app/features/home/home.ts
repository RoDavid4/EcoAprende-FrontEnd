import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.services';  

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (response) => {
        console.log('Perfil autenticado:', response);
      },
      error: (error) => {
        console.error('Error al obtener perfil:', error);
      },
    });
  }
}