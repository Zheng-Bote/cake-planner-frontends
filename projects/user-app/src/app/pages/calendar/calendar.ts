import { Component, inject, signal, computed, effect, DestroyRef } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'; // toSignal dazu
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'; // Dazu
import { map } from 'rxjs/operators'; // Dazu
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
  private breakpointObserver = inject(BreakpointObserver); // Inject

  viewDate = signal(new Date());
  events = signal<CakeEvent[]>([]);
  weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  // Signal für Mobile-Erkennung
  isMobile = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false }
  );

  days = computed(() => {
    // Auf Mobile zeigen wir nur den Monat selbst an, um Scrollen zu sparen,
    // auf Desktop zeigen wir das volle Grid (inkl. Vor/Nach-Monatstage)
    if (this.isMobile()) {
      const start = startOfMonth(this.viewDate());
      const end = endOfMonth(this.viewDate());
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfWeek(startOfMonth(this.viewDate()), { weekStartsOn: 1 });
      const end = endOfWeek(endOfMonth(this.viewDate()), { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }
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
    // Range Berechnung abhängig von View (Mobile lädt etwas weniger, aber Logik bleibt gleich)
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
