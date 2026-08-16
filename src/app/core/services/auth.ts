import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl;
  private mockUser: User = {
    id: '1',
    name: 'Prof. García',
    email: 'profesor@ecoaprende.com',
    role: 'TEACHER',
  };

  private currentUserSubject = new BehaviorSubject<User>(this.mockUser);
  currentUser$ = this.currentUserSubject.asObservable();

  private realToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNkMWNmMjNiLTcyNzgtNDE4Yi04ZWI2LTBhNTc1ZjBkMmM3NSIsImVtYWlsIjoicHJvZmVAZWNvYXByZW5kZS5jb20iLCJyb2xlIjoiVEVBQ0hFUiIsImlhdCI6MTc4Njg0ODYwMSwiZXhwIjoxNzg2OTM1MDAxfQ.1qDVqyDQvuXKgR8VXLNTwFrDZddHoGZPj_g0gOqB33A';
  constructor(private http: HttpClient) {
    localStorage.setItem('accessToken', this.realToken);
    console.log('AuthService - Usando token REAL del backend');
    console.log('Usuario:', this.mockUser);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          this.currentUserSubject.next(response.user);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    console.log('Logout');
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setRole(role: 'STUDENT' | 'TEACHER' | 'ADMIN'): void {
    this.mockUser.role = role;
    this.currentUserSubject.next(this.mockUser);
    console.log(`Rol cambiado a: ${role}`);
  }
}
