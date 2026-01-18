import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Für RouterLink
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { TranslocoModule } from '@jsverse/transloco';
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
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private eventService = inject(EventService);

  // User Signal (reaktiv)
  user = this.authService.currentUser;

  // Nächster Kuchen
  nextEvent = signal<CakeEvent | null>(null);
  isLoadingEvents = signal(true);

  // Begrüßung basierend auf Uhrzeit
  greetingKey = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'DASHBOARD.MORNING';
    if (hour < 18) return 'DASHBOARD.AFTERNOON';
    return 'DASHBOARD.EVENING';
  });

  ngOnInit() {
    this.loadNextCake();
  }

  loadNextCake() {
    const today = startOfDay(new Date());
    const twoWeeksLater = addDays(today, 14);

    // Wir laden Events für 2 Wochen
    this.eventService
      .getEvents(format(today, 'yyyy-MM-dd'), format(twoWeeksLater, 'yyyy-MM-dd'))
      .subscribe({
        next: (events) => {
          // Sortieren nach Datum (sollte das Backend schon tun, aber sicher ist sicher)
          const sorted = events.sort((a, b) => a.date.localeCompare(b.date));

          // Den ersten Treffer nehmen (der heute oder in Zukunft ist)
          if (sorted.length > 0) {
            this.nextEvent.set(sorted[0]);
          }
          this.isLoadingEvents.set(false);
        },
        error: () => this.isLoadingEvents.set(false),
      });
  }

  open2FASetup() {
    this.dialog.open(TwoFactorSetupComponent, {
      width: '400px',
      disableClose: true,
    });
  }
}
