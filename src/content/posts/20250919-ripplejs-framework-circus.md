---
title: "RippleJS: Yet Another Framework in the Frontend Circus"
publishDate: "2025-09-19T14:00:00.000Z"
slug: "ripplejs-another-framework-frontend-circus"
description: "An ironic and critical reflection on the arrival of RippleJS and the endless proliferation of JavaScript frameworks that's fragmenting our industry"
tags: ["frontend", "frameworks", "javascript", "typescript", "ripplejs", "web development", "opinion", "criticism"]
featured: true
draft: false
readTime: 10
---

## The Never-Ending Framework Factory

Yesterday, I was just browsing online when I came across something that's becoming way too familiar - and honestly, it's kind of frustrating. No, it's not just another JavaScript framework popping up (that would be too obvious). **It's worse: a brand new JavaScript framework that's already taking off!**

[RippleJS](https://github.com/trueadm/ripple), and it's already got over 5,000 stars on GitHub. More than 100 people have forked the repository, and issues and pull requests are starting to stack up.

**Another framework... I think it's time for a real talk about this.**

It feels like every few months, without fail, someone comes along with their new project that's supposed to solve all our programming problems. First we had Angular, then React came along because Angular wasn't enough. Then Vue showed up because React wasn't enough. Then Svelte entered the picture because Vue wasn't enough. The cycle just keeps going and going, and every couple of years we frontend developers have to completely reinvent ourselves just to stay relevant in the job market.

Now [Ripple](https://www.ripplejs.com/) has joined this already crowded space, promising - you guessed it - to completely change how we think about frontend development.

## The Irony of a Framework Veteran Building Yet Another Framework

Here's where things get really ironic. Ripple was created by Dominic Gannaway ([@trueadm](https://github.com/trueadm)), and his background reads like a history book of modern JavaScript frameworks. **This isn't some random developer working on a weekend project.** Gannaway was actually part of the React core team, where he worked on React Hooks. He created Lexical, which is Meta's extensible text editor framework. He was involved with Inferno from the very beginning. Most recently, he was working as a core maintainer of Svelte 5 at Vercel, dealing with its new compiler and signal-based reactivity stuff.

What do you think someone with his background does when they have free time?

**They build another framework, of course!** The craziest part? **He built Ripple in under a week.** He calls it a love letter to frontend web development, but honestly, **it feels more like a breakup letter to all the frameworks he's worked on before.**

Even though Ripple is still in alpha and clearly needs a lot more work before it's ready, it's already getting pretty popular. It's built with TypeScript first, uses its own .ripple file extension, and tries to combine the best parts of React, Solid, and Svelte. It's kind of funny when you think about it - someone who helped create the frameworks we're all using now decided the answer is... yet another framework.

```javascript
export default component App() {
  <div class="container">
    let $count = 0;

    <button onClick={() => $count++}>{$count}</button>

    if ($count > 1) {
      <div>{"Greater than 1!"}</div>
    }
  </div>

  <style>
    button {
      padding: 1rem;
      font-size: 1rem;
      cursor: pointer;
    }
  </style>
}
```

The syntax makes adding reactivity super easy with inferred declarations using the $ prefix. Sound familiar, Svelte folks? It's clever, I'll admit that. **But being clever isn't the issue - the real problem is we have way too many clever solutions from way too many smart people.**

What's really interesting is that Gannaway is totally upfront about Ripple being very raw. He says it's full of bugs, has TODOs everywhere, and straight up tells people not to use it in production. He even suggests that maybe some of these ideas could be shared and brought into other frameworks.

## The Real Cost of Framework Fatigue

This constant stream of new frameworks isn't just annoying - it's actually bad for our industry. It reminds me of how Linux has hundreds of different distributions. Imagine if all that amazing talent decided to work together on just one distribution. Look at Gannaway - he's worked on Inferno, React, Svelte, and now Ripple. What if all that effort went into making just one framework really, really good instead of being scattered across four different projects?

New developers get paralyzed by all the choices. When you're starting out, there are so many options that it's overwhelming as hell. Instead of learning the basics, people waste time reading endless articles comparing frameworks and arguing online about which one's better. Here's the thing: learning a specific framework isn't what matters most. What really counts is understanding the fundamental concepts behind web development, not getting caught up in internet debates about why one framework is better than another.

The job market has become really fragmented too. Companies are looking for "React developers" or "Vue specialists" instead of skilled frontend engineers who actually understand how things work underneath. Don't get me wrong - Ripple actually looks pretty promising, and Gannaway clearly knows what he's doing. But there will always be another big name coming along trying to claim its spot.

That's why you see so many websites online today that could be simple static sites, but instead they load heavy frameworks like Angular just to display something basic like a cooking recipe. Companies that jump on every new framework end up with code written in five different technologies, each needing special knowledge and maintenance.

**No wonder other people in web development get so frustrated with us.**

## Where Does This End?

This cycle seems like it will never stop. HTML5, CSS3, and ECMAScript keep getting updates constantly. While any change on the web needs all browsers to slowly add support, these technologies are like an unstoppable train. **It never stops - there's always new stuff to learn and new things to figure out.**

Don't get me wrong - innovation is important. But sometimes it feels like we're just adding more options without actually making things better. Everyone wants to be different and do their own thing, which I get. It's how you make a name for yourself. But when do too many choices become a problem? When does innovation start splitting things apart instead of building them up?

Learning new frameworks every few years is exhausting. You finally get good at something, and then it's time to start over. Being a frontend developer means accepting that half of what you know will be outdated before you're even comfortable with it. Each new framework promises to fix the problems of the last one, but they often just create different issues while splitting the community even more. We're not building on solid ground anymore. We're constantly tearing everything down and rebuilding from scratch.

Maybe AI should build its own framework so it can experience the same frustration we do. At least then we'd have coworkers who truly get what we're going through.

## The Bottom Line

Here's the thing. RippleJS might actually be amazing. It could genuinely combine the best parts of React, Solid, and Svelte like its creator says. But that's not the real issue here. We need to stop constantly reinventing the wheel and focus on what actually matters. Building reliable applications that work well for our users.

Backend developers figured this out a long time ago. They have stable, mature tools that evolve gradually. Python has Django and Flask. Java has Spring. Ruby has Rails. They get better over time without making you rewrite everything every few years. Meanwhile, we're still arguing about React vs Vue vs Svelte vs now Ripple.

The most telling part? Even experienced framework developers who've seen it all still feel the need to create something new. If even they can't help themselves, what hope do the rest of us have?

Until we break this cycle, we'll keep going in circles, learning new frameworks every few years, splitting our industry into smaller pieces, and wondering why no one takes frontend development seriously.

So here comes another one called [Ripple](https://github.com/trueadm/ripple). Pull up a chair and get comfortable, because you know how this goes. Who knows, maybe this one will actually stick around longer than the others.
