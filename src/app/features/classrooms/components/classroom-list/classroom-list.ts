import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Classroom } from '../../../../core/models/classroom.model';

@Component({
  selector: 'app-classroom-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './classroom-list.html',
  styleUrl: './classroom-list.scss',
})
export class ClassroomList {
  @Input() classrooms: Classroom[] = [];
  @Input() isLoading = false;

  // Eventos para avisar a la página principal
  @Output() createRequested = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<Classroom>();
  @Output() rosterRequested = new EventEmitter<string>();

  onCreate(): void {
    this.createRequested.emit();
  }

  onEdit(classroom: Classroom, event: Event): void {
    event.stopPropagation();
    this.editRequested.emit(classroom);
  }

  onGoToRoster(classroomId: string, event: Event): void {
    event.stopPropagation();
    this.rosterRequested.emit(classroomId);
  }

  copyCode(code: string, event: Event): void {
    event.stopPropagation();
    navigator.clipboard.writeText(code);
    alert(`Código ${code} copiado al portapapeles.`);
  }
}
