import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { AuthService, TwoFactorSetupComponent } from 'shared-lib';

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
  private transloco = inject(TranslocoService);

  user = this.authService.currentUser;
  selectedLanguage = signal('en'); // Default Fallback

  constructor() {
    // Sprache aus dem User-Objekt laden, sobald die Komponente erstellt wird
    const currentLang = this.user()?.emailLanguage;
    if (currentLang) {
      this.selectedLanguage.set(currentLang);
    }
  }

  ngOnInit() {
    // Optional: Hier könnte man User-Daten refreshen
  }

  saveSettings(lang: string) {
    this.selectedLanguage.set(lang);
    this.http.post('/api/user/settings', { language: lang }).subscribe({
      next: () => {
        alert(this.transloco.translate('PROFILE.SAVE_SUCCESS'));
      },
      error: () => alert('Error saving settings'),
    });
  }

  open2FA() {
    this.dialog.open(TwoFactorSetupComponent, { width: '400px' });
  }

  changePassword() {
    this.router.navigate(['/change-password']);
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
