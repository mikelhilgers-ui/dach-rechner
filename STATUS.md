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
- [x] `calculator.service.spec.ts` – 44 Unit Tests, alle grün ✅

---

### Calculator UI (Sprint 1)
- [x] App Shell (Toolbar, sticky, responsive)
- [x] Routing (Lazy Loading `/rechner`)
- [x] `DachformAuswahlComponent` – 4 Karten (Sattel/Pult/Walm/Flach), aktiv-Hervorhebung
- [x] `MasseEingabeComponent` – reaktives Formular, Validierung, Formularfelder je Dachform
- [x] `ErgebnisPanelComponent` – Live-Ergebnis via Signals, sticky auf Desktop
- [x] `CalculatorComponent` – 2-Spalten-Layout (Eingabe | Ergebnis)

---

### Gauben, Verbindungsmittel
- [x] `GaubeConfig` um `id` + `typ` erweitert
- [x] `GaubenEingabeComponent` – Gauben/Dachfenster hinzufügen, bearbeiten, entfernen
- [x] `VerbindungsmittelErgebnis` Model + Berechnung im Service
- [x] Verbindungsmittel direkt in Preiskalkulation integriert (kein eigener Card)

---

### Holz, Eindeckung, Dachaufbau
- [x] `HolzConfig` + `berechneHolz()`: Sparren/Latten/Konterlatte → lfdm, m³, kg
- [x] `EindeckungConfig` + `berechneEindeckung()`: 7 Materialien, Stückzahl, Zuschlag
- [x] `DachaufbauConfig` + `berechneDachaufbau()`: Unterdeckbahn, Dämmung, Dampfbremse
- [x] `HolzEingabeComponent`, `EindeckungEingabeComponent`, `DachaufbauEingabeComponent`

---

### Preiskalkulation + PDF Export
- [x] `PreisConfig` + `berechnePreise()`: Material, Arbeit, Aufschlag, MwSt.
- [x] Dampfbremse hat eigenen Preis (`dampfbremsePreisProM2`)
- [x] `PreisKalkulationComponent`: 8 editierbare Preise → Live-Kalkulation mit Brutto-Summe
- [x] `PdfExportService` (jsPDF): mehrseitiges PDF, alle Sektionen, Anthrazit-Design
- [x] Excel Export entfernt (würde Tool überflüssig machen)
- [x] `ExportButtonsComponent`: Firmenname + Projektname, PDF Download
- [x] 44/44 Tests grün ✅

---

### Design & UX
- [x] Dark / Light Mode Toggle (speichert in localStorage, erkennt System-Preference)
- [x] Farbschema Anthrazit/Slate (statt Blau)
- [x] PWA Icon (Haus-Silhouette, alle Größen 72–512px)
- [x] "App installieren" Button in Toolbar (Android/Chrome/Edge)
- [x] Mobile: Export-Felder untereinander
- [x] Mehr Abstand zwischen Cards (24px)

---

### Deployment
- [x] GitHub Repo: `https://github.com/mikelhilgers-ui/dach-rechner`
- [x] Vercel: `https://dach-rechner.vercel.app` (auto-deploy bei git push)
- [x] Vercel Analytics aktiv (Besucher, Land, Gerät, Browser)
- [x] PWA: als App installierbar auf Android + iOS

---

## ✅ Sprint 1 – ABGESCHLOSSEN + LIVE

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
- jsPDF (Client-side PDF)
- Vercel (Hosting + Analytics)
- Tests: Vitest (ng test --watch=false)

---

## 📌 Entscheidungen

- Phase 1: Reines Frontend, kein Auth, keine DB
- Vitest statt Karma (Angular 21 Standard)
- Signals für reaktive State-Verwaltung
- Excel Export entfernt → würde Tool überflüssig machen
- Anthrazit/Slate statt Blau als Primärfarbe
- Vercel Analytics statt Plausible (kostenlos, kein Code nötig)
