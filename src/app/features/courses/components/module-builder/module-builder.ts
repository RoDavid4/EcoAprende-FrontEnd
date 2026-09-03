import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/course-service';
import { ModuleService } from '../../../../core/services/module';
import { LessonService } from '../../../../core/services/lesson';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { QuizService } from '../../../quizzes/services/quiz-service';

@Component({
  selector: 'app-module-builder',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSlideToggleModule,
  ],
  templateUrl: './module-builder.html',
  styleUrl: './module-builder.scss',
})
export class ModuleBuilder implements OnInit {
  @Input({ required: true }) parentForm!: FormGroup;
  @Input() courseId: string | null = null;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private moduleService = inject(ModuleService);
  private lessonService = inject(LessonService);
  private quizService = inject(QuizService);

  courseData: any = null;

  newModuleTitle = '';
  newLessonTitles: { [moduleId: string]: string } = {};
  quizzesList: any[] = [];
  quizzesByModule: { [moduleId: string]: any[] } = {};

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (this.parentForm && !this.parentForm.contains('modules')) {
      this.parentForm.addControl('modules', this.fb.array([]));
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseId'] && changes['courseId'].currentValue) {
      const activeId = changes['courseId'].currentValue;
      this.loadCourseStructure(activeId);
    }
  }

  get modules(): FormArray {
    return this.parentForm.get('modules') as FormArray;
  }

  getLessons(mIdx: number): FormArray {
    return this.modules.at(mIdx).get('lessons') as FormArray;
  }

  loadCourseStructure(id: string): void {
    this.courseService.getCourseById(id).subscribe({
      next: (courseData: any) => {
        console.log('Respuesta completa del curso:', courseData);
        console.log('Módulos recibidos:', courseData.modules);
        this.populateForm(courseData.modules || []);
        this.loadAllQuizzes();
      },
      error: (err) => console.error('Error al cargar la estructura:', err),
    });
  }

  private populateForm(modulesList: any[]): void {
    this.modules.clear();
    modulesList.forEach((mod) => {
      const lessonsArray = this.fb.array(
        (mod.lessons || []).map((les: any) =>
          this.fb.group({
            id: [les.id],
            title: [les.title, Validators.required],
            contentType: [les.contentType],
            mediaUrl: [les.mediaUrl || ''],
            content: [les.content || ''],
          }),
        ),
      );

      this.modules.push(
        this.fb.group({
          id: [mod.id],
          title: [mod.title, Validators.required],
          status: [mod.status || 'DRAFT'],
          description: [mod.description],
          lessons: lessonsArray,
        }),
      );
    });
  }

  getLessonsControls(moduleIndex: number) {
    const moduleGroup = this.modules.at(moduleIndex) as FormGroup;
    return (moduleGroup.get('lessons') as FormArray).controls;
  }

  addModule(moduleTitle?: string): void {
    const finalTitle = moduleTitle || this.newModuleTitle || 'Nuevo Módulo';

    const moduleGroup = this.fb.group({
      id: [null],
      title: [finalTitle, Validators.required],
      description: [''],
      status: ['DRAFT'],
      lessons: this.fb.array([]),
    });

    this.modules.push(moduleGroup);
    this.newModuleTitle = '';
  }

  removeModule(mIdx: number): void {
    const moduleGroup = this.modules.at(mIdx);
    const moduleId = moduleGroup.get('id')?.value;

    if (moduleId) {
      this.moduleService.deleteModule(moduleId).subscribe({
        next: () => this.modules.removeAt(mIdx),
        error: (err) => console.error('Error al eliminar módulo:', err),
      });
    } else {
      this.modules.removeAt(mIdx);
    }
  }

  addLesson(mIdx: number, contentType: 'TEXT' | 'VIDEO' | 'MULTIMEDIA'): void {
    const lessonsArray = this.getLessons(mIdx);

    const lessonGroup = this.fb.group({
      id: [null],
      title: ['Nueva Lección', Validators.required],
      contentType: [contentType],
      mediaUrl: [''],
      content: [''],
    });

    lessonsArray.push(lessonGroup);
  }

  removeLesson(mIdx: number, lIdx: number): void {
    const lessonsArray = this.getLessons(mIdx);
    const lessonGroup = lessonsArray.at(lIdx);
    const lessonId = lessonGroup.get('id')?.value;

    if (lessonId) {
      this.lessonService.deleteLesson(lessonId).subscribe({
        next: () => lessonsArray.removeAt(lIdx),
        error: (err) => console.error('Error al eliminar lección:', err),
      });
    } else {
      lessonsArray.removeAt(lIdx);
    }
  }

  public saveAllModules(courseId: string): void {
    if (!courseId) return;

    this.modules.controls.forEach((moduleControl, mIdx) => {
      const moduleGroup = moduleControl as FormGroup;
      if (moduleGroup.invalid) return;

      const moduleValue = moduleGroup.value;
      const moduleId = moduleValue.id;

      const modulePayload = {
        title: moduleValue.title,
        courseId: courseId,
        order: mIdx + 1,
        description: moduleValue.description || null,
        status: moduleValue.status || 'DRAFT',
      };

      const saveObs = moduleId
        ? this.moduleService.updateModule(moduleId, modulePayload)
        : this.moduleService.createModule(modulePayload);

      saveObs.subscribe({
        next: (savedModule: any) => {
          moduleGroup.patchValue({ id: savedModule.id });
          this.saveLessonsForModule(mIdx, savedModule.id);
        },
        error: (err) => console.error('Error al guardar el módulo:', err),
      });
    });
  }

  private saveLessonsForModule(mIdx: number, moduleId: string): void {
    const lessonsArray = this.getLessons(mIdx);

    lessonsArray.controls.forEach((lessonControl, lIdx) => {
      const lessonVal = lessonControl.value;

      const lessonPayload: Record<string, any> = {
        title: lessonVal.title || 'Nueva Lección',
        contentType: lessonVal.contentType || 'TEXT',
        moduleId: String(moduleId),
        order: lIdx + 1,
        isActive: true,
      };

      if (lessonVal.content?.trim()) {
        lessonPayload['content'] = lessonVal.content.trim();
      }

      const rawMediaUrl = lessonVal.mediaUrl ? lessonVal.mediaUrl.trim() : '';
      if (rawMediaUrl !== '') {
        lessonPayload['mediaUrl'] = rawMediaUrl;
      }

      if (!lessonVal.id) {
        this.lessonService.createLesson(lessonPayload).subscribe({
          next: (createdLesson: any) =>
            lessonControl.patchValue({ id: createdLesson.id }),
          error: (err) => console.error('Error al crear lección:', err),
        });
      } else {
        this.lessonService.updateLesson(lessonVal.id, lessonPayload).subscribe({
          error: (err) => console.error('Error al actualizar lección:', err),
        });
      }
    });
  }

  toggleModuleStatus(mIdx: number, isChecked: boolean): void {
    const moduleGroup = this.modules.at(mIdx) as FormGroup;
    const newStatus = isChecked ? 'PUBLISHED' : 'DRAFT';
    moduleGroup.patchValue({ status: newStatus });
  }

  loadAllQuizzes(): void {
    this.quizzesList = [];

    this.quizService.getAllQuizzes().subscribe({
      next: (quizzes) => {
        console.log('Quizzes traídos desde el backend:', quizzes);
        this.quizzesList = quizzes || [];
      },
      error: (err) =>
        console.error('Error al obtener la lista de quizzes:', err),
    });
  }

  getQuizzesByModuleId(moduleId: string): any[] {
    if (!moduleId || !this.quizzesList) return [];
    return this.quizzesList.filter(
      (q) => q.moduleId === moduleId && q.isActive === true,
    );
  }

  goToEditQuiz(quizId: string, moduleId: string): void {
    this.router.navigate(['/quizzes/edit', quizId], {
      queryParams: { moduleId: moduleId, courseId: this.courseId },
    });
  }

  deleteQuiz(quizId: string): void {
    if (!quizId) {
      console.error('El ID del cuestionario es nulo o indefinido.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este cuestionario?')) {
      this.quizService.deleteQuiz(quizId).subscribe({
        next: () => {
          console.log(`Cuestionario ${quizId} eliminado correctamente.`);
          this.quizzesList = this.quizzesList.filter((q) => q.id !== quizId);
        },
        error: (err) => {
          console.error('Error detallado al eliminar el cuestionario:', err);
          if (err.status === 401 || err.status === 403) {
            alert(
              'Tu sesión ha expirado o no tienes permisos para eliminar este cuestionario.',
            );
          } else {
            alert('Ocurrió un error al intentar eliminar el cuestionario.');
          }
        },
      });
    }
  }

  goToCreateQuiz(mIdx: number): void {
    const moduleGroup = this.modules.at(mIdx);
    const moduleId = moduleGroup.get('id')?.value;

    if (moduleId) {
      this.router.navigate(['/quizzes/create'], {
        queryParams: {
          moduleId: moduleId,
          courseId: this.courseId,
        },
      });
    } else {
      alert(
        'Primero debes guardar el módulo antes de añadirle un cuestionario.',
      );
    }
  }
}
