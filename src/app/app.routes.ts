import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Home } from './features/home/home'
import { authGuard } from './core/guards/auth-guard';
import { Register } from './features/register/register';

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
    path: 'home',
    component: Home,
    canActivate: [authGuard],
  },
];