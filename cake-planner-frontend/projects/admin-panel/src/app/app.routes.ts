import { Routes } from '@angular/router';
// WICHTIG: Wir nutzen den lokalen Guard, der zur Admin-Login Seite leitet
import { adminGuard } from 'shared-lib';

export const routes: Routes = [
  {
    path: 'login',
    // Lazy Loading der Login-Komponente
    // Hinweis: Pfad '.component' ergänzt, falls Ihre Datei so heißt (Standard)
    loadComponent: () => import('./pages/login/login').then((m) => m.AdminLoginComponent),
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

  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        // Hier schützt der adminGuard die Route
        canActivate: [adminGuard],
        // Lazy Loading der Listen-Komponente
        loadComponent: () => import('./pages/user-list/user-list').then((m) => m.UserListComponent),
      },
      {
        path: 'groups',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/groups/groups').then((m) => m.AdminGroupsComponent),
      },
    ],
  },
  // FALLBACK: Fängt alle unbekannten URLs ab und leitet zum Login
  {
    path: '**',
    redirectTo: 'login',
  },
];
