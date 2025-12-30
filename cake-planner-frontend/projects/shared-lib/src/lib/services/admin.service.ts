import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/admin';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  toggleUserActive(userId: string, isActive: boolean): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/toggle-active`, { userId, isActive });
  }
}
