import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../models/quiz-model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'http://localhost:3000/quizzes';

  constructor(private http: HttpClient) {}

  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl);
  }

  getQuizById(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }

  createQuiz(quizData: Partial<Quiz>): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, quizData);
  }

  updateQuiz(id: string, quizData: Partial<Quiz>): Observable<Quiz> {
    return this.http.patch<Quiz>(`${this.apiUrl}/${id}`, quizData);
  }

  deleteQuiz(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMyAttempts(quizId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${quizId}/my-attempts`);
  }

  submitQuiz(
    quizId: string,
    answersPayload: { answers: any[] },
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${quizId}/submit`,
      answersPayload,
    );
  }
}
