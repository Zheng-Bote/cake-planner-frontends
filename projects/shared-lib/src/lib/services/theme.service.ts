import { Injectable, signal, effect, inject, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private rendererFactory = inject(RendererFactory2);

  // Default ist 'light', es sei denn, im Storage steht was anderes
  darkMode = signal<boolean>(localStorage.getItem('app-theme') === 'dark');

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    // Effect: Reagiert automatisch, wenn sich das Signal ändert
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

  toggle() {
    this.darkMode.update((val) => !val);
  }
}
