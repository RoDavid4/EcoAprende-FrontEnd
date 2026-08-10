import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000';

  login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http
    .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
    .pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }),
    );
}
}