---
title: "CSS corner-shape: Goodbye Boring Corners"
publishDate: "2025-12-10T10:00:00.000Z"
slug: "css-corner-shape-geometric-shapes-guide"
description: "The new CSS corner-shape property is here to revolutionize how we design corners. Apple-style squircles, bevels, notches and geometric shapes without SVG. Complete guide with practical examples."
tags: ["css", "frontend", "web development", "design", "tutorial"]
featured: true
draft: false
readTime: 15
---

## The Eternal Corner Problem

Weve been stuck with `border-radius` for what feels like forever. Rounded corners? Easy. Perfect circle? `border-radius: 50%` done. But try to make something interesting - an Apple-style squircle, a hexagon, beveled edges - and suddenly youre knee deep in SVG paths, `clip-path` coordinates, or stacking pseudo-elements like some kind of CSS archaeologist reconstructing ancient artifacts.

I once spent four hours trying to make a button look like the iOS app icons. Four hours. For a button. I ended up using a PNG because I ran out of patience and my designer was asking why it was taking so long. Not my proudest moment.

But someone at the [CSS Working Group](https://www.w3.org/Style/CSS/) finally decided to help us out. Meet `corner-shape`, the property that shouldve existed in 2010.

The concept is simple: `border-radius` controls the **size** of the corner, `corner-shape` controls the **shape**. They work together. Like salt and pepper, or me and coffee after midnight when I'm debugging CSS.

<div class="flex justify-center my-6">
  <div class="w-28 h-28 bg-blue-500 rounded-[30px]" style="corner-shape: squircle;"></div>
</div>

```css
.element {
  border-radius: 30px;
  corner-shape: squircle;
}
```

Two lines. Thats a squircle. No SVG, no hacks, no selling your soul.

The spec lives in [CSS Borders and Box Decorations Level 4](https://drafts.csswg.org/css-backgrounds-4/#corner-shaping), still Editor's Draft but Chrome and Edge already support it. More on browser support later.

## Values and Syntax

`corner-shape` uses keywords that map to something called a **superellipse**. If you remember anything from math class (I barely do), the superellipse equation is:

$|x/a|^n + |y/b|^n = 1$

Where `n` is what determines the curve. The CSS keywords are shortcuts to specific `n` values. You dont need to remember this, but its useful if you want to understand why the curves look the way they do.

<div class="grid grid-cols-3 md:grid-cols-6 gap-4 my-6">
  <div class="flex flex-col items-center gap-2">
    <div class="w-16 h-16 bg-blue-500 rounded-[20px]" style="corner-shape: round;"></div>
    <span class="text-xs text-gray-400">round</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-16 h-16 bg-blue-500 rounded-[20px]" style="corner-shape: squircle;"></div>
    <span class="text-xs text-gray-400">squircle</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-16 h-16 bg-blue-500 rounded-[20px]" style="corner-shape: bevel;"></div>
    <span class="text-xs text-gray-400">bevel</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-16 h-16 bg-blue-500 rounded-[20px]" style="corner-shape: scoop;"></div>
    <span class="text-xs text-gray-400">scoop</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-16 h-16 bg-blue-500 rounded-[20px]" style="corner-shape: notch;"></div>
    <span class="text-xs text-gray-400">notch</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-16 h-16 bg-blue-500 rounded-[20px]" style="corner-shape: square;"></div>
    <span class="text-xs text-gray-400">square</span>
  </div>
</div>

**round** (n=1) - The default. Quarter-circle arc, same as normal `border-radius`. Nothing new here.

**squircle** (n=2) - This is the one everyone wants. The Apple curve. More gradual than a circle, tightens toward the edges. iOS icons, MacOS buttons, everything Apple uses this. The reason it looks "smoother" is that the curvature derivative is continuous at the tangent points. I had to look that up.

**bevel** (n=0) - Straight diagonal line. The corner becomes a 45-degree chamfer. Useful for industrial/techy looks.

**scoop** (n=-1) - The curve goes inward instead of outward. Concave quarter-circle. Weird but sometimes thats what you need.

**notch** (n=-infinity) - Two perpendicular lines meeting at a right angle pointing inward. Like someone took a rectangular bite out of your element.

**square** (n=infinity) - Cancels the border-radius entirely. Seems useless but its essential for animations - you can transition smoothly from `square` to any other value.

```css
.round { corner-shape: round; }
.squircle { corner-shape: squircle; }
.bevel { corner-shape: bevel; }
.scoop { corner-shape: scoop; }
.notch { corner-shape: notch; }
.square { corner-shape: square; }
```

### The superellipse() function

If the keywords arent enough, use `superellipse(n)` directly with any number:

<div class="flex justify-center gap-4 my-6">
  <div class="flex flex-col items-center gap-2">
    <div class="w-20 h-20 bg-emerald-500 rounded-[30px]" style="corner-shape: superellipse(0.5);"></div>
    <span class="text-xs text-gray-400 font-mono">n=0.5</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-20 h-20 bg-emerald-500 rounded-[30px]" style="corner-shape: superellipse(1.5);"></div>
    <span class="text-xs text-gray-400 font-mono">n=1.5</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-20 h-20 bg-emerald-500 rounded-[30px]" style="corner-shape: superellipse(3);"></div>
    <span class="text-xs text-gray-400 font-mono">n=3</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-20 h-20 bg-emerald-500 rounded-[30px]" style="corner-shape: superellipse(-0.5);"></div>
    <span class="text-xs text-gray-400 font-mono">n=-0.5</span>
  </div>
</div>

```css
.gentle-squircle {
  border-radius: 40px;
  corner-shape: superellipse(1.5);
}

.aggressive-squircle {
  border-radius: 40px;
  corner-shape: superellipse(3);
}
```

Quick reference:
- **0 < n < 1**: Sharper than a circle but still convex
- **n = 1**: Perfect circle (same as `round`)
- **1 < n < 2**: Getting flatter, approaching squircle territory
- **n = 2**: The squircle
- **n > 2**: More and more rectangular
- **n < 0**: Concave curves
- **n approaching infinity**: Approaches `square`

### Multi-value syntax

You can set different shapes for each corner. Same order as padding/margin: top-left, top-right, bottom-right, bottom-left.

<div class="flex justify-center my-6">
  <div class="w-28 h-28 bg-amber-500 rounded-[30px]" style="corner-shape: round bevel notch squircle;"></div>
</div>

```css
.mixed-corners {
  border-radius: 30px;
  corner-shape: round bevel notch squircle;
}
```

1 value = all corners. 2 values = top-left/bottom-right, top-right/bottom-left. 3 values = top-left, top-right/bottom-left, bottom-right. 4 values = each corner individually.

### Individual corner properties

For when you need maximum control:

```css
.granular-control {
  border-radius: 30px;
  corner-top-left-shape: squircle;
  corner-top-right-shape: bevel;
  corner-bottom-right-shape: round;
  corner-bottom-left-shape: notch;
}
```

Theres also logical properties for RTL layouts:

```css
.logical-corners {
  border-radius: 30px;
  corner-start-start-shape: squircle;
  corner-start-end-shape: bevel;
  corner-end-start-shape: round;
  corner-end-end-shape: notch;
}
```

### Interactive demo

Play with this slider to see how `superellipse()` transforms corners in real time. Needs Chrome 139+ or Edge 139+ - if youre on Firefox or Safari youll just see a normal rounded box.

<div class="bg-white/5 border border-white/10 rounded-xl p-6 my-6">
  <div class="flex flex-col items-center gap-5">
    <div id="demo-box" class="w-36 h-36 bg-blue-500 rounded-[40px] transition-all duration-150"></div>
    <div class="w-full max-w-xs">
      <div class="flex justify-between mb-2 text-sm">
        <span class="text-gray-400">superellipse(</span>
        <span id="slider-value" class="font-mono text-indigo-400 font-bold">2</span>
        <span class="text-gray-400">)</span>
      </div>
      <input type="range" id="superellipse-slider" min="-3" max="5" step="0.1" value="2" class="w-full accent-indigo-500 cursor-pointer">
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>scoop</span>
        <span>bevel</span>
        <span>round</span>
        <span>squircle</span>
        <span>square</span>
      </div>
    </div>
    <div class="flex gap-2 flex-wrap justify-center">
      <button onclick="setPreset(-1)" class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-gray-300 cursor-pointer text-xs hover:bg-white/20 transition-colors">scoop</button>
      <button onclick="setPreset(0)" class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-gray-300 cursor-pointer text-xs hover:bg-white/20 transition-colors">bevel</button>
      <button onclick="setPreset(1)" class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-gray-300 cursor-pointer text-xs hover:bg-white/20 transition-colors">round</button>
      <button onclick="setPreset(2)" class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-gray-300 cursor-pointer text-xs hover:bg-white/20 transition-colors">squircle</button>
      <button onclick="setPreset(5)" class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-gray-300 cursor-pointer text-xs hover:bg-white/20 transition-colors">square</button>
    </div>
    <code id="css-output" class="bg-black/30 px-4 py-3 rounded-lg text-sm text-sky-300 w-full max-w-xs text-center">corner-shape: squircle;</code>
  </div>
</div>

<script>
(function() {
  const slider = document.getElementById('superellipse-slider');
  const box = document.getElementById('demo-box');
  const valueDisplay = document.getElementById('slider-value');
  const cssOutput = document.getElementById('css-output');

  function getKeyword(n) {
    if (n === -1) return 'scoop';
    if (n === 0) return 'bevel';
    if (n === 1) return 'round';
    if (n === 2) return 'squircle';
    if (n >= 5) return 'square';
    return null;
  }

  function updateShape(value) {
    const n = parseFloat(value);
    valueDisplay.textContent = n.toFixed(1);
    box.style.cornerShape = 'superellipse(' + n + ')';

    const keyword = getKeyword(n);
    if (keyword) {
      cssOutput.textContent = 'corner-shape: ' + keyword + ';';
    } else {
      cssOutput.textContent = 'corner-shape: superellipse(' + n.toFixed(1) + ');';
    }
  }

  slider.addEventListener('input', function() {
    updateShape(this.value);
  });

  window.setPreset = function(value) {
    slider.value = value;
    updateShape(value);
  };

  updateShape(slider.value);
})();
</script>

## Practical examples

Alright enough theory. Lets make some stuff.

### Discount tag

Mixing different corner shapes on one element:

<div class="flex justify-center my-6">
  <div class="bg-red-600 text-white px-4 py-2 text-sm font-bold" style="border-radius: 10px 10px 10px 50%; corner-shape: round bevel bevel round;">-20% OFF</div>
</div>

```css
.discount-tag {
  background: #dc2626;
  color: white;
  padding: 8px 16px;
  border-radius: 10px 10px 10px 50%;
  corner-shape: round bevel bevel round;
}
```

The beveled bottom corners give it that "cut" look while the top stays soft. Used to need pseudo-elements for this.

### Geometric shapes

No `clip-path`, no SVG, no pseudo-elements. Just CSS.

**Hexagon**:

<div class="flex justify-center my-6">
  <div class="w-32 bg-blue-500" style="aspect-ratio: cos(30deg); border-radius: 50% / 25%; corner-shape: bevel;"></div>
</div>

```css
.hexagon {
  width: 200px;
  aspect-ratio: cos(30deg); /* ~0.866 */
  background: #3b82f6;
  border-radius: 50% / 25%;
  corner-shape: bevel;
}
```

The `cos(30deg)` aspect ratio gives correct hexagon proportions. The elliptical border-radius positions the tangent points, `bevel` connects them with straight lines. I had to think about this one for a while but once it clicks it makes sense.

**Octagon**:

<div class="flex justify-center my-6">
  <div class="w-32 h-32 bg-green-500 rounded-[30%]" style="corner-shape: bevel;"></div>
</div>

```css
.octagon {
  width: 200px;
  aspect-ratio: 1;
  background: #22c55e;
  border-radius: 30%;
  corner-shape: bevel;
}
```

Easier than hexagon. The 30% determines how much of each corner gets beveled.

**Diamond**:

<div class="flex justify-center my-6">
  <div class="w-24 h-24 bg-amber-500 rounded-[50%] rotate-45" style="corner-shape: bevel;"></div>
</div>

```css
.diamond {
  width: 150px;
  aspect-ratio: 1;
  background: #f59e0b;
  border-radius: 50%;
  corner-shape: bevel;
  transform: rotate(45deg);
}
```

**Isometric cube effect**:

<div class="flex justify-center my-6">
  <div class="w-24 h-24 bg-purple-600" style="border-radius: 0 30px; corner-shape: bevel; border-right: 30px solid rgba(0,0,0,0.25); border-bottom: 30px solid rgba(0,0,0,0.5);"></div>
</div>

```css
.cube {
  width: 100px;
  height: 100px;
  background: #9333ea;
  border-radius: 0 30px;
  corner-shape: bevel;
  border-right: 30px solid rgba(0, 0, 0, 0.25);
  border-bottom: 30px solid rgba(0, 0, 0, 0.5);
}
```

The dark borders on right and bottom fake depth. Cool trick.

### Animations

`corner-shape` is animatable. The browser converts keywords to `superellipse()` values and interpolates between them.

<div class="flex justify-center my-6">
  <div class="w-28 h-28 bg-indigo-500 rounded-[40px] animate-pulse" style="corner-shape: squircle;"></div>
</div>

```css
.animated-button {
  border-radius: 50px;
  corner-shape: round;
  transition: corner-shape 0.3s ease;
}

.animated-button:hover {
  corner-shape: squircle;
}
```

For keyframes:

```css
@keyframes morph {
  0% { corner-shape: square; }
  25% { corner-shape: round; }
  50% { corner-shape: squircle; }
  75% { corner-shape: scoop; }
  100% { corner-shape: notch; }
}

.morphing-box {
  border-radius: 50px;
  animation: morph 4s ease-in-out infinite;
}
```

Transitioning from `round` (n=1) to `squircle` (n=2) passes through all intermediate curves smoothly. Pretty satisfying to watch.

## Browser support

As of December 2025:

| Browser | Support |
|---------|---------|
| Chrome 139+ | Yes |
| Edge 139+ | Yes |
| Chrome Android 142+ | Yes |
| Firefox | No |
| Safari | No |

About **65-66%** global coverage. Not great but not terrible for a new feature.

Good news: `corner-shape` degrades gracefully. Unsupported browsers just ignore it and show normal `border-radius`. Nothing breaks.

```css
.card {
  border-radius: 20px;
  corner-shape: squircle;
}
```

Chrome gets the squircle. Safari gets normal rounded corners. Both work fine.

If you want conditional styling:

```css
@supports not (corner-shape: squircle) {
  .card {
    /* fallback styles */
  }
}
```

But honestly most of the time you dont need a fallback. Normal rounded corners are fine.

## The bottom line

Before `corner-shape` we had SVG (flexible but complex), `clip-path` (clips borders and shadows too), pseudo-elements (hackery), or images (dont scale, extra HTTP requests).

Now its one CSS property. Borders, shadows, backgrounds all follow the shape automatically. Fully animatable. No performance overhead.

CSS keeps getting better. We dont need SVG or JavaScript for visual effects that should be native. A hexagon shouldnt require calculating polygon coordinates. A button that looks like an iOS icon shouldnt take four hours.

Once Firefox and Safari catch up this will probably be as common as `border-radius` itself.

---

## References

- [CSS Backgrounds and Borders Level 4](https://drafts.csswg.org/css-backgrounds-4/#corner-shaping)
- [MDN - corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape)
- [CSS-Tip: Corner Shape Demos](https://css-tip.com/corner-shape/)
- [Can I Use - corner-shape](https://caniuse.com/mdn-css_properties_corner-shape)
- The four hours I spent on that iOS button before this existed
