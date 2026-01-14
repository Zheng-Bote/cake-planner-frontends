import { Component, inject, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Wichtig für router-outlet
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { AuthService } from 'shared-lib';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // <--- Ermöglicht das Laden der Child-Routes
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslocoModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  private translocoService = inject(TranslocoService);
  private breakpointObserver = inject(BreakpointObserver);

  @ViewChild('drawer') drawer!: MatSidenav;

  // Modernes Signal für Responsivität
  isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false }
  );

  greetingKey = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'DASHBOARD.MORNING';
    if (hour < 18) return 'DASHBOARD.AFTERNOON';
    return 'DASHBOARD.EVENING';
  });

  logout() {
    this.authService.logout();
  }

  switchLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  // Schließt Menü auf Mobile nach Klick
  closeSideNavIfMobile() {
    if (this.isHandset()) {
      this.drawer.close();
    }
  }
}
