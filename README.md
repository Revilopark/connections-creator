# Connections — Creator

A visual, interactive tool that discovers hidden pathways between human inventions through 5-10 steps of serendipitous connection.

## What It Does

Connections Creator finds non-obvious links between any two human inventions. Each path reveals:
- **Serendipity** — unexpected discoveries along the chain
- **Curiosity** — knowledge-driven connections
- **Synchronicity** — parallel developments across domains
- **Fortuity** — chance occurrences that shaped history
- **Materiality** — physical substances that enabled progress

## Architecture

### Knowledge Graph (35 nodes, 80+ edges)
Nodes represent human inventions, discoveries, and foundational concepts:
- **Inventions**: Wheel, Printing Press, Steam Engine, Telegraph, Telephone, Light Bulb, Airplane, Radio, Television, Computer, Transistor, Internet, Smartphone, Photography, Film, Plastic, Laser, Semiconductor, GPS, CRISPR, AI, Gunpowder, Compass, Paper, Glass, Clock, Telescope, Microscope, Refrigeration, Assembly Line
- **Discoveries**: Electricity, Electromagnetism, Penicillin, Vaccination

### Connection Types
Edges encode the relationship between inventions:
- `enabled` — direct technological prerequisite
- `inspired` — conceptual influence
- `preceded` — temporal predecessor
- `analogous_to` — structural similarity (high surprise)
- `unintended` — accidental or unexpected link (highest surprise)

### Pathfinding Algorithm
- Depth-first search with backtracking
- Sorts adjacent nodes by surprise factor (descending)
- Enforces min/max step constraints (5-10 steps)
- Returns top 5 most surprising paths
- Calculates serendipity scores per path

## Visual Design: Constellation Dark

- **Background**: Deep void (`#050510`) with animated starfield
- **Cards**: Elevated from the void with subtle glow effects
- **Colors**: Gold (CTAs), Violet (surprise), Cyan (technology), Emerald (materials)
- **Typography**: Outfit (display/body), JetBrains Mono (metadata)
- **Animations**: Framer Motion spring physics, staggered reveals, pulse effects

## Features

1. **Invention Selector** — Choose start and end inventions from dropdown
2. **Step Control** — Adjust minimum (3-8) and maximum (6-15) path length
3. **Random Pair** — Generate random invention pairs with one click
4. **Visual Path** — Animated timeline with glowing nodes and connection labels
5. **Serendipity Scores** — Five-dimensional scoring with animated bars
6. **Narrative Generation** — Auto-generated story of the connection chain
7. **Alternative Paths** — Browse up to 4 additional paths
8. **Share Card** — Downloadable PNG with path visualization and scores

## File Structure

```
connections-creator/
├── src/
│   ├── lib/
│   │   ├── graphData.ts      # Knowledge graph + pathfinding + scoring
│   │   └── utils.ts          # Helper functions
│   ├── components/
│   │   ├── ConnectionPath.tsx # Animated path visualization
│   │   └── ShareCard.tsx      # Downloadable share card generator
│   ├── App.tsx               # Main application
│   ├── main.tsx              # Entry point
│   └── index.css             # Constellation Dark theme
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Usage

```bash
cd connections-creator
npm install
npm run dev      # Development server
npm run build    # Production build
```

## How Connections Work

Example: **The Wheel** → **Neural Networks**

The algorithm traces through the graph finding paths like:
1. Wheel → Steam Engine → Electricity → Computer → AI → Neural Networks
2. Wheel → Assembly Line → Computer → Internet → AI → Neural Networks

Each edge has a surprise factor (0-1). Paths with `analogous_to` and `unintended` connections score higher, producing more compelling narratives.

## Scoring System

| Dimension | What It Measures | Triggers |
|-----------|-----------------|----------|
| Serendipity | Unexpected discoveries | High surpriseFactor edges |
| Curiosity | Knowledge-driven links | `enabled` edges with high surprise |
| Synchronicity | Parallel patterns | `analogous_to` edges |
| Fortuity | Chance occurrences | `unintended` edges |
| Materiality | Physical substance role | Material-type nodes in path |

## License

Inkwell Labs — All rights reserved.
# Trigger deploy
