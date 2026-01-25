/**
 * @file admin.service.ts
 * @brief Service for administrative operations.
 * @version 1.1.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Group } from 'shared-lib';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/admin';

  /**
   * @brief Retrieves a list of all users.
   * @returns An Observable emitting an array of User objects.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  /**
   * @brief Toggles the active status of a user.
   * @param userId The ID of the user.
   * @param isActive The new active status.
   * @returns An Observable that completes when the operation is finished.
   */
  toggleUserActive(userId: string, isActive: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/${userId}/status`, { isActive });
  }

  /**
   * @brief Forces a user to change their password on next login.
   * @param userId The ID of the user.
   * @param mustChange Whether the user must change their password.
   * @returns An Observable that completes when the operation is finished.
   */
  forcePasswordChange(userId: string, mustChange: boolean): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/force-password-change`, {
      userId,
      mustChange,
    });
  }

  /**
   * @brief Deletes a user.
   * @param userId The ID of the user to delete.
   * @returns An Observable that completes when the operation is finished.
   */
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }

  /**
   * @brief Retrieves a list of all groups.
   * @returns An Observable emitting an array of Group objects.
   */
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}/groups`);
  }

  /**
   * @brief Creates a new group.
   * @param name The name of the new group.
   * @returns An Observable emitting the newly created Group object.
   */
  createGroup(name: string): Observable<Group> {
    return this.http.post<Group>(`${this.baseUrl}/groups`, { name });
  }

  /**
   * @brief Deletes a group.
   * @param groupId The ID of the group to delete.
   * @returns An Observable that completes when the operation is finished.
   */
  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/groups/${groupId}`);
  }

  /**
   * @brief Assigns a user to a group.
   * @param userId The ID of the user.
   * @param groupId The ID of the group.
   * @returns An Observable that completes when the operation is finished.
   */
  assignGroup(userId: string, groupId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/assign-group`, { userId, groupId });
  }

  /**
   * @brief Sets the role of a user within a group.
   * @param userId The ID of the user.
   * @param groupId The ID of the group.
   * @param role The new role ('admin' or 'member').
   * @returns An Observable that completes when the operation is finished.
   */
  setGroupRole(userId: string, groupId: string, role: 'admin' | 'member'): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/groups/set-role`, { userId, groupId, role });
  }
}