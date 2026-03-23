import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { CalculatorService } from '../../../core/calculator/calculator.service';
import { Dachform } from '../../../core/calculator/calculator.models';

interface DachformOption {
  value: Dachform;
  label: string;
  icon: string;
  beschreibung: string;
}

@Component({
  selector: 'app-dachform-auswahl',
  imports: [MatCardModule, MatIconModule, NgClass],
  template: `
    <div class="dachform-grid">
      @for (option of optionen; track option.value) {
        <mat-card
          class="dachform-card"
          [ngClass]="{ 'dachform-card--aktiv': calculator.dachform() === option.value }"
          (click)="waehle(option.value)"
          tabindex="0"
          (keydown.enter)="waehle(option.value)"
          (keydown.space)="waehle(option.value)"
          role="button"
          [attr.aria-pressed]="calculator.dachform() === option.value"
        >
          <mat-card-content class="dachform-card-content">
            <span class="dachform-icon material-icons">{{ option.icon }}</span>
            <span class="dachform-label">{{ option.label }}</span>
            <span class="dachform-beschreibung">{{ option.beschreibung }}</span>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .dachform-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      @media (min-width: 600px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .dachform-card {
      cursor: pointer;
      transition: box-shadow 0.2s, outline 0.1s;
      outline: 2px solid transparent;
      border-radius: var(--card-radius) !important;

      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      &:focus-visible {
        outline: 2px solid var(--mat-sys-primary);
        outline-offset: 2px;
      }

      &--aktiv {
        outline: 2px solid var(--mat-sys-primary);
        background-color: var(--mat-sys-primary-container);
      }
    }

    .dachform-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 16px 8px !important;
      text-align: center;
    }

    .dachform-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: var(--mat-sys-primary);
    }

    .dachform-label {
      font-size: 15px;
      font-weight: 500;
    }

    .dachform-beschreibung {
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.3;
    }
  `],
})
export class DachformAuswahlComponent {
  readonly calculator = inject(CalculatorService);

  readonly optionen: DachformOption[] = [
    { value: 'sattel', label: 'Satteldach',  icon: 'roofing',       beschreibung: '2 Dachflächen, First oben' },
    { value: 'pult',   label: 'Pultdach',    icon: 'signal_cellular_alt', beschreibung: '1 geneigte Fläche' },
    { value: 'walm',   label: 'Walmdach',    icon: 'home',          beschreibung: '4 Flächen, ohne Giebel' },
    { value: 'flach',  label: 'Flachdach',   icon: 'crop_din',      beschreibung: 'bis 5° Neigung' },
  ];

  waehle(form: Dachform): void {
    this.calculator.setDachform(form);
  }
}
