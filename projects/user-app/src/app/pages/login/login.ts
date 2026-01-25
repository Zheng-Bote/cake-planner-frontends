/**
 * @file login.ts
 * @brief Component for the login page.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms'; // <--- FormControl was important
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';

import { AuthService, AuthResponse } from 'shared-lib';
import { RegisterUserComponent } from '../register-user/register-user';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html', // We are now using the external file
  styleUrls: ['./login.scss'], // Optional, if you have styles
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    TranslocoModule,
  ],
  providers: [provideTranslocoScope({ scope: 'login_register_user', alias: 'login_user' })],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private translocoService = inject(TranslocoService);

  // State
  requires2FA = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  currentLang = this.translocoService.langChanges$;

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
    // 1. Check if the user has ever chosen manually (localStorage remembers it permanently)
    const savedLang = localStorage.getItem('app-lang');

    if (savedLang) {
      this.translocoService.setActiveLang(savedLang);
    } else {
      // 2. Detect browser language
      const browserLang = navigator.language; // e.g. "de-DE" or "en-US"

      // If "de" is somewhere at the beginning (de, de-DE, de-CH), then use German
      const targetLang = browserLang.startsWith('de') ? 'de' : 'en';

      this.translocoService.setActiveLang(targetLang);
    }
  }

  // Form for Step 1
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  // Control for Step 2
  codeControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]);

  /**
   * @brief Finalizes the login process by storing the session token and navigating to the appropriate page.
   * @param res The authentication response from the server.
   */
  private finalizeLogin(res: AuthResponse) {
    if (res.token) {
      // 1. Save session token (sessionStorage)
      sessionStorage.setItem('token', res.token);

      // 2. Check for forced password change
      if (res.user?.mustChangePassword) {
        this.router.navigate(['/change-password']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  /**
   * @brief Handles the initial login submission with email and password.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe({
        next: (res) => {
          this.isLoading.set(false);

          if (res.require2fa) {
            this.requires2FA.set(true);
          } else {
            this.finalizeLogin(res);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.handleError(err);
        },
      });
    }
  }

  /**
   * @brief Handles the submission of the 2FA code.
   */
  onCodeSubmit() {
    if (this.codeControl.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { email, password } = this.loginForm.value;
      const code = this.codeControl.value!;

      this.authService.login(email!, password!, code).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.finalizeLogin(res);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Wrong code');
        },
      });
    }
  }

  /**
   * @brief Cancels the 2FA process and returns to the initial login form.
   */
  cancel2FA() {
    this.requires2FA.set(false);
    this.codeControl.reset();
    this.errorMessage.set('');
  }

  /**
   * @brief Handles login errors by displaying appropriate messages.
   * @param err The error object.
   */
  handleError(err: any) {
    if (err.status === 401) {
      this.errorMessage.set(this.translocoService.translate('login_user.LOGIN.WRONG_CREDENTIALS'));
      this.snackBar.open(
        this.translocoService.translate('login_user.LOGIN.WRONG_CREDENTIALS'),
        'OK',
        {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        },
      );
    } else if (err.status === 403) {
      this.errorMessage.set(this.translocoService.translate('login_user.LOGIN.ACCOUNT_INACTIVE'));
      this.snackBar.open(
        this.translocoService.translate('login_user.LOGIN.ACCOUNT_INACTIVE'),
        'OK',
        {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        },
      );
    } else {
      this.errorMessage.set(this.translocoService.translate('login_user.LOGIN.SERVER_ERROR'));
      this.snackBar.open(this.translocoService.translate('login_user.LOGIN.SERVER_ERROR'), 'OK', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
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
}