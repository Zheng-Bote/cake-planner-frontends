import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'; // <--- WICHTIG
import { TranslocoModule } from '@jsverse/transloco';
import { EventService, CakeEvent } from 'shared-lib';

@Component({
  selector: 'app-hall-of-fame',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule, // <--- HIER EINFÜGEN
    TranslocoModule,
    DatePipe,
    DecimalPipe,
    SlicePipe,
  ],
  templateUrl: './hall-of-fame.html',
  styleUrls: ['./hall-of-fame.scss'],
})
export class HallOfFameComponent implements OnInit {
  private eventService = inject(EventService);

  // Signale für Daten und Overlay-Status
  events = signal<CakeEvent[]>([]);
  overlayUrl = signal<string | null>(null);

  ngOnInit() {
    this.loadRankedEvents();
  }

  loadRankedEvents() {
    this.eventService.getRankedEvents().subscribe({
      next: (data) => this.events.set(data),
      error: (err) => console.error('Failed to load hall of fame', err),
    });
  }

  // --- Helper für WebP ---
  getWebPUrl(originalUrl: string | undefined, width: number): string {
    if (!originalUrl) return '';

    const lastDot = originalUrl.lastIndexOf('.');
    if (lastDot === -1) return originalUrl; // Fallback

    const baseUrl = originalUrl.substring(0, lastDot);
    return `${baseUrl}__${width}.webp`;
  }

  // --- Overlay Logic ---
  openOverlay(eventOrUrl: CakeEvent | string) {
    if (typeof eventOrUrl === 'string') {
      this.overlayUrl.set(eventOrUrl);
    } else if (eventOrUrl.photoUrl) {
      this.overlayUrl.set(eventOrUrl.photoUrl);
    }
  }

  closeOverlay() {
    this.overlayUrl.set(null);
  }
}
