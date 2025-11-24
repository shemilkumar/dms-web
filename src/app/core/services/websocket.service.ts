import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket$: WebSocketSubject<any> | undefined;
  private socketUrl: string = '';

  constructor() { }

  connect(url: string): void {
    this.socketUrl = url;

    if (!this.socket$ || this.socket$.closed) {
      // console.log('[WS] Connecting to:', url);

      this.socket$ = new WebSocketSubject({
        url,
        deserializer: (e: MessageEvent) => {
          // console.log('[WS] Raw message received:', e.data);

          if (e.data instanceof Blob) {
            return e.data.text().then(text => {
              try {
                const parsed = JSON.parse(text);
                // console.log('[WS] Parsed blob message:', parsed);
                return parsed;
              } catch (err) {
                // console.error('[WS] Failed to parse blob JSON:', text, err);
                return text; // fallback to plain text
              }
            });
          } else {
            try {
              const parsed = JSON.parse(e.data);
              // console.log('[WS] Parsed JSON message:', parsed);
              return parsed;
            } catch (err) {
              // console.error('[WS] Failed to parse JSON:', e.data, err);
              return e.data; // fallback to raw message
            }
          }
        }

      });

      this.socket$.subscribe({
        next: (message) => {
          // console.log('[WS] Message received:', message);
        },
        error: (err) => {
          // console.error('[WS] Connection error:', err);
        },
        complete: () => {
          // console.warn('[WS] Connection closed');
        }
      });
    } else {
      // console.warn('[WS] Already connected');
    }
  }

  sendMessage(message: any): void {
    // console.log('[WS] Sending message:', message);
    if (this.socket$) {
      this.socket$.next(message);
    } else {
      // console.warn('[WS] Cannot send message, not connected');
    }
  }

  getMessages(): Observable<any> {
    if (!this.socket$) {
      // console.warn('[WS] getMessages() called without active connection');
    }

    return this.socket$?.asObservable().pipe(
      retry({
        count: 3,
        delay: 1000
      })
    ) ?? new Observable();
  }

  disconnect(): void {
    if (this.socket$) {
      // console.log('[WS] Disconnecting from:', this.socketUrl);
      this.socket$.complete();

      // Optional: manually close underlying socket if accessible
      (this.socket$ as any)?._socket?.close?.();

      this.socket$ = undefined;
    } else {
      // console.warn('[WS] disconnect() called, but no active socket');
    }
  }

  isConnected(): boolean {
    return !!this.socket$ && !this.socket$.closed;
  }
}
