# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-app GitHub Pages site hosting independent web applications. Each app is developed and deployed independently while sharing a common landing page.

**Live Site**: https://wilbergr.github.io/

## Repository Structure

```
wilbergr.github.io/
├── index.html              # Root landing page
├── styles.css              # Landing page styles
├── package.json            # Root deployment scripts
├── README.md               # Repository documentation
├── birthday/               # Birthday meme generator app (React + Vite)
├── piano-app/              # Piano learning app (React + Vite + Tone.js)
├── chess-app/              # Chess trainer app (React + Vite)
├── sound-waves/            # Sound waves & harmony visualizer (React + Vite)
└── guitar-app/             # Guitar learning app (React + Vite + Tone.js PluckSynth)
```

## Common Commands

### Root Level (from `wilbergr.github.io/`)

```bash
# Deploy root landing page only
npm run deploy

# Deploy birthday app only
npm run deploy:birthday

# Deploy everything (landing page + all apps)
npm run deploy:all
```

### Birthday App (from `wilbergr.github.io/birthday/`)

```bash
# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint the codebase
npm run lint

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

### Piano App (from `wilbergr.github.io/piano-app/`)

```bash
# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint the codebase
npm run lint

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Deployment Strategy

Uses `gh-pages` npm package with `--add` flag to preserve existing content when deploying individual apps.

- **Root landing page**: Deploys `index.html`, `styles.css`, `README.md` to root of gh-pages branch
- **Birthday app**: Deploys `dist/` folder to `/birthday/` subdirectory
- **Piano app**: Deploys `dist/` folder to `/piano-app/` subdirectory

Each app's `vite.config.js` must set `base` to match its deployment path (e.g., `base: '/birthday/'`).

## Adding a New Application

1. Create app directory at root level
2. Initialize with preferred framework (e.g., `npm create vite@latest . -- --template react`)
3. Configure `package.json`:
   - Set `homepage` field: `"homepage": "https://wilbergr.github.io/app-name/"`
   - Add deploy script: `"deploy": "gh-pages -d dist --dest app-name --add"`
   - Add predeploy: `"predeploy": "npm run build"`
4. Configure build tool (e.g., Vite): `base: '/app-name/'`
5. Update root `index.html` with new app card
6. Deploy app: `npm run deploy`
7. Deploy updated landing page: `cd .. && npm run deploy`

## Birthday App Architecture

**Tech Stack**: React 19, Vite 7, Canvas API

### Key Components

**App.jsx** - Main component implementing:
- Meme carousel with navigation
- Canvas-based meme rendering with text overlay
- Dynamic font sizing (starts at canvas width / 10)
- Text wrapping for long captions
- Image upload functionality
- Download feature for generated memes
- Optional riddles attached to memes (click image to show)

**memes.json** - Data source:
```json
{
  "url": "/images/filename.jpg",
  "name": "filename.jpg",
  "topText": "Top caption text",
  "bottomText": "Bottom caption text",
  "riddleText": "Optional riddle (makes image clickable)"
}
```

### Canvas Rendering Details

- Images loaded from `public/images/` directory
- Text rendered with Impact font (white fill, black stroke)
- Font size calculated dynamically based on canvas width
- Text wrapping keeps lines within 95% of canvas width
- Top text positioned at font size + 10px from top
- Bottom text positioned from bottom up, accounting for wrapped lines

### State Management

- `images`: Array of pre-loaded and user-uploaded images
- `current`: Carousel position index
- `topText`/`bottomText`: Synced with current image defaults
- `showRiddle`: Controls riddle dialog visibility

### Adding New Memes

1. Place image in `birthday/public/images/`
2. Add entry to `birthday/src/memes.json`
3. `riddleText` field is optional; if present, clicking meme shows riddle popup

## Piano App Architecture

**Tech Stack**: React 19, Vite 7, Tone.js 15, OpenSheetMusicDisplay

### Key Components

**Piano Component** (`Piano.jsx`)
- 88-key interactive keyboard (A0 to C8)
- Mouse and touch event handling
- Real-time key highlighting with priority levels
- Visual feedback for user interactions
- Auto-scroll to Middle C on load

**SongPlayer Component** (`SongPlayer.jsx`)
- Three learning modes:
  - **Demo**: Watch/listen with speed control (0.5x to 2.0x)
  - **Practice**: Self-paced with visual guidance
  - **Challenge**: Real-time performance testing with count-in
- Metronome/click track with Tone.js scheduling
- 8-beat count-in before practice/challenge
- Real-time performance metrics
- Music notation rendering via OpenSheetMusicDisplay

**MusicStaff Component** (`MusicStaff.jsx`)
- Professional music notation display
- Uses OpenSheetMusicDisplay for SVG-based rendering
- webmscore for MIDI ↔ MusicXML conversion

### Service Layer

**audioService.js** (Singleton)
- Two sound banks: Piano (Salamander samples) and Synth (PolySynth)
- Key methods: `preload()`, `init()`, `playNote()`, `stopNote()`, `setVolume()`
- Samples hosted on `https://tonejs.github.io/audio/salamander/`

**performanceTracker.js**
- Timing windows: Perfect (±100ms), Good (±200ms), OK (±350ms)
- Tracks individual note results, accuracy percentage, pass/fail (75% threshold)
- Methods: `checkNote()`, `getAccuracy()`, `hasPassed()`, `getResults()`

**midiParser.js**
- Parse MIDI files using @tonejs/midi
- Convert to app format with tempo, time signature, note array
- Difficulty estimation based on note density and polyphony

### Built-in Songs

9 songs across 3 difficulty levels:
- **Beginner**: C Major Scale, Twinkle Twinkle, Mary Had a Lamb
- **Intermediate**: Ode to Joy, Für Elise, Jingle Bells
- **Advanced**: Canon in D, Moonlight Sonata, Hungarian Dance No. 5

All generated programmatically via `midiParser.js`.

### Song Object Structure

```javascript
{
  id: "song-id",
  title: "Song Name",
  difficulty: "beginner|intermediate|advanced",
  duration: 60,              // seconds
  tempo: 120,                // BPM
  notes: [
    {
      note: "C4",            // Note name
      time: 0.5,             // Seconds from start
      duration: 0.5,         // Note duration
      velocity: 0.8,         // 0.0-1.0 intensity
      midi: 60               // MIDI note number (21-108)
    }
  ]
}
```

### Real-time Feedback System

- Emoji-based feedback bubbles on keys
- Shows: "Perfect", "Good", "OK", "Wrong", "Late"
- Displays timing information (e.g., "+50ms")
- Auto-clears after 1 second

### Key Features

- 88-key keyboard with mouse and touch support
- Multi-sampling (every 3rd note) for performance
- Velocity-based dynamics
- Polyphonic playback (128 simultaneous notes)
- Metronome with count-in
- MIDI file upload support
- Auto-difficulty estimation
- Music notation auto-conversion

## Development Notes

### Both Apps
- React 19 with StrictMode enabled
- Vite 7 for fast HMR and build tooling
- Each app completely independent with own dependencies
- `base` path in Vite config must match deployment destination
- Always use `--add` flag when deploying to preserve other apps

### Birthday App
- Uses React hooks: `useState`, `useEffect`, `useLayoutEffect`, `useRef`
- Canvas operations in `useEffect` triggered by image/text changes
- User-uploaded images use `URL.createObjectURL()` for blob URLs
- Canvas uses `crossOrigin = 'anonymous'` to avoid CORS issues

### Piano App
- Singleton pattern for AudioService
- State updates throttled to 50ms in playback loop
- Animation frame-based playback (not setInterval)
- Lazy loading of samples (preload without audio context start)
- Requires user interaction to initialize audio context
- Custom hooks for performance tracking and playback loop management

## Guitar App Architecture

**Tech Stack**: React 19, Vite 7, Tone.js 15 (PluckSynth)

### Key Components

**App.jsx** — Top-level state: instrument, selectedChord, activeStrings, appMode (learn/challenge), audioReady.

**InstrumentSelector** — Switches between guitar (6-string), bass (4-string), ukulele (4-string). Resets chord selection on change.

**Fretboard** (`Fretboard.jsx` + `GuitarString.jsx`) — SVG horizontal fretboard (12 frets). Thinnest string at top. Shows chord fingering dots and barre bars. Each fret cell is clickable for plucking. Supports `placementMode` for challenge fretboard placement.

**ChordDiagram** + **ChordList** — Traditional vertical chord box diagram (SVG). ChordList groups chords by major/minor type with a 2-column grid.

**ChordChallenge** — Two challenge types: Diagram Recognition (pick correct diagram from 4 options) and Fretboard Placement (tap correct fret positions). Both have Practice (no timer) and Timed (15 rounds, 10s each) modes. 75% pass threshold.

### Data Layer

**`src/data/tunings.js`** — `TUNINGS` object for guitar/bass/ukulele. String index 0 = thickest/lowest string always.

**`src/data/chords.js`** — `ALL_CHORDS` array. 14 guitar chords (major + minor), 14 bass power chords, 14 ukulele chords = 42 total. Chord shape: `{ id, name, shortName, root, type, instrument, strings[], fingers[], barre, startFret }`.

**`src/services/audioService.js`** — Singleton `GuitarAudioService`. One `Tone.PluckSynth` per string. Re-initializes on instrument change (different string count). Call `init(stringCount)` after first user gesture.

**`src/services/chordUtils.js`** — `getChordsForInstrument()`, `getNoteForFret()`, `getDecoyChords()`, `chordsMatch()`.

### Design System

`src/styles/tokens.css` defines all color / spacing / radius / typography custom properties (`--bg`, `--surface`, `--accent` warm copper, `--space-1..8` on a 4px scale, `--font-sans` Inter Variable, `--font-mono` JetBrains Mono Variable, with `prefers-color-scheme: light` overrides). It is imported from `main.jsx` before `index.css`. New CSS must use these tokens — no hex literals or hand-rolled gradients.

Buttons use a base `.btn` class with variants `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-icon` (defined in `index.css`). All variants enforce `min-height: 44px` / `min-width: 44px` for touch targets. Compose: `<button class="btn btn-primary">`. Keep positional/layout overrides in component CSS; do not redeclare gradient/padding/border-radius there.

`:focus-visible` is wired globally to a 2px copper outline — do not strip outlines per-component.

Animations must be wrapped in `@media (prefers-reduced-motion: no-preference)` (see `Fretboard.css` `stringPulse`, `ChordChallenge.css` `timerPulse`).

Icons are [`lucide-react`](https://lucide.dev) components — no decorative emoji in the UI. Size and color them via CSS, not hardcoded `size=`/`color=` props: `.btn svg` and the `.inline-icon` utility (both in `index.css`) size icons to the surrounding font (`em` units) and icons inherit `currentColor`. An icon that carries meaning needs an adjacent text label or an `aria-label`. To place an icon inside an existing SVG (e.g. the muted/open string markers in `Fretboard.jsx` / `ChordDiagram.jsx`), render the Lucide component as a nested `<svg>` with `x`/`y`/`width`/`height` and set its color via `style={{ color: 'var(--token)' }}` — `var()` does not resolve in SVG presentation attributes like `stroke=`. The Edit/Play control is a segmented control (`.segmented-control` + `.segment` in `Fretboard.css`) implemented as an ARIA **radiogroup**: `role="radiogroup"` wrapper, each segment `role="radio"` with `aria-checked`, roving `tabIndex` (checked=0, others=-1), and Arrow keys move selection (`MODE_SEGMENTS` + `handleSegmentKeyDown` in `Fretboard.jsx`). The active segment is styled `btn btn-primary active`, the inactive one `btn btn-ghost`.

### Accessibility & Theming

- **Themes**: dark is the `:root` default; light is applied via `[data-theme="light"]` (set on `<html>` by `useTheme.js`, persisted to `localStorage` key `guitar-theme`) or, pre-JS, via `@media (prefers-color-scheme: light) :root:not([data-theme])`. The header Sun/Moon button toggles it. Both themes are verified WCAG AA. Because a single accent can't clear 4.5:1 as both small text on white *and* a fill behind dark text, the light accent is darkened and primary-button text uses the `--on-accent` token (`#1a1108` dark / `#ffffff` light) — never hardcode button-on-accent foreground.
- **Keyboard fretboard**: SVG fret cells (`GuitarString.jsx`) are `role="button"` + `tabIndex={0}` + `aria-label` (`"{string} string, fret N"`), activated by click or Enter/Space; `aria-pressed` reflects toggle state in edit/placement modes. Focus ring is `.fret-cell:focus-visible` in `index.css` (outline works on SVG shapes in Chrome).
- **Colorblind cues**: state never relies on color alone — open/mute use Circle/X glyphs, answered diagram options get a Check/X `.option-badge`, active placement toggles get a 2px border, and the revealed-correct fret is an outlined dashed ring (vs the solid user-placed dot).
- **Live region**: audio-ready state is announced through an `aria-live="polite"` `role="status"` `.sr-only` region in `App.jsx`.

### String Index Convention

`strings[]` array index 0 = thickest string (low E for guitar, low E for bass, G for uke). The fretboard SVG shows thinnest string at the top (display row = `stringCount - 1 - si`).

### Deploy

```bash
cd guitar-app && npm run deploy
```

## Deployment

This repo uses the `gh-pages` npm package to deploy — there is **no CI/CD pipeline** that auto-builds from `main`. GitHub's `pages-build-deployment` workflow triggers automatically only when the `gh-pages` branch receives a push.

To deploy after merging PRs, run the appropriate deploy script manually:

```bash
# Deploy only the piano app (most common — most active development)
cd piano-app && npm run deploy

# Deploy only the root landing page
npm run deploy

# Deploy everything
npm run deploy:all
```

Each app's `package.json` `deploy` script runs `predeploy` (build) then `gh-pages -d dist --dest <app-name> --add`.
After the push, GitHub Actions run `pages-build-deployment` on `gh-pages` branch (~1 min to complete).

### Deploy checklist — what to run after each change

| Changed files | Command to run |
|---|---|
| `index.html` or `styles.css` | `npm run deploy` (from repo root) |
| `piano-app/src/**` | `cd piano-app && npm run deploy` |
| `guitar-app/src/**` | `cd guitar-app && npm run deploy` |
| New app tile added to `index.html` | Both root deploy **and** app deploy |
| Everything | `npm run deploy:all` (from repo root) |

**Warning:** app-specific deploys do NOT update the root landing page. If you add a new app tile to `index.html`, you must also run `npm run deploy` from the repo root, or the landing page on the live site will not reflect the change.
