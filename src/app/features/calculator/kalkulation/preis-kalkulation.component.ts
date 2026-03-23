import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { DecimalPipe } from '@angular/common';
import { CalculatorService } from '../../../core/calculator/calculator.service';

interface PreisZeile {
  label: string;
  field: string;
  einheit: string;
  tooltip: string;
  min: number;
  step: number;
}

@Component({
  selector: 'app-preis-kalkulation',
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  template: `
    <form [formGroup]="form" class="preis-form">

      <div class="preis-inputs">
        @for (zeile of preisZeilen; track zeile.field) {
          <mat-form-field appearance="outline" class="preis-field">
            <mat-label>{{ zeile.label }}</mat-label>
            <input matInput type="number" [formControlName]="zeile.field"
                   [min]="zeile.min" [step]="zeile.step" />
            <span matTextSuffix>{{ zeile.einheit }}</span>
            <mat-icon matSuffix [matTooltip]="zeile.tooltip" class="info-icon">info_outline</mat-icon>
          </mat-form-field>
        }
      </div>

      <mat-divider />

      <!-- Ergebnistabelle -->
      @if (calculator.preisErgebnis().positionen.length > 0) {
        <div class="preis-tabelle">

          @for (pos of calculator.preisErgebnis().positionen; track pos.bezeichnung) {
            <div class="preis-zeile">
              <span class="pz-bez">{{ pos.bezeichnung }}</span>
              <span class="pz-menge">{{ pos.menge | number:'1.1-2' }} {{ pos.einheit }}</span>
              <span class="pz-preis">{{ pos.preisProEinheit | number:'1.0-0' }} €/{{ pos.einheit }}</span>
              <span class="pz-gesamt">{{ pos.gesamt | number:'1.0-0' }} €</span>
            </div>
          }

          <div class="preis-zeile preis-zeile--arbeit">
            <span class="pz-bez">Arbeitskosten</span>
            <span class="pz-menge">{{ calculator.ergebnis().dachflaeche | number:'1.1-1' }} m²</span>
            <span class="pz-preis">{{ form.get('arbeitskostenProM2')?.value }} €/m²</span>
            <span class="pz-gesamt">{{ calculator.preisErgebnis().arbeitskosten | number:'1.0-0' }} €</span>
          </div>

          <div class="preis-trennlinie"></div>

          <div class="preis-zeile preis-zeile--sub">
            <span class="pz-bez">Zwischensumme</span>
            <span></span><span></span>
            <span class="pz-gesamt">{{ calculator.preisErgebnis().subtotal | number:'1.0-0' }} €</span>
          </div>

          <div class="preis-zeile">
            <span class="pz-bez">Aufschlag ({{ form.get('aufschlagProzent')?.value }} %)</span>
            <span></span><span></span>
            <span class="pz-gesamt">{{ calculator.preisErgebnis().aufschlag | number:'1.0-0' }} €</span>
          </div>

          <div class="preis-trennlinie"></div>

          <div class="preis-zeile preis-zeile--netto">
            <span class="pz-bez">Gesamt netto</span>
            <span></span><span></span>
            <span class="pz-gesamt">{{ calculator.preisErgebnis().gesamtNetto | number:'1.0-0' }} €</span>
          </div>

          <div class="preis-zeile">
            <span class="pz-bez">MwSt. ({{ calculator.preisErgebnis().mwstSatz }} %)</span>
            <span></span><span></span>
            <span class="pz-gesamt">
              {{ calculator.preisErgebnis().gesamtBrutto - calculator.preisErgebnis().gesamtNetto | number:'1.0-0' }} €
            </span>
          </div>

          <div class="preis-zeile preis-zeile--brutto">
            <span class="pz-bez">Gesamt brutto</span>
            <span></span><span></span>
            <span class="pz-gesamt">{{ calculator.preisErgebnis().gesamtBrutto | number:'1.0-0' }} €</span>
          </div>

        </div>

        <p class="preis-hinweis">
          <mat-icon>info_outline</mat-icon>
          Richtwerte für Österreich. Preise je nach Region und Saison anpassen.
        </p>
      } @else {
        <p class="preis-leer">Bitte zuerst Dachmaße eingeben.</p>
      }

    </form>
  `,
  styles: [`
    .preis-form { display: flex; flex-direction: column; gap: 16px; }

    .preis-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
      @media (min-width: 960px) { grid-template-columns: 1fr 1fr 1fr; }
    }

    .preis-field { width: 100%; }
    .info-icon { font-size: 16px; width: 16px; height: 16px; color: var(--mat-sys-on-surface-variant); }

    .preis-tabelle {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      font-size: 13px;
      gap: 0;
    }

    .preis-zeile {
      display: contents;
      > span {
        padding: 7px 4px;
        border-bottom: 1px solid var(--mat-sys-surface-variant);
        display: flex;
        align-items: center;
      }
      &--arbeit > span { color: var(--mat-sys-on-surface-variant); }
      &--sub > span { font-weight: 500; }
      &--netto > span { font-weight: 600; border-top: 2px solid var(--mat-sys-outline-variant); }
      &--brutto > span {
        font-weight: 700;
        font-size: 15px;
        color: var(--mat-sys-primary);
        border-top: 2px solid var(--mat-sys-primary);
        border-bottom: none;
      }
    }

    .pz-menge, .pz-preis, .pz-gesamt {
      justify-content: flex-end;
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .preis-trennlinie {
      grid-column: 1 / -1;
      height: 4px;
    }

    .preis-hinweis {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }

    .preis-leer {
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
    }
  `],
})
export class PreisKalkulationComponent {
  readonly calculator = inject(CalculatorService);
  private fb = inject(FormBuilder);

  readonly preisZeilen: PreisZeile[] = [
    { label: 'Holz',           field: 'holzPreisProM3',             einheit: '€/m³',  tooltip: 'Fichte KVH ca. 400–550 €/m³', min: 0, step: 10 },
    { label: 'Eindeckung',     field: 'eindeckungPreisProM2',       einheit: '€/m²',  tooltip: 'Ziegel ca. 30–60 €/m², Schiefer 80–150 €/m²', min: 0, step: 5 },
    { label: 'Unterdeckbahn',  field: 'unterdeckbahnPreisProM2',    einheit: '€/m²',  tooltip: 'Diffusionsoffene Bahn ca. 1.50–3 €/m²', min: 0, step: 0.5 },
    { label: 'Dämmung',        field: 'daemmungPreisProM2',         einheit: '€/m²',  tooltip: 'Mineralwolle 18 cm ca. 12–25 €/m²', min: 0, step: 1 },
    { label: 'Dampfbremse',    field: 'dampfbremsePreisProM2',      einheit: '€/m²',  tooltip: 'Dampfbremsfolie ca. 1.50–4 €/m²', min: 0, step: 0.5 },
    { label: 'Verbindungsm.',  field: 'verbindungsmittelPreisProKg',einheit: '€/kg',  tooltip: 'Nägel/Schrauben ca. 3–6 €/kg', min: 0, step: 0.5 },
    { label: 'Arbeitskosten',  field: 'arbeitskostenProM2',         einheit: '€/m²',  tooltip: 'Lohnkosten ca. 25–50 €/m² Dachfläche', min: 0, step: 5 },
    { label: 'Aufschlag',      field: 'aufschlagProzent',           einheit: '%',     tooltip: 'Gewinn + Overhead, typisch 10–20 %', min: 0, step: 1 },
  ];

  form = this.fb.group({
    holzPreisProM3:              [450],
    eindeckungPreisProM2:        [40],
    unterdeckbahnPreisProM2:     [2],
    daemmungPreisProM2:          [18],
    dampfbremsePreisProM2:       [2],
    verbindungsmittelPreisProKg: [4],
    arbeitskostenProM2:          [35],
    aufschlagProzent:            [15],
  });

  constructor() {
    this.form.valueChanges.subscribe(v => {
      this.calculator.setPreisConfig({
        holzPreisProM3:              v.holzPreisProM3              ?? 450,
        eindeckungPreisProM2:        v.eindeckungPreisProM2        ?? 40,
        unterdeckbahnPreisProM2:     v.unterdeckbahnPreisProM2     ?? 2,
        daemmungPreisProM2:          v.daemmungPreisProM2          ?? 18,
        dampfbremsePreisProM2:       v.dampfbremsePreisProM2       ?? 2,
        verbindungsmittelPreisProKg: v.verbindungsmittelPreisProKg ?? 4,
        arbeitskostenProM2:          v.arbeitskostenProM2          ?? 35,
        aufschlagProzent:            v.aufschlagProzent            ?? 15,
      });
    });
  }
}
