import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClassroomService } from '../../../../core/services/classroom-service';
import { StudentProgress } from '../student-progress/student-progress';

@Component({
  selector: 'app-student-detail',
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './student-detail.html',
  styleUrl: './student-detail.scss',
})
export class StudentDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private classroomService = inject(ClassroomService);

  student: StudentProgress | null = null;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');

    if (!studentId) {
      this.errorMessage = 'No se encontró el estudiante.';
      this.loading = false;
      return;
    }

    this.loadStudent(studentId);
  }

  loadStudent(studentId: string): void {

    this.classroomService.getClassrooms().subscribe({

      next: (classrooms) => {

        if (classrooms.length === 0) {
          this.errorMessage = 'No tienes aulas con estudiantes.';
          this.loading = false;
          return;
        }

        const requests = classrooms.map((classroom) =>
          this.classroomService.getClassroomMetrics(classroom.id)
        );

        import('rxjs').then(({ forkJoin }) => {

          forkJoin(requests).subscribe({

            next: (metrics: any[]) => {

              let foundStudent: StudentProgress | null = null;

              for (const metric of metrics) {

                const student = metric.students.find(
                  (student: StudentProgress) =>
                    student.id === studentId
                );

                if (student) {
                  foundStudent = student;
                  break;
                }
              }

              if (!foundStudent) {
                this.errorMessage =
                  'No se encontró información de este estudiante.';
              } else {
                this.student = foundStudent;
              }

              this.loading = false;
            },

            error: (error) => {

              console.error(
                'Error al cargar el progreso:',
                error
              );

              this.errorMessage =
                'No se pudo cargar la información del estudiante.';

              this.loading = false;
            },

          });

        });

      },

      error: (error) => {

        console.error(
          'Error al cargar las aulas:',
          error
        );

        this.errorMessage =
          'No se pudieron cargar las aulas.';

        this.loading = false;
      },

    });
  }

  getProgressClass(progress: number): string {

    if (progress >= 75) {
      return 'high';
    }

    if (progress >= 50) {
      return 'medium';
    }

    return 'low';
  }

  getProgressCircleStyle(): string {

    const progress = this.student?.progressPercentage ?? 0;

    return `conic-gradient(
      #2e7d32 ${progress}%,
      #e5e7eb ${progress}% 100%
    )`;
  }

  goBack(): void {
    this.router.navigate(['/teacher/progress']);
  }

}