# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-app GitHub Pages site that hosts multiple independent web applications. Each app is developed and deployed independently while sharing a common landing page.

### Repository Structure

```
wilbergr.github.io/
├── index.html              # Root landing page
├── styles.css              # Landing page styles
├── package.json            # Root deployment scripts
├── CLAUDE.md               # This file
├── README.md               # Repository documentation
└── birthday/               # Birthday meme generator app
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.js
```

### URL Structure

- Root: `https://wilbergr.github.io/` - Landing page listing all apps
- Birthday app: `https://wilbergr.github.io/birthday/` - Birthday meme generator
- Future apps: `https://wilbergr.github.io/app-name/` - Additional apps

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
# Development server (starts on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint the codebase
npm run lint

# Preview production build locally
npm run preview

# Deploy birthday app to GitHub Pages
npm run deploy
```

## Deployment Strategy

### How Deployment Works

The repository uses the `gh-pages` npm package to deploy to GitHub Pages:

1. **Root landing page**: Deploys `index.html`, `styles.css`, and `README.md` to the root of the gh-pages branch
2. **Birthday app**: Deploys its `dist/` folder to `/birthday/` subdirectory on the gh-pages branch
3. **Future apps**: Each app deploys to its own subdirectory (e.g., `/app-name/`)

The `--add` flag ensures that each deployment preserves existing content, preventing apps from overwriting each other.

### Deployment Process

**Deploy individual app:**
```bash
cd birthday
npm run deploy
```

**Deploy root landing page:**
```bash
# From repository root
npm run deploy
```

**Deploy everything:**
```bash
# From repository root
npm run deploy:all
```

## Adding a New Application

To add a new application to the site:

1. **Create app directory** at root level:
   ```bash
   mkdir my-new-app
   cd my-new-app
   ```

2. **Initialize with your preferred framework:**
   ```bash
   npm create vite@latest . -- --template react
   # or use any other framework/template
   ```

3. **Configure package.json:**
   - Set `homepage` field: `"homepage": "https://wilbergr.github.io/my-new-app/"`
   - Add deploy script: `"deploy": "gh-pages -d dist --dest my-new-app --add"`
   - Add predeploy if needed: `"predeploy": "npm run build"`
   - Install gh-pages: `npm install --save-dev gh-pages`

4. **Configure build tool** (e.g., Vite):
   ```javascript
   // vite.config.js
   export default defineConfig({
     plugins: [react()],
     base: '/my-new-app/',
   })
   ```

5. **Update root landing page** (`index.html`):
   - Add a new app card with description and link to `/my-new-app/`

6. **Deploy the new app:**
   ```bash
   npm run deploy
   ```

7. **Deploy updated landing page:**
   ```bash
   cd ..
   npm run deploy
   ```

## Birthday App Architecture

### Application Structure

The birthday app is a single-page React application with the following key components:

**App.jsx** - Main component that implements:
- Meme carousel with previous/next navigation
- Canvas-based meme rendering with text overlay
- Dynamic font sizing that adapts to image width
- Text wrapping for long captions
- Image upload functionality
- Download feature for generated memes
- Optional riddles attached to specific memes (triggered by clicking the image)

**memes.json** - Data source containing:
- Pre-loaded meme images with paths to `/images/` directory
- Default `topText` and `bottomText` for each meme
- Optional `riddleText` field that creates clickable images with riddle popups

### Key Technical Details

**Canvas Rendering:**
- Images are loaded dynamically from public/images/ directory
- Text is rendered using the Impact font with white fill and black stroke
- Font size is calculated dynamically based on canvas width (starts at width/10)
- Text wrapping algorithm splits words to fit within 95% of canvas width
- Top text starts at font size + 10px from top
- Bottom text is positioned from the bottom up, accounting for multiple wrapped lines

**State Management:**
- `images` array holds both pre-loaded and user-uploaded images
- `current` index tracks the carousel position
- `topText` and `bottomText` are synced with the current image's default values when navigating
- `showRiddle` controls the riddle dialog visibility

**Image Handling:**
- Pre-loaded images use paths like `/images/filename.jpg` (served from public/)
- User-uploaded images use `URL.createObjectURL()` for temporary blob URLs
- Canvas uses `crossOrigin = 'anonymous'` to avoid CORS issues

### Birthday App File Organization

```
birthday/
├── public/
│   ├── images/          # Meme image assets
│   └── favicon.ico
├── src/
│   ├── App.jsx          # Main meme generator component
│   ├── App.css          # App-specific styles
│   ├── main.jsx         # React entry point
│   ├── index.css        # Global styles
│   └── memes.json       # Meme data (images, text, riddles)
├── index.html           # HTML template
├── vite.config.js       # Vite configuration (base: '/birthday/')
├── eslint.config.js     # ESLint configuration
└── package.json         # Dependencies and scripts
```

### ESLint Configuration

The birthday app uses ESLint with:
- React hooks plugin (`eslint-plugin-react-hooks`)
- React refresh plugin for Vite HMR
- Custom rule: `no-unused-vars` allows uppercase variables (e.g., `^[A-Z_]`)
- Files: `**/*.{js,jsx}`
- Ignores: `dist/` directory

### Adding New Memes to Birthday App

To add new memes:
1. Place image files in `birthday/public/images/`
2. Add entries to `birthday/src/memes.json` with structure:
   ```json
   {
     "url": "/images/filename.jpg",
     "name": "filename.jpg",
     "topText": "Top caption text",
     "bottomText": "Bottom caption text",
     "riddleText": "Optional riddle (makes image clickable)"
   }
   ```
3. The `riddleText` field is optional - if present, clicking the meme will show a popup with the riddle

## Development Notes

### Birthday App
- React 19.1.1 is used with StrictMode enabled
- Vite 7.x provides fast HMR and build tooling
- The app uses React hooks: `useState`, `useEffect`, `useLayoutEffect`, `useRef`
- Canvas operations happen in `useEffect` triggered by image/text changes
- The exhaustive-deps warning for `drawMeme` is intentionally suppressed (line 123-124)

### General Notes
- Each app is completely independent with its own dependencies
- Apps can use different frameworks (React, Vue, vanilla JS, etc.)
- The base path in build configuration must match the deployment destination
- Always use the `--add` flag when deploying to preserve other apps
