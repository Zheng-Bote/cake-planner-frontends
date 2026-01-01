import { Routes } from '@angular/router';
// WICHTIG: Wir nutzen den lokalen Guard, der zur Admin-Login Seite leitet
import { adminGuard } from 'shared-lib';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'login',
    // Lazy Loading der Login-Komponente
    // Hinweis: Pfad '.component' ergänzt, falls Ihre Datei so heißt (Standard)
    loadComponent: () => import('./pages/login/login').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'users',
    // Hier schützt der adminGuard die Route
    canActivate: [adminGuard],
    // Lazy Loading der Listen-Komponente
    loadComponent: () => import('./pages/user-list/user-list').then((m) => m.UserListComponent),
  },
  // FALLBACK: Fängt alle unbekannten URLs ab und leitet zum Login
  {
    path: '**',
    redirectTo: 'login',
  },
];
