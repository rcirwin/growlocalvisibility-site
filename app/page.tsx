"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { submitContactForm } from "./actions/contact";
import {
  MapPin,
  ChevronDown,
  Check,
  ArrowRight,
  Mail,
  Phone,
  Building2,
  User,
  Star,
  Menu,
  X,
  Link2,
  PhoneMissed,
  Wrench,
} from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  NAVIGATION                                                         */
/* ------------------------------------------------------------------ */

function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "What You Get", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 text-lg font-semibold">
          <MapPin className="h-5 w-5 text-green" aria-hidden="true" />
          <span className="font-display">
            Grow<span className="text-green">Local</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-green-dark"
          >
            Get My Free Website
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg bg-green px-4 py-3 text-center text-sm font-semibold text-background transition-colors hover:bg-green-dark"
          >
            Get My Free Website
          </a>
        </div>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  SITE MOCKUP — show the product, not a description                  */
/* ------------------------------------------------------------------ */

function SiteMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      {/* Browser frame */}
      <div className="-rotate-1 overflow-hidden rounded-xl border border-border bg-background shadow-[0_24px_60px_-12px_rgba(23,23,23,0.18)]">
        {/* Chrome bar */}
        <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div className="flex-1 truncate rounded-md border border-border bg-background px-3 py-1 text-[11px] text-muted">
            summit-plumbing.growlocalvisibility.com
          </div>
        </div>

        {/* Mini site */}
        <div className="bg-background">
          {/* Mini nav */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-green" aria-hidden="true" />
              <span className="text-[11px] font-bold">Summit Plumbing</span>
            </div>
            <span className="rounded-full bg-green px-2.5 py-1 text-[9px] font-bold text-background">
              (480) 555-0164
            </span>
          </div>

          {/* Mini hero */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-foreground">
              <span className="text-green" aria-hidden="true">★★★★★</span>
              4.9 · 132 Google reviews
            </div>
            <p className="mt-2 font-display text-[19px] font-bold leading-snug tracking-tight">
              24/7 Emergency Plumbing,
              <br />
              Straight-Shooting Prices
            </p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
              Family-owned in Mesa since 2004. Licensed, insured, and at your
              door in under an hour.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-md bg-green px-3 py-1.5 text-[10px] font-bold text-background">
                Call Now
              </span>
              <span className="rounded-md border border-border px-3 py-1.5 text-[10px] font-semibold text-foreground">
                Our Services
              </span>
            </div>
          </div>

          {/* Mini services */}
          <div className="grid grid-cols-3 gap-2 border-t border-border px-5 py-4">
            {["Drain Cleaning", "Water Heaters", "Leak Repair"].map((s) => (
              <div key={s} className="rounded-md border border-border bg-surface px-2 py-2">
                <p className="text-[9px] font-semibold leading-tight">{s}</p>
                <p className="mt-0.5 text-[8px] text-muted">Same-day service</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating tags */}
      <div className="absolute -top-4 -right-2 rotate-2 rounded-lg border border-green bg-surface-light px-3 py-1.5 shadow-sm sm:-right-6">
        <p className="text-xs font-bold text-green-dark">$0 · yours to keep</p>
      </div>
      <div className="absolute -bottom-4 -left-2 -rotate-1 rounded-lg border border-border bg-background px-3 py-1.5 shadow-sm sm:-left-4">
        <p className="text-xs font-semibold text-foreground">
          Example build · yours is next
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-surface-light px-3.5 py-1.5 text-xs font-semibold text-green-dark">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            100% free website. Yours to keep. No credit card, ever.
          </p>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            We build your website.
            <br />
            <span className="text-green">You keep it, free.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            For plumbers, auto shops, painters, electricians, any local trade.
            We research your business, build a professional website, and put
            it live. It&rsquo;s yours to keep, free, with no expiry. Add it to
            your Google Maps listing and turn searches into calls.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green px-7 py-3.5 text-base font-semibold text-background transition-all hover:bg-green-dark"
            >
              Get My Free Website
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-border px-7 py-3.5 text-base font-medium text-foreground transition-colors hover:border-green hover:text-green-dark"
            >
              How it works
            </a>
          </div>

          <p className="mt-5 text-sm text-muted">
            150+ websites built for local businesses. Yours might already be started.
          </p>
        </div>

        <SiteMockup />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PROBLEM — the search reality, stated like facts on an estimate     */
/* ------------------------------------------------------------------ */

function Problem() {
  const stats = [
    { n: "97%", label: "of people search online before calling a local business" },
    { n: "46%", label: "of all Google searches are someone looking for something local" },
    { n: "70%", label: "of customers skip businesses that have no website" },
  ];

  return (
    <section className="border-t border-border bg-surface py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-dark">
              The problem
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              You&rsquo;re great at the work. But can customers find you?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Most local service businesses win on quality and lose on
              visibility. When you don&rsquo;t show up on Google, the call goes
              to whoever does. We fix that, starting with a free website.
            </p>
          </div>

          <div className="divide-y divide-border">
            {stats.map((s) => (
              <div key={s.n} className="flex items-baseline gap-6 py-5 first:pt-0 last:pb-0">
                <span className="w-24 shrink-0 font-display text-4xl font-bold text-green-dark sm:text-5xl">
                  {s.n}
                </span>
                <span className="text-base leading-snug text-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  HOW IT WORKS — the inversion is the story                          */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "We research your business",
      body: "We find your Google listing, read your reviews, and learn what makes you the shop people trust. No questionnaires, no homework, no meetings.",
    },
    {
      n: "02",
      title: "We build your site and put it live",
      body: "A professional website written specifically for your business, live on the web at yourbusiness.growlocalvisibility.com. Not a template. Not a mockup. The real thing, and it's free.",
    },
    {
      n: "03",
      title: "It's yours. Put it on Google.",
      body: "Add the link to your Google Maps listing so people searching for you can click straight through. Changes are free. Want your own domain, Google ranking work, and more calls? Upgrade whenever you're ready. Or don't. The free site stays yours either way.",
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-dark">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Every other company sends you a quote.{" "}
            <span className="block text-green-dark">We send you a finished website. Free.</span>
          </h2>
        </div>

        <div className="mt-14 space-y-0 divide-y divide-border border-y border-border">
          {steps.map((s) => (
            <div
              key={s.n}
              className="grid items-start gap-4 py-8 sm:grid-cols-[110px_280px_1fr] sm:gap-10"
            >
              <span className="font-display text-5xl font-bold text-border sm:text-6xl" aria-hidden="true">
                {s.n}
              </span>
              <h3 className="font-display text-xl font-bold tracking-tight">{s.title}</h3>
              <p className="text-base leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-lg bg-green px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-green-dark"
          >
            Start My Free Build
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="text-sm text-muted">Most sites are ready within 48 hours.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  WHAT YOU GET                                                       */
/* ------------------------------------------------------------------ */

function Services() {
  const free = [
    {
      title: "Professional website",
      body: "Custom-built and mobile-first, written from your real reviews and photos. Not a template anyone else has.",
    },
    {
      title: "Yours to keep, for good",
      body: "Live at yourbusiness.growlocalvisibility.com with no expiry, no bill, and unlimited free revisions.",
    },
    {
      title: "Ready for your Google listing",
      body: "Paste the link into your Google Business Profile and customers who find you on Maps can click straight through.",
    },
  ];

  const included = [
    {
      title: "Your own domain",
      body: "yourbusiness.com instead of our subdomain, plus hosting, maintenance, and unlimited changes whenever you need them.",
    },
    {
      title: "Google Business Profile optimization",
      body: "Categories, services, photos, posts — tuned so you rank higher when people nearby search for what you do.",
    },
    {
      title: "Google Maps ranking work",
      body: "The pack of three at the top of a local search gets the calls. Everything we do is aimed at getting you there.",
    },
    {
      title: "Review requests & responses",
      body: "Steady, automatic review requests to your customers, and a professional response to every review — 24/7.",
    },
    {
      title: "Monthly report & analytics",
      body: "One clear page a month: traffic, rankings, calls. Know exactly what's working, in plain language.",
    },
  ];

  const growth = [
    {
      title: "24/7 AI receptionist",
      body: "When you can't pick up — on a job, after hours, weekends — it answers, takes the caller's name, number, and job, and texts it all to you.",
    },
    {
      title: "Quote follow-ups & win-backs",
      body: "Automatic follow-ups on estimates you've sent, and reactivation messages to past customers when they're due.",
    },
  ];

  const scale = [
    {
      title: "Every call answered & booked",
      body: "The AI picks up every call on the first ring, asks the questions you would, and books the job straight onto your calendar.",
    },
    {
      title: "Fewer no-shows",
      body: "Confirmation and reminder texts before every appointment, an “on my way” text before you arrive, and automatic rebooking when someone cancels or doesn't show.",
    },
    {
      title: "Ads, done for you",
      body: "Fresh ad creative every month, and we run your Google and Facebook ads. Your ad budget is paid directly to Google or Meta.",
    },
  ];

  return (
    <section id="services" className="border-t border-border bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-dark">
              What you get
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Start free. Add more when you&rsquo;re ready.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              The website is free. The upgrades hand the rest of your Google
              presence to us. No tech skills required on your end. If you can
              send a text message, you can work with us.
            </p>
            <a
              href="#pricing"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-green-dark hover:text-green"
            >
              See pricing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-dark">
              Free for every business, $0
            </p>
            <div className="mt-4 divide-y divide-border border-y border-green/40">
              {free.map((f) => (
                <div key={f.title} className="grid gap-1.5 py-5 sm:grid-cols-[240px_1fr] sm:gap-8">
                  <h3 className="flex items-start gap-2.5 font-semibold leading-snug">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted sm:text-base">{f.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-10 text-xs font-bold uppercase tracking-wider text-muted">
              Upgrade to Managed, $99/mo
            </p>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {included.map((f) => (
                <div key={f.title} className="grid gap-1.5 py-5 sm:grid-cols-[240px_1fr] sm:gap-8">
                  <h3 className="flex items-start gap-2.5 font-semibold leading-snug">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted sm:text-base">{f.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-10 text-xs font-bold uppercase tracking-wider text-green-dark">
              Added in the Growth plan, $199/mo
            </p>
            <div className="mt-4 divide-y divide-border border-y border-green/40">
              {growth.map((f) => (
                <div key={f.title} className="grid gap-1.5 py-5 sm:grid-cols-[240px_1fr] sm:gap-8">
                  <h3 className="flex items-start gap-2.5 font-semibold leading-snug">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted sm:text-base">{f.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-10 text-xs font-bold uppercase tracking-wider text-green-dark">
              Added in the Scale plan, $499/mo
            </p>
            <div className="mt-4 divide-y divide-border border-y border-green/40">
              {scale.map((f) => (
                <div key={f.title} className="grid gap-1.5 py-5 sm:grid-cols-[240px_1fr] sm:gap-8">
                  <h3 className="flex items-start gap-2.5 font-semibold leading-snug">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted sm:text-base">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  MISSED CALL MATH — concrete revenue framing                        */
/* ------------------------------------------------------------------ */

function MissedCalls() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-dark">
              <PhoneMissed className="h-4 w-4" aria-hidden="true" />
              The calls you never hear about
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              4 in 10 calls to local businesses go unanswered.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              You&rsquo;re under a car or up a ladder — that&rsquo;s the job.
              But the caller doesn&rsquo;t leave a voicemail. They call the
              next shop on Google. The Growth plan answers when you
              can&rsquo;t, captures the job details, and texts them to you
              on the spot.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-green px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-green-dark"
            >
              Stop Missing Calls
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {/* The estimate — quote-style math */}
          <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
            <p className="border-b border-border pb-4 font-display text-sm font-bold uppercase tracking-wider text-muted">
              Quick estimate
            </p>
            <dl className="divide-y divide-border">
              <div className="flex items-center justify-between py-4">
                <dt className="text-sm text-muted">Average job for a local trade</dt>
                <dd className="font-semibold">$350</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-sm text-muted">Missed calls that become someone else&rsquo;s job</dt>
                <dd className="font-semibold">1 / week</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-sm text-muted">Revenue walking to a competitor</dt>
                <dd className="font-display text-xl font-bold text-foreground">
                  ~$1,400<span className="text-sm font-semibold text-muted">/mo</span>
                </dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-sm text-muted">Growth plan, everything included</dt>
                <dd className="font-display text-xl font-bold text-green-dark">
                  $199<span className="text-sm font-semibold text-muted">/mo</span>
                </dd>
              </div>
            </dl>
            <p className="mt-4 rounded-lg bg-surface-light px-4 py-3 text-sm font-medium text-green-dark">
              One saved job a month pays for it. The rest is yours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPARISON — us vs the alternatives they're actually weighing      */
/* ------------------------------------------------------------------ */

function Compare() {
  const rows = [
    { label: "Cost of your website", glv: "$0, yours to keep", diy: "Your weekends", agency: "$2,000–5,000 up front" },
    { label: "Who does the work", glv: "We do", diy: "You do", agency: "They do" },
    { label: "Time until you're live", glv: "~48 hours", diy: "Weeks of evenings", agency: "4–8 weeks" },
    { label: "Google & Maps optimization", glv: "Included", diy: "You figure it out", agency: "Often extra" },
    { label: "Monthly cost", glv: "$0 (upgrades $99–499)", diy: "$20–50 + your time", agency: "$300–1,500" },
    { label: "Contract", glv: "None, cancel anytime", diy: "None", agency: "6–12 months" },
  ];

  return (
    <section className="border-t border-border bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-dark">
            Your options
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Compare us to doing it yourself, or hiring an agency.
          </h2>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-foreground/80">
                <th className="py-4 pr-6 text-sm font-semibold text-muted" scope="col">
                  &nbsp;
                </th>
                <th className="bg-surface-light px-5 py-4 font-display text-base font-bold" scope="col">
                  Grow Local
                </th>
                <th className="px-5 py-4 text-base font-semibold text-muted" scope="col">
                  DIY builder
                </th>
                <th className="px-5 py-4 text-base font-semibold text-muted" scope="col">
                  Marketing agency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="py-4 pr-6 text-sm font-medium text-muted">
                    {r.label}
                  </th>
                  <td className="bg-surface-light px-5 py-4 text-sm font-semibold text-foreground">
                    {r.glv}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">{r.diy}</td>
                  <td className="px-5 py-4 text-sm text-muted">{r.agency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PRICING                                                            */
/* ------------------------------------------------------------------ */

function Pricing() {
  const plans = [
    {
      name: "Free Website",
      price: "$0",
      period: "",
      description: "We build it, put it live, and it's yours. No catch, no card.",
      features: [
        "Custom-built professional website",
        "Live at yourbusiness.growlocalvisibility.com",
        "Yours to keep, free forever",
        "Built from your real reviews & photos",
        "Ready to add to your Google Maps listing",
        "Unlimited free revisions",
      ],
      cta: "Get Your Free Website",
      href: "#contact",
      highlighted: false,
      badge: null,
      outright: true,
    },
    {
      name: "Managed",
      price: "$99",
      period: "/mo",
      description: "Your own domain plus everything Google, handled.",
      features: [
        "Custom domain (yourbusiness.com)",
        "Hosting, maintenance & unlimited changes",
        "Google Business Profile optimization",
        "Google Maps ranking optimization",
        "Automated review requests & responses",
        "Monthly SEO report & analytics",
      ],
      cta: "Start Managed",
      href: "#contact",
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Growth",
      price: "$199",
      period: "/mo",
      description: "Never miss another job. Calls answered 24/7.",
      features: [
        "Everything in Managed",
        "AI receptionist for missed & after-hours calls",
        "Every caller captured: name, number, job",
        "Instant text summary to your phone",
        "Quote follow-ups & customer win-backs",
        "Monthly captured-leads report",
      ],
      cta: "Start Growing",
      href: "#contact",
      highlighted: false,
      badge: "New",
    },
    {
      name: "Scale",
      price: "$499",
      period: "/mo",
      description: "Calls answered, jobs booked, ads running. We fill your calendar.",
      features: [
        "Everything in Growth",
        "AI answers every call & books the job",
        "Appointment reminders & “on my way” texts",
        "Automatic rebooking for no-shows",
        "Google & Facebook ads, run for you",
        "Fresh ad creative every month",
      ],
      note: "Ad budget is paid directly to Google or Meta.",
      cta: "Fill My Calendar",
      href: "#contact",
      highlighted: false,
      badge: "New",
    },
  ];

  return (
    <section id="pricing" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-dark">
            Simple pricing
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            No surprises. No contracts.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Your website is free, for good. Upgrade only if you want more.
            Cancel anytime.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-7 transition-colors ${
                plan.highlighted
                  ? "border-green bg-surface-light shadow-lg shadow-green/5"
                  : "border-border bg-background hover:border-green/40"
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-6 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    plan.highlighted
                      ? "bg-green text-background"
                      : "border border-green bg-background text-green-dark"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <h3 className="font-display text-lg font-bold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted">{plan.period}</span>}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{plan.description}</p>

              <ul className="mt-6 flex-1 space-y-2.5" role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.note && <p className="mt-5 text-xs leading-relaxed text-muted">{plan.note}</p>}

              {plan.outright && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-sm font-semibold">
                    Rather own it outright?{" "}
                    <span className="whitespace-nowrap">$500 one-time</span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Get the full source code to host anywhere you like. No recurring fees.
                  </p>
                </div>
              )}

              <a
                href={plan.href}
                className={`mt-7 block rounded-lg py-3 text-center text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-green text-background hover:bg-green-dark"
                    : "border border-border text-foreground hover:border-green hover:text-green-dark"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted">
          For reference: a typical agency charges $2,000&ndash;5,000 up front
          for a website. Yours costs $0, and you keep it.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ABOUT                                                              */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="about" className="border-t border-border bg-surface py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
          <a
            href="https://www.linkedin.com/in/ryan-irwin-tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative shrink-0"
            aria-label="Ryan Irwin on LinkedIn"
          >
            <Image
              src="/ryan.jpg"
              alt="Ryan Irwin, founder of Grow Local Visibility"
              width={220}
              height={220}
              className="rounded-2xl border border-border object-cover"
            />
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-lg transition-transform group-hover:scale-110">
              <LinkedinIcon className="h-5 w-5" />
            </div>
          </a>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-dark">
              Who you&rsquo;re working with
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Hey, I&rsquo;m Ryan.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              I started Grow Local Visibility because I kept seeing the same
              thing: talented tradespeople losing customers to worse
              businesses with better Google presence. So I flipped the model:
              I build your website and give it to you, free. If you want help
              with the rest of your Google presence later, that&rsquo;s where I
              earn my keep. No sales pitch survives a bad product, so I just
              give you the product.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://www.linkedin.com/in/ryan-irwin-tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-dark hover:text-green"
              >
                <LinkedinIcon className="h-4 w-4" />
                Connect on LinkedIn
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-dark hover:text-green"
              >
                Let&rsquo;s talk
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    q: "What's the catch with the free website?",
    a: "There isn't one. Building sites is nearly free for us to do at scale, so we'd rather give away finished work than run ads. Some businesses later upgrade to Managed or Growth, and that's our business model. If you never upgrade, you keep the free site and we part as friends.",
  },
  {
    q: "Is the free website really mine to keep?",
    a: "Yes. It stays live at yourbusiness.growlocalvisibility.com for as long as you want it, with no expiry and no bill. A small \"built by Grow Local Visibility\" strip at the bottom of the page is how we keep it free. Want your own domain without it? That's the Managed plan.",
  },
  {
    q: "Do I need to do anything?",
    a: "Not really. We research your business, build the site, and put it live. The one thing we recommend is adding the link to your Google Maps listing so customers can find it. If you can send a text message, you can work with us.",
  },
  {
    q: "How do I add it to my Google Maps listing?",
    a: "Open your Google Business Profile (search your business name on Google while signed in), choose Edit profile, and paste your site link into the Website field. It takes about a minute, and we're happy to walk you through it.",
  },
  {
    q: "What if I don't like it?",
    a: "Tell us what to change. Revisions are free and unlimited. Or just don't use it. You never pay a thing and there's nothing to cancel.",
  },
  {
    q: "What's included in the $99/month?",
    a: "Your own custom domain, hosting and maintenance, unlimited changes, Google Business Profile and Maps optimization, monthly SEO reports, automated review requests and responses, and your analytics dashboard. No hidden fees, cancel anytime.",
  },
  {
    q: "What does the Growth plan add?",
    a: "Growth catches revenue you're currently losing. An AI receptionist answers the calls you miss (on a job, after hours, weekends), captures the caller's name, number, and what they need, and texts it to you instantly. It also follows up on quotes you've sent and reaches back out to past customers.",
  },
  {
    q: "Will the AI answer all my calls?",
    a: "On Growth, only the ones you can't. Your phone rings like normal. If you don't pick up, or it's outside business hours, the AI steps in so the caller talks to a friendly assistant instead of your voicemail. On Scale, it can answer every call on the first ring and book the job for you. Either way, you stay in control and can turn it off anytime.",
  },
  {
    q: "What does the Scale plan add?",
    a: "Scale fills your calendar. On top of everything in Growth, the AI answers every call, qualifies the caller, and books the job onto your calendar. Customers get confirmation and reminder texts, an \"on my way\" text before you arrive, and an automatic rebooking message if they cancel or don't show. We also make fresh ad creative every month and run your Google and Facebook ads. It's $499/month; your ad budget is paid directly to Google or Meta, not to us.",
  },
  {
    q: "Can I own the website outright?",
    a: "Yes. $500 one-time gets you the complete source code to host anywhere you like, with no recurring fees ever. Most owners prefer the $99/mo plan since it includes the domain, hosting, and all the Google work — but the buyout is always there.",
  },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-6 text-left"
        aria-expanded={open}
      >
        <span className="pr-4 text-base font-semibold">{faq.q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-muted">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <section id="faq" className="border-t border-border py-24">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-dark">
          Fair questions
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          You should be skeptical. Here are straight answers.
        </h2>
        <div className="mt-10 border-t border-border">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACT                                                            */
/* ------------------------------------------------------------------ */

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Something went wrong. Please email ryan@growlocalvisibility.com.");
      }
    });
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted/50 transition-colors focus:border-green focus:outline-none";

  return (
    <section id="contact" className="border-t border-border bg-surface py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-dark">
              Get started
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Get your free website. Seriously, free.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Tell us who you are and we&rsquo;ll start building. Within 48
              hours you&rsquo;ll have a link to your finished site. It&rsquo;s
              yours to keep, free, and ready to add to your Google listing.
            </p>

            <ul className="mt-8 space-y-3" role="list">
              {[
                "Yours to keep, free forever",
                "No credit card, no contract, no obligation",
                "Built from your real reviews and photos",
                "Unlimited free changes",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green/10">
                <Mail className="h-5 w-5 text-green-dark" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-muted">Prefer email?</p>
                <a
                  href="mailto:ryan@growlocalvisibility.com"
                  className="font-medium text-foreground hover:text-green-dark"
                >
                  ryan@growlocalvisibility.com
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green/10">
                  <Check className="h-8 w-8 text-green" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">You&rsquo;re on the list.</h3>
                <p className="mt-2 text-sm text-muted">
                  We&rsquo;ll reply within 24 hours with your site link.
                </p>
              </div>
            ) : (
              <form action={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                    <input id="name" name="name" type="text" required autoComplete="name" placeholder="John Smith" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="business" className="mb-1.5 block text-sm font-medium">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                    <input id="business" name="business" type="text" required autoComplete="organization" placeholder="Smith's Plumbing" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                    <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="(555) 123-4567" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="maps" className="mb-1.5 block text-sm font-medium">
                    Google Maps link{" "}
                    <span className="font-normal text-muted">(optional, speeds us up)</span>
                  </label>
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                    <input id="maps" name="google-maps" type="url" placeholder="https://maps.google.com/..." className={inputClass} />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-lg bg-green py-3.5 text-sm font-semibold text-background transition-colors hover:bg-green-dark disabled:opacity-60"
                >
                  {pending ? "Sending..." : "Build My Free Website"}
                </button>
                <p className="text-center text-xs text-muted">
                  No credit card required. No spam. We reply within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER + STICKY MOBILE CTA                                         */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-border py-10 pb-24 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <a href="#" className="flex items-center gap-2 font-display font-semibold">
          <MapPin className="h-4 w-4 text-green" aria-hidden="true" />
          Grow<span className="text-green">Local</span>Visibility
        </a>
        <a href="mailto:ryan@growlocalvisibility.com" className="text-sm text-muted hover:text-foreground">
          ryan@growlocalvisibility.com
        </a>
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} Grow Local Visibility
        </p>
      </div>
    </footer>
  );
}

function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-lg md:hidden">
      <a
        href="#contact"
        className="flex items-center justify-center gap-2 rounded-lg bg-green py-3 text-sm font-semibold text-background"
      >
        Get My Free Website
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Services />
        <MissedCalls />
        <Compare />
        <Pricing />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
