---
title: "The Apple App Store Source Code Leaked - What I Found Inside"
publishDate: "2025-11-05T10:00:00.000Z"
slug: "apple-store-source-code-leak-analysis"
description: "The entire Apple App Store website source code leaked via source maps. Inside: Svelte, internal Apple frameworks, Safari bugs being patched by Apple themselves, and 10-year-old TODOs with internal tracking IDs."
tags: ["apple", "security", "frontend", "javascript", "svelte", "source-maps", "leak"]
featured: true
draft: false
readTime: 10
---

The entire Apple App Store website source code has leaked. Not minified, not obfuscated - the actual TypeScript source files, with comments, internal references, folder structure, everything. And it's available [on GitHub](https://github.com/rxliuli/apps.apple.com).

## The leak that should never have happened

It all started with something as simple as forgetting to disable source maps in production. These files map minified code back to the original source and are designed to help developers debug, but they should never be publicly accessible. Someone at Apple forgot to turn them off, and with the right browser extension, anyone could download the complete TypeScript files. Someone did exactly that, uploading everything to GitHub.

The first thing that stands out when you review the code is that they're using **Svelte**. Not React, not Vue, not Angular. Svelte. For a company of Apple's size, this is surprising. Svelte is modern, relatively niche, and very opinionated. But it works well for them - the components are consistent, the patterns are clear, and the compiled output is small. Their tech stack also reveals interesting choices. Alongside TypeScript (as expected) and Svelte, they use **SCSS/Sass** instead of plain CSS or CSS-in-JS. They have **Sentry SDK** for error tracking, **Floating UI** for tooltips and popovers, and a curious mix of CSS Variables with Sass - some components use one, others use the other. There's even a folder named in ALL CAPS while everything else is lowercase. Probably a legacy mistake that nobody dared to fix once it was in production.

## Inside Apple's internal ecosystem

The most fascinating part is discovering the internal frameworks and services that Apple uses but aren't publicly available. **Jet** is an internal framework for shared business logic across all Apple web properties - it's the entry point for interacting with all of their shared business logic. Then there's **Kong**, an internal firewall/gateway that checks request origins. There's even code that explicitly spoofs the `Origin` header to bypass Kong's checks - they literally have comments saying "we need to fake this in the server because we have origin checks in Kong" and then set the header to `https://apps.apple.com`.

**AMP** has nothing to do with Google AMP - this is Apple Media Services, their own internal component library. There's also **PerfKit**, a performance monitoring tool, though there are multiple comments throughout the codebase saying it's "broken" or "basted somehow". Then you see references to internal project codenames scattered throughout: **Scandium**, **Mandrake**, **Charon**, **Electrocardiogram**, **Tinker Watch**. These all appear to be internal service names or project codenames within Apple's infrastructure.

Apple has built their own component library called "AMP Web Components" with reusable elements shared across different Apple web properties. The imports show a complete catalog of utilities, profile components, and grid systems - a full design system that we never knew existed.

## 10-year-old TODOs and patching their own browser bugs

Throughout the code there are TODO comments with references to "radar" - Apple's internal bug tracking system, similar to JIRA issue numbers in other companies. You see things like `@radar(12345678)` with comments saying "Basted, PerfKit is broken somehow" or "TODO: This is broken in some manner". There are hardcoded IDs with comments that literally say "How is this used??" - actual developers at Apple are confused by their own code.

But the most surprising find is that Apple is patching Safari bugs in their own frontend code. In the video player component, there's a comment explaining they have to bypass the poster attribute "due to covering a playback HLS bug in Safari". Yes, Apple is working around bugs in Safari... in their own production code. The irony is not lost.

They also have a custom internal metrics system called "MetricsKit" that tracks everything - impressions, clicks, scrolls, user navigation. It's deeply integrated into every component, sending batched data to internal analytics. Every product impression, every click, every scroll gets tracked with context about where it happened and what the user was doing.

## Implementation details: ratings, animations, and real-world optimizations

The code reveals curious things about how Apple implements specific features. For example, their star rating calculation is straightforward and functional - they create an array of five positions and map each to a fill level based on whether it's a full star, partial star, or empty star. Nothing fancy, but it works. The SVG star assets are embedded directly in the code.

One of the more complex pieces is the animated gradient backgrounds, and what's interesting isn't just the implementation but the comment explaining why they made specific technical decisions. The "AmbientBackgroundArtwork" component has a detailed comment explaining that they originally used `mask-image` but it was causing too much CPU usage when animating or resizing, so they switched to simulating the functionality with a layer above using `background-image` instead. This is the kind of optimization insight you rarely see documented - they tried one approach, measured its performance impact, and switched to something that works better in practice.

The code also reveals lists of which features are available in which regions, giving insight into Apple's rollout strategy. Vision Pro support countries are listed (mostly European Union countries like Germany, France, Spain, Italy), and there's a list of countries without Arcade support (China, Hong Kong, Macao). You can literally see Apple's business strategy encoded in arrays.

## The reality of production code

The code is... real production code. Not the polished tutorial examples you see online. There are lots of if-else-if chains that could be simplified, magic strings directly in code instead of constants, and hardcoded values with comments that say things like "What is this for??" It's battle-tested code that works, but it's not always pretty. There are also way more comments than you might expect - contrary to the myth that big tech companies don't comment their code. In fact, there are comments explaining the "why" of technical decisions, workarounds, and known problems.

Apple also exposes a global variable on the window object with build information - this isn't a security issue, it's actually good practice that helps with debugging when users report issues. Support can know exactly which build is running. You also see code that reveals Apple's rollout strategy, their internal tools and frameworks, and the pragmatic decisions they make when their own browser has bugs they need to work around.

Seeing Apple's production code teaches us several things. Big companies aren't perfect - there are TODOs from 2015, workarounds for their own browser bugs, and code nobody wants to touch. Comments exist in production code, and plenty of them, despite what some developers preach. Apple has built significant internal infrastructure (Jet, Kong, MetricsKit, PerfKit) and it's interesting to see Svelte used for a high-traffic production site, not just React/Vue/Angular. The switch from `mask-image` to `background-image` for CPU reasons shows they actively optimize based on real-world performance data.

The code isn't perfect, but it doesn't need to be. It handles millions of users, processes millions in revenue, and mostly just works. That's what matters in production. This leak happened because source maps were accidentally enabled in production - files that map minified code back to the original source. They're incredibly useful for debugging, but should **never** be publicly accessible in production. Apple's mistake was leaving them enabled and accessible. Most build tools disable source maps by default for production, but if you need them for debugging production issues, they should be stored separately from your public assets, only accessible to authorized users, and not referenced in your bundled JavaScript. This leak is a reminder to always check your production build configuration.

## References

- [Leaked Apple Store Repository](https://github.com/rxliuli/apps.apple.com) - rxliuli
- [Official Apple Store](https://apps.apple.com)
- [What are Source Maps?](https://web.dev/articles/source-maps) - web.dev
- [Sentry SDK](https://sentry.io/) - Error tracking service Apple uses
- [Floating UI](https://floating-ui.com/) - Tooltip library Apple uses
