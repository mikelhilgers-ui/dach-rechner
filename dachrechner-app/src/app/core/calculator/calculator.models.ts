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
  bezeichnung: string;
  dimension: string;
  anzahl: number;
  gewichtKg: number;
  hinweis?: string;
}

export interface VerbindungsmittelErgebnis {
  positionen: VerbindungsmittelPosition[];
}

// --- Holz ---

export interface HolzConfig {
  sparreBreite: number;        // cm, z.B. 8
  sparreHoehe: number;         // cm, z.B. 18
  latteBreite: number;         // cm, z.B. 4
  latteHoehe: number;          // cm, z.B. 5
  konterlatteAktiv: boolean;
  konterlatteBreite: number;   // cm, z.B. 4
  konterlatteHoehe: number;    // cm, z.B. 6
  holzartDichte: number;       // kg/m³, Fichte=480, Kiefer=520, Lärche=590
}

export interface HolzPosition {
  bezeichnung: string;         // z.B. "Sparren 8/18"
  querschnitt: string;         // "8 × 18 cm"
  stueck: number;
  lfdm: number;
  m3: number;
  gewichtKg: number;
}

export interface HolzErgebnis {
  positionen: HolzPosition[];
  gesamtM3: number;
  gesamtKg: number;
}

// --- Eindeckung ---

export type EindeckungMaterial =
  | 'falzziegel'
  | 'betondachstein'
  | 'biberschwanz'
  | 'schiefer'
  | 'trapezblech'
  | 'bitumenschindeln'
  | 'gruendach';

export interface EindeckungConfig {
  material: EindeckungMaterial;
  zuschlagProzent: number;     // % Verschnitt/Überlapp, default 10
}

export interface EindeckungErgebnis {
  material: string;
  flaecheBrutto: number;       // m² inkl. Zuschlag
  stueck: number | null;       // Stück bei Ziegeln/Schiefer, null bei Flächenmaterial
  stueckProM2: number | null;
  einheit: string;             // "Stk" | "m²" | "lfm"
  hinweis: string;
}

// --- Dachaufbau ---

export interface DachaufbauConfig {
  unterdeckbahnAktiv: boolean;
  unterdeckbahnUeberlappM: number;  // m Überlappung pro Bahn, default 0.1

  daemmungAktiv: boolean;
  daemmungStaerkeCm: number;        // cm
  daemmungTyp: 'mineralwolle' | 'holzfaser' | 'pur';

  dampfbremseAktiv: boolean;
}

export interface DachaufbauErgebnis {
  unterdeckbahn: { flaecheBrutto: number; rollen: number } | null;
  daemmung: { volumenM3: number; flaecheM2: number; typ: string; bezeichnung: string } | null;
  dampfbremse: { flaecheM2: number } | null;
}

export interface CalculatorState {
  dachform: Dachform;
  masse: DachMasse;
  gauben: GaubeConfig[];
  ergebnis: DachErgebnis | null;
}
