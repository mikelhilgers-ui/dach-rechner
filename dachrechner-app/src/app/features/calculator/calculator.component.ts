import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DachformAuswahlComponent } from './dachform/dachform-auswahl.component';
import { MasseEingabeComponent } from './masse/masse-eingabe.component';
import { GaubenEingabeComponent } from './gauben/gauben-eingabe.component';
import { VerbindungsmittelComponent } from './verbindungsmittel/verbindungsmittel.component';
import { ErgebnisPanelComponent } from './results/ergebnis-panel.component';

@Component({
  selector: 'app-calculator',
  imports: [
    MatCardModule,
    MatIconModule,
    DachformAuswahlComponent,
    MasseEingabeComponent,
    GaubenEingabeComponent,
    VerbindungsmittelComponent,
    ErgebnisPanelComponent,
  ],
  template: `
    <div class="calculator-layout">
      <!-- Linke Spalte: Eingabe -->
      <div class="calculator-eingabe">

        <mat-card class="eingabe-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>roofing</mat-icon>
            <mat-card-title>Dachform</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-dachform-auswahl />
          </mat-card-content>
        </mat-card>

        <mat-card class="eingabe-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>straighten</mat-icon>
            <mat-card-title>Maße</mat-card-title>
            <mat-card-subtitle>Alle Angaben in Metern</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <app-masse-eingabe />
          </mat-card-content>
        </mat-card>

        <mat-card class="eingabe-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>house</mat-icon>
            <mat-card-title>Gauben & Dachfenster</mat-card-title>
            <mat-card-subtitle>Werden von der Dachfläche abgezogen</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <app-gauben-eingabe />
          </mat-card-content>
        </mat-card>

        <mat-card class="eingabe-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>hardware</mat-icon>
            <mat-card-title>Verbindungsmittel</mat-card-title>
            <mat-card-subtitle>Automatisch berechnet</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <app-verbindungsmittel />
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
