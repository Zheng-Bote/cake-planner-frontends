import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EventService, CakeEvent } from 'shared-lib';
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
// Locale entfernen oder nutzen, falls gewünscht

import { EventDialogComponent } from '../../components/event-dialog/event-dialog'; // Pfad prüfen!

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
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class CalendarComponent {
  private eventService = inject(EventService);
  private dialog = inject(MatDialog);

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
  }

  loadEvents() {
    const start = format(
      startOfWeek(startOfMonth(this.viewDate()), { weekStartsOn: 1 }),
      'yyyy-MM-dd'
    );
    const end = format(endOfWeek(endOfMonth(this.viewDate()), { weekStartsOn: 1 }), 'yyyy-MM-dd');

    this.eventService.getEvents(start, end).subscribe((data) => {
      this.events.set(data);
    });
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
        // KORREKTUR: Wir entpacken result.event und result.file
        // result sieht jetzt so aus: { event: { date: '...', description: '...' }, file: File | null }

        this.eventService.createEvent(result.event, result.file).subscribe({
          next: () => {
            console.log('Event erstellt!');
            this.loadEvents();
          },
          error: (err) => {
            console.error('Fehler beim Erstellen', err);
            // Hier könntest du noch eine Snackbar/Alert anzeigen
          },
        });
      }
    });
  }
}
