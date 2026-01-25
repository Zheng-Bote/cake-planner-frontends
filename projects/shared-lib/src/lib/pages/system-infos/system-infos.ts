/**
 * @file system-infos.ts
 * @brief Component for displaying system information.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco'; // Import adjusted

import { SystemInfoService, SystemInfoFrontend, SystemInfoBackend } from 'shared-lib';

@Component({
  selector: 'app-system-infos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,

    TranslocoModule,
  ],
  providers: [
    // LOADS the JSONs from assets/i18n/system-info/*.json
    // MAPS them to the key 'system_info', so that t('system_info.title') works.
    provideTranslocoScope({ scope: 'system-info', alias: 'system_info' }),
  ],
  templateUrl: './system-infos.html',
  styleUrls: ['./system-infos.css'],
})
export class SystemInfosComponent implements OnInit {
  private systemInfoService = inject(SystemInfoService);

  backendSystemInfo = signal<SystemInfoBackend | null>(null);
  frontendSystemInfo = signal<SystemInfoFrontend | null>(null);

  /**
   * @brief Initializes the component and loads system information.
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * @brief Loads frontend and backend system information.
   */
  private loadData(): void {
    this.systemInfoService.getFrontendSystemInfo().subscribe({
      next: (data) => this.frontendSystemInfo.set(data),
      error: (err) => console.error('Error loading frontend info', err),
    });

    this.systemInfoService.getBackendSystemInfo().subscribe({
      next: (data) => this.backendSystemInfo.set(data),
      error: (err) => console.error('Error loading backend info', err),
    });
  }
}