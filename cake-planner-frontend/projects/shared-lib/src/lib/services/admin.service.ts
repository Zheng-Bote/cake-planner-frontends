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
    return this.http.post<void>(`${this.baseUrl}/users/toggle-active`, { userId, isActive });
  }

  forcePasswordChange(userId: string, mustChange: boolean): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/force-password-change`, {
      userId,
      mustChange,
    });
  }

  // Groups
  getGroups() {
    return this.http.get<Group[]>('/api/admin/groups');
  }

  assignGroup(userId: string, groupId: string) {
    return this.http.post('/api/admin/users/assign-group', { userId, groupId });
  }
}
