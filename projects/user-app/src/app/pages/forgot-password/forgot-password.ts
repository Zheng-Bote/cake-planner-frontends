/**
 * @file forgot-password.ts
 * @brief Component for the forgot password page.
 * @version 1.1.0
 * @date 2026-02-08
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService } from 'shared-lib';

// Material Imports (matching the Login Page)
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
    // Add Material Modules
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ],
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

  // Copyright logic (as in Login)
  currentYear = new Date().getFullYear();
  copyrightYear = this.currentYear > 2026 ? `2026–${this.currentYear}` : '2026';

  /**
   * @brief Constructs the component and initializes the language.
   */
  constructor() {
    this.initializeLanguage();
  }

  /**
   * @brief Initializes the application language based on saved preferences or browser language.
   */
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

  /**
   * @brief Switches the application language.
   * @param lang The language to switch to.
   */
  switchLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('app-lang', lang);
  }

  /**
   * @brief Handles the form submission for the forgot password request.
   */
  onSubmit() {
    if (!this.email) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        const defaultSuccess = this.translocoService.translate('PASSWORD.SUCCESS_DEFAULT');
        this.successMessage.set(defaultSuccess);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Forgot Password Error:', err);
        const defaultError = this.translocoService.translate('PASSWORD.ERROR_DEFAULT');
        this.errorMessage.set(defaultError);
        this.isLoading.set(false);
      },
    });
  }
}
