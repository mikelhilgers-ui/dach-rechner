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

### Preiskalkulation + Export (heute)
- [x] `PreisConfig` + `berechnePreise()`: Material, Arbeit, Aufschlag, MwSt.
- [x] `PreisKalkulationComponent`: 7 editierbare Preise → Live-Kalkulation mit Brutto-Summe
- [x] `PdfExportService` (jsPDF): mehrseitiges PDF, alle Sektionen, Firmenname, Brutto-Box
- [x] `ExcelExportService` (SheetJS): 3 Blätter (Übersicht, Materialien, Preiskalkulation)
- [x] `ExportButtonsComponent`: Firmenname + Projektname, PDF/Excel Download
- [x] 44/44 Tests grün ✅

---

## ✅ Sprint 1 – ABGESCHLOSSEN

Alle geplanten Features sind fertig. Bereit für Sprint 2 (Auth + Supabase).

---

## 📋 Nächste Schritte (Sprint 2)

1. Supabase Account anlegen
2. Register / Login Komponenten
3. Newsletter Opt-in (DSGVO)
4. Projekte speichern (max. 3)
5. Firmenname im Profil speichern

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
