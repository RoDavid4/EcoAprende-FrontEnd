import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassroomService } from '../../../core/services/classroom-service';

@Component({
  selector: 'app-join-class-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './join-class-modal.html',
  styleUrl: './join-class-modal.scss',
})
export class JoinClassModal {
  joinForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JoinClassModal>,
    private classroomService: ClassroomService,
  ) {
    this.joinForm = this.fb.group({
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern('^[a-zA-Z0-9]{6}$'),
        ],
      ],
    });
  }

  submitCode(): void {
    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const code = this.joinForm.get('code')?.value.trim();

    this.classroomService.joinClassroomByCode(code).subscribe({
      next: (classroom) => {
        this.isLoading = false;
        this.successMessage = '¡Te has unido al aula exitosamente!';

        setTimeout(() => {
          this.dialogRef.close(true);
        }, 800);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.errorMessage =
            'El código ingresado no corresponde a ninguna clase activa.';
        } else if (err.status === 409) {
          this.errorMessage = 'Ya estás registrado en esta clase.';
        } else {
          this.errorMessage =
            err.error?.message ||
            'Ocurrió un error al intentar unirse al aula.';
        }
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
