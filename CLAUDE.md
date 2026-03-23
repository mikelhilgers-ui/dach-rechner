# DachRechner – Master Projektdokumentation
> Letzter Stand: Phase 1 Launch-Strategie (alle Features kostenlos)
> Erstellt: März 2026

---

## 🎯 Vision & Strategie

**Kurzfastig:** Kostenloser Dachflächen-Rechner für Zimmerer im DACH-Raum als
Lead-Magnet und Newsletter-Liste für spätere kostenpflichtige Produkte.

**Langfristig:** Plattform für Zimmerei-Software (DachRechner → Planungstool → weitere Tools)

### Das große Bild
```
DachRechner (kostenlos)
    ↓ Registrierung + Newsletter
    ↓ Vertrauen aufbauen (3-6 Monate)
    ↓ 300-500 registrierte Zimmerer
    ↓
DachRechner PRO (19€/Mo) ← Sprint 4
    ↓ E-Mail-Launch an bestehende Liste
    ↓
Planungstool (49-99€/Mo) ← späteres Produkt
    ↓ Gleiche Liste, höheres Vertrauen
    ↓
Weitere Tools (Stückliste, Bautagebuch, etc.)
```

**Warum Newsletter so wichtig ist:**
- 300 registrierte Nutzer = 300 vorgewärmte Leads für PRO-Launch
- Gleiche Liste für Planungstool = 0€ Marketingkosten
- E-Mail konvertiert 10x besser als kalter Traffic
- Eigener Kanal = unabhängig von Google/Meta Algorithmen

---

## 📅 Release-Phasen

### Phase 1 – Launch (Monat 1-2) ← AKTUELL
```
Ziel: 500 registrierte Nutzer, Newsletter-Liste aufbauen

Features:
✅ Vollständiger Rechner (alle Dachformen)
✅ Verbindungsmittel, Gauben, Preiskalkulation
✅ PDF + Excel Export (mit DachRechner-Branding)
✅ Registrierung (E-Mail + Passwort, Google OAuth)
✅ Newsletter-Opt-in bei Registrierung (DSGVO-konform)
✅ Projekte speichern (FREE: max 3, kein Limit in Phase 1!)
✅ Firmenname im PDF

Kein Stripe, keine Paywall, kein Backend außer Supabase.
```

### Phase 2 – Wachstum (Monat 2-4)
```
Ziel: 200-500 Nutzer, Feedback sammeln, Newsletter nutzen

Aktionen:
- Newsletter #1: "DachRechner ist live – Feedback gesucht"
- Newsletter #2: "Neue Features: Gauben, Excel-Export"
- Newsletter #3: "5 Tipps für schnellere Angebote"
- Plausible Analytics auswerten: was wird genutzt?
- 5-10 Zimmerer direkt anrufen für Feedback
```

### Phase 3 – Monetarisierung (Monat 4-6)
```
Ziel: PRO-Launch mit bestehender Liste

Aktionen:
- Stripe Integration bauen
- PRO-Features definieren (basierend auf Nutzungs-Daten)
- Newsletter: "DachRechner PRO ist da – 14 Tage gratis"
- Erwartete Conversion: 8-15% der Liste → 24-75 PRO-User
- MRR bei 50 Pro-Usern: 950€/Monat
```

### Phase 4 – Planungstool (ab Monat 8)
```
Ziel: Zweites Produkt an bestehende Liste launchen

Newsletter: "Neu: Holzbau-Planungstool – exklusiv für DachRechner-Nutzer"
Vorteil: Liste kennt dich bereits → höhere Conversion als Kaltakquise
```

---

## 💌 Newsletter-Strategie

### Opt-in bei Registrierung (DSGVO-konform)
```
Checkbox bei Registrierung (NICHT vorausgefüllt!):
☐ "Ja, ich möchte über neue Features und Tools für
   Zimmerer informiert werden. Abmeldung jederzeit möglich."

Pflichttext darunter (klein):
"Mit der Registrierung akzeptierst du unsere Datenschutzerklärung.
Der Newsletter ist optional und jederzeit kündbar."
```

### Tool-Empfehlung: Brevo (ehemals Sendinblue)
```
Warum Brevo:
✅ Kostenlos bis 300 Mails/Tag (reicht für Start)
✅ EU-Server (Frankfurt) → DSGVO-konform
✅ Double-Opt-in automatisch
✅ Supabase-Integration über Webhook möglich
✅ Automatisierungen (Willkommens-Sequenz)
✅ Unsubscribe-Link automatisch
Kosten: 0€ bis ~500 Kontakte, dann 25€/Mo

Alternative: Loops.so (moderner, teurer, besser für SaaS)
```

### Willkommens-Sequenz (automatisch nach Registrierung)
```
Tag 0:  Bestätigungs-E-Mail (Supabase Auth, automatisch)
        + Willkommen bei DachRechner

Tag 1:  "3 Tipps für deine erste Berechnung"
        - Wie du Verbindungsmittel richtig einstellst
        - Warum der Dachüberstand wichtig ist
        - PDF mit Firmenname erstellen

Tag 7:  "Hast du schon die Preiskalkulation probiert?"
        - Kurze Anleitung
        - Feedback-Frage: "Was fehlt dir noch?"

Tag 21: "Was wir als nächstes bauen"
        - Vorschau auf neue Features
        - Call-to-Action: Tool einem Kollegen empfehlen
```

### Monatlicher Newsletter-Inhalt
```
Aufbau (max. 300 Wörter):
1. Neues Feature oder Verbesserung (60%)
2. Praxis-Tipp für Zimmerer (30%)
3. Ein Hinweis auf kommendes Produkt (10%) ← dezent!

Themen-Ideen:
- "Neues Feature: Walmdach-Kehlgrat-Berechnung verbessert"
- "Tipp: So erstellst du in 3 Minuten ein Angebot"
- "Vorschau: DachRechner PRO kommt im Sommer"
- "Neu: Planungstool für Holztragwerke in Entwicklung"
```

---

## 🏗 Tech Stack

| Layer | Technologie | Kosten |
|---|---|---|
| Framework | Angular 18 (Standalone) | 0€ |
| UI | Angular Material + Custom SCSS | 0€ |
| Auth + DB | Supabase (EU-Frankfurt) | 0€ bis 500 MAU |
| Hosting | Vercel | 0€ |
| Newsletter | Brevo | 0€ bis 300/Tag |
| Analytics | Plausible.io | 9€/Mo |
| Domain | dachrechner.at + .de | ~20€/Jahr |
| PDF | jsPDF (Client-side) | 0€ |
| Excel | SheetJS (Client-side) | 0€ |
| **GESAMT Phase 1** | | **~30€/Monat** |

---

## 📁 Angular Projektstruktur

```
dachrechner-app/
├── CLAUDE.md                        ← Projekt-Dokumentation
├── angular.json
├── package.json
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts      ← Supabase Auth + Plan-Check
│   │   │   │   ├── auth.guard.ts        ← Login erforderlich
│   │   │   │   └── pro.guard.ts         ← PRO erforderlich (Phase 3)
│   │   │   ├── analytics/
│   │   │   │   └── analytics.service.ts ← Plausible Events
│   │   │   ├── newsletter/
│   │   │   │   └── newsletter.service.ts ← Brevo API
│   │   │   └── calculator/
│   │   │       └── calculator.service.ts ← Berechnungslogik
│   │   ├── features/
│   │   │   ├── calculator/              ← Hauptrechner (Sprint 1)
│   │   │   │   ├── calculator.component.ts
│   │   │   │   ├── dachform/
│   │   │   │   ├── masse/
│   │   │   │   ├── verbindungsmittel/
│   │   │   │   ├── gauben/
│   │   │   │   ├── kalkulation/
│   │   │   │   └── results/
│   │   │   ├── export/                  ← PDF & Excel (Sprint 1)
│   │   │   │   ├── pdf-export.service.ts
│   │   │   │   └── excel-export.service.ts
│   │   │   ├── auth/                    ← Login (Sprint 2)
│   │   │   │   ├── login.component.ts
│   │   │   │   └── register.component.ts
│   │   │   ├── projects/                ← Speicherung (Sprint 2)
│   │   │   │   ├── project-list.component.ts
│   │   │   │   └── project-detail.component.ts
│   │   │   └── upgrade/                 ← PRO (Sprint 4)
│   │   │       └── upgrade.component.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── pro-lock/            ← Vorbereitet, noch nicht aktiv
│   │   │   │   ├── upgrade-banner/
│   │   │   │   └── newsletter-opt-in/   ← Wiederverwendbare Komponente
│   │   │   └── pipes/
│   │   │       └── format-number.pipe.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts               ← Supabase Keys (DEV)
│   │   └── environment.prod.ts          ← Supabase Keys (PROD)
│   └── manifest.webmanifest
└── supabase/
    └── migrations/
        └── 001_initial.sql
```

---

## 🗄 Datenbank Schema (Supabase)

```sql
-- Profile (wird bei Registrierung automatisch angelegt)
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id),
  email           TEXT NOT NULL,
  name            TEXT,
  firma           TEXT,
  logo_url        TEXT,           -- Phase 3: PRO
  plan            TEXT DEFAULT 'free', -- 'free' | 'pro'
  newsletter_opt_in BOOLEAN DEFAULT false,
  newsletter_confirmed_at TIMESTAMPTZ, -- Double-Opt-in Zeitstempel
  stripe_customer_id TEXT,        -- Phase 3: PRO
  stripe_subscription_id TEXT,    -- Phase 3: PRO
  subscription_status TEXT,       -- Phase 3: PRO
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Projekte
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT 'Neues Projekt',
  kunde       TEXT,
  datum       DATE DEFAULT CURRENT_DATE,
  dachform    TEXT DEFAULT 'sattel',
  config      JSONB NOT NULL DEFAULT '{}', -- alle Eingabewerte
  results     JSONB NOT NULL DEFAULT '{}', -- berechnete Ergebnisse
  share_token TEXT UNIQUE,                 -- Phase 3: Teilen per Link
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: updated_at automatisch setzen
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security: jeder sieht nur eigene Projekte
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);
```

---

## 💌 Newsletter Integration (Brevo)

```typescript
// newsletter.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  // Brevo API Key aus environment
  private apiKey = environment.brevoApiKey;

  constructor(private http: HttpClient) {}

  // Nutzer zu Brevo-Liste hinzufügen (nach Opt-in Bestätigung)
  async subscribeUser(email: string, name: string, firma: string) {
    return this.http.post('https://api.brevo.com/v3/contacts', {
      email,
      attributes: { FIRSTNAME: name, FIRMA: firma, TOOL: 'DachRechner' },
      listIds: [1],          // Liste "DachRechner Nutzer" in Brevo
      updateEnabled: true,
    }, {
      headers: { 'api-key': this.apiKey }
    }).toPromise();
  }

  // Später: Tag setzen wenn PRO wird
  async tagAsPro(email: string) {
    return this.http.post('https://api.brevo.com/v3/contacts', {
      email,
      attributes: { PLAN: 'PRO', PRO_SINCE: new Date().toISOString() },
      listIds: [2],          // Liste "DachRechner PRO"
    }, {
      headers: { 'api-key': this.apiKey }
    }).toPromise();
  }
}
```

### Registrierungsformular mit Newsletter-Opt-in
```typescript
// register.component.ts
registerForm = this.fb.group({
  email:      ['', [Validators.required, Validators.email]],
  password:   ['', [Validators.required, Validators.minLength(8)]],
  name:       ['', Validators.required],
  firma:      [''],
  // Newsletter: NICHT vorausgefüllt (DSGVO!)
  newsletter: [false],
});

async register() {
  const { email, password, name, firma, newsletter } = this.registerForm.value;

  // 1. Supabase Auth
  const { data, error } = await this.supabase.auth.signUp({ email, password });
  if (error) { this.handleError(error); return; }

  // 2. Profil anlegen
  await this.supabase.from('profiles').insert({
    id: data.user.id,
    email, name, firma,
    newsletter_opt_in: newsletter,
  });

  // 3. Zu Brevo hinzufügen wenn Opt-in
  if (newsletter) {
    await this.newsletter.subscribeUser(email, name, firma);
    // Brevo sendet automatisch Double-Opt-in E-Mail
  }

  // 4. Analytics
  this.analytics.trackEvent('User Registered', {
    newsletter: newsletter ? 'yes' : 'no'
  });

  this.router.navigate(['/calculator']);
}
```

---

## 📊 Analytics Events (Plausible.io)

```typescript
// Alle wichtigen Events tracken
// → nach 2 Monaten siehst du was Nutzer wirklich brauchen

// Registrierung
trackEvent('User Registered', { newsletter: 'yes/no' })

// Rechner
trackEvent('Calculation Done', { dachform: 'sattel/pult/walm/flach' })
trackEvent('Gauben Added', { count: '1/2/3' })
trackEvent('PDF Downloaded', { plan: 'free/pro' })
trackEvent('Excel Downloaded', { plan: 'free/pro' })

// Projekte
trackEvent('Project Saved')
trackEvent('Project Limit Reached')  // ← wichtig für PRO-Timing

// Conversion
trackEvent('Upgrade Banner Seen')
trackEvent('Upgrade Clicked', { trigger: 'project-limit/logo/pdf' })
trackEvent('Pro Activated')
```

---

## 🔒 Feature-Matrix (aktuell & geplant)

| Feature | Phase 1 (jetzt) | Phase 3 (PRO) |
|---|---|---|
| Alle Berechnungen | ✅ kostenlos | ✅ |
| Gauben & Dachfenster | ✅ kostenlos | ✅ |
| Preiskalkulation | ✅ kostenlos | ✅ |
| Verbindungsmittel | ✅ kostenlos | ✅ |
| PDF (DachRechner-Brand) | ✅ kostenlos | ✅ |
| Excel Export | ✅ kostenlos | ✅ |
| Firmenname im PDF | ✅ nach Login | ✅ |
| Projekte speichern | ✅ max 3 nach Login | ✅ unbegrenzt |
| **Logo-Upload** | ❌ → PRO | ✅ |
| **Angebots-PDF** | ❌ → PRO | ✅ |
| **Projekt teilen** | ❌ → PRO | ✅ |
| **Offline PWA** | ❌ → PRO | ✅ |

> Features können jederzeit von Free → PRO verschoben werden
> (Angular: 1 Zeile Code). Entscheidung basierend auf Plausible-Daten.

---

## 🚀 Sprint-Plan

### Sprint 1 – Vollständiger Rechner (Woche 1-2)
```
ng new dachrechner-app --routing --style=scss --standalone
ng add @angular/pwa
ng add @angular/material

Deliverable: Vollständiger Rechner ohne Auth
- Alle Dachformen + Canvas-Visualisierung
- Alle Material-Tabs (Sparren, Latten, Eindeckung)
- Verbindungsmittel-Tab
- Gauben & Dachfenster
- Preiskalkulation
- Ergebnis-Panel (live)
- PDF Export (jsPDF)
- Excel Export (SheetJS)
- Responsive (Desktop + Tablet + Mobile)
- Plausible Analytics einbinden
```

### Sprint 2 – Auth + Newsletter (Woche 3-4)
```
npm install @supabase/supabase-js

Deliverable: Login + Projektspeicherung + Newsletter
- Supabase Projekt anlegen
- Register / Login Komponenten
- Newsletter Opt-in (Brevo Double-Opt-in)
- Projekte speichern (max 3, FREE)
- Firmenname im PDF
- Willkommens-E-Mail Sequenz in Brevo einrichten
```

### Sprint 3 – Launch & Marketing (Woche 5-6)
```
Deliverable: Live auf dachrechner.at
- Vercel Deployment
- Domain verbinden (dachrechner.at + .de)
- SEO-Landingpage (unter dem Tool)
- Google Search Console einrichten
- 1 YouTube-Video aufnehmen
- In 3 Zimmerer-Facebook-Gruppen posten
- 10 Zimmerer aus Netzwerk persönlich anschreiben
```

### Sprint 4 – PRO + Stripe (Monat 4-5)
```
Nur starten wenn: 200+ registrierte Nutzer UND
Plausible zeigt welche Features am meisten genutzt werden

npm install ngx-stripe

Deliverable: PRO-Abo mit Stripe
- Stripe Account + Produkt anlegen (19€/Mo, 190€/Jahr)
- Node.js Serverless Functions (Vercel)
- Checkout Session + Webhooks
- Logo-Upload (Supabase Storage)
- Angebots-PDF mit Logo
- Customer Portal (Abo-Verwaltung)
- Newsletter Launch: "DachRechner PRO ist da"
```

### Sprint 5 – Planungstool Vorbereitung (Monat 6+)
```
- "Powered by [Planungstool]" dezent im Footer ergänzen
- Newsletter: "Kommt bald: Holzbau-Planungstool"
- Waitlist-Formular für Planungstool
- Link zwischen DachRechner und Planungstool vorbereiten
```

---

## 💡 Konventionen für Claude Code

```
- Angular 18 Standalone Components (kein NgModule)
- Signals statt RxJS wo möglich
- Mobile-First CSS (min-width Media Queries)
- SCSS mit CSS Custom Properties
- Lazy Loading für Feature-Module
- Kein console.log in Production
- Supabase-Keys nur in environment.ts (in .gitignore!)
- Brevo API-Key nur server-side (Supabase Edge Function)
- DSGVO: Newsletter-Checkbox NIEMALS vorausgefüllt
- Double-Opt-in für Newsletter IMMER aktiviert
- Plausible: alle wichtigen User-Actions tracken
- Unit Tests für alle Berechnungslogiken (Jasmine/Karma, Angular Standard)
- Testabdeckung: mindestens alle calculator.service.ts Methoden testen
```

---

## 🔄 Session-Regeln (automatisch, keine Ausnahmen)

> **Session-Start:** Lies `STATUS.md` und gib eine kurze Zusammenfassung:
> Was ist fertig, was läuft, was sind die nächsten Schritte.
> Frage dann womit der User starten möchte.

> **Während der Session:** Nach jedem abgeschlossenen Schritt (Projekt angelegt,
> Feature fertig, Entscheidung getroffen) `STATUS.md` sofort aktualisieren.
> Nur lokal committen – kein Push ohne explizite Anweisung des Users.

> **Session-Ende:** Wenn der User "tschüss", "bis später", "wir hören auf"
> oder ähnliches schreibt – `STATUS.md` finalisieren, lokal committen
> und eine kurze Zusammenfassung ausgeben was heute erreicht wurde.
> Kein Push ohne explizite Anweisung.

---

## ✅ Offene TODOs

- [ ] dachrechner.at + dachrechner.de registrieren (~20€)
- [ ] Supabase Account anlegen (kostenlos)
- [ ] Brevo Account anlegen (kostenlos)
- [ ] Plausible Account anlegen (9€/Mo)
- [ ] Angular Projekt initialisieren: `ng new dachrechner-app`
- [ ] Sprint 1 starten
