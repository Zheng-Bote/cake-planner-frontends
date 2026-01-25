/**
 * @file login.ts
 * @brief Component for the admin login page.
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
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco'; // Import

import { AuthService, AuthResponse } from 'shared-lib'; //

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    TranslocoModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private translocoService = inject(TranslocoService); // NEU

  // State (übernommen aus User-App)
  requires2FA = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  currentYear = new Date().getFullYear();
  copyrightYear = this.currentYear > 2026 ? `2026–${this.currentYear}` : '2026';

  // Form für Step 1 (Email/Passwort)
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  // Control für Step 2 (2FA Code)
  codeControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  /**
   * @brief Handles the initial login submission with email and password.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { email, password } = this.loginForm.value;

      this.auth.login(email!, password!).subscribe({
        next: (res: AuthResponse) => {
          this.isLoading.set(false);

          // Fall A: 2FA wird benötigt (Server sagt: require2fa = true)
          if (res.require2fa) {
            this.requires2FA.set(true); // Umschalten auf Code-Eingabe
          }
          // Fall B: Login direkt erfolgreich (User hat kein 2FA oder Token direkt erhalten)
          else {
            this.finalizeLogin(res);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(this.translocoService.translate('ADMIN.LOGIN.ERR_LOGIN_FAILED'));
          console.error(err);
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

      // Login erneut aufrufen, diesmal mit Code
      this.auth.login(email!, password!, code).subscribe({
        next: (res: AuthResponse) => {
          this.isLoading.set(false);
          this.finalizeLogin(res);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(this.translocoService.translate('ADMIN.LOGIN.ERR_WRONG_CODE'));
        },
      });
    }
  }

  /**
   * @brief Finalizes the login process after a successful authentication response.
   * @param res The authentication response from the server.
   */
  private finalizeLogin(res: AuthResponse) {
    const user = res.user;

    // Check: Globaler Admin ODER Gruppen-Admin
    const isGlobalAdmin = user?.isAdmin;
    const isLocalAdmin = user?.groupRole === 'admin' && !!user?.groupId;

    if (isGlobalAdmin || isLocalAdmin) {
      this.router.navigate(['/users']);
    } else {
      this.errorMessage.set(this.translocoService.translate('ADMIN.LOGIN.ERR_ACCESS_DENIED'));
      this.auth.logout(); // Token vernichten, falls vorhanden
      this.requires2FA.set(false); // Reset UI
      this.loginForm.reset();
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
   * @brief Switches the application language.
   * @param lang The language to switch to.
   */
  switchLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('admin-lang', lang); // Ggf. separater Key für Admin Präferenz
  }
}