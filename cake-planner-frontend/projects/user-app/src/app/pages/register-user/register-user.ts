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
  ],
  templateUrl: './register-user.html',
  styleUrl: './register-user.scss',
})
export class RegisterUserComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);

  passwordMatchValidator(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  regForm = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  onSubmit() {
    if (this.regForm.valid) {
      this.isLoading.set(true);
      const { name, email, password } = this.regForm.value;

      this.auth.registerUser({ name: name!, email: email!, password: password! }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open(
            'Registrierung erfolgreich! Bitte warten Sie auf die Freischaltung durch einen Admin.',
            'OK',
            { duration: 8000 }
          );
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading.set(false);
          // Backend sendet 409 bei Konflikt
          const msg =
            err.status === 409 ? 'Email existiert bereits' : 'Registrierung fehlgeschlagen';
          this.snackBar.open(msg, 'Schließen', { duration: 5000, panelClass: ['error-snackbar'] });
        },
      });
    }
  }
}
