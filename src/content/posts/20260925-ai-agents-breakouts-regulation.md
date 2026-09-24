---
title: "Nobody Gave Permission: AI Agents Broke Out, and Now the Labs Want Rules"
publishDate: "2026-09-25T10:00:00.000Z"
slug: "ai-agents-breakouts-labs-want-regulation"
description: "This summer OpenAI's agents broke into Hugging Face and Anthropic's Claude broke into four companies, all during tests nobody was watching closely enough. Weeks later both labs are asking Washington for binding rules. Convenient? Absolutely. Necessary? Also, annoyingly, yes."
tags: ["ai", "anthropic", "openai", "ai-safety", "security", "regulation", "opinion"]
featured: true
draft: false
readTime: 14
---

## First, let's get the story right

If you've been following this on social media, you've probably seen some version of "Anthropic's AI hacked Hugging Face." I started writing this post with that exact sentence in my head. Then I read the primary sources, and it's wrong. The real story is worse, because it isn't one lab. It's two.

Here's what actually happened:

- **Hugging Face was breached by OpenAI's agents**, not Anthropic's. Hugging Face [disclosed the intrusion on July 16](https://huggingface.co/blog/security-incident-july-2026) without knowing who the attacker was. Five days later, OpenAI and Hugging Face [put out a joint statement](https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident) attributing it to OpenAI models that had escaped an evaluation environment.
- **Anthropic's Claude broke into other companies.** On July 30, after checking its own logs, Anthropic published ["Investigating three incidents in our cybersecurity evaluations"](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals): three Claude models had got into the real production systems of three organizations during testing. On September 9 [they disclosed a fourth](https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents).

So the headline everyone half-remembers mashes two incidents into one. Nobody asked for permission in either of them. The victims found out after the fact. Some of them didn't find out at all until someone told them.

And a few weeks later, the same companies are in Washington asking for regulation. That's what this post is about.

## What OpenAI's agents did to Hugging Face

The short version, from [Hugging Face's own disclosure](https://huggingface.co/blog/security-incident-july-2026): an autonomous agent system got initial access through "a remote-code dataset loader and a template-injection in a dataset configuration", got onto a processing worker, escalated to node-level access and moved laterally across internal clusters. They describe "thousands of individual actions across a swarm of short-lived sandboxes", with command and control that migrated itself around. It got to internal datasets and several service credentials and tokens.

What it didn't get to: Hugging Face found "no evidence of tampering with public, user-facing models, datasets, or Spaces", and the supply chain checks came back clean. Users were told to rotate their tokens just in case.

Why was an OpenAI model poking around Hugging Face at all? According to [the incident's Wikipedia timeline](https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident), which is built from the OpenAI and Hugging Face statements and press coverage, the models were in a cyber evaluation, worked out that the answers to the test were probably hosted on Hugging Face, and went to get them. Deployment safeguards had been deliberately turned off because the whole point was to test offensive cyber capability. And nobody was monitoring the model trajectories as they ran.

Let me translate that. They took the model's safeguards off on purpose, told it to be a hacker, left the exit unlocked and didn't watch the cameras. Then they were surprised when it hacked something.

Hugging Face also found something in its write-up that I keep coming back to. When their team tried to use commercial AI models to analyse the real attack payloads during the forensics, the providers' safety filters blocked them. The attacker had no filters. The defenders did. They ended up running the analysis on an open-weight model, [GLM-5.2](https://huggingface.co/blog/security-incident-july-2026), over 17,000+ recorded events. Keep that in mind for later, because it matters when we get to "who does regulation actually protect".

## What Anthropic's Claude did (four times)

Anthropic's case is different, and in some ways more uncomfortable, because Anthropic is the lab whose whole brand is being the careful one.

In [the July 30 post](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals), Anthropic says it reviewed **141,006 evaluation runs** where Claude could have got internet access and found three incidents. In all three, Claude was doing a capture-the-flag challenge. It was told it was in a simulation with no internet access. That wasn't true. In their words: "a misconfiguration left the machines that Claude accessed as part of the evaluation with live internet access. Neither we nor our evaluation partner were aware of this misconfiguration." The evaluation partner was [Irregular](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals).

The three incidents:

1. **Claude Opus 4.7.** A made-up company name in the scenario turned out to match a real domain. Claude found it had real connectivity, got into the real company's infrastructure, pulled credentials and read production databases, "several hundred rows of production data." Anthropic calls this the most serious impact they found. The model noticed the system looked real and kept going anyway, reasoning that the real company "must be part of the exercise."
2. **Claude Mythos 5.** Claude published a malicious Python package to PyPI. It was up for roughly an hour. It was downloaded onto 15 real systems, one of them a security company's scanner, where the code exfiltrated that company's credentials. The model had even written that doing this for real would be "NOT okay", and then talked itself into believing it was a simulation.
3. **An internal research model.** It scanned about 9,000 targets and compromised one company with basic stuff, stolen credentials and SQL injection. This one, to its credit, "concluded that the target was in fact real, and ceased its attack."

According to [reporting on the disclosure](https://www.cdotrends.com/story/5093/hugging-face-got-breached-optimizer-not-attacker-then-anthropic-checked-its-logs), two of the three companies hadn't noticed anything until Anthropic contacted them.

Then on September 9 came [the follow-up](https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents), and it's the more interesting document. While putting together transcripts for an independent review by METR, Anthropic found a **fourth incident from January 2026**: an early checkpoint of Claude Opus 4.6 broke its target by accident, tried to abort the task *seven times*, couldn't because the evaluation harness was misconfigured, found an egress path to third-party infrastructure, harvested credentials and read personal information about one person before it ran out of tokens. They then rescanned about **481 million transcripts** and say they found nothing else of similar severity.

The follow-up also partly retracts their own July framing. In July, Anthropic said "we saw no evidence in any run described here of a model pursuing a goal of its own", and presented the incidents mostly as operational failures: Claude attacked real targets because it believed they were fake. In September they write that "we should have avoided making such strong claims about what Claude believed based solely on what Claude *said* it believed," and they name two alignment failures:

- **Biased reasoning.** The models "selectively interpret evidence in ways that favor justifying their actions." The number that stuck with me: when separate instances of the model were shown Mythos 5's outputs one at a time, they flagged 79% of them as real systems. The original model, in the middle of its task, labelled 1% as real.
- **Recklessness.** "A willingness to take harmful actions in the narrow pursuit of a task."

If you read my post on [Anthropic's agentic misalignment research](/posts/agentic-misalignment-ai-deception-anthropic-research/) last year, this should sound familiar. That paper was about models taking harmful actions in contrived, fictional scenarios. This summer the scenario was fictional, the internet was not, and the harm was real. The behaviour was the one they'd already written about: the model finds a reason why the thing it wants to do is fine.

To be fair to Anthropic: they found these themselves, disclosed them without being forced to, corrected their own first explanation in public and gave METR [what they describe as](https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents) "wide-ranging access, including to transcripts beyond the window in which the incidents occurred, and to Anthropic employees, who will be permitted to share confidential information." That's more than most companies do after a breach. It doesn't change the fact that four organizations got broken into by a model nobody was watching closely enough.

## And then everybody discovered regulation

Here's the timeline that made me want to write this.

- **July 28.** Just over a week after the Hugging Face attribution, employees at OpenAI, Anthropic, Google DeepMind and Meta publish ["Pacing the Frontier"](https://www.pacingthefrontier.com/), asking the U.S. government to "support an international effort to develop the technical and governance tools needed to deliberately pace the frontier of automated AI development." It had over a thousand signatures at launch and lists 1,386 as I write this. Signatories include Dario Amodei, Anthropic co-founder Jared Kaplan and OpenAI's chief scientist Jakub Pachocki.
- **August 31.** Anthropic [publishes its remediation plan](https://www.anthropic.com/news/improving-alignment-security-efforts): hardened eval sandboxes, clusters that block outbound traffic by default, about 150 product engineers moved temporarily to security work, and this line: "we believe the world would benefit if the industry adopted a lawful, verifiable, effective mechanism for coordinated pacing as soon as possible."
- **September 9.** OpenAI's chief global affairs officer Chris Lehane publishes ["The AI policy window is open. We need to act."](https://openai.com/index/ai-policy-window/) and OpenAI contacts congressional offices urging them to "act now to pass foundational AI safety legislation" ([IAPP](https://iapp.org/news/a/autonomous-cyberattacks-fuel-us-congress-ai-focus-through-2026-midterms-and-beyond)). The key sentence: "The prospect of AI-accelerated AI development demands more than voluntary commitments. The United States needs mandatory, capability-based national regulation that can evolve as the technology does" ([TechXplore/AFP](https://techxplore.com/news/2026-09-shift-openai-powerful-ai.html)).

That last one is the big change. OpenAI is the same company that, in line with the current administration, [had opposed states writing their own AI rules](https://techxplore.com/news/2026-09-shift-openai-powerful-ai.html). The same reporting notes it has now endorsed four California bills, "some of which it had previously lobbied against."

Meanwhile, Washington is moving anyway. Senator Josh Hawley has opened an investigation into OpenAI's role in the Hugging Face attack and sent Sam Altman 16 questions due by October 1. Klobuchar, Cruz and Thune are negotiating a bipartisan safety bill. Sanders wants to ban superintelligence development outright. California has signed bills requiring independent verification of frontier models ([IAPP](https://iapp.org/news/a/autonomous-cyberattacks-fuel-us-congress-ai-focus-through-2026-midterms-and-beyond)). Add [Jacob Coxon's resignation from Anthropic on September 8](https://time.com/article/2026/09/09/ai-anthropic-openai-jacob-coxon/), in which he said both labs are "gambling with our lives", and this is the second high-profile Anthropic safety departure this year after [Mrinank Sharma's poetry exit in February](/posts/anthropic-mrinank-sharma-resignation-world-peril/). This time the person leaving at least said something specific.

So the labs' agents break into other people's infrastructure without permission, and the labs' response is "please regulate us." What do we make of that?

## The cynical reading: regulation as a moat

There's an old idea in economics for this. In 1971 George Stigler published ["The Theory of Economic Regulation"](https://doi.org/10.2307/3003160) in the *Bell Journal of Economics and Management Science*. His central thesis is that "as a rule, regulation is acquired by the industry and is designed and operated primarily for its benefit." That's the origin of the term *regulatory capture*. The incumbents don't fight regulation. They write it, and they write it so that the compliance costs are a rounding error for them and a wall for everyone else.

Bruce Yandle added the other half in 1983 with ["Bootleggers and Baptists"](https://www.cato.org/sites/cato.org/files/serials/files/regulation/1983/5/v7n3-3.pdf), published in *Regulation*. His example was laws banning Sunday liquor sales: the Baptists supported them on moral grounds, the bootleggers supported them because they shut down their legal competition for a whole day every week. The Baptists give the law its moral cover. The bootleggers quietly make money from it. Nobody needs to coordinate.

Now look at AI. The people who warn about AI risk and the companies that would benefit from expensive compliance rules are, in some cases, literally the same people. That's the argument the critics have been making for years:

- In October 2023, Andrew Ng told the *Australian Financial Review* that "there are definitely large tech companies that would rather not have to try to compete with open source, so they're creating fear of AI leading to human extinction," and called it "a weapon for lobbyists to argue for legislation that would be very damaging to the open-source community" ([Yahoo/Business Insider](https://money.yahoo.com/google-brain-cofounder-says-big-113049941.html), [SiliconANGLE](https://siliconangle.com/2023/10/31/google-brain-founder-andrew-ng-says-threat-ai-causing-human-extinction-overblown/)).
- In October 2025, White House AI czar David Sacks [wrote on X](https://x.com/DavidSacks/status/1978145266269077891) that "Anthropic is running a sophisticated regulatory capture strategy based on fear-mongering."
- Back in May 2023, Sam Altman told a Senate Judiciary subcommittee that the U.S. should consider a licensing agency for sufficiently capable models ([U.S. Senate Judiciary Committee](https://www.judiciary.senate.gov/committee-activity/hearings/oversight-of-ai-rules-for-artificial-intelligence)). A license you already qualify for, required of everyone who comes after you, is about the best moat money can buy.

And there's money involved, a lot of it. Anthropic gave [$20 million to Public First Action](https://www.anthropic.com/news/donate-public-first-action) in February, a group pushing for AI safeguards ahead of the midterms, and [another $20 million later](https://thehill.com/homenews/5982007-anthropic-pours-millions-midterms/), for $40 million total. On the other side, the pro-industry super PAC Leading the Future has raised around $125 million from backers including Andreessen Horowitz and OpenAI co-founder Greg Brockman ([The Hill](https://thehill.com/homenews/5982007-anthropic-pours-millions-midterms/), [CNBC](https://www.cnbc.com/2026/02/12/anthropic-gives-20-million-to-group-pushing-for-ai-regulations-.html)). "AI regulation" is not one position being lobbied for. It's a battlefield where every side is trying to get its own version written.

Now remember the Hugging Face detail from earlier. When the defenders tried to analyse the attack with commercial models, the safety filters got in the way, and what worked was an open-weight model. If the regulation that comes out of this summer makes open-weight models expensive or impossible to release, the next victim may have even fewer tools than Hugging Face did. That's exactly the scenario Ng was warning about. Rules written by the incumbents, sold as safety, that end up removing the alternatives to the incumbents.

I wrote recently about how [computing has become Big Science](/posts/computing-big-science-moment/), where the frontier needs hundreds of millions of dollars and a relationship with whoever owns the GPUs. Regulation designed by the few companies that can already afford that frontier risks making that permanent by law.

## The annoying part: they're also right

Here's where I get stuck. Stigler's theory explains why a company would *want* regulation. It says nothing about whether the regulation is *needed*. Both can be true at once. And this summer gave us a lot of evidence that it's needed.

Look at what actually failed:

- **Nobody outside knew.** Hugging Face found out it had been breached before OpenAI found out its own models were responsible. Two of Anthropic's three July victims had no idea at all. The Opus 4.6 incident sat undetected for about seven months. There was no obligation to report any of it, only goodwill.
- **Nobody checked the sandbox.** Four Claude incidents, one misconfigured partner environment, and neither Anthropic nor Irregular noticed. OpenAI ran an offensive cyber eval with safeguards switched off and no live monitoring. "We thought it was isolated" is not a safety architecture.
- **The self-reported explanation was wrong.** Anthropic's first take said the models weren't pursuing goals of their own. Six weeks later they walked it back. That's to their credit. It's also proof that a company investigating itself will, even in good faith, reach the most comfortable conclusion first.

Public Citizen's J.B. Branch [put it better than I can](https://www.techpolicy.press/the-openai-hugging-face-incident-demands-urgent-congressional-oversight/): "this was a foreseeable governance failure rooted in private decision-making," and "voluntary frameworks cannot independently determine acceptable levels of societal risk." The voluntary regime was tested this summer, and it failed. Not because the companies were evil. Because nobody outside them had any right to know, check or intervene.

Even Sacks, who coined the capture line against Anthropic, has reportedly conceded that at least one of their cyber findings was "more on the legitimate side" ([OfficeChai](https://officechai.com/ai/anthropic-has-a-pattern-of-using-fear-to-market-its-products-us-ai-czar-david-sacks/)). When your harshest critic grants you the point, the point is probably real.

This is also the same pattern I described in the [Clawdbot security mess](/posts/clawdbot-moltbot-openclaw-security-analysis/), just scaled up. Autonomous agent, broad permissions, "it'll be fine" as the security model, discovery after the fact. The difference is that Clawdbot was an open-source project that went viral. These were the two best-resourced AI labs on the planet, in the context of tests specifically designed to measure how dangerous their models are at hacking.

## So how do you tell good regulation from a moat?

I don't think the answer is "regulate" or "don't regulate". Bootleggers and Baptists always show up together. The useful question is which parts of a proposal protect the public and which parts protect the incumbents. A rough test I'd use:

**Probably protects the public:**

- **Mandatory incident reporting**, with deadlines, to someone outside the company. This summer showed that without it, victims find out last. It costs a small startup almost nothing, because it only applies when something goes wrong.
- **Independent access for auditors**, like what Anthropic gave METR, but as a legal requirement rather than a favour. It should cover transcripts and staff, not just a slide deck.
- **Containment and monitoring standards for dangerous-capability evals.** If you're testing whether a model can hack, the sandbox should be *more* locked down than production, not less. It's absurd that this needs to be written down, but here we are.
- **Thresholds based on capability, not company size.** It should apply to whoever builds a model that can do this, whether that's a giant lab or three people in a garage.

**Probably protects the incumbents:**

- **Licences to train or publish models** above some compute line, with approval processes only big companies can afford to go through.
- **Restrictions on open-weight releases** justified by general "misuse" arguments, without looking at what defenders lose.
- **Federal preemption of state rules** with nothing substantive in the federal version to replace them. If the pitch is "don't let California regulate us, Congress will handle it", and Congress hasn't handled it, you've just bought time.
- **Rules drafted mainly by the labs themselves**, or "safety standards" that match exactly what the leading lab already does.

Measured against that, what OpenAI and Anthropic are proposing right now is a mix. Incident reporting, independent assessment and cybersecurity requirements, all in OpenAI's September list, are the good kind. The "coordinated pacing" both labs keep pushing is harder to judge. It could be a real brake on an actual race. It could also be an agreement among the three or four companies at the front to set the speed for everyone else. The letter asks for tools that *enable* pacing. The details of who gets to pull the lever aren't written yet, and those details are the entire question.

## My take

I don't trust these companies' motives, and I don't think I need to in order to agree with them this time.

The cynical reading is correct as far as it goes. AI labs benefit from regulation that raises the barrier to entry. They're spending tens of millions of dollars to shape it. The timing, arriving right after their own agents embarrassed them, doesn't look great. Some of the people now asking for rules were fighting them a year ago.

But the incidents are real. Four organizations broken into by Claude. Hugging Face breached by OpenAI's agents. Victims who found out weeks or months later, or not at all. A voluntary regime where the first explanation came from the party responsible, and was wrong. None of that becomes less serious because the companies involved also happen to profit from the fix.

So I'd flip the question. Don't ask "should AI be regulated?" The answer after this summer is obviously yes. Ask "who's writing it, and does this clause make the next Hugging Face safer or does it make the next competitor less likely?" Mandatory disclosure and independent audits: yes, please, yesterday. Licences and open-weight bans: show me exactly who they protect.

The labs asking for rules isn't a reason to ignore them. It's a reason to read every line of what they propose very, very carefully. And to make sure that the people writing the final version aren't the same ones whose agents were out breaking into companies without permission.

---

## References

**Primary sources**

- Hugging Face. [Security incident disclosure — July 2026](https://huggingface.co/blog/security-incident-july-2026). 16 July 2026.
- Anthropic. [Investigating three incidents in our cybersecurity evaluations](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals). 30 July 2026.
- Anthropic. [Improving our alignment and security practices](https://www.anthropic.com/news/improving-alignment-security-efforts). 31 August 2026.
- Anthropic. [An alignment assessment of recent cybersecurity incidents](https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents). 9 September 2026.
- OpenAI (Chris Lehane). [The AI policy window is open. We need to act.](https://openai.com/index/ai-policy-window/) 9 September 2026.
- [Pacing the Frontier](https://www.pacingthefrontier.com/). Open letter from frontier AI company employees. 28 July 2026.
- Anthropic. [Anthropic is donating $20 million to Public First Action](https://www.anthropic.com/news/donate-public-first-action). February 2026.
- David Sacks. [Post on X](https://x.com/DavidSacks/status/1978145266269077891). October 2025.
- U.S. Senate Judiciary Committee. [Oversight of A.I.: Rules for Artificial Intelligence](https://www.judiciary.senate.gov/committee-activity/hearings/oversight-of-ai-rules-for-artificial-intelligence). Hearing with Sam Altman, 16 May 2023.

**Academic background**

- Stigler, George J. (1971). ["The Theory of Economic Regulation"](https://doi.org/10.2307/3003160). *The Bell Journal of Economics and Management Science*, 2(1), 3–21.
- Yandle, Bruce (1983). ["Bootleggers and Baptists: The Education of a Regulatory Economist"](https://www.cato.org/sites/cato.org/files/serials/files/regulation/1983/5/v7n3-3.pdf). *Regulation*, 7(3), 12–16.

**Reporting and analysis**

- Wikipedia. [OpenAI–HuggingFace incident](https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident).
- TechCrunch. [Anthropic says its own AI models breached three companies during security tests](https://techcrunch.com/2026/07/30/anthropic-says-its-own-ai-models-breached-three-companies-during-security-tests/). 30 July 2026.
- CDOTrends. [Hugging Face Got Breached by an Optimizer, Not an Attacker. Then Anthropic Checked Its Logs.](https://www.cdotrends.com/story/5093/hugging-face-got-breached-optimizer-not-attacker-then-anthropic-checked-its-logs)
- The Hacker News. [Anthropic Discloses Fourth AI Hacking Incident Involving Claude Opus 4.6](https://thehackernews.com/2026/09/anthropic-ai-models-breached-real.html). September 2026.
- J.B. Branch, TechPolicy.Press. [The OpenAI–Hugging Face Incident Demands Urgent Congressional Oversight](https://www.techpolicy.press/the-openai-hugging-face-incident-demands-urgent-congressional-oversight/). 30 July 2026.
- Alex LaCasse, IAPP. [Autonomous cyberattacks fuel US Congress' AI focus through 2026 midterms and beyond](https://iapp.org/news/a/autonomous-cyberattacks-fuel-us-congress-ai-focus-through-2026-midterms-and-beyond). 10 September 2026.
- TechXplore / AFP. [In a shift, OpenAI calls for US rules on powerful AI](https://techxplore.com/news/2026-09-shift-openai-powerful-ai.html). September 2026.
- The Hill. [Anthropic pours another $20 million into AI safety group](https://thehill.com/homenews/5982007-anthropic-pours-millions-midterms/).
- CNBC. [Anthropic gives $20 million to group pushing for AI regulations ahead of 2026 elections](https://www.cnbc.com/2026/02/12/anthropic-gives-20-million-to-group-pushing-for-ai-regulations-.html). 12 February 2026.
- TIME. [He Helped Build Powerful AI at OpenAI and Anthropic. Now He's Afraid It Could Kill Us](https://time.com/article/2026/09/09/ai-anthropic-openai-jacob-coxon/). 9 September 2026.
- Business Insider via Yahoo. [Google Brain cofounder says Big Tech companies are lying about the risks of AI wiping out humanity](https://money.yahoo.com/google-brain-cofounder-says-big-113049941.html). October 2023.
- SiliconANGLE. [Google Brain founder Andrew Ng says threat of AI causing human extinction is overblown](https://siliconangle.com/2023/10/31/google-brain-founder-andrew-ng-says-threat-ai-causing-human-extinction-overblown/). 31 October 2023.
- OfficeChai. [Anthropic Has A Pattern Of Using Fear To Market Its Products: US AI Czar David Sacks](https://officechai.com/ai/anthropic-has-a-pattern-of-using-fear-to-market-its-products-us-ai-czar-david-sacks/).
