import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassroomService } from '../../../core/services/classroom-service';
import { Classroom } from '../../../core/models/classroom.model';
@Component({
  selector: 'app-create-edit-classroom-modal',
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
  templateUrl: './create-edit-classroom-modal.html',
  styleUrl: './create-edit-classroom-modal.scss',
})
export class CreateEditClassroomModal {
  form: FormGroup;
  isLoading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private classroomService: ClassroomService,
    private dialogRef: MatDialogRef<CreateEditClassroomModal>,
    @Inject(MAT_DIALOG_DATA) public data: Classroom | null,
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.description || '', [Validators.required]],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.isLoading = true;

    const val = this.form.value;

    if (this.isEditMode && this.data?.id) {
      this.classroomService.updateClassroom(this.data.id, val).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => (this.isLoading = false),
      });
    } else {
      this.classroomService.createClassroom(val).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => (this.isLoading = false),
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
