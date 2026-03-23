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

## 🚧 In Arbeit

- [ ] Calculator UI Component (Dachform-Auswahl + Maßeingabe)
- [ ] Ergebnis-Panel (live mit Signals)

---

## 📋 Nächste Schritte (Sprint 1)

1. Calculator Hauptkomponente mit Material-Tabs
2. Dachform-Auswahl (Karten/Chips)
3. Maßeingabe-Formular je Dachform
4. Live-Ergebnis-Panel
5. Verbindungsmittel-Tab
6. Gauben & Dachfenster
7. Preiskalkulation
8. PDF Export (jsPDF)
9. Excel Export (SheetJS)
10. Canvas-Visualisierung (optional für Sprint 1)

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
