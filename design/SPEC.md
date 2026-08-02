# Design Spec

Living doc. Reference images live locally in `design/moodboards/<style>/` (gitignored —
copyrighted source material). This file holds _your own_ written decisions only:
palettes, type, rules, and why.

---

## Shared contract (3D exploration styles)

Every 3D style plugs into `styles/index.js` as a `STYLES[name]` entry and must export:

| Export                                               | Purpose                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| `World`                                              | R3F scene component, receives `{ isDark, groupRef, underwater }` |
| `Cards`                                              | Framer Motion content cards for About/Projects/Contact           |
| `ConfigPanel`                                        | in-scene settings UI                                             |
| `LoadingScreen`                                      | style-specific loading screen                                    |
| `theme`                                              | non-3D UI theme (navbar, cursor, etc.)                           |
| `SECTIONS`                                           | scroll-depth ranges, `{ from, to, mode, label }`                 |
| `night` / `day`                                      | config objects (palette, object params)                          |
| `onScrollUpdate({ offset, groupRef, bounceOffset })` | drives world movement per scroll                                 |
| `getUnderwaterThreshold()` _(optional)_              | scroll offset where underwater scene kicks in                    |

Rules that apply to _all_ styles unless a style explicitly overrides and documents why:

- TBD — fill in as we make cross-style calls (e.g. button dynamics from `emil-design-eng`,
  motion timing, cursor behavior).

## Decision log

Chronological. One line per decision, newest on top.

- `YYYY-MM-DD` — (example) decided X because Y.

---

## Styles

### synthwave _(existing, 3D — shipped)_

- Status: implemented (`styles/synthwave/`)
- Notes: TBD — retro-fit a description here so it's consistent with the others.

### okami-japandi-3d _(planned, 3D)_

- Status: not started
- One-liner: Japandi aesthetic, but 3D and paper-like (folded-paper / diorama feel), Okami-inspired.
- Palette:
- Materials / rendering notes:
- What we're borrowing vs. avoiding from Okami:

### anime _(planned, 3D)_

- Status: not started
- One-liner:
- Palette:
- Materials / rendering notes:

### sketch _(planned, 3D)_

- Status: not started
- One-liner:
- Palette:
- Materials / rendering notes:

### terminal _(planned, 3D)_

- Status: not started
- One-liner: Vercel-like, but sharper.
- Palette:
- Type:
- What "sharper than Vercel" means concretely:

### stitch _(planned, target unconfirmed — likely 2D)_

- Status: not started
- One-liner: literally looks like fabric, with things stitched onto it.
- Where it lives: TBD (2D default page vs. 3D exploration) — see decision log once decided.
- Palette:
- Materials / rendering notes:
