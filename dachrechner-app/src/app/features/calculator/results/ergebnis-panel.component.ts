import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { CalculatorService } from '../../../core/calculator/calculator.service';

@Component({
  selector: 'app-ergebnis-panel',
  imports: [DecimalPipe, MatCardModule, MatIconModule, MatDividerModule, MatExpansionModule],
  template: `
    <mat-card class="ergebnis-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>calculate</mat-icon>
        <mat-card-title>Ergebnis</mat-card-title>
        <mat-card-subtitle>{{ dachformLabel }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>

        <!-- Hauptwert: Dachfläche -->
        <div class="ergebnis-hauptwert">
          <span class="ergebnis-zahl">{{ calculator.ergebnis().dachflaeche | number:'1.1-1' }}</span>
          <span class="ergebnis-einheit">m²</span>
          <span class="ergebnis-label-haupt">Dachfläche</span>
        </div>

        <mat-divider />

        <!-- Dachgeometrie -->
        <div class="ergebnis-section-titel">Dachgeometrie</div>
        <div class="ergebnis-liste">
          @for (zeile of geometrieZeilen; track zeile.label) {
            @if (zeile.wert() > 0) {
              <div class="ergebnis-zeile">
                <mat-icon class="zeile-icon">{{ zeile.icon }}</mat-icon>
                <span class="zeile-label">{{ zeile.label }}</span>
                <span class="zeile-wert">{{ zeile.wert() | number:'1.1-1' }} <span class="zeile-einheit">{{ zeile.einheit }}</span></span>
              </div>
            }
          }
        </div>

        <!-- Holzmenge -->
        @if (calculator.holzErgebnis().positionen.length > 0) {
          <mat-divider />
          <div class="ergebnis-section-titel">Holz</div>
          <div class="ergebnis-liste">
            @for (pos of calculator.holzErgebnis().positionen; track pos.bezeichnung) {
              <div class="ergebnis-zeile">
                <mat-icon class="zeile-icon">forest</mat-icon>
                <span class="zeile-label">{{ pos.bezeichnung }}</span>
                <span class="zeile-wert">{{ pos.m3 | number:'1.2-2' }} <span class="zeile-einheit">m³</span></span>
              </div>
            }
            <div class="ergebnis-zeile ergebnis-zeile--gesamt">
              <mat-icon class="zeile-icon">forest</mat-icon>
              <span class="zeile-label">Gesamt</span>
              <span class="zeile-wert">
                {{ calculator.holzErgebnis().gesamtM3 | number:'1.2-2' }} m³ ·
                ~{{ calculator.holzErgebnis().gesamtKg | number:'1.0-0' }} kg
              </span>
            </div>
          </div>
        }

        <!-- Eindeckung -->
        @if (calculator.ergebnis().dachflaeche > 0) {
          <mat-divider />
          <div class="ergebnis-section-titel">Eindeckung</div>
          <div class="ergebnis-liste">
            <div class="ergebnis-zeile">
              <mat-icon class="zeile-icon">roofing</mat-icon>
              <span class="zeile-label">{{ calculator.eindeckungErgebnis().material }}</span>
              <span class="zeile-wert">
                {{ calculator.eindeckungErgebnis().flaecheBrutto | number:'1.1-1' }}
                <span class="zeile-einheit">m²</span>
              </span>
            </div>
            @if (calculator.eindeckungErgebnis().stueck) {
              <div class="ergebnis-zeile">
                <mat-icon class="zeile-icon">grid_view</mat-icon>
                <span class="zeile-label">Stückzahl</span>
                <span class="zeile-wert">
                  {{ calculator.eindeckungErgebnis().stueck | number:'1.0-0' }}
                  <span class="zeile-einheit">Stk</span>
                </span>
              </div>
            }
          </div>
        }

        <!-- Dachaufbau -->
        @if (hatDachaufbau()) {
          <mat-divider />
          <div class="ergebnis-section-titel">Dachaufbau</div>
          <div class="ergebnis-liste">
            @if (calculator.dachaufbauErgebnis().unterdeckbahn; as ub) {
              <div class="ergebnis-zeile">
                <mat-icon class="zeile-icon">layers</mat-icon>
                <span class="zeile-label">Unterdeckbahn</span>
                <span class="zeile-wert">{{ ub.flaecheBrutto | number:'1.1-1' }} <span class="zeile-einheit">m²</span></span>
              </div>
            }
            @if (calculator.dachaufbauErgebnis().daemmung; as d) {
              <div class="ergebnis-zeile">
                <mat-icon class="zeile-icon">thermostat</mat-icon>
                <span class="zeile-label">{{ d.bezeichnung }}</span>
                <span class="zeile-wert">{{ d.volumenM3 | number:'1.2-2' }} <span class="zeile-einheit">m³</span></span>
              </div>
            }
            @if (calculator.dachaufbauErgebnis().dampfbremse; as db) {
              <div class="ergebnis-zeile">
                <mat-icon class="zeile-icon">water_drop</mat-icon>
                <span class="zeile-label">Dampfbremse</span>
                <span class="zeile-wert">{{ db.flaecheM2 | number:'1.1-1' }} <span class="zeile-einheit">m²</span></span>
              </div>
            }
          </div>
        }

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

    .ergebnis-section-titel {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--mat-sys-on-surface-variant);
      padding: 10px 4px 4px;
    }

    .ergebnis-liste {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ergebnis-zeile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 4px;
      border-radius: 6px;
      transition: background 0.15s;

      &:hover { background: var(--mat-sys-surface-variant); }
      &--gesamt { font-weight: 600; }
    }

    .zeile-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--mat-sys-on-surface-variant);
      flex-shrink: 0;
    }

    .zeile-label { flex: 1; font-size: 13px; }

    .zeile-wert {
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .zeile-einheit {
      font-size: 11px;
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
      sattel: 'Satteldach', pult: 'Pultdach', walm: 'Walmdach', flach: 'Flachdach',
    };
    return labels[this.calculator.dachform()] ?? '';
  }

  hatDachaufbau(): boolean {
    const d = this.calculator.dachaufbauErgebnis();
    return !!(d.unterdeckbahn || d.daemmung || d.dampfbremse);
  }

  readonly geometrieZeilen = [
    { label: 'Sparrenlänge',     wert: () => this.calculator.ergebnis().sparrenLaenge, einheit: 'm',   icon: 'straighten' },
    { label: 'Sparren (Stück)',  wert: () => this.calculator.ergebnis().sparrenAnzahl, einheit: 'Stk', icon: 'view_column' },
    { label: 'Latten (Stück)',   wert: () => this.calculator.ergebnis().lattenAnzahl,  einheit: 'Stk', icon: 'view_stream' },
    { label: 'Lattenlänge ges.', wert: () => this.calculator.ergebnis().lattenLaenge,  einheit: 'm',   icon: 'horizontal_rule' },
    { label: 'Firstlänge',       wert: () => this.calculator.ergebnis().firstLaenge,   einheit: 'm',   icon: 'arrow_upward' },
    { label: 'Trauflänge ges.',  wert: () => this.calculator.ergebnis().traufLaenge,   einheit: 'm',   icon: 'arrow_downward' },
    { label: 'Gratlänge ges.',   wert: () => this.calculator.ergebnis().gratLaenge,    einheit: 'm',   icon: 'call_made' },
  ];
}
