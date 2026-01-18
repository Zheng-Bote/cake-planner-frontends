/**
 * SystemInfoService
 * @description Service for system info operations
 * @author Zheng Bote
 * @version 0.1.0
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

  getBackendSystemInfo(): Observable<SystemInfoBackend> {
    return this.http.get<SystemInfoBackend>(`${this.baseUrl}/sysinfo`);
  }

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
