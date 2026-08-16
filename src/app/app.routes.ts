import { Routes } from '@angular/router';
import { ClassroomRoster } from './features/classrooms/pages/classroom-roster/classroom-roster';
import { ClassroomManagement } from './features/classrooms/pages/classroom-management/classroom-management';
import { ClassroomStudents } from './features/classrooms/pages/classroom-students/classroom-students';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'classrooms/profesor',
    pathMatch: 'full',
  },
  {
    path: 'classrooms/profesor',
    component: ClassroomManagement,
  },
  {
    path: 'classrooms/:id/lista',
    component: ClassroomRoster,
  },
  {
    path: 'classrooms/estudiante',
    component: ClassroomStudents,
  },
  {
    path: '**',
    redirectTo: 'classrooms/profesor',
  },
];
