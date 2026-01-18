import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // RouterLink für "Zurück zum Login"
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { AuthService } from 'shared-lib';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    TranslocoModule,
  ],
  templateUrl: './register-user.html',
  styleUrl: './register-user.scss',
})
export class RegisterUserComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private translocoService = inject(TranslocoService);

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  currentYear = new Date().getFullYear();
  copyrightYear = this.currentYear > 2026 ? `2026–${this.currentYear}` : '2026';

  constructor() {
    this.initializeLanguage();
  }

  // --- Logik zur Spracherkennung ---
  private initializeLanguage() {
    const savedLang = localStorage.getItem('app-lang');
    if (savedLang) {
      this.translocoService.setActiveLang(savedLang);
    } else {
      const browserLang = navigator.language;
      const targetLang = browserLang.startsWith('de') ? 'de' : 'en';
      localStorage.setItem('app-lang', targetLang);
      this.translocoService.setActiveLang(targetLang);
    }
  }

  switchLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('app-lang', lang);
  }

  passwordMatchValidator(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  regForm = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      privacyPolicy: [false, Validators.requiredTrue],
    },
    { validators: this.passwordMatchValidator },
  );

  onSubmit() {
    if (this.regForm.valid) {
      this.isLoading.set(true);
      const { name, email, password } = this.regForm.value;
      const lang = localStorage.getItem('app-lang');

      this.auth
        .registerUser({ name: name!, email: email!, password: password!, language: lang! })
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.successMessage.set(this.translocoService.translate('REGISTER.SUCCESS_MSG'));
            this.snackBar.open(this.translocoService.translate('REGISTER.SUCCESS_MSG'), 'OK', {
              duration: 8000,
              panelClass: ['success-snackbar'],
            });
            //this.router.navigate(['/login']);
          },
          error: (err) => {
            this.isLoading.set(false);
            // Backend sendet 409 bei Konflikt
            const msg =
              err.status === 409
                ? this.translocoService.translate('REGISTER.ERROR_ACCOUNT_ALREADY_EXISTS')
                : this.translocoService.translate('REGISTER.ERROR_MSG');
            this.errorMessage.set(msg);
            this.snackBar.open(msg, this.translocoService.translate('REGISTER.CLOSE'), {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          },
        });
    }
  }
}
