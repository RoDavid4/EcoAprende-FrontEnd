import { Routes } from '@angular/router';
import { TeacherDashboard } from './features/classrooms/pages/teacher-dashboard/teacher-dashboard';
import { ClassroomRoster } from './features/classrooms/pages/classroom-roster/classroom-roster';

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
    path: 'classrooms/:id/lista',
    component: ClassroomRoster,
  },

  {
    path: '**',
    redirectTo: 'classrooms/profesor',
  },
];
