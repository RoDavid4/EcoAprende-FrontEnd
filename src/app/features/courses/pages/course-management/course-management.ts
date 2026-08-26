import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../../core/services/course-service';
import { MatIconModule } from '@angular/material/icon';
import { CourseForm } from '../../components/course-form/course-form';
import { ModuleBuilder } from '../../components/module-builder/module-builder';
import { CourseStatus } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    CourseForm,
    RouterLink,
    ModuleBuilder,
  ],
  templateUrl: './course-management.html',
  styleUrl: './course-management.scss',
})
export class CourseManagement implements OnInit {
  @ViewChild(ModuleBuilder) moduleBuilder!: ModuleBuilder;

  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  courseForm!: FormGroup;

  isSaving = false;
  isLoading = false;
  isEditMode = false;
  courseId: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      imageUrl: [''],
      status: ['DRAFT'],
      modules: this.fb.array([]),
    });
  }

  get modules(): FormArray {
    return this.courseForm.get('modules') as FormArray;
  }

  private checkEditMode(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.isEditMode = true;
      this.isLoading = true;
      this.loadCourseData(this.courseId);
    } else {
      this.isEditMode = false;
    }
  }

  private loadCourseData(id: string): void {
    this.courseService.getCourseById(id).subscribe({
      next: (courseData: any) => {
        this.courseForm.patchValue({
          title: courseData.title || '',
          description: courseData.description || '',
          imageUrl: courseData.imageUrl || '',
          status: courseData.status || 'DRAFT',
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar la información del curso:', err);
        alert('No se pudo obtener la información del curso.');
        this.isLoading = false;
      },
    });
  }

  get currentStatus(): string {
    return this.courseForm?.get('status')?.value || 'DRAFT';
  }

  saveCourse(status?: string): void {
    const targetStatus = (status || this.currentStatus) as CourseStatus;
    this.courseForm.patchValue({ status: targetStatus });

    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      alert('Por favor, llena los campos obligatorios antes de continuar.');
      return;
    }

    this.isSaving = true;
    const rawValue = this.courseForm.value;

    const payload = {
      title: rawValue.title,
      description: rawValue.description || '',
      imageUrl: rawValue.imageUrl || null,
      status: targetStatus,
    };

    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, payload).subscribe({
        next: () => {
          if (this.moduleBuilder) {
            this.moduleBuilder.saveAllModules(this.courseId!);
          }
          this.isSaving = false;
          this.router.navigate(['/courses']);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Error al actualizar:', err);
          alert('Ocurrió un error al actualizar el curso.');
        },
      });
    } else {
      this.courseService.createCourse(payload).subscribe({
        next: (createdCourse: any) => {
          const newCourseId = createdCourse.id || createdCourse._id;

          this.isSaving = false;
          this.isEditMode = true;
          this.courseId = newCourseId;

          this.router.navigate(['/courses/edit', newCourseId], {
            replaceUrl: true,
          });

          alert(
            'Información general guardada. Ahora puedes agregar los módulos y lecciones.',
          );
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Error al crear curso:', err);
          alert(
            `Error al crear curso: ${err.error?.message || 'Revisa la consola'}`,
          );
        },
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
