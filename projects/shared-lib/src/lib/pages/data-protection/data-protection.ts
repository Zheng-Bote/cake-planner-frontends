/**
 * @file data-protection.ts
 * @brief Component for displaying the data protection policy.
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
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-data-protection',
  standalone: true,
  imports: [CommonModule, TranslocoModule, MatCardModule],

  templateUrl: './data-protection.html',
  styleUrls: ['./data-protection.css'],
})
export class DataProtectionComponent {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer); // Inject Sanitizer
  private transloco = inject(TranslocoService);

  // Signal is now of type SafeHtml so that Angular accepts it
  loadedHtml = signal<SafeHtml>(this.sanitizer.bypassSecurityTrustHtml('Loading content...'));

  /**
   * @brief Constructs the component and sets up an effect to load the data protection HTML when the language changes.
   */
  constructor() {
    // Automatically reacts to language changes (de/en)
    effect(() => {
      // Access the signal of the active language (if available) or use subscription
      // Since Transloco v7 often uses Observables, here is the way via langChanges$:
      this.transloco.langChanges$.subscribe((lang) => {
        this.loadHtml(lang);
      });
    });
  }

  /**
   * @brief Loads the data protection HTML file for the specified language.
   * @param lang The language of the HTML file to load.
   */
  private loadHtml(lang: string) {
    // Fallback to 'de' if another language is provided
    const useLang = lang === 'en' ? 'en' : 'de';

    this.http
      .get(`assets/docs/data-protection_${useLang}.html`, { responseType: 'text' })
      .subscribe((html) => {
        this.loadedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
      });
  }

  /**
   * @brief Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit() {
    // Load German by default on start
    //this.loadLanguage('de');
  }

  /**
   * @brief Loads the data protection HTML file for the specified language.
   * @param lang The language to load ('de' or 'en').
   */
  loadLanguage(lang: 'de' | 'en') {
    const path = `assets/docs/data-protection_${lang}.html`;

    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (html) => {
        // Mark HTML as "safe"
        const safeContent = this.sanitizer.bypassSecurityTrustHtml(html);
        this.loadedHtml.set(safeContent);
      },
      error: (err) => {
        console.error('Could not load data protection', err);
        this.loadedHtml.set('Error loading file.');
      },
    });
  }

  /**
   * @brief Loads the German version of the data protection policy.
   */
  getGerman() {
    this.loadLanguage('de');
  }

  /**
   * @brief Loads the English version of the data protection policy.
   */
  getEnglish() {
    this.loadLanguage('en');
  }
}