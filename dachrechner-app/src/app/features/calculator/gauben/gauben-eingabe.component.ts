import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DecimalPipe } from '@angular/common';
import { CalculatorService } from '../../../core/calculator/calculator.service';
import { GaubeConfig } from '../../../core/calculator/calculator.models';

@Component({
  selector: 'app-gauben-eingabe',
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  template: `
    <!-- Bestehende Gauben / Dachfenster -->
    @if (calculator.gauben().length > 0) {
      <div class="gauben-liste">
        @for (gaube of calculator.gauben(); track gaube.id) {
          <div class="gaube-item">
            <mat-icon class="gaube-typ-icon">
              {{ gaube.typ === 'gaube' ? 'house' : 'crop_square' }}
            </mat-icon>
            <div class="gaube-info">
              <span class="gaube-titel">
                {{ gaube.typ === 'gaube' ? 'Gaube' : 'Dachfenster' }}
                {{ gaube.bezeichnung ? ' – ' + gaube.bezeichnung : '' }}
              </span>
              <span class="gaube-masse">
                {{ gaube.breite }} × {{ gaube.hoehe }} m
                @if (gaube.anzahl > 1) { · {{ gaube.anzahl }}× }
                <span class="gaube-flaeche">
                  ({{ gaube.breite * gaube.hoehe * gaube.anzahl | number:'1.1-2' }} m² Abzug)
                </span>
              </span>
            </div>
            <button
              mat-icon-button
              color="warn"
              (click)="remove(gaube.id)"
              matTooltip="Entfernen"
              aria-label="Gaube entfernen"
            >
              <mat-icon>delete_outline</mat-icon>
            </button>
          </div>
        }
      </div>
    } @else {
      <p class="keine-gauben">Noch keine Gauben oder Dachfenster eingetragen.</p>
    }

    <!-- Formular neue Gaube -->
    @if (formSichtbar) {
      <form [formGroup]="form" (ngSubmit)="hinzufuegen()" class="gaube-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field form-field--typ">
            <mat-label>Typ</mat-label>
            <mat-select formControlName="typ">
              <mat-option value="gaube">Gaube</mat-option>
              <mat-option value="dachfenster">Dachfenster</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Bezeichnung (optional)</mat-label>
            <input matInput formControlName="bezeichnung" placeholder="z.B. Schlafzimmer" />
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Breite (m)</mat-label>
            <input matInput type="number" formControlName="breite" min="0.1" step="0.05" />
            @if (form.get('breite')?.invalid && form.get('breite')?.touched) {
              <mat-error>Min. 0.1 m</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Höhe (m)</mat-label>
            <input matInput type="number" formControlName="hoehe" min="0.1" step="0.05" />
            @if (form.get('hoehe')?.invalid && form.get('hoehe')?.touched) {
              <mat-error>Min. 0.1 m</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field form-field--anzahl">
            <mat-label>Anzahl</mat-label>
            <input matInput type="number" formControlName="anzahl" min="1" step="1" />
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button mat-stroked-button type="button" (click)="formAusblenden()">
            Abbrechen
          </button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
            <mat-icon>add</mat-icon>
            Hinzufügen
          </button>
        </div>
      </form>
    } @else {
      <button mat-stroked-button color="primary" (click)="formAnzeigen()" class="add-btn">
        <mat-icon>add</mat-icon>
        Gaube / Dachfenster hinzufügen
      </button>
    }
  `,
  styles: [`
    .gauben-liste {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 12px;
    }

    .gaube-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
      border-radius: 8px;
      background: var(--mat-sys-surface-variant);
    }

    .gaube-typ-icon {
      color: var(--mat-sys-primary);
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .gaube-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .gaube-titel {
      font-size: 14px;
      font-weight: 500;
    }

    .gaube-masse {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .gaube-flaeche {
      font-style: italic;
    }

    .keine-gauben {
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
      margin: 0 0 12px;
    }

    .gaube-form {
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 8px;
      padding: 16px;
      margin-top: 4px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;

      @media (min-width: 600px) {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }

    .form-field {
      width: 100%;

      &--typ { grid-column: 1; }
      &--anzahl { grid-column: 1 / -1; @media (min-width: 600px) { grid-column: auto; } }
    }

    .form-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 4px;
    }

    .add-btn {
      width: 100%;
    }
  `],
})
export class GaubenEingabeComponent {
  readonly calculator = inject(CalculatorService);
  private fb = inject(FormBuilder);

  formSichtbar = false;

  form = this.fb.group({
    typ:         ['gaube'],
    bezeichnung: [''],
    breite:      [1.2, [Validators.required, Validators.min(0.1)]],
    hoehe:       [1.4, [Validators.required, Validators.min(0.1)]],
    anzahl:      [1,   [Validators.required, Validators.min(1)]],
  });

  formAnzeigen(): void {
    this.formSichtbar = true;
  }

  formAusblenden(): void {
    this.formSichtbar = false;
    this.form.reset({ typ: 'gaube', bezeichnung: '', breite: 1.2, hoehe: 1.4, anzahl: 1 });
  }

  hinzufuegen(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.calculator.addGaube({
      typ: (v.typ ?? 'gaube') as GaubeConfig['typ'],
      bezeichnung: v.bezeichnung ?? undefined,
      breite: v.breite!,
      hoehe: v.hoehe!,
      anzahl: v.anzahl!,
    });
    this.formAusblenden();
  }

  remove(id: string): void {
    this.calculator.removeGaube(id);
  }
}
