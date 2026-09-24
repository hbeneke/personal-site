---
title: "DivText"
date: "2026-06-08T00:00:00.000Z"
description: "Turn any word into a logo built entirely from <div> cells. A terminal-style playground that draws your text on a grid, cell by cell."
technologies: ["TypeScript", "HTML", "CSS"]
logo: "/portfolio/logos/divtext.svg"
github: "https://github.com/hbeneke/divtext"
demo: "https://divtext.com"
license: "GPL-3.0"
licenseUrl: "https://www.gnu.org/licenses/gpl-3.0.html"
featured: false
order: 4
version: "1.1.19"
changelog:
  - version: "1.1.19"
    date: "2026-08-07T00:00:00.000Z"
    changes:
      - "Added Pixel Block, a grid font whose cells weld together into solid strokes"
      - "Added Geometric, a font built from bars, rotated diagonals and rounded rings, with per-letter widths so M and W get room"
      - "Replaced the font buttons with a dropdown picker that scales as more fonts are added"
      - "Fixed the draw animation wiping the rotation off diagonal strokes"
  - version: "1.1.16"
    date: "2026-08-03T00:00:00.000Z"
    changes:
      - "Windows can be resized from any edge or corner, and code blocks grow to fill the window"
      - "Added borders on any side of a word: underline, overline or a full box, with a choice of line style"
      - "Border and line settings are saved in the shareable link, and bad or unknown values fall back to defaults"
      - "Fixed the line-style dropdown closing as soon as it was clicked"
  - version: "1.1.12"
    date: "2026-07-03T00:00:00.000Z"
    changes:
      - "Shareable links: the word, font and colour are kept in the URL and restored when the link is opened"
      - "Escaped attribute values in the exported HTML to prevent markup injection"
  - version: "1.1.6"
    date: "2026-07-02T00:00:00.000Z"
    changes:
      - "Added a per-letter color picker to customize individual glyph cells"
  - version: "1.1.5"
    date: "2026-07-02T00:00:00.000Z"
    changes:
      - "Abstracted the font system and added full ASCII glyph coverage"
      - "Added BEM and minimal CSS export modes"
  - version: "1.1.4"
    date: "2026-07-02T00:00:00.000Z"
    changes:
      - "Moved the code view into its own dedicated window"
  - version: "1.1.3"
    date: "2026-07-02T00:00:00.000Z"
    changes:
      - "Added a syntax-highlighted code block with a draw animation and collapsible intro"
  - version: "1.1.2"
    date: "2026-07-02T00:00:00.000Z"
    changes:
      - "Added dynamic version display, export modes, and per-word window titles"
  - version: "1.1.1"
    date: "2026-07-02T00:00:00.000Z"
    changes:
      - "Added a pixel-font word renderer with HTML export tools"
  - version: "1.1.0"
    date: "2026-07-01T00:00:00.000Z"
    changes:
      - "Rebuilt the footer with the @hbeneke/parley web component library"
      - "Migrated the build to Vite with a dev server and hot reload"
      - "Componentized the window manager into native web components"
      - "Added Vercel Web Analytics for visit tracking"
  - version: "1.0.12"
    date: "2026-06-29T00:00:00.000Z"
    changes:
      - "Launched in production at divtext.com via Vercel (develop previews, master production)"
  - version: "1.0.9"
    date: "2026-06-29T00:00:00.000Z"
    changes:
      - "Replaced the maximize button glyph with macOS-style diagonal arrows"
  - version: "1.0.8"
    date: "2026-06-29T00:00:00.000Z"
    changes:
      - "Made the terminal window controls functional: close, minimize to a taskbar, and maximize"
      - "Added a multi-window manager with draggable windows and a + button to spawn new ones"
  - version: "1.0.7"
    date: "2026-06-29T00:00:00.000Z"
    changes:
      - "Migrated styling to Tailwind CSS v4"
  - version: "1.0.6"
    date: "2026-06-29T00:00:00.000Z"
    changes:
      - "Translated the interface to English"
  - version: "1.0.5"
    date: "2026-06-23T00:00:00.000Z"
    changes:
      - "Added a terminal-window favicon"
  - version: "1.0.4"
    date: "2026-06-23T00:00:00.000Z"
    changes:
      - "Maintenance release via develop-to-master version sync"
  - version: "1.0.3"
    date: "2026-06-08T00:00:00.000Z"
    changes:
      - "Added site footer ported from personal-site"
      - "Built terminal-style landing with live text input"
  - version: "1.0.0"
    date: "2026-06-01T00:00:00.000Z"
    changes:
      - "Added develop-to-master sync system with version hooks"
      - "Initial project setup with HTML, CSS, and TypeScript structure"
---
