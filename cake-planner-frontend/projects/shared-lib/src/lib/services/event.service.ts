import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CakeEvent } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/events';

  // 1. Liste laden (für Kalender)
  getEvents(start: string, end: string): Observable<CakeEvent[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<CakeEvent[]>(this.baseUrl, { params });
  }

  // 1b. Event erstellen (Multipart)
  createEvent(eventData: Partial<CakeEvent>, file?: File): Observable<any> {
    const formData = new FormData();

    // WICHTIG: Das gesamte Objekt als JSON-String in das Feld 'event' packen
    formData.append('event', JSON.stringify(eventData));

    // Datei separat anhängen (falls vorhanden)
    if (file) {
      // Backend erwartet 'image' als Feldnamen (siehe C++ Controller)
      formData.append('image', file, file.name);
    }

    return this.http.post<any>(this.baseUrl, formData);
  }

  // 1c. Hall of Fame (Ranked Events)
  getRankedEvents(): Observable<CakeEvent[]> {
    return this.http.get<CakeEvent[]>(`${this.baseUrl}/ranked`);
  }

  // 2a. Einzelnes Event laden (Detailansicht)
  getById(id: string): Observable<CakeEvent> {
    return this.http.get<CakeEvent>(`${this.baseUrl}/${id}`);
  }

  // ICS Download
  downloadIcs(id: string) {
    this.http.get(`${this.baseUrl}/${id}/ics`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-${id}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('ICS Download failed', err),
    });
  }

  // 2c. Foto nachträglich hochladen
  uploadPhoto(id: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<void>(`${this.baseUrl}/${id}/photo`, formData);
  }

  // 2d. Bewerten
  rateEvent(id: string, stars: number, comment: string = ''): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/rate`, { stars, comment });
  }

  // 3. Löschen
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
