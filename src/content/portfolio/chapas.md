---
title: "Chapas"
date: "2026-09-21T00:00:00.000Z"
description: "Online turn-based bottle cap football. Flick your caps, outplay your opponent and share a link to start a match. Server-authoritative deterministic physics, so every browser sees exactly the same shot."
technologies: ["TypeScript", "Next.js", "PixiJS", "Rapier", "Tailwind CSS", "Turborepo", "Vercel"]
logo: "/portfolio/logos/chapas.svg"
privateCode: true
featured: false
order: 6
version: "0.1.3"
changelog:
  - version: "0.1.3"
    date: "2026-09-21T00:00:00.000Z"
    changes:
      - "First playable prototype: create a match, share the link and play one against one, with anyone else joining as a spectator"
      - "Slingshot shooting: drag back from one of your caps and release, one shot per turn, first to three goals wins"
      - "The server validates and simulates every shot with deterministic physics, and each browser replays the same shot to animate it"
      - "Live match updates streamed to both players and spectators"
      - "English interface with every text externalised, ready for more languages"
  - version: "0.1.1"
    date: "2026-09-21T00:00:00.000Z"
    changes:
      - "Initial release: TypeScript monorepo with a shared game engine, Biome, versioning git hooks and a CI pipeline"
---
