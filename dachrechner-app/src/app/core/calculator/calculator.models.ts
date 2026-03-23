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
  breite: number;            // m
  hoehe: number;             // m
  anzahl: number;
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

export interface CalculatorState {
  dachform: Dachform;
  masse: DachMasse;
  gauben: GaubeConfig[];
  ergebnis: DachErgebnis | null;
}
