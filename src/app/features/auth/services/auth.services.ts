import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
.post<LoginResponse>(
`${this.apiUrl}/auth/login`,
credentials
)
.pipe(
tap((response) => {
localStorage.setItem(
'access_token',
response.access_token
);


      localStorage.setItem(
        'user',
        JSON.stringify(response.user)
      );
    })
  );


}

register(data: {
  fullName: string;
  email: string;
  password: string;
}): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/auth/register`,
    data
  );
}

//RESETEO DEL PASSWORD 
forgotPassword(email: string): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/auth/forgot-password`,
    { email }
  );
}

resetPassword(data: {
  token: string;
  newPassword: string;
}): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/auth/reset-password`,
    data
  );
}

//FUNCIONALIDADES DEL PERFIL
getProfile(): Observable<any> {
return this.http.get<any>(
`${this.apiUrl}/users/profile`
);
}

updateProfile(data: {
  fullName: string;
}): Observable<any> {
  return this.http.patch(
    `${this.apiUrl}/users/profile`,
    data
  );
}

changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/users/change-password`,
    data
  );
}

logout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
}

}
