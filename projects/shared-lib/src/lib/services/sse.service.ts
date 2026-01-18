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

  getServerSentEvents(url: string): Observable<SseMessage> {
    return new Observable((observer) => {
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchData = async () => {
        try {
          // KORREKTUR: getToken() statt token()
          const token = this.auth.getToken();

          if (!token) {
            // Falls kein Token da ist, können wir nicht verbinden -> Silent fail oder Error
            // Hier werfen wir einen Error, damit der Kalender ggf. reagieren kann
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
