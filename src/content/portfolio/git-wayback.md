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
      - "Reorganized tabs with Evolution as the primary view"
      - "Added RepoDiagram component with Gource-style visualization"
      - "Added evolution API endpoint with database caching"
      - "Added timeline and tree endpoints for tag navigation"
      - "Added evolution_snapshots database schema for caching tag data"
  - version: "0.3.1"
    date: "2026-01-20T00:00:00.000Z"
    changes:
      - "Fixed tag message script to use temp file and preserve changelog"
  - version: "0.3.0"
    date: "2026-01-20T00:00:00.000Z"
    changes:
      - "Redesigned repository page with tabbed interface"
      - "Added comprehensive repository data API endpoint"
      - "Added screenshot analysis infrastructure (currently disabled)"
      - "Added Tailwind CSS and repository search functionality"
      - "Enhanced app layout and SEO metadata for improved user experience"
      - "Implemented search API endpoint for GitHub repositories"
      - "Fixed missing environment variables in turbo.json"
      - "Fixed Vercel output directory and Turborepo environment variables configuration"
  - version: "0.2.0"
    date: "2026-01-12T00:00:00.000Z"
    changes:
      - "First official release with version control"
  - version: "0.1.0"
    date: "2026-01-09T00:00:00.000Z"
    changes:
      - "Added Nuxt 3 frontend"
      - "Added Hono API server"
      - "Added Git utilities with simple-git library"
      - "Added Drizzle ORM schema for PostgreSQL"
      - "Added shared types package"
---
