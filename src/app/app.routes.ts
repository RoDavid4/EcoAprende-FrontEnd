import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';
import { Register } from './features/register/register';
import { ForgotPassword } from './features/forgot-password/forgot-password';
import { ResetPassword } from './features/reset-password/reset-password';
import { Profile } from './features/profile/profile';
import { ClassroomRoster } from './features/classrooms/pages/classroom-roster/classroom-roster';
import { ClassroomManagement } from './features/classrooms/pages/classroom-management/classroom-management';
import { CourseManagement } from './features/courses/pages/course-management/course-management';
import { CourseList } from './features/courses/pages/course-list/course-list';
import { ModuleBuilder } from './features/courses/components/module-builder/module-builder';
import { ClassroomAssignmentsPage } from './features/classroom-assignments/pages/classroom-assignments-page/classroom-assignments-page';
import { ClassroomDetail } from './features/classrooms/pages/classroom-detail/classroom-detail';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'reset-password',
    component: ResetPassword,
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'classrooms',
    component: ClassroomManagement,
    canActivate: [authGuard],
  },
  {
    path: 'classrooms/:id',
    component: ClassroomDetail,
    canActivate: [authGuard],
  },
  {
    path: 'classrooms/:id/lista',
    component: ClassroomRoster,
    canActivate: [authGuard],
  },
  {
    path: 'courses',
    component: CourseList,
    canActivate: [authGuard],
  },
  {
    path: 'courses/new',
    component: CourseManagement,
    canActivate: [authGuard],
  },
  {
    path: 'courses/edit/:id',
    component: CourseManagement,
    canActivate: [authGuard],
  },
  {
    path: 'classrooms/:id/assignments',
    component: ClassroomAssignmentsPage,
    canActivate: [authGuard],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
