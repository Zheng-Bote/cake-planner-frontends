import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';

import { AuthService, GroupMembership, TwoFactorSetupComponent } from 'shared-lib';
// NEW: Import for the dialog call
import { ChangePasswordComponent } from '../../pages/change-password/change-password';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    TranslocoModule,
  ],
  providers: [provideTranslocoScope({ scope: 'user_profile', alias: 'user-profile' })],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar); // NEW
  private transloco = inject(TranslocoService);

  user = this.authService.currentUser;
  selectedLanguage = signal('en');
  selectedEmailLanguage = signal('en');

  groups = signal<GroupMembership[]>([]);
  isLoadingGroups = signal(true);

  constructor() {
    const currentLangMail = this.user()?.emailLanguage;
    if (currentLangMail) {
      this.selectedEmailLanguage.set(currentLangMail);
    }
    const currentLang = this.user()?.language;
    if (currentLang) {
      this.selectedLanguage.set(currentLang);
    }
  }

  ngOnInit() {
    this.loadGroups();
  }

  /**
   * @brief Loads the user's group memberships.
   */
  loadGroups() {
    this.isLoadingGroups.set(true);
    this.http.get<GroupMembership[]>('/api/user/groups').subscribe({
      next: (data) => {
        this.groups.set(data);
        this.isLoadingGroups.set(false);
      },
      error: (err) => {
        console.error('Failed to load groups', err);
        this.isLoadingGroups.set(false);
      },
    });
  }
  /**
   * @brief Saves the user's email language setting.
   * @param lang The selected language.
   */
  saveSettingsEmailLanguage(lang: string) {
    this.selectedEmailLanguage.set(lang);
    this.http.post('/api/user/settings', { languageEmail: lang }).subscribe({
      next: () => {
        // Replaced ugly alert with SnackBar
        this.snackBar.open(this.transloco.translate('user-profile.PROFILE.SAVE_SUCCESS'), 'OK', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
      },
      error: () => {
        this.snackBar.open(this.transloco.translate('user-profile.PROFILE.SAVE_ERROR'), 'OK', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
  /**
   * @brief Saves the user's language setting.
   * @param lang The selected language.
   */
  saveSettingsLanguage(lang: string) {
    this.selectedLanguage.set(lang);
    this.http.post('/api/user/settings', { language: lang }).subscribe({
      next: () => {
        // Replaced ugly alert with SnackBar
        this.snackBar.open(this.transloco.translate('user-profile.PROFILE.SAVE_SUCCESS'), 'OK', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
      },
      error: () => {
        this.snackBar.open(this.transloco.translate('user-profile.PROFILE.SAVE_ERROR'), 'OK', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * @brief Opens the 2FA setup dialog.
   */
  open2FA() {
    this.dialog.open(TwoFactorSetupComponent, { width: '400px' });
  }

  /**
   * @brief Opens the change password dialog.
   */
  changePassword() {
    this.dialog.open(ChangePasswordComponent, {
      width: '400px',
      disableClose: false, // User can cancel
    });
  }

  /**
   * @brief Deletes the user's account after confirmation.
   */
  deleteAccount() {
    if (confirm(this.transloco.translate('user-profile.PROFILE.DELETE_CONFIRM'))) {
      this.http.delete('/api/user').subscribe({
        next: () => {
          this.authService.logout();
        },
        error: () => alert('Could not delete account.'),
      });
    }
  }
}
