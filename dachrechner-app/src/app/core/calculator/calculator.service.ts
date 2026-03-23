import { Injectable, signal, computed } from '@angular/core';
import {
  Dachform,
  DachMasse,
  GaubeConfig,
  DachErgebnis,
  CalculatorState,
} from './calculator.models';

@Injectable({ providedIn: 'root' })
export class CalculatorService {
  // --- State (Signals) ---
  readonly dachform = signal<Dachform>('sattel');
  readonly masse = signal<DachMasse>({
    trauflaenge: 10,
    firstlaenge: 8,
    dachneigung: 35,
    dachueberstand: 0.5,
    sparrenAbstand: 0.8,
    lattenAbstand: 0.32,
  });
  readonly gauben = signal<GaubeConfig[]>([]);

  readonly ergebnis = computed<DachErgebnis>(() => {
    return this.berechne(this.dachform(), this.masse(), this.gauben());
  });

  // --- Setter ---
  setDachform(form: Dachform): void {
    this.dachform.set(form);
  }

  setMasse(masse: Partial<DachMasse>): void {
    this.masse.update(m => ({ ...m, ...masse }));
  }

  setGauben(gauben: GaubeConfig[]): void {
    this.gauben.set(gauben);
  }

  // --- Hauptberechnung ---
  berechne(dachform: Dachform, masse: DachMasse, gauben: GaubeConfig[]): DachErgebnis {
    switch (dachform) {
      case 'sattel': return this.berechneSatteldach(masse, gauben);
      case 'pult':   return this.berechnePultdach(masse, gauben);
      case 'walm':   return this.berechneWalmdach(masse, gauben);
      case 'flach':  return this.berechneFlachdach(masse, gauben);
    }
  }

  // --- Hilfsmethoden ---

  /** Dachneigung in Radiant */
  neigungRad(grad: number): number {
    return (grad * Math.PI) / 180;
  }

  /** Sparrenlänge aus Traufbreite und Neigung (+ Überstand) */
  sparrenLaenge(traufbreiteHalb: number, neigungGrad: number, ueberstand: number): number {
    const rad = this.neigungRad(neigungGrad);
    return traufbreiteHalb / Math.cos(rad) + ueberstand;
  }

  /** Dachfläche einer Seite (Rechteck): Sparrenlänge × Firstlänge */
  flaeche(sparren: number, laenge: number): number {
    return sparren * laenge;
  }

  /** Gauben-Fläche abziehen */
  gaubenFlaeche(gauben: GaubeConfig[]): number {
    return gauben.reduce((sum, g) => sum + g.breite * g.hoehe * g.anzahl, 0);
  }

  // --- Dachformen ---

  berechneSatteldach(masse: DachMasse, gauben: GaubeConfig[]): DachErgebnis {
    const { trauflaenge, firstlaenge, dachneigung, dachueberstand, sparrenAbstand, lattenAbstand } = masse;
    const traufbreiteHalb = trauflaenge / 2;

    const sparren = this.sparrenLaenge(traufbreiteHalb, dachneigung, dachueberstand);
    const anzahlSparren = Math.ceil(firstlaenge / sparrenAbstand) + 1;
    // × 2 für beide Dachseiten
    const gesamtSparren = anzahlSparren * 2;

    const eineSeiteFl = this.flaeche(sparren, firstlaenge);
    const dachflaeche = eineSeiteFl * 2 - this.gaubenFlaeche(gauben);

    const lattenAnzahl = Math.ceil(sparren / lattenAbstand) + 1;
    const lattenLaenge = lattenAnzahl * (firstlaenge + 2 * dachueberstand);

    return {
      dachflaeche: Math.max(0, dachflaeche),
      sparrenLaenge: sparren,
      sparrenAnzahl: gesamtSparren,
      lattenAnzahl,
      lattenLaenge,
      firstLaenge: firstlaenge,
      traufLaenge: firstlaenge * 2 + trauflaenge * 2,
      kehlLaenge: 0,
      gratLaenge: 0,
    };
  }

  berechnePultdach(masse: DachMasse, gauben: GaubeConfig[]): DachErgebnis {
    const { trauflaenge, firstlaenge, dachneigung, dachueberstand, sparrenAbstand, lattenAbstand } = masse;

    const sparren = this.sparrenLaenge(trauflaenge, dachneigung, dachueberstand);
    const anzahlSparren = Math.ceil(firstlaenge / sparrenAbstand) + 1;

    const dachflaeche = this.flaeche(sparren, firstlaenge) - this.gaubenFlaeche(gauben);

    const lattenAnzahl = Math.ceil(sparren / lattenAbstand) + 1;
    const lattenLaenge = lattenAnzahl * (firstlaenge + 2 * dachueberstand);

    return {
      dachflaeche: Math.max(0, dachflaeche),
      sparrenLaenge: sparren,
      sparrenAnzahl: anzahlSparren,
      lattenAnzahl,
      lattenLaenge,
      firstLaenge: firstlaenge,
      traufLaenge: firstlaenge * 2 + trauflaenge,
      kehlLaenge: 0,
      gratLaenge: 0,
    };
  }

  berechneWalmdach(masse: DachMasse, gauben: GaubeConfig[]): DachErgebnis {
    const { trauflaenge, firstlaenge, dachneigung, dachueberstand, sparrenAbstand, lattenAbstand } = masse;
    const traufbreiteHalb = trauflaenge / 2;

    const sparren = this.sparrenLaenge(traufbreiteHalb, dachneigung, dachueberstand);

    // Gratlänge (Ecksparren)
    const gratLaenge = Math.sqrt(sparren ** 2 + (traufbreiteHalb) ** 2);

    // Flächen: 2 Trapeze (Längsseiten) + 2 Dreiecke (Giebelseiten)
    const laengsFlaeche = ((firstlaenge + firstlaenge + trauflaenge - firstlaenge) / 2) * sparren;
    // Vereinfacht: Längsseitenfl = Sparren × (First + Trauf)/2 pro Seite
    const laengsF = sparren * (firstlaenge + trauflaenge) / 2;
    const giebelF = 0.5 * trauflaenge * sparren;
    const dachflaeche = laengsF * 2 + giebelF * 2 - this.gaubenFlaeche(gauben);

    const anzahlSparren = (Math.ceil(firstlaenge / sparrenAbstand) + 1) * 2
      + (Math.ceil(trauflaenge / sparrenAbstand) + 1) * 2;

    const lattenAnzahl = Math.ceil(sparren / lattenAbstand) + 1;
    const umfang = firstlaenge * 2 + trauflaenge * 2;
    const lattenLaenge = lattenAnzahl * umfang;

    return {
      dachflaeche: Math.max(0, dachflaeche),
      sparrenLaenge: sparren,
      sparrenAnzahl: anzahlSparren,
      lattenAnzahl,
      lattenLaenge,
      firstLaenge: firstlaenge,
      traufLaenge: umfang,
      kehlLaenge: 0,
      gratLaenge: gratLaenge * 4,
    };
  }

  berechneFlachdach(masse: DachMasse, gauben: GaubeConfig[]): DachErgebnis {
    const { trauflaenge, firstlaenge } = masse;
    const dachflaeche = trauflaenge * firstlaenge - this.gaubenFlaeche(gauben);

    return {
      dachflaeche: Math.max(0, dachflaeche),
      sparrenLaenge: 0,
      sparrenAnzahl: 0,
      lattenAnzahl: 0,
      lattenLaenge: 0,
      firstLaenge: 0,
      traufLaenge: (trauflaenge + firstlaenge) * 2,
      kehlLaenge: 0,
      gratLaenge: 0,
    };
  }
}
