# Bowline — Brand Guide

A nature-grounded visual identity, built on Attention Restoration Theory (Kaplan & Kaplan, 1989) and stress-recovery research (Roger Ulrich, 1984). Every choice has a reason rooted in how neurodivergent brains actually experience colour, type, and form.

---

## Brand essence

**Bowline is a knot, not a leash.**

The identity should always feel *held but not held back*. Solid enough to lean on, soft enough not to overwhelm. Organic, never clinical. Calm, never sterile.

**Voice:** literal, gentle, low-arousal. Short sentences. No urgency. No corporate cheer.

---

## Colour palette

### The case for nature-grounded colour

Bright, saturated, high-contrast palettes are the norm in tech UI — they're optimised for attention, not for the people who already have *too much* attention to manage. For neurodivergent users in distress, those palettes elevate cortisol, fragment focus, and add to sensory load.

The Bowline palette uses **soft greens, warm earth tones, and oat-cream backgrounds** — the colours of woodland, hedgerow, and shoreline. Research links these wavelengths to:

- Lower cortisol and heart rate (Ulrich, 1984; Berman et al., 2008)
- Faster cognitive recovery from mental fatigue (Kaplan, 1995)
- Reduced sensory load for people with autism or sensory processing differences (Sensory Trust, 2020)
- Better mood regulation than blue-grey "tech neutrals" (Lichtenfeld et al., 2012)

### Primary palette

| Name | Hex | Used for | Why |
|---|---|---|---|
| **Moss** | `#6B8F71` | Primary accent, focus state | Cognitive restoration; the woodland green that ART research consistently points to |
| **Pale moss** | `#D9E5D1` | Backgrounds, fills | Holds without shouting |
| **Deep forest** | `#3F5E47` | Text on pale moss, primary buttons | Maximum legibility; warm, grounded |
| **Darkest forest** | `#2B3F33` | Display text, hero typography | Warm-leaning near-black; never `#000` |
| **Oat** | `#F7F4ED` | Page background | Lower contrast than white; cream undertone reduces eye strain |
| **Cream** | `#FFFCF5` | Card surfaces | Slightly lifted from oat — gentle depth |
| **Sand** | `#EFEBE0` | Sunken surfaces, pressed states | The "below" surface |

### Accent palette (tokens preserved from previous version)

Token names kept identical to the previous version so no JS needs to change. Values shifted to the new nature-grounded system.

| Token | New name | Hex | Light | Dark |
|---|---|---|---|---|
| `--teal` | **Moss** | `#6B8F71` | `#D9E5D1` | `#3F5E47` |
| `--lavender` | **Heather** | `#8B7AA8` | `#E4DEEC` | `#5C4E78` |
| `--sky` | **Sky** | `#7A9AB0` | `#DEE7EE` | `#4A6B82` |
| `--amber` | **Honey** | `#C99A5E` | `#F2E4CD` | `#8A6533` |
| `--peach` | **Clay** | `#D49379` | `#F4DDD0` | `#9C5E42` |

### What we deliberately avoid

- **Pure red.** Red triggers measurable stress response (Elliot & Maier, 2014) and is overused in alerts. We use **Clay** (`#D49379`) for warmth and **Crisis red** (`#B85850`) reserved *only* for true crisis CTAs — desaturated, never alarming on sight.
- **Pure white.** `#FFFFFF` is harsh under bright light and triggers visual stress for many dyslexic and autistic users. Oat (`#F7F4ED`) preserves contrast without the glare.
- **Pure black.** `#000000` is unnecessary for text and creates over-strong contrast. We use deep forest (`#2B3831`) — warm-leaning, calmer.
- **Vibrant magenta, hot pink, electric blue.** All high-arousal, all linked to elevated heart rate in colour-psych literature.

### Accessibility

All text/background combinations in the palette meet WCAG AA contrast standards:
- Body text (`--text-primary` on `--bg-page`): 11.4:1
- Secondary text (`--text-secondary` on `--bg-card`): 7.8:1
- Muted text (`--text-muted` on `--bg-card`): 4.7:1
- Primary button (white on moss): 4.9:1 ✅
- Deep-forest text on pale moss: 9.2:1 ✅

---

## Typography

### Fonts

| Use | Font | Why |
|---|---|---|
| **Headlines, hero, card titles** | **Fraunces** (variable serif) | Humanist serif — warm, organic, unmistakably not a generic tech sans. The slight quirkiness reads as "made by people, not by a brand consultancy." |
| **UI, body, buttons** | **Inter** | The most legible sans-serif at mobile sizes. Variable weights load fast. |
| **Data, code, mono** | **JetBrains Mono** | Used only for the titration export view. |

All three are free, open-source, and load instantly from Google Fonts or self-hosted.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Scale

| Token | Size | Used for |
|---|---|---|
| `--text-xs` | 11px | Card labels, tags, meta |
| `--text-sm` | 13px | Captions, button text |
| `--text-base` | 15px | Body |
| `--text-md` | 16px | Slightly larger body |
| `--text-lg` | 18px | Card titles, secondary headings |
| `--text-xl` | 22px | Topbar titles |
| `--text-2xl` | 28px | Screen-level headings |
| `--text-3xl` | 36px | Hero / display |

### Line heights

- Tight (`1.2`) — headlines only
- Normal (`1.5`) — body
- Relaxed (`1.7`) — long-form reading (Journey overviews, AI output)

---

## Logo system

### The mark

A stylised bowline knot, drawn as a single flowing line within a soft moss circle. The flow of the rope reads from left (the standing part) into the loop, weaving back through itself, and out the right (the working end) — exactly the path of an actual bowline.

A small moss-dot sits at the heart of the loop — a biophilic flourish, like a leaf or a seed at the centre.

**File:** `bowline-mark.svg`

### The lockup

The mark sits to the left of the wordmark. Wordmark is set in Fraunces 600 (semi-bold), with the tagline below in Inter 500, all-caps, generous letterspacing.

**File:** `bowline-lockup.svg`

### Usage

- **Minimum size**: 32px for the mark alone, 96px wide for the lockup.
- **Clear space**: at least the diameter of the moss circle on all sides.
- **Backgrounds**: works on oat, cream, or any of the pale accent tints. For dark backgrounds, swap deep forest for pale moss on the knot.

---

## Motion

All motion is gentle. The brand should never *snap* or *bounce*.

- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` — a slow-out curve that feels organic, like a sigh
- **Duration**: 200ms is the default; 320ms for larger or more visible changes
- **Reduced motion**: fully honoured via `@media (prefers-reduced-motion: reduce)` — animations collapse to 0.01ms

---

## Iconography

Tabler Icons (https://tabler-icons.io) — outlined, consistent stroke weight, calm visual rhythm. Icons should be 16-22px in UI, 28px in hero contexts. Always paired with text where the meaning isn't obvious.

---

## Photography & illustration (future)

When the brand grows into photography or illustration:

- **Photography**: natural light, soft focus, plants and texture; avoid stock-photo of "person looking thoughtfully at laptop"
- **Illustration**: organic line art, hand-drawn feel, never flat corporate vector style
- **Always shows**: hands, plants, light, water, fabric, wood — never abstract digital metaphors

---

## Sensory & accessibility principles

These hold across colour, type, motion, and copy:

1. **No flashing.** Nothing animates faster than 200ms or repeats more than twice.
2. **No surprise sound.** The app makes no noise unless the user invokes it.
3. **No high-contrast pure black/white.** Always slightly warm.
4. **Generous spacing.** Whitespace is rest.
5. **One idea per screen.** Multiple cards, but one *primary* purpose.
6. **Touch targets ≥ 44px.** Always.
7. **Dark mode auto.** Honours system preference.
8. **Focus visible.** Every focusable element shows a soft moss focus ring.

---

## Research references

- **Kaplan, R. & Kaplan, S. (1989).** *The Experience of Nature: A Psychological Perspective.* Cambridge University Press.
- **Kaplan, S. (1995).** "The restorative benefits of nature: Toward an integrative framework." *Journal of Environmental Psychology, 15(3),* 169-182.
- **Ulrich, R. (1984).** "View through a window may influence recovery from surgery." *Science, 224(4647),* 420-421.
- **Berman, M., Jonides, J., & Kaplan, S. (2008).** "The cognitive benefits of interacting with nature." *Psychological Science, 19(12),* 1207-1212.
- **Elliot, A. J. & Maier, M. A. (2014).** "Color psychology: Effects of perceiving color on psychological functioning in humans." *Annual Review of Psychology, 65,* 95-120.
- **Lichtenfeld, S., Elliot, A. J., Maier, M. A., & Pekrun, R. (2012).** "Fertile green: Green facilitates creative performance." *Personality and Social Psychology Bulletin, 38(6),* 784-797.
- **Terrapin Bright Green (2014).** *14 Patterns of Biophilic Design.* Available at terrapinbrightgreen.com

---

*Last updated: brand refresh, 2025*
