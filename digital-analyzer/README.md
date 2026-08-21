# Digital Analyzer — UI

Front-end recreation of the Digital Analyzer product screens, built from the
reference screenshots. The goal each time is the same:

> **Same structure, same content hierarchy, same interaction intent — better
> visual execution.**

Open `index.html` directly in a browser; there is no build step.

## Screens

| Screen | File | Notes |
| --- | --- | --- |
| Analyzer Packets (landing after sign-in) | `js/pages/analyzerPacketsPage.js` | Scope switch, search, primary action, 9-column table |
| Customer Details (New Analyzer Packet, step 1) | `js/pages/customerDetailsPage.js` | Reached from **New Analyzer Packet**; customer lookup, shipping profile, optional PLD upload |
| Create Scenarios and Analyzer Packet (step 2) | `js/pages/createScenariosPage.js` | Reached from **Source Data**, arriving with the sourcing-in-progress dialog open; the scenario row expands to its sourced bids |

Screens swap below the persistent header via `navigate()` in `js/main.js` —
the single seam to replace when real routing arrives.

## Structure

```
digital-analyzer/
  index.html                  page shell + script/style manifest
  styles/
    tokens.css                design tokens — the single source of truth
    base.css                  reset, document defaults, utilities
    components.css            component library
    layout.css                page shell + responsive rules
  js/
    core/dom.js               tiny element factory used by every component
    core/icons.js             inline SVG icon set
    components/               reusable UI components (one file each)
    data/                     demo data — replace with API responses
    pages/                    screen composition
    main.js                   entry point
```

Components are plain factory functions returning real DOM nodes, so the output
stays semantic HTML (`<table>`, `<th scope="col">`, real `<button>`s) with no
build tooling. Each is framework-agnostic and can be ported to React/Angular
later without changing the design system.

### Component library

`AppHeader` · `Panel` · `Button` / `IconButton` · `Avatar` ·
`SegmentedControl` · `SearchField` · `StatusBadge` · `DataTable` /
`RecordLink` · `EmptyState` · `Field` / `SelectField` / `HelpButton` ·
`ChipInput` · `Toggle` · `Accordion` · `FileDropzone` / `FileItem` ·
`Modal` · `Alert` · `SummaryPanel` / `Detail` · `Checkbox`

### Fields

`Field` uses the placeholder to carry the label while empty and floats the
label to the border once the field holds a value, so a filled field is never
left unlabelled. `ChipInput` commits entries on space or enter (and splits a
pasted list); with `multiple: false` it holds a single value, which is how the
parent/child customer lookup behaves.

## Design system

All colour, type, spacing, radius, elevation and component dimensions live as
tokens in `styles/tokens.css`. Screens and components consume tokens only — no
repeated hard-coded values.

- **Type scale**: 11 / 12 / 13 / 14 / 16 / 18 / 22 px, weights 400–700.
- **Spacing**: 4 px base scale (`--space-1` … `--space-8`).
- **Radius**: 2 / 4 / 6 / 8 / pill.
- **Colour**: semantic tokens (`--color-text-primary`, `--color-info`,
  `--color-error`, …) over the product's existing character — UPS gold for the
  primary action, teal for the selected scope, charcoal table header,
  blue record links.

## Tables stay tables

`DataTable` renders a real table with a sticky header inside a scrollable
viewport. On narrow screens the table scrolls **horizontally** — it is never
converted into cards, tiles or stacked lists — so column alignment and row
comparison survive at every size.

## Accessibility

- Semantic landmarks (`banner`, `main`), one `<h1>` for the product name, a
  visually hidden `<h2>` naming the screen, and a skip link.
- Table uses `<th scope="col">` plus a visually hidden `<caption>`; the scroll
  container is a keyboard-focusable labelled region.
- Segmented control is a real `radiogroup` with arrow-key navigation.
- Search input has a real (visually hidden) `<label>`.
- Row-count changes are announced through an `aria-live="polite"` region rather
  than adding visible chrome.
- Visible focus ring on every interactive element; `prefers-reduced-motion`
  disables transitions.

## Deliberate deviations from the reference screenshot

Everything else is a faithful recreation. These three changes were made on
purpose and are each a one-line revert:

1. **`ERROR OCCURRED` badges are red** (`--color-error`). In the reference every
   status shares one light-blue treatment, so a failed packet reads exactly like
   a healthy one. Revert by mapping `'Error Occurred'` to `'info'` in
   `js/components/StatusBadge.js`.
2. **Row height 36 px** (reference ≈ 26 px) for a comfortable click target and
   legible vertical rhythm. Revert via `--table-row-height`.
3. **Search field is slightly wider** so the full placeholder is visible instead
   of being clipped mid-word. Revert via `.search-field { max-width }`.
4. **`Add Duration* (In Weeks)` is white**, like every other filled field. The
   reference tints it, which reads as a different kind of control than the
   identical fields above it.
5. **The OPP hint wraps to two lines.** The reference fits it on one at roughly
   8.5px, which is below a legible size; it is set at 10px here.
6. **The scenario name truncates on one line** rather than wrapping to two
   before truncating, as the reference does.

The bid table's header is a warmer dark than the packet list's, matching the
reference. Point `--color-surface-inverse-warm` at `--color-surface-inverse`
to make every table header identical.

## Flow

```
Analyzer Packets ──New Analyzer Packet──▶ Customer Details ──Source Data──▶ Create Scenarios
       ◀───────────────Back───────────────       ◀──────────Back───────────
```

`Source Data` builds the packet record through `js/data/newPacket.js` — a demo
stand-in for the create-packet endpoint. It continues the packet ID sequence
from the existing list (so the first new packet is 112002, as in the
reference), stamps the clock for created/modified, and names the signed-in user
as owner. Any field left blank on the form falls back to the reference customer
so the walkthrough still reads correctly.

## Derived values

`Duration : N Weeks` is computed from the shipping profile window as whole
weeks covering both end dates — `ceil((days between + 1) / 7)`. This reproduces
both reference examples: 05/23/2026–08/15/2026 is 13 weeks and
05/17/2025–04/04/2026 is 47 weeks. It is the only calculation in the UI; no
other business logic is assumed.

## Not yet wired

The form does no validation, and on the scenarios screen `Download Scenario
Summary`, `Create New Scenario`, `Update Description` and `Proceed to Analyzer
Packet` do nothing yet — all wait on the workflow rules. `Proceed to Analyzer
Packet` renders disabled, as in the reference. The help (`?`) buttons carry
placeholder text.

Bid selection is live: each bid's checkbox and the header select-all toggle
real state on the scenario record. Non-incented revenue has no checkbox — it is
always included.

## Demo data

`js/data/analyzerPackets.js` transcribes the 15 rows from the reference screen
in the same order. `js/data/session.js` holds the signed-in user (initials
`AA`); **My Analyzers** scopes the list to packets that user owns, which is why
it shows the empty state against this demo data — none of the visible packets
belong to `AA`. Swap both files for API responses when the endpoints land.

## Known placeholder

`js/core/icons.js` draws a **simplified UPS shield** in code. Replace it with the
official brand asset before any external release.
