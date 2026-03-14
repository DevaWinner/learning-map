# Roadmap OS

Roadmap OS is a local-first study execution dashboard for a fixed 52-week AI learning roadmap. It keeps the weekly plan visible, logs study sessions, records delivery risk, and exports a Markdown report without needing a backend.

## Why this exists

- The schedule in [roadmap.md](/home/devwinner/workspace/personal/learning/roadmap.md) is week-based and time-boxed at 20 hours per week.
- The product ideas in [projects.md](/home/devwinner/workspace/personal/learning/projects.md) need a lightweight execution layer so the tracker does not become a second full project.
- Local-first storage keeps setup trivial and makes an eventual Windows wrapper straightforward.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- Browser `localStorage`
- Clean architecture layering

## Quick start

```bash
npm install
npm run dev
```

## Available scripts

- `npm run dev`: regenerate roadmap seed data and start the local dev server
- `npm run build`: regenerate roadmap seed data, type-check, and produce a production build
- `npm run preview`: preview the built app locally
- `npm run generate:roadmap`: regenerate `src/infrastructure/seeds/roadmap-data.generated.json` from `roadmap.md`
- `npm run lint`: run TypeScript checks

## Core features

- Weekly roadmap view with automatic current-week selection
- Session logging with hours, focus area, task, outcomes, and notes
- Weekly checkpoint with delivery status, blockers, next action, and summary note
- Markdown export for weekly reporting
- Project lanes for SIMShield and CerviCare

## Architecture

See [docs/ARCHITECTURE.md](/home/devwinner/workspace/personal/learning/docs/ARCHITECTURE.md) for folder responsibilities and dependency rules, and [RULES.md](/home/devwinner/workspace/personal/learning/RULES.md) for engineering standards.
