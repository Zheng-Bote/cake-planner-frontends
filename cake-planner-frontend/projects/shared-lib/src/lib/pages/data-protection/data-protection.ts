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
  private sanitizer = inject(DomSanitizer); // Sanitizer injecten
  private transloco = inject(TranslocoService);

  // Signal ist jetzt vom Typ SafeHtml, damit Angular es akzeptiert
  loadedHtml = signal<SafeHtml>(this.sanitizer.bypassSecurityTrustHtml('Lade Inhalte...'));

  constructor() {
    // Reagiert automatisch auf Sprachänderungen (de/en)
    effect(() => {
      // Zugriff auf das Signal der aktiven Sprache (falls verfügbar) oder Subscription nutzen
      // Da Transloco v7 oft Observables nutzt, hier der Weg über langChanges$:
      this.transloco.langChanges$.subscribe((lang) => {
        this.loadHtml(lang);
      });
    });
  }

  private loadHtml(lang: string) {
    // Fallback auf 'de', falls eine andere Sprache kommt
    const useLang = lang === 'en' ? 'en' : 'de';

    this.http
      .get(`assets/docs/data-protection_${useLang}.html`, { responseType: 'text' })
      .subscribe((html) => {
        this.loadedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
      });
  }

  ngOnInit() {
    // Standardmäßig Deutsch laden beim Start
    //this.loadLanguage('de');
  }

  // Refactoring: Eine Methode für beide Sprachen ist sauberer
  loadLanguage(lang: 'de' | 'en') {
    const path = `assets/docs/data-protection_${lang}.html`;

    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (html) => {
        // HTML als "sicher" markieren
        const safeContent = this.sanitizer.bypassSecurityTrustHtml(html);
        this.loadedHtml.set(safeContent);
      },
      error: (err) => {
        console.error('Konnte Datenschutz nicht laden', err);
        this.loadedHtml.set('Fehler beim Laden der Datei.');
      },
    });
  }

  // Wrapper-Methoden für die Buttons (falls benötigt)
  getGerman() {
    this.loadLanguage('de');
  }

  getEnglish() {
    this.loadLanguage('en');
  }
}
