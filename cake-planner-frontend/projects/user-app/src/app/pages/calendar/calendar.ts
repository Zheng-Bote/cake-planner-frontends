import { Component, inject, signal, computed, effect, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from 'date-fns';

import { SseService, EventService, CakeEvent } from 'shared-lib';
import { EventDialogComponent } from '../../components/event-dialog/event-dialog';
import { EventDetailComponent } from '../../components/event-detail/event-detail';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    TranslocoModule,
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class CalendarComponent {
  private eventService = inject(EventService);
  private dialog = inject(MatDialog);
  private sseService = inject(SseService);
  private snackBar = inject(MatSnackBar);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  viewDate = signal(new Date());
  events = signal<CakeEvent[]>([]);
  weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  days = computed(() => {
    const start = startOfWeek(startOfMonth(this.viewDate()), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(this.viewDate()), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  });

  constructor() {
    effect(() => {
      this.loadEvents();
    });

    this.sseService
      .getServerSentEvents('/api/events/stream')
      .pipe(takeUntilDestroyed())
      .subscribe((msg) => {
        const text = this.transloco.translate('CALENDAR.NEW_MSG', {
          baker: msg.bakerName,
          date: msg.date,
        });
        this.snackBar.open(text, 'Yummy!', { duration: 5000 });
        this.loadEvents();
      });
  }

  loadEvents() {
    const start = format(
      startOfWeek(startOfMonth(this.viewDate()), { weekStartsOn: 1 }),
      'yyyy-MM-dd'
    );
    const end = format(endOfWeek(endOfMonth(this.viewDate()), { weekStartsOn: 1 }), 'yyyy-MM-dd');

    this.eventService
      .getEvents(start, end)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.events.set(data));
  }

  isSameMonth(d1: Date, d2: Date) {
    return isSameMonth(d1, d2);
  }
  isToday(d: Date) {
    return isSameDay(d, new Date());
  }

  getEventsForDay(date: Date): CakeEvent[] {
    const dateStr = format(date, 'yyyy-MM-dd');
    return this.events().filter((e) => e.date === dateStr);
  }

  nextMonth() {
    this.viewDate.update((d) => addMonths(d, 1));
  }
  prevMonth() {
    this.viewDate.update((d) => subMonths(d, 1));
  }

  // ACTION: Erstellen
  openAddDialog(day: Date) {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: { date: day },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.createEvent(result.event, result.file).subscribe({
          next: () => {
            this.snackBar.open(this.transloco.translate('MSG.SAVE_SUCCESS'), 'OK', {
              duration: 2000,
            });
            this.loadEvents();
          },
          error: (err) => console.error(err),
        });
      }
    });
  }

  // ACTION: Details/Editieren
  openEventDetails(event: CakeEvent, e: Event) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(EventDetailComponent, {
      data: { eventId: event.id },
      width: '500px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'deleted') this.loadEvents();
    });
  }
}
