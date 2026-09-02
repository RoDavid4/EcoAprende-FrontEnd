import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz-service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-quiz-creator',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './quiz-creator.html',
  styleUrl: './quiz-creator.scss',
})
export class QuizCreator implements OnInit {
  quizForm!: FormGroup;
  moduleId: string = '';
  quizId: string | null = null;
  isEditMode: boolean = false;
  courseId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['moduleId']) {
        this.moduleId = params['moduleId'] || null;
      }
      this.courseId = params['courseId'] || null;
    });

    this.quizId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.quizId;

    this.initForm();

    if (this.isEditMode && this.quizId) {
      this.loadQuizData(this.quizId);
    } else {
      this.addQuestion();
    }
  }

  private initForm(): void {
    this.quizForm = this.fb.group({
      moduleId: [this.moduleId, Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      passingScore: [
        70,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      maxAttempts: [3, [Validators.required, Validators.min(1)]],
      timeLimitMinutes: [15, [Validators.min(1)]],
      isActive: [true],
      questions: this.fb.array([]),
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  createQuestionGroup(qData?: any): FormGroup {
    return this.fb.group({
      statement: [qData?.statement || '', Validators.required],
      explanation: [qData?.explanation || ''],
      points: [qData?.points || 10, [Validators.required, Validators.min(1)]],
      order: [qData?.order || this.questions.length + 1],
      options: this.fb.array([]),
    });
  }

  addQuestion(qData?: any): void {
    const qGroup = this.createQuestionGroup(qData);
    this.questions.push(qGroup);
    const qIndex = this.questions.length - 1;

    if (qData && qData.options && qData.options.length > 0) {
      qData.options.forEach((opt: any) => this.addOption(qIndex, opt));
    } else {
      this.addOption(qIndex, { text: '', isCorrect: true, order: 1 });
      this.addOption(qIndex, { text: '', isCorrect: false, order: 2 });
    }
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
    this.updateQuestionsOrder();
  }

  addOption(questionIndex: number, optData?: any): void {
    const options = this.getOptions(questionIndex);
    options.push(
      this.fb.group({
        text: [optData?.text || '', Validators.required],
        isCorrect: [optData?.isCorrect || false],
        order: [optData?.order || options.length + 1],
      }),
    );
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getOptions(questionIndex);
    options.removeAt(optionIndex);
  }

  setCorrectOption(questionIndex: number, selectedOptionIndex: number): void {
    const options = this.getOptions(questionIndex);
    options.controls.forEach((opt, idx) => {
      opt.get('isCorrect')?.setValue(idx === selectedOptionIndex);
    });
  }

  private updateQuestionsOrder(): void {
    this.questions.controls.forEach((q, idx) => {
      q.get('order')?.setValue(idx + 1);
    });
  }

  loadQuizData(id: string): void {
    this.quizService.getQuizById(id).subscribe({
      next: (quiz: any) => {
        console.log('Quiz recibido para edición:', quiz);

        this.moduleId = quiz.moduleId;

        this.quizForm.patchValue({
          moduleId: quiz.moduleId,
          title: quiz.title,
          description: quiz.description || '',
          passingScore: quiz.passingScore,
          maxAttempts: quiz.maxAttempts,
          timeLimitMinutes: quiz.timeLimitMinutes,
          isActive: quiz.isActive,
        });

        this.questions.clear();

        if (quiz.questions && quiz.questions.length > 0) {
          quiz.questions.forEach((qData: any) => {
            this.addQuestion(qData);
          });
        } else {
          this.addQuestion();
        }
      },
      error: (err) => console.error('Error al cargar quiz:', err),
    });
  }

  saveQuiz(): void {
    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      alert('Por favor, completa correctamente todos los campos obligatorios.');
      return;
    }

    const rawValues = this.quizForm.getRawValue();

    const formattedQuestions = rawValues.questions.map(
      (q: any, qIdx: number) => ({
        ...(q.id ? { id: q.id } : {}),
        statement: q.statement,
        explanation: q.explanation || '',
        points: Number(q.points || 10),
        order: qIdx + 1,
        options: q.options.map((opt: any, optIdx: number) => ({
          ...(opt.id ? { id: opt.id } : {}),
          text: opt.text,
          isCorrect: Boolean(opt.isCorrect),
          order: optIdx + 1,
        })),
      }),
    );

    const payload = {
      ...rawValues,
      title: rawValues.title.trim(),
      moduleId: this.moduleId,
      passingScore: Number(rawValues.passingScore),
      maxAttempts: Number(rawValues.maxAttempts),
      timeLimitMinutes: Number(rawValues.timeLimitMinutes),
      questions: formattedQuestions,
    };

    console.log('Payload procesado enviado al servidor:', payload);

    if (this.isEditMode && this.quizId) {
      this.quizService.updateQuiz(this.quizId, payload).subscribe({
        next: () => {
          this.snackBar.open(
            '¡Cuestionario y preguntas actualizados con éxito!',
            'Cerrar',
            { duration: 3000 },
          );
          this.navigateBack();
        },
        error: (err) => {
          console.error('Error al actualizar quiz:', err);
          this.snackBar.open('Error al guardar las modificaciones.', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    } else {
      this.quizService.createQuiz(payload).subscribe({
        next: () => {
          this.snackBar.open('¡Cuestionario creado con éxito!', 'Cerrar', {
            duration: 3000,
          });
          this.navigateBack();
        },
        error: (err) => {
          console.error('Error al crear quiz:', err);
          this.snackBar.open('Error al crear el cuestionario.', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    }
  }

  navigateBack(): void {
    if (this.courseId) {
      this.router.navigate(['/courses/edit/', this.courseId]);
    } else {
      this.router.navigate(['/courses']);
    }
  }
}
