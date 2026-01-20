import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco'; // Import angepasst

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
    // LÄDT die JSONs aus assets/i18n/system-info/*.json
    // MAPPED sie auf den Key 'system_info', damit t('system_info.title') funktioniert.
    provideTranslocoScope({ scope: 'system-info', alias: 'system_info' }),
  ],
  templateUrl: './system-infos.html',
  styleUrls: ['./system-infos.css'],
})
export class SystemInfosComponent implements OnInit {
  private systemInfoService = inject(SystemInfoService);

  backendSystemInfo = signal<SystemInfoBackend | null>(null);
  frontendSystemInfo = signal<SystemInfoFrontend | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

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
