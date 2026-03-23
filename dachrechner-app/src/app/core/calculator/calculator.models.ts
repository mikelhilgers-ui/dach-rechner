export type Dachform = 'sattel' | 'pult' | 'walm' | 'flach';

export interface DachMasse {
  trauflaenge: number;       // m
  firstlaenge: number;       // m (bei Sattel/Walm)
  dachneigung: number;       // Grad
  dachueberstand: number;    // m
  sparrenAbstand: number;    // m
  lattenAbstand: number;     // m
}

export interface GaubeConfig {
  id: string;
  typ: 'gaube' | 'dachfenster';
  breite: number;            // m
  hoehe: number;             // m
  anzahl: number;
  bezeichnung?: string;
}

export interface DachErgebnis {
  dachflaeche: number;       // m²
  sparrenLaenge: number;     // m
  sparrenAnzahl: number;
  lattenAnzahl: number;
  lattenLaenge: number;      // m gesamt
  firstLaenge: number;       // m
  traufLaenge: number;       // m
  kehlLaenge: number;        // m (bei Walm)
  gratLaenge: number;        // m (bei Walm)
}

export interface VerbindungsmittelPosition {
  bezeichnung: string;       // z.B. "Sparrennägel 4.5×120"
  dimension: string;         // z.B. "4.5 × 120 mm"
  anzahl: number;
  gewichtKg: number;         // ca. Gewicht (für Bestellung)
  hinweis?: string;
}

export interface VerbindungsmittelErgebnis {
  positionen: VerbindungsmittelPosition[];
}

export interface CalculatorState {
  dachform: Dachform;
  masse: DachMasse;
  gauben: GaubeConfig[];
  ergebnis: DachErgebnis | null;
}
