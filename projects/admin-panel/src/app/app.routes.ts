/**
 * @file app.routes.ts
 * @brief Application routes for the admin panel.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Routes } from '@angular/router';
// IMPORTANT: We use the local guard that redirects to the admin login page
import { adminGuard } from 'shared-lib';

export const routes: Routes = [
  {
    path: 'login',
    // Lazy loading of the login component
    // Note: Path '.component' added, in case your file is named that way (standard)
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
        // The adminGuard protects this route
        canActivate: [adminGuard],
        // Lazy loading of the list component
        loadComponent: () => import('./pages/user-list/user-list').then((m) => m.UserListComponent),
      },
      {
        path: 'groups',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/groups/groups').then((m) => m.AdminGroupsComponent),
      },
    ],
  },
  // FALLBACK: Catches all unknown URLs and redirects to login
  {
    path: '**',
    redirectTo: 'login',
  },
];