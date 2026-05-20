# DESIGN.md — Function Physiotherapie

## Brand Identity

**Name:** Function Physiotherapie Flensburg
**Sprache:** Deutsch  
**Ton:** Professionell, warm, vertrauenswürdig  
**Logo:** `brand assets/Logo_erste Idee_ohne Hintergrund.png`  
— Kreisförmiger Pinselstrich in Sand/Taupe, Schriftzug in dunklem Teal

---

## Farben

| Token | Hex | Verwendung |
|---|---|---|
| `--teal-dark` | `#1a3540` | Primärfarbe, Nav-Text, Hintergründe, Buttons |
| `--teal-mid` | `#2c5364` | Sekundärer Teal, Gradient-Layers |
| `--teal-light` | `#3d7a8a` | Hover-States, Akzente, Icons |
| `--sand` | `#b5a898` | Akzentfarbe, Linien, Labels, Icons |
| `--sand-light` | `#d6cec6` | Helle Akzente, Borders, Subtexte |
| `--cream` | `#f7f4f0` | Seitenhintergrund, helle Sections |
| `--cream-dark` | `#ede8e2` | Karten-Hintergrund, dezente Flächen |
| `--white` | `#ffffff` | Kartenoberflächen, Formulare |
| Footer-BG | `#0f2028` | Footer-Hintergrund |

### Farbprinzip
- Primäre Oberflächen: `--cream` → `--white` → `--teal-dark` (Layering-System)
- Akzente ausschließlich in `--sand` / `--sand-light`
- Niemals Standard-Tailwind-Blau (indigo-500, blue-600 etc.)

---

## Typografie

### Schriftarten
| Rolle | Familie | Quelle |
|---|---|---|
| Headings | Cormorant Garamond | Google Fonts |
| Body / UI | Inter | Google Fonts |

### Schriftschnitte
```
Cormorant Garamond: 300, 400, 500, 600 (regular + italic)
Inter: 300, 400, 500, 600
```

### Größen & Stile
| Element | Font | Größe | Gewicht | Besonderheit |
|---|---|---|---|---|
| Hero H1 | Cormorant | clamp(3rem, 7vw, 5.5rem) | 300 | letter-spacing: -0.02em |
| Section H2 | Cormorant | clamp(2rem, 4vw, 3rem) | 300 | letter-spacing: -0.02em |
| Card H3 | Cormorant | 1.375rem | 400 | letter-spacing: -0.01em |
| Nav Links | Inter | 0.8125rem | 500 | uppercase, letter-spacing: 0.1em |
| Section Label | Inter | 0.6875rem | 500 | uppercase, letter-spacing: 0.22em |
| Body Text | Inter | 0.9375–1rem | 300 | line-height: 1.75–1.8 |
| Button | Inter | 0.8125rem | 500 | uppercase, letter-spacing: 0.08em |

### Typografie-Regeln
- Große Headings: `letter-spacing: -0.02em` bis `-0.03em`
- Body: `line-height: 1.7–1.8`
- Kursiv (`<em>`) in Headings = Akzentfarbe `--teal-light` oder `--sand-light`
- Niemals dieselbe Schrift für Heading und Body

---

## Abstände (Spacing)

| Token | Wert | Verwendung |
|---|---|---|
| Section Padding Y | `7rem` (112px) | Alle Haupt-Sections |
| Content Max-Width | `1200px` | Alle inneren Container |
| Content Padding X | `2rem` (32px) | Seitenränder |
| Grid Gap | `6rem` (96px) | Zweispaltige Layouts |
| Card Gap | `1.5rem` (24px) | Karten-Grid |
| Divider | `3rem` Breite, `1px` Höhe | Unter Section-Headings |

---

## Komponenten

### Navigation
- Position: `fixed`, Glassmorphismus (`backdrop-filter: blur(12px)`)
- Hintergrund: `rgba(247, 244, 240, 0.92)`
- Höhe: `100px`; Logo-Höhe: `92px`
- Scroll-Schatten: `0 4px 32px rgba(26, 53, 64, 0.08)`
- Links: Unterline-Animation on hover (Sand-Linie)

### Buttons

**Primary `.btn-primary`**
```
background: #1a3540
color: #f7f4f0
border-radius: 2px
padding: 0.625rem 1.5rem
box-shadow: 0 2px 12px rgba(26, 53, 64, 0.18)
hover: background #3d7a8a, translateY(-1px)
```

**Outline `.btn-outline`** (nur auf dunklem Hintergrund)
```
background: transparent
border: 1px solid rgba(247, 244, 240, 0.55)
color: #f7f4f0
hover: background rgba(247, 244, 240, 0.12)
```

### Section Labels
```
font: Inter 0.6875rem / 500 / uppercase / letter-spacing 0.22em
color: --sand
prefix: 2rem Linie in --sand
```

### Karten (Service Cards)
- Hintergrund: `--white`
- Border-Radius: `2px`
- Hover: `translateY(-4px)` + Schatten + Bottom-Border-Akzent
- Schatten-System: color-tinted, niedrige Opacity (niemals flaches `shadow-md`)

### Bilder
- Immer mit Gradient-Overlay: `linear-gradient(to top, rgba(26,53,64,0.25–0.65), transparent)`
- Leichte Entsättigung: `filter: grayscale(10–20%)`
- Placeholder: `https://placehold.co/WIDTHxHEIGHT`

---

## Layout-Prinzipien

### Tiefensystem (Z-Layering)
| Ebene | Farbe | Elemente |
|---|---|---|
| Base | `--cream` | Seitenhintergrund |
| Elevated | `--white` | Karten, Formulare |
| Floating | `--teal-dark` | Nav, Overlays, Stat-Badges |

### Grid-Systeme
- **Zweispaltig:** `grid-template-columns: 1fr 1fr`, `gap: 6rem` — Abwechselnd gespiegelt (`direction: rtl`)
- **Karten 2×2:** `grid-template-columns: repeat(2, 1fr)`, `gap: 1.5px`, verbunden durch Sand-Border
- **Team 3er:** `grid-template-columns: repeat(3, 1fr)`, `gap: 2rem`

### Responsive Breakpoints
| Breakpoint | Verhalten |
|---|---|
| `≤ 1024px` | Zweispaltig → Einspaltig; Team → 2 Spalten |
| `≤ 768px` | Nav-Links ausgeblendet; alle Grids → 1 Spalte |

---

## Animationen

- Nur `transform` und `opacity` animieren — niemals `transition-all`
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Standard), Hover schnell (0.2–0.3s)
- Hover-Effekte: `translateY(-1px)` bis `translateY(-4px)` je nach Elementgröße
- Scroll-Indikator: `scaleY` Puls-Animation, 2s Loop

---

## Seiten

| Datei | Beschreibung |
|---|---|
| `index.html` | Hauptseite (Hero, Über uns, Leistungen-Preview, Ablauf, Team, Testimonials, Kontakt) |
| `leistungen.html` | Unterseite mit 4 Leistungen im Detail (Manuelle Therapie, Krankengymnastik, KGG, Coaching) |
| `index_standalone.html` | Selbständige Version von index.html mit eingebettetem Logo (Base64) |

---

## Technologie-Stack

| Tool | Version/Quelle |
|---|---|
| HTML | Single-file, Inline-Styles |
| CSS Framework | Tailwind CSS via CDN |
| Fonts | Google Fonts (Cormorant Garamond + Inter) |
| Icons | Inline SVG (Heroicons-Style, stroke-width 1.5) |
| Dev Server | `node serve.mjs` → `http://localhost:3000` |
| Screenshots | `node screenshot.mjs http://localhost:3000` |
| Puppeteer Chrome | `C:/Users/FabFiller/.cache/puppeteer/chrome/win64-148.0.7778.167/` |
