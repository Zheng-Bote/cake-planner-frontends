import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms'; // <--- FormControl war wichtig
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
  templateUrl: './login.html', // Wir nutzen jetzt die externe Datei
  styleUrls: ['./login.scss'], // Optional, falls du styles hast
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

  constructor() {
    this.initializeLanguage();
  }

  // --- Logik zur Spracherkennung ---
  private initializeLanguage() {
    // 1. Prüfen, ob der User schonmal manuell gewählt hat (localStorage merkt es sich dauerhaft)
    const savedLang = localStorage.getItem('app-lang');

    if (savedLang) {
      this.translocoService.setActiveLang(savedLang);
    } else {
      // 2. Browser-Sprache erkennen
      const browserLang = navigator.language; // z.B. "de-DE" oder "en-US"

      // Wenn "de" irgendwo am Anfang steht (de, de-DE, de-CH), dann Deutsch nutzen
      const targetLang = browserLang.startsWith('de') ? 'de' : 'en';

      this.translocoService.setActiveLang(targetLang);
    }
  }

  // Form für Step 1
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  // Control für Step 2
  codeControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]);

  // Hilfsmethode, um Redundanz zu vermeiden
  private finalizeLogin(res: AuthResponse) {
    if (res.token) {
      // 1. Session Token speichern (sessionStorage)
      sessionStorage.setItem('token', res.token);

      // 2. Prüfen auf Passwort-Zwang
      if (res.user?.mustChangePassword) {
        this.router.navigate(['/change-password']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

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
          this.errorMessage.set('Falscher Code');
        },
      });
    }
  }

  cancel2FA() {
    this.requires2FA.set(false);
    this.codeControl.reset();
    this.errorMessage.set('');
  }

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

  switchLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('app-lang', lang);
  }
}
