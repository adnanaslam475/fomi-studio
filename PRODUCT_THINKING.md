# Product Thinking — Fomi Studio (Image Generation Workspace)

This document explains the product reasoning behind the workspace I built. I chose the
**Image Generation Workspace** as the surface to design and implement. It takes the provided
mockup as a starting point and layers original product decisions on top, oriented around one
idea: **the workspace should feel like a place you return to and continue, not a prompt box
you start over at.**

---

## 1. What problem were you trying to solve? Who did you design for?

**The user:** a professional creator — a designer, marketer or art director — who generates
visual content for hours a day, in bursts, across many projects. They are not a first-time
dabbler. They already know what a seed, an aspect ratio and a model are.

**The problem:** most AI generators are built around a *single shot* — type a prompt, get a
grid, repeat. For someone living in the tool all day, that framing fights them in three ways:

1. **Lost context on return.** You come back and the canvas is empty; your last run, its
   settings and its outputs are buried a few clicks away.
2. **Irreproducible results.** The "good one" came from a specific prompt + model + seed, but
   that recipe isn't surfaced, so you can't reliably iterate on it.
3. **Interruptible flow.** Generation takes seconds; a professional wants to keep composing,
   compare, favorite and branch — not stare at a spinner.

So the goal was a workspace that **preserves context, makes every result reproducible, and
keeps you in flow** — while staying as calm and uncluttered as the mockup promised.

---

## 2. The three most important UX decisions

**a) The workspace resumes your last run instead of showing an empty page.**
On load it restores your most recent generation — results, prompt, model, seed — exactly as a
returning creator left it. The composer prompt stays empty (ready for the next idea) while the
details card carries the *previous* run's recipe. This directly serves the "continuing an
existing project" assumption and removes the cold-start every session. A genuinely empty
account still gets a purposeful empty state with one-tap example prompts.

**b) Provenance is first-class and one-click reusable.**
Every run shows its **prompt, model, aspect, seed and time** in a persistent details card, and
every output exposes **Reuse prompt**, **Variations**, favorite and download. Making the
*recipe* visible and actionable is what turns a pile of images into an iterative workflow — you
can branch from a result instead of trying to remember how you got it.

**c) The composer adapts its shape to the device, not just its size.**
On desktop it's a persistent side panel (the mockup). On phones and small tablets it becomes a
**docked bar that expands into a full-controls bottom sheet** — the pattern pro tools use so the
results stay the hero and the keyboard doesn't bury the canvas. The *same* composer components
power both, so behavior never drifts between breakpoints.

Supporting decisions in the same spirit: a top progress bar + skeletons + a **Stop** control so
waiting never blocks the UI; **progressive disclosure** (Advanced and Styles are collapsed by
default) so power exists without clutter; and a non-destructive **History as sessions** strip.

---

## 3. Features I intentionally left out

- **A node/graph editor and layer canvas.** Powerful, but they turn a calm generator into a
  complex IDE and fight "minimum complexity." They belong in a dedicated Edit surface, not the
  generation workspace.
- **Real auth, billing and a settings maze.** The brief assumes a signed-in user; building
  login flows would spend effort where the workspace isn't the hero. Credits appear only as a
  lightweight signal.
- **In/out-painting, masking and ControlNet-style conditioning.** High-value but each needs its
  own focused UI; bolting them on here would clutter the core loop. Left as future surfaces.
- **A model/style marketplace and social feed.** Discovery is a different job than creation;
  mixing them dilutes both.
- **An animation library (Framer Motion, etc.).** Deliberately omitted — all motion is
  CSS/`requestAnimationFrame`, which keeps the bundle small and the interactions honest.

The throughline: **say no to anything that doesn't serve a professional's core
compose → generate → iterate loop.**

---

## 4. Products that inspired the thinking

- **Figma / Cursor** — the idea that a professional tool is a *persistent workspace with
  context and history*, not a one-shot form. Their calm density is the bar. I'd improve their
  steep first-run learning curve by keeping the surface approachable.
- **Krea / Magnific** — fast, immersive generation and a strong results-first layout. I like
  their speed; I'd improve their tendency toward dark, dense chrome that can feel intimidating —
  hence Fomi's warm, light, low-pressure canvas.
- **Pinterest / Instagram** — the simplicity and scannability of a visual grid and a
  horizontally-scannable history. I like the effortlessness; I'd improve the lack of
  *provenance* — you can't act on *how* something was made.

The goal was to borrow their **capability and immersion** while keeping Instagram-level
**approachability** — and to add the provenance layer none of them foregrounds.

---

## 5. If I had another month

- **Real provenance graph:** branch a result into variations and see the lineage (which prompt/
  seed produced which), so iteration is visual and non-linear.
- **Compare & pin:** side-by-side A/B of candidates, a pinned "shortlist" tray that survives
  across runs, and keyboard-driven triage (favorite / reject / next).
- **Inline, region-aware editing** (inpaint/outpaint) reachable from the lightbox without
  leaving flow.
- **Collaboration & projects:** real project switching, shareable boards, comments.
- **Persistence & sync** of history/favorites to a real backend, plus optimistic UI.
- **Prompt intelligence:** a genuine "enhance" model, saved prompt snippets, and per-model
  parameter presets.
- **Deeper a11y + i18n**, a full design-token theme (including an optional dark mode), and a
  test suite around the pure logic (`lib/`, the generation state machine).

---

## 6. The single feature that differentiates this workspace

**Reproducible, remixable results as the organizing principle.** In most generators an image is
a dead-end artifact. Here, every output carries its full recipe (prompt + model + seed) in a
persistent details card, the workspace **resumes your last session on return**, and any result
is one click from **Reuse prompt** or **Variations**. The workspace is designed around
*continuing and branching* work — not starting over — which is exactly what a professional who
lives in the tool all day actually needs.

---

### Design trade-offs, briefly

| I prioritized | I simplified | I removed |
|---|---|---|
| Context on return, provenance, flow during generation | Controls via progressive disclosure (Advanced/Styles collapsed) | Node editor, masking/inpaint, auth/billing, marketplace |
| Intentional per-device layouts | One composer shared across breakpoints | Animation library (CSS-only motion) |
| Accessibility & calm visual hierarchy | Credits as a signal, not a system | Social/discovery feed |

There is no perfect interface — the aim was a focused, reproducible, *returnable* creation loop,
and to leave the heavier editing surfaces as deliberate future work rather than clutter today.
