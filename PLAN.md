# Sandy Qi Portfolio — Elevator Site Plan

## Concept

An elevator metaphor. Visitors arrive at the exterior of the elevator (cover page), click the call button to enter, then navigate to project floors via a physical button pad inside.

Figma reference: https://www.figma.com/design/ei8Lyr0WYaI4Bpb6IyCVQI/%F0%9F%93%A6-sandyqi--Copy-?node-id=41-27556

---

## Design Tokens

**Colors:**
```css
--color-bg-secondary:     #E5E0D7   /* warm beige, feature background */
--color-bg-primary: #F3F2F0   /* warm off-white, main background */
--color-text:   #4E3A34   /* near-black, primary text */
--color-grey:   #E6E5E2   /* light grey, secondary surfaces */
--color-red:    #DE211D   /* lanyard card front */
--color-brown:  #4E3A34   /* card borders, outlines */
--color-text-inverse: #E5E0D7   /* light text on dark/brown backgrounds */
```

**Fonts:**
- `Silkscreen` (Google Fonts) — pixel/retro; project titles (all-caps), floor button numbers
- `Space Grotesk` (Google Fonts) — all body, labels, nav, UI (weights: 300, 400, 500)

---

## Routes

| URL | Page |
|---|---|
| `/` | Cover — elevator exterior |
| `/home` | Home — elevator interior, lanyard + floor buttons |
| `/level-one` | Moomoo: Power Launch |
| `/level-two` | Beem App UI |
| `/level-three` | Beemlantis |
| `/level-four` | Totally Beem |
| `/level-five` | AP+ Portals |
| `/level-six` | Beem Beeps |
| `/about` | About Me |

---

## Components

| File | Type | Purpose |
|---|---|---|
| `ElevatorDoors.tsx` | Client | Animated split-door open on cover page |
| `LanyardCard.tsx` | Client | 3D flip ID badge hung on lanyard graphic |
| `FloorButtonPad.tsx` | Client | Reusable grid of circular floor buttons |
| `FloorButton.tsx` | Client | Single circular button with press-state animation |
| `ProjectHeader.tsx` | Server | Hero with image bg + dark overlay, year/title/pills |
| `BottomFloorNav.tsx` | Client | Sticky shortcut nav at bottom of project/about pages |
| `EmailModal.tsx` | Client | Modal triggered by emergency bell button |
| `TopNav.tsx` | Server | Logo / name wordmark row |

---

## Pages

### Cover — `/`
- Full-viewport elevator exterior illustration
- Shows: closed doors, "SQ" badge on top, "Welcome" panel
- Single call button (up arrow) — click triggers door-open animation then navigates to `/home`
- Animation: Framer Motion slides two door halves apart (left/right), ~600ms ease-in-out

### Home — `/home`
- **Lanyard section:** SVG lanyard graphic with `LanyardCard` hanging from it
  - **Card front (red `#FF3600`, black border):**
    - "SQ" initials in pink
    - CV row → "See resume" link + arrow icon
    - LinkedIn row → "@sandra-qi" link + arrow icon
    - Contact row → "Email me" (triggers `EmailModal`)
  - **Card back (dark `#232122`):**
    - SANDY QI
    - SENIOR PRODUCT DESIGNER
    - COMPANY: Beem / AP+
    - LOCATION: Sydney
  - Idle gentle sway animation (Framer Motion loop)
  - Hover / click → 3D Y-axis flip to reveal back
- **Scroll-reveal section:**
  - "psst..NEW FLOOR" pill badge (orange outline)
  - `FloorButtonPad` with "Which floor?" label above

### Project Pages — `/level-one` through `/level-six`

All share the same `ProjectLayout`.

**Header:**
- Full-width image with `rgba(0,0,0,0.6)` dark overlay
- `border-radius: 0 0 32px 32px`
- Year (Space Grotesk Medium 14px)
- Project name (Silkscreen 32px, ALL CAPS)
- Short description (Space Grotesk Light 14px)
- Platform pills (outline pill badges, white text)
- `FloorButtonPad` right-aligned beside title block

**Body:**
- Metadata rows: Role, Year, Platform, Project Overview
- Media gallery: `<Image>` / `<video>` blocks (assets provided by Sandy)

**Footer:**
- `BottomFloorNav` — sticky shortcut bar: Ground · Floor 1 · Floor 2 · Floor 3 · Floor 4 · Floor 5 · Level 6

**Floor mapping:**
| Route | Floor label | Project |
|---|---|---|
| `/level-six` | Level 6 | Beem Beeps |
| `/level-five` | Floor 5 | AP+ Portals |
| `/level-four` | Floor 4 | Totally Beem |
| `/level-three` | Floor 3 | Beemlantis |
| `/level-two` | Floor 2 | Beem App UI |
| `/level-one` | Floor 1 | Moomoo: Power Launch |

### About — `/about`
- Header: "Hello, it's Sandy here. A senior product designer who loves her cat, Soup 🐈‍⬛"
- `FloorButtonPad` inline
- Photo of Sandy
- Short blurb
- CV sections:
  - **Work:** Beem/AP+ (Senior PD Oct 2024–present), moomoo/FUTU, Meriton, OPPO Australia, Liquor Tailor
  - **Education:** UNSW BComm/BDes (Hons) — Marketing, Graphic Design, Spatial Design
  - **Skills:** Disciplinaries + Tools columns
  - **References:** Upon request
- `BottomFloorNav`

---

## Floor Button Pad

Button grid layout:
```
[ 5 ] [ 6 ]
[ 3 ] [ 4 ]
[ 1 ] [ 2 ]
[ G ] [ABT]
    [BELL]
```

- Each button: 80×80px circle, Silkscreen font, `#232122` border 2px
- Active/current floor: filled `#0D033C` with white text
- Pressed: Framer Motion `whileTap` scale + fill
- **G** → `/home`
- **1–6** → `/level-one` through `/level-six`
- **ABT** → `/about`
- **BELL** → opens `EmailModal`

---

## Email Modal

- Triggered by BELL button
- `mailto:sandra.jxq@gmail.com` (no backend form needed)
- Close on backdrop click or X button

---

## Build Order

1. `globals.css` — tokens + fonts
2. `layout.tsx` — metadata, font wiring, title "Sandy Qi — Portfolio"
3. `TopNav`
4. `FloorButton` + `FloorButtonPad`
5. `EmailModal`
6. Cover page (`/`) + `ElevatorDoors`
7. Home page (`/home`) + `LanyardCard`
8. `ProjectHeader` + `BottomFloorNav`
9. Six project pages (placeholder media)
10. About page

---

## Assumptions

- G button → `/home` (inside elevator), not back to cover exterior
- Door animation is in-page, then `router.push('/home')` — no separate route for the open state
- Elevator illustration = SVG exported from Figma by Sandy
- Project media = placeholders until Sandy provides assets
- Email modal = mailto link, no backend
- No dark mode — design is light-only
