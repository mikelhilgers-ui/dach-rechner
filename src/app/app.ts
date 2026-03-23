import { Component, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  darkMode = signal(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  constructor() {
    // Apply class immediately on init
    document.documentElement.classList.toggle('dark', this.darkMode());

    // Keep in sync on every change
    effect(() => {
      const dark = this.darkMode();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
  }

  toggleTheme(): void {
    this.darkMode.update(v => !v);
  }
}
