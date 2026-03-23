import { Injectable, inject } from '@angular/core';
import jsPDF from 'jspdf';
import { CalculatorService } from '../../core/calculator/calculator.service';

type RGB = [number, number, number];

const C = {
  primary:   [69,  90, 100] as RGB,   // Blue-Grey 800 (Anthrazit)
  dark:      [25,  25,  25] as RGB,
  mid:       [80,  80,  80] as RGB,
  light:     [150, 150, 150]as RGB,
  rowAlt:    [247, 248, 249]as RGB,
  headBg:    [207, 216, 220]as RGB,   // Blue-Grey 100
  white:     [255, 255, 255]as RGB,
  totalBg:   [55,  71,  79] as RGB,   // Blue-Grey 900
  sectionBg: [240, 242, 244]as RGB,
};

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  private calc = inject(CalculatorService);

  exportieren(firmenname = '', projektname = ''): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const PW = 210;
    const ML = 14, MR = 14;
    const CW = PW - ML - MR;
    let y = 0;

    const datum = new Date().toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dachformLabel: Record<string, string> = {
      sattel: 'Satteldach', pult: 'Pultdach', walm: 'Walmdach', flach: 'Flachdach',
    };

    // ── Helpers ──────────────────────────────────────────────────────────────

    const rgb  = (c: RGB) => c;
    const fill = (x: number, ry: number, w: number, h: number, c: RGB) => {
      doc.setFillColor(...rgb(c)); doc.rect(x, ry, w, h, 'F');
    };
    const stroke = (x: number, ry: number, w: number, h: number, c: RGB, lw = 0.2) => {
      doc.setDrawColor(...rgb(c)); doc.setLineWidth(lw); doc.rect(x, ry, w, h, 'S');
    };
    const hline = (x1: number, ry: number, x2: number, c: RGB, lw = 0.2) => {
      doc.setDrawColor(...rgb(c)); doc.setLineWidth(lw); doc.line(x1, ry, x2, ry);
    };
    const txt = (text: string, x: number, ry: number, size: number, style: 'normal'|'bold', c: RGB, align: 'left'|'center'|'right' = 'left') => {
      doc.setFontSize(size); doc.setFont('helvetica', style); doc.setTextColor(...rgb(c));
      doc.text(text, x, ry, { align });
    };
    const fmt  = (n: number, dec = 1) => n.toLocaleString('de-AT', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const euro = (n: number) => n.toLocaleString('de-AT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';

    const newPage = () => { doc.addPage(); y = 16; };
    const checkY = (need = 20) => { if (y > 275 - need) newPage(); };

    // ── Section heading ──────────────────────────────────────────────────────
    const section = (label: string) => {
      checkY(14);
      fill(ML, y, CW, 7, C.sectionBg);
      stroke(ML, y, CW, 7, C.primary, 0.15);
      txt(label, ML + 3, y + 5, 8.5, 'bold', C.primary);
      y += 13;
    };

    // ── Generic table ────────────────────────────────────────────────────────
    interface Col { w: number; align?: 'left'|'right'|'center' }
    const ROW_H = 6.5;

    const tableHeader = (cols: Col[], labels: string[]) => {
      fill(ML, y, CW, ROW_H, C.headBg);
      stroke(ML, y, CW, ROW_H, C.primary, 0.15);
      let x = ML;
      labels.forEach((lbl, i) => {
        const align = cols[i]?.align ?? 'left';
        const tx = align === 'right' ? x + cols[i].w - 2 : x + 2;
        txt(lbl, tx, y + 4.5, 7.5, 'bold', C.primary, align);
        x += cols[i].w;
      });
      y += ROW_H;
    };

    const tableRow = (cols: Col[], cells: string[], alt = false, bold = false) => {
      if (alt) fill(ML, y, CW, ROW_H, C.rowAlt);
      hline(ML, y + ROW_H, ML + CW, C.light, 0.15);
      let x = ML;
      cells.forEach((cell, i) => {
        const align = cols[i]?.align ?? 'left';
        const tx = align === 'right' ? x + cols[i].w - 2 : x + 2;
        txt(cell, tx, y + 4.5, 8, bold ? 'bold' : 'normal', C.dark, align);
        x += cols[i].w;
      });
      y += ROW_H;
    };

    const tableSumRow = (label: string, value: string) => {
      hline(ML, y, ML + CW, C.primary, 0.4);
      txt(label, ML + 2, y + 4.5, 8.5, 'bold', C.dark);
      txt(value, ML + CW - 2, y + 4.5, 8.5, 'bold', C.dark, 'right');
      y += ROW_H;
    };

    const kv = (label: string, value: string) => {
      txt(label, ML + 2, y, 8, 'normal', C.mid);
      txt(value, ML + CW - 2, y, 8, 'bold', C.dark, 'right');
      y += 5.5;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // HEADER
    // ═══════════════════════════════════════════════════════════════════════
    fill(0, 0, PW, 30, C.primary);
    // Logo-Text
    txt('DachRechner', ML, 13, 20, 'bold', C.white);
    txt('dach-rechner.vercel.app', ML, 20, 8, 'normal', [144, 164, 174] as RGB);
    // Firma + Datum rechts
    if (firmenname) txt(firmenname, PW - MR, 11, 11, 'bold', C.white, 'right');
    txt(datum, PW - MR, 18, 8, 'normal', [144, 164, 174] as RGB, 'right');
    txt('Erstellt mit DachRechner', PW - MR, 24, 7, 'normal', [120, 144, 156] as RGB, 'right');

    y = 36;

    // Projektname
    if (projektname) {
      txt(projektname, ML, y, 13, 'bold', C.dark); y += 7;
    }
    txt(`${dachformLabel[this.calc.dachform()] ?? ''} – Berechnung`, ML, y, 11, 'bold', C.mid);
    y += 2;
    hline(ML, y, ML + CW, C.primary, 0.5);
    y += 6;

    // ═══════════════════════════════════════════════════════════════════════
    // 1. DACHGEOMETRIE
    // ═══════════════════════════════════════════════════════════════════════
    const e = this.calc.ergebnis();
    const m = this.calc.masse();

    section('1  DACHGEOMETRIE');

    const geoCols: Col[] = [{ w: 80 }, { w: CW - 80, align: 'right' }];
    kv('Dachfläche (netto)', `${fmt(e.dachflaeche)} m²`);
    kv('Dachneigung', `${m.dachneigung}°`);
    kv('Trauflänge gesamt', `${fmt(e.traufLaenge)} m`);
    if (e.sparrenAnzahl > 0) {
      kv('Sparrenlänge', `${fmt(e.sparrenLaenge)} m`);
      kv('Sparren', `${e.sparrenAnzahl} Stk`);
      kv('Latten', `${e.lattenAnzahl} Stk · ${fmt(e.lattenLaenge)} m`);
    }
    if (e.firstLaenge > 0) kv('Firstlänge', `${fmt(e.firstLaenge)} m`);
    if (e.gratLaenge  > 0) kv('Gratlänge gesamt', `${fmt(e.gratLaenge)} m`);

    const gauben = this.calc.gauben();
    if (gauben.length > 0) {
      y += 2;
      txt(`Gauben/Dachfenster: ${gauben.length} Pos., Abzug ${fmt(this.calc.gaubenFlaeche(gauben))} m²`, ML + 2, y, 7.5, 'normal', C.light);
      y += 5;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 2. HOLZ
    // ═══════════════════════════════════════════════════════════════════════
    const holz = this.calc.holzErgebnis();
    if (holz.positionen.length > 0) {
      checkY(holz.positionen.length * ROW_H + 25);
      y += 4;
      section('2  HOLZ / UNTERKONSTRUKTION');
      const hCols: Col[] = [{ w: 65 }, { w: 25, align: 'right' }, { w: 27, align: 'right' }, { w: 27, align: 'right' }, { w: CW - 144, align: 'right' }];
      tableHeader(hCols, ['Position', 'Stk', 'lfm', 'm³', 'ca. kg']);
      holz.positionen.forEach((p, i) =>
        tableRow(hCols, [p.bezeichnung, `${p.stueck}`, `${fmt(p.lfdm)}`, `${fmt(p.m3, 2)}`, `${p.gewichtKg}`], i % 2 === 0)
      );
      tableSumRow('Gesamt', `${fmt(holz.gesamtM3, 2)} m³  ·  ~${holz.gesamtKg} kg`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 3. EINDECKUNG
    // ═══════════════════════════════════════════════════════════════════════
    checkY(25);
    y += 4;
    section('3  EINDECKUNG');
    const eindeckung = this.calc.eindeckungErgebnis();
    kv('Material', eindeckung.material);
    kv('Bedarf (inkl. Zuschlag)', `${fmt(eindeckung.flaecheBrutto)} m²`);
    if (eindeckung.stueck) kv('Stückzahl', `${eindeckung.stueck.toLocaleString('de-AT')} Stk`);
    if (eindeckung.hinweis) {
      txt(`Hinweis: ${eindeckung.hinweis}`, ML + 2, y, 7, 'normal', C.light);
      y += 5;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 4. DACHAUFBAU
    // ═══════════════════════════════════════════════════════════════════════
    const aufbau = this.calc.dachaufbauErgebnis();
    if (aufbau.unterdeckbahn || aufbau.daemmung || aufbau.dampfbremse) {
      checkY(25);
      y += 4;
      section('4  DACHAUFBAU');
      if (aufbau.unterdeckbahn) kv('Unterdeckbahn', `${fmt(aufbau.unterdeckbahn.flaecheBrutto)} m²  (${aufbau.unterdeckbahn.rollen} Rollen à 50 m²)`);
      if (aufbau.daemmung)      kv(aufbau.daemmung.bezeichnung, `${fmt(aufbau.daemmung.flaecheM2)} m²  /  ${fmt(aufbau.daemmung.volumenM3, 2)} m³`);
      if (aufbau.dampfbremse)   kv('Dampfbremse', `${fmt(aufbau.dampfbremse.flaecheM2)} m²`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 5. PREISKALKULATION
    // ═══════════════════════════════════════════════════════════════════════
    const preis = this.calc.preisErgebnis();
    if (preis.positionen.length > 0) {
      checkY(preis.positionen.length * ROW_H + 60);
      y += 4;
      section('5  PREISKALKULATION');

      const pCols: Col[] = [{ w: 88 }, { w: 28, align: 'right' }, { w: 30, align: 'right' }, { w: CW - 146, align: 'right' }];
      tableHeader(pCols, ['Position', 'Menge', '€ / Einheit', 'Gesamt']);

      preis.positionen.forEach((p, i) =>
        tableRow(pCols, [p.bezeichnung, `${fmt(p.menge, 1)} ${p.einheit}`, `${fmt(p.preisProEinheit, 0)} €`, euro(p.gesamt)], i % 2 === 0)
      );
      tableRow(pCols,
        ['Arbeitskosten', `${fmt(e.dachflaeche, 1)} m²`, `${this.calc.preisConfig().arbeitskostenProM2} €/m²`, euro(preis.arbeitskosten)],
        preis.positionen.length % 2 === 0, false
      );

      y += 4;
      tableSumRow('Zwischensumme', euro(preis.subtotal));
      y += 1;
      txt(`Aufschlag (${this.calc.preisConfig().aufschlagProzent} %)`, ML + 2, y + 4.5, 8, 'normal', C.mid);
      txt(euro(preis.aufschlag), ML + CW - 2, y + 4.5, 8, 'bold', C.dark, 'right');
      y += 7;
      hline(ML, y, ML + CW, C.primary, 0.4);
      y += 6;
      txt('Gesamt netto', ML + 2, y + 4.5, 8.5, 'bold', C.dark);
      txt(euro(preis.gesamtNetto), ML + CW - 2, y + 4.5, 8.5, 'bold', C.dark, 'right');
      y += 7;
      txt(`MwSt. ${preis.mwstSatz} %`, ML + 2, y + 4.5, 8, 'normal', C.mid);
      txt(euro(preis.gesamtBrutto - preis.gesamtNetto), ML + CW - 2, y + 4.5, 8, 'bold', C.dark, 'right');
      y += 7;

      // Brutto-Box
      y += 3;
      checkY(14);
      fill(ML, y, CW, 12, C.primary);
      stroke(ML, y, CW, 12, C.primary, 0.3);
      txt('GESAMT BRUTTO', ML + 4, y + 8, 10, 'bold', C.white);
      txt(euro(preis.gesamtBrutto), ML + CW - 4, y + 8, 12, 'bold', C.white, 'right');
      y += 16;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // FOOTER auf jeder Seite
    // ═══════════════════════════════════════════════════════════════════════
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      hline(ML, 287, ML + CW, C.light, 0.2);
      txt(`DachRechner · dach-rechner.vercel.app`, ML, 292, 6.5, 'normal', C.light);
      txt(`Seite ${i} / ${pages}`, ML + CW, 292, 6.5, 'normal', C.light, 'right');
    }

    const name = `DachRechner_${(projektname || dachformLabel[this.calc.dachform()] || 'Dach').replace(/\s+/g, '_')}_${datum.replace(/\./g, '-')}.pdf`;
    doc.save(name);
  }
}
