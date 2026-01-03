import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; // Falls für Widgets nötig
import { TranslocoModule } from '@jsverse/transloco';
import { TwoFactorSetupComponent } from 'shared-lib';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, TranslocoModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  private dialog = inject(MatDialog);

  open2FASetup() {
    this.dialog.open(TwoFactorSetupComponent, {
      width: '400px',
      disableClose: true,
    });
  }
}
