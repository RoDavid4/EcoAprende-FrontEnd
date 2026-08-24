import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CourseService } from '../../../../core/services/course-service';
import { Course } from '../../../../core/models/course.model';
import { BtnCreate } from '../../../../shared/components/btn-create/btn-create';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, MatIconModule, BtnCreate],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList implements OnInit {
  private courseService = inject(CourseService);
  private router = inject(Router);

  courses: Course[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
        this.isLoading = false;
      },
    });
  }

  goToCreate(): void {
    this.router.navigate(['/courses/new']);
  }

  goToEdit(courseId?: string): void {
    if (!courseId) return;
    this.router.navigate(['/courses/edit', courseId]);
  }

  deleteCourse(courseId?: string): void {
    if (!courseId) return;

    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.courses = this.courses.filter((c) => c.id !== courseId);
          alert('Curso eliminado.');
        },
        error: (err) => console.error('Error al eliminar:', err),
      });
    }
  }
}
