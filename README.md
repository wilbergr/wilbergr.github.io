# wilbergr.github.io

A multi-app GitHub Pages site hosting various web applications and experiments.

## Live Site

Visit: [https://wilbergr.github.io/](https://wilbergr.github.io/)

## Applications

- **[Birthday Meme Generator](https://wilbergr.github.io/birthday/)** - Create personalized birthday memes with custom text overlays
- More apps coming soon!

## Repository Structure

Each application is independently developed and deployed to its own subdirectory:

```
wilbergr.github.io/
├── index.html       # Landing page
├── styles.css       # Landing page styles
└── birthday/        # Birthday meme generator app
    └── ...
```

## Deployment

Each app can be deployed independently:

```bash
# Deploy root landing page
npm run deploy

# Deploy birthday app
npm run deploy:birthday

# Deploy everything
npm run deploy:all
```

See [CLAUDE.md](CLAUDE.md) for detailed development and deployment instructions.
