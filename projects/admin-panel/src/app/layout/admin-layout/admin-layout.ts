/**
 * @file admin-layout.ts
 * @brief Component for the admin layout.
 * @version 1.0.1
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, inject, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AuthService } from 'shared-lib';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    TranslocoModule,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  private translocoService = inject(TranslocoService);
  private breakpointObserver = inject(BreakpointObserver);

  @ViewChild('drawer') drawer!: MatSidenav;

  isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false }
  );

  logout() {
    this.authService.logout();
  }

  switchLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  closeSideNavIfMobile() {
    if (this.isHandset()) {
      this.drawer.close();
    }
  }

  greetingKey = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'MORNING';
    if (hour < 18) return 'AFTERNOON';
    return 'EVENING';
  });
}