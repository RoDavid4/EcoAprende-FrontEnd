import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomAssignmentService } from '../../../classroom-assignments/services/classroom-assignment-service.ts';
import { MatIconModule } from '@angular/material/icon';
import { LowerCasePipe } from '@angular/common';
import { ModuleService } from '../../../../core/services/module.js';
import { AuthService } from '../../../auth/services/auth.services.js';
import { Quiz } from '../../../quizzes/models/quiz-model.js';
import { QuizService } from '../../../quizzes/services/quiz-service.js';
import { QuizPlayer } from '../../../quizzes/pages/quiz-player/quiz-player.js';

@Component({
  selector: 'app-lesson-player',
  imports: [MatIconModule, LowerCasePipe, QuizPlayer],
  templateUrl: './lesson-player.html',
  styleUrl: './lesson-player.scss',
})
export class LessonPlayer implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private classroomAssignmentService = inject(ClassroomAssignmentService);
  private moduleService = inject(ModuleService);
  private quizService = inject(QuizService);

  isLoadingQuiz: boolean = false;
  currentQuiz: Quiz | null = null;
  modules: any[] = [];
  activeModuleId: string | null = null;
  currentLesson: any = null;
  safeVideoUrl: SafeResourceUrl | null = null;
  safeMediaUrl: SafeResourceUrl | null = null;
  currentModuleQuizzes: any[] = [];

  classroomId: string | null = null;
  isLoading: boolean = true;
  isLoadingLessons: boolean = false;
  isStudent: boolean = true;

  ngOnInit(): void {
    this.classroomId = this.route.snapshot.paramMap.get('id');

    const user = this.authService.getCurrentUser();
    this.isStudent = user?.role === 'STUDENT';

    if (this.classroomId) {
      this.loadModules();
    }
  }

  loadModules(): void {
    if (!this.classroomId) return;

    this.isLoading = true;
    this.classroomAssignmentService
      .getClassroomModules(this.classroomId)
      .subscribe({
        next: (modulesData) => {
          this.modules = modulesData || [];
          this.isLoading = false;

          if (this.modules.length > 0) {
            const targetModuleId =
              this.route.snapshot.queryParamMap.get('moduleId') ||
              this.modules[0].id;
            this.toggleModule(targetModuleId);
          }
        },
        error: (err) => {
          console.error('Error al obtener los módulos:', err);
          this.isLoading = false;
        },
      });
  }

  toggleModule(moduleId: string): void {
    this.activeModuleId = moduleId;
    const targetModule = this.modules.find((m) => m.id === moduleId);

    if (!targetModule) return;

    if (targetModule.lessons && targetModule.lessons.length > 0) {
      if (!this.currentLesson && !this.currentQuiz) {
        this.selectLesson(targetModule.lessons[0]);
      }
      return;
    }

    this.isLoadingLessons = true;
    this.moduleService.getModuleById(moduleId).subscribe({
      next: (moduleData) => {
        targetModule.lessons = moduleData.lessons || [];
        targetModule.quizzes = moduleData.quizzes || [];

        if (targetModule.quizzes.length > 0) {
          targetModule.quiz = targetModule.quizzes[0];
        }

        if (targetModule.lessons.length > 0 && !this.currentLesson) {
          this.selectLesson(targetModule.lessons[0]);
        }
        this.isLoadingLessons = false;
      },
      error: (err) => {
        console.error('Error al obtener las lecciones del módulo:', err);
        this.isLoadingLessons = false;
      },
    });
  }

  selectLesson(lesson: any): void {
    this.currentLesson = lesson;
    this.currentQuiz = null;
    this.safeVideoUrl = null;
    this.safeMediaUrl = null;

    console.log('Datos de la lección seleccionada:', lesson);

    if (lesson.contentType === 'VIDEO' && lesson.mediaUrl) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.formatEmbedUrl(lesson.mediaUrl),
      );
    } else if (lesson.contentType === 'MULTIMEDIA' && lesson.mediaUrl) {
      this.safeMediaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        lesson.mediaUrl,
      );
    }
  }

  selectQuiz(quizHeader: any): void {
    if (!quizHeader?.id) return;

    this.isLoadingQuiz = true;
    this.currentLesson = null;

    this.quizService.getQuizById(quizHeader.id).subscribe({
      next: (fullQuiz) => {
        this.currentQuiz = fullQuiz;

        this.quizService.getMyAttempts(quizHeader.id).subscribe({
          next: (attempts) => {
            if (this.currentQuiz) {
              this.currentQuiz.myAttempts = attempts || [];
            }
            this.isLoadingQuiz = false;
          },
          error: () => (this.isLoadingQuiz = false),
        });
      },
      error: (err) => {
        console.error('Error al cargar la evaluación:', err);
        this.isLoadingQuiz = false;
      },
    });
  }

  onQuizCompleted(result: any): void {
    console.log('Evaluación finalizada con respuesta:', result);

    if (this.currentQuiz) {
      this.currentQuiz.isPassed = result.isPassed;
      this.currentQuiz.highestScore = result.score;
      if (!this.currentQuiz.myAttempts) this.currentQuiz.myAttempts = [];
      this.currentQuiz.myAttempts.push(result);
    }

    const activeModule = this.modules.find((m) => m.id === this.activeModuleId);
    if (activeModule) {
      const targetQuiz =
        activeModule.quizzes?.find((q: any) => q.id === this.currentQuiz?.id) ||
        activeModule.quiz;
      if (targetQuiz) {
        targetQuiz.isPassed = result.isPassed;
        targetQuiz.highestScore = result.score;
        targetQuiz.attemptsCount = (targetQuiz.attemptsCount || 0) + 1;
      }
    }
  }

  get currentModuleLessons(): any[] {
    const activeModule = this.modules.find((m) => m.id === this.activeModuleId);
    return activeModule?.lessons || [];
  }

  get currentModuleQuiz(): any | null {
    const activeModule = this.modules.find((m) => m.id === this.activeModuleId);
    return (
      activeModule?.quiz ||
      (activeModule?.quizzes ? activeModule.quizzes[0] : null)
    );
  }

  hasPreviousLesson(): boolean {
    if (!this.currentLesson) return false;
    const index = this.currentModuleLessons.findIndex(
      (l) => l.id === this.currentLesson.id,
    );
    return index > 0;
  }

  loadPreviousLesson(): void {
    if (this.currentQuiz && this.currentModuleLessons.length > 0) {
      this.selectLesson(
        this.currentModuleLessons[this.currentModuleLessons.length - 1],
      );
      return;
    }

    if (!this.hasPreviousLesson()) return;
    const index = this.currentModuleLessons.findIndex(
      (l) => l.id === this.currentLesson.id,
    );
    this.selectLesson(this.currentModuleLessons[index - 1]);
  }

  hasNextLesson(): boolean {
    if (!this.currentLesson) return false;
    const index = this.currentModuleLessons.findIndex(
      (l) => l.id === this.currentLesson.id,
    );
    return (
      index >= 0 &&
      (index < this.currentModuleLessons.length - 1 || !!this.currentModuleQuiz)
    );
  }

  loadNextLesson(): void {
    const activeModule = this.modules.find((m) => m.id === this.activeModuleId);
    const lessons = activeModule?.lessons || this.currentModuleLessons || [];

    const quizzes: any[] =
      activeModule?.quizzes ||
      (this.currentModuleQuizzes
        ? this.currentModuleQuizzes
        : activeModule?.quiz
          ? [activeModule.quiz]
          : this.currentModuleQuiz
            ? [this.currentModuleQuiz]
            : []);

    if (this.currentQuiz) {
      const currentQuizIndex = quizzes.findIndex(
        (q: any) => q.id === this.currentQuiz?.id,
      );

      if (currentQuizIndex !== -1 && currentQuizIndex < quizzes.length - 1) {
        this.selectQuiz(quizzes[currentQuizIndex + 1]);
        return;
      }

      this.navigateToNextModule();
      return;
    }

    if (this.currentLesson && lessons.length > 0) {
      const currentLessonIndex = lessons.findIndex(
        (l: any) => l.id === this.currentLesson?.id,
      );

      if (
        currentLessonIndex !== -1 &&
        currentLessonIndex < lessons.length - 1
      ) {
        this.selectLesson(lessons[currentLessonIndex + 1]);
        return;
      }

      if (currentLessonIndex === lessons.length - 1 && quizzes.length > 0) {
        this.selectQuiz(quizzes[0]);
        return;
      }

      this.navigateToNextModule();
    }
  }

  private navigateToNextModule(): void {
    const currentModuleIndex = this.modules.findIndex(
      (m) => m.id === this.activeModuleId,
    );
    if (
      currentModuleIndex !== -1 &&
      currentModuleIndex < this.modules.length - 1
    ) {
      const nextModule = this.modules[currentModuleIndex + 1];
      this.toggleModule(nextModule.id);
    }
  }

  markAsCompleted(): void {
    if (!this.currentLesson || !this.isStudent) return;

    const previousStatus = this.currentLesson.isCompleted;

    this.currentLesson.isCompleted = true;

    const module = this.modules.find((m) =>
      m.lessons?.some((l: any) => l.id === this.currentLesson?.id),
    );
    if (module) {
      const lessonInModule = module.lessons.find(
        (l: any) => l.id === this.currentLesson?.id,
      );
      if (lessonInModule) {
        lessonInModule.isCompleted = true;
      }
    }

    this.classroomAssignmentService
      .completeLesson(this.currentLesson.id)
      .subscribe({
        next: (res) => {
          console.log('Lección completada con éxito en BD:', res);
        },
        error: (err) => {
          console.error('Error al marcar como completada:', err);
          this.currentLesson.isCompleted = previousStatus;
          if (module) {
            const lessonInModule = module.lessons.find(
              (l: any) => l.id === this.currentLesson?.id,
            );
            if (lessonInModule) {
              lessonInModule.isCompleted = previousStatus;
            }
          }
        },
      });
  }

  private formatEmbedUrl(url: string): string {
    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    return url;
  }

  getContentTypeLabel(type: string): string {
    switch (type) {
      case 'VIDEO':
        return 'Video';
      case 'TEXT':
        return 'Lectura';
      case 'MULTIMEDIA':
        return 'Recurso';
      default:
        return 'Lección';
    }
  }

  goBack(): void {
    if (this.isStudent) {
      this.router.navigate(['/classrooms']);
    } else {
      this.router.navigate(['/classrooms', this.classroomId || '']);
    }
  }
}
