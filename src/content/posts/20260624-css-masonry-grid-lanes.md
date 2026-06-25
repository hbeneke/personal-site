---
title: "CSS Masonry, Finally: The Long Road to grid-lanes"
publishDate: "2026-06-24T10:00:00.000Z"
slug: "css-masonry-grid-lanes-native-layout"
description: "After nine years of arguing, CSS got native masonry. It is not display: masonry, it is display: grid-lanes, and the fight to get there says a lot about how the web is built. Heres how it works, a small lab to test it, and the accessibility catch nobody should ignore."
tags: ["css", "frontend", "web development", "web standards", "tutorial", "accessibility"]
featured: true
draft: false
readTime: 14
---

## The layout we faked for a decade

You know the layout. Pinterest made it famous: columns of cards with different heights, each one tucked up under the shortest column so there are no awkward gaps. It looks effortless. It was not.

For years the only ways to get it were all compromises. JavaScript libraries like Masonry.js measured every element and absolutely positioned it, which meant layout thrash and a flash of unstyled content on every resize. CSS columns (`column-count`) got you the visual but filled top-to-bottom, so item 2 ended up below item 1 in the same column instead of next to it, breaking reading order. Flexbox with `order` hacks worked for fixed item counts and fell apart the moment the content was dynamic. Every approach traded something away.

So the obvious question kept coming up: why isnt this just a CSS property? It turns out the answer is a nine-year argument that only got resolved at the start of this year. The short version: native masonry shipped. The longer version is more interesting, because the thing that shipped is not what anyone originally proposed, and the reasons why are a genuinely good lesson in how web standards get made.

## Why this took nine years

This is worth telling properly, because the final syntax only makes sense if you know the fight behind it.

It started in 2017, when [Rachel Andrew](https://rachelandrew.co.uk/) raised the masonry use case in [CSS Working Group issue #945](https://github.com/w3c/csswg-drafts/issues/945). In 2020 Mozilla shipped an experimental implementation in Firefox built on top of `display: grid` — you wrote `grid-template-columns` as normal and set `grid-template-rows: masonry`. It worked, it was elegant, and that is where the disagreement started.

Two camps formed, and both had a point.

**Apple and the WebKit team wanted masonry inside Grid.** Their argument: masonry is mostly Grid with one axis collapsed. You already know `grid-template-columns`, `gap`, line-based placement, spanning. Reusing all of that means almost zero new syntax to learn, and you get to mix masonry with real Grid features. Why invent a second layout system that is 90% identical to one we already have?

**Chrome and a chunk of the CSSWG wanted a separate `display: masonry`.** Their argument was partly about performance and partly about conceptual honesty. Grid does a two-pass track-sizing algorithm where the size of every track depends on every item in it. Masonry placement is a greedy, item-by-item flow. Bolting the second onto the first creates a nasty circular dependency: to size the columns you need to know where items land, but to place items you need to know how wide the columns are. The Chrome team published [benchmarks](https://developer.chrome.com/blog/masonry-update) arguing that conflating the two would either hurt Grid performance or force masonry into a weaker subset of Grids sizing. Keep them separate, the layouts stay fast and the mental model stays clean.

This went back and forth for **five years**. In the November 2024 syntax thread ([issue #11243](https://github.com/w3c/csswg-drafts/issues/11243)), Jen Simmons of the WebKit team wrote, with visible fatigue, "Personally disappointed that were not making more progress. Weve been having this argument for 5 years."

Then in early 2025 the [W3C Technical Architecture Group](https://www.w3.org/2001/tag/) floated a third option that briefly looked like the winner: **Item Flow**. The idea was ambitious — unify `flex-flow` and `grid-auto-flow` into one family of properties (`item-flow`, `item-direction`, `item-wrap`, `item-pack`, `item-slack`) that would describe flowing behavior across both Flexbox and Grid, with masonry falling out as a special case. WebKit even wrote it up in a [two-part blog series](https://webkit.org/blog/16587/item-flow-part-1-a-new-unified-concept-for-layout/). Conceptually beautiful. Also a much bigger surface area to specify, implement, and ship.

And here is the part I find genuinely refreshing: the CSSWG looked at the beautiful, ambitious, unifying proposal and chose not to do it. On January 31, 2025, they [resolved](https://github.com/w3c/csswg-drafts/issues/11243) to "re-use grid templating and placement properties for masonry layout" but put it behind its own `display` value. Reuse the syntax you already know, give it a distinct mode so the algorithms stay separate. Both camps got the half they actually cared about. Item Flow got shelved as a someday-maybe.

The new keyword went through an embarrassing naming bikeshed first — `collapsed-grid`, `grid-stack`, `grid-pack`, `compact-grid`, `grid-masonry`, `staggered-grid`, `axial-grid`, and a dozen others were all on the table — before landing on **`grid-lanes`** in December 2025. Not the most poetic name, but it is honest: you define lanes, items flow into them.

## What actually shipped: grid-lanes

Here is the whole thing. If youve written Grid, you already know most of this.

```css
.gallery {
  display: grid-lanes;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
```

Thats a working masonry layout. Three lines that matter. `display: grid-lanes` turns on the mode, `grid-template-columns` defines your vertical lanes using the exact same syntax as Grid, and `gap` does what gap always does.

The algorithm is the simple part: each item, in source order, gets placed into whichever lane currently has the most room at the top. Shortest column wins. Thats the greedy heuristic that every JS masonry library has used for a decade, except now the browser does it natively, on the main layout pass, with no measuring and no JavaScript.

### Columns or rows: waterfall vs brick

The direction of the flow is decided by which template you set.

```css
/* Waterfall: items flow DOWN columns (the Pinterest look) */
.waterfall {
  display: grid-lanes;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

/* Brick: items flow ACROSS rows */
.brick {
  display: grid-lanes;
  grid-template-rows: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}
```

Define columns, you get vertical lanes and a waterfall. Define rows, you get horizontal lanes and a brick wall. Most people want the first one.

### Spanning and explicit placement still work

Because grid-lanes reuses Grid placement, items can span multiple lanes or be pinned to a specific position before the masonry algorithm runs:

```css
/* This card takes up two lanes */
.featured {
  grid-column: span 2;
}

/* This one is pinned to lanes 2 through 4, definitely placed */
.pinned {
  grid-column: 2 / 4;
}
```

Definitely-placed items get positioned first, then everything else flows around them. This is the payoff of the "reuse Grid" decision — you didnt learn a new placement model, the one you already know just works inside the new mode.

### flow-tolerance: the dial that matters more than it looks

This is the one new property, and it is the most interesting part of the whole design.

```css
.gallery {
  display: grid-lanes;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  flow-tolerance: 1em; /* the default */
}
```

Pure "always pick the shortest lane" placement produces the tightest packing, but it also lets the visual order zigzag wildly away from source order — item 5 can end up above item 3 because its lane happened to be shorter by two pixels. `flow-tolerance` sets how much of a height difference between lanes the browser will ignore before it bothers switching lanes. A larger tolerance keeps items closer to source order at the cost of slightly looser packing; a smaller one packs tighter but scrambles the visual sequence more.

(Trivia worth knowing if you read older articles: this property was originally named `item-tolerance` when grid-lanes first shipped in Safari Technology Preview 234 in December 2025. The CSSWG renamed it to `flow-tolerance` on January 7, 2026, in [STP 236](https://css-tricks.com/masonry-layout-is-now-grid-lanes/). If you copy a snippet that uses `item-tolerance`, thats why it does nothing.)

## The accessibility catch you cannot skip

Here is the part I want to spend real time on, because it is the part the demos always gloss over and it is the part that will actually bite your users.

`flow-tolerance` exists because masonry has a fundamental tension that is not a CSS bug, it is baked into the idea itself: **the visual order and the DOM order come apart.** The browser places items by available space, but the tab order and the screen-reader reading order follow the DOM, always. So a sighted keyboard user can see item 5 sitting visually above item 8, press Tab, and watch focus jump somewhere that makes no spatial sense. A screen reader reads source order while the screen shows something else entirely.

This is not a hypothetical I am inventing for drama. It is a documented [WCAG 2.2 requirement](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html): Success Criterion **1.3.2 Meaningful Sequence (Level A)** says that "when the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined." Masonry, by construction, can break that link between what you see and what is programmatically determined. Rachel Andrew — the same person who raised the original use case in 2017 — [wrote about this exact problem](https://rachelandrew.co.uk/archives/2024/05/26/masonry-and-reading-order/) during the standardization fight, and it was one of the genuine reasons the CSSWG moved carefully.

The practical rules that fall out of this:

1. **Keep your DOM order as a sensible reading sequence.** It is the order screen readers and keyboards will use no matter what the layout does. Order your source by what makes sense to read, not by what packs nicely.
2. **Use `flow-tolerance` deliberately.** Setting it too small to chase a perfectly tight grid widens the gap between visual and DOM order. There is a real accessibility cost to that last 3% of packing density.
3. **Actually test with the keyboard.** Tab through your layout. If focus teleports around the screen, your tolerance is too aggressive or your source order is wrong.

There is a future fix in progress, a proposed `reading-order-items` property that would let you tell the browser to follow the visual flow rather than source order for focus and reading. It is early and not something to rely on yet. Until it lands, the honest answer is: masonry is for galleries and card walls where strict order genuinely does not carry meaning. For anything where sequence matters — search results, a feed, a numbered list — think hard before you scramble it for looks.

## The lab: try it yourself

Enough theory. Here is a live grid-lanes sandbox. Drag the sliders and watch the layout reflow. If your browser supports `display: grid-lanes` youll see real masonry; if it doesnt, youll see the regular-grid fallback, which is the whole point of progressive enhancement — nothing breaks, you just lose the tight packing.

The banner below tells you which one youre getting.

<div class="bg-white/5 border border-white/10 rounded-xl p-6 my-6">
  <div id="grid-lanes-support" class="mb-4 px-3 py-2 rounded-md text-sm text-center font-mono"></div>

  <div class="flex flex-wrap gap-5 justify-center mb-5 text-sm">
    <label class="flex flex-col items-center gap-1">
      <span class="text-gray-400">min column width: <span id="col-val" class="text-indigo-400 font-mono">160</span>px</span>
      <input type="range" id="col-slider" min="100" max="280" step="10" value="160" class="accent-indigo-500 cursor-pointer">
    </label>
    <label class="flex flex-col items-center gap-1">
      <span class="text-gray-400">gap: <span id="gap-val" class="text-indigo-400 font-mono">12</span>px</span>
      <input type="range" id="gap-slider" min="0" max="32" step="2" value="12" class="accent-indigo-500 cursor-pointer">
    </label>
    <label class="flex flex-col items-center gap-1">
      <span class="text-gray-400">flow-tolerance: <span id="tol-val" class="text-indigo-400 font-mono">1</span>em</span>
      <input type="range" id="tol-slider" min="0" max="6" step="0.5" value="1" class="accent-indigo-500 cursor-pointer">
    </label>
    <label class="flex flex-col items-center gap-2 justify-center">
      <span class="text-gray-400">direction</span>
      <button id="dir-toggle" class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-gray-300 cursor-pointer text-xs hover:bg-white/20 transition-colors">columns (waterfall)</button>
    </label>
  </div>

  <div id="lanes-demo" class="w-full"></div>

  <code id="lanes-css" class="block bg-black/30 px-4 py-3 rounded-lg text-xs text-sky-300 mt-5 whitespace-pre"></code>
</div>

<script>
(function() {
  const demo = document.getElementById('lanes-demo');
  const cssOut = document.getElementById('lanes-css');
  const support = document.getElementById('grid-lanes-support');
  const colSlider = document.getElementById('col-slider');
  const gapSlider = document.getElementById('gap-slider');
  const tolSlider = document.getElementById('tol-slider');
  const dirToggle = document.getElementById('dir-toggle');

  let useColumns = true;

  // feature detection
  const supported = CSS.supports('display', 'grid-lanes');
  if (supported) {
    support.textContent = 'grid-lanes supported — youre seeing real masonry';
    support.className = support.className + ' bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
  } else {
    support.textContent = 'grid-lanes not supported here — falling back to regular grid (Safari 26.4+ or Chrome/Edge 140+ with flag)';
    support.className = support.className + ' bg-amber-500/15 text-amber-300 border border-amber-500/30';
  }

  // build cards of varying heights
  const heights = [120, 200, 90, 160, 240, 110, 180, 140, 220, 100, 170, 130];
  const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#3b82f6','#ef4444','#84cc16','#a855f7','#14b8a6','#f97316'];
  demo.innerHTML = '';
  heights.forEach((h, i) => {
    const card = document.createElement('div');
    card.style.background = colors[i];
    card.style.borderRadius = '10px';
    card.style.color = 'white';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.fontFamily = 'monospace';
    card.style.fontWeight = 'bold';
    card.style.fontSize = '14px';
    card.textContent = i + 1;
    demo.appendChild(card);
  });

  function apply() {
    const col = colSlider.value;
    const gap = gapSlider.value;
    const tol = tolSlider.value;
    document.getElementById('col-val').textContent = col;
    document.getElementById('gap-val').textContent = gap;
    document.getElementById('tol-val').textContent = tol;

    demo.style.display = supported ? 'grid-lanes' : 'grid';
    demo.style.gap = gap + 'px';
    demo.style.flowTolerance = tol + 'em';

    const cards = demo.children;
    if (useColumns) {
      demo.style.gridTemplateColumns = 'repeat(auto-fill, minmax(' + col + 'px, 1fr))';
      demo.style.gridTemplateRows = '';
      Array.from(cards).forEach((c, i) => { c.style.height = heights[i] + 'px'; c.style.width = ''; });
      cssOut.textContent =
        '.gallery {\n' +
        '  display: grid-lanes;\n' +
        '  grid-template-columns: repeat(auto-fill, minmax(' + col + 'px, 1fr));\n' +
        '  gap: ' + gap + 'px;\n' +
        '  flow-tolerance: ' + tol + 'em;\n' +
        '}';
    } else {
      demo.style.gridTemplateRows = 'repeat(4, minmax(' + col + 'px, 1fr))';
      demo.style.gridTemplateColumns = '';
      demo.style.gridAutoFlow = supported ? '' : 'column';
      Array.from(cards).forEach((c, i) => { c.style.width = (heights[i]) + 'px'; c.style.height = ''; });
      cssOut.textContent =
        '.gallery {\n' +
        '  display: grid-lanes;\n' +
        '  grid-template-rows: repeat(4, minmax(' + col + 'px, 1fr));\n' +
        '  gap: ' + gap + 'px;\n' +
        '  flow-tolerance: ' + tol + 'em;\n' +
        '}';
    }
  }

  colSlider.addEventListener('input', apply);
  gapSlider.addEventListener('input', apply);
  tolSlider.addEventListener('input', apply);
  dirToggle.addEventListener('click', function() {
    useColumns = !useColumns;
    this.textContent = useColumns ? 'columns (waterfall)' : 'rows (brick)';
    apply();
  });

  apply();
})();
</script>

A note for honesty: if grid-lanes isnt supported in your browser, the fallback above is plain `display: grid`, which keeps a tidy rectangular grid rather than packing tightly. That gap between the two is exactly what you are choosing to progressively enhance.

## Browser support, as of June 2026

This is moving fast, so treat versions as a snapshot.

| Browser | Status |
|---------|--------|
| Safari 26.4+ | Shipped stable (first, March 2026) |
| Safari Technology Preview | Since STP 234, December 2025 |
| Chrome / Edge 140+ | Behind a flag (since July 2025) |
| Firefox Nightly | Behind a flag, being updated to final syntax |

WebKit shipped first, which is a nice reversal of the usual story — Apples team did most of the heavy lifting on the spec and got to ship it stable before anyone else. Chrome and Firefox both have working implementations behind flags and are tracking the finalized syntax, so broad support through 2026 looks likely. It is **not Baseline yet**, and MDN still flags it as limited availability, so do not ship it as your only layout.

## How to use it today without breaking anything

Progressive enhancement is the whole answer, and grid-lanes was designed to make it painless. Unsupported browsers ignore `display: grid-lanes` and you fall back to whatever you set first.

```css
.gallery {
  /* fallback everyone gets: a normal responsive grid */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

@supports (display: grid-lanes) {
  .gallery {
    display: grid-lanes; /* upgrade to tight packing where available */
  }
}
```

Browsers that understand grid-lanes get the masonry. Everyone else gets a perfectly fine grid with some extra vertical whitespace. Nobody gets a broken page, and you can ship this right now.

## The bottom line

What strikes me about this whole saga isnt the feature, its the process. Nine years. Three competing proposals. A genuinely elegant unifying idea (Item Flow) that got rejected precisely because it was too ambitious to ship. And the thing that won was the boring, pragmatic compromise: reuse the syntax everyone already knows, isolate the algorithm so nothing gets slower, give it a plain descriptive name.

That is usually how good standards turn out. Not the most beautiful proposal, the one that ships without making everything else worse. Grid-lanes is masonry without the JavaScript, without the layout thrash, without the reading-order disaster — as long as you respect that last part and order your DOM like it matters, because it does.

We faked this layout for a decade. Now we dont have to. Just tab through it before you ship it.

---

## References

- [Introducing CSS Grid Lanes — WebKit](https://webkit.org/blog/17660/introducing-css-grid-lanes/)
- [When will CSS Grid Lanes arrive? — WebKit](https://webkit.org/blog/17758/when-will-css-grid-lanes-arrive-how-long-until-we-can-use-it/)
- [Masonry Layout is Now grid-lanes — CSS-Tricks](https://css-tricks.com/masonry-layout-is-now-grid-lanes/)
- [Masonry: Watching a CSS Feature Evolve — CSS-Tricks](https://css-tricks.com/masonry-watching-a-css-feature-evolve/)
- [Item Flow, Part 1: A new unified concept for layout — WebKit](https://webkit.org/blog/16587/item-flow-part-1-a-new-unified-concept-for-layout/)
- [Brick by brick: Help us build CSS Masonry — Chrome for Developers](https://developer.chrome.com/blog/masonry-update)
- [Masonry layout — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Masonry_layout)
- [CSS Grid Layout Module Level 3 — W3C](https://www.w3.org/TR/css-grid-3/)
- [WCAG 2.2: 1.3.2 Meaningful Sequence — W3C](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)
- [Masonry and reading order — Rachel Andrew](https://rachelandrew.co.uk/archives/2024/05/26/masonry-and-reading-order/)
- [CSSWG issue #11243: Masonry syntax debate](https://github.com/w3c/csswg-drafts/issues/11243)
- [CSSWG issue #945: the original masonry use case](https://github.com/w3c/csswg-drafts/issues/945)
</content>
</invoke>
