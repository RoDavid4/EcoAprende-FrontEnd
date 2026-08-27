import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.services';
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const token = localStorage.getItem('access_token');
    const user = authService.getCurrentUser();
    if (!token || !user) {
      return router.createUrlTree(['/login']);
    }
    if (!allowedRoles.includes(user.role)) {
      return router.createUrlTree(['/home']);
    }
    return true;
  };
};
