# ETFC — ADWA FIGHT NIGHT 2026 — Website Build Reference

> This file is the single source of truth for the AI building the website. It contains the event details,
> ticket tiers, full fight card with fighter matchups, the merchandise catalog, and a complete index of every
> image in `public/assets` with its intended usage. Image filenames follow the naming convention below, so always
> reference images by their filename.

---

## 1. NAMING CONVENTION (how to read image filenames)

| Prefix | Meaning | Example |
|---|---|---|
| `fighter-*` | Fighter portrait (face crop) | `fighter-tyson.png` |
| `matchup-*` | VS fight poster for a matchup | `matchup-main-event-sedo-vs-johnny.jpg` |
| `statcard-*` | Fighter stat card (record, height, weight, reach) | `statcard-abenezer-daniel.jpg` |
| `ticket-*` | Ticket tier / pricing card | `ticket-vvip-ringside.jpg` |
| `merch-*` | Merchandise product image | `merch-black-full-set.png` |
| `video-thumbnail-*` | Video/YouTube thumbnail | `video-thumbnail-press-conference.jpg` |
| `mockup-*` | Design mockup / screenshot | `mockup-hero-sedo-vs-johnny.png` |
| `logo.png`, `seatmap.png` | Brand logo and venue seat map | — |

All images live in `public/assets` and are served at the `/assets` URL path. In Next.js code, reference them with absolute paths like `src="/assets/fighter-tyson.png"`.

---

## 2. EVENT OVERVIEW

- **Event name:** ADWA FIGHT NIGHT (ETFC — Ethiopian Fighting Championship)
- **Venue:** Adwa 00 Museum
- **Date:** August 27 (extracted from ticket imagery — confirm exact year)
- **Payment:** Tickets sold via **M-Pesa**
- **Logo text:** "ETFC — Ethiopian Fighting Championship"
- **Sections on the site:** Home/Landing, Fight Card (MMA, Boxing, Muay Thai), Ticket Tiers / Seat Selection, Merchandise Shop
- **Main event poster** (`matchup-main-event-sedo-vs-johnny.jpg`) is the hero image for the landing page.
- A promotional video exists but was NOT renamed: `assets/Full_Fight_Nikatehilina-vs-johnny.mp4` (214 MB fight footage).

---

## 3. TICKET TIERS — "CHOOSE YOUR SEAT"

Prices and details below combine the client's brief (authoritative) with details OCR-extracted from the ticket images.

| Tier | Price | Details | Seats | Image |
|---|---|---|---|---|
| **VVIP Ringside** | 100,000 ETB | Front-row cage-side seats. Pick your exact seat. Ultimate fight night experience. *(Image adds: exclusive ringside seating, unlimited food & drinks, exclusive access to the fighters' dressing room)* | Only 26 seats | `ticket-vvip-ringside.jpg` |
| **VVIP Premium** | 50,000 ETB | Premium ringside seating. Pick your exact seat. VIP treatment. *(Image adds: 2nd row from the ring, 2 food coupons + 10 drink coupons)* | Only 26 seats | `ticket-vvip-premium.jpg` |
| **VVIP Normal** | 30,000 ETB | Close ringside view. Auto-assigned best seats. Great value. *(Image adds: 3rd–5th row seats, 2 food coupons + 7 drink coupons)* | Only 26 seats | `ticket-vvip-normal.jpg` |
| **VIP** | 20,000 ETB | Reserved seating block. Closer to the ring. Priority entry. *(Image adds: 4 drink coupons + 1 food coupon, seat selection available)* | Only 53 seats | `ticket-vip.jpg` |
| **Early Bird** | **6,000 ETB** ⚠️ | General admission. Auto-assigned seats. Best price. | Only 13 seats | `ticket-early-bird.jpg` |

**⚠️ CONFIRM WITH CLIENT:** The ticket image `ticket-early-bird.jpg` shows **Early Bird = 4,000 ETB** and also lists a **"Regular — 10,000 ETB"** tier that is not in the client's written brief (which says 6,000 ETB). The client brief above should win; but verify which pricing to display.

**Seat selection:** Use `seatmap.png` (venue layout with BLOCK D, G, H and seat numbers 101–107) for the interactive seat picker. VVIP Ringside / VVIP Premium support "pick your exact seat"; other tiers are auto-assigned.

**Extra ticket images:**
- `ticket-prices-header.jpg` — section header card ("TICKET PRICES — ADWA FIGHT NIGHT, Adwa 00 Museum, August 27")
- `ticket-cta-get-tickets.jpg` — "GET YOUR TICKET ON M-PESA" CTA banner

---

## 4. FIGHT CARD

Legend: **R** = Red corner, **B** = Blue corner. "Live odds" badges are available where marked. Poster = VS image, Stat = stat card image, Face = portrait.

### 🥊 MMA
| # | Red Corner (R) | Blue Corner (B) | Weight Class | Rounds | Live Odds | Poster | Stat Cards | Faces |
|---|---|---|---|---|---|---|---|---|
| **★ Main Event** | **Sedo** "The Beast" (Heavyweight) | **Johnny** "Jiu-Jitsu" (Heavyweight) | Heavyweight | 5 RDS | ✅ | `matchup-main-event-sedo-vs-johnny.jpg` (landing hero) | — (none) | `fighter-sedo.jpg`, `fighter-johnny.jpg` |
| 02 | **Boyka** (Heavyweight) *(full name: Boyka Simon)* | **Endris** (Heavyweight) *(full name: Endris Teklu)* | Heavyweight | 3 RDS | ✅ | `matchup-boyka-vs-endris.jpg` | `statcard-boyka-simon.jpg`, `statcard-endris-teklu.jpg` | `fighter-boyka.png`, `fighter-endris.png` |
| 03 | **Nikatehilina** (75 KG) ⚠️ spelling variant "Nikatehkina" in brief | **Robel** "Sky-Limit" (75 KG) | 75 KG | 3 RDS | ✅ | `matchup-robel-vs-nikatehilina.jpg` | `statcard-nikatehilina.jpg`, `statcard-robel.jpg` | `fighter-robel.png` — **MISSING: `fighter-nikatehilina`** |
| 04 | **Titan** (75 KG) | **Coach Kal** (75 KG) | 75 KG | 3 RDS | ✅ | **MISSING poster** | **MISSING stat cards** | `fighter-coach-kal.png` — **MISSING: `fighter-titan`** |

### 🥊 BOXING
| # | Red Corner (R) | Blue Corner (B) | Weight Class | Rounds | Live Odds | Poster | Stat Cards | Faces |
|---|---|---|---|---|---|---|---|---|
| 01 | **Abrhamalem** (63.5 KG) | **Tyson** "Haymanot Desalegn" (63.5 KG) | 63.5 KG | 6 RDS | ✅ | **MISSING poster** | **MISSING stat cards** | `fighter-abrhamalem.png`, `fighter-tyson.png` |
| 02 | **Surafel Cheri** (54 KG) | **Desalegn** (54 KG) | 54 KG | 6 RDS | ✅ | **MISSING poster** | **MISSING stat cards** | `fighter-surafel-cheri.png`, `fighter-desalegn.png` |
| 03 | **Esubalew** (Lightweight) *(full name: Esubalew Mola, 164 cm / 48 kg, record 21-6)* | **Biniyam** (Lightweight) *(full name: Biniyam Berihun, 161 cm / 48 kg, record 7-3)* | Lightweight | 6 RDS | ✅ | `matchup-esubalew-vs-biniyam.jpg` | `statcard-esubalew-mola.jpg`, `statcard-biniyam-berihun.jpg` | `fighter-esubalew.png`, `fighter-biniyam.png` |
| 04 | **Abenezer** (71 KG) *(full name: Abenezer Daniel, 174 cm / 71 kg)* | **Mesfin Biru** (71 KG) *(177 cm / 71 kg)* | 71 KG | 6 RDS | ✅ | `matchup-mesfin-vs-abenezer.jpg` | `statcard-abenezer-daniel.jpg`, `statcard-mesfin-biru.jpg` | `fighter-abenezer.png` — **MISSING: `fighter-mesfin`** |

### 🥋 MUAY THAI
| # | Red Corner (R) | Blue Corner (B) | Weight Class | Rounds | Live Odds | Poster | Stat Cards | Faces |
|---|---|---|---|---|---|---|---|---|
| 01 | **Rebik Sani** (67 KG) | **Sky Okony** (67 KG) | 67 KG | 5 RDS | ✅ | **MISSING poster** | **MISSING stat cards** | `fighter-rebik-sani.png`, `fighter-sky-okony.png` |
| 02 | **Frezer** (63 KG) | **Habtamu** (63 KG) | 63 KG | 5 RDS | — | **MISSING poster** | **MISSING stat cards** | `fighter-frezer.png`, `fighter-habtamu.png` |
| 03 | **Zahara** (54 KG) *(full name: Zahara Sefequ, 160 cm / 54 kg, record 1-0)* | **Yabsira** (54 KG) *(full name: Yeamlaksira Wendimu, 155 cm / 54 kg, debut)* | 54 KG | 5 RDS | ✅ | `matchup-yabsira-vs-zahara.jpg` | `statcard-zahara.jpg`, `statcard-yabsira-wendimu.jpg` | `fighter-zahara.png`, `fighter-yabsira.png` |

**Fighter stat data (extracted from stat cards):**

| Fighter | Full Name | Record | Height | Weight | Reach |
|---|---|---|---|---|---|
| Robel | Robel | DEBUT | 180 cm | 88 kg | 183 cm |
| Nikatehilina | Nikatehilina | 0–1 | 175 cm | 88 kg | 175 cm |
| Boyka | Boyka Simon | DEBUT | 194 cm | 93 kg | 193 cm |
| Endris | Endris Teklu | DEBUT | 180 cm | 94 kg | 180 cm |
| Abenezer | Abenezer Daniel | 6–3 (OCR "63-2") | 174 cm | 71 kg | 183 cm |
| Mesfin Biru | Mesfin Biru | 14–0–8 (OCR "140-8") | 177 cm | 71 kg | 182 cm |
| Zahara | Zahara Sefequ | 1–0 | 160 cm | 54 kg | — |
| Yabsira | Yeamlaksira Wendimu | DEBUT | 155 cm | 54 kg | — |
| Biniyam | Biniyam Berihun | 7–3 | 161 cm | 48 kg | — |
| Esubalew | Esubalew Mola | 21–6 | 164 cm | 48 kg | — |

> ⚠️ Records marked "OCR" were extracted by text recognition and may contain misread characters — verify before publishing.

---

## 5. MERCHANDISE — "FIGHT NIGHT 2026 COLLECTION"

Prices: sale price listed first, strikethrough original in parentheses.

| Product | Category | Sale Price (was) | Image |
|---|---|---|---|
| Black Full Set | Sets | 19,999 ETB (25,000) | `merch-black-full-set.png` |
| Blue Full Set | Sets | 19,999 ETB (25,000) | `merch-blue-full-set.png` |
| White Full Set | Sets | 19,999 ETB (25,000) | **MISSING image** (only black & blue full sets exist) |
| Hoodie + Tee + Shorts Set | Sets | 14,999 ETB (18,000) | `merch-hoodie-tee-shorts-set.png` |
| Blue Fight Tee | Apparel | 2,499 ETB (3,500) | `merch-blue-fight-tee.png` |
| White Sweater | Outerwear | 4,999 ETB (6,500) | `merch-white-sweater.png` |
| Open Sleeve Jacket | Outerwear | 6,499 ETB (8,500) | `merch-open-sleeve-jacket.png` |
| Fight Shorts | Apparel | 2,499 ETB (3,500) | `merch-fight-shorts.png` |
| ETFC Boxing Gloves | Gear | 7,999 ETB (10,000) | `merch-boxing-gloves.png` ⚠️ verify |
| Fight Night Gloves (Heavy) | Gear | 9,499 ETB (12,000) | `merch-fight-night-gloves-heavy.png` ⚠️ verify |
| ETFC Bracelet | Accessories | 1,799 ETB (2,500) | `merch-bracelet.png` |

> ⚠️ There are two glove products and two glove images (`merch-boxing-gloves.png` was originally `merch-boxing-gwan.png`, a filename typo). Confirm which image belongs to which product. Product images are AI studio mockups with front/back/close-up views and ETFC branding.

---

## 6. COMPLETE ASSET INDEX (all files in public/assets)

### Brand & Venue
| File | What it is | Use |
|---|---|---|
| `logo.png` | ETFC logo ("Ethiopian Fighting Championship") | Navbar, footer, favicon |
| `seatmap.png` | Venue seating chart (Blocks D, G, H; seats 101–107) | Seat selection section |

### Fighter Portraits (19)
`fighter-sedo.jpg`, `fighter-johnny.jpg`, `fighter-tyson.png`, `fighter-robel.png`, `fighter-zahara.png`, `fighter-rebik-sani.png`, `fighter-sky-okony.png`, `fighter-biniyam.png`, `fighter-abrhamalem.png`, `fighter-desalegn.png`, `fighter-esubalew.png`, `fighter-frezer.png`, `fighter-surafel-cheri.png`, `fighter-coach-kal.png`, `fighter-abenezer.png`, `fighter-yabsira.png`, `fighter-habtamu.png`, `fighter-boyka.png`, `fighter-endris.png`

### Matchup Posters (6)
`matchup-main-event-sedo-vs-johnny.jpg` (landing page hero), `matchup-robel-vs-nikatehilina.jpg`, `matchup-boyka-vs-endris.jpg`, `matchup-mesfin-vs-abenezer.jpg`, `matchup-yabsira-vs-zahara.jpg`, `matchup-esubalew-vs-biniyam.jpg`

### Fighter Stat Cards (10)
`statcard-robel.jpg`, `statcard-nikatehilina.jpg`, `statcard-endris-teklu.jpg`, `statcard-boyka-simon.jpg`, `statcard-mesfin-biru.jpg`, `statcard-abenezer-daniel.jpg`, `statcard-zahara.jpg`, `statcard-yabsira-wendimu.jpg`, `statcard-biniyam-berihun.jpg`, `statcard-esubalew-mola.jpg`

### Tickets (7)
`ticket-prices-header.jpg`, `ticket-vvip-ringside.jpg`, `ticket-vvip-premium.jpg`, `ticket-vvip-normal.jpg`, `ticket-vip.jpg`, `ticket-early-bird.jpg`, `ticket-cta-get-tickets.jpg`

### Merchandise (10)
`merch-black-full-set.png`, `merch-blue-full-set.png`, `merch-blue-fight-tee.png`, `merch-boxing-gloves.png`, `merch-fight-night-gloves-heavy.png`, `merch-bracelet.png`, `merch-open-sleeve-jacket.png`, `merch-fight-shorts.png`, `merch-hoodie-tee-shorts-set.png`, `merch-white-sweater.png`

### Media / Mockups (2)
`video-thumbnail-press-conference.jpg` — YouTube thumbnail "LIVE Press Conference Sedo vs ... Today 10:00 AM" (use as press/video section thumbnail), `mockup-hero-sedo-vs-johnny.png` — design mockup/screenshot of Sedo vs Johnny "Fight Night" hero (reference design)

### Video (not renamed)
`Full_Fight_Nikatehilina-vs-johnny.mp4` — full fight footage (214 MB)

---

## 7. MISSING ASSETS (need to be created/collected)

1. **Fighter portraits:** Nikatehilina, Titan, Mesfin Biru (face crops)
2. **Matchup posters:** Titan vs Coach Kal, Abrhamalem vs Tyson, Surafel Cheri vs Desalegn, Rebik Sani vs Sky Okony, Frezer vs Habtamu
3. **Stat cards:** Titan, Coach Kal, Abrhamalem, Tyson, Surafel Cheri, Desalegn, Rebik Sani, Sky Okony, Frezer, Habtamu
4. **Merch image:** White Full Set
5. **Tier image discrepancy:** Early Bird price (brief 6,000 ETB vs image 4,000 ETB) + "Regular 10,000 ETB" tier in image only
6. **Name spelling:** Nikatehilina (images/video) vs Nikatehkina (brief) — pick one canonical spelling

---

## 8. DESIGN NOTES FOR THE BUILDER

- **Color language:** Black + gold is the dominant palette in fighter portraits/posters; dark theme fits the brand. Maroon/red accents (open sleeve jacket), white for clean product shots.
- **Sections:** Landing hero (main-event poster + logo) → Ticket tiers / seat map → Fight card (grouped MMA / Boxing / Muay Thai with poster + stat cards + live-odds badges) → Merchandise grid (sale price with strikethrough) → Press/video (press-conference thumbnail) → M-Pesa ticket CTA.
- **Exclusivity copy:** "Only 26 seats" (VVIP tiers), "Only 53 seats" (VIP), "Only 13 seats" (Early Bird) — use as scarcity badges.
- Currency: ETB (Ethiopian Birr).
