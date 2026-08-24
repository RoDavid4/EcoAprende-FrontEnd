import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/modules';

  createModule(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  updateModule(id: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, payload);
  }

  deleteModule(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
