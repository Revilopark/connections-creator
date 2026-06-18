# Connections Creator — Deployment Guide

## What Was Built

A complete React 19 + Vite + TypeScript application that discovers hidden pathways between human inventions. Features include:

- **35 invention nodes** with 80+ weighted edges in a knowledge graph
- **DFS pathfinding** with surprise-factor sorting for 5-10 step connections
- **5 serendipity scores**: Serendipity, Curiosity, Synchronicity, Fortuity, Materiality
- **Constellation Dark theme** with animated starfield and glowing nodes
- **Share card generator** for downloadable PNGs
- **Narrative engine** that auto-generates stories from connection chains

## Deployment Steps

### 1. Create a GitHub Repository

Go to https://github.com/new and create a new repository named `connections-creator` (or any name you prefer).

### 2. Push the Code

```bash
cd /root/.openclaw/workspace/connections-creator
git remote add origin https://github.com/YOUR_USERNAME/connections-creator.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow file (`.github/workflows/deploy.yml`) is already configured

### 4. Trigger Deployment

The deployment will happen automatically on the next push, or you can trigger it manually:

1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages**
3. Click **Run workflow**

### 5. Access Your Site

After deployment completes, your site will be available at:

```
https://YOUR_USERNAME.github.io/connections-creator/
```

## Local Development

```bash
cd /root/.openclaw/workspace/connections-creator
npm install
npm run dev
```

## Project Structure

```
connections-creator/
├── .github/workflows/deploy.yml  # GitHub Pages deployment
├── src/
│   ├── lib/
│   │   ├── graphData.ts          # Knowledge graph + pathfinding
│   │   └── utils.ts              # Helper functions
│   ├── components/
│   │   ├── ConnectionPath.tsx    # Animated path visualization
│   │   └── ShareCard.tsx         # Downloadable share card
│   ├── App.tsx                   # Main application
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Constellation Dark theme
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion (animations)
- Lucide React (icons)

## License

Inkwell Labs — All rights reserved.
