/**
 * @file change-password.ts
 * @brief Component for the change password page.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, inject, signal, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
// Dialog Module instead of Card Module
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';

import { AuthService } from 'shared-lib';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule, // NEW: For dialog layouts
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    TranslocoModule,
  ],
  providers: [provideTranslocoScope({ scope: 'change_password', alias: 'change-password' })],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css'],
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private transloco = inject(TranslocoService);

  // Optional: If we are opened as a dialog, this is set.
  // If we come via route (Forced PW Change), it is null.
  private dialogRef = inject(MatDialogRef, { optional: true });

  isLoading = signal(false);
  isForced = this.authService.currentUser()?.mustChangePassword;

  /**
   * @brief Custom validator to check if the password and confirm password fields match.
   * @param g The form group to validate.
   * @returns An object with a 'mismatch' property if the passwords don't match, otherwise null.
   */
  passwordMatchValidator(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  pwForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator },
  );

  /**
   * @brief Handles the form submission for changing the password.
   */
  onSubmit() {
    if (this.pwForm.valid) {
      this.isLoading.set(true);
      const newPass = this.pwForm.value.password!;

      this.authService.changePassword(newPass).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open(
            this.transloco.translate('change-password.CHANGE_PW.CHANGE_PW_SUCCESS'),
            'OK',
            {
              duration: 2000,
              panelClass: ['success-snackbar'],
            },
          );

          if (this.dialogRef) {
            // As a dialog: close
            this.dialogRef.close(true);
          } else {
            // As a route: redirect
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err);
          this.snackBar.open(
            this.transloco.translate('change-password.CHANGE_PW.CHANGE_PW_FAILED'),
            'OK',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            },
          );
        },
      });
    }
  }

  /**
   * @brief Handles the cancellation of the password change.
   */
  onCancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      // If as a route, but canceled (should not be possible with Forced, but for safety)
      this.router.navigate(['/dashboard']);
    }
  }
}