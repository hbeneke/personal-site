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

## How Did This Happen?

Source maps. Apple accidentally left source maps enabled in production. These are files that map minified code back to the original source, designed to help developers debug. Normally they're disabled in production for security reasons, but someone at Apple forgot to turn them off.

With the right browser extension, anyone could download the complete TypeScript source files. And someone did, uploading the entire codebase to GitHub.

## Svelte? At Apple?

First surprise: they're using Svelte. Not React. Not Vue. Not Angular. Svelte.

```svelte
<script>
  export let product;
  let isLoading = true;
  
  async function addToCart() {
    isLoading = true;
    try {
      await cart.add(product);
      metrics.track('product_added', {
        id: product.id,
        source: 'card'
      });
    } finally {
      isLoading = false;
    }
  }
</script>

<button on:click={addToCart} disabled={isLoading}>
  Add to Cart
</button>
```

For a company of Apple's size, this is interesting. Svelte is modern, relatively niche, and very opinionated. But it works well for them - the components are consistent, the patterns are clear, and the compiled output is small.

## The Tech Stack

Looking through the dependencies reveals some interesting choices:

- **TypeScript** - As expected
- **Svelte** - For the UI components
- **SCSS/Sass** - Not plain CSS or CSS-in-JS, actual Sass files
- **Sentry SDK** - For error tracking and monitoring
- **Floating UI** - For tooltips and popovers
- **CSS Variables** - Mixed with Sass, some components use one, some the other

One oddity: there's a folder named in ALL CAPS while everything else is lowercase. Probably a legacy mistake that nobody dared to fix once it was in production.

## Internal Apple Frameworks

The code reveals several internal Apple frameworks and services that aren't publicly available:

- **Jet** - An internal framework/engine for shared business logic across Apple web properties. It's the entry point for interacting with all of Apple's shared business logic.
- **Kong** - An internal firewall/gateway that checks request origins. There's code that explicitly spoofs the `Origin` header to bypass Kong's checks.
- **AMP** - Nothing to do with Google AMP - this is Apple Media Services, their own internal component library
- **PerfKit** - A performance monitoring tool (though there are multiple comments saying it's "broken")

```typescript
// Example of Kong origin spoofing
// We need to fake this in the server because we have origin checks in Kong
headers.set('Origin', 'https://apps.apple.com');
```

There are also references to internal project codenames:

- **Scandium**
- **Mandrake**
- **Charon**
- **Electrocardiogram**
- **Tinker Watch**

These appear to be internal service names or project codenames within Apple's infrastructure.

## Custom Web Components

Apple has built their own component library called "AMP Web Components" with reusable elements:

```typescript
// Examples from amp-web-components
import { getCookie } from '@amp/web-components/utils';
import { ProfileSize } from '@amp/web-components/profile';
import { GridType } from '@amp/web-components/grid';
```

This is a complete catalog of components shared across different Apple web properties.

## TODOs with Internal Tracking

Throughout the code there are TODO comments with references to "radar" - Apple's internal bug tracking system:

```typescript
// PerfKit is mentioned multiple times as broken
// @radar(12345678) - Basted, PerfKit is broken somehow
// TODO: This is broken in some manner

// They have hardcoded IDs with interesting comments
const UNIQUE_ID = 'xx-xxxxxxxx-xxxx'; // How is this used?? (actual comment)
```

The "radar" references are links to their internal tracking system, similar to JIRA issue numbers in other companies.

## Patching Their Own Browser Bugs

One of the most surprising finds: Apple is patching Safari bugs in their own frontend code:

```typescript
// Video player component
// We have to bypass poster attribute in favor of this
// due to covering a playback HLS bug in Safari
```

Yes, Apple is working around bugs in Safari... in their own production code. The irony is not lost.

## The Metrics System

Apple has a custom internal metrics system called "MetricsKit" that tracks everything:

```typescript
// MetricsKit - Internal logging and event tracking
class MetricsKit {
  track(event: string, data: Record<string, any>) {
    // Tracks impressions, clicks, user navigation
    // Sends batched data to internal analytics
  }
}

// Usage throughout components
this.metrics.track('product_impression', {
  id: product.id,
  position: index,
  context: 'search_results'
});
```

The system tracks impressions, clicks, scrolls, and user behavior for internal analytics. It's integrated deeply into every component.

## The Star Rating Implementation

Here's how Apple calculates and displays star ratings - straightforward and functional:

```typescript
// Creates array [1, 2, 3, 4, 5] and maps to fill levels
const stars = [1, 2, 3, 4, 5].map(position => {
  if (position <= Math.floor(rating)) {
    return 100; // Full star
  } else if (position === Math.ceil(rating)) {
    return (rating % 1) * 100; // Partial star
  } else {
    return 0; // Empty star
  }
});
```

Nothing fancy, but it works. The SVG star assets are embedded in the code.

## The Ambient Background Animation

One of the more complex pieces is the animated gradient backgrounds:

```scss
// AmbientBackgroundArtwork component
// Stack of images in background representing three layers
// mask-image was causing too much CPU usage when animating or resizing
// So we're simulating this functionality with a layer above using background-image

.ambient-background {
  // Three gradient layers with different opacities
  // Animated subtly but imperceptibly
}
```

The comment reveals they originally used `mask-image` but it caused performance issues, so they switched to a layered approach with `background-image` instead. This is the kind of optimization insight you rarely see documented.

## Code Quality Observations

The code is... real production code. Not the polished tutorial examples you see online. Some observations:

```typescript
// Lots of if-else-if chains that could be simplified
if (condition1) {
  return result1;
} else if (condition2) {
  return result2;
} else if (condition3) {
  return result3;
}

// Magic strings directly in code instead of constants
const eventType = 'product_view_impression';

// Some hardcoded values with unclear purpose
const UNIQUE_ID = 'xx-xxxxxxxx-xxxx'; // What is this for??
```

It's battle-tested code that works, but it's not always pretty. There are also many more comments than you might expect - contrary to the myth that big tech companies don't comment their code.

## Global Variables and Build Info

Apple exposes a global variable on the window object:

```typescript
// window.__ASSAULT_W__ or similar
window.appBuildInfo = {
  version: '2.1.45',
  build: '20251105.1',
  environment: 'production'
};
```

This isn't a security issue - it's actually good practice. It helps with debugging when users report issues, letting support know exactly which build is running.

## Region and Feature Availability

The code includes lists of which features are available in which regions:

```typescript
// Vision Pro support countries (European Union)
const visionSupportedCountries = ['DE', 'FR', 'ES', 'IT', ...];

// Countries without Arcade support
const noArcadeCountries = ['CN', 'HK', 'MO']; // China, Hong Kong, Macao
```

This gives insight into Apple's rollout strategy for different features across markets.

## What This Teaches Us

A few takeaways from seeing Apple's production code:

1. **Big companies aren't perfect** - There are TODOs from 2015, workarounds for their own browser bugs, and code nobody wants to touch.

2. **Comments exist in production code** - Despite what some developers preach, Apple's code has plenty of comments explaining "why" decisions were made.

3. **They use internal tools extensively** - Jet, Kong, MetricsKit, PerfKit - Apple has built significant internal infrastructure.

4. **Svelte at scale** - It's interesting to see Svelte used for a high-traffic production site, not just React/Vue/Angular.

5. **Performance matters** - The switch from `mask-image` to `background-image` for CPU reasons shows they actively optimize based on real-world performance data.

The code isn't perfect, but it doesn't need to be. It handles millions of users, processes millions in revenue, and mostly just works. That's what matters in production.

## Why Source Maps Matter

This leak happened because source maps were accidentally enabled in production. Source maps are files that map minified code back to the original source:

```text
minified.js → example.min.js.map → original.ts
```

They're incredibly useful for debugging, but should **never** be publicly accessible in production. Apple's mistake was leaving them enabled and accessible.

Most build tools (Vite, Webpack, etc.) disable source maps by default for production. But if you need them for debugging production issues, they should be:

1. Stored separately from your public assets
2. Only accessible to authorized users
3. Not referenced in your bundled JavaScript

This leak is a reminder to always check your production build configuration.

## References

- [Leaked Apple Store Repository](https://github.com/rxliuli/apps.apple.com) - rxliuli
- [Official Apple Store](https://apps.apple.com)
- [What are Source Maps?](https://web.dev/articles/source-maps) - web.dev
- [Sentry SDK](https://sentry.io/) - Error tracking service Apple uses
- [Floating UI](https://floating-ui.com/) - Tooltip library Apple uses
