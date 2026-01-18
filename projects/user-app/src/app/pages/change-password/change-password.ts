import { Component, inject, signal, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
// Dialog Module statt Card Module
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoModule } from '@jsverse/transloco';

import { AuthService } from 'shared-lib';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule, // NEU: Für Dialog-Layouts
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
  private snackBar = inject(MatSnackBar);

  // Optional: Wenn wir als Dialog geöffnet werden, ist das hier gesetzt.
  // Wenn wir via Route kommen (Forced PW Change), ist es null.
  private dialogRef = inject(MatDialogRef, { optional: true });

  isLoading = signal(false);
  isForced = this.authService.currentUser()?.mustChangePassword;

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

      this.authService.changePassword(newPass).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open('Passwort erfolgreich geändert', 'OK', { duration: 3000 });

          if (this.dialogRef) {
            // Als Dialog: schließen
            this.dialogRef.close(true);
          } else {
            // Als Route: weiterleiten
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err);
          this.snackBar.open('Fehler beim Ändern des Passworts', 'OK', { duration: 5000 });
        },
      });
    }
  }

  onCancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      // Falls als Route, aber abgebrochen wird (sollte bei Forced nicht gehen, aber zur Sicherheit)
      this.router.navigate(['/dashboard']);
    }
  }
}
