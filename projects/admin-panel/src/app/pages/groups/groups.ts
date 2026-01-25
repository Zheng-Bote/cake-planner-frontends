/**
 * @file groups.ts
 * @brief Component for managing groups in the admin panel.
 * @version 1.1.1
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
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

  /**
   * @brief Initializes the component and loads the initial group data.
   */
  ngOnInit() {
    this.loadGroups();
  }

  /**
   * @brief Displays a success message using the SnackBar.
   * @param key The translation key for the message.
   */
  private showMsg(key: string) {
    this.snackBar.open(
      this.translocoService.translate(key),
      'OK',
      { duration: 3000 } // Disappears after 3 seconds
    );
  }

  /**
   * @brief Displays an error message using the SnackBar.
   * @param key The translation key for the error message.
   */
  private showError(key: string) {
    this.snackBar.open(this.translocoService.translate(key), 'X', {
      panelClass: ['error-snackbar'], // Makes the SnackBar red
      duration: 5000, // Errors remain visible for longer
    });
  }

  /**
   * @brief Fetches and loads the list of groups from the server.
   */
  loadGroups() {
    this.adminService.getGroups().subscribe((data) => this.groups.set(data));
  }

  /**
   * @brief Creates a new group based on the name entered by the user.
   */
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

  /**
   * @brief Deletes a selected group after user confirmation.
   * @param group The group to be deleted.
   */
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
