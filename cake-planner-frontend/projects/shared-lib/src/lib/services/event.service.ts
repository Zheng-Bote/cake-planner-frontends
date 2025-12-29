import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CakeEvent } from '../models/event.model'; // Pfad ggf. anpassen

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);

  getEvents(start: string, end: string) {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<CakeEvent[]>('/api/events', { params });
  }

  // WICHTIG: Parameter für Datei (file) hinzufügen
  createEvent(event: Partial<CakeEvent>, file?: File) {
    const formData = new FormData();

    // 1. Pflichtfeld Date
    if (event.date) {
      formData.append('date', event.date);
    }

    // 2. Optionales Feld Description
    if (event.description) {
      formData.append('description', event.description);
    }

    // 3. Optionales Bild
    // Der Name 'photo' muss exakt mit dem Backend übereinstimmen (if (name == "photo") ...)
    if (file) {
      formData.append('photo', file);
    }

    // WICHTIG:
    // Wir senden 'formData' direkt.
    // Angular erkennt das und setzt AUTOMATISCH den Header:
    // Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
    // Wenn wir den Header manuell setzen würden, fehlt die Boundary -> 400 Fehler!
    return this.http.post<any>('/api/events', formData);
  }
}
