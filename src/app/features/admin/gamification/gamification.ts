import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {
  Badge,
  BadgeIcon,
  GamificationService,
} from '../../gamification/services/gamification.service';

@Component({
  selector: 'app-admin-gamification',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  templateUrl: './gamification.html',
  styleUrl: './gamification.scss',
})
export class AdminGamification implements OnInit {
  private gamificationService = inject(GamificationService);

  badges: Badge[] = [];
  badgeIcons: BadgeIcon[] = [];

  loading = true;
  errorMessage = '';

  showCreateForm = false;

creatingBadge = false;
createErrorMessage = '';

newBadge = {
  code: '',
  name: '',
  description: '',
  iconUrl: '',
  xpValue: 0,
  category: 'SPECIAL' as
    | 'ECOLOGY'
    | 'ACADEMIC'
    | 'COMMUNITY'
    | 'STREAK'
    | 'SPECIAL',
  triggerEvent: 'MANUAL' as
    | 'STREAK'
    | 'TOTAL_XP'
    | 'LESSONS_COMPLETED'
    | 'QUIZZES_PASSED'
    | 'MISSIONS_APPROVED'
    | 'MANUAL',
  triggerValue: 0,
};

  ngOnInit(): void {
    this.loadGamificationData();
  }

  private loadGamificationData(): void {
    this.loading = true;
    this.errorMessage = '';

    this.gamificationService.getBadges().subscribe({
      next: (badges) => {
        console.log('Insignias:', badges);
        this.badges = badges;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar insignias:', error);
        this.errorMessage = 'No se pudieron cargar las insignias.';
        this.loading = false;
      },
    });

    this.gamificationService.getBadgeIcons().subscribe({
      next: (icons) => {
        console.log('Íconos disponibles:', icons);
        this.badgeIcons = icons;
      },
      error: (error) => {
        console.error('Error al cargar íconos:', error);
      },
    });
  }

  getBadgeIconUrl(iconId: string): string {
    const icon = this.badgeIcons.find(
      (badgeIcon) => badgeIcon.id === iconId
    );

    return icon?.url ?? '';
  }

  openCreateForm(): void {
  this.showCreateForm = true;
  this.createErrorMessage = '';
}

closeCreateForm(): void {
  this.showCreateForm = false;
  this.createErrorMessage = '';
}

createBadge(): void {
  this.createErrorMessage = '';

  if (
    !this.newBadge.code.trim() ||
    !this.newBadge.name.trim() ||
    !this.newBadge.description.trim() ||
    !this.newBadge.iconUrl
  ) {
    this.createErrorMessage =
      'Completá todos los campos obligatorios.';
    return;
  }

  this.creatingBadge = true;

  this.gamificationService.createBadge({
    code: this.newBadge.code.trim(),
    name: this.newBadge.name.trim(),
    description: this.newBadge.description.trim(),
    iconUrl: this.newBadge.iconUrl,
    xpValue: this.newBadge.xpValue,
    category: this.newBadge.category,
    triggerEvent: this.newBadge.triggerEvent,
    triggerValue:
      this.newBadge.triggerEvent === 'MANUAL'
        ? 0
        : this.newBadge.triggerValue,
  }).subscribe({
    next: (badge) => {
      console.log('Insignia creada:', badge);

      this.badges = [...this.badges, badge];

      this.closeCreateForm();
      this.resetCreateForm();
      this.creatingBadge = false;
    },
    error: (error) => {
      console.error('Error al crear insignia:', error);

      this.createErrorMessage =
        error?.error?.message ||
        'No se pudo crear la insignia.';

      this.creatingBadge = false;
    },
  });
}

resetCreateForm(): void {
  this.newBadge = {
    code: '',
    name: '',
    description: '',
    iconUrl: '',
    xpValue: 0,
    category: 'SPECIAL',
    triggerEvent: 'MANUAL',
    triggerValue: 0,
  };
}
}