import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { QuizService } from '../../services/quiz-service';
import { Quiz, Question } from '../../models/quiz-model';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quiz-player',
  imports: [CommonModule, DecimalPipe, MatIconModule],
  templateUrl: './quiz-player.html',
  styleUrl: './quiz-player.scss',
})
export class QuizPlayer implements OnInit, OnChanges {
  @Input() quiz!: Quiz;
  @Input() isStudent: boolean = true;
  @Output() quizCompleted = new EventEmitter<any>();
  @Output() continueLesson = new EventEmitter<void>();

  currentIndex: number = 0;
  selectedAnswers: Map<string, string> = new Map();

  submitting: boolean = false;
  errorMessage: string = '';
  quizResult: any = null;
  hasReachedMaxAttempts: boolean = false;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.initQuiz();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quiz'] && !changes['quiz'].firstChange) {
      this.initQuiz();
    }
  }

  private initQuiz(): void {
    this.currentIndex = 0;
    this.selectedAnswers.clear();
    this.quizResult = null;
    this.errorMessage = '';
    this.hasReachedMaxAttempts = false;

    this.checkAttemptsLimit();

    if (this.quiz?.questions && this.quiz.questions.length > 0) {
      this.quiz.questions.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  }

  private checkAttemptsLimit(): void {
    const attemptsCount = this.quiz?.myAttempts?.length || 0;
    const maxAttempts = this.quiz?.maxAttempts || 1;

    if (attemptsCount >= maxAttempts) {
      this.hasReachedMaxAttempts = true;
      this.errorMessage =
        'Has alcanzado el límite máximo de intentos permitidos para esta evaluación.';
    }
  }

  get remainingAttempts(): number {
    const attemptsCount = this.quiz?.myAttempts?.length || 0;
    const maxAttempts = this.quiz?.maxAttempts || 1;
    return Math.max(0, maxAttempts - attemptsCount);
  }

  get currentQuestion(): Question | null {
    if (!this.quiz?.questions?.length) return null;
    return this.quiz.questions[this.currentIndex];
  }

  get progressPercentage(): number {
    if (!this.quiz?.questions?.length) return 0;
    return ((this.currentIndex + 1) / this.quiz.questions.length) * 100;
  }

  get optionLetters(): string[] {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  }

  selectOption(optionId: string): void {
    if (
      this.hasReachedMaxAttempts ||
      this.submitting ||
      !this.currentQuestion?.id
    )
      return;
    this.selectedAnswers.set(this.currentQuestion.id, optionId);
  }

  isOptionSelected(optionId: string): boolean {
    if (!this.currentQuestion?.id) return false;
    return this.selectedAnswers.get(this.currentQuestion.id) === optionId;
  }

  nextQuestion(): void {
    if (
      this.quiz?.questions &&
      this.currentIndex < this.quiz.questions.length - 1
    ) {
      this.currentIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  retryQuiz(): void {
    if (this.remainingAttempts <= 0) return;

    this.currentIndex = 0;
    this.selectedAnswers.clear();
    this.quizResult = null;
    this.errorMessage = '';
    this.hasReachedMaxAttempts = false;
  }

  onContinue(): void {
    this.continueLesson.emit();
  }

  submitQuiz(): void {
    if (!this.isStudent) {
      alert(
        'Estás en modo vista previa (Docente). Las respuestas no se guardarán.',
      );
      return;
    }

    if (this.hasReachedMaxAttempts || this.submitting || !this.quiz?.id) return;
    this.submitting = true;
    this.errorMessage = '';

    const answersArray = Array.from(this.selectedAnswers.entries()).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }),
    );

    this.quizService
      .submitQuiz(this.quiz.id, { answers: answersArray })
      .subscribe({
        next: (result) => {
          this.quizResult = result;
          this.submitting = false;

          if (!this.quiz.myAttempts) {
            this.quiz.myAttempts = [];
          }
          this.quiz.myAttempts.push(result);

          this.checkAttemptsLimit();
          this.quizCompleted.emit(result);
        },
        error: (err) => {
          this.submitting = false;

          if (err.status === 400) {
            this.hasReachedMaxAttempts = true;
          }

          this.errorMessage =
            err.error?.message || 'Error al enviar la evaluación';
        },
      });
  }
}
