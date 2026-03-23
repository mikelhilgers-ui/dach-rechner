import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DecimalPipe } from '@angular/common';
import { CalculatorService } from '../../../core/calculator/calculator.service';

const HOLZARTEN = [
  { value: 480, label: 'Fichte (480 kg/m³)' },
  { value: 520, label: 'Kiefer (520 kg/m³)' },
  { value: 590, label: 'Lärche (590 kg/m³)' },
  { value: 700, label: 'Eiche (700 kg/m³)' },
];

const SPARREN_QUERSCHNITTE = [
  '6/16', '8/18', '10/20', '12/22', '14/22', '16/24',
];
const LATTEN_QUERSCHNITTE = ['3/5', '4/5', '4/6', '5/6'];
const KONTER_QUERSCHNITTE = ['4/6', '5/6', '6/8', '6/10'];

@Component({
  selector: 'app-holz-eingabe',
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <form [formGroup]="form" class="holz-form">

      <div class="form-row">
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Sparren-Querschnitt</mat-label>
          <mat-select formControlName="sparreQuerschnitt">
            @for (q of sparrenQuerschnitte; track q) {
              <mat-option [value]="q">{{ q }} cm</mat-option>
            }
            <mat-option value="custom">Benutzerdefiniert</mat-option>
          </mat-select>
        </mat-form-field>

        @if (form.get('sparreQuerschnitt')?.value === 'custom') {
          <mat-form-field appearance="outline" class="form-field form-field--half">
            <mat-label>Breite (cm)</mat-label>
            <input matInput type="number" formControlName="sparreBreite" min="4" max="30" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="form-field form-field--half">
            <mat-label>Höhe (cm)</mat-label>
            <input matInput type="number" formControlName="sparreHoehe" min="8" max="40" />
          </mat-form-field>
        }

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Dachlatte-Querschnitt</mat-label>
          <mat-select formControlName="latteQuerschnitt">
            @for (q of lattenQuerschnitte; track q) {
              <mat-option [value]="q">{{ q }} cm</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Holzart</mat-label>
          <mat-select formControlName="holzartDichte">
            @for (h of holzarten; track h.value) {
              <mat-option [value]="h.value">{{ h.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <div class="toggle-row">
        <mat-slide-toggle formControlName="konterlatteAktiv" color="primary">
          Konterlatte
        </mat-slide-toggle>
        <mat-icon
          matTooltip="Konterlatte wird bei hinterlüfteter Eindeckung (Unterdeckbahn) benötigt"
          class="toggle-info"
        >info_outline</mat-icon>
      </div>

      @if (form.get('konterlatteAktiv')?.value) {
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Konterlatte-Querschnitt</mat-label>
            <mat-select formControlName="konterlatteQuerschnitt">
              @for (q of konterQuerschnitte; track q) {
                <mat-option [value]="q">{{ q }} cm</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      }

      <!-- Vorschau Holzmenge -->
      @if (calculator.holzErgebnis().positionen.length > 0) {
        <div class="holz-vorschau">
          @for (pos of calculator.holzErgebnis().positionen; track pos.bezeichnung) {
            <div class="vorschau-zeile">
              <span class="vorschau-bez">{{ pos.bezeichnung }}</span>
              <span class="vorschau-werte">
                {{ pos.lfdm | number:'1.0-1' }} lfm ·
                {{ pos.m3 | number:'1.2-2' }} m³ ·
                ~{{ pos.gewichtKg | number:'1.0-0' }} kg
              </span>
            </div>
          }
          <div class="vorschau-gesamt">
            <span>Gesamt</span>
            <span>
              {{ calculator.holzErgebnis().gesamtM3 | number:'1.2-2' }} m³ ·
              ~{{ calculator.holzErgebnis().gesamtKg | number:'1.0-0' }} kg
            </span>
          </div>
        </div>
      }
    </form>
  `,
  styles: [`
    .holz-form { display: flex; flex-direction: column; gap: 0; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
      @media (min-width: 600px) { grid-template-columns: 1fr 1fr; }
    }

    .form-field { width: 100%; }
    .form-field--half { }

    .toggle-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0 12px;
    }

    .toggle-info {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--mat-sys-on-surface-variant);
      cursor: help;
    }

    .holz-vorschau {
      background: var(--mat-sys-surface-variant);
      border-radius: 8px;
      padding: 12px;
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
    }

    .vorschau-zeile {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }

    .vorschau-bez { font-weight: 500; }

    .vorschau-werte {
      color: var(--mat-sys-on-surface-variant);
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    .vorschau-gesamt {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-weight: 600;
      border-top: 1px solid var(--mat-sys-outline-variant);
      padding-top: 6px;
      margin-top: 2px;
    }
  `],
})
export class HolzEingabeComponent {
  readonly calculator = inject(CalculatorService);
  private fb = inject(FormBuilder);

  readonly holzarten = HOLZARTEN;
  readonly sparrenQuerschnitte = SPARREN_QUERSCHNITTE;
  readonly lattenQuerschnitte = LATTEN_QUERSCHNITTE;
  readonly konterQuerschnitte = KONTER_QUERSCHNITTE;

  private parseQuerschnitt(qs: string): [number, number] {
    const [b, h] = qs.split('/').map(Number);
    return [b, h];
  }

  form = this.fb.group({
    sparreQuerschnitt:    ['8/18'],
    sparreBreite:         [8],
    sparreHoehe:          [18],
    latteQuerschnitt:     ['4/5'],
    konterlatteAktiv:     [false],
    konterlatteQuerschnitt: ['4/6'],
    holzartDichte:        [480],
  });

  constructor() {
    this.form.valueChanges.subscribe(v => {
      const [sb, sh] = v.sparreQuerschnitt !== 'custom'
        ? this.parseQuerschnitt(v.sparreQuerschnitt ?? '8/18')
        : [v.sparreBreite ?? 8, v.sparreHoehe ?? 18];

      const [lb, lh] = this.parseQuerschnitt(v.latteQuerschnitt ?? '4/5');
      const [kb, kh] = this.parseQuerschnitt(v.konterlatteQuerschnitt ?? '4/6');

      this.calculator.setHolzConfig({
        sparreBreite: sb, sparreHoehe: sh,
        latteBreite: lb, latteHoehe: lh,
        konterlatteAktiv: v.konterlatteAktiv ?? false,
        konterlatteBreite: kb, konterlatteHoehe: kh,
        holzartDichte: v.holzartDichte ?? 480,
      });
    });
  }
}
