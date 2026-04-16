---
title: "HTML-in-Canvas: The proposal that finally bridges the DOM and pixel worlds"
publishDate: "2026-04-16T10:00:00.000Z"
slug: "html-in-canvas-wicg-proposal-drawelementimage"
description: "Theres a new WICG proposal that lets you draw real HTML elements inside canvas with full CSS, accessibility, and hit testing. No more foreignObject hacks, no more html2canvas. Heres how it works."
tags: ["html", "canvas", "web standards", "frontend", "web development", "wicg"]
featured: true
draft: false
readTime: 15
---

## The two worlds problem

Canvas and HTML have always lived in separate universes. Canvas gives you pixels - fast, compositable, GPU-friendly pixels. HTML gives you layout, accessibility, text rendering, form controls, and everything else that makes the web actually usable. For most things, you pick one and stick with it.

But there are entire categories of applications that need both at the same time. Chart libraries that need styled text labels. Creative tools like Figma and Canva that render on canvas but need rich text editing. Games with HTML UI overlays. Any app that needs to export a DOM node as an image.

And until now, every solution to this problem has been some flavor of terrible.

## The old hacks (and why they suck)

If youve ever needed HTML inside a canvas, you probably stumbled into one of these approaches. I certainly have.

### The foreignObject trick

SVG has an element called `<foreignObject>` that can contain arbitrary HTML. Canvas can draw SVG images. So you serialize your DOM to a string, wrap it in an SVG `foreignObject`, create a blob URL, and draw it on the canvas.

```javascript
const html = new XMLSerializer().serializeToString(element);
const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <foreignObject width="100%" height="100%">
      ${html}
    </foreignObject>
  </svg>
`;
const blob = new Blob([svg], { type: 'image/svg+xml' });
const img = new Image();
img.src = URL.createObjectURL(blob);
img.onload = () => ctx.drawImage(img, 0, 0);
```

Clever? Yes. Reliable? Absolutely not. External stylesheets are gone. Fonts dont load. Images break unless you convert everything to base64 data URIs. Pseudo-elements vanish because they dont exist in the DOM. CORS taints the canvas the moment anything cross-origin touches it. Safari renders half the CSS properties differently or not at all.

I once spent an entire afternoon debugging why a component looked "almost right" in the canvas export. Turned out the `::after` pseudo-element was doing 40% of the visual work.

### html2canvas and friends

[html2canvas](https://html2canvas.hertzen.com/) re-implements the browsers rendering engine in JavaScript. It reads the DOM, computes styles, and draws everything manually using canvas API calls. The results cover about 80% of CSS, which sounds great until you realize the other 20% is always the part your designer cares about. Its also essentially unmaintained.

[modern-screenshot](https://github.com/qq15725/modern-screenshot) improves on the `foreignObject` approach by automatically inlining styles, fonts, and images. Better, but still fundamentally limited by the same constraints.

[satori](https://github.com/vercel/satori) takes the opposite approach - you write JSX with a restricted CSS subset, and it converts it directly to SVG. It powers OG image generation in Next.js. Smart tradeoff: limited scope, but what it supports works perfectly.

All of these are creative workarounds for a platform-level gap. None of them give you what you actually want: the browser rendering your HTML at full fidelity, inside a canvas, with accessibility and interactivity intact.

## Enter the HTML-in-Canvas proposal

The [WICG HTML-in-Canvas proposal](https://github.com/WICG/html-in-canvas) is a proper web standard being incubated that would let you draw real, live HTML elements into 2D and 3D canvas contexts. Not serialized snapshots. Not re-implementations. The actual browser-rendered elements, with full CSS support, layout, and interactivity.

Its already implemented behind a flag in Chromium (`chrome://flags/#canvas-draw-element`). You can try it today.

The core idea has three parts: a new attribute, a new drawing method, and a new event.

### The layoutsubtree attribute

First, you tell the canvas that its children should participate in layout:

```html
<canvas id="canvas" layoutsubtree>
  <form id="myForm">
    <label for="name">Name:</label>
    <input id="name" type="text">
    <button type="submit">Send</button>
  </form>
</canvas>
```

The `layoutsubtree` attribute makes the canvas's direct children go through the full layout pipeline - they get styled, laid out, and participate in hit testing. But they remain hidden until you explicitly draw them. Think of it as telling the browser "prepare these elements, but let me decide where they appear."

Each direct child creates its own stacking context and gets paint containment applied. Overflow clips to the element's border box. The browser does all the hard rendering work, and you control the placement.

### drawElementImage()

This is the main event. Instead of `drawImage` with an image source, you call `drawElementImage` with a DOM element:

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const form = document.getElementById('myForm');

const transform = ctx.drawElementImage(form, 100, 50);
```

It follows the same overload pattern as `drawImage`:

```javascript
// position only
ctx.drawElementImage(element, dx, dy);

// position + destination size
ctx.drawElementImage(element, dx, dy, dwidth, dheight);

// source crop + destination
ctx.drawElementImage(element, sx, sy, sw, sh, dx, dy, dw, dh);
```

The browser renders the element with its full CSS - shadows, filters, gradients, pseudo-elements, custom fonts, everything. Because the browser itself is doing the rendering, not a JavaScript re-implementation.

But the really clever part is the return value. `drawElementImage()` returns a `DOMMatrix` - the CSS transform you need to apply to the element so that its hit testing and accessibility tree match where you drew it on the canvas.

```javascript
canvas.onpaint = () => {
  ctx.reset();
  const transform = ctx.drawElementImage(form, 100, 50);
  form.style.transform = transform.toString();
};
```

This means the form inputs are interactive. You can click them, type in them, tab between them. The browser handles focus, selection, accessibility - everything. The element lives in the DOM with full semantics, you just drew it somewhere specific on the canvas.

### The paint event

Instead of running a `requestAnimationFrame` loop that redraws every frame whether anything changed or not, the proposal adds a `paint` event that fires only when something actually needs updating:

```javascript
canvas.onpaint = (event) => {
  // event.changedElements tells you what changed
  ctx.reset();

  // draw a styled label
  const t1 = ctx.drawElementImage(label, 20, 20);
  label.style.transform = t1.toString();

  // draw an interactive form
  const t2 = ctx.drawElementImage(form, 200, 50);
  form.style.transform = t2.toString();
};
```

The event fires once per frame, right after the browsers paint step. It gives you the list of changed elements so you can optimize what you redraw. DOM modifications inside the paint handler apply to the next frame, not the current one - no infinite loops, no accidental recursion.

Theres also `canvas.requestPaint()` for when you need to force a repaint, giving you `requestAnimationFrame`-like control when you need it.

## The 3D angle: WebGL and WebGPU

This is where things get genuinely exciting. The proposal includes APIs for using HTML as textures in WebGL and WebGPU scenes.

### WebGL

```javascript
const gl = canvas.getContext('webgl2');
gl.texElementImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);
```

Thats HTML on a 3D surface. A live, interactive form on the side of a rotating cube. A CSS-styled tooltip floating in a 3D scene. Game UI rendered by the browser's actual layout engine instead of a custom text renderer that only supports half of Unicode.

### WebGPU

```javascript
const elementImage = canvas.captureElementImage(element);
gpuQueue.copyElementImageToTexture(elementImage, { texture: gpuTexture });
```

`captureElementImage()` creates a transferable snapshot that you can send to a worker thread, which means you can do the GPU upload on a separate thread via `OffscreenCanvas`. Heavy 3D rendering without blocking the main thread.

## The demos that will melt your brain

The theory is cool, but the demos are what really sell this. People have been building some absolutely wild stuff with the experimental flag enabled.

### Doom with HTML forms inside

Yes, you read that right. Theres a [demo](https://niccolli.github.io/niccolli/drawElementImage-demos/doom/) running Doom in a canvas - nothing new there - but with an HTML form rendered inside the game world. A real `<form>` with `<input>` fields. You can click on it, type your name, select the text, copy and paste it. The form lives in the DOM, participates in the accessibility tree, and responds to all standard JavaScript events. But visually its inside a first-person shooter.

Let that sink in. Before this proposal, you could simulate a text input in canvas by manually tracking keystrokes, drawing glyphs, managing cursor position and selection ranges yourself. People have done this. Its hundreds of lines of fragile code for something that HTML gives you for free. Now you just put an `<input>` inside the canvas and it works.

### Wes Bos's destructible editor

Wes Bos built a demo where you have editable HTML content inside a canvas - text, buttons, inputs - and you can literally explode it. The elements shatter into pieces with physics, flying across the screen. But heres the thing: you can still click the fragments. You can click a button mid-explosion and it fires its click handler. You can focus an input thats tumbling through space and type into it.

This is the kind of thing that was theoretically possible before by overlaying invisible DOM elements on top of canvas and painstakingly syncing their positions frame by frame. In practice, nobody did it because the synchronization was a nightmare. Now the browser handles it natively.

### 3D rooms with live web content

One of the WebGL demos renders a full 3D room - walls, lighting, perspective - with HTML content mapped onto surfaces as textures. Forms on the walls. Buttons you can click. Text you can select. Its not a flat screenshot of HTML pasted onto a polygon. Its live, interactive content inside a 3D scene.

Imagine this for VR and AR applications. WebXR already lets you build immersive experiences in the browser, but UI inside those experiences has always been painful. You either build custom 3D UI systems from scratch or break immersion by overlaying flat HTML on top. With HTML-in-Canvas + WebGPU, you could have native web forms, buttons, and text rendered directly on surfaces in a 3D space. Thats a massive deal for the spatial web.

### A full Web OS

Another demo recreates a desktop operating system entirely in a canvas. Windows with glass backdrop blur effects, draggable panels, interactive content inside each window. All HTML, all accessible, all benefiting from canvas compositing effects that would be impossible with pure CSS.

Before this, building something like this meant choosing between two bad options: pure HTML with limited visual effects, or pure canvas with no accessibility and manual reimplementation of every UI primitive. Now you get both.

## What it means for real use cases

### Creative tools (Figma, Canva, Miro)

Right now, canvas-based editors overlay invisible HTML elements on top of the canvas and manually sync their positions. Its fragile. Scroll events, zoom levels, transforms - everything has to be synchronized by hand, and it breaks in subtle ways all the time.

With `drawElementImage`, the HTML is part of the canvas draw calls. You position it with the same transform matrix as everything else. Zoom works. Pan works. The element's hit testing automatically stays in sync because of the returned `DOMMatrix`.

### Charts with styled text

Every charting library struggles with text. Canvas text rendering is limited - no line wrapping, no rich formatting, no CSS custom fonts without manually loading them. Libraries like D3 use SVG for this reason, even when canvas would be faster for the actual data visualization.

With HTML-in-canvas, you draw your data points and lines on canvas for performance, then draw styled HTML labels with `drawElementImage`. Best of both worlds. And crucially, the text inside the chart is now selectable and copyable - something users have been complaining about in canvas-based charts for years.

```javascript
canvas.onpaint = () => {
  ctx.reset();

  // fast canvas drawing for the data
  drawChartLines(ctx, data);
  drawDataPoints(ctx, data);

  // rich HTML for the labels
  for (const label of labelElements) {
    const t = ctx.drawElementImage(label, label.dataset.x, label.dataset.y);
    label.style.transform = t.toString();
  }
};
```

### Games with native UI

Game developers on the web have always had to choose: canvas for rendering, HTML for UI. Most games end up with a hybrid approach - canvas for the game world, HTML overlays for menus, chat, inventory screens. The two layers dont interact, and keeping them aligned is a constant headache.

With this proposal, you could render your game on canvas and have actual HTML forms, buttons, and text inside the game world. The Doom demo proves this works. Imagine an MMO where the chat window is a real `<textarea>`, item descriptions are real HTML with links, and settings panels are real forms - all rendered inside the game canvas with 3D effects applied.

### Image and video export

The proposal directly enables exporting HTML content as images or video frames. No Puppeteer, no headless browser, no `foreignObject` serialization. The browser renders the HTML natively into the canvas, and you call `canvas.toBlob()` or feed it into a `MediaRecorder`.

### Accessibility and SEO

This might be the most important angle. Canvas content has always been a black box. Screen readers see a `<canvas>` element and nothing else. Search engines cant index canvas-rendered text. The typical workaround is fallback content that doesnt match whats actually rendered, which is worse than useless.

With `layoutsubtree`, the HTML elements inside the canvas are real DOM nodes. They show up in the accessibility tree. Screen readers can navigate them. Focus management works. ARIA attributes work. And search engines can read the content because its actual HTML in the DOM.

Before this, you could simulate a button in canvas. You could draw text that looks like a button, track click coordinates, and fire a handler when the click lands in the right rectangle. But it wasnt a button. It didnt show up in the tab order. Screen readers didnt announce it. Keyboard navigation didnt work. Now you put a `<button>` inside the canvas and everything just works. The declarative power of HTML, inside the visual power of canvas.

## Privacy and security model

The proposal explicitly excludes sensitive information from rendering. Cross-origin content (iframes, images), system colors, visited link states, spelling markers, and pending autofill data are all stripped out. This prevents the "canvas fingerprinting through rendered HTML" attack vector that would otherwise be an obvious concern.

What does render: search highlights, scrollbar appearance, form element styles, and forced colors mode. The line is drawn at "things that could leak user-specific information across origins."

## The catch: its still early

Lets be real about the state of things. The proposal is in WICG incubation. Chromium has it behind a flag (`chrome://flags/#canvas-draw-element`). Firefox and Safari havent announced anything. The spec is being actively iterated on, and the contributors are mostly from the Chromium and Igalia teams.

This is not something you ship to production today. It needs buy-in from Mozilla and Apple to become a real web standard, and thats never guaranteed. But its also not vaporware. Theres a [working implementation](https://github.com/niccolli/niccolli.github.io/tree/main/niccolli/drawElementImage-demos), the API design is solid, and the use cases are compelling enough that I expect this to move forward.

The demos are worth trying if you enable the flag in Chrome Canary: complex text rotation, pie charts with styled labels, a WebGPU jelly slider effect with HTML under shader effects, Doom with HTML forms, a full web OS, and interactive 3D rooms.

## What to use right now

Until HTML-in-Canvas ships, the workaround landscape hasnt changed:

- **OG images and social cards**: [satori](https://github.com/vercel/satori) is the best option. Restricted CSS subset but perfect output.
- **DOM screenshots**: [modern-screenshot](https://github.com/qq15725/modern-screenshot) handles the `foreignObject` pipeline with automatic inlining.
- **Pixel-perfect captures**: Puppeteer or Playwright. Heavy, but nothing else matches the fidelity.
- **Canvas-based text**: Deal with the limitations or use SVG instead.

But keep an eye on `drawElementImage`. If it lands in browsers, it obsoletes most of the above. The `foreignObject` hack, html2canvas, the invisible overlay pattern - all of them exist because the platform didnt have a proper answer. Now it might.

The web has a long history of hacky userland solutions eventually being replaced by proper platform APIs. `jQuery.ajax` became `fetch`. CSS-in-JS became `@scope` and cascade layers. `foreignObject`-in-canvas might become `drawElementImage`.

And the timing feels right. Were moving into a world where spatial computing, AR glasses, and immersive web experiences are becoming real products, not just demos. Having native HTML inside canvas - accessible, interactive, compositable with 3D effects - isnt just a nice-to-have anymore. Its infrastructure for whats next.

Im here for it.
