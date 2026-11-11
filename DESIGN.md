# Design system — Explore Near & Far Travel

<!-- impeccable:design-schema 1 -->

## World

**Advisor planning folio.** The site is the physical trip packet Faith and Rob assemble: navy embarkation cloth for arrival, cream paper inserts for reading, teal tabs as structure, orange reserved for the Plan action. Not a SaaS marketing kit and not a cream travel brochure template.

## Color

| Token | Hex | Role |
| --- | --- | --- |
| Navy / cloth | `#163D5A` / `#0F2A3F` | Hero ground, header, footer, close band |
| Teal | `#78C6D0` / `#1F6F7A` | Tab rails, rules, structural accent |
| Orange | `#C24D16` | Primary CTA only |
| Cream | `#FFF8EE` / `#F3E6D4` | Page paper and deep paper sections |
| Gold | `#F5C451` | Secondary highlight on navy (fact line, current nav) |

Strategy: **Committed navy** on the first viewport; cream paper for content; teal as structure; orange as the single action color.

## Type

- Display: **Source Serif 4** — upright, for brand and section titles
- Body: **Atkinson Hyperlegible** — 18px base for senior/accessible readability
- No italic display as decoration; italic only on review quotes

## Layout

- Full-bleed embarkation hero (brand name as hero signal)
- Dark sticky header over the photo (not a white bar)
- Folio spreads: photo pane + paper pane with teal tab edge
- Unequal photo panes for secondary services (not equal icon-cards)
- Video heroes alone on the first screen of service pages; title on the cream intro below
- Reviews keep the side-slide chapter scroller

## Motion

- Button press `scale(0.97)` at ~140ms ease-out
- Photo zoom 1.03–1.04 inside frames on hover (fine pointer only)
- One hero entrance with blur+rise when supported
- Reviews scroller unchanged; reduced-motion falls back to static stack

## Seed

`seed:a46a2a40f75c9054` — grounded candidate 4 (planning folio), raised by glazier pane hierarchy and labeled specificity.
