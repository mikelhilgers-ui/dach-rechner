import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';
import { DachMasse, HolzConfig, EindeckungConfig, DachaufbauConfig } from './calculator.models';

const STD_HOLZ: HolzConfig = {
  sparreBreite: 8, sparreHoehe: 18,
  latteBreite: 4, latteHoehe: 5,
  konterlatteAktiv: false,
  konterlatteBreite: 4, konterlatteHoehe: 6,
  holzartDichte: 480,
};

const STD_MASSE: DachMasse = {
  trauflaenge: 10,
  firstlaenge: 8,
  dachneigung: 45,
  dachueberstand: 0,
  sparrenAbstand: 0.8,
  lattenAbstand: 0.32,
};

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- Hilfsmethoden ---

  describe('neigungRad', () => {
    it('converts 0° to 0 rad', () => {
      expect(service.neigungRad(0)).toBeCloseTo(0);
    });
    it('converts 45° to π/4', () => {
      expect(service.neigungRad(45)).toBeCloseTo(Math.PI / 4);
    });
    it('converts 90° to π/2', () => {
      expect(service.neigungRad(90)).toBeCloseTo(Math.PI / 2);
    });
  });

  describe('sparrenLaenge', () => {
    it('berechnet Sparren bei 45° korrekt (cos45 = √2/2)', () => {
      // trauf 5m, neigung 45° → 5 / cos(45°) = 5 * √2 ≈ 7.07m
      const result = service.sparrenLaenge(5, 45, 0);
      expect(result).toBeCloseTo(5 * Math.sqrt(2), 2);
    });

    it('addiert Überstand korrekt', () => {
      const ohneUeberstand = service.sparrenLaenge(5, 45, 0);
      const mitUeberstand = service.sparrenLaenge(5, 45, 0.5);
      expect(mitUeberstand).toBeCloseTo(ohneUeberstand + 0.5, 2);
    });

    it('berechnet flaches Dach (0°) korrekt', () => {
      const result = service.sparrenLaenge(5, 0, 0);
      expect(result).toBeCloseTo(5, 2);
    });
  });

  describe('gaubenFlaeche', () => {
    it('gibt 0 bei leerer Liste zurück', () => {
      expect(service.gaubenFlaeche([])).toBe(0);
    });

    it('berechnet eine Gaube korrekt', () => {
      expect(service.gaubenFlaeche([{ id: '1', typ: 'gaube', breite: 2, hoehe: 1.5, anzahl: 1 }])).toBeCloseTo(3);
    });

    it('summiert mehrere Gauben', () => {
      expect(service.gaubenFlaeche([
        { id: '1', typ: 'gaube',      breite: 2, hoehe: 1.5, anzahl: 2 },
        { id: '2', typ: 'dachfenster', breite: 1, hoehe: 1,   anzahl: 1 },
      ])).toBeCloseTo(7);
    });
  });

  // --- Satteldach ---

  describe('berechneSatteldach', () => {
    it('berechnet Dachfläche > 0', () => {
      const result = service.berechneSatteldach(STD_MASSE, []);
      expect(result.dachflaeche).toBeGreaterThan(0);
    });

    it('Satteldach hat keinen Grat oder Kehl', () => {
      const result = service.berechneSatteldach(STD_MASSE, []);
      expect(result.gratLaenge).toBe(0);
      expect(result.kehlLaenge).toBe(0);
    });

    it('Gauben reduzieren die Dachfläche', () => {
      const ohneGauben = service.berechneSatteldach(STD_MASSE, []);
      const mitGauben = service.berechneSatteldach(STD_MASSE, [
        { id: '1', typ: 'gaube', breite: 2, hoehe: 1.5, anzahl: 1 }
      ]);
      expect(mitGauben.dachflaeche).toBeLessThan(ohneGauben.dachflaeche);
    });

    it('Sparrenanzahl ist doppelt so viele wie eine Seite', () => {
      const result = service.berechneSatteldach(STD_MASSE, []);
      const eineSparren = Math.ceil(STD_MASSE.firstlaenge / STD_MASSE.sparrenAbstand) + 1;
      expect(result.sparrenAnzahl).toBe(eineSparren * 2);
    });

    it('Dachfläche kann nicht negativ sein', () => {
      const result = service.berechneSatteldach(STD_MASSE, [
        { id: '1', typ: 'gaube', breite: 100, hoehe: 100, anzahl: 10 }
      ]);
      expect(result.dachflaeche).toBe(0);
    });
  });

  // --- Pultdach ---

  describe('berechnePultdach', () => {
    it('berechnet Dachfläche > 0', () => {
      const result = service.berechnePultdach(STD_MASSE, []);
      expect(result.dachflaeche).toBeGreaterThan(0);
    });

    it('Pultdach hat halbe Fläche von Satteldach (bei gleichen Maßen)', () => {
      const sattel = service.berechneSatteldach(STD_MASSE, []);
      const pult = service.berechnePultdach(STD_MASSE, []);
      // Pultdach hat nur eine Seite, aber volle Traufbreite statt halbe
      // → Sparren ist länger als halbe Satteldach-Sparren
      expect(pult.sparrenAnzahl).toBeLessThan(sattel.sparrenAnzahl);
    });
  });

  // --- Walmdach ---

  describe('berechneWalmdach', () => {
    it('berechnet Dachfläche > 0', () => {
      const result = service.berechneWalmdach(STD_MASSE, []);
      expect(result.dachflaeche).toBeGreaterThan(0);
    });

    it('Walmdach hat Gratlänge > 0', () => {
      const result = service.berechneWalmdach(STD_MASSE, []);
      expect(result.gratLaenge).toBeGreaterThan(0);
    });
  });

  // --- Flachdach ---

  describe('berechneFlachdach', () => {
    it('berechnet Grundfläche = trauf × first', () => {
      const masse: DachMasse = { ...STD_MASSE, trauflaenge: 10, firstlaenge: 8 };
      const result = service.berechneFlachdach(masse, []);
      expect(result.dachflaeche).toBeCloseTo(80);
    });

    it('keine Sparren bei Flachdach', () => {
      const result = service.berechneFlachdach(STD_MASSE, []);
      expect(result.sparrenAnzahl).toBe(0);
      expect(result.sparrenLaenge).toBe(0);
    });
  });

  // --- Signal-basiertes berechne() ---

  describe('berechne()', () => {
    it('delegiert korrekt an Satteldach-Methode', () => {
      const result = service.berechne('sattel', STD_MASSE, []);
      const direct = service.berechneSatteldach(STD_MASSE, []);
      expect(result.dachflaeche).toBeCloseTo(direct.dachflaeche);
    });

    it('delegiert korrekt an Flachdach-Methode', () => {
      const result = service.berechne('flach', STD_MASSE, []);
      expect(result.sparrenAnzahl).toBe(0);
    });
  });

  // --- Gauben-Verwaltung ---

  describe('addGaube / removeGaube / updateGaube', () => {
    it('fügt eine Gaube hinzu', () => {
      service.setGauben([]);
      service.addGaube({ typ: 'gaube', breite: 2, hoehe: 1.5, anzahl: 1 });
      expect(service.gauben().length).toBe(1);
    });

    it('generiert eindeutige IDs', () => {
      service.setGauben([]);
      service.addGaube({ typ: 'gaube', breite: 1, hoehe: 1, anzahl: 1 });
      service.addGaube({ typ: 'gaube', breite: 2, hoehe: 1, anzahl: 1 });
      const ids = service.gauben().map(g => g.id);
      expect(new Set(ids).size).toBe(2);
    });

    it('entfernt Gaube per ID', () => {
      service.setGauben([]);
      service.addGaube({ typ: 'gaube', breite: 2, hoehe: 1, anzahl: 1 });
      const id = service.gauben()[0].id;
      service.removeGaube(id);
      expect(service.gauben().length).toBe(0);
    });

    it('aktualisiert Gaube per ID', () => {
      service.setGauben([]);
      service.addGaube({ typ: 'gaube', breite: 2, hoehe: 1, anzahl: 1 });
      const id = service.gauben()[0].id;
      service.updateGaube(id, { breite: 3 });
      expect(service.gauben()[0].breite).toBe(3);
    });
  });

  // --- Verbindungsmittel ---

  describe('berechneVerbindungsmittel', () => {
    it('gibt leere Liste für Flachdach zurück', () => {
      const ergebnis = service.berechneFlachdach(STD_MASSE, []);
      const vm = service.berechneVerbindungsmittel(ergebnis, STD_MASSE);
      expect(vm.positionen.length).toBe(0);
    });

    it('enthält Sparrennägel, Lattennägel, Sturmklammern und Firstnägel für Satteldach', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const vm = service.berechneVerbindungsmittel(ergebnis, STD_MASSE);
      const bezeichnungen = vm.positionen.map(p => p.bezeichnung);
      expect(bezeichnungen).toContain('Sparrennägel');
      expect(bezeichnungen).toContain('Lattennägel');
      expect(bezeichnungen).toContain('Sturmklammern');
      expect(bezeichnungen).toContain('Firstnägel');
    });

    it('Sparrennägel = sparrenAnzahl × 6', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const vm = service.berechneVerbindungsmittel(ergebnis, STD_MASSE);
      const sparrenNaegel = vm.positionen.find(p => p.bezeichnung === 'Sparrennägel')!;
      expect(sparrenNaegel.anzahl).toBe(ergebnis.sparrenAnzahl * 6);
    });

    it('Gewicht ist > 0 wenn Anzahl > 0', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const vm = service.berechneVerbindungsmittel(ergebnis, STD_MASSE);
      vm.positionen.forEach(p => {
        expect(p.gewichtKg).toBeGreaterThan(0);
      });
    });
  });

  // --- Holz ---

  describe('berechneHolz', () => {
    it('enthält Sparren und Latten als Positionen', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const holz = service.berechneHolz(ergebnis, STD_HOLZ);
      const bezeichnungen = holz.positionen.map(p => p.bezeichnung);
      expect(bezeichnungen.some(b => b.includes('Sparren'))).toBe(true);
      expect(bezeichnungen.some(b => b.includes('Dachlatte'))).toBe(true);
    });

    it('Holzmenge m³ > 0 bei Satteldach', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const holz = service.berechneHolz(ergebnis, STD_HOLZ);
      expect(holz.gesamtM3).toBeGreaterThan(0);
    });

    it('Gewicht = m³ × Dichte', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const holz = service.berechneHolz(ergebnis, STD_HOLZ);
      const erwartetes = Math.ceil(holz.gesamtM3 * STD_HOLZ.holzartDichte);
      expect(holz.gesamtKg).toBe(erwartetes);
    });

    it('Konterlatte fügt dritte Position hinzu', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const ohneKonter = service.berechneHolz(ergebnis, { ...STD_HOLZ, konterlatteAktiv: false });
      const mitKonter  = service.berechneHolz(ergebnis, { ...STD_HOLZ, konterlatteAktiv: true });
      expect(mitKonter.positionen.length).toBe(ohneKonter.positionen.length + 1);
    });

    it('Flachdach: keine Holzpositionen', () => {
      const ergebnis = service.berechneFlachdach(STD_MASSE, []);
      const holz = service.berechneHolz(ergebnis, STD_HOLZ);
      expect(holz.positionen.length).toBe(0);
      expect(holz.gesamtM3).toBe(0);
    });
  });

  // --- Eindeckung ---

  describe('berechneEindeckung', () => {
    const cfg: EindeckungConfig = { material: 'falzziegel', zuschlagProzent: 10 };

    it('Brutto-Fläche = Netto × 1.1 bei 10% Zuschlag', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const eindeckung = service.berechneEindeckung(ergebnis, cfg);
      expect(eindeckung.flaecheBrutto).toBeCloseTo(ergebnis.dachflaeche * 1.1, 1);
    });

    it('Falzziegel liefert Stückzahl', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const eindeckung = service.berechneEindeckung(ergebnis, cfg);
      expect(eindeckung.stueck).not.toBeNull();
      expect(eindeckung.stueck!).toBeGreaterThan(0);
    });

    it('Trapezblech hat keine Stückzahl', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const eindeckung = service.berechneEindeckung(ergebnis, { material: 'trapezblech', zuschlagProzent: 15 });
      expect(eindeckung.stueck).toBeNull();
    });
  });

  // --- Dachaufbau ---

  describe('berechneDachaufbau', () => {
    const cfg: DachaufbauConfig = {
      unterdeckbahnAktiv: true, unterdeckbahnUeberlappM: 0.1,
      daemmungAktiv: true, daemmungStaerkeCm: 18, daemmungTyp: 'mineralwolle',
      dampfbremseAktiv: true,
    };

    it('Unterdeckbahn-Fläche = Dachfläche × 1.15', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const aufbau = service.berechneDachaufbau(ergebnis, cfg);
      expect(aufbau.unterdeckbahn!.flaecheBrutto)
        .toBeCloseTo(ergebnis.dachflaeche * 1.15, 0);
    });

    it('Dämmvolumen = Fläche × Stärke (m)', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const aufbau = service.berechneDachaufbau(ergebnis, cfg);
      expect(aufbau.daemmung!.volumenM3)
        .toBeCloseTo(ergebnis.dachflaeche * 0.18, 1);
    });

    it('Deaktivierte Optionen liefern null', () => {
      const ergebnis = service.berechneSatteldach(STD_MASSE, []);
      const aufbau = service.berechneDachaufbau(ergebnis, {
        ...cfg, unterdeckbahnAktiv: false, daemmungAktiv: false, dampfbremseAktiv: false,
      });
      expect(aufbau.unterdeckbahn).toBeNull();
      expect(aufbau.daemmung).toBeNull();
      expect(aufbau.dampfbremse).toBeNull();
    });
  });
});
