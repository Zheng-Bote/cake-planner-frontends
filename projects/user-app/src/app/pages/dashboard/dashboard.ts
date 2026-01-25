/**
 * @file dashboard.ts
 * @brief Component for the user dashboard.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // For RouterLink
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { format, addDays, startOfDay } from 'date-fns';

import { AuthService, TwoFactorSetupComponent, EventService, CakeEvent } from 'shared-lib';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    TranslocoModule,
  ],
  providers: [provideTranslocoScope({ scope: 'dashboard', alias: 'dashboard' })],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private eventService = inject(EventService);

  // User Signal (reactive)
  user = this.authService.currentUser;

  // Next Cake
  nextEvent = signal<CakeEvent | null>(null);
  isLoadingEvents = signal(true);

  // Greeting based on time of day
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
   * @brief Initializes the component and loads the next cake event.
   */
  ngOnInit() {
    this.loadNextCake();
  }

  /**
   * @brief Loads the next upcoming cake event within the next two weeks.
   */
  loadNextCake() {
    const today = startOfDay(new Date());
    const twoWeeksLater = addDays(today, 14);

    // We load events for 2 weeks
    this.eventService
      .getEvents(format(today, 'yyyy-MM-dd'), format(twoWeeksLater, 'yyyy-MM-dd'))
      .subscribe({
        next: (events) => {
          // Sort by date (backend should already do this, but just to be sure)
          const sorted = events.sort((a, b) => a.date.localeCompare(b.date));

          // Take the first hit (which is today or in the future)
          if (sorted.length > 0) {
            this.nextEvent.set(sorted[0]);
          }
          this.isLoadingEvents.set(false);
        },
        error: () => this.isLoadingEvents.set(false),
      });
  }

  /**
   * @brief Opens the dialog to set up two-factor authentication.
   */
  open2FASetup() {
    this.dialog.open(TwoFactorSetupComponent, {
      width: '400px',
      disableClose: true,
    });
  }
}