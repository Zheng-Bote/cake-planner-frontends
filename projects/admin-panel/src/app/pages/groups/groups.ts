/**
 * AdminGroupsComponent
 * @description Component for managing groups
 * @author Zheng Bote
 * @version 1.1.1
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { AdminService, Group } from 'shared-lib';

@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSnackBarModule,
    TranslocoDirective,
  ],
  templateUrl: './groups.html',
  styleUrls: ['./groups.css'],
})
export class AdminGroupsComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);
  private translocoService = inject(TranslocoService);

  groups = signal<Group[]>([]);
  displayedColumns = ['name', 'id', 'actions'];
  newGroupName = signal('');

  ngOnInit() {
    this.loadGroups();
  }

  /**
   * Zeigt eine Erfolgsmeldung per SnackBar an
   */
  private showMsg(key: string) {
    this.snackBar.open(
      this.translocoService.translate(key),
      'OK',
      { duration: 3000 } // Verschwindet nach 3 Sek.
    );
  }

  /**
   * INTERNE SNACKBAR LOGIK (Fehler)
   * Nutzt die rote CSS-Klasse analog zur user-list.ts
   */
  private showError(key: string) {
    this.snackBar.open(this.translocoService.translate(key), 'X', {
      panelClass: ['error-snackbar'], // Macht die SnackBar rot
      duration: 5000, // Fehler bleiben länger sichtbar
    });
  }

  loadGroups() {
    this.adminService.getGroups().subscribe((data) => this.groups.set(data));
  }

  createGroup() {
    const name = this.newGroupName().trim();
    if (!name) return;

    this.adminService.createGroup(name).subscribe({
      next: (group) => {
        this.groups.update((gs) => [...gs, group]);
        this.newGroupName.set('');
        this.showMsg('ADMIN.MSGS.GROUP_CREATED');
      },
      error: () => {
        this.showError('ADMIN.MSGS.ERROR');
      },
    });
  }

  deleteGroup(group: Group) {
    const confirmMsg = this.translocoService.translate('ADMIN.MSGS.GROUPS.CONFIRM_DELETE', {
      name: group.name,
    });
    if (!confirm(confirmMsg)) return;

    this.adminService.deleteGroup(group.id).subscribe({
      next: () => {
        this.groups.update((gs) => gs.filter((g) => g.id !== group.id));
        this.showMsg('ADMIN.MSGS.GROUP_DELETED');
      },
      error: () => {
        this.showError('ADMIN.MSGS.GROUP_DELETE_ERR');
      },
    });
  }
}
