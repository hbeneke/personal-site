---
title: "Clawdbot's Security Crisis: What Went Wrong"
publishDate: "2026-02-04T10:00:00.000Z"
slug: "clawdbot-moltbot-openclaw-security-analysis"
description: "A breakdown of how Clawdbot became the fastest-growing GitHub project ever, the trademark drama with Anthropic, and the security vulnerabilities that turned it into a cautionary tale about AI agent development."
tags: ["ai", "security", "open-source", "clawdbot", "openclaw", "anthropic", "vulnerabilities", "analysis"]
featured: true
draft: false
readTime: 12
---

## What Happened

Holy shit, what a two weeks this has been. An open source project called Clawdbot went from obscurity to 82,000 GitHub stars, got hit with a trademark complaint from Anthropic, accidentally enabled a $16 million crypto scam, and became the subject of multiple security advisories. I couldn't make this up if I tried.

[Peter Steinberger](https://steipete.com/), the creator, is an Austrian developer who previously built PSPDFKit. After selling that company he got into what people are calling "vibe coding" - using AI agents to write code while he focuses on higher-level decisions. His X bio says "Came back from retirement to mess with AI."

The problem he wanted to solve was simple: AI coding agents like Claude Code sometimes stall waiting for input, and he wanted to monitor them from his phone. Classic "nobody built what I need so I'll build it myself" energy. When no one else made this by November 2025, he did it himself. The initial version just connected WhatsApp to Claude. Sounds innocent enough, right?

## How Clawdbot Works

Clawdbot is a local AI assistant you control through messaging apps - WhatsApp, Telegram, iMessage. Unlike cloud assistants, everything runs on your machine. You text it commands like "check my calendar" or "respond to that email from John" and it executes them through whatever LLM you configure.

The privacy angle is genuinely interesting. No corporate servers storing your conversations. No data being harvested for ads. Your AI assistant lives on hardware you control. I actually like this idea a lot.

The problem is what "runs on your machine" actually means in practice. Spoiler: it's not great.

## The Anthropic Trademark Situation

Peter named his project after a space lobster character called "Clawd." On January 27th, Anthropic's legal team sent a trademark request - the name was too similar to Claude. Peter agreed to rebrand rather than fight it.

He chose "Moltbot" (lobsters molt when they grow) and started renaming his accounts. During the seconds between releasing the old username and claiming the new one, crypto scammers grabbed his handles. They had been watching and waiting.

Within hours, fake $CLAWD tokens launched on Solana. Market cap hit $16 million before crashing. People lost money. Sixteen million dollars! Peter spent his rebrand day tweeting "Any project that lists me as coin owner is a SCAM" while scammers profited. What a nightmare. Crypto bros ruin everything, as usual.

DHH called Anthropic's trademark move "customer hostile" since Clawdbot was driving significant Claude API usage. The project eventually settled on "OpenClaw" as its permanent name.

I dont have strong feelings about the trademark dispute itself. Companies protect their trademarks or they lose them. But the timing created an opening that bad actors exploited immediately. Thats worth noting for anyone planning a public rebrand.

## The Security Problems

Okay, this is where I started losing my mind. Buckle up.

### Plaintext Credential Storage

Clawdbot stores sensitive data in `~/.clawdbot/` as plaintext JSON and Markdown files. API tokens, VPN credentials, conversation history spanning months - all readable by any process running under your user account.

```
~/.clawdbot/
├── config.json          # API keys in plaintext
├── memory/
│   ├── conversations.md # months of chat history
│   └── secrets.json     # credentials you've mentioned
└── skills/
    └── ...              # third-party plugins with full access
```

This isn't unusual for developer tools honestly - most of us have credentials sitting in plaintext somewhere we'd rather not admit. But Clawdbot specifically handles sensitive operations. When your tool's whole job is "control my computer via WhatsApp," maybe don't store secrets like it's 2003.

### Exposed Control Panels

Security researcher [Jamieson O'Reilly](https://dvuln.com/) from Dvuln found hundreds of Clawdbot instances exposed to the public internet. 8 had completely open ports with no authentication. 47 more had authentication but were still publicly accessible.

The exposed instances contained private messages, credentials, and API keys. Just... sitting there. On the public internet. [Hudson Rock](https://www.hudsonrock.com/) researchers confirmed that infostealer malware families (RedLine, Lumma, Vidar) added Clawdbot directories to their target lists within 48 hours of the project going viral. The malware authors moved faster than some people update their npm packages. Depressing.

### CVE-2026-25253

Security researcher Mav Levin discovered a critical vulnerability with a CVSS score of 8.8. The attack chain:

1. OpenClaw's Control UI accepts a `gatewayUrl` parameter from the query string without validation
2. It auto-connects on page load, sending the gateway token via WebSocket
3. An attacker hosts a malicious page that steals the token and establishes unauthorized WebSocket connections
4. The server accepts requests regardless of origin header

With a stolen token that has `operator.admin` scope, an attacker can disable user confirmations, escape container sandboxes, and execute arbitrary commands on the host system. Game over. Your machine belongs to someone else now.

```javascript
// simplified attack flow
const ws = new WebSocket('ws://localhost:8080/gateway');
ws.onopen = () => {
  ws.send(JSON.stringify({
    token: stolenToken,
    command: 'exec.approvals.set',
    value: 'off'
  }));
  ws.send(JSON.stringify({
    command: 'tools.exec.host',
    value: 'gateway'
  }));
  // attacker now has host-level command execution
};
```

This was patched in version 2026.1.29.

### Supply Chain Risk

O'Reilly also demonstrated a supply chain attack on ClawdHub, the registry for Clawdbot plugins. He uploaded a proof-of-concept malicious package, artificially inflated its download count to 4,000+, and tracked installations across 7 countries. Seven countries! The registry has no code review process. Plugins inherit full Clawdbot privileges. It's npm but somehow worse.

## The Numbers

[Noma Security](https://noma.security/) published research showing 53% of enterprise customers granted Clawdbot privileged access over the weekend of January 24-27. Three days for over half of enterprise users to deploy an AI agent with system-level access.

Their analysis identified five vulnerability categories:
- Control plane exposure through misconfigured proxies
- Unrestricted command acceptance from external messaging platforms
- Sandbox configurations with overly permissive defaults
- Plaintext credential storage
- Unvetted community plugins with inherited privileges

When run as root - which the research describes as a "common misconfiguration" (who the hell runs things as root in 2026?!) - Clawdbot has complete system control.

## The Development Philosophy Question

Okay, here's where I have opinions. Strong ones.

In a [Pragmatic Engineer interview](https://newsletter.pragmaticengineer.com/p/the-creator-of-clawd-i-ship-code), Steinberger said "I ship code I don't read." His workflow focuses on prompts and high-level architecture while AI handles implementation details. He advocates for "closing the loop" - letting AI verify its own work through tests and linting.

This approach works for plenty of projects. CRUD apps, internal tools, prototypes - sure, vibe away. But Clawdbot operates with full user privileges, handles credentials, and accepts commands from external messaging platforms. The attack surface is massive. You can't "vibe" your way through security-sensitive code. Someone has to actually read it.

Look, I'm not trying to pile on Steinberger. He built something people clearly wanted - 82,000 stars dont happen by accident. The guy sold a successful company and came back because he was bored. I respect that. And the vulnerabilities discovered are the kind that emerge when projects scale way faster than anyone anticipated. But man, "I ship code I don't read" is a hell of a philosophy when that code can execute arbitrary commands on someone's machine.

## What Security Researchers Recommend

If you're running OpenClaw:

1. Update to version 2026.1.29 or later
2. Bind the control plane to localhost only
3. Enable authentication
4. Run in a container or VM with minimal privileges
5. Audit community plugins before installation
6. Consider whether you actually need an AI agent with this level of system access

[Heather Adkins](https://cloud.google.com/security) from Google Cloud's security team offered simpler advice: "Don't run Clawdbot." Ouch. But fair.

Cisco's security team described it as a potential "security nightmare." Palo Alto Networks called it a preview of "the next AI security crisis." When enterprise security vendors agree on something, you know it's bad.

## Looking Forward

Here's the thing - the underlying concept actually has merit. Local AI assistants that dont ship your data to corporate servers could be genuinely better for privacy. I want this future! I just don't want it to come with free remote code execution for anyone who finds my IP address.

The Clawdbot situation is probably a preview of whats coming as more AI agents get deployed with system-level access. We're going to see a lot more of these. The gap between "cool demo on Twitter" and "production-ready security model" is massive, and most users cant tell the difference until it's too late.

For now, the 82,000 GitHub stars represent enthusiasm, not a security audit. Those really, really arent the same thing. Ask me how I know.

---

## References

- [The Register: Clawdbot becomes Moltbot](https://www.theregister.com/2026/01/27/clawdbot_moltbot_security_concerns/)
- [The Hacker News: OpenClaw RCE Vulnerability](https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html)
- [InfoStealers: ClawdBot as Infostealer Target](https://www.infostealers.com/article/clawdbot-the-new-primary-target-for-infostealers-in-the-ai-era/)
- [Noma Security: Enterprise Adoption Research](https://noma.security/blog/customers-gave-clawdbot-privileged-access-and-noone-asked-permission/)
- [Pragmatic Engineer: Steinberger Interview](https://newsletter.pragmaticengineer.com/p/the-creator-of-clawd-i-ship-code)
- [DEV Community: Timeline of Events](https://dev.to/sivarampg/from-clawdbot-to-moltbot-how-a-cd-crypto-scammers-and-10-seconds-of-chaos-took-down-the-4eck)
- [SecurityWeek: OpenClaw Hijacking Vulnerability](https://www.securityweek.com/vulnerability-allows-hackers-to-hijack-openclaw-ai-assistant/)
