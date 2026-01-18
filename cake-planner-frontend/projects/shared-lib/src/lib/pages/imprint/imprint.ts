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
