import { ApplicationConfig, isDevMode, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTransloco, TranslocoLoader, Translation } from '@jsverse/transloco';

import { routes } from './app.routes';
import { authInterceptor } from 'shared-lib'; // Pfad ggf. anpassen

// 1. Loader als Klasse definieren
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  getTranslation(lang: string): Promise<Translation> {
    return fetch(`./assets/i18n/${lang}.json`).then((res) => res.json());
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    // 2. Transloco mit der Klasse konfigurieren
    provideTransloco({
      config: {
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader, // <--- Hier die Klasse übergeben
    }),
  ],
};
