import { Component, Inject, signal, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // NEU
import { MatDividerModule } from '@angular/material/divider'; // NEU
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
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
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.scss'],
})
export class EventDetailComponent {
  private eventService = inject(EventService);
  private dialogRef = inject(MatDialogRef<EventDetailComponent>);
  private snackBar = inject(MatSnackBar);
  private transloco = inject(TranslocoService);

  event = signal<CakeEvent | null>(null);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { eventId: string }) {
    this.loadEvent();
  }

  loadEvent() {
    this.eventService.getById(this.data.eventId).subscribe({
      next: (e) => this.event.set(e),
      error: () => this.dialogRef.close(), // Wenn nicht gefunden, schließen
    });
  }

  downloadIcs() {
    if (!this.event()) return;
    this.eventService.downloadIcs(this.event()!.id);
  }

  triggerUpload(input: HTMLInputElement) {
    input.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.event()) {
      this.eventService.uploadPhoto(this.event()!.id, file).subscribe(() => {
        this.snackBar.open(this.transloco.translate('MSG.UPLOAD_SUCCESS'), 'OK', {
          duration: 3000,
        });
        this.loadEvent();
      });
    }
  }

  rate(stars: number) {
    if (!this.event()) return;
    this.eventService.rateEvent(this.event()!.id, stars).subscribe(() => {
      this.loadEvent();
    });
  }

  deleteEvent() {
    if (!this.event()) return;
    this.eventService.deleteEvent(this.event()!.id).subscribe(() => {
      this.snackBar.open(this.transloco.translate('MSG.DELETE_SUCCESS'), 'OK', { duration: 3000 });
      this.dialogRef.close('deleted');
    });
  }
}
