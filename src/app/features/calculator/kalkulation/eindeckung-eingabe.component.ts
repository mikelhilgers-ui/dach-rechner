import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DecimalPipe } from '@angular/common';
import { CalculatorService } from '../../../core/calculator/calculator.service';
import { EindeckungMaterial } from '../../../core/calculator/calculator.models';

interface MaterialOption {
  value: EindeckungMaterial;
  label: string;
  icon: string;
  beschreibung: string;
  minNeigung: number;
}

const MATERIALIEN: MaterialOption[] = [
  { value: 'falzziegel',      label: 'Falzziegel',       icon: 'roofing',          beschreibung: '~10 Stk/m², ab 20° Neigung',   minNeigung: 20 },
  { value: 'betondachstein',  label: 'Betondachstein',   icon: 'roofing',          beschreibung: '~10 Stk/m², ab 14° Neigung',   minNeigung: 14 },
  { value: 'biberschwanz',    label: 'Biberschwanz',     icon: 'roofing',          beschreibung: '~28 Stk/m², ab 30° Neigung',   minNeigung: 30 },
  { value: 'schiefer',        label: 'Schiefer',         icon: 'roofing',          beschreibung: '~30 Stk/m², ab 25° Neigung',   minNeigung: 25 },
  { value: 'trapezblech',     label: 'Trapezblech',      icon: 'crop_landscape',   beschreibung: 'Flächenware, ab 3° Neigung',    minNeigung: 3  },
  { value: 'bitumenschindeln',label: 'Bitumenschindeln', icon: 'texture',          beschreibung: 'Flächenware, ab 10° Neigung',   minNeigung: 10 },
  { value: 'gruendach',       label: 'Gründach',         icon: 'eco',              beschreibung: 'Flächenware, bis 5° Neigung',   minNeigung: 0  },
];

@Component({
  selector: 'app-eindeckung-eingabe',
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <form [formGroup]="form" class="eindeckung-form">
      <mat-form-field appearance="outline" class="form-field-full">
        <mat-label>Eindeckungsmaterial</mat-label>
        <mat-select formControlName="material">
          @for (m of materialien; track m.value) {
            <mat-option [value]="m.value">
              <span class="material-option">
                <strong>{{ m.label }}</strong>
                <span class="material-option-desc">{{ m.beschreibung }}</span>
              </span>
            </mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field-half">
        <mat-label>Zuschlag Verschnitt (%)</mat-label>
        <input matInput type="number" formControlName="zuschlagProzent" min="5" max="30" step="1" />
        <mat-icon matSuffix matTooltip="Empfehlung: 10–15 %">info_outline</mat-icon>
      </mat-form-field>

      <!-- Ergebnis-Vorschau -->
      @if (calculator.ergebnis().dachflaeche > 0) {
        <div class="eindeckung-ergebnis">
          <div class="ergebnis-zeile ergebnis-zeile--haupt">
            <span>{{ calculator.eindeckungErgebnis().material }}</span>
            <span class="ergebnis-wert">
              {{ calculator.eindeckungErgebnis().flaecheBrutto | number:'1.1-1' }} m²
            </span>
          </div>
          @if (calculator.eindeckungErgebnis().stueck) {
            <div class="ergebnis-zeile">
              <span>Stückzahl ({{ calculator.eindeckungErgebnis().stueckProM2 }} Stk/m²)</span>
              <span class="ergebnis-wert">
                {{ calculator.eindeckungErgebnis().stueck | number:'1.0-0' }} Stk
              </span>
            </div>
          }
          @if (calculator.eindeckungErgebnis().hinweis) {
            <div class="ergebnis-hinweis">
              <mat-icon>info_outline</mat-icon>
              {{ calculator.eindeckungErgebnis().hinweis }}
            </div>
          }
        </div>
      }
    </form>
  `,
  styles: [`
    .eindeckung-form { display: flex; flex-direction: column; gap: 0; }
    .form-field-full { width: 100%; }
    .form-field-half { width: 50%; }

    .material-option {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
    }
    .material-option-desc {
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
    }

    .eindeckung-ergebnis {
      background: var(--mat-sys-surface-variant);
      border-radius: 8px;
      padding: 12px;
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
    }

    .ergebnis-zeile {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      &--haupt { font-weight: 500; }
    }

    .ergebnis-wert {
      font-variant-numeric: tabular-nums;
      font-weight: 600;
      color: var(--mat-sys-primary);
    }

    .ergebnis-hinweis {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 2px;
      mat-icon { font-size: 14px; width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }
    }
  `],
})
export class EindeckungEingabeComponent {
  readonly calculator = inject(CalculatorService);
  private fb = inject(FormBuilder);

  readonly materialien = MATERIALIEN;

  form = this.fb.group({
    material:       ['falzziegel'],
    zuschlagProzent:[10],
  });

  constructor() {
    this.form.valueChanges.subscribe(v => {
      this.calculator.setEindeckungConfig({
        material: (v.material ?? 'falzziegel') as EindeckungMaterial,
        zuschlagProzent: v.zuschlagProzent ?? 10,
      });
    });
  }
}
