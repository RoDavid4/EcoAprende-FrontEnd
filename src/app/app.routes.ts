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
import { Missions } from './features/missions/missions';
import {MissionDetail} from './features/missions/mission-detail/mission-detail';
import { MySubmissions } from './features/missions/my-submissions/my-submissions';

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
    path: 'missions',
    component: Missions,
    canActivate: [authGuard],
  },
  {
     path: 'missions/submissions',
    component: MySubmissions,
    canActivate: [authGuard],
  },
  {
    path: 'missions/:id',
    component: MissionDetail,
    canActivate: [authGuard],
  },
  
  {
    path: 'classrooms/:id/lista',
    component: ClassroomRoster,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
