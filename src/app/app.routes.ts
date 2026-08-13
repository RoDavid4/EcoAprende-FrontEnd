import { Routes } from '@angular/router';
import { TeacherDashboard } from './features/classrooms/pages/teacher-dashboard/teacher-dashboard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'classrooms/profesor',
    pathMatch: 'full',
  },
  {
    path: 'classrooms/profesor',
    component: TeacherDashboard,
  },

  {
    path: '**',
    redirectTo: 'classrooms/profesor',
  },
];
