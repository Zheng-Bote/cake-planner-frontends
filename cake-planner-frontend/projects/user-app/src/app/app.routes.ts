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
  // 3. Protected Area (Dashboard) - Lazy Loaded & Guarded
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../app/pages/dashboard/dashboard').then((m) => m.DashboardComponent),
    // Kind-Routen für das Dashboard
    children: [
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      {
        path: 'calendar',
        // Hier würden wir später die CalendarComponent lazy laden
        loadComponent: () =>
          import('../app/pages/calendar/calendar').then((m) => m.CalendarComponent),
      },
      // Platzhalter für weitere Routes
      // { path: 'history', loadComponent: ... }
    ],
  },
  // Fallback für unbekannte URLs (Optional)
  { path: '**', redirectTo: 'login' },
];
