/**
 * @file admin.guard.ts
 * @brief Route guard to protect admin-only routes.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust path

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser();

  // 1. Not logged in? Out!
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  // 2. Check: Is he powerful enough?
  // A) Global Super-Admin
  if (user.isAdmin) {
    return true;
  }

  // B) Local Group-Admin (Bob needs this!)
  // We check: Does he have the role 'admin' AND does he belong to a group?
  if (user.groupRole === 'admin' && user.groupId) {
    return true;
  }

  // 3. If none of the cases apply -> Access denied
  // (e.g. back to the user app dashboard or login)
  return router.createUrlTree(['/']);
};