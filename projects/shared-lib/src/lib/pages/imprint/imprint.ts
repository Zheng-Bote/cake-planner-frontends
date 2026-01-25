/**
 * @file imprint.ts
 * @brief Component for displaying the imprint page.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [CommonModule, TranslocoModule, MatCardModule],
  templateUrl: './imprint.html',
  styleUrls: ['./imprint.css'],
})
export class ImprintComponent {
  private transloco = inject(TranslocoService);
}