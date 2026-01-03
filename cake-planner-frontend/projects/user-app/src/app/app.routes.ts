import { Routes } from '@angular/router';
import { authGuard } from '../../../shared-lib/src/lib/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-user/register-user').then((m) => m.RegisterUserComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },

  // WICHTIG: Die wiederhergestellte Route für Passwort-Änderung (geschützt)
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/change-password/change-password').then((m) => m.ChangePasswordComponent),
  },

  // Protected Area (Dashboard)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../app/pages/dashboard/dashboard').then((m) => m.DashboardComponent),
    children: [
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      {
        path: 'calendar',
        loadComponent: () =>
          import('../app/pages/calendar/calendar').then((m) => m.CalendarComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfileComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
