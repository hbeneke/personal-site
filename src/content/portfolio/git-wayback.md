---
title: "Git Wayback"
date: "2026-01-14T00:00:00.000Z"
description: "Visualize the evolution of any GitHub repository. Git history analysis, branch visualization, and screenshot timeline of your project's visual evolution."
technologies: ["TypeScript", "Vue", "Turborepo", "Neon", "Vercel"]
link: "https://git-wayback.com"
image: "/portfolio/git-wayback.png"
github: "https://github.com/hbeneke/git-wayback"
featured: false
order: 2
version: "0.4.0"
changelog:
  - version: "0.4.0"
    date: "2026-01-21T00:00:00.000Z"
    changes:
      - "feat(web): reorganize tabs - Evolution as primary view"
      - "feat(web): create RepoDiagram component with Gource-style visualization"
      - "feat(api): add evolution endpoint with database caching"
      - "feat(api): add timeline and tree endpoints for tag navigation"
      - "feat(db): add evolution_snapshots schema for caching tag data"
  - version: "0.3.1"
    date: "2026-01-20T00:00:00.000Z"
    changes:
      - "fix(scripts): use temp file for tag message to preserve changelog"
  - version: "0.3.0"
    date: "2026-01-20T00:00:00.000Z"
    changes:
      - "feat(ui): redesign repository page with tabs"
      - "feat(api): add comprehensive repository data endpoint"
      - "feat: add screenshot analysis infrastructure (disabled)"
      - "feat(web): add Tailwind CSS and repository search"
      - "feat: enhance app layout and SEO metadata for improved user experience"
      - "feat: implement search API endpoint for GitHub repositories"
      - "fix: add missing environment variables to turbo.json"
      - "fix: configure vercel output directory and turbo env vars"
  - version: "0.2.0"
    date: "2026-01-12T00:00:00.000Z"
    changes:
      - "First official release with version control"
  - version: "0.1.0"
    date: "2026-01-09T00:00:00.000Z"
    changes:
      - "feat(web): add nuxt 3 frontend"
      - "feat(api): add hono api server"
      - "feat(core): add git utilities with simple-git"
      - "feat(db): add drizzle schema for postgresql"
      - "feat(shared): shared types package"
---
