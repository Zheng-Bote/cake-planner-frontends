import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TwoFactorSetupResponse } from '../../models/2fa.model';

@Component({
  selector: 'lib-two-factor-setup',
  standalone: true,
  imports: [
    CommonModule,
    QRCodeComponent, // <--- WICHTIG für <qrcode> Tag
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './two-factor-setup.html',
  styleUrl: './two-factor-setup.css',
})
export class TwoFactorSetupComponent {
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<TwoFactorSetupComponent>);

  isLoading = signal(true);
  isActivating = signal(false);
  setupData = signal<TwoFactorSetupResponse | null>(null);
  errorMessage = signal('');

  codeControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]);

  constructor() {
    // Beim Öffnen sofort Daten vom Backend holen
    this.authService.setup2FA().subscribe({
      next: (data) => {
        this.setupData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Fehler beim Laden der 2FA-Daten');
        this.isLoading.set(false);
      },
    });
  }

  activate() {
    if (this.codeControl.valid && this.setupData()) {
      this.isActivating.set(true);
      this.errorMessage.set('');

      const secret = this.setupData()!.secret;
      const code = this.codeControl.value!;

      this.authService.activate2FA(secret, code).subscribe({
        next: () => {
          this.isActivating.set(false);
          this.dialogRef.close(true); // Erfolg zurückmelden
        },
        error: (err) => {
          this.isActivating.set(false);
          this.errorMessage.set('Code ungültig. Bitte erneut versuchen.');
        },
      });
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
