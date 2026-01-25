/**
 * @file auth.guard.ts
 * @brief Route guard to protect routes that require authentication.
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
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Since authService.isAuthenticated is a signal, we call it with ()
  if (authService.isAuthenticated()) {
    return true;
  }

  // Not logged in -> Redirect to login
  return router.createUrlTree(['/login']);
};