import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco'; // <---

import { AuthService, TwoFactorSetupComponent } from 'shared-lib';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    TranslocoModule, // <---
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private translocoService = inject(TranslocoService); // <---

  logout() {
    this.authService.logout();
  }

  open2FASetup() {
    this.dialog.open(TwoFactorSetupComponent, {
      width: '400px',
      disableClose: true,
    });
  }

  // <--- NEU: Sprachumschaltung
  switchLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }
}
