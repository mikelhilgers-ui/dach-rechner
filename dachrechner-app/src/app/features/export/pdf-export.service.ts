import { Injectable, inject } from '@angular/core';
import jsPDF from 'jspdf';
import { CalculatorService } from '../../core/calculator/calculator.service';

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  private calc = inject(CalculatorService);

  exportieren(firmenname = '', projektname = ''): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;
    const margin = 15;
    const contentW = W - margin * 2;
    let y = margin;

    const dachformLabels: Record<string, string> = {
      sattel: 'Satteldach', pult: 'Pultdach', walm: 'Walmdach', flach: 'Flachdach',
    };

    // --- Farben ---
    type RGB = [number, number, number];
    const PRIMARY: RGB = [30, 115, 190];
    const DARK:    RGB = [30, 30, 30];
    const GREY:    RGB = [100, 100, 100];
    const LIGHT:   RGB = [245, 247, 250];
    const WHITE:   RGB = [255, 255, 255];

    // --- Hilfsfunktionen ---
    const setFont = (size: number, style: 'normal' | 'bold' = 'normal', color: RGB = DARK) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.setTextColor(...color);
    };

    const line = (x1: number, y1: number, x2: number, y2: number, color: RGB = GREY, lw = 0.3) => {
      doc.setDrawColor(...color);
      doc.setLineWidth(lw);
      doc.line(x1, y1, x2, y2);
    };

    const fillRect = (x: number, ry: number, w: number, h: number, color: RGB) => {
      doc.setFillColor(...color);
      doc.rect(x, ry, w, h, 'F');
    };

    const fmt = (n: number, dec = 1) => n.toLocaleString('de-AT', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const fmtEuro = (n: number) => n.toLocaleString('de-AT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';

    // --- Header ---
    fillRect(0, 0, W, 28, PRIMARY);
    setFont(18, 'bold', WHITE);
    doc.text('DachRechner', margin, 12);
    setFont(9, 'normal', [200, 220, 240]);
    doc.text('Dachflächen-Rechner für Zimmerer  ·  dachrechner.at', margin, 18);

    if (firmenname) {
      setFont(10, 'bold', WHITE);
      doc.text(firmenname, W - margin, 12, { align: 'right' });
    }

    const datum = new Date().toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    setFont(8, 'normal', [200, 220, 240]);
    doc.text(`Erstellt: ${datum}`, W - margin, 18, { align: 'right' });

    y = 35;

    // Projekttitel
    if (projektname) {
      setFont(13, 'bold');
      doc.text(projektname, margin, y);
      y += 7;
    }

    setFont(11, 'bold');
    doc.text(`${dachformLabels[this.calc.dachform()] ?? ''} · Berechnung`, margin, y);
    y += 3;
    line(margin, y, W - margin, y, PRIMARY, 0.5);
    y += 6;

    // --- Abschnitt rendern ---
    const sectionHeader = (titel: string) => {
      fillRect(margin, y, contentW, 7, LIGHT);
      setFont(9, 'bold', PRIMARY);
      doc.text(titel.toUpperCase(), margin + 2, y + 5);
      y += 9;
    };

    const twoCol = (label: string, value: string) => {
      setFont(9, 'normal', GREY);
      doc.text(label, margin + 2, y);
      setFont(9, 'bold', DARK);
      doc.text(value, W - margin, y, { align: 'right' });
      y += 5.5;
    };

    const tableRow = (cols: string[], widths: number[], bold = false, bgColor?: RGB) => {
      if (bgColor) fillRect(margin, y - 4, contentW, 5.5, bgColor);
      let x = margin + 2;
      setFont(9, bold ? 'bold' : 'normal', DARK);
      cols.forEach((col, i) => {
        const align = i > 0 ? 'right' : 'left';
        const colX = i === 0 ? x : margin + widths.slice(0, i + 1).reduce((a, b) => a + b, 0) - 2;
        doc.text(col, colX, y, { align });
      });
      y += 5.5;
    };

    const checkPageBreak = (needed = 30) => {
      if (y > 270 - needed) {
        doc.addPage();
        y = margin;
      }
    };

    // --- 1. Dachgeometrie ---
    sectionHeader('Dachgeometrie');
    const e = this.calc.ergebnis();
    const m = this.calc.masse();
    twoCol('Dachfläche (netto)', `${fmt(e.dachflaeche)} m²`);
    twoCol('Dachneigung', `${m.dachneigung}°`);
    twoCol('Trauflänge gesamt', `${fmt(e.traufLaenge)} m`);
    if (e.sparrenAnzahl > 0) {
      twoCol('Sparrenlänge', `${fmt(e.sparrenLaenge)} m`);
      twoCol('Sparren', `${e.sparrenAnzahl} Stk`);
      twoCol('Dachlatten', `${e.lattenAnzahl} Stk  ·  ${fmt(e.lattenLaenge)} m`);
    }
    if (e.firstLaenge > 0) twoCol('Firstlänge', `${fmt(e.firstLaenge)} m`);
    if (e.gratLaenge > 0)  twoCol('Gratlänge gesamt', `${fmt(e.gratLaenge)} m`);

    const gauben = this.calc.gauben();
    if (gauben.length > 0) {
      y += 2;
      setFont(8, 'normal', GREY);
      doc.text(`Gauben/Dachfenster: ${gauben.length} Position(en), Flächenabzug ${fmt(this.calc.gaubenFlaeche(gauben))} m²`, margin + 2, y);
      y += 6;
    }

    checkPageBreak();

    // --- 2. Holzmenge ---
    const holz = this.calc.holzErgebnis();
    if (holz.positionen.length > 0) {
      y += 3;
      sectionHeader('Holz / Unterkonstruktion');
      const hw = [80, 30, 30, 30];
      tableRow(['Position', 'Stk', 'lfm', 'm³'], hw, true, LIGHT);
      for (const p of holz.positionen) {
        tableRow([p.bezeichnung, `${p.stueck}`, `${fmt(p.lfdm)}`, `${fmt(p.m3, 2)}`], hw);
      }
      line(margin, y - 1, W - margin, y - 1);
      tableRow(['Gesamt', '', '', `${fmt(holz.gesamtM3, 2)} m³  (~${holz.gesamtKg} kg)`], hw, true);
      checkPageBreak();
    }

    // --- 3. Eindeckung ---
    y += 3;
    sectionHeader('Eindeckung');
    const eindeckung = this.calc.eindeckungErgebnis();
    twoCol('Material', eindeckung.material);
    twoCol('Bedarf (inkl. Zuschlag)', `${fmt(eindeckung.flaecheBrutto)} m²`);
    if (eindeckung.stueck) twoCol('Stückzahl', `${eindeckung.stueck.toLocaleString('de-AT')} Stk`);
    if (eindeckung.hinweis) {
      setFont(8, 'normal', GREY);
      doc.text(`Hinweis: ${eindeckung.hinweis}`, margin + 2, y);
      y += 5;
    }

    // --- 4. Dachaufbau ---
    const aufbau = this.calc.dachaufbauErgebnis();
    if (aufbau.unterdeckbahn || aufbau.daemmung || aufbau.dampfbremse) {
      checkPageBreak();
      y += 3;
      sectionHeader('Dachaufbau');
      if (aufbau.unterdeckbahn) twoCol('Unterdeckbahn', `${fmt(aufbau.unterdeckbahn.flaecheBrutto)} m²  (${aufbau.unterdeckbahn.rollen} Rollen)`);
      if (aufbau.daemmung)      twoCol(aufbau.daemmung.bezeichnung, `${fmt(aufbau.daemmung.flaecheM2)} m²  /  ${fmt(aufbau.daemmung.volumenM3, 2)} m³`);
      if (aufbau.dampfbremse)   twoCol('Dampfbremse', `${fmt(aufbau.dampfbremse.flaecheM2)} m²`);
    }

    // --- 5. Verbindungsmittel ---
    const vm = this.calc.verbindungsmittel();
    if (vm.positionen.length > 0) {
      checkPageBreak();
      y += 3;
      sectionHeader('Verbindungsmittel');
      const vw = [80, 40, 30, 20];
      tableRow(['Position', 'Dimension', 'Anzahl', 'kg'], vw, true, LIGHT);
      for (const p of vm.positionen) {
        tableRow([p.bezeichnung, p.dimension, `${p.anzahl.toLocaleString('de-AT')} Stk`, `${fmt(p.gewichtKg)}`], vw);
      }
      const vmKg = vm.positionen.reduce((s, p) => s + p.gewichtKg, 0);
      line(margin, y - 1, W - margin, y - 1);
      tableRow(['Gesamt', '', '', `${fmt(vmKg)} kg`], vw, true);
    }

    // --- 6. Preiskalkulation ---
    const preis = this.calc.preisErgebnis();
    if (preis.positionen.length > 0) {
      checkPageBreak(60);
      y += 5;
      sectionHeader('Preiskalkulation');
      const pw = [90, 25, 25, 30];
      tableRow(['Position', 'Menge', '€/Einh.', 'Gesamt'], pw, true, LIGHT);
      for (const p of preis.positionen) {
        tableRow([p.bezeichnung, `${fmt(p.menge, 1)} ${p.einheit}`, `${fmt(p.preisProEinheit, 0)}`, fmtEuro(p.gesamt)], pw);
      }
      tableRow(['Arbeitskosten', `${fmt(e.dachflaeche, 1)} m²`, `${fmt(preis.arbeitskosten / (e.dachflaeche || 1), 0)}`, fmtEuro(preis.arbeitskosten)], pw);
      line(margin, y - 1, W - margin, y - 1);
      tableRow(['Zwischensumme', '', '', fmtEuro(preis.subtotal)], pw, true);
      tableRow([`Aufschlag (${this.calc.preisConfig().aufschlagProzent} %)`, '', '', fmtEuro(preis.aufschlag)], pw);
      line(margin, y - 1, W - margin, y - 1, PRIMARY, 0.5);
      tableRow(['Gesamt netto', '', '', fmtEuro(preis.gesamtNetto)], pw, true);
      tableRow([`MwSt. ${preis.mwstSatz} %`, '', '', fmtEuro(preis.gesamtBrutto - preis.gesamtNetto)], pw);

      // Brutto-Box
      y += 2;
      fillRect(margin, y, contentW, 10, PRIMARY);
      setFont(11, 'bold', WHITE);
      doc.text('Gesamt brutto', margin + 4, y + 7);
      doc.text(fmtEuro(preis.gesamtBrutto), W - margin - 4, y + 7, { align: 'right' });
      y += 14;
    }

    // --- Footer ---
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      setFont(7, 'normal', GREY);
      doc.text(`Erstellt mit DachRechner · dachrechner.at · Seite ${i}/${pageCount}`, W / 2, 293, { align: 'center' });
      line(margin, 289, W - margin, 289, GREY, 0.2);
    }

    const dateiname = `DachRechner_${(projektname || dachformLabels[this.calc.dachform()] || 'Dach').replace(/\s+/g, '_')}_${datum.replace(/\./g, '-')}.pdf`;
    doc.save(dateiname);
  }
}
