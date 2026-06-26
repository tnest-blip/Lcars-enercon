import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(this.loadPreference());

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('dark-mode', this.isDark());
      localStorage.setItem('lcars-theme', this.isDark() ? 'dark' : 'light');
    });
  }

  toggle() {
    this.isDark.update(v => !v);
  }

  private loadPreference(): boolean {
    const saved = localStorage.getItem('lcars-theme');
    return saved ? saved === 'dark' : true;
  }
}
