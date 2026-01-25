/**
 * @file event.service.ts
 * @brief Service for handling cake events.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CakeEvent } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/events';

  /**
   * @brief Retrieves a list of events within a specified date range.
   * @param start The start date in YYYY-MM-DD format.
   * @param end The end date in YYYY-MM-DD format.
   * @returns An Observable emitting an array of CakeEvent objects.
   */
  getEvents(start: string, end: string): Observable<CakeEvent[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<CakeEvent[]>(this.baseUrl, { params });
  }

  /**
   * @brief Creates a new event.
   * @param eventData The data for the new event.
   * @param file An optional image file for the event.
   * @returns An Observable that completes when the operation is finished.
   */
  createEvent(eventData: Partial<CakeEvent>, file?: File): Observable<any> {
    const formData = new FormData();

    // IMPORTANT: Pack the entire object as a JSON string into the 'event' field
    formData.append('event', JSON.stringify(eventData));

    // Append file separately (if present)
    if (file) {
      // Backend expects 'image' as the field name (see C++ Controller)
      formData.append('image', file, file.name);
    }

    return this.http.post<any>(this.baseUrl, formData);
  }

  /**
   * @brief Retrieves a list of ranked events (Hall of Fame).
   * @returns An Observable emitting an array of CakeEvent objects.
   */
  getRankedEvents(): Observable<CakeEvent[]> {
    return this.http.get<CakeEvent[]>(`${this.baseUrl}/ranked`);
  }

  /**
   * @brief Retrieves a single event by its ID.
   * @param id The ID of the event.
   * @returns An Observable emitting the CakeEvent object.
   */
  getById(id: string): Observable<CakeEvent> {
    return this.http.get<CakeEvent>(`${this.baseUrl}/${id}`);
  }

  /**
   * @brief Downloads an ICS file for a specific event.
   * @param id The ID of the event.
   */
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

  /**
   * @brief Uploads a photo for a specific event.
   * @param id The ID of the event.
   * @param file The photo file to upload.
   * @returns An Observable that completes when the operation is finished.
   */
  uploadPhoto(id: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<void>(`${this.baseUrl}/${id}/photo`, formData);
  }

  /**
   * @brief Rates an event.
   * @param id The ID of the event.
   * @param stars The rating in stars (1-5).
   * @param comment An optional comment.
   * @returns An Observable that completes when the operation is finished.
   */
  rateEvent(id: string, stars: number, comment: string = ''): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/rate`, { stars, comment });
  }

  /**
   * @brief Deletes an event.
   * @param id The ID of the event to delete.
   * @returns An Observable that completes when the operation is finished.
   */
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}