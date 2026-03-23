import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalculatorService } from '../../../core/calculator/calculator.service';

@Component({
  selector: 'app-verbindungsmittel',
  imports: [DecimalPipe, MatIconModule, MatTooltipModule],
  template: `
    @if (calculator.verbindungsmittel().positionen.length === 0) {
      <p class="kein-vm">Keine Verbindungsmittel (Flachdach).</p>
    } @else {
      <div class="vm-tabelle">
        <div class="vm-header">
          <span>Position</span>
          <span>Dimension</span>
          <span class="text-right">Anzahl</span>
          <span class="text-right">ca. kg</span>
        </div>
        @for (pos of calculator.verbindungsmittel().positionen; track pos.bezeichnung) {
          <div class="vm-zeile">
            <span class="vm-bezeichnung">
              {{ pos.bezeichnung }}
              @if (pos.hinweis) {
                <mat-icon
                  class="vm-info"
                  [matTooltip]="pos.hinweis"
                  matTooltipPosition="right"
                >info_outline</mat-icon>
              }
            </span>
            <span class="vm-dimension">{{ pos.dimension }}</span>
            <span class="vm-wert text-right">{{ pos.anzahl | number:'1.0-0' }} Stk</span>
            <span class="vm-wert text-right">{{ pos.gewichtKg | number:'1.1-1' }} kg</span>
          </div>
        }
        <div class="vm-footer">
          <span>Gesamt Gewicht</span>
          <span></span>
          <span></span>
          <span class="vm-wert text-right">
            {{ gesamtgewicht() | number:'1.1-1' }} kg
          </span>
        </div>
      </div>
      <p class="vm-hinweis">
        <mat-icon>info_outline</mat-icon>
        Richtwerte. Mengen inkl. 5–10 % Verschnitt kalkulieren.
      </p>
    }
  `,
  styles: [`
    .kein-vm {
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
    }

    .vm-tabelle {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 1fr;
      gap: 0;
      font-size: 13px;
    }

    .vm-header {
      display: contents;

      > span {
        padding: 4px 6px 8px;
        font-weight: 500;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--mat-sys-on-surface-variant);
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }
    }

    .vm-zeile {
      display: contents;

      > span {
        padding: 10px 6px;
        border-bottom: 1px solid var(--mat-sys-surface-variant);
        display: flex;
        align-items: center;
      }

      &:hover > span {
        background: var(--mat-sys-surface-variant);
      }
    }

    .vm-footer {
      display: contents;

      > span {
        padding: 10px 6px;
        font-weight: 600;
        border-top: 2px solid var(--mat-sys-outline-variant);
      }
    }

    .vm-bezeichnung {
      gap: 4px;
    }

    .vm-info {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: var(--mat-sys-on-surface-variant);
      cursor: help;
      flex-shrink: 0;
    }

    .vm-dimension {
      color: var(--mat-sys-on-surface-variant);
    }

    .vm-wert {
      font-variant-numeric: tabular-nums;
    }

    .text-right {
      justify-content: flex-end;
      text-align: right;
    }

    .vm-hinweis {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
      margin: 12px 0 0;

      mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
    }
  `],
})
export class VerbindungsmittelComponent {
  readonly calculator = inject(CalculatorService);

  gesamtgewicht(): number {
    return this.calculator.verbindungsmittel().positionen
      .reduce((sum, p) => sum + p.gewichtKg, 0);
  }
}
