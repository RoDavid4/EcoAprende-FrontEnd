import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-btn-create',
  imports: [CommonModule, MatIconModule],
  templateUrl: './btn-create.html',
  styleUrl: './btn-create.scss',
})
export class BtnCreate {
  @Input() label: string = 'Agregar';
  @Input() icon: string = 'add';

  @Output() action = new EventEmitter<void>();

  onClick() {
    this.action.emit();
  }
}
