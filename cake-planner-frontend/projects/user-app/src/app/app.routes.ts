import { Routes } from '@angular/router';
import { authGuard } from '../../../shared-lib/src/lib/guards/auth.guard';

export const routes: Routes = [
  // 1. Public Routes (Login, Register) - Kein Layout
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-user/register-user').then((m) => m.RegisterUserComponent),
  },

  // 2. Protected Area (Mit Main Layout)
  {
    path: '',
    canActivate: [authGuard],
    // Das Layout wird lazy geladen
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard Inhalt
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
      },

      // Kalender
      {
        path: 'calendar',
        loadComponent: () => import('./pages/calendar/calendar').then((m) => m.CalendarComponent),
      },

      // Profil
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfileComponent),
      },

      // Passwort ändern (als Teil des Layouts oder Standalone? Meist Standalone, aber hier im Layout integriert)
      {
        path: 'change-password',
        loadComponent: () =>
          import('./pages/change-password/change-password').then((m) => m.ChangePasswordComponent),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'dashboard' },
];
