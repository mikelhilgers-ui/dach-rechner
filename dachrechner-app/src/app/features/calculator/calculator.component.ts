import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DachformAuswahlComponent } from './dachform/dachform-auswahl.component';
import { MasseEingabeComponent } from './masse/masse-eingabe.component';
import { ErgebnisPanelComponent } from './results/ergebnis-panel.component';

@Component({
  selector: 'app-calculator',
  imports: [
    MatCardModule,
    DachformAuswahlComponent,
    MasseEingabeComponent,
    ErgebnisPanelComponent,
  ],
  template: `
    <div class="calculator-layout">
      <!-- Linke Spalte: Eingabe -->
      <div class="calculator-eingabe">
        <mat-card class="eingabe-card">
          <mat-card-header>
            <mat-card-title>Dachform</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-dachform-auswahl />
          </mat-card-content>
        </mat-card>

        <mat-card class="eingabe-card">
          <mat-card-header>
            <mat-card-title>Maße</mat-card-title>
            <mat-card-subtitle>Alle Angaben in Metern</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <app-masse-eingabe />
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Rechte Spalte: Ergebnis -->
      <div class="calculator-ergebnis">
        <app-ergebnis-panel />
      </div>
    </div>
  `,
  styles: [`
    .calculator-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      align-items: start;

      @media (min-width: 960px) {
        grid-template-columns: 1fr 320px;
      }

      @media (min-width: 1280px) {
        grid-template-columns: 1fr 360px;
      }
    }

    .calculator-eingabe {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .eingabe-card {
      border-radius: var(--card-radius) !important;
    }
  `],
})
export class CalculatorComponent {}
