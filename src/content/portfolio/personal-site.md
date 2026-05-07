---
title: "Personal Site"
date: "2025-09-18T11:23:00.000Z"
description: "My personal website and blog built with Astro. A place to showcase my work, share thoughts, and maintain my professional presence online."
technologies: ["Astro", "TypeScript", "Tailwind CSS", "Vitest", "Vercel"]
link: "https://equero.dev"
image: "/portfolio/personal-site.png"
logo: "/portfolio/logos/personal-site.svg"
github: "https://github.com/hbeneke/personal-site"
demo: "https://equero.dev"
featured: true
order: 1
version: "1.5.61"
changelog:
  - version: "1.5.61"
    date: "2026-05-07T00:00:00.000Z"
    changes:
      - "Added project logos column to portfolio listing"
      - "Theme now defaults to dark when no stored preference"
      - "Fixed vertical centering of portfolio demo preview dialog"
      - "Added cursor-pointer to portfolio demo, changelog, and CV download buttons"
      - "Aligned RSS link hover state across posts and notes pages"
      - "Upgraded Astro to 6.3.0"
      - "Published articles on HTML-in-Canvas and JavaScript explicit resource management"
  - version: "1.5.46"
    date: "2026-04-08T00:00:00.000Z"
    changes:
      - "Migrated to Astro 6 and Tailwind CSS 4"
      - "Fixed CSP headers for Pagefind WASM and Vercel Live script"
      - "Redesigned portfolio demo dialog layout and fixed horizontal centering"
  - version: "1.5.44"
    date: "2026-03-18T00:00:00.000Z"
    changes:
      - "Refactored custom elements with proper lifecycle (connectedCallback/disconnectedCallback)"
      - "Improved SEO: locale from config, resume print page excluded from sitemap"
      - "Accessibility: native dialog element, contact info hidden on screen (print only)"
      - "Performance: optimized getTagsWithCounts to O(n)"
      - "Code cleanup: removed dead types, unused dependencies, and duplicate code"
  - version: "1.5.21"
    date: "2026-03-05T00:00:00.000Z"
    changes:
      - "Hardened security headers: removed unsafe-eval from CSP, deprecated X-XSS-Protection"
      - "Fixed caching bugs: array mutation, unified caching pattern across all collections"
      - "Improved custom element lifecycle cleanup across all components"
      - "Fixed resume rendering issues (company_url, dynamic experience duration, print layout)"
      - "Cleaned up JSON-LD schema and locale handling"
      - "Accessibility and font loading improvements"
  - version: "1.5.0"
    date: "2026-02-25T00:00:00.000Z"
    changes:
      - "Published three new blog posts on AI topics"
      - "Added Git Wayback to portfolio with demo URL and changelog"
      - "New wavy underline navigation style"
      - "Upgraded Astro and dependencies"
  - version: "1.4.0"
    date: "2026-01-09T00:00:00.000Z"
    changes:
      - "Fixed Table of Contents scroll behavior on small screens"
      - "UI improvements: tag list limit, resume contact link"
  - version: "1.3.0"
    date: "2025-11-18T00:00:00.000Z"
    changes:
      - "Implemented intelligent caching system with comprehensive test coverage"
      - "Published blog post on Apple Store's frontend architecture"
      - "Enhanced security headers and production deployment config"
      - "Achieved 98.97% test coverage"
      - "Translated content to English"
  - version: "1.2.0"
    date: "2025-10-15T00:00:00.000Z"
    changes:
      - "Added demo preview dialog for portfolio items"
      - "Automated version sync between develop and master branches"
  - version: "1.1.0"
    date: "2025-10-15T00:00:00.000Z"
    changes:
      - "Added versioning and changelog to portfolio items"
      - "Added RSS feed links to notes and posts"
  - version: "1.0.0"
    date: "2025-10-13T00:00:00.000Z"
    changes:
      - "First official release"
---
