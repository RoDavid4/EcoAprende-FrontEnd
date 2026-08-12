import { Routes } from '@angular/router';
import { TeacherDashboard } from './features/classrooms/pages/teacher-dashboard/teacher-dashboard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'classrooms/teacher',
    pathMatch: 'full',
  },
  {
    path: 'classrooms/teacher',
    component: TeacherDashboard,
  },

  {
    path: '**',
    redirectTo: 'classrooms/teacher',
  },
];
