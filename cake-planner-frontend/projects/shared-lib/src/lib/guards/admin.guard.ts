import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wir prüfen auf das Signal currentUser()
  const user = auth.currentUser();

  if (user && user.isAdmin) {
    return true;
  }

  // Nicht berechtigt -> Zurück zum Dashboard oder Login
  return router.createUrlTree(['/dashboard']);
};
