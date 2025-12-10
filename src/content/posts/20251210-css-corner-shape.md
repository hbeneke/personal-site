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

We've been juggling with `border-radius` for years. Want rounded corners? Easy. Want a perfect circle? `border-radius: 50%` and done. But what happens when you need something more... interesting? That's where the suffering begins.

Until now, if you wanted to make an Apple-style squircle, a hexagon, or just some decent beveled corners, you had to resort to SVG, `clip-path`, pseudo-elements stacked like pancakes, or straight up images. And let's not even talk about trying to make borders and shadows follow those custom shapes. It was hell.

But hey, looks like someone at the [CSS Working Group](https://www.w3.org/Style/CSS/) finally heard our prayers. Let me introduce you to `corner-shape`, the property that should have existed a decade ago.

The idea is simple but brilliant: `border-radius` defines the **size** of the corner, and `corner-shape` defines the **shape**. They're inseparable companions, like gin and tonic, or like you and coffee at 3am debugging CSS.

<div class="flex justify-center my-6">
  <div class="w-28 h-28 bg-blue-500 rounded-[30px]" style="corner-shape: squircle;"></div>
</div>

```css
.element {
  border-radius: 30px;
  corner-shape: squircle;
}
```

That's it. Two lines and you've got a squircle. No SVG, no hacks, no selling your soul to the pseudo-element devil.

The property is defined in the [CSS Borders and Box Decorations Level 4](https://drafts.csswg.org/css-backgrounds-4/#corner-shaping) module, which is still in Editor's Draft phase. But don't worry, you can already use it in Chrome and Edge. More on compatibility later.

## Values and Syntax

The `corner-shape` property accepts several predefined keyword values, each mapping to a specific mathematical function called a **superellipse**. Understanding this underlying math helps predict exactly how each value will render.

The superellipse equation is: $|x/a|^n + |y/b|^n = 1$

Where `n` is the exponent that determines the curve shape. The CSS keywords are essentially shortcuts to specific `n` values:

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

**round** (n=1) is the default value. Produces a quarter-circle arc, identical to the traditional `border-radius` behavior. The curve follows the equation of a circle where the rate of curvature is constant throughout.

**squircle** (n=2) generates a Lamé curve, specifically a superellipse with exponent 2. The curvature is more gradual near the center and tightens toward the endpoints. This is the curve Apple uses extensively in iOS icons and UI elements - it creates a smoother visual transition than a simple circular arc because the curvature derivative is continuous at the tangent points.

**bevel** (n=0) produces a straight diagonal line connecting the two tangent points. Mathematically, this is the limiting case as n approaches 0 - the curve collapses into a line segment. The corner essentially becomes a chamfer with a 45-degree angle (assuming equal horizontal and vertical radii).

**scoop** (n=-1) inverts the curvature direction, creating a concave quarter-circle. The curve bows inward instead of outward. This is the negative-space equivalent of `round`.

**notch** (n=-infinity) is the limiting case of negative exponents. It produces two perpendicular line segments meeting at a right angle, pointing inward. Think of it as a rectangular bite taken out of the corner.

**square** (n=infinity) nullifies the border-radius entirely. The corner becomes a perfect 90-degree angle. This seems useless on its own, but it's essential for animations - you can transition smoothly from `square` to any other value.

```css
.round { corner-shape: round; }
.squircle { corner-shape: squircle; }
.bevel { corner-shape: bevel; }
.scoop { corner-shape: scoop; }
.notch { corner-shape: notch; }
.square { corner-shape: square; }
```

### The superellipse() Function

For precise control beyond the keywords, use `superellipse(n)` directly. The `n` parameter accepts any real number:

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

.subtle-scoop {
  border-radius: 40px;
  corner-shape: superellipse(-0.5);
}
```

The behavior follows these rules:

- **0 < n < 1**: Curves that are "sharper" than a circle but still convex
- **n = 1**: Perfect circular arc (equivalent to `round`)
- **1 < n < 2**: Progressively flatter curves approaching the squircle
- **n = 2**: The squircle (Lamé curve)
- **n > 2**: Increasingly rectangular with rounded corners approaching a true rectangle
- **n < 0**: Concave curves, with more negative values producing sharper concavity
- **n approaching -infinity**: Approaches the `notch` shape
- **n approaching +infinity**: Approaches the `square` shape

### Multi-Value Syntax

The property accepts 1 to 4 values following the standard CSS box model order: top-left, top-right, bottom-right, bottom-left (clockwise from top-left).

<div class="flex justify-center my-6">
  <div class="w-28 h-28 bg-amber-500 rounded-[30px]" style="corner-shape: round bevel notch squircle;"></div>
</div>

```css
.mixed-corners {
  border-radius: 30px;
  corner-shape: round bevel notch squircle;
}
```

Value distribution follows the same logic as `margin`, `padding`, and `border-radius`:

- **1 value**: Applied to all four corners
- **2 values**: First to top-left/bottom-right, second to top-right/bottom-left
- **3 values**: First to top-left, second to top-right/bottom-left, third to bottom-right
- **4 values**: Each corner individually in clockwise order

### Individual Corner Properties

For maximum specificity, physical properties target each corner directly:

```css
.granular-control {
  border-radius: 30px;
  corner-top-left-shape: squircle;
  corner-top-right-shape: bevel;
  corner-bottom-right-shape: round;
  corner-bottom-left-shape: notch;
}
```

Logical properties exist for internationalization (RTL layouts, vertical writing modes):

```css
.logical-corners {
  border-radius: 30px;
  corner-start-start-shape: squircle;
  corner-start-end-shape: bevel;
  corner-end-start-shape: round;
  corner-end-end-shape: notch;
}
```

The mapping depends on `writing-mode` and `direction`:

- In LTR horizontal: `start-start` = top-left, `start-end` = top-right, etc.
- In RTL horizontal: `start-start` = top-right, `start-end` = top-left, etc.

### Interactive Demo

Play with the slider below to see how `superellipse()` transforms the corners in real time. You'll need Chrome 139+ or Edge 139+ for this to work - if you're on Firefox or Safari, you'll just see a regular rounded box.

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

## Practical Examples

Now let's put this into practice. Combined with `border-radius` and `aspect-ratio`, you can create shapes that previously required SVG or images.

### Discount Tag

A common UI pattern - mixing different corner shapes on the same element:

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

The asymmetric `border-radius` (three corners at 10px, bottom-left at 50%) combined with mixed `corner-shape` values creates a distinctive tag shape. The beveled bottom corners add a "cut" effect while keeping the top corners soft.

### Geometric Shapes

You can also create geometric shapes with pure CSS. No `clip-path`, no SVG, no pseudo-elements.

**Hexagon**: Using `bevel` on all corners with a specific aspect ratio:

<div class="flex justify-center my-6">
  <div class="w-32 bg-blue-500" style="aspect-ratio: cos(30deg); border-radius: 50% / 25%; corner-shape: bevel;"></div>
</div>

```css
.hexagon {
  width: 200px;
  aspect-ratio: cos(30deg);
  background: #3b82f6;
  border-radius: 50% / 25%;
  corner-shape: bevel;
}
```

The ratio `cos(30deg)` equals approximately 0.866, giving us the correct width-to-height ratio for a regular hexagon. The elliptical `border-radius` of `50% / 25%` positions the tangent points correctly, and `bevel` connects them with straight lines.

**Octagon**: Simpler - just use a square aspect ratio with uniform corner bevel:

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

The 30% `border-radius` determines how far from each corner the beveled line begins. Larger values create a more circular octagon; smaller values approach a square.

**Diamond**: Rotate a beveled square by 45 degrees:

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

**Isometric Cube Effect**: Combining `bevel` with asymmetric borders:

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

This exploits how borders interact with beveled corners. The darker borders on the right and bottom create the illusion of depth. The asymmetric `border-radius` (0 for top-left/bottom-right, 30px for top-right/bottom-left) ensures only specific corners are beveled.

### Animations and Transitions

`corner-shape` is fully animatable. The browser interpolates between values by converting keywords to their `superellipse()` equivalents and smoothly transitioning the `n` parameter.

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

For keyframe animations:

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

The interpolation follows these rules:

- Keywords convert to `superellipse(n)` first
- The `n` values interpolate linearly
- Intermediate frames render the corresponding superellipse curve

This means transitioning from `round` (n=1) to `squircle` (n=2) will pass through all intermediate curves smoothly.

## Browser Compatibility and Graceful Degradation

As of December 2025:

| Browser | Support |
|---------|---------|
| Chrome 139+ | Yes |
| Edge 139+ | Yes |
| Chrome Android 142+ | Yes |
| Firefox | No |
| Safari | No |

Global coverage is around **65-66%** of users. Not ideal, but not bad for such a new feature.

The good news is that `corner-shape` degrades elegantly. If the browser doesn't support it, it simply ignores the property and shows the normal `border-radius`. Your layout doesn't break, your users don't see errors.

```css
.card {
  border-radius: 20px;
  corner-shape: squircle;
}
```

In Chrome you'll see the squircle. In Safari you'll see normal rounded corners. Both work fine.

For conditional styling based on support:

```css
.card {
  border-radius: 20px;
  corner-shape: squircle;
}

@supports not (corner-shape: squircle) {
  .card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}
```

Although honestly, in most cases you don't need a special fallback. Normal rounded corners are perfectly acceptable.

## The Bottom Line

Before `corner-shape`, getting custom corner shapes was a monumental headache. SVG was flexible but complex. `clip-path` clips borders and shadows too. Pseudo-elements are pure hackery. Images don't scale well and add HTTP requests.

With `corner-shape` you get a single CSS property where borders, shadows and backgrounds follow the shape automatically. It's fully animatable with zero performance overhead compared to alternatives.

`corner-shape` is just the beginning. The CSS Borders and Box Decorations Level 4 module has more things cooking. We're seeing a clear trend: CSS is evolving so we don't need SVG or JavaScript for visual effects that should be native to the language.

If you think about it, it makes total sense. Why should you need a vector graphic to make a button with nice corners? Why should you need to calculate polygon coordinates for a hexagon? CSS should be able to do it, and now it finally can.

Once Firefox and Safari catch up, this will likely become as standard as `border-radius` itself.

Meanwhile, if your audience is primarily Chrome users (which, let's be honest, is the majority), you can start using it today. The fallback is free and the enhanced experience for those who support it is worth it.

---

## References

- [CSS Backgrounds and Borders Level 4](https://drafts.csswg.org/css-backgrounds-4/#corner-shaping)
- [MDN - corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape)
- [CSS-Tip: Corner Shape Demos](https://css-tip.com/corner-shape/)
- [Can I Use - corner-shape](https://caniuse.com/mdn-css_properties_corner-shape)
