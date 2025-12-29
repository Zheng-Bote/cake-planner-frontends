import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Da authService.isAuthenticated ein Signal ist, rufen wir es mit () auf
  if (authService.isAuthenticated()) {
    return true;
  }

  // Nicht eingeloggt -> Redirect zum Login
  return router.createUrlTree(['/login']);
};
