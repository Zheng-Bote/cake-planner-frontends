import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'shared-lib';

export const panelGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wir prüfen den User aus dem Shared Service
  const user = auth.currentUser();

  // Nur reinlassen, wenn User existiert UND Admin ist
  if (user && user.isAdmin) {
    return true;
  }

  // WICHTIG: Im Admin-Panel leiten wir zum Login, nicht zum Dashboard
  return router.createUrlTree(['/login']);
};
