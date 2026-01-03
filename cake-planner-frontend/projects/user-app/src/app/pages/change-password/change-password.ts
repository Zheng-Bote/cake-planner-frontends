import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoModule } from '@jsverse/transloco'; // <--- WICHTIG: Importieren

import { AuthService, AuthResponse } from 'shared-lib';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TranslocoModule,
  ],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css'],
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  isForced = this.authService.currentUser()?.mustChangePassword;

  // Validator für Passwort-Vergleich
  passwordMatchValidator(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  pwForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  onSubmit() {
    if (this.pwForm.valid) {
      this.isLoading.set(true);
      const newPass = this.pwForm.value.password!;

      // ACHTUNG: Diese Methode müssen wir im AuthService noch anlegen!
      this.authService.changePassword(newPass).subscribe({
        next: () => {
          this.isLoading.set(false);
          // Wichtig: Nach Erfolg zum Dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err);
          // Hier Fehlerbehandlung (SnackBar etc.)
        },
      });
    }
  }
}
