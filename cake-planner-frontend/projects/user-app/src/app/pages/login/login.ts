import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms'; // <--- FormControl war wichtig
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';

import { AuthService, AuthResponse } from 'shared-lib';
import { RegisterUserComponent } from '../register-user/register-user';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html', // Wir nutzen jetzt die externe Datei
  styleUrls: ['./login.css'], // Optional, falls du styles hast
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // State
  requires2FA = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

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
      // 1. Session Token speichern (jetzt mit sessionStorage wie besprochen)
      sessionStorage.setItem('token', res.token);

      // 2. Prüfen auf Passwort-Zwang
      if (res.user?.mustChangePassword) {
        this.router.navigate(['/change-password']); // <--- Neue Route
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
    if (err.status === 401) this.errorMessage.set('Falsche Zugangsdaten');
    else if (err.status === 403) this.errorMessage.set('Account inaktiv');
    else this.errorMessage.set('Server Fehler');
  }
}
