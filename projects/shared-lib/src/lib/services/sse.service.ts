/**
 * @file sse.service.ts
 * @brief Service for handling Server-Sent Events (SSE).
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Injectable, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface SseMessage {
  type: string;
  groupId: string;
  bakerName: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class SseService {
  private zone = inject(NgZone);
  private auth = inject(AuthService);

  /**
   * @brief Establishes a connection to a Server-Sent Events endpoint and returns an Observable of messages.
   * @param url The URL of the SSE endpoint.
   * @returns An Observable emitting SseMessage objects.
   */
  getServerSentEvents(url: string): Observable<SseMessage> {
    return new Observable((observer) => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchData = async () => {
        try {
          // CORRECTION: getToken() instead of token()
          const token = this.auth.getToken();

          if (!token) {
            // If no token is available, we cannot connect -> Silent fail or Error
            // Here we throw an error so that the calendar can react if necessary
            throw new Error('No token available for SSE connection');
          }

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'text/event-stream',
            },
            signal,
          });

          if (!response.ok) {
            throw new Error(`SSE Error: ${response.statusText}`);
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) throw new Error('No reader available');

          let buffer = '';

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const dataPrefix = 'data: ';
              if (line.startsWith(dataPrefix)) {
                const jsonStr = line.substring(dataPrefix.length);
                try {
                  const data = JSON.parse(jsonStr);

                  this.zone.run(() => {
                    const myGroupId = this.auth.currentUser()?.groupId;
                    if (data.type === 'NEW_EVENT' && data.groupId === myGroupId) {
                      observer.next(data);
                    }
                  });
                } catch (e) {
                  console.error('Error parsing SSE JSON:', e);
                }
              }
            }
          }
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            this.zone.run(() => observer.error(err));
          }
        }
      };

      fetchData();

      return () => {
        controller.abort();
      };
    });
  }
}