# DachRechner – Projektstatus
> Zuletzt aktualisiert: 2026-03-23

---

## ✅ Erledigt

### Projekt-Setup
- [x] Angular 21 Projekt initialisiert (`dachrechner-app/`)
- [x] Angular Material eingebunden
- [x] PWA Support eingebunden (@angular/pwa)
- [x] Ordnerstruktur angelegt (core, features, shared)

### Berechnungslogik (Sprint 1)
- [x] `calculator.models.ts` – Typen & Interfaces (Dachform, Maße, Ergebnis)
- [x] `calculator.service.ts` – Berechnungslogik mit Signals
  - Satteldach, Pultdach, Walmdach, Flachdach
  - Sparren, Latten, Flächen, Grat, Kehl
  - Gauben-Abzug
- [x] `calculator.service.spec.ts` – 25 Unit Tests, alle grün ✅

---

### Calculator UI (Sprint 1)
- [x] App Shell (Toolbar, sticky, responsive)
- [x] Routing (Lazy Loading `/rechner`)
- [x] `DachformAuswahlComponent` – 4 Karten (Sattel/Pult/Walm/Flach), aktiv-Hervorhebung
- [x] `MasseEingabeComponent` – reaktives Formular, Validierung, Formularfelder je Dachform
- [x] `ErgebnisPanelComponent` – Live-Ergebnis via Signals, sticky auf Desktop
- [x] `CalculatorComponent` – 2-Spalten-Layout (Eingabe | Ergebnis)
- [x] Build fehlerfrei, 25/25 Tests grün ✅

---

### Gauben, Verbindungsmittel (heute)
- [x] `GaubeConfig` um `id` + `typ` erweitert
- [x] `GaubenEingabeComponent` – Gauben/Dachfenster hinzufügen, bearbeiten, entfernen
- [x] `VerbindungsmittelErgebnis` Model + Berechnung im Service (Sparrennägel, Lattennägel, Sturmklammern, Firstnägel)
- [x] `VerbindungsmittelComponent` – Tabelle mit Anzahl + kg-Gewicht
- [x] Calculator-Layout um beide Sektionen erweitert
- [x] 33/33 Tests grün ✅

---

### Holz, Eindeckung, Dachaufbau (heute)
- [x] `HolzConfig` + `berechneHolz()`: Sparren/Latten/Konterlatte → lfdm, m³, kg
- [x] `EindeckungConfig` + `berechneEindeckung()`: 7 Materialien, Stückzahl, Zuschlag
- [x] `DachaufbauConfig` + `berechneDachaufbau()`: Unterdeckbahn, Dämmung, Dampfbremse
- [x] `HolzEingabeComponent`: Querschnitt-Auswahl + Live-Vorschau m³/kg
- [x] `EindeckungEingabeComponent`: Materialauswahl + Live-Ergebnis
- [x] `DachaufbauEingabeComponent`: Toggles für alle 3 Schichten
- [x] Ergebnis-Panel: alle Materialien in Sektionen
- [x] 44/44 Tests grün ✅

---

## 🚧 In Arbeit

---

## 📋 Nächste Schritte (Sprint 1)

1. Preiskalkulation (Materialpreise → Gesamtkosten)
2. PDF Export (jsPDF)
3. Excel Export (SheetJS)
4. Canvas-Visualisierung (optional)

---

## 🔧 Tech

- Angular 21 (Standalone, Signals, Vitest)
- Angular Material 21
- Node 24, npm 11
- Tests: Vitest (ng test --watch=false)

---

## 📌 Entscheidungen

- Phase 1: Reines Frontend, kein Auth, keine DB
- Vitest statt Karma (Angular 21 Standard)
- Signals für reaktive State-Verwaltung
