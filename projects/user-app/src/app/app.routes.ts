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
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPasswordComponent),
  },

  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('../../../shared-lib/src/lib/pages/data-protection/data-protection').then(
        (m) => m.DataProtectionComponent,
      ),
  },
  {
    path: 'legal-notice',
    loadComponent: () =>
      import('../../../shared-lib/src/lib/pages/imprint/imprint').then((m) => m.ImprintComponent),
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

      // Hall of Fame
      {
        path: 'hall-of-fame',
        loadComponent: () =>
          import('./components/hall-of-fame/hall-of-fame').then((m) => m.HallOfFameComponent),
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

      {
        path: 'data-protection',
        loadComponent: () =>
          import('../../../shared-lib/src/lib/pages/data-protection/data-protection').then(
            (m) => m.DataProtectionComponent,
          ),
      },
      {
        path: 'imprint',
        loadComponent: () =>
          import('../../../shared-lib/src/lib/pages/imprint/imprint').then(
            (m) => m.ImprintComponent,
          ),
      },

      {
        path: 'system-infos',
        loadComponent: () =>
          import('../../../shared-lib/src/lib/pages/system-infos/system-infos').then(
            (m) => m.SystemInfosComponent,
          ),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'dashboard' },
];
