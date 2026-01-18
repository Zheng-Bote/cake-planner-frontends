import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { AuthResponse, User, RegisterUser } from '../models/user.model';
import { TwoFactorSetupResponse } from '../models/2fa.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // --- STATE ---
  // Wir initialisieren das Token direkt aus dem Storage, falls vorhanden
  private _currentUser = signal<User | null>(null);
  private _token = signal<string | null>(sessionStorage.getItem('access_token'));

  // --- PUBLIC SIGNALS (Read-only) ---
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => !!this._token());

  constructor() {
    // Beim App-Start: Versuchen, den User aus dem sessionStorage wiederherzustellen
    this.restoreSession();
  }

  // --- ACTIONS ---

  registerUser(data: RegisterUser) {
    return this.http.post('/api/register', data);
  }

  login(email: string, password: string, code?: string) {
    const payload: any = { email, password };
    if (code) {
      payload.code = code;
    }

    return this.http.post<AuthResponse>('/api/login', payload).pipe(
      tap((response) => {
        // Wenn Login erfolgreich (Token + User da), Session speichern
        if (response.token && response.user) {
          this.setSession(response);
        }
      }),
    );
  }

  logout() {
    // 1. State bereinigen
    this._token.set(null);
    this._currentUser.set(null);

    // 2. Storage bereinigen
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_data'); // Wichtig für den Restore

    // 3. Redirect
    this.router.navigate(['/login']);
  }

  changePassword(newPassword: string) {
    // Wir senden das neue Passwort an den Server.
    // Der Server weiß durch das Token (im Header/Cookie), wer der User ist.
    return this.http.post<void>('/api/user/change-password', {
      newPassword,
    });
  }

  // --- INTERNALS (Session Management) ---

  private setSession(authResult: AuthResponse) {
    if (!authResult.token || !authResult.user) return;

    // Signale setzen
    this._token.set(authResult.token);
    this._currentUser.set(authResult.user);

    // Persistieren für Page Refresh (F5)
    sessionStorage.setItem('access_token', authResult.token);

    // Wir speichern das User-Objekt als JSON, damit wir den Namen nach F5 noch haben
    sessionStorage.setItem('user_data', JSON.stringify(authResult.user));
  }

  private restoreSession() {
    const token = sessionStorage.getItem('access_token');
    const userJson = sessionStorage.getItem('user_data');

    if (token && userJson) {
      try {
        const user: User = JSON.parse(userJson);

        // State wiederherstellen
        this._token.set(token);
        this._currentUser.set(user);
      } catch (e) {
        console.error('Fehler beim Wiederherstellen der Session (Daten korrupt)', e);
        // Falls Daten im Storage ungültig sind -> sauberen Logout machen
        this.logout();
      }
    }
  }

  getToken() {
    return this._token();
  }

  // --- 2FA FEATURES ---

  setup2FA() {
    return this.http.post<TwoFactorSetupResponse>('/api/auth/2fa/setup', {});
  }

  activate2FA(secret: string, code: string) {
    return this.http.post('/api/auth/2fa/activate', { secret, code });
  }
}
