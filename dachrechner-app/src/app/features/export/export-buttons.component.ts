import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PdfExportService } from './pdf-export.service';
import { ExcelExportService } from './excel-export.service';

@Component({
  selector: 'app-export-buttons',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  template: `
    <form [formGroup]="form" class="export-form">
      <div class="export-inputs">
        <mat-form-field appearance="outline" class="export-field">
          <mat-label>Firmenname (optional)</mat-label>
          <input matInput formControlName="firmenname" placeholder="Zimmerei Muster GmbH" />
          <mat-icon matSuffix>business</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline" class="export-field">
          <mat-label>Projektname (optional)</mat-label>
          <input matInput formControlName="projektname" placeholder="Einfamilienhaus Muster" />
          <mat-icon matSuffix>folder</mat-icon>
        </mat-form-field>
      </div>

      <div class="export-buttons">
        <button mat-flat-button color="primary" (click)="exportPdf()" class="export-btn"
                matTooltip="Vollständige Berechnung als PDF herunterladen">
          <mat-icon>picture_as_pdf</mat-icon>
          PDF exportieren
        </button>
        <button mat-stroked-button color="primary" (click)="exportExcel()" class="export-btn"
                matTooltip="Alle Werte als Excel-Datei herunterladen">
          <mat-icon>table_chart</mat-icon>
          Excel exportieren
        </button>
      </div>
    </form>
  `,
  styles: [`
    .export-form { display: flex; flex-direction: column; gap: 12px; }

    .export-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
    }

    .export-field { width: 100%; }

    .export-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .export-btn {
      flex: 1;
      min-width: 160px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  `],
})
export class ExportButtonsComponent {
  private pdf   = inject(PdfExportService);
  private excel = inject(ExcelExportService);
  private fb    = inject(FormBuilder);

  form = this.fb.group({
    firmenname:  [''],
    projektname: [''],
  });

  exportPdf(): void {
    const { firmenname, projektname } = this.form.value;
    this.pdf.exportieren(firmenname ?? '', projektname ?? '');
  }

  exportExcel(): void {
    const { firmenname, projektname } = this.form.value;
    this.excel.exportieren(firmenname ?? '', projektname ?? '');
  }
}
