import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { DecimalPipe } from '@angular/common';
import { CalculatorService } from '../../../core/calculator/calculator.service';

@Component({
  selector: 'app-dachaufbau-eingabe',
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  template: `
    <form [formGroup]="form" class="aufbau-form">

      <!-- Unterdeckbahn -->
      <div class="aufbau-block">
        <div class="toggle-row">
          <mat-slide-toggle formControlName="unterdeckbahnAktiv" color="primary">
            Unterdeckbahn
          </mat-slide-toggle>
          <mat-icon
            matTooltip="Diffusionsoffene Unterdeckbahn unter der Lattung. Pflicht bei hinterlüfteter Eindeckung."
            class="info-icon">info_outline</mat-icon>
        </div>
        @if (form.get('unterdeckbahnAktiv')?.value) {
          @if (calculator.dachaufbauErgebnis().unterdeckbahn; as ub) {
            <div class="aufbau-ergebnis">
              <span>Bedarf inkl. 15 % Überlappung</span>
              <span class="ergebnis-wert">{{ ub.flaecheBrutto | number:'1.1-1' }} m²</span>
              <span>Rollen à 50 m²</span>
              <span class="ergebnis-wert">{{ ub.rollen }} Rollen</span>
            </div>
          }
        }
      </div>

      <mat-divider />

      <!-- Dampfbremse -->
      <div class="aufbau-block">
        <div class="toggle-row">
          <mat-slide-toggle formControlName="dampfbremseAktiv" color="primary">
            Dampfbremse / Dampfsperre
          </mat-slide-toggle>
          <mat-icon
            matTooltip="Innen (unterseitig) auf der Dämmung. Verhindert Tauwasser im Dämmpaket."
            class="info-icon">info_outline</mat-icon>
        </div>
        @if (form.get('dampfbremseAktiv')?.value) {
          @if (calculator.dachaufbauErgebnis().dampfbremse; as db) {
            <div class="aufbau-ergebnis">
              <span>Bedarf inkl. 10 % Überlappung</span>
              <span class="ergebnis-wert">{{ db.flaecheM2 | number:'1.1-1' }} m²</span>
            </div>
          }
        }
      </div>

      <mat-divider />

      <!-- Dämmung -->
      <div class="aufbau-block">
        <div class="toggle-row">
          <mat-slide-toggle formControlName="daemmungAktiv" color="primary">
            Zwischensparren-Dämmung
          </mat-slide-toggle>
          <mat-icon
            matTooltip="Dämmung zwischen den Sparren. Stärke max. = Sparrenhöhe − 2 cm Hinterlüftung."
            class="info-icon">info_outline</mat-icon>
        </div>

        @if (form.get('daemmungAktiv')?.value) {
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Dämmstoff</mat-label>
              <mat-select formControlName="daemmungTyp">
                <mat-option value="mineralwolle">Mineralwolle (λ 0.035)</mat-option>
                <mat-option value="holzfaser">Holzfaser (λ 0.040)</mat-option>
                <mat-option value="pur">PUR/PIR (λ 0.024)</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Stärke (cm)</mat-label>
              <mat-select formControlName="daemmungStaerkeCm">
                @for (s of daemmStaerken; track s) {
                  <mat-option [value]="s">{{ s }} cm</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>

          @if (calculator.dachaufbauErgebnis().daemmung; as d) {
            <div class="aufbau-ergebnis">
              <span>{{ d.bezeichnung }}</span>
              <span class="ergebnis-wert">{{ d.flaecheM2 | number:'1.1-1' }} m²</span>
              <span>Volumen</span>
              <span class="ergebnis-wert">{{ d.volumenM3 | number:'1.2-2' }} m³</span>
            </div>
          }
        }
      </div>

    </form>
  `,
  styles: [`
    .aufbau-form { display: flex; flex-direction: column; gap: 0; }

    .aufbau-block {
      padding: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toggle-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .info-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--mat-sys-on-surface-variant);
      cursor: help;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
    }

    .form-field { width: 100%; }

    .aufbau-ergebnis {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 4px 16px;
      background: var(--mat-sys-surface-variant);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      align-items: center;
    }

    .ergebnis-wert {
      font-weight: 600;
      color: var(--mat-sys-primary);
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
  `],
})
export class DachaufbauEingabeComponent {
  readonly calculator = inject(CalculatorService);
  private fb = inject(FormBuilder);

  readonly daemmStaerken = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

  form = this.fb.group({
    unterdeckbahnAktiv:  [true],
    daemmungAktiv:       [false],
    daemmungTyp:         ['mineralwolle'],
    daemmungStaerkeCm:   [18],
    dampfbremseAktiv:    [false],
  });

  constructor() {
    this.form.valueChanges.subscribe(v => {
      this.calculator.setDachaufbauConfig({
        unterdeckbahnAktiv:    v.unterdeckbahnAktiv ?? true,
        unterdeckbahnUeberlappM: 0.1,
        daemmungAktiv:         v.daemmungAktiv ?? false,
        daemmungStaerkeCm:     v.daemmungStaerkeCm ?? 18,
        daemmungTyp:           (v.daemmungTyp ?? 'mineralwolle') as 'mineralwolle' | 'holzfaser' | 'pur',
        dampfbremseAktiv:      v.dampfbremseAktiv ?? false,
      });
    });
  }
}
