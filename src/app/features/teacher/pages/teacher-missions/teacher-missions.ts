import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

import {
  MissionsService,
  Mission,
  CreateMissionRequest,
} from '../../../missions/missions.service';

@Component({
  selector: 'app-teacher-missions',
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
  ],
  templateUrl: './teacher-missions.html',
  styleUrl: './teacher-missions.scss',
})
export class TeacherMissions implements OnInit {
  private missionsService = inject(MissionsService);
  private dialog = inject(MatDialog);

  missions: Mission[] = [];
  editingMission: Mission | null = null;

  loading = false;
  errorMessage = '';

  showCreateForm = false;
  creating = false;

  newMission: CreateMissionRequest = {
    title: '',
    description: '',
    type: 'DIGITAL',
    pointsReward: 10,
    instructions: '',
    imageUrl: '',
    isActive: true,
  };

  ngOnInit(): void {
    this.loadMissions();
  }

  // ================================
  // CARGAR MISIONES
  // ================================

  loadMissions(): void {
    this.loading = true;
    this.errorMessage = '';

    this.missionsService.getMissions().subscribe({
      next: (data) => {
        console.log('Misiones:', data);

        this.missions = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(
          'Error al cargar las misiones:',
          error
        );

        this.errorMessage =
          'No se pudieron cargar las misiones.';

        this.loading = false;
      },
    });
  }

  // ================================
  // FORMULARIO
  // ================================

  openCreateForm(): void {
  this.editingMission = null;
  this.showCreateForm = true;
  this.errorMessage = '';

  this.newMission = {
    title: '',
    description: '',
    type: 'DIGITAL',
    pointsReward: 10,
    instructions: '',
    imageUrl: '',
    isActive: true,
  };
}

openEditForm(mission: Mission): void {
  this.editingMission = mission;
  this.showCreateForm = true;
  this.errorMessage = '';

  this.newMission = {
    title: mission.title,
    description: mission.description,
    type: mission.type,
    pointsReward: mission.pointsReward,
    instructions: mission.instructions || '',
    imageUrl: mission.imageUrl || '',
    moduleId: mission.moduleId,
    isActive: mission.isActive,
  };
}

  closeCreateForm(): void {
  if (this.creating) {
    return;
  }

  this.showCreateForm = false;
  this.editingMission = null;
}

  // ================================
  // CREAR MISIÓN
  // ================================

  createMission(): void {
    if (
      !this.newMission.title.trim() ||
      !this.newMission.description.trim()
    ) {
      this.errorMessage =
        'El título y la descripción son obligatorios.';
      return;
    }

    if (this.newMission.pointsReward <= 0) {
      this.errorMessage =
        'Los puntos de recompensa deben ser mayores a 0.';
      return;
    }

    this.creating = true;
    this.errorMessage = '';

    const mission: CreateMissionRequest = {
      title: this.newMission.title.trim(),
      description: this.newMission.description.trim(),
      type: this.newMission.type,
      pointsReward: Number(this.newMission.pointsReward),
      instructions:
        this.newMission.instructions?.trim() || undefined,
      imageUrl:
        this.newMission.imageUrl?.trim() || undefined,
      isActive: this.newMission.isActive,
    };

    this.missionsService.createMission(mission).subscribe({
      next: (createdMission) => {
        console.log(
          'Misión creada:',
          createdMission
        );

        this.missions = [
          createdMission,
          ...this.missions,
        ];

        this.showCreateForm = false;
        this.creating = false;
      },

      error: (error) => {
        console.error(
          'Error al crear la misión:',
          error
        );

        this.errorMessage =
          'No se pudo crear la misión. Verifica los datos e intenta nuevamente.';

        this.creating = false;
      },
    });
  }

  updateMission(): void {
  if (!this.editingMission) {
    return;
  }

  if (
    !this.newMission.title.trim() ||
    !this.newMission.description.trim()
  ) {
    this.errorMessage =
      'El título y la descripción son obligatorios.';
    return;
  }

  if (this.newMission.pointsReward <= 0) {
    this.errorMessage =
      'Los puntos de recompensa deben ser mayores a 0.';
    return;
  }

  this.creating = true;
  this.errorMessage = '';

  const mission: CreateMissionRequest = {
    title: this.newMission.title.trim(),
    description: this.newMission.description.trim(),
    type: this.newMission.type,
    pointsReward: Number(this.newMission.pointsReward),
    instructions:
      this.newMission.instructions?.trim() || undefined,
    imageUrl:
      this.newMission.imageUrl?.trim() || undefined,
    moduleId: this.newMission.moduleId,
    isActive: this.newMission.isActive,
  };

  this.missionsService
    .updateMission(this.editingMission.id, mission)
    .subscribe({
      next: (updatedMission) => {
        console.log(
          'Misión actualizada:',
          updatedMission
        );

        this.missions = this.missions.map((mission) =>
          mission.id === updatedMission.id
            ? updatedMission
            : mission
        );

        this.showCreateForm = false;
        this.editingMission = null;
        this.creating = false;
      },

      error: (error) => {
        console.error(
          'Error al actualizar la misión:',
          error
        );

        this.errorMessage =
          'No se pudo actualizar la misión. Verifica los datos e intenta nuevamente.';

        this.creating = false;
      },
    });
}

deleteMission(mission: Mission): void {
  const confirmed = confirm(
    `¿Estás seguro de que quieres eliminar la misión "${mission.title}"?`
  );

  if (!confirmed) {
    return;
  }

  this.errorMessage = '';

  this.missionsService.deleteMission(mission.id).subscribe({
    next: () => {
      console.log('Misión eliminada:', mission.id);

      this.missions = this.missions.filter(
        (item) => item.id !== mission.id
      );
    },

    error: (error) => {
      console.error(
        'Error al eliminar la misión:',
        error
      );

      this.errorMessage =
        'No se pudo eliminar la misión. Intenta nuevamente.';
    },
  });
}

  // ================================
  // RECARGAR
  // ================================

  reloadMissions(): void {
    this.loadMissions();
  }
}