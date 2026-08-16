import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './core/components/header/header';
import { filter } from 'rxjs';
import { AuthService } from './features/auth/services/auth.services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'ecoaprende-frontend';
  private authService = inject(AuthService);
  //isLoginPage = false;
  //constructor(private router: Router) {}
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
  // ngOnInit() {
  //   this.router.events
  //     .pipe(filter((event) => event instanceof NavigationEnd))
  //     .subscribe((event: NavigationEnd) => {
  //       this.isLoginPage =
  //         event.url === '/login' || event.url.startsWith('/login');
  //     });
  // }
}
