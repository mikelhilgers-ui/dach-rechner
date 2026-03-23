import { Injectable, signal, computed } from '@angular/core';
import {
  Dachform,
  DachMasse,
  GaubeConfig,
  DachErgebnis,
  VerbindungsmittelErgebnis,
  VerbindungsmittelPosition,
  HolzConfig,
  HolzErgebnis,
  HolzPosition,
  EindeckungConfig,
  EindeckungErgebnis,
  DachaufbauConfig,
  DachaufbauErgebnis,
  PreisConfig,
  PreisErgebnis,
  PreisPosition,
} from './calculator.models';

@Injectable({ providedIn: 'root' })
export class CalculatorService {

  // --- State ---
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
  readonly holzConfig = signal<HolzConfig>({
    sparreBreite: 8,
    sparreHoehe: 18,
    latteBreite: 4,
    latteHoehe: 5,
    konterlatteAktiv: false,
    konterlatteBreite: 4,
    konterlatteHoehe: 6,
    holzartDichte: 480,
  });
  readonly eindeckungConfig = signal<EindeckungConfig>({
    material: 'falzziegel',
    zuschlagProzent: 10,
  });
  readonly dachaufbauConfig = signal<DachaufbauConfig>({
    unterdeckbahnAktiv: true,
    unterdeckbahnUeberlappM: 0.1,
    daemmungAktiv: false,
    daemmungStaerkeCm: 18,
    daemmungTyp: 'mineralwolle',
    dampfbremseAktiv: false,
  });
  readonly preisConfig = signal<PreisConfig>({
    holzPreisProM3:              450,
    eindeckungPreisProM2:         40,
    unterdeckbahnPreisProM2:       2,
    daemmungPreisProM2:           18,
    dampfbremsePreisProM2:         2,
    verbindungsmittelPreisProKg:   4,
    arbeitskostenProM2:           35,
    aufschlagProzent:             15,
  });

  // --- Computed ---
  readonly ergebnis = computed<DachErgebnis>(() =>
    this.berechne(this.dachform(), this.masse(), this.gauben())
  );
  readonly verbindungsmittel = computed<VerbindungsmittelErgebnis>(() =>
    this.berechneVerbindungsmittel(this.ergebnis(), this.masse())
  );
  readonly holzErgebnis = computed<HolzErgebnis>(() =>
    this.berechneHolz(this.ergebnis(), this.holzConfig())
  );
  readonly eindeckungErgebnis = computed<EindeckungErgebnis>(() =>
    this.berechneEindeckung(this.ergebnis(), this.eindeckungConfig())
  );
  readonly dachaufbauErgebnis = computed<DachaufbauErgebnis>(() =>
    this.berechneDachaufbau(this.ergebnis(), this.dachaufbauConfig())
  );
  readonly preisErgebnis = computed<PreisErgebnis>(() =>
    this.berechnePreise(
      this.ergebnis(),
      this.holzErgebnis(),
      this.eindeckungErgebnis(),
      this.dachaufbauErgebnis(),
      this.verbindungsmittel(),
      this.preisConfig(),
    )
  );

  // --- Setter ---
  setDachform(form: Dachform): void { this.dachform.set(form); }
  setMasse(masse: Partial<DachMasse>): void { this.masse.update(m => ({ ...m, ...masse })); }
  setGauben(gauben: GaubeConfig[]): void { this.gauben.set(gauben); }
  setHolzConfig(cfg: Partial<HolzConfig>): void { this.holzConfig.update(c => ({ ...c, ...cfg })); }
  setEindeckungConfig(cfg: Partial<EindeckungConfig>): void { this.eindeckungConfig.update(c => ({ ...c, ...cfg })); }
  setDachaufbauConfig(cfg: Partial<DachaufbauConfig>): void { this.dachaufbauConfig.update(c => ({ ...c, ...cfg })); }
  setPreisConfig(cfg: Partial<PreisConfig>): void { this.preisConfig.update(c => ({ ...c, ...cfg })); }

  addGaube(gaube: Omit<GaubeConfig, 'id'>): void {
    this.gauben.update(list => [...list, { ...gaube, id: crypto.randomUUID() }]);
  }
  removeGaube(id: string): void {
    this.gauben.update(list => list.filter(g => g.id !== id));
  }
  updateGaube(id: string, changes: Partial<GaubeConfig>): void {
    this.gauben.update(list => list.map(g => g.id === id ? { ...g, ...changes } : g));
  }

  // --- Hauptberechnung Dach ---
  berechne(dachform: Dachform, masse: DachMasse, gauben: GaubeConfig[]): DachErgebnis {
    switch (dachform) {
      case 'sattel': return this.berechneSatteldach(masse, gauben);
      case 'pult':   return this.berechnePultdach(masse, gauben);
      case 'walm':   return this.berechneWalmdach(masse, gauben);
      case 'flach':  return this.berechneFlachdach(masse, gauben);
    }
  }

  neigungRad(grad: number): number {
    return (grad * Math.PI) / 180;
  }

  sparrenLaenge(traufbreiteHalb: number, neigungGrad: number, ueberstand: number): number {
    const rad = this.neigungRad(neigungGrad);
    return traufbreiteHalb / Math.cos(rad) + ueberstand;
  }

  flaeche(sparren: number, laenge: number): number {
    return sparren * laenge;
  }

  gaubenFlaeche(gauben: GaubeConfig[]): number {
    return gauben.reduce((sum, g) => sum + g.breite * g.hoehe * g.anzahl, 0);
  }

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
      sparrenLaenge: sparren, sparrenAnzahl: gesamtSparren,
      lattenAnzahl, lattenLaenge,
      firstLaenge: firstlaenge,
      traufLaenge: firstlaenge * 2 + trauflaenge * 2,
      kehlLaenge: 0, gratLaenge: 0,
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
      sparrenLaenge: sparren, sparrenAnzahl: anzahlSparren,
      lattenAnzahl, lattenLaenge,
      firstLaenge: firstlaenge,
      traufLaenge: firstlaenge * 2 + trauflaenge,
      kehlLaenge: 0, gratLaenge: 0,
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
    return {
      dachflaeche: Math.max(0, dachflaeche),
      sparrenLaenge: sparren, sparrenAnzahl: anzahlSparren,
      lattenAnzahl, lattenLaenge: lattenAnzahl * umfang,
      firstLaenge: firstlaenge, traufLaenge: umfang,
      kehlLaenge: 0, gratLaenge: gratLaenge * 4,
    };
  }

  berechneFlachdach(masse: DachMasse, gauben: GaubeConfig[]): DachErgebnis {
    const { trauflaenge, firstlaenge } = masse;
    const dachflaeche = trauflaenge * firstlaenge - this.gaubenFlaeche(gauben);
    return {
      dachflaeche: Math.max(0, dachflaeche),
      sparrenLaenge: 0, sparrenAnzahl: 0,
      lattenAnzahl: 0, lattenLaenge: 0,
      firstLaenge: 0,
      traufLaenge: (trauflaenge + firstlaenge) * 2,
      kehlLaenge: 0, gratLaenge: 0,
    };
  }

  // --- Verbindungsmittel ---
  berechneVerbindungsmittel(ergebnis: DachErgebnis, _masse: DachMasse): VerbindungsmittelErgebnis {
    if (ergebnis.sparrenAnzahl === 0) return { positionen: [] };
    const positionen: VerbindungsmittelPosition[] = [];
    const sparrenNaegel = ergebnis.sparrenAnzahl * 6;
    positionen.push({
      bezeichnung: 'Sparrennägel', dimension: '4.5 × 120 mm',
      anzahl: sparrenNaegel,
      gewichtKg: Math.ceil(sparrenNaegel / 56 * 10) / 10,
      hinweis: 'Je 3 Stk an Fußpfette und Firstpfette',
    });
    const kreuzungspunkte = ergebnis.lattenAnzahl * ergebnis.sparrenAnzahl;
    const lattenNaegel = kreuzungspunkte * 2;
    positionen.push({
      bezeichnung: 'Lattennägel', dimension: '3.1 × 80 mm',
      anzahl: lattenNaegel,
      gewichtKg: Math.ceil(lattenNaegel / 166 * 10) / 10,
      hinweis: '2 Stk pro Kreuzungspunkt',
    });
    positionen.push({
      bezeichnung: 'Sturmklammern', dimension: 'SFS WT-T 48',
      anzahl: kreuzungspunkte,
      gewichtKg: Math.ceil(kreuzungspunkte / 67 * 10) / 10,
      hinweis: 'Je 1 Stk pro Kreuzungspunkt (Windzone prüfen)',
    });
    if (ergebnis.firstLaenge > 0) {
      const firstNaegel = Math.ceil(ergebnis.firstLaenge / 0.25) * 2;
      positionen.push({
        bezeichnung: 'Firstnägel', dimension: '3.1 × 80 mm',
        anzahl: firstNaegel,
        gewichtKg: Math.ceil(firstNaegel / 166 * 10) / 10,
        hinweis: 'Firstlatte alle 25 cm, beidseitig',
      });
    }
    return { positionen };
  }

  // --- Holz ---
  berechneHolz(ergebnis: DachErgebnis, cfg: HolzConfig): HolzErgebnis {
    const positionen: HolzPosition[] = [];
    const dichte = cfg.holzartDichte;

    if (ergebnis.sparrenAnzahl > 0 && ergebnis.sparrenLaenge > 0) {
      const lfdm = ergebnis.sparrenAnzahl * ergebnis.sparrenLaenge;
      const m3 = lfdm * (cfg.sparreBreite / 100) * (cfg.sparreHoehe / 100);
      positionen.push({
        bezeichnung: `Sparren ${cfg.sparreBreite}/${cfg.sparreHoehe}`,
        querschnitt: `${cfg.sparreBreite} × ${cfg.sparreHoehe} cm`,
        stueck: ergebnis.sparrenAnzahl,
        lfdm: Math.ceil(lfdm * 10) / 10,
        m3: Math.ceil(m3 * 100) / 100,
        gewichtKg: Math.ceil(m3 * dichte),
      });
    }

    if (ergebnis.lattenLaenge > 0) {
      const m3 = ergebnis.lattenLaenge * (cfg.latteBreite / 100) * (cfg.latteHoehe / 100);
      positionen.push({
        bezeichnung: `Dachlatte ${cfg.latteBreite}/${cfg.latteHoehe}`,
        querschnitt: `${cfg.latteBreite} × ${cfg.latteHoehe} cm`,
        stueck: ergebnis.lattenAnzahl,
        lfdm: Math.ceil(ergebnis.lattenLaenge * 10) / 10,
        m3: Math.ceil(m3 * 100) / 100,
        gewichtKg: Math.ceil(m3 * dichte),
      });
    }

    if (cfg.konterlatteAktiv && ergebnis.lattenLaenge > 0) {
      // Konterlatte: gleiche lfdm wie Lattlänge (läuft parallel zu Sparren)
      const konterLfdm = ergebnis.sparrenAnzahl * ergebnis.sparrenLaenge;
      const m3 = konterLfdm * (cfg.konterlatteBreite / 100) * (cfg.konterlatteHoehe / 100);
      positionen.push({
        bezeichnung: `Konterlatte ${cfg.konterlatteBreite}/${cfg.konterlatteHoehe}`,
        querschnitt: `${cfg.konterlatteBreite} × ${cfg.konterlatteHoehe} cm`,
        stueck: ergebnis.sparrenAnzahl,
        lfdm: Math.ceil(konterLfdm * 10) / 10,
        m3: Math.ceil(m3 * 100) / 100,
        gewichtKg: Math.ceil(m3 * dichte),
      });
    }

    const gesamtM3 = positionen.reduce((s, p) => s + p.m3, 0);
    return {
      positionen,
      gesamtM3: Math.ceil(gesamtM3 * 100) / 100,
      gesamtKg: Math.ceil(gesamtM3 * dichte),
    };
  }

  // --- Eindeckung ---

  /** Stück pro m² je nach Material */
  stueckProM2(material: EindeckungConfig['material']): number | null {
    const tabelle: Record<string, number | null> = {
      falzziegel:       10,
      betondachstein:   10,
      biberschwanz:     28,
      schiefer:         30,
      trapezblech:      null,
      bitumenschindeln: null,
      gruendach:        null,
    };
    return tabelle[material] ?? null;
  }

  materialBezeichnung(material: EindeckungConfig['material']): string {
    const namen: Record<string, string> = {
      falzziegel:       'Falzziegel (Ton)',
      betondachstein:   'Betondachstein',
      biberschwanz:     'Biberschwanz',
      schiefer:         'Schiefer',
      trapezblech:      'Trapezblech',
      bitumenschindeln: 'Bitumenschindeln',
      gruendach:        'Gründach-Aufbau',
    };
    return namen[material] ?? material;
  }

  berechneEindeckung(ergebnis: DachErgebnis, cfg: EindeckungConfig): EindeckungErgebnis {
    const flaecheBrutto = ergebnis.dachflaeche * (1 + cfg.zuschlagProzent / 100);
    const spM2 = this.stueckProM2(cfg.material);
    const stueck = spM2 ? Math.ceil(flaecheBrutto * spM2) : null;
    const hinweise: Record<string, string> = {
      falzziegel:       'Lattenabstand auf Deckmaß des Ziegels abstimmen',
      betondachstein:   'Lattenabstand auf Deckmaß abstimmen',
      biberschwanz:     'Doppeldeckung: 28 Stk/m², Lattenabstand ~16 cm',
      schiefer:         'Ca. 30 Stk/m² (Format 30×20), Deutsche Deckung',
      trapezblech:      'Maß inkl. 15 % Überlappung; Profil nach Spannweite wählen',
      bitumenschindeln:'Für Dachneigung ab 10°; mind. 10 % Zuschlag',
      gruendach:        'Flachdach: Abdichtung + Drainmatte + Substrat + Pflanzen',
    };
    return {
      material: this.materialBezeichnung(cfg.material),
      flaecheBrutto: Math.ceil(flaecheBrutto * 10) / 10,
      stueck,
      stueckProM2: spM2,
      einheit: spM2 ? 'Stk' : 'm²',
      hinweis: hinweise[cfg.material] ?? '',
    };
  }

  // --- Dachaufbau ---
  berechneDachaufbau(ergebnis: DachErgebnis, cfg: DachaufbauConfig): DachaufbauErgebnis {
    const fl = ergebnis.dachflaeche;

    const unterdeckbahn = cfg.unterdeckbahnAktiv && fl > 0
      ? {
          flaecheBrutto: Math.ceil(fl * 1.15 * 10) / 10,  // 15% für Überlappung
          rollen: Math.ceil(fl * 1.15 / 50),               // Rolle = 50 m²
        }
      : null;

    const daemmTypBezeichnungen: Record<string, string> = {
      mineralwolle: 'Mineralwolle',
      holzfaser:    'Holzfaser',
      pur:          'PUR/PIR',
    };
    const daemmung = cfg.daemmungAktiv && fl > 0
      ? {
          volumenM3: Math.ceil(fl * (cfg.daemmungStaerkeCm / 100) * 100) / 100,
          flaecheM2: Math.ceil(fl * 1.05 * 10) / 10,  // 5% Zuschlag
          typ: cfg.daemmungTyp,
          bezeichnung: `${daemmTypBezeichnungen[cfg.daemmungTyp]} ${cfg.daemmungStaerkeCm} cm`,
        }
      : null;

    const dampfbremse = cfg.dampfbremseAktiv && fl > 0
      ? { flaecheM2: Math.ceil(fl * 1.1 * 10) / 10 }
      : null;

    return { unterdeckbahn, daemmung, dampfbremse };
  }

  // --- Preiskalkulation ---
  berechnePreise(
    ergebnis: DachErgebnis,
    holz: HolzErgebnis,
    eindeckung: EindeckungErgebnis,
    dachaufbau: DachaufbauErgebnis,
    vm: VerbindungsmittelErgebnis,
    cfg: PreisConfig,
  ): PreisErgebnis {
    const positionen: PreisPosition[] = [];

    // Holz
    for (const pos of holz.positionen) {
      if (pos.m3 > 0) {
        positionen.push({
          bezeichnung: pos.bezeichnung,
          menge: pos.m3,
          einheit: 'm³',
          preisProEinheit: cfg.holzPreisProM3,
          gesamt: Math.round(pos.m3 * cfg.holzPreisProM3),
        });
      }
    }

    // Eindeckung
    if (eindeckung.flaecheBrutto > 0) {
      positionen.push({
        bezeichnung: `Eindeckung – ${eindeckung.material}`,
        menge: eindeckung.flaecheBrutto,
        einheit: 'm²',
        preisProEinheit: cfg.eindeckungPreisProM2,
        gesamt: Math.round(eindeckung.flaecheBrutto * cfg.eindeckungPreisProM2),
      });
    }

    // Unterdeckbahn
    if (dachaufbau.unterdeckbahn) {
      positionen.push({
        bezeichnung: 'Unterdeckbahn',
        menge: dachaufbau.unterdeckbahn.flaecheBrutto,
        einheit: 'm²',
        preisProEinheit: cfg.unterdeckbahnPreisProM2,
        gesamt: Math.round(dachaufbau.unterdeckbahn.flaecheBrutto * cfg.unterdeckbahnPreisProM2),
      });
    }

    // Dämmung
    if (dachaufbau.daemmung) {
      positionen.push({
        bezeichnung: dachaufbau.daemmung.bezeichnung,
        menge: dachaufbau.daemmung.flaecheM2,
        einheit: 'm²',
        preisProEinheit: cfg.daemmungPreisProM2,
        gesamt: Math.round(dachaufbau.daemmung.flaecheM2 * cfg.daemmungPreisProM2),
      });
    }

    // Dampfbremse
    if (dachaufbau.dampfbremse) {
      positionen.push({
        bezeichnung: 'Dampfbremse',
        menge: dachaufbau.dampfbremse.flaecheM2,
        einheit: 'm²',
        preisProEinheit: cfg.dampfbremsePreisProM2,
        gesamt: Math.round(dachaufbau.dampfbremse.flaecheM2 * cfg.dampfbremsePreisProM2),
      });
    }

    // Verbindungsmittel – jede Position einzeln
    for (const vmPos of vm.positionen) {
      if (vmPos.gewichtKg > 0) {
        positionen.push({
          bezeichnung: `${vmPos.bezeichnung} (${vmPos.dimension})`,
          menge: vmPos.gewichtKg,
          einheit: 'kg',
          preisProEinheit: cfg.verbindungsmittelPreisProKg,
          gesamt: Math.round(vmPos.gewichtKg * cfg.verbindungsmittelPreisProKg),
        });
      }
    }

    const materialkosten = positionen.reduce((s, p) => s + p.gesamt, 0);
    const arbeitskosten = ergebnis.dachflaeche > 0
      ? Math.round(ergebnis.dachflaeche * cfg.arbeitskostenProM2)
      : 0;

    const subtotal = materialkosten + arbeitskosten;
    const aufschlag = Math.round(subtotal * cfg.aufschlagProzent / 100);
    const gesamtNetto = subtotal + aufschlag;
    const mwstSatz = 20;
    const gesamtBrutto = Math.round(gesamtNetto * (1 + mwstSatz / 100));

    return { positionen, materialkosten, arbeitskosten, subtotal, aufschlag, gesamtNetto, gesamtBrutto, mwstSatz };
  }
}
