import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CalculatorService } from '../../../core/calculator/calculator.service';

interface ErgebnisZeile {
  label: string;
  wert: () => number;
  einheit: string;
  icon: string;
  hervorgehoben?: boolean;
}

@Component({
  selector: 'app-ergebnis-panel',
  imports: [DecimalPipe, MatCardModule, MatIconModule, MatDividerModule],
  template: `
    <mat-card class="ergebnis-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>calculate</mat-icon>
        <mat-card-title>Ergebnis</mat-card-title>
        <mat-card-subtitle>{{ dachformLabel }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="ergebnis-hauptwert">
          <span class="ergebnis-zahl">{{ calculator.ergebnis().dachflaeche | number:'1.1-1' }}</span>
          <span class="ergebnis-einheit">m²</span>
          <span class="ergebnis-label-haupt">Dachfläche</span>
        </div>

        <mat-divider />

        <div class="ergebnis-liste">
          @for (zeile of zeilen; track zeile.label) {
            @if (zeile.wert() > 0) {
              <div class="ergebnis-zeile" [class.ergebnis-zeile--hervorgehoben]="zeile.hervorgehoben">
                <mat-icon class="zeile-icon">{{ zeile.icon }}</mat-icon>
                <span class="zeile-label">{{ zeile.label }}</span>
                <span class="zeile-wert">
                  {{ zeile.wert() | number:'1.1-1' }}
                  <span class="zeile-einheit">{{ zeile.einheit }}</span>
                </span>
              </div>
            }
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .ergebnis-card {
      border-radius: var(--card-radius) !important;
      position: sticky;
      top: 80px;
    }

    .ergebnis-hauptwert {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px;
      padding: 16px 0;
      justify-content: center;

      .ergebnis-zahl {
        font-size: 48px;
        font-weight: 300;
        color: var(--mat-sys-primary);
        line-height: 1;
      }

      .ergebnis-einheit {
        font-size: 24px;
        color: var(--mat-sys-primary);
      }

      .ergebnis-label-haupt {
        width: 100%;
        text-align: center;
        font-size: 13px;
        color: var(--mat-sys-on-surface-variant);
      }
    }

    .ergebnis-liste {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 12px;
    }

    .ergebnis-zeile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
      border-radius: 8px;
      transition: background 0.15s;

      &:hover {
        background: var(--mat-sys-surface-variant);
      }

      &--hervorgehoben {
        font-weight: 500;
      }
    }

    .zeile-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--mat-sys-on-surface-variant);
      flex-shrink: 0;
    }

    .zeile-label {
      flex: 1;
      font-size: 14px;
    }

    .zeile-wert {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .zeile-einheit {
      font-size: 12px;
      font-weight: 400;
      color: var(--mat-sys-on-surface-variant);
      margin-left: 2px;
    }
  `],
})
export class ErgebnisPanelComponent {
  readonly calculator = inject(CalculatorService);

  get dachformLabel(): string {
    const labels: Record<string, string> = {
      sattel: 'Satteldach',
      pult: 'Pultdach',
      walm: 'Walmdach',
      flach: 'Flachdach',
    };
    return labels[this.calculator.dachform()] ?? '';
  }

  readonly zeilen: ErgebnisZeile[] = [
    {
      label: 'Sparrenlänge',
      wert: () => this.calculator.ergebnis().sparrenLaenge,
      einheit: 'm',
      icon: 'straighten',
    },
    {
      label: 'Sparren (Stück)',
      wert: () => this.calculator.ergebnis().sparrenAnzahl,
      einheit: 'Stk',
      icon: 'view_column',
      hervorgehoben: true,
    },
    {
      label: 'Latten (Stück)',
      wert: () => this.calculator.ergebnis().lattenAnzahl,
      einheit: 'Stk',
      icon: 'view_stream',
      hervorgehoben: true,
    },
    {
      label: 'Lattenlänge gesamt',
      wert: () => this.calculator.ergebnis().lattenLaenge,
      einheit: 'm',
      icon: 'horizontal_rule',
    },
    {
      label: 'Firstlänge',
      wert: () => this.calculator.ergebnis().firstLaenge,
      einheit: 'm',
      icon: 'arrow_upward',
    },
    {
      label: 'Trauflänge gesamt',
      wert: () => this.calculator.ergebnis().traufLaenge,
      einheit: 'm',
      icon: 'arrow_downward',
    },
    {
      label: 'Gratlänge gesamt',
      wert: () => this.calculator.ergebnis().gratLaenge,
      einheit: 'm',
      icon: 'call_made',
    },
  ];
}
