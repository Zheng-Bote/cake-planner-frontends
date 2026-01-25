/**
 * @file user-list.ts
 * @brief Component for displaying and managing a list of users in the admin panel.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco'; // <--- Import

import { AdminService, User, AuthService, Group } from 'shared-lib';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    TranslocoModule,
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
})
export class UserListComponent implements OnInit {
  private adminService = inject(AdminService);
  authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  translocoService = inject(TranslocoService); // Optional, if we need to translate in the code

  users = signal<User[]>([]);
  groups = signal<Group[]>([]);

  // Don't forget the 'isAdmin' column if we added it earlier
  cols = ['name', 'email', 'group', 'role', 'isAdmin', 'active', 'actions'];

  /**
   * @brief Initializes the component, loading initial user and group data.
   */
  ngOnInit() {
    this.loadData();
    this.adminService.getGroups().subscribe((g) => this.groups.set(g));
  }

  /**
   * @brief Fetches and loads the list of users from the server.
   */
  loadData() {
    this.adminService.getUsers().subscribe((data) => this.users.set(data));
  }

  /**
   * @brief Logs out the current user and reloads the page.
   */
  logout() {
    this.authService.logout();
    // Optional: Redirection usually happens in the authService or here
    location.reload();
  }

  /**
   * @brief Toggles the active status of a user.
   * @param user The user to modify.
   * @param isActive The new active status.
   */
  toggleUser(user: User, isActive: boolean) {
    this.adminService.toggleUserActive(user.id, isActive).subscribe({
      next: () => {
        // Dynamic translation with parameter {{name}}
        const msg = this.translocoService.translate('ADMIN.MSGS.STATUS_UPDATED', {
          name: user.name,
        });
        this.snackBar.open(msg, 'OK', { duration: 3000 });
      },
      error: (err) => {
        console.error(err);
        user.isActive = !isActive;
        const msg = this.translocoService.translate('ADMIN.MSGS.STATUS_ERROR');
        this.snackBar.open(msg, 'X', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * @brief Toggles the "must change password" flag for a user.
   * @param user The user to modify.
   */
  togglePasswordForce(user: User) {
    const newState = !user.mustChangePassword;
    this.adminService.forcePasswordChange(user.id, newState).subscribe({
      next: () => {
        user.mustChangePassword = newState;

        // Dynamic message depending on the status
        const key = newState ? 'ADMIN.MSGS.PWD_FORCE_ON' : 'ADMIN.MSGS.PWD_FORCE_OFF';
        const msg = this.translocoService.translate(key, { name: user.name });

        this.snackBar.open(msg, 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open(this.translocoService.translate('ADMIN.MSGS.SAVE_ERROR'), 'X', {
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * @brief Assigns a user to a different group.
   * @param user The user to modify.
   * @param groupId The ID of the new group.
   */
  onGroupChange(user: User, groupId: string) {
    this.adminService.assignGroup(user.id, groupId).subscribe({
      next: () => {
        user.groupId = groupId;
        this.snackBar.open(this.translocoService.translate('ADMIN.MSGS.GROUP_ASSIGNED'), 'OK', {
          duration: 2000,
        });
      },
      error: () => {
        this.snackBar.open(this.translocoService.translate('ADMIN.MSGS.GROUP_ERROR'), 'X', {
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * @brief Changes the role of a user within their group.
   * @param user The user to modify.
   * @param newRole The new role ('admin' or 'member').
   */
  onRoleChange(user: User, newRole: string) {
    if (!user.groupId) return; // Safety check

    this.adminService.setGroupRole(user.id, user.groupId, newRole as 'admin' | 'member').subscribe({
      next: () => {
        // Optimistic update in the frontend (if we had the field in the model)
        // Better: reload the list or patch the user
        this.snackBar.open(this.translocoService.translate('ADMIN.MSGS.ROLE_UPDATED'), 'OK', {
          duration: 2000,
        });
      },
      error: () => {
        this.snackBar.open(this.translocoService.translate('ADMIN.MSGS.ERROR'), 'X', {
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * @brief Switches the application language.
   * @param lang The language to switch to ('en' or 'de').
   */
  switchLang(lang: 'en' | 'de') {
    this.translocoService.setActiveLang(lang);
  }
}