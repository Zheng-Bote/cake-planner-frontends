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
  translocoService = inject(TranslocoService); // Optional, falls wir im Code übersetzen müssen

  users = signal<User[]>([]);
  groups = signal<Group[]>([]);

  // 'isAdmin' Spalte nicht vergessen, falls wir sie vorhin hinzugefügt haben
  cols = ['name', 'email', 'group', 'role', 'isAdmin', 'active', 'actions'];

  ngOnInit() {
    this.loadData();
    this.adminService.getGroups().subscribe((g) => this.groups.set(g));
  }

  loadData() {
    this.adminService.getUsers().subscribe((data) => this.users.set(data));
  }

  logout() {
    this.authService.logout();
    // Optional: Weiterleitung passiert meist im authService oder hier
    location.reload();
  }

  toggleUser(user: User, isActive: boolean) {
    this.adminService.toggleUserActive(user.id, isActive).subscribe({
      next: () => {
        // Dynamische Übersetzung mit Parameter {{name}}
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

  togglePasswordForce(user: User) {
    const newState = !user.mustChangePassword;
    this.adminService.forcePasswordChange(user.id, newState).subscribe({
      next: () => {
        user.mustChangePassword = newState;

        // Dynamische Nachricht je nach Status
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

  // NEU: Rolle ändern
  onRoleChange(user: User, newRole: string) {
    if (!user.groupId) return; // Sicherheitscheck

    this.adminService.setGroupRole(user.id, user.groupId, newRole as 'admin' | 'member').subscribe({
      next: () => {
        // Optimistisches Update im Frontend (falls wir das Feld im Model hätten)
        // Besser: Liste neu laden oder User patchen
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

  // Hilfsfunktion zum Umschalten der Sprache (Button dafür kann in die Toolbar)
  switchLang(lang: 'en' | 'de') {
    this.translocoService.setActiveLang(lang);
  }
}
