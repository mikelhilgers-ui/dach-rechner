import { Component, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalculatorService } from '../../../core/calculator/calculator.service';

@Component({
  selector: 'app-masse-eingabe',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <form [formGroup]="form" class="masse-form">
      <div class="form-row">
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Trauflänge (m)</mat-label>
          <input matInput type="number" formControlName="trauflaenge" min="1" step="0.1" />
          <mat-icon matSuffix matTooltip="Länge der unteren Dachkante (Traufe)">info_outline</mat-icon>
          @if (form.get('trauflaenge')?.invalid && form.get('trauflaenge')?.touched) {
            <mat-error>Bitte gültige Trauflänge eingeben (min. 1 m)</mat-error>
          }
        </mat-form-field>

        @if (calculator.dachform() !== 'flach') {
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>{{ firstLabel }}</mat-label>
            <input matInput type="number" formControlName="firstlaenge" min="1" step="0.1" />
            <mat-icon matSuffix [matTooltip]="firstTooltip">info_outline</mat-icon>
          </mat-form-field>
        } @else {
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Gebäudetiefe (m)</mat-label>
            <input matInput type="number" formControlName="firstlaenge" min="1" step="0.1" />
          </mat-form-field>
        }
      </div>

      @if (calculator.dachform() !== 'flach') {
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Dachneigung (°)</mat-label>
            <input matInput type="number" formControlName="dachneigung" min="5" max="75" step="1" />
            <mat-icon matSuffix matTooltip="Neigungswinkel in Grad (z.B. 35°)">info_outline</mat-icon>
            @if (form.get('dachneigung')?.invalid && form.get('dachneigung')?.touched) {
              <mat-error>Bitte Winkel zwischen 5° und 75° eingeben</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Dachüberstand (m)</mat-label>
            <input matInput type="number" formControlName="dachueberstand" min="0" max="2" step="0.05" />
            <mat-icon matSuffix matTooltip="Überstand über die Außenwand (Traufkasten)">info_outline</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Sparrenabstand (m)</mat-label>
            <input matInput type="number" formControlName="sparrenAbstand" min="0.4" max="1.5" step="0.05" />
            <mat-icon matSuffix matTooltip="Achsmaß zwischen den Sparren (z.B. 0.80 m)">info_outline</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Lattenabstand (m)</mat-label>
            <input matInput type="number" formControlName="lattenAbstand" min="0.1" max="0.5" step="0.01" />
            <mat-icon matSuffix matTooltip="Lattenabstand je nach Eindeckung (z.B. 0.32 m)">info_outline</mat-icon>
          </mat-form-field>
        </div>
      }
    </form>
  `,
  styles: [`
    .masse-form {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0 16px;

      @media (min-width: 600px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-field {
      width: 100%;
    }
  `],
})
export class MasseEingabeComponent {
  readonly calculator = inject(CalculatorService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    trauflaenge:    [this.calculator.masse().trauflaenge,    [Validators.required, Validators.min(1)]],
    firstlaenge:    [this.calculator.masse().firstlaenge,    [Validators.required, Validators.min(1)]],
    dachneigung:    [this.calculator.masse().dachneigung,    [Validators.required, Validators.min(5), Validators.max(75)]],
    dachueberstand: [this.calculator.masse().dachueberstand, [Validators.required, Validators.min(0)]],
    sparrenAbstand: [this.calculator.masse().sparrenAbstand, [Validators.required, Validators.min(0.4)]],
    lattenAbstand:  [this.calculator.masse().lattenAbstand,  [Validators.required, Validators.min(0.1)]],
  });

  get firstLabel(): string {
    return this.calculator.dachform() === 'pult' ? 'Gebäudetiefe (m)' : 'Firstlänge (m)';
  }

  get firstTooltip(): string {
    return this.calculator.dachform() === 'pult'
      ? 'Tiefe des Gebäudes (Sparrenrichtung)'
      : 'Länge des Firstes (oben)';
  }

  constructor() {
    // Formular-Änderungen → Service
    this.form.valueChanges.subscribe(v => {
      if (this.form.valid) {
        this.calculator.setMasse({
          trauflaenge:    v.trauflaenge ?? this.calculator.masse().trauflaenge,
          firstlaenge:    v.firstlaenge ?? this.calculator.masse().firstlaenge,
          dachneigung:    v.dachneigung ?? this.calculator.masse().dachneigung,
          dachueberstand: v.dachueberstand ?? this.calculator.masse().dachueberstand,
          sparrenAbstand: v.sparrenAbstand ?? this.calculator.masse().sparrenAbstand,
          lattenAbstand:  v.lattenAbstand ?? this.calculator.masse().lattenAbstand,
        });
      }
    });
  }
}
