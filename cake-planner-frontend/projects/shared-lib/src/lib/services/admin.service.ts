/**
 * AdminService
 * @description Service for admin operations
 * @author Zheng Bote
 * @version 1.1.0
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Group } from 'shared-lib';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/admin';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  toggleUserActive(userId: string, isActive: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/${userId}/status`, { isActive });
  }

  forcePasswordChange(userId: string, mustChange: boolean): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/force-password-change`, {
      userId,
      mustChange,
    });
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }

  // --- Groups Management ---
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}/groups`);
  }

  createGroup(name: string): Observable<Group> {
    return this.http.post<Group>(`${this.baseUrl}/groups`, { name });
  }

  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/groups/${groupId}`);
  }

  assignGroup(userId: string, groupId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/assign-group`, { userId, groupId });
  }

  setGroupRole(userId: string, groupId: string, role: 'admin' | 'member'): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/groups/set-role`, { userId, groupId, role });
  }
}
