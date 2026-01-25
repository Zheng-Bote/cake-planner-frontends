/**
 * @file event-detail.ts
 * @brief Component for displaying the details of a cake event.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, Inject, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';
import { EventService, CakeEvent } from 'shared-lib';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    TranslocoModule,
    DatePipe,
    DecimalPipe,
  ],
  providers: [provideTranslocoScope({ scope: 'event', alias: 'event' })],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.scss'],
})
export class EventDetailComponent {
  private eventService = inject(EventService);
  private dialogRef = inject(MatDialogRef<EventDetailComponent>);
  private snackBar = inject(MatSnackBar);
  private transloco = inject(TranslocoService);

  event = signal<CakeEvent | null>(null);
  lang = toSignal(this.transloco.langChanges$, { initialValue: this.transloco.getActiveLang() });

  // Signal für das Overlay (Lightbox)
  overlayUrl = signal<string | null>(null);

  /**
   * @brief Constructs the component and loads the event data.
   * @param data The data injected into the dialog, containing the eventId.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { eventId: string }) {
    this.loadEvent();
  }

  /**
   * @brief Loads the event data from the server.
   */
  loadEvent() {
    this.eventService.getById(this.data.eventId).subscribe({
      next: (e) => this.event.set(e),
      error: () => this.dialogRef.close(),
    });
  }

  /**
   * @brief Opens the image overlay (lightbox).
   * @param url The URL of the image to display.
   */
  openOverlay(url: string) {
    this.overlayUrl.set(url);
  }

  /**
   * @brief Closes the image overlay.
   */
  closeOverlay() {
    this.overlayUrl.set(null);
  }

  /**
   * @brief Downloads the ICS file for the event.
   */
  downloadIcs() {
    if (!this.event()) return;
    this.eventService.downloadIcs(this.event()!.id);
  }

  /**
   * @brief Triggers the file input for uploading a photo.
   * @param input The HTML input element.
   */
  triggerUpload(input: HTMLInputElement) {
    input.click();
  }

  /**
   * @brief Handles the file selection for photo upload.
   * @param event The file selection event.
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.event()) {
      this.eventService.uploadPhoto(this.event()!.id, file).subscribe({
        next: () => {
          this.snackBar.open(this.transloco.translate('MSG.UPLOAD_SUCCESS'), 'OK', {
            duration: 3000,
          });
          this.loadEvent(); // Neu laden um neues Bild in Galerie zu sehen
        },
        error: () => {
          this.snackBar.open(this.transloco.translate('MSG.UPLOAD_FAILED'), 'OK', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }

  /**
   * @brief Rates the event.
   * @param stars The number of stars for the rating.
   */
  rate(stars: number) {
    if (!this.event()) return;
    this.eventService.rateEvent(this.event()!.id, stars).subscribe(() => {
      this.loadEvent();
    });
  }

  /**
   * @brief Deletes the event.
   */
  deleteEvent() {
    if (!this.event()) return;
    this.eventService.deleteEvent(this.event()!.id).subscribe(() => {
      this.snackBar.open(this.transloco.translate('MSG.DELETE_SUCCESS'), 'OK', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
      this.dialogRef.close('deleted');
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
}