import { Injectable, inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { CalculatorService } from '../../core/calculator/calculator.service';

@Injectable({ providedIn: 'root' })
export class ExcelExportService {
  private calc = inject(CalculatorService);

  exportieren(firmenname = '', projektname = ''): void {
    const wb = XLSX.utils.book_new();
    const datum = new Date().toLocaleDateString('de-AT');
    const dachformLabels: Record<string, string> = {
      sattel: 'Satteldach', pult: 'Pultdach', walm: 'Walmdach', flach: 'Flachdach',
    };

    const fmt1 = (n: number) => Math.round(n * 10) / 10;
    const fmt2 = (n: number) => Math.round(n * 100) / 100;

    // --- Blatt 1: Übersicht ---
    const e = this.calc.ergebnis();
    const m = this.calc.masse();

    const uebersicht: (string | number)[][] = [
      ['DachRechner – Berechnung', '', '', ''],
      ['Erstellt', datum, 'Firma', firmenname],
      ['Projekt', projektname, 'Dachform', dachformLabels[this.calc.dachform()] ?? ''],
      [],
      ['DACHGEOMETRIE'],
      ['Position', 'Wert', 'Einheit'],
      ['Dachfläche netto',    fmt1(e.dachflaeche),    'm²'],
      ['Dachneigung',         m.dachneigung,           '°'],
      ['Sparrenlänge',        fmt1(e.sparrenLaenge),   'm'],
      ['Sparren (Stück)',     e.sparrenAnzahl,          'Stk'],
      ['Latten (Stück)',      e.lattenAnzahl,           'Stk'],
      ['Lattenlänge gesamt',  fmt1(e.lattenLaenge),    'm'],
      ['Firstlänge',          fmt1(e.firstLaenge),     'm'],
      ['Trauflänge gesamt',   fmt1(e.traufLaenge),     'm'],
      ['Gratlänge gesamt',    fmt1(e.gratLaenge),      'm'],
    ];

    // Gauben
    const gauben = this.calc.gauben();
    if (gauben.length > 0) {
      uebersicht.push([]);
      uebersicht.push(['GAUBEN & DACHFENSTER']);
      uebersicht.push(['Typ', 'Bezeichnung', 'B × H (m)', 'Anzahl', 'Fläche (m²)']);
      for (const g of gauben) {
        uebersicht.push([
          g.typ === 'gaube' ? 'Gaube' : 'Dachfenster',
          g.bezeichnung ?? '',
          `${g.breite} × ${g.hoehe}`,
          g.anzahl,
          fmt1(g.breite * g.hoehe * g.anzahl),
        ]);
      }
    }

    const ws1 = XLSX.utils.aoa_to_sheet(uebersicht);
    ws1['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Übersicht');

    // --- Blatt 2: Material ---
    const material: (string | number)[][] = [
      ['HOLZ / UNTERKONSTRUKTION'],
      ['Position', 'Querschnitt', 'Stück', 'lfm', 'm³', 'ca. kg'],
    ];
    const holz = this.calc.holzErgebnis();
    for (const p of holz.positionen) {
      material.push([p.bezeichnung, p.querschnitt, p.stueck, fmt1(p.lfdm), fmt2(p.m3), p.gewichtKg]);
    }
    material.push(['Gesamt', '', '', '', fmt2(holz.gesamtM3), holz.gesamtKg]);

    material.push([], ['EINDECKUNG']);
    const eindeckung = this.calc.eindeckungErgebnis();
    material.push(['Material', 'Fläche (m²)', eindeckung.stueck ? 'Stückzahl' : '', '']);
    material.push([eindeckung.material, fmt1(eindeckung.flaecheBrutto), eindeckung.stueck ?? '', '']);

    const aufbau = this.calc.dachaufbauErgebnis();
    if (aufbau.unterdeckbahn || aufbau.daemmung || aufbau.dampfbremse) {
      material.push([], ['DACHAUFBAU']);
      material.push(['Position', 'Fläche (m²)', 'Volumen (m³)', 'Rollen']);
      if (aufbau.unterdeckbahn) material.push(['Unterdeckbahn', fmt1(aufbau.unterdeckbahn.flaecheBrutto), '', aufbau.unterdeckbahn.rollen]);
      if (aufbau.daemmung)      material.push([aufbau.daemmung.bezeichnung, fmt1(aufbau.daemmung.flaecheM2), fmt2(aufbau.daemmung.volumenM3), '']);
      if (aufbau.dampfbremse)   material.push(['Dampfbremse', fmt1(aufbau.dampfbremse.flaecheM2), '', '']);
    }

    const vm = this.calc.verbindungsmittel();
    if (vm.positionen.length > 0) {
      material.push([], ['VERBINDUNGSMITTEL']);
      material.push(['Position', 'Dimension', 'Anzahl (Stk)', 'ca. kg']);
      for (const p of vm.positionen) {
        material.push([p.bezeichnung, p.dimension, p.anzahl, fmt1(p.gewichtKg)]);
      }
    }

    const ws2 = XLSX.utils.aoa_to_sheet(material);
    ws2['!cols'] = [{ wch: 28 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Materialien');

    // --- Blatt 3: Preiskalkulation ---
    const preis = this.calc.preisErgebnis();
    if (preis.positionen.length > 0) {
      const preisBlatt: (string | number)[][] = [
        ['PREISKALKULATION'],
        ['Position', 'Menge', 'Einheit', '€/Einheit', 'Gesamt (€)'],
      ];
      for (const p of preis.positionen) {
        preisBlatt.push([p.bezeichnung, fmt1(p.menge), p.einheit, p.preisProEinheit, p.gesamt]);
      }
      preisBlatt.push(['Arbeitskosten', fmt1(e.dachflaeche), 'm²', this.calc.preisConfig().arbeitskostenProM2, preis.arbeitskosten]);
      preisBlatt.push([]);
      preisBlatt.push(['Zwischensumme', '', '', '', preis.subtotal]);
      preisBlatt.push([`Aufschlag (${this.calc.preisConfig().aufschlagProzent} %)`, '', '', '', preis.aufschlag]);
      preisBlatt.push(['Gesamt netto', '', '', '', preis.gesamtNetto]);
      preisBlatt.push([`MwSt. ${preis.mwstSatz} %`, '', '', '', preis.gesamtBrutto - preis.gesamtNetto]);
      preisBlatt.push(['GESAMT BRUTTO', '', '', '', preis.gesamtBrutto]);

      const ws3 = XLSX.utils.aoa_to_sheet(preisBlatt);
      ws3['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 14 }];
      XLSX.utils.book_append_sheet(wb, ws3, 'Preiskalkulation');
    }

    const dateiname = `DachRechner_${(projektname || dachformLabels[this.calc.dachform()] || 'Dach').replace(/\s+/g, '_')}_${datum.replace(/\./g, '-')}.xlsx`;
    XLSX.writeFile(wb, dateiname);
  }
}
