/**
 * @file hall-of-fame.ts
 * @brief Component for displaying the Hall of Fame of cake events.
 * @version 1.1.0
 * @date 2026-02-08
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'; // toSignal dazu
import { CommonModule, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'; // <--- WICHTIG
import { TranslocoModule, provideTranslocoScope, TranslocoService } from '@jsverse/transloco';
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
  providers: [provideTranslocoScope({ scope: 'hall_of_fame', alias: 'hall-of-fame' })],
  templateUrl: './hall-of-fame.html',
  styleUrls: ['./hall-of-fame.scss'],
})
export class HallOfFameComponent implements OnInit {
  private eventService = inject(EventService);

  // Signale für Daten und Overlay-Status
  events = signal<CakeEvent[]>([]);
  overlayUrl = signal<string | null>(null);
  overlayUserName = signal<string | null>(null);

  private transloco = inject(TranslocoService);
  lang = toSignal(this.transloco.langChanges$, { initialValue: this.transloco.getActiveLang() });

  /**
   * @brief Initializes the component and loads the ranked events.
   */
  ngOnInit() {
    this.loadRankedEvents();
  }

  /**
   * @brief Loads the ranked events from the server.
   */
  loadRankedEvents() {
    this.eventService.getRankedEvents().subscribe({
      next: (data) => this.events.set(data),
      error: (err) => console.error('Failed to load hall of fame', err),
    });
  }

  /**
   * @brief Generates a WebP URL for an image with a specified width.
   * @param originalUrl The original URL of the image.
   * @param width The desired width of the WebP image.
   * @returns The URL of the WebP image.
   */
  getWebPUrl(originalUrl: string | undefined, width: number): string {
    if (!originalUrl) return '';

    const lastDot = originalUrl.lastIndexOf('.');
    if (lastDot === -1) return originalUrl; // Fallback

    const baseUrl = originalUrl.substring(0, lastDot);
    return `${baseUrl}__${width}.webp`;
  }

  /**
   * @brief Opens the image overlay (lightbox).
   * @param eventOrUrl The event object or the URL of the image to display.
   * @param userName The name of the user who uploaded the image.
   */
  openOverlay(eventOrUrl: CakeEvent | string, userName?: string | '') {
    if (typeof eventOrUrl === 'string') {
      this.overlayUrl.set(eventOrUrl);
    } else if (eventOrUrl.photoUrl) {
      this.overlayUrl.set(eventOrUrl.photoUrl);
    }
    this.overlayUserName.set(userName || null);
  }

  /**
   * @brief Closes the image overlay.
   */
  closeOverlay() {
    this.overlayUrl.set(null);
  }

  /**
   * @brief Calculates the top bakers based on the number of events.
   * @returns An array of the top 3 bakers.
   */
  bakerStats = computed(() => {
    const statsMap = new Map<string, { name: string; count: number; avgRating: number }>();

    this.events().forEach((evt) => {
      const current = statsMap.get(evt.bakerName) || {
        name: evt.bakerName,
        count: 0,
        avgRating: 0,
      };
      current.count++;
      // Weighted average or just count for the leaderboard
      statsMap.set(evt.bakerName, current);
    });

    return Array.from(statsMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Top 3
  });
}
