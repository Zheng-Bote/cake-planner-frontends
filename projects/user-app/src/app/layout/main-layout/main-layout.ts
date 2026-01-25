/**
 * @file main-layout.ts
 * @brief Component for the main layout of the user application.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, inject, ViewChild, computed, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Important for router-outlet
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

//import { userAppVersion } from '../../../../package.json';

import { AuthService } from 'shared-lib';
import { ThemeService } from 'shared-lib';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    TranslocoModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private translocoService = inject(TranslocoService);
  private breakpointObserver = inject(BreakpointObserver);

  currentYear = new Date().getFullYear();
  copyrightYear = this.currentYear > 2026 ? `2026–${this.currentYear}` : '2026';
  //version = userAppVersion;

  @ViewChild('drawer') drawer!: MatSidenav;

  // Modern signal for responsiveness
  isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  // PWA Install Prompt
  showInstallButton = signal(false);
  // save Browser-Event
  private deferredPrompt: any;

  /**
   * @brief Event listener for the 'beforeinstallprompt' event to enable PWA installation.
   * @param e The event object.
   */
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e: any) {
    // 1. Prevent the browser's default behavior (the automatic banner at the bottom)
    e.preventDefault();

    // 2. Save the event to trigger it manually later
    this.deferredPrompt = e;

    // 3. Show the button in the header
    this.showInstallButton.set(true);
  }
  /**
   * @brief Initiates the PWA installation prompt.
   */
  installPwa() {
    this.showInstallButton.set(false);

    if (this.deferredPrompt) {
      // Show prompt
      this.deferredPrompt.prompt();

      // Wait for user reaction (optional logging)
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install');
        }
        this.deferredPrompt = null;
      });
    }
  }

  /**
   * @brief Computed signal for the greeting key based on the time of day.
   */
  greetingKey = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'DASHBOARD.MORNING';
    if (hour < 18) return 'DASHBOARD.AFTERNOON';
    return 'DASHBOARD.EVENING';
  });

  /**
   * @brief Logs out the current user.
   */
  logout() {
    this.authService.logout();
  }

  /**
   * @brief Switches the application language.
   * @param lang The language to switch to.
   */
  switchLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  /**
   * @brief Closes the sidenav if the view is on a mobile device.
   */
  closeSideNavIfMobile() {
    if (this.isHandset()) {
      this.drawer.close();
    }
  }
}