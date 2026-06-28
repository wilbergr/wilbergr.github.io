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
└── piano-app/              # Piano learning app (React + Vite + Tone.js)
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
