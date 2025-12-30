import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideZonelessChangeDetection, // <--- KORREKT für v21
} from '@angular/core';

import { routes } from './app.routes';
import { authInterceptor } from 'shared-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    // Aktiviert den Zoneless Mode (Signals-based rendering)
    provideZonelessChangeDetection(),

    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
