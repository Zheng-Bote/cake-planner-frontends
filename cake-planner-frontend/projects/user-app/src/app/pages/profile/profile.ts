import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // NEU
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { AuthService, TwoFactorSetupComponent } from 'shared-lib';
// NEU: Importieren für den Dialog-Aufruf
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
    TranslocoModule,
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar); // NEU
  private transloco = inject(TranslocoService);

  user = this.authService.currentUser;
  selectedLanguage = signal('en');
  selectedEmailLanguage = signal('en');

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

  ngOnInit() {}

  saveSettingsEmailLanguage(lang: string) {
    this.selectedEmailLanguage.set(lang);
    this.http.post('/api/user/settings', { languageEmail: lang }).subscribe({
      next: () => {
        // 1a. Hässliches Alert durch SnackBar ersetzt
        this.snackBar.open(this.transloco.translate('PROFILE.SAVE_SUCCESS'), 'OK', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
      },
      error: () => {
        this.snackBar.open(this.transloco.translate('PROFILE.SAVE_ERROR'), 'OK', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
  saveSettingsLanguage(lang: string) {
    this.selectedLanguage.set(lang);
    this.http.post('/api/user/settings', { language: lang }).subscribe({
      next: () => {
        // 1a. Hässliches Alert durch SnackBar ersetzt
        this.snackBar.open(this.transloco.translate('PROFILE.SAVE_SUCCESS'), 'OK', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
      },
      error: () => {
        this.snackBar.open(this.transloco.translate('PROFILE.SAVE_ERROR'), 'OK', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  open2FA() {
    this.dialog.open(TwoFactorSetupComponent, { width: '400px' });
  }

  // 1b. Passwort ändern als Dialog
  changePassword() {
    this.dialog.open(ChangePasswordComponent, {
      width: '400px',
      disableClose: false, // User kann abbrechen
    });
  }

  deleteAccount() {
    if (confirm(this.transloco.translate('PROFILE.DELETE_CONFIRM'))) {
      this.http.delete('/api/user').subscribe({
        next: () => {
          this.authService.logout();
        },
        error: () => alert('Could not delete account.'),
      });
    }
  }
}
