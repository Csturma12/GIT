---
name: compounder-gates
description: Evaluate whether a public company is a buy-and-hold compounder by running it through three sequential gates — Sticky Revenue, Compounding, and Survival. Pass a ticker, company name, or rough description (broad search); Claude resolves the exact company, then researches and delivers a Pass/Borderline/Fail verdict for each gate plus a final synthesis. Use when the user wants to vet a stock/business as a long-term compounder, asks "is X a good compounder", or invokes /compounder-gates.
---

# Compounder Gates

A three-gate framework for deciding whether a business is built to compound
over the long term. Only after all three gates pass do you talk about price.

You (Claude) run the research yourself using web search and primary sources
(filings, transcripts, investor presentations, competitor disclosures).
Cite every material claim as `(source, date)`. This framework is adapted from
prompts originally written for Gemini Deep Research — here, you are the analyst.

## Step 0 — Resolve the company (broad search)

1. **Read the argument.** The user may pass a ticker, full name, or a rough
   description (e.g. `NVDA`, `Costco`, `the company that makes elevators`).
   This is a **broad search seed, not an exact ticker requirement.**
2. **If no argument was given,** ask: "Which company should I run through the
   compounder gates? (ticker, name, or description)".
3. **Resolve it to one company.** Use web search if the seed is ambiguous or a
   description. State the resolved identity — `Company Name (TICKER, exchange)` —
   and one line on what it does. If multiple plausible matches exist, list the
   top candidates and ask the user to confirm before running.
4. **If web research tools are unavailable** (network policy restricts them),
   say so plainly and ask the user to paste filings/notes so you can still run
   the gates from supplied material.

Run the gates in order. Each gate ends with a verdict. The framework says a
**Fail stops the process** — when a gate fails, deliver its verdict, note that
the framework recommends stopping, and ask whether to continue to the remaining
gates anyway. Borderline proceeds with caution.

---

## Gate 1 — The Sticky Revenue Gate

**Question: If marketing stops today, does the money keep coming in?**

The trap: "Recurring" ≠ "Captive". A gym membership is recurring but leaks —
customers cancel constantly. Elevator maintenance is captive — installed once,
never re-decided, mandatory, specialized parts, switching is risky. Both look
"recurring" on a screener. One compounds, one leaks. Your job is to tell which.

**Objective:** If marketing stopped today, how long does revenue keep coming?

**Analyze:**
1. Revenue structure: recurring vs repeat vs one-time.
2. Structural lock-in: workflow embedding, switching costs.
3. Contractual lock-in: auto-renew vs renegotiation vs rebid.
4. Priority lock-in: mission-critical vs discretionary.
5. Decision frequency: "decide once" or "every time"?
6. Pricing power: history of price increases & customer reaction.
7. Metric proof: gross/net retention, NRR, cohort behavior, RPO/backlog.

**Deliver:**
- A table with columns: **Driver | Strength | Evidence (source, date) | What breaks it**.
- The 3 strongest evidence points + the single biggest weakness.
- If the verdict is Pass: 2 reasons it is *not* exceptional captivity (steelman the bear).
- **Final:** `Verdict: [Pass / Borderline / Fail]` + one-sentence summary.

**Verdict logic:** Pass → move to Gate 2. · Borderline → real gaps, proceed
cautiously. · Fail → stop, the bucket leaks.

---

## Gate 2 — The Compounding Gate

**Question: Does time make this business stronger?**

Cautionary case: GoPro traded near $90 in 2014 and under $5 by 2018 — phones
improved, cheaper rivals piled in, the cool factor faded, and it had to
relaunch yearly just to stand still. In consumer hardware, time destroys moats;
it does not build them. Decide which direction time runs here.

**Objective:** In 10 years, will this business be *more* protected?

**Part A — Engine durability:**
- What repeatable activity converts time into cash?
- Has the engine changed over the last 10–20 years?
- Innovation dependency: additive (compounds) or defensive (treadmill)?
- Demand basis: infrastructure, regulation, or trend?
- Disruption & substitution risk.

**Part B — Advantage trajectory:**
- Inventory each advantage and label it Growing / Stable / Decaying.
- Growing: why do they strengthen with scale?
- Decaying: what defensive spend is required to hold them?
- Trajectory of pricing, margins, and ROIC direction.

**Deliver:**
- A table with columns: **Component | Direction | Evidence (source, date) | What breaks it**.
- 2–3 time *tailwinds* and 2–3 time *headwinds*.
- **Final:** `Verdict: [Stronger / Stable / Weaker]` + one sentence.

**Verdict logic:** Stronger → time is the asset, continue. · Stable →
defensible but not compounding. · Weaker → time works against you, reject.

---

## Gate 3 — The Survival Gate

**Question: Could an idiot run this business and still make money in 5 years?**

Harsh question, right question. CEOs retire, founders leave, brilliance is
rented not owned. If the thesis only works under exceptional management, you
are not buying a business — you are buying specific people staying brilliant.

What protects a business from bad management:
- **High gross margins + pricing power** → room to absorb errors before they hurt.
- **Simple capital-allocation needs** → fewer ways to misallocate capital.
- **Resilient demand** → the product sells even when execution is mediocre.

**Role:** Senior equity analyst writing an investment-quality memo for a
long-term compounder investor.

**Objective:** Is this business error-tolerant under *average* management?
Core question: "If a fool ran this for 5 years, would it still make money?"

**Evidence:** Filings, transcripts, presentations, competitor disclosures.
Cite `(source, date)`.

**Analyze:**
1. Management dependency — what requires brilliance vs routine execution?
   Pull evidence from past leadership transitions.
2. Key-person & succession risk — founder dependency, bench depth,
   "one-person culture" signals.
3. Capital-allocation risk — M&A discipline (price paid, track record),
   buyback policy, capex risk. Identify the biggest *irreversible* mistake
   management could realistically make.
4. Common failure modes — overpaying for M&A, excess leverage, growth at the
   expense of unit economics, culture collapse, aggressive accounting,
   mispricing (financials/insurance).
5. Balance-sheet shock absorber — debt, covenants, maturity profile, ability
   to survive 1–2 bad years.
6. Governance & incentives — ownership structure, board independence, comp
   alignment, dilution / stock-based comp.
7. Self-healing — does the business naturally recover from mistakes? Built-in
   buffers (contractual revenue, pricing power, diversification)?

**Deliver:**
- A summary table with columns: **Risk area | Fragility | Evidence (source, date) | What triggers failure**.
- The most likely blow-up scenario (2–3 bullets).
- If the verdict is Pass: 2 reasons it's *not* bulletproof.
- **Final line:** `Verdict: [Pass / Borderline / Fail]` — one-sentence summary.

---

## Final synthesis

After all three gates, give a short scorecard:

| Gate | Verdict |
|------|---------|
| 1 · Sticky Revenue | … |
| 2 · Compounding | … |
| 3 · Survival | … |

Then the bottom line:
- **Pass all three →** the business is built to compound. *Now* you can talk
  about price.
- **Any Borderline →** name the specific gaps to monitor.
- **Any Fail →** it is not a buy-and-hold compounder at any quality bar; state why.

Keep the final read to a few sentences. This framework judges business quality,
not valuation — it deliberately says nothing about whether the stock is cheap.
