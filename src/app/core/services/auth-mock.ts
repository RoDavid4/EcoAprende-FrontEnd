import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

@Injectable({
  providedIn: 'root',
})
export class AuthMock {
  private mockUser: User = {
    id: 'mock-1',
    fullName: 'Prof. García',
    email: 'profe@ecoaprende.com',
    role: 'TEACHER',
  };

  private currentUserSubject = new BehaviorSubject<User>(this.mockUser);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    console.log('[AuthMockService] Activado');
    console.log('Usuario mock:', this.mockUser);
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  setRole(role: 'STUDENT' | 'TEACHER' | 'ADMIN'): void {
    this.mockUser.role = role;
    this.currentUserSubject.next(this.mockUser);
    console.log(`Rol cambiado a: ${role}`);
  }

  isAuthenticated(): boolean {
    return true;
  }

  logout(): void {
    console.log('Logout mock');
  }
}
