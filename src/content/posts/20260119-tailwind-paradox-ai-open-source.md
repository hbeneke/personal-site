---
title: "The Tailwind Paradox: When AI Success Becomes Open Source's Death Sentence"
publishDate: "2026-01-19T10:00:00.000Z"
slug: "tailwind-paradox-ai-open-source-sustainability"
description: "Tailwind CSS is more popular than ever, yet 75% of its engineering team just lost their jobs. Revenue is down 80%, documentation traffic has plummeted, and AI is the elephant in the room. A critical look at what this means for open source sustainability."
tags: ["tailwind", "ai", "open-source", "frontend", "opinion", "criticism", "web development"]
featured: true
draft: false
readTime: 12
---

## The Most Popular Framework Nobody's Paying For

Tailwind CSS is at the peak of its popularity. Millions of developers. Companies like Shopify, Reddit, NASA. V4 just launched. Everyone loves it.

75% of the engineering team just got laid off.

[Adam Wathan](https://twitter.com/adamwathan), the creator, had to let go of three out of four engineers. Revenue down 80%. Documentation traffic dropped 40% since early 2023. The company behind one of the most influential CSS tools in modern web development is fighting to survive.

The culprit is obvious and nobody wants to say it out loud: AI learned Tailwind so well that humans dont need to visit the docs anymore.

## The GitHub PR That Started Everything

This whole mess came out because of a pull request. Someone submitted a PR to add `llms.txt` support to Tailwind's docs - basically a file that helps AI models understand and use the framework better. Seems like a nice community contribution.

Adam's response surprised everyone. Paraphrasing: "I have bigger problems right now, like figuring out how to pay people."

His logic was brutal but honest. AI reads docs directly = fewer humans visit the site = fewer people discover Tailwind Plus (their paid stuff) = less money = layoffs. The PR got locked because comments were "spiraling."

I get why people were upset. From the outside it looks like Adam was being hostile to a helpful contribution. But from his perspective, he was being asked to actively help the thing thats killing his business. Thats a weird position to be in.

## How Being Good Becomes a Problem

Heres the absurd part. Tailwind is more popular than ever. More installs, more usage, more developers. By any normal metric, its a massive success.

But the AI tools that recommend Tailwind learned everything from the documentation. They can write Tailwind code without anyone visiting the site. They can reproduce patterns from Tailwind Plus without anyone paying for it. The cleaner and more learnable your framework is, the better it works as training data for models that will eventually make your business irrelevant.

Adam talked about this on his podcast (its called "Adam's Morning Walk" and yes its 33 minutes of him walking and having an existential crisis, very relatable). He said they saw revenue declining but did what founders always do - ignored the numbers and hoped it would turn around. By the time they actually looked, they had maybe 6 months of runway left.

I've done this. Most people have done this. You see a number going the wrong direction and you convince yourself its temporary. Then suddenly its not.

## The Cavalry Shows Up Late

After the news broke, companies started sponsoring. Vercel stepped up. Google AI Studio. Cursor, Polar, others. The sponsors page got busy.

Which is great. But also: where were they six months ago? A year ago?

Vercel's V0 generates Tailwind code constantly. Cursor recommends it all the time. These companies have been making money partly because Tailwind exists and is good. They benefited for years and only showed up when there was a public crisis.

Im not trying to be cynical here. Sponsoring now is better than not sponsoring. But the timing says something about how the industry treats open source - as an infinite free resource until someone publicly announces theyre drowning.

Theres speculation Vercel might just acquire Tailwind. They did it with Rich Harris and Svelte. Would make sense. Whether thats good long-term, I dont know.

## This Isnt Just Tailwind

[Christopher Chedeau](https://twitter.com/vjeux) (vjeux), who created React Native, Prettier, and Excalidraw, said hes had similar problems with Prettier. Used by basically every JavaScript developer on earth, consistently struggles to fund maintenance. For Excalidraw he went the SaaS route and that works better.

The old open source monetization playbook is dying. Consulting? AI answers most questions now. Templates and UI kits? Claude generates passable alternatives. Training courses? Why pay when you can ask an AI to explain things?

The AI companies that benefit most from open source training data are the same ones destroying the business models that funded those projects. Its not malicious, just... how things work now.

## What I Actually Think

Three engineers lost their jobs. That sucks. I dont have a clever way to frame it.

But I also think we cant stop technology because it makes existing business models uncomfortable. Open source has always had this tension - you give away the core product hoping people pay for something adjacent. Sometimes that works, sometimes it doesnt. AI accelerated the contradictions that were already there.

The world doesnt owe anyone a business model. If AI does something better, people use AI. Thats not cruelty, thats just how adoption works. I use AI tools constantly. So do you probably. Were all part of this.

The question isnt whether to slow down AI (we shouldnt and we wont). The question is what comes next. How do you fund the next Tailwind? The next tool that changes how we build things?

I dont have the answer. I dont think anyone does yet.

## Ideas People Are Throwing Around

Some people are proposing an "AI Content Protocol" that lets projects monetize AI consumption. Others want legal requirements for AI companies to pay licensing fees for training data. The "MIT license doesnt cover AI training" argument is getting traction in legal circles.

These might work. They might not. Were in the messy middle of a big transition and nobody knows what the other side looks like.

What I do know: yelling at Adam Wathan on GitHub isnt helping. Neither is expecting maintainers to keep working for free while billion-dollar companies profit. We need actual systemic solutions, not moral posturing.

If you use Tailwind - or any open source project - consider sponsoring. Their book "Refactoring UI" is genuinely good and will make you better at design. Tailwind Plus exists. Support the ecosystem that supports you.

Because if we dont figure this out, there might not be a Tailwind V5. Or a next big thing. And that would suck for everyone, including the AI companies that need this stuff to exist.

## The Bigger Picture

Were watching open source economics get rewritten in real time. Tailwind is just the obvious example. Prettier is struggling quietly. How many other projects are dying while we assume everythings fine?

The old deal was: maintainers give time, companies give some money, everyone benefits. AI broke that by removing the human-in-the-loop that made monetization possible.

Some developers are responding by going closed-source. Cant blame them. When your open contributions become training data that competes with your ability to make a living, the incentives get weird.

I dont have all the answers. But I do know the solution isnt being hostile to people trying to keep projects alive. Adam built something millions of people use. The economics shifted and thats not his fault. Its a structural problem we all need to figure out.

So yeah. Tailwinds situation is sad. Its also a warning. How we respond will shape open source for a long time.

---

## References

- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Plus](https://tailwindcss.com/plus) - the paid product
- [The GitHub PR that started the conversation](https://github.com/tailwindlabs/tailwindcss.com/pulls?q=is%3Apr+llm)
- [Adam's Morning Walk podcast](https://adamwathan.me/) - the existential crisis episode
- [Refactoring UI](https://www.refactoringui.com/) - actually a good book
- [Tailwind GitHub Sponsors](https://github.com/sponsors/tailwindlabs)
- [vjeux on Twitter](https://twitter.com/Vjeux) - his comments on Prettier
