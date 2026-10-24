# Fomi Studio

A warm, focused **AI image & video generation workspace** — built for the Fomi frontend
assessment. It implements the provided mockup faithfully (light/cream canvas, white cards,
coral accent) and layers production-grade interaction, responsiveness, accessibility and a
mocked backend on top.

> **Live demo:** _add your Vercel URL here_
> **Stack:** Next.js 16 (App Router) · JavaScript · Tailwind CSS v4 · lucide-react

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint (clean)
```

No environment variables are required — the backend is mocked with Next.js Route Handlers.

---

## What it does

- **Returning-creator canvas.** On load, the workspace resumes your most recent generation
  instead of showing an empty page (the brief assumes a user *continuing an existing
  project*). A true empty account still gets a tailored empty state.
- **Compose → generate.** Write a prompt (or hit _Surprise me_ / _Enhance_), pick a model,
  aspect ratio, batch size and styles, then **Generate** (`⌘/Ctrl + Enter`). A top progress
  bar and shimmering skeletons cover the wait; results fade in staggered; the run is
  prepended to **History**.
- **Every result is reproducible.** The details card shows the prompt, model, aspect, **seed**
  and timestamp of the active run. _Reuse prompt_, _Variations_, favorite, download, upscale
  and a full-screen **lightbox** (keyboard-navigable) are one click away.
- **Image _and_ video modes**, with model/aspect/batch constraints that adapt per mode.
- **Mocked backend** returns believable, seeded media with realistic latency.

---

## Architecture

```
src/
├─ app/
│  ├─ layout.js            # fonts (Plus Jakarta Sans + Fraunces), metadata
│  ├─ page.js              # mounts WorkspaceProvider + Workspace
│  ├─ globals.css          # design tokens, base styles, keyframes, utilities
│  └─ api/                 # mocked backend (Route Handlers)
│     ├─ catalog/route.js  #   GET  models / styles / ratios / defaults
│     ├─ history/route.js  #   GET  recent generations
│     └─ generate/route.js #   POST simulate a generation (seeded, with latency)
├─ context/
│  └─ WorkspaceContext.jsx # single source of truth: catalog, composer, generation
│                          # state machine, progress, history, toasts
├─ hooks/                  # useMediaQuery, useClickOutside, useMountTransition, useOnEscape
├─ lib/                    # api-client, utils, download helper
├─ data/                   # static catalog, seed history, media URL helpers
└─ components/
   ├─ ui/                  # reusable primitives (Button, Select, Segmented, Slider,
   │                       # Collapsible, Tooltip, BottomSheet, Skeleton, Toasts, IconButton)
   └─ workspace/           # feature components (TopBar, HistoryStrip, Composer,
                           # ResultsArea, ResultCard, Lightbox, MobileComposer, …)
```

**State.** One `WorkspaceProvider` (React context + a small state machine) owns everything:
the catalog, the composer draft, the generation lifecycle (`idle → loading → success | error`),
progress, history and toasts. Components read what they need via `useWorkspace()` — no
prop-drilling, no external state library needed for this surface.

**Reusable vs. feature components.** `ui/` holds generic, presentation-only primitives;
`workspace/` holds the feature pieces that wire those primitives to workspace state. The
composer sub-parts (`ModeToggle`, `PromptField`, `ControlsRow`, `AdvancedSection`,
`StylesSection`, `GenerateButton`) are shared verbatim between the desktop side panel and the
mobile bottom sheet.

---

## Responsiveness

Each breakpoint is **laid out intentionally**, not scaled:

| Width | Layout |
|---|---|
| **< 1024px** (phone / small tablet) | Results fill the screen; the composer is a **docked bottom bar** that expands into a full-controls **bottom sheet**. |
| **1024–1279px** (tablet / laptop) | Two columns: side composer + results; the prompt details collapse into a slim header bar. |
| **≥ 1280px** (desktop) | Three columns: composer · prompt-details · results grid (matches the mockup). |
| **≥ 1536px** (large) | Wider gutters and a 4-up grid. |

No horizontal scrolling at any width (verified with a CDP overflow audit down to 320px).

---

## Craftsmanship notes

- **Accessibility built in** — semantic landmarks, labelled controls, visible focus rings,
  the ARIA listbox/combobox pattern for selects (keyboard + `aria-activedescendant`), radio
  semantics for the mode toggle, `alt` text from the prompt, Escape/arrow handling and scroll
  locking in overlays, and `prefers-reduced-motion` honored globally.
- **Performance** — `next/image` with blur-up + lazy offscreen loading, route-level code
  splitting, a single cancellable in-flight request per generation (`AbortController`), and
  memoized context value.
- **Interaction** — CSS-first animations (no animation library): a spring-sliding segmented
  control, `grid-rows` disclosure animations, staggered result reveals, a top progress bar,
  blur-up images, hover-play video previews, and portalled overlays with enter/exit
  transitions.
- **Loading / empty / error states** everywhere a request can be pending, settled or fail.

---

## Mocked backend

`POST /api/generate` accepts `{ prompt, mode, count, ratio, modelId, styleIds, advanced }`,
validates the prompt, applies model/mode-aware latency, and returns a generation with seeded
assets (images via Lorem Picsum; video via public sample clips). `GET /api/catalog` and
`GET /api/history` serve the static catalog and seed history. All network access is funneled
through `lib/api-client.js`.

---

## Notable deviations from the mockup (intentional)

- The three inline controls (`# images`, aspect, `Model`) are grouped as **Images + Aspect**
  on one row with **Model** full-width below — clearer on a 320px-wide panel.
- The prompt-details card gains a labelled header, metadata rows and a copy/reuse affordance.
- Added: top progress bar, a Stop/Cancel affordance mid-generation, favorites, a lightbox,
  and the mobile bottom-sheet composer.
