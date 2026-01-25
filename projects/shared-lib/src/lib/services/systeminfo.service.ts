/**
 * @file systeminfo.service.ts
 * @brief Service for retrieving system information.
 * @version 0.1.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SystemInfoFrontend, SystemInfoBackend } from 'shared-lib';
import {
  userAppVersion,
  adminPanelVersion,
  AngularVersion,
  description,
  author,
  license,
  homepage,
  created,
} from '../../../../../package.json';

@Injectable({ providedIn: 'root' })
export class SystemInfoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/system';

  /**
   * @brief Retrieves backend system information.
   * @returns An Observable emitting the backend system information.
   */
  getBackendSystemInfo(): Observable<SystemInfoBackend> {
    return this.http.get<SystemInfoBackend>(`${this.baseUrl}/sysinfo`);
  }

  /**
   * @brief Retrieves frontend system information from the package.json file.
   * @returns An Observable emitting the frontend system information.
   */
  getFrontendSystemInfo(): Observable<SystemInfoFrontend> {
    const systemInfo: SystemInfoFrontend = {
      userAppVersion,
      adminAppVersion: adminPanelVersion,
      AngularVersion: AngularVersion,
      description: description,
      author: author,
      license: license,
      homepage: homepage,
      created: created,
    };

    return of(systemInfo);
  }
}