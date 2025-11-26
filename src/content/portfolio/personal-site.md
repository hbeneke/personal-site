---
title: "Personal Site"
date: "2025-09-18T11:23:00.000Z"
description: "My personal website and blog built with Astro. A place to showcase my work, share thoughts, and maintain my professional presence online."
technologies: ["Astro", "TypeScript", "Tailwind CSS", "Vitest", "Vercel"]
link: "https://equero.dev"
image: "/portfolio/personal-site.png"
github: "https://github.com/hbeneke/personal-site"
demo: "https://equero.dev"
featured: true
order: 1
version: "1.3.7"
changelog:
  - version: "1.3.7"
    date: "2025-11-20T00:00:00.000Z"
    changes:
      - "Enhanced security headers and cache configuration for production deployment"
      - "Improved code quality by removing debug console logs and adding production conditionals"
      - "Added robust date validation with isValidDate() function"
      - "Enhanced error handling in async operations"
      - "Refactored code to eliminate duplication and improve maintainability"
      - "Translated Spanish content to English for broader accessibility"
      - "Achieved 98.97% test coverage across the project"
  - version: "1.3.0"
    date: "2025-11-18T00:00:00.000Z"
    changes:
      - "Implemented intelligent caching system to speed up data fetching and improve performance"
      - "Added comprehensive test coverage for the new cache system"
      - "Published new blog post analyzing Apple Store's frontend architecture and leaked source code"
      - "Enhanced Git hooks with support for patch and minor version bumps"
      - "Updated project dependencies to latest stable versions"
  - version: "1.2.1"
    date: "2025-10-31T00:00:00.000Z"
    changes:
      - "Added demo preview dialog component for portfolio items with dynamic content support"
      - "Implemented open/close functionality with event listeners for demo previews"
      - "Added --minor and --patch parameters to sync-master script for version control"
      - "Improved version bump flexibility with manual selection of increment type"
      - "Enhanced console output to show selected version bump type"
  - version: "1.2.0"
    date: "2025-10-15T15:00:00.000Z"
    changes:
      - "Added automated sync:master command to prevent version conflicts"
      - "Improved Git hooks to prevent double version bumps during merges"
      - "Implemented automatic version synchronization between develop and master branches"
  - version: "1.1.0"
    date: "2025-10-15T14:07:06.000Z"
    changes:
      - "Added versioning and changelog functionality to portfolio items"
      - "Updated heading styles for consistency with the rest of the app"
      - "Added RSS feed link and icon to notes header"
      - "Added RSS feed link and icon to posts header"
  - version: "1.0.0"
    date: "2025-10-13T14:44:21.000Z"
    changes:
      - "First official release with version control"
---
