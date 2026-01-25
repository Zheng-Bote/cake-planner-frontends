/**
 * @file auth.service.ts
 * @brief Service for handling authentication and user sessions.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
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
  // We initialize the token directly from storage, if available
  private _currentUser = signal<User | null>(null);
  private _token = signal<string | null>(sessionStorage.getItem('access_token'));

  // --- PUBLIC SIGNALS (Read-only) ---
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => !!this._token());

  /**
   * @brief Constructs the service and restores the session from storage.
   */
  constructor() {
    // On app start: Try to restore the user from sessionStorage
    this.restoreSession();
  }

  // --- ACTIONS ---

  /**
   * @brief Registers a new user.
   * @param data The user registration data.
   * @returns An Observable that completes when the operation is finished.
   */
  registerUser(data: RegisterUser) {
    return this.http.post('/api/register', data);
  }

  /**
   * @brief Logs in a user.
   * @param email The user's email.
   * @param password The user's password.
   * @param code The 2FA code, if required.
   * @returns An Observable emitting the authentication response.
   */
  login(email: string, password: string, code?: string) {
    const payload: any = { email, password };
    if (code) {
      payload.code = code;
    }

    return this.http.post<AuthResponse>('/api/login', payload).pipe(
      tap((response) => {
        // If login is successful (token + user available), save the session
        if (response.token && response.user) {
          this.setSession(response);
        }
      }),
    );
  }

  /**
   * @brief Sends a password reset request.
   * @param email The user's email.
   * @returns An Observable emitting a message on success.
   */
  forgotPassword(email: string) {
    return this.http.post<{ message: string }>('/api/auth/forgot-password', { email });
  }

  /**
   * @brief Logs out the current user.
   */
  logout() {
    // 1. Clean up state
    this._token.set(null);
    this._currentUser.set(null);

    // 2. Clean up storage
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_data'); // Important for restore

    // 3. Redirect
    this.router.navigate(['/login']);
  }

  /**
   * @brief Changes the current user's password.
   * @param newPassword The new password.
   * @returns An Observable that completes when the operation is finished.
   */
  changePassword(newPassword: string) {
    // We send the new password to the server.
    // The server knows who the user is from the token (in the header/cookie).
    return this.http.post<void>('/api/user/change-password', {
      newPassword,
    });
  }

  // --- INTERNALS (Session Management) ---

  /**
   * @brief Sets the user session based on the authentication response.
   * @param authResult The authentication response.
   */
  private setSession(authResult: AuthResponse) {
    if (!authResult.token || !authResult.user) return;

    // Set signals
    this._token.set(authResult.token);
    this._currentUser.set(authResult.user);

    // Persist for page refresh (F5)
    sessionStorage.setItem('access_token', authResult.token);

    // We save the user object as JSON so that we still have the name after F5
    sessionStorage.setItem('user_data', JSON.stringify(authResult.user));
  }

  /**
   * @brief Restores the user session from session storage.
   */
  private restoreSession() {
    const token = sessionStorage.getItem('access_token');
    const userJson = sessionStorage.getItem('user_data');

    if (token && userJson) {
      try {
        const user: User = JSON.parse(userJson);

        // Restore state
        this._token.set(token);
        this._currentUser.set(user);
      } catch (e) {
        console.error('Error restoring session (data corrupt)', e);
        // If data in storage is invalid -> perform a clean logout
        this.logout();
      }
    }
  }

  /**
   * @brief Gets the current authentication token.
   * @returns The authentication token or null if not authenticated.
   */
  getToken() {
    return this._token();
  }

  // --- 2FA FEATURES ---

  /**
   * @brief Initiates the 2FA setup process.
   * @returns An Observable emitting the 2FA setup data.
   */
  setup2FA() {
    return this.http.post<TwoFactorSetupResponse>('/api/auth/2fa/setup', {});
  }

  /**
   * @brief Activates 2FA with a secret and a code.
   * @param secret The 2FA secret.
   * @param code The 2FA code.
   * @returns An Observable that completes when the operation is finished.
   */
  activate2FA(secret: string, code: string) {
    return this.http.post('/api/auth/2fa/activate', { secret, code });
  }
}