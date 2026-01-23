import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';
import { AuthService } from 'shared-lib';

// Material Imports (passend zur Login Page)
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslocoModule,
    // Material Modules hinzufügen
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ],
  // Alias 'forgot-password' wird genutzt
  providers: [provideTranslocoScope({ scope: 'forgot_password', alias: 'forgot-password' })],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private translocoService = inject(TranslocoService);
  private router = inject(Router);

  email: string = '';
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  currentLang = this.translocoService.langChanges$;

  // Copyright Logik (wie in Login)
  currentYear = new Date().getFullYear();
  copyrightYear = this.currentYear > 2026 ? `2026–${this.currentYear}` : '2026';

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage() {
    const savedLang = localStorage.getItem('app-lang');
    if (savedLang) {
      this.translocoService.setActiveLang(savedLang);
    } else {
      const browserLang = navigator.language;
      const targetLang = browserLang.startsWith('de') ? 'de' : 'en';
      this.translocoService.setActiveLang(targetLang);
    }
  }

  // Neue Methode für den Header (wie in Login)
  switchLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('app-lang', lang);
  }

  onSubmit() {
    if (!this.email) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        const defaultSuccess = this.translocoService.translate('forgot-password.SUCCESS_DEFAULT');
        this.successMessage.set(defaultSuccess);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Forgot Password Error:', err);
        const defaultError = this.translocoService.translate('forgot-password.ERROR_DEFAULT');
        this.errorMessage.set(defaultError);
        this.isLoading.set(false);
      },
    });
  }
}
