import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Pfad anpassen

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser();

  // 1. Nicht eingeloggt? Raus!
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  // 2. Check: Ist er mächtig genug?
  // A) Globaler Super-Admin
  if (user.isAdmin) {
    return true;
  }

  // B) Lokaler Gruppen-Admin (Das braucht Bob!)
  // Wir prüfen: Hat er die Rolle 'admin' UND gehört er zu einer Gruppe?
  if (user.groupRole === 'admin' && user.groupId) {
    return true;
  }

  // 3. Wenn keiner der Fälle zutrifft -> Zugriff verweigert
  // (z.B. zurück zum Dashboard der User-App oder Login)
  return router.createUrlTree(['/']);
};
