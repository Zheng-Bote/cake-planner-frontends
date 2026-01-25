/**
 * @file theme.service.ts
 * @brief Service for managing the application theme (dark/light mode).
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { Injectable, signal, effect, inject, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private rendererFactory = inject(RendererFactory2);

  // Default is 'light', unless something else is in storage
  darkMode = signal<boolean>(localStorage.getItem('app-theme') === 'dark');

  /**
   * @brief Constructs the service and sets up an effect to apply the theme.
   */
  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    // Effect: Reacts automatically when the signal changes
    effect(() => {
      const isDark = this.darkMode();
      localStorage.setItem('app-theme', isDark ? 'dark' : 'light');

      if (isDark) {
        this.renderer.addClass(document.body, 'dark-theme');
      } else {
        this.renderer.removeClass(document.body, 'dark-theme');
      }
    });
  }

  /**
   * @brief Toggles the theme between dark and light mode.
   */
  toggle() {
    this.darkMode.update((val) => !val);
  }
}