import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BtnCreate } from '../../../../shared/components/btn-create/btn-create';
import { CourseModule } from '../../models/classroom-assignment.model';
import { ClassroomAssignmentService } from '../../services/classroom-assignment-service.ts';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../../../core/services/course-service';

@Component({
  selector: 'app-classroom-assignments-page',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    DragDropModule,
    BtnCreate,
    RouterLink,
  ],
  templateUrl: './classroom-assignments-page.html',
  styleUrl: './classroom-assignments-page.scss',
})
export class ClassroomAssignmentsPage implements OnInit {
  private assignmentService = inject(ClassroomAssignmentService);

  selectedClassroomId: string = '';
  searchQuery: string = '';
  allModules: CourseModule[] = [];
  availableModules: CourseModule[] = [];
  assignedModules: CourseModule[] = [];
  initialAssignedIds: Set<string> = new Set();
  selectedCourseId: string = 'ALL';
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private courseService = inject(CourseService);

  ngOnInit(): void {
    const urlClassroomId =
      this.route.snapshot.paramMap.get('id') ||
      this.route.parent?.snapshot.paramMap.get('id');

    if (urlClassroomId) {
      this.selectedClassroomId = urlClassroomId;
      this.loadClassroomModules(urlClassroomId);
    }

    this.loadInitialData();
  }

  loadInitialData(): void {
    forkJoin({
      modules: this.assignmentService.getAvailableModules(),
      courses: this.courseService.getCourses(),
    }).subscribe({
      next: ({ modules, courses }) => {
        console.log('Módulos recibidos:', modules);
        console.log('Cursos recibidos:', courses);

        const publishedModules = modules.filter(
          (mod: any) => mod.status === 'PUBLISHED' && mod.isActive !== false,
        );

        this.allModules = publishedModules.map((mod: any) => {
          const foundCourse = courses.find((c: any) => c.id === mod.courseId);
          return {
            ...mod,
            courseTitle: foundCourse ? foundCourse.title : 'Sin Curso',
          };
        });

        this.filterAvailableModules();
      },
      error: (err) => console.error('Error cargando datos iniciales:', err),
    });
  }

  loadClassroomModules(classroomId: string): void {
    this.assignmentService.getClassroomModules(classroomId).subscribe({
      next: (assigned: any[]) => {
        this.assignedModules = assigned.map((mod) => ({
          ...mod,
          id: mod.id || mod.moduleId,
          courseTitle: mod.course?.title || 'Sin Curso',
        }));

        this.initialAssignedIds = new Set(
          this.assignedModules.map((m) => m.id),
        );
        this.filterAvailableModules();
      },
      error: (err) => console.error('Error cargando módulos del aula:', err),
    });
  }

  onCourseChange(courseId: string): void {
    this.selectedCourseId = courseId;
    this.filterAvailableModules();
  }

  filterAvailableModules(): void {
    let filtered = [...this.allModules];

    if (this.initialAssignedIds.size > 0) {
      filtered = filtered.filter((m) => !this.initialAssignedIds.has(m.id));
    }

    if (this.selectedCourseId && this.selectedCourseId !== 'ALL') {
      filtered = filtered.filter((m) => m.courseId === this.selectedCourseId);
    }

    this.availableModules = filtered;
  }

  get filteredAvailableModules(): CourseModule[] {
    if (!this.searchQuery.trim()) return this.availableModules;
    return this.availableModules.filter(
      (m) =>
        m.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(this.searchQuery.toLowerCase()),
    );
  }

  drop(event: CdkDragDrop<CourseModule[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  saveAssignments(): void {
    if (!this.selectedClassroomId) return;

    const currentAssignedIds = new Set(this.assignedModules.map((m) => m.id));

    const toAdd = this.assignedModules.filter(
      (m) => !this.initialAssignedIds.has(m.id),
    );

    const toRemoveIds = Array.from(this.initialAssignedIds).filter(
      (id) => !currentAssignedIds.has(id),
    );

    const addRequests = toAdd.map((mod) =>
      this.assignmentService.assignModuleToClassroom(
        this.selectedClassroomId,
        mod.id,
      ),
    );

    const removeRequests = toRemoveIds.map((moduleId) =>
      this.assignmentService.removeModuleFromClassroom(
        this.selectedClassroomId,
        moduleId,
      ),
    );

    const allRequests = [...addRequests, ...removeRequests];

    if (allRequests.length === 0) {
      this.snackBar.open(
        'No se realizaron cambios en las asignaciones',
        'Cerrar',
        {
          duration: 3000,
        },
      );
      return;
    }

    forkJoin(allRequests).subscribe({
      next: () => {
        this.snackBar.open('¡Asignaciones guardadas correctamente!', 'OK', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });

        this.router.navigate(['/classrooms', this.selectedClassroomId]);
      },
      error: (err) => {
        console.error('Error guardando asignaciones:', err);
        this.snackBar.open('Error al guardar las asignaciones', 'Cerrar', {
          duration: 4000,
        });
      },
    });
  }
}
