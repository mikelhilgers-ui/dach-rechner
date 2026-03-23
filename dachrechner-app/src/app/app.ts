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
    localStorage.getItem('theme') !== 'light'
  );

  installPrompt = signal<any>(null);

  constructor() {
    document.documentElement.classList.toggle('dark', this.darkMode());

    effect(() => {
      document.documentElement.classList.toggle('dark', this.darkMode());
      localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
    });

    // PWA Install-Prompt abfangen
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt.set(e);
    });

    // Nach erfolgreicher Installation Button ausblenden
    window.addEventListener('appinstalled', () => {
      this.installPrompt.set(null);
    });
  }

  toggleTheme(): void {
    this.darkMode.update(v => !v);
  }

  async installApp(): Promise<void> {
    const prompt = this.installPrompt();
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') this.installPrompt.set(null);
  }
}
