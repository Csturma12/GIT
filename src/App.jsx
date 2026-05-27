import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, BarChart3, Bot, CheckCircle2, Gauge, Lock, Play, Shield, Signal, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const signals = [
  {
    ticker: "AAPL",
    action: "BUY",
    confidence: 0.72,
    setup: "Pullback",
    reason: "Pullback to VWAP with bullish EMA structure.",
    entry: 185.4,
    stop: 183.2,
    target: 190.0,
    rr: 2.1,
  },
  {
    ticker: "NVDA",
    action: "BUY",
    confidence: 0.81,
    setup: "Momentum",
    reason: "Volume expansion with price holding above breakout level.",
    entry: 912.8,
    stop: 895.2,
    target: 952.4,
    rr: 2.25,
  },
  {
    ticker: "TSLA",
    action: "NO TRADE",
    confidence: 0.44,
    setup: "No Setup",
    reason: "Weak volume and price trapped below resistance.",
    entry: null,
    stop: null,
    target: null,
    rr: null,
  },
  {
    ticker: "META",
    action: "SELL",
    confidence: 0.68,
    setup: "Reversal",
    reason: "Rejected at resistance with weakening momentum.",
    entry: 486.1,
    stop: 492.4,
    target: 472.8,
    rr: 2.1,
  },
];

function Pill({ children, tone = "neutral" }) {
  const styles = {
    buy: "bg-emerald-100 text-emerald-700 border-emerald-200",
    sell: "bg-rose-100 text-rose-700 border-rose-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[tone]}`}>{children}</span>;
}

function SignalCard({ signal, selected, onClick }) {
  const tone = signal.action === "BUY" ? "buy" : signal.action === "SELL" ? "sell" : "neutral";
  return (
    <button onClick={onClick} className={`w-full rounded-2xl border p-4 text-left transition hover:shadow-md ${selected ? "border-slate-900 bg-white shadow-md" : "border-slate-200 bg-white/80"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {signal.action === "BUY" ? <TrendingUp className="h-4 w-4 text-emerald-600" /> : signal.action === "SELL" ? <TrendingDown className="h-4 w-4 text-rose-600" /> : <Activity className="h-4 w-4 text-slate-500" />}
          <span className="font-bold text-slate-950">{signal.ticker}</span>
        </div>
        <Pill tone={tone}>{signal.action}</Pill>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
        <span>{signal.setup}</span>
        <span>{Math.round(signal.confidence * 100)}% confidence</span>
      </div>
    </button>
  );
}

function DashboardPreview() {
  const [selected, setSelected] = useState(signals[0]);
  const actionTone = selected.action === "BUY" ? "buy" : selected.action === "SELL" ? "sell" : "neutral";

  return (
    <section className="bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Pill tone="warning">Product preview</Pill>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">A pro-style dashboard built around fast decisions.</h2>
            <p className="mt-4 max-w-2xl text-slate-300">The layout keeps the chart, trade setup, risk status, signals, and active positions visible without turning the screen into a spreadsheet.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Paper mode enabled</div>
            <div className="mt-2 flex items-center gap-2"><Lock className="h-4 w-4" /> Automation off by default</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-100 text-slate-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-950 p-2 text-white"><Signal className="h-5 w-5" /></div>
              <div>
                <div className="font-bold">Market Intel</div>
                <div className="text-xs text-slate-500">AI signals + risk-controlled execution</div>
              </div>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Pill tone="buy">Market Open</Pill>
              <Pill>Buying Power: $10,000</Pill>
              <Pill tone="warning">Automation: OFF</Pill>
            </div>
          </div>

          <div className="grid min-h-[680px] grid-cols-1 lg:grid-cols-[180px_1fr_360px]">
            <aside className="hidden border-r border-slate-200 bg-white p-4 lg:block">
              {["Dashboard", "Signals", "Trades", "Performance", "Settings"].map((item, index) => (
                <div key={item} className={`mb-2 rounded-xl px-3 py-2 text-sm font-medium ${index === 0 ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{item}</div>
              ))}
            </aside>

            <main className="space-y-4 p-4 md:p-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="rounded-2xl"><CardContent className="p-4"><div className="text-xs text-slate-500">Account Value</div><div className="mt-1 text-xl font-bold">$25,420</div></CardContent></Card>
                <Card className="rounded-2xl"><CardContent className="p-4"><div className="text-xs text-slate-500">Daily P&L</div><div className="mt-1 text-xl font-bold text-emerald-600">+$124</div></CardContent></Card>
                <Card className="rounded-2xl"><CardContent className="p-4"><div className="text-xs text-slate-500">Risk Used</div><div className="mt-1 text-xl font-bold">0.7%</div></CardContent></Card>
                <Card className="rounded-2xl"><CardContent className="p-4"><div className="text-xs text-slate-500">Open Trades</div><div className="mt-1 text-xl font-bold">2</div></CardContent></Card>
              </div>

              <Card className="rounded-3xl">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">AAPL Analysis</h3>
                      <p className="text-sm text-slate-500">15-minute chart · VWAP pullback setup</p>
                    </div>
                    <Pill tone={actionTone}>{selected.action}</Pill>
                  </div>
                  <div className="h-72 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-5">
                    <div className="flex h-full items-end gap-2">
                      {[32, 44, 39, 52, 48, 60, 57, 68, 64, 73, 69, 78, 74, 84, 80, 88].map((h, i) => (
                        <div key={i} className="flex flex-1 flex-col items-center gap-1">
                          <div className="w-full rounded-t-md bg-slate-300" style={{ height: `${h}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    <Pill>RSI 61</Pill><Pill>Above VWAP</Pill><Pill>EMA bullish</Pill><Pill>Volume +21%</Pill>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-2"><Bot className="h-5 w-5" /><h3 className="text-xl font-bold">Trade Setup</h3></div>
                  <div className="grid gap-4 md:grid-cols-5">
                    <div><div className="text-xs text-slate-500">Entry</div><div className="font-bold">{selected.entry ?? "—"}</div></div>
                    <div><div className="text-xs text-slate-500">Stop</div><div className="font-bold">{selected.stop ?? "—"}</div></div>
                    <div><div className="text-xs text-slate-500">Target</div><div className="font-bold">{selected.target ?? "—"}</div></div>
                    <div><div className="text-xs text-slate-500">Risk/Reward</div><div className="font-bold">{selected.rr ?? "—"}</div></div>
                    <div><div className="text-xs text-slate-500">Confidence</div><div className="font-bold">{Math.round(selected.confidence * 100)}%</div></div>
                  </div>
                  <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">{selected.reason}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button className="rounded-2xl"><Play className="mr-2 h-4 w-4" /> Paper Trade</Button>
                    <Button variant="outline" className="rounded-2xl">Ignore</Button>
                  </div>
                </CardContent>
              </Card>
            </main>

            <aside className="space-y-4 border-l border-slate-200 bg-white p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div><h3 className="text-lg font-bold">Signals</h3><p className="text-sm text-slate-500">Scan, click, decide.</p></div>
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div className="space-y-3">
                {signals.map((signal) => <SignalCard key={signal.ticker} signal={signal} selected={selected.ticker === signal.ticker} onClick={() => setSelected(signal)} />)}
              </div>
              <Card className="rounded-3xl bg-slate-950 text-white">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2"><Gauge className="h-5 w-5" /><h4 className="font-bold">Risk Guard</h4></div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between"><span>Max risk/trade</span><span>1%</span></div>
                    <div className="flex justify-between"><span>Daily loss limit</span><span>3%</span></div>
                    <div className="flex justify-between"><span>Auto-trading</span><span>OFF</span></div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden px-4 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.12),transparent_35%),radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_460px] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Pill tone="buy">AI trade analysis · paper trading first</Pill>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Find better setups. Validate risk. Trade with control.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">An AI-powered trading assistant that turns market data into structured trade ideas, signal cards, and risk-checked paper trades through Alpaca.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-2xl px-6">Join the beta</Button>
              <Button size="lg" variant="outline" className="rounded-2xl px-6">View dashboard</Button>
            </div>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {["No hype", "Risk-first", "Paper mode"].map((item) => <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> {item}</div>)}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="rounded-3xl border-slate-200 shadow-2xl">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div><div className="font-bold">Today's Signal Stack</div><div className="text-sm text-slate-500">AI-ranked setups</div></div>
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  {signals.slice(0, 3).map((s) => <SignalCard key={s.ticker} signal={s} selected={s.ticker === "NVDA"} onClick={() => {}} />)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      <DashboardPreview />
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [Shield, "Risk-first automation", "Every trade idea passes through fixed risk rules before execution."],
              [Signal, "Signal cards that scan fast", "Users can understand a setup in seconds, then expand for details."],
              [Bot, "AI as assistant, not boss", "OpenAI generates structured ideas. Your platform controls validation and execution."],
            ].map(([Icon, title, body]) => (
              <Card key={title} className="rounded-3xl"><CardContent className="p-6"><Icon className="h-7 w-7" /><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-2 text-slate-600">{body}</p></CardContent></Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return <LandingPage />;
}
