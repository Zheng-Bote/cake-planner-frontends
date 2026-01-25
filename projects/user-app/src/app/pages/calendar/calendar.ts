/**
 * @file calendar.ts
 * @brief Component for displaying the event calendar.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, inject, signal, computed, effect, DestroyRef } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'; // Added toSignal
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService, TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'; // Added
import { map } from 'rxjs/operators'; // Added
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
  providers: [provideTranslocoScope({ scope: 'calendar', alias: 'calendar' })],
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

  lang = toSignal(this.transloco.langChanges$, { initialValue: this.transloco.getActiveLang() });

  viewDate = signal(new Date());
  events = signal<CakeEvent[]>([]);
  weekDays: Date[] = (() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  })();

  // Signal for mobile detection
  isMobile = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  days = computed(() => {
    // On mobile, we only show the month itself to save scrolling,
    // on desktop, we show the full grid (including previous/next month days)
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

  /**
   * @brief Constructs the component, sets up an effect to load events, and subscribes to SSE messages.
   */
  constructor() {
    effect(() => {
      this.loadEvents();
    });

    this.sseService
      .getServerSentEvents('/api/events/stream')
      .pipe(takeUntilDestroyed())
      .subscribe((msg) => {
        const text = this.transloco.translate('calendar.CALENDAR.NEW_MSG', {
          baker: msg.bakerName,
          date: msg.date,
        });
        this.snackBar.open(text, 'Yummy!', { duration: 5000 });
        this.loadEvents();
      });
  }

  /**
   * @brief Loads events for the current view date range.
   */
  loadEvents() {
    // Range calculation depends on the view (mobile loads a bit less, but the logic is the same)
    const start = format(
      startOfWeek(startOfMonth(this.viewDate()), { weekStartsOn: 1 }),
      'yyyy-MM-dd',
    );
    const end = format(endOfWeek(endOfMonth(this.viewDate()), { weekStartsOn: 1 }), 'yyyy-MM-dd');

    this.eventService
      .getEvents(start, end)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.events.set(data));
  }

  /**
   * @brief Checks if two dates are in the same month.
   * @param d1 The first date.
   * @param d2 The second date.
   * @returns True if the dates are in the same month, false otherwise.
   */
  isSameMonth(d1: Date, d2: Date) {
    return isSameMonth(d1, d2);
  }
  /**
   * @brief Checks if a date is today.
   * @param d The date to check.
   * @returns True if the date is today, false otherwise.
   */
  isToday(d: Date) {
    return isSameDay(d, new Date());
  }

  /**
   * @brief Gets the events for a specific day.
   * @param date The date to get events for.
   * @returns An array of CakeEvent objects for the specified day.
   */
  getEventsForDay(date: Date): CakeEvent[] {
    const dateStr = format(date, 'yyyy-MM-dd');
    return this.events().filter((e) => e.date === dateStr);
  }

  /**
   * @brief Navigates to the next month in the calendar.
   */
  nextMonth() {
    this.viewDate.update((d) => addMonths(d, 1));
  }
  /**
   * @brief Navigates to the previous month in the calendar.
   */
  prevMonth() {
    this.viewDate.update((d) => subMonths(d, 1));
  }

  /**
   * @brief Opens the dialog to add a new event.
   * @param day The day to pre-select in the dialog.
   */
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
              panelClass: ['success-snackbar'],
            });
            this.loadEvents();
          },
          error: (err) => console.error(err),
        });
      }
    });
  }

  /**
   * @brief Opens the dialog to view the details of an event.
   * @param event The event to view.
   * @param e The click event.
   */
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