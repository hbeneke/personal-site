---
title: "KickCaps"
date: "2026-09-21T00:00:00.000Z"
description: "Turn-based bottle cap football in the browser. Flick your caps and outplay your rival online with a shared link, or take turns on the same device. Server-authoritative deterministic physics, so every browser sees exactly the same shot."
technologies: ["TypeScript", "Next.js", "PixiJS", "Rapier", "Tailwind CSS", "shadcn/ui", "Turborepo", "Vercel"]
link: "https://www.kickcaps.com"
logo: "/portfolio/logos/kickcaps.svg"
privateCode: true
demo: "https://www.kickcaps.com"
featured: false
status: "wip"
order: 6
version: "0.3.20"
changelog:
  - version: "0.3.20"
    date: "2026-09-22T00:00:00.000Z"
    changes:
      - "A progress bar covers the pitch while a match loads"
      - "Resign and rematch buttons show a spinner while they are working"
  - version: "0.3.18"
    date: "2026-09-22T00:00:00.000Z"
    changes:
      - "Your shots move the moment you release them; the server confirms them and a rejected shot snaps the board back"
      - "Fixed online shots triggering a false 'both players disconnected' pause"
      - "Vercel Speed Insights enabled"
  - version: "0.3.13"
    date: "2026-09-22T00:00:00.000Z"
    changes:
      - "The live match list no longer shows matches whose players have left"
      - "Site-wide cap on match creation, so shared storage cannot be flooded"
  - version: "0.3.9"
    date: "2026-09-22T00:00:00.000Z"
    changes:
      - "If your rival closes the game, you find out right away"
      - "Close a match tab and your other tabs offer to take you back"
      - "Cheaper presence checks and polling"
  - version: "0.3.7"
    date: "2026-09-22T00:00:00.000Z"
    changes:
      - "Optional timed turns and a new way to win: most goals after a set number of turns"
      - "Rematches with a running series score, a resign button and forfeit by abandonment"
      - "Matches pause when someone disconnects, reconnect on their own and bring you back if you close the tab by mistake"
      - "The home page lists live matches to watch and shows how many people are playing"
      - "Choose who can watch your match: everyone, people with the link, or nobody"
      - "A 'What's new' dialog and a banner reminding you the game is an early version"
      - "Matches now live on Redis, with rate limits, expiry and security headers on the match API"
      - "A clear message when a match link has ended or the browser cannot show the pitch"
  - version: "0.3.0"
    date: "2026-09-21T00:00:00.000Z"
    changes:
      - "The project gets its name and home: KickCaps, now at www.kickcaps.com"
  - version: "0.2.1"
    date: "2026-09-21T00:00:00.000Z"
    changes:
      - "Vercel Analytics enabled"
  - version: "0.2.0"
    date: "2026-09-21T00:00:00.000Z"
    changes:
      - "New home menu with every game mode: play online as a guest or two players on one device, with AI, teams, rankings and sign-in coming soon"
      - "Two players, one device: take turns on the same screen"
      - "The match creator picks how the match is won, starting with first to three goals, built to grow into many more rules"
      - "Full-screen match view with a stadium-style scoreboard above the pitch and a side panel with the match info and a chat preview"
      - "Responsive layout: side panel on desktop, stacked on smaller screens and a slide-over panel on phones in landscape"
      - "Waiting screen over the pitch until the rival joins, with a one-click invite link"
      - "Match ID chip that copies the invite link"
      - "Light and dark themes following the system, with a toggle in the header"
      - "Matches keep in sync while the tab is in the background"
      - "Bottle cap logo and favicon"
      - "Interface rebuilt on shadcn/ui components"
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
