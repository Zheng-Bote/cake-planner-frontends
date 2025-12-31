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
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
})
export class UserListComponent implements OnInit {
  private adminService = inject(AdminService);
  authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  users = signal<User[]>([]);
  groups = signal<Group[]>([]);

  // 'isAdmin' Spalte nicht vergessen, falls wir sie vorhin hinzugefügt haben
  cols = ['name', 'email', 'group', 'isAdmin', 'active', 'actions'];

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
    // 1. Backend Anfrage
    this.adminService.toggleUserActive(user.id, isActive).subscribe({
      next: () => {
        // Erfolg: Grüne/Neutrale Info
        this.snackBar.open(`Status für ${user.name} aktualisiert.`, 'OK', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error(err);

        // UI Reset: Schalter zurücksetzen, da es nicht geklappt hat
        user.isActive = !isActive;

        // Fehler: Rote SnackBar (über CSS Klasse 'error-snackbar')
        this.snackBar.open('Fehler: Status konnte nicht gespeichert werden!', 'Schließen', {
          duration: 5000,
          panelClass: ['error-snackbar'], // <--- Das verweist auf unser CSS
        });
      },
    });
  }

  togglePasswordForce(user: User) {
    const newState = !user.mustChangePassword;
    this.adminService.forcePasswordChange(user.id, newState).subscribe({
      next: () => {
        user.mustChangePassword = newState; // UI update
        const msg = newState
          ? `Passwort-Änderung für ${user.name} erzwungen.`
          : `Passwort-Zwang für ${user.name} aufgehoben.`;
        this.snackBar.open(msg, 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Fehler beim Speichern!', 'Zu', {
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  onGroupChange(user: User, groupId: string) {
    this.adminService.assignGroup(user.id, groupId).subscribe({
      next: () => {
        user.groupId = groupId; // UI Update
        this.snackBar.open('Gruppe zugewiesen', 'OK', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Fehler beim Zuweisen', 'X', { panelClass: ['error-snackbar'] });
      },
    });
  }
}
