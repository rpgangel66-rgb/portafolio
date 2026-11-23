---
name: anti-ai-slop-web
description: >-
  Strict web design and frontend craft standard that eliminates both Gen-1
  (v0/Tailwind SaaS) and Gen-2 (Claude editorial) AI slop. Activate whenever
  creating, redesigning, or auditing websites, landing pages, or client demos
  for real businesses so they look authentically human-designed, intuitive,
  and commercially credible.
---

# Anti-AI-Slop Web Design Standard

Follow these mandatory rules for every website, landing page, or business demo. Never deliver a page without verifying desktop (1280px) and mobile (390px) renders against every prohibition below.

## 1. Hard Prohibitions (Instant Reject If Present)

### Gen-1 AI Slop (v0 / Tailwind / Lovable tells)
- **No letter-in-a-square placeholder logos** (e.g. `[S] Sleepadent`). Use a clean typographic wordmark with optional subtle industry/location subtitle.
- **No default 50/50 split hero** with a floating rounded-corner stock photo on a pale gray box opposite stacked `eyebrow -> H1 -> 2-line sub -> twin buttons -> 3 colored-dot bullets`.
- **No twin side-by-side hero CTA buttons** (`[Solid Primary]` + `[Outlined Secondary]`). Use ONE primary button plus at most a plain text link if needed.
- **No duplicate primary CTA buttons** visible at the same time in the navbar and hero. Put a clickable phone number or clean nav links in the header instead.
- **No frosted-glass (`backdrop-filter: blur`) badges/pills** floating over photography (e.g. `● Disponible hoy`).
- **No symmetrical 3-column generic feature/icon boxes** with 2-word titles and interchangeable filler copy.
- **No "carditis"**: do not wrap every piece of content in rounded shadowed cards inside cards.
- **No purple/indigo gradients, radial glow blobs, gradient text clips, infinite marquee tapes, rotating circular SVG seals, or flickering neon gimmicks.**

### Gen-2 AI Slop (Claude / "Anti-Slop Slop" tells)
- **No oversized monumental hero titles** (`60px` to `260px` `<h1>` or `50px+` `<h2>`). Keep commercial business `<h1>` strictly in **`28px–42px`** (`clamp(28px, 3.4vw, 40px)`) and `<h2>` in **`22px–28px`**.
- **No parchment/cream (`#F5F4ED` / `#F6F4EF`) + serif headline with one colored italic word** (e.g. `Atención dental *sin prisas*...`).
- **No monospace numeric section prefixes** (`01 · SERVICIOS ———`, `02 · HORARIOS ———`) or uppercase `DM Mono` metadata scattered across a local business site.
- **No theatrical demo props** like fake folio numbers (`S-249`), fake printed tickets over dark forest-green desks, or repeating `"Negocio: <Name>"` inside the business's own site.
- **No excessive empty vertical padding** (`py-28`/`py-32`) forcing endless scrolling.
- **No em-dash (`—`) overuse** or hollow brochure buzzwords (*seamless, elevate, unlock, empower, sin prisas*).

## 2. Mandatory Real-World Commercial Architecture

1. **Real Utility Topbar:** Thin dark or brand bar with clickable phone number + real operating hours (what real Mexican/local businesses actually use).
2. **Clean Header (`64px–72px`):** Pure typographic brand name (+ short industry/location subtitle), 3–4 simple anchor links, and clickable phone number (no competing button).
3. **Full-Bleed Photographic Hero (`min-height: 400px–480px`):** Edge-to-edge photo with a natural directional dark readability scrim (`linear-gradient(95deg, ...)`), grounded `32px–40px` `<h1>`, 1 concrete sentence describing real services/location, and 1 primary CTA button + optional plain text link. Keep horizontal `.wrap` padding intact on mobile (`padding-block`, never `padding: X 0` on a `.wrap` element).
4. **Clear, Effortless Section Contrast:** Alternate pure white (`#FFFFFF`) and subtle neutral/industry tint (`#F4F7FA`, `#F5F5F3`, `#F7F4F1`, `#F3F7F5`) separated by crisp `1px` borders so every section boundary is immediately obvious without heavy shadows.
5. **Typography Discipline:** Use ONE clean, readable font family (prefer local `.woff2` fonts if present in the repo, zero unnecessary font-mixing).
6. **Practical Interactive Core:** Services/menu/catalog items should be scannable and directly selectable (no filler tags or repeated `"Elegir este servicio"` links on every card).
7. **Real Location Proof:** Include a structured address/phone/hours table and a real embedded Google Maps `<iframe>` (`https://maps.google.com/maps?q=...&output=embed`) + direct Google Maps link.
8. **Reliable WhatsApp Links:** ALWAYS use real `<a href="https://api.whatsapp.com/send?phone=521...&text=..." target="_blank" rel="noopener">` (or `https://web.whatsapp.com/send?...` for desktop outreach tools). NEVER rely on `window.open()` inside a `<button>` click, which browsers and webviews silently block.

## 3. Mandatory Pre-Delivery Verification

Before considering any page done:
1. Render and visually inspect BOTH **desktop (`1280px`)** and **mobile (`390px`)** screenshots.
2. Check for: zero horizontal overflow, proper mobile side gutters, readable contrast over photos, zero repeated labels/CTAs above the fold, and zero Gen-1 or Gen-2 slop tells.
