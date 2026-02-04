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

So the entire Apple App Store website source code is now on GitHub. Not minified, not obfuscated - actual TypeScript files with comments, folder structure, internal references, everything. Someone uploaded it [to a public repo](https://github.com/rxliuli/apps.apple.com) and I spent my whole Sunday going through it instead of doing literally anything else. Worth it though.

## How this even happened

Someone at Apple forgot to disable source maps in production. Thats it. Thats the whole security breach.

Source maps are files that connect minified code back to the original source - super useful for debugging, absolutely should not be publicly accessible. With the right browser extension, anyone could download the complete TypeScript files. Someone did exactly that.

The first thing I noticed when I opened the code: **theyre using Svelte**. Not React. Not Vue. Svelte. For the App Store. One of Apple's most important web properties runs on the framework that everyone says is "too niche for enterprise." Guess Apple didnt get the memo.

Their stack is interesting. TypeScript obviously. SCSS/Sass instead of CSS-in-JS which honestly surprised me - I figured Apple would be all in on some proprietary styling solution. They use Sentry for error tracking and Floating UI for tooltips. Theres also this weird mix of CSS Variables and Sass variables - some components use one, some use the other, some use both. Nobody cleaned that up apparently.

Oh and theres a folder named in ALL CAPS while everything else is lowercase. The kind of thing that bothers you every time you see it but nobody wants to be the person who renames it and potentially breaks something.

## The internal stuff

This is where it gets interesting. Apple has all these internal frameworks that arent publicly documented.

**Jet** is some kind of shared business logic layer. Every import related to core functionality goes through it. **Kong** is their internal firewall/gateway. And heres the funny part - theres code that explicitly spoofs the Origin header to bypass Kong's checks. The comment literally says "we need to fake this in the server because we have origin checks in Kong" and then hardcodes `https://apps.apple.com`. Apple bypassing their own security. Love it.

**AMP** has nothing to do with Google's AMP - this is Apple Media Services, their component library. **PerfKit** is performance monitoring, though I found multiple comments saying its "broken" or "basted somehow". Not sure if "basted" is a typo for "busted" or some internal slang but either way its not a confidence booster.

Throughout the code theres references to project codenames: **Scandium**, **Mandrake**, **Charon**, **Electrocardiogram**, **Tinker Watch**. No idea what any of these are. Electrocardiogram is my favorite though - either its actually health related or someone just really likes dramatic names.

## The stuff that made me laugh

TODOs everywhere. With internal bug tracker references - they use something called "radar" which is like their JIRA. Comments like `@radar(12345678)` followed by "Basted, PerfKit is broken somehow" or just "TODO: This is broken in some manner". There are hardcoded IDs with comments that say "How is this used??" - Apple developers are confused by their own code, just like the rest of us.

But the best find? **Apple is patching Safari bugs in their own frontend code.**

In the video player component, theres a comment explaining they have to bypass the poster attribute "due to covering a playback HLS bug in Safari". Apple is working around bugs in Safari. In their own production code. For their own App Store.

I dont know why this is so funny to me but it is. The browser team ships a bug, the web team has to work around it, probably neither team talks to each other. Same dysfunction as every other company, just with nicer design.

## MetricsKit tracks everything

They have an internal analytics system called MetricsKit. Every product impression, every click, every scroll - all tracked with context about where it happened and what the user was doing. Batched and sent to internal endpoints.

Not surprising, every big company does this. But seeing the actual implementation is interesting. Its deeply integrated into every component. You cant interact with the App Store without generating analytics events.

## Random implementation details

The star rating code is straightforward - create an array of five positions, map each to full/partial/empty based on the rating value. Nothing clever. SVG assets embedded directly. Sometimes boring code is good code.

The animated gradient backgrounds though - those have a detailed comment explaining they originally used `mask-image` but it was killing CPU during animations. So they switched to simulating it with a layer using `background-image` instead. This is the kind of optimization note you almost never see documented. Someone measured, someone experimented, someone wrote down why they made the change. More codebases need this.

Theres also arrays listing which features are available in which countries. Vision Pro stuff is mostly EU. Arcade isnt available in China, Hong Kong, or Macao. Business strategy encoded in TypeScript arrays. Someone updates these manually presumably.

## What this tells us

Apple's production code is... normal. Messy in places. Brilliant in others. TODOs from god knows when. Workarounds for their own browser's bugs. A folder named wrong that nobodys fixed.

The myth that big tech companies have pristine codebases is exactly that - a myth. They have the same problems we do, just at scale. The code works. It handles millions of users. It makes billions of dollars. And it has comments that say "What is this for??" just like yours.

The source map mistake is embarrassing but not catastrophic. No credentials leaked, no private APIs exposed, just the frontend code. Apple probably fixed the source map config within hours of this going public.

Still, good reminder to check your own production builds. Source maps should be disabled or stored somewhere private. Most bundlers do this by default now but if youve got a custom setup, double check.

---

## References

- [Leaked Apple Store Repository](https://github.com/rxliuli/apps.apple.com) - rxliuli
- [Official Apple Store](https://apps.apple.com)
- [What are Source Maps?](https://web.dev/articles/source-maps) - web.dev
- [Sentry SDK](https://sentry.io/)
- [Floating UI](https://floating-ui.com/)
- The folder thats still in ALL CAPS
