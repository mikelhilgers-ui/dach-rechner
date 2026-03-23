import { Injectable, signal, computed } from '@angular/core';
import {
  Dachform,
  DachMasse,
  GaubeConfig,
  DachErgebnis,
  VerbindungsmittelErgebnis,
  VerbindungsmittelPosition,
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

  readonly ergebnis = computed<DachErgebnis>(() =>
    this.berechne(this.dachform(), this.masse(), this.gauben())
  );

  readonly verbindungsmittel = computed<VerbindungsmittelErgebnis>(() =>
    this.berechneVerbindungsmittel(this.ergebnis(), this.masse())
  );

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

  addGaube(gaube: Omit<GaubeConfig, 'id'>): void {
    this.gauben.update(list => [
      ...list,
      { ...gaube, id: crypto.randomUUID() },
    ]);
  }

  removeGaube(id: string): void {
    this.gauben.update(list => list.filter(g => g.id !== id));
  }

  updateGaube(id: string, changes: Partial<GaubeConfig>): void {
    this.gauben.update(list =>
      list.map(g => g.id === id ? { ...g, ...changes } : g)
    );
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

  /** Gauben-/Dachfenster-Fläche abziehen */
  gaubenFlaeche(gauben: GaubeConfig[]): number {
    return gauben.reduce((sum, g) => sum + g.breite * g.hoehe * g.anzahl, 0);
  }

  // --- Dachformen ---

  berechneSatteldach(masse: DachMasse, gauben: GaubeConfig[]): DachErgebnis {
    const { trauflaenge, firstlaenge, dachneigung, dachueberstand, sparrenAbstand, lattenAbstand } = masse;
    const traufbreiteHalb = trauflaenge / 2;

    const sparren = this.sparrenLaenge(traufbreiteHalb, dachneigung, dachueberstand);
    const anzahlSparren = Math.ceil(firstlaenge / sparrenAbstand) + 1;
    const gesamtSparren = anzahlSparren * 2;

    const dachflaeche = this.flaeche(sparren, firstlaenge) * 2 - this.gaubenFlaeche(gauben);

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
    const gratLaenge = Math.sqrt(sparren ** 2 + traufbreiteHalb ** 2);

    const laengsF = sparren * (firstlaenge + trauflaenge) / 2;
    const giebelF = 0.5 * trauflaenge * sparren;
    const dachflaeche = laengsF * 2 + giebelF * 2 - this.gaubenFlaeche(gauben);

    const anzahlSparren =
      (Math.ceil(firstlaenge / sparrenAbstand) + 1) * 2 +
      (Math.ceil(trauflaenge / sparrenAbstand) + 1) * 2;

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

  // --- Verbindungsmittel ---

  /**
   * Berechnet Verbindungsmittel-Bedarf auf Basis der Dach-Ergebnisse.
   *
   * Richtwerte (Praxiswerte Zimmerei):
   *  - Sparrennägel 4.5×120: 6 Stk/Sparren (je 3 oben+unten an Pfette)
   *  - Lattennägel 3.1×80:   2 Stk pro Kreuzungspunkt (Latte × Sparren)
   *  - Sturmklammern:         1 Stk pro Kreuzungspunkt (je nach Windzone optional)
   *  - Firstnägel 3.1×80:    alle 25 cm entlang First (Firstlatte)
   *
   * Gewichte (Richtwerte):
   *  - Nagel 4.5×120: ca. 18 g/Stk  → 1000/18 ≈ 56 Stk/kg
   *  - Nagel 3.1×80:  ca. 6 g/Stk   → 1000/6  ≈ 166 Stk/kg
   *  - Sturmklammer:  ca. 15 g/Stk   → 1000/15 ≈ 67 Stk/kg
   */
  berechneVerbindungsmittel(ergebnis: DachErgebnis, masse: DachMasse): VerbindungsmittelErgebnis {
    if (ergebnis.sparrenAnzahl === 0) {
      // Flachdach: keine klassischen Verbindungsmittel
      return { positionen: [] };
    }

    const positionen: VerbindungsmittelPosition[] = [];

    // Sparrennägel
    const sparrenNaegel = ergebnis.sparrenAnzahl * 6;
    positionen.push({
      bezeichnung: 'Sparrennägel',
      dimension: '4.5 × 120 mm',
      anzahl: sparrenNaegel,
      gewichtKg: Math.ceil(sparrenNaegel / 56 * 10) / 10,
      hinweis: 'Je 3 Stk an Fußpfette und Firstpfette',
    });

    // Lattennägel (Kreuzungspunkte: lattenAnzahl × sparrenAnzahl)
    const kreuzungspunkte = ergebnis.lattenAnzahl * ergebnis.sparrenAnzahl;
    const lattenNaegel = kreuzungspunkte * 2;
    positionen.push({
      bezeichnung: 'Lattennägel',
      dimension: '3.1 × 80 mm',
      anzahl: lattenNaegel,
      gewichtKg: Math.ceil(lattenNaegel / 166 * 10) / 10,
      hinweis: '2 Stk pro Kreuzungspunkt',
    });

    // Sturmklammern
    const sturmklammern = kreuzungspunkte;
    positionen.push({
      bezeichnung: 'Sturmklammern',
      dimension: 'SFS WT-T 48',
      anzahl: sturmklammern,
      gewichtKg: Math.ceil(sturmklammern / 67 * 10) / 10,
      hinweis: 'Je 1 Stk pro Kreuzungspunkt (Windzone prüfen)',
    });

    // Firstnägel (alle 25 cm)
    if (ergebnis.firstLaenge > 0) {
      const firstNaegel = Math.ceil(ergebnis.firstLaenge / 0.25) * 2;
      positionen.push({
        bezeichnung: 'Firstnägel',
        dimension: '3.1 × 80 mm',
        anzahl: firstNaegel,
        gewichtKg: Math.ceil(firstNaegel / 166 * 10) / 10,
        hinweis: 'Firstlatte alle 25 cm, beidseitig',
      });
    }

    return { positionen };
  }
}
