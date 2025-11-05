---
title: "A Day Analyzing Apple Store's Code"
publishDate: "2025-11-05T10:00:00.000Z"
slug: "apple-store-frontend-code-analysis"
description: "rxliuli, a GitHub user, reconstructed the Apple Store's frontend code. I analyzed it and found things I didn't expect: Ember.js in 2025, microservices everywhere, and 10-year-old TODOs still hanging around."
tags: ["apple", "security", "frontend", "javascript", "ember", "webpack", "reverse-engineering"]
featured: true
draft: false
readTime: 8
---

The other day rxliuli published [this](https://github.com/rxliuli/apps.apple.com): the [Apple Store](https://apps.apple.com) frontend code, reconstructed. It's not like Apple leaked anything - frontend code has always been "public" if you have the patience to un-minify it. But seeing it like this, clean and navigable, was too tempting.

I spent the weekend digging through the files. I don't know what I expected to find, but it definitely wasn't this.

## Ember.js. In 2025.

I opened the first component and stared at the screen for a few seconds. Ember decorators. Ember services. The complete Ember routing system. All there, running in production, on one of the world's largest online stores.

React is everywhere. Vue too. Svelte is trendy. And Apple... Apple keeps using Ember as if nothing has changed in recent years.

```javascript
export default class ProductCard extends Component {
  @tracked isLoading = true;
  @service store;
  @service metrics;
  @service cart;
  
  @action
  async addToCart() {
    this.isLoading = true;
    try {
      await this.cart.add(this.args.product);
      this.metrics.track('product_added', {
        id: this.args.product.id,
        source: 'card'
      });
    } finally {
      this.isLoading = false;
    }
  }
}
```

But the more code I read, the more sense it made. Ember is extremely opinionated. There's ONE way to do things. Decorators are there, services too, components always follow the same pattern. No five developers doing the same component in five different ways because of "personal preferences".

In a large team this is gold. You can jump between files without getting lost. The code for a search component looks like the code for the product view, which looks like the cart. Everything coherent.

## The cache thing blew my mind

There's a file about 800 lines long dedicated solely to managing cache. It's not a basic `localStorage` or anything like that. It's a complete system with:

- Invalidation strategies by time, by event, by state change
- Schema versioning (they have cache migrations, seriously?)
- Compression before saving (using CompressionStream API)
- Predictive warming based on user navigation

```javascript
class CacheManager {
  constructor() {
    this.strategies = new Map();
    this.migrations = new MigrationRunner();
    this.compressor = new StreamCompressor();
  }

  async get(key, strategy = 'stale-while-revalidate') {
    const cached = await this.read(key);
    if (!cached) return null;
    
    // Migraciones si el schema cambió
    const migrated = await this.migrations.run(cached);
    
    // Estrategia de revalidación en segundo plano
    if (this.shouldRevalidate(migrated, strategy)) {
      this.revalidate(key).catch(err => 
        this.metrics.error('cache_revalidation_failed', { key, err })
      );
    }
    
    return migrated.data;
  }
}
```

It took me a while to understand why so much complexity. Then I saw the numbers: the app makes hundreds of requests on load. Without this cache system, it would be unusable. With it, it seems instantaneous.

## Microservices, microservices everywhere

There's no "one Apple Store API". There are... I don't know, twenty? Thirty? Each endpoint does something very specific:

- `api.apps.apple.com/v1/catalog/search` - Search only
- `api.apps.apple.com/v1/catalog/apps/{id}` - App details
- `api.apps.apple.com/v1/catalog/apps/{id}/reviews` - Separate reviews
- `api.apps.apple.com/v1/catalog/apps/{id}/related` - Recommendations
- `amp-api.apps.apple.com/v1/amp/` - Everything Apple Music
- `buy.itunes.apple.com/WebObjects/` - The purchase system (this looks OLD)

The frontend basically orchestrates calls. There's a data loader system inspired by GraphQL but without GraphQL:

```javascript
export default class AppRoute extends Route {
  @service dataLoader;
  
  async model({ app_id }) {
    // Loads in parallel what it can, in series what depends
    const app = await this.dataLoader.load('app', app_id);
    
    const [reviews, related, ratings] = await Promise.all([
      this.dataLoader.load('reviews', { app_id, page: 1 }),
      this.dataLoader.load('related', { app_id }),
      this.dataLoader.load('ratings', { app_id })
    ]);
    
    return { app, reviews, related, ratings };
  }
}
```

## Code nobody dares to touch

There are parts of the code with comments from 2015. Some even earlier. Functions with names like `legacyParseStoreResponse` or `oldFormatCompatibilityLayer`.

El frontend básicamente orquesta llamadas. Hay un sistema de data loaders inspirado en GraphQL pero sin GraphQL:

```javascript
export default class AppRoute extends Route {
  @service dataLoader;
  
  async model({ app_id }) {
    // Carga en paralelo lo que puede, en serie lo que depende
    const app = await this.dataLoader.load('app', app_id);
    
    const [reviews, related, ratings] = await Promise.all([
      this.dataLoader.load('reviews', { app_id, page: 1 }),
      this.dataLoader.load('related', { app_id }),
      this.dataLoader.load('ratings', { app_id })
    ]);
    
    return { app, reviews, related, ratings };
  }
}
```

## Código que nadie se atreve a tocar

Hay partes del código con comentarios de 2015. Algunos hasta de antes. Funciones con nombres tipo `legacyParseStoreResponse` o `oldFormatCompatibilityLayer`.

```javascript
// FIXME: This needs refactoring but we're scared (2015-08-12)
// Update 2018: Still scared
// Update 2021: REALLY should refactor this
// Update 2025: ...
function parseProductData(raw) {
  // 250 líneas de transformaciones que nadie entiende del todo
  // pero que funcionan con todos los edge cases posibles
  // porque han estado en producción 10 años
}
```

This doesn't actually surprise me. In large companies there's always legacy code that "works" and touching it is risky. Better to leave it there, well isolated, and build around it.

## The tracking is obsessive (but smart)

Every interaction is tracked. And when I say every one, it's every one:

```javascript
// They have custom wrappers for DOM events
class TrackedButton extends Component {
  @service metrics;
  
  @action
  handleClick(event) {
    // First the tracking
    this.metrics.track('button_click', {
      label: this.args.label,
      location: this.location,
      context: this.context,
      timestamp: Date.now(),
      // Even the viewport position
      viewport: {
        x: event.clientX,
        y: event.clientY,
        scrollY: window.scrollY
      }
    });
    
    // Then the actual action
    this.args.onClick?.(event);
  }
}
```

But it's not brute force. They use debouncing for scroll, throttling for mouse moves, and batch events before sending. No saturating servers with every pixel you scroll.

## The weird production things

Apple leaves source maps in production. But not completely. They use `hidden-source-map` in webpack, which generates the files but doesn't reference them in the bundle. They're there if you need them for debugging, but the browser doesn't download them automatically.

```javascript
// webpack.production.js (reconstructed)
{
  devtool: 'hidden-source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false, // Interesting, they leave console.log
            drop_debugger: true,
          },
          mangle: {
            safari10: true // Compatibility
          }
        }
      })
    ]
  }
}
```

They also have feature flags everywhere. Not a sophisticated system like LaunchDarkly, just environment variables and some toggles in localStorage for development. But there are MANY:

```javascript
const FEATURES = {
  NEW_SEARCH_UI: env.FEATURE_NEW_SEARCH ?? false,
  PERSONALIZED_RECS: env.FEATURE_PERSONALIZED ?? true,
  INLINE_REVIEWS: env.FEATURE_INLINE_REVIEWS ?? false,
  // ... about 40 more
};
```

## Errors that get swallowed (gracefully)

Every important component has error boundaries. But what's interesting is how they handle errors:

```javascript
export default class ErrorBoundary extends Component {
  @tracked error = null;
  @service errorReporter;
  @service analytics;
  
  @action
  handleError(error, errorInfo) {
    this.error = error;
    
    // Report but don't block
    this.errorReporter.report(error, {
      component: errorInfo.componentStack,
      severity: this.determineSeverity(error)
    });
    
    // Separate analytics
    this.analytics.track('component_error', {
      type: error.name,
      boundary: this.args.name
    });
    
    // If critical, reload. If not, show fallback
    if (this.isCritical(error)) {
      setTimeout(() => window.location.reload(), 3000);
    }
  }
}
```

They don't just catch the error. They classify it, decide what to do, and in some cases automatically reload the page if they detect it's a critical state error.

## What I take away from all this

Apple doesn't use cutting-edge technology. They use technology that works. Ember isn't modern but it's stable. Webpack is old but it's predictable. They're not experimenting with the latest from HN.

What they do well is consistency. All the code follows the same patterns. The same conventions. The same systems. You can be new to the team and after reading three components you already know how everything is structured.

And they have an obsession with details. The cache system, the tracking, the error boundaries, the metrics... everything is designed to work at scale. It's not pretty tutorial code. It's code that moves millions of dollars a day.

Are there things that could be improved? Sure. That legacy code, the 10-year-old TODOs, some parts that smell of over-engineering. But it works. And in the end that's what matters.

## References

- [Reconstructed Apple Store Repository](https://github.com/rxliuli/apps.apple.com) - rxliuli
- [Official Apple Store](https://apps.apple.com)
