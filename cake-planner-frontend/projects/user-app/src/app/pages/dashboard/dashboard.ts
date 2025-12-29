import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Wichtig für router-outlet
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../../../../shared-lib/src/lib/services/auth.service';
import { TwoFactorSetupComponent } from '../../../../../shared-lib/src/lib/components/two-factor-setup/two-factor-setup';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Ermöglicht Kind-Routen
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  authService = inject(AuthService);
  private dialog = inject(MatDialog);

  logout() {
    this.authService.logout();
  }

  open2FASetup() {
    this.dialog.open(TwoFactorSetupComponent, {
      width: '400px',
      disableClose: true,
    });
  }
}
