/**
 * @file app.config.ts
 * @brief Application configuration for the admin panel.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { ApplicationConfig, isDevMode, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTransloco, TranslocoLoader, Translation } from '@jsverse/transloco';

import { routes } from './app.routes';
import { authInterceptor } from 'shared-lib'; // Adjust path if necessary

/**
 * @brief Loader for Transloco that fetches translations from assets.
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  /**
   * @brief Gets the translation file for the specified language.
   * @param lang The language code (e.g., 'en', 'de').
   * @returns A Promise that resolves to the translation object.
   */
  getTranslation(lang: string): Promise<Translation> {
    return fetch(`./assets/i18n/${lang}.json`).then((res) => res.json());
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Configure Transloco with the loader class
    provideTransloco({
      config: {
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader, // Pass the class here
    }),
  ],
};