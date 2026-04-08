# Grow Local Visibility Site Redesign — Clean Agency Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign growlocalvisibility.com from a dark techy aesthetic to a light, professional "clean agency" look that converts warm leads (local service business owners who received a cold pitch) into paying customers.

**Architecture:** Single-file page.tsx rewrite + globals.css update + layout.tsx font change. No new routes, no new dependencies beyond the font import. All existing logic (contact form, FAQ accordion, server actions) is preserved verbatim — only styles and copy change.

**Tech Stack:** Next.js 16.2, Tailwind v4, Lucide React (kept), Plus Jakarta Sans (Google Fonts), Resend (unchanged)

**Design decisions:**
- Light base: `#fafaf9` bg, `#ffffff` surfaces, `stone-950` text
- Single green accent: `#16a34a` (darker, more established than current `#22c55e`)
- Font: Plus Jakarta Sans replaces Geist (loaded via next/font/google)
- Hero: left-aligned split layout (text left, stats/trust right) — not centered
- Section rhythm: alternating white / stone-50 backgrounds, not uniform dark borders
- Icons: Lucide kept (already installed, switching would be churn with no visual payoff)
- Animations: button `:active` scale(0.97) only — nothing more per emil-design-eng rules
- Copy: rewritten for warm-lead trust conversion throughout

---

### Task 1: Update globals.css — light palette + font variables

**Files:**
- Modify: `app/globals.css`

**Step 1: Replace the entire file**

```css
@import "tailwindcss";

:root {
  --background: #fafaf9;
  --surface: #ffffff;
  --foreground: #0c0a09;
  --muted: #78716c;
  --border: #e7e5e4;
  --green: #16a34a;
  --green-dark: #15803d;
  --green-light: #f0fdf4;
  --green-muted: #dcfce7;
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-green: var(--green);
  --color-green-dark: var(--green-dark);
  --color-green-light: var(--green-light);
  --color-green-muted: var(--green-muted);
  --font-sans: var(--font-jakarta);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-jakarta), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Button press feedback — emil-design-eng */
button:active:not(:disabled),
a.btn:active {
  transform: scale(0.97);
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--background); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--muted); }
```

**Step 2: Verify no build errors**
```bash
cd ~/growlocalvisibility-site && npm run build 2>&1 | tail -10
```
Expected: clean build

**Step 3: Commit**
```bash
git add app/globals.css
git commit -m "design: light palette + jakarta sans css vars"
```

---

### Task 2: Update layout.tsx — swap Geist for Plus Jakarta Sans

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Replace font import and apply variable**

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Grow Local Visibility | Professional Websites for Local Businesses",
  description:
    "We build professional websites and manage your Google presence so local customers find you first. Free preview — no risk, no commitment.",
  keywords: [
    "local business website",
    "Google Business Profile",
    "local SEO",
    "small business marketing",
    "get more customers",
    "local service business",
  ],
  authors: [{ name: "Ryan Irwin" }],
  openGraph: {
    title: "Grow Local Visibility | Professional Websites for Local Businesses",
    description:
      "We build professional websites and manage your Google presence so local customers find you first.",
    url: "https://growlocalvisibility.com",
    siteName: "Grow Local Visibility",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grow Local Visibility | Professional Websites for Local Businesses",
    description:
      "We build professional websites and manage your Google presence so local customers find you first.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Step 2: Build check**
```bash
npm run build 2>&1 | tail -10
```

**Step 3: Commit**
```bash
git add app/layout.tsx
git commit -m "design: swap Geist for Plus Jakarta Sans"
```

---

### Task 3: Rewrite page.tsx — Navbar

**Files:**
- Modify: `app/page.tsx` (Navbar component only)

**Step 1: Replace Navbar function**

Remove `MapPin` from nav logo. Keep all existing imports. Replace `Navbar`:

```tsx
function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Services", href: "#services" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface/90 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-base font-bold tracking-tight text-foreground">
          Grow<span className="text-green">Local</span>Visibility
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-green px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-dark"
          >
            Get Started Free
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
        <div className="border-t border-border bg-surface px-6 py-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-green px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-green-dark"
          >
            Get Started Free
          </a>
        </div>
      )}
    </nav>
  );
}
```

**Step 2: Build check**
```bash
npm run build 2>&1 | tail -10
```

**Step 3: Commit**
```bash
git add app/page.tsx
git commit -m "design: navbar — light bg, wordmark logo, pill CTA"
```

---

### Task 4: Rewrite Hero — left-aligned split layout

**Step 1: Replace Hero function**

```tsx
function Hero() {
  return (
    <section className="relative min-h-[100dvh] pt-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">
        {/* Left: copy */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-muted bg-green-light px-4 py-1.5 text-sm font-medium text-green">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Free preview — no credit card, no commitment
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your Business Deserves to Be{" "}
            <span className="text-green">Found</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            We build a professional website and optimize your Google presence so
            local customers find you — not your competitors. You see the site
            first. You only pay if you love it.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-green px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-green-dark"
            >
              See What We Build
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-base font-medium text-muted transition-colors hover:border-foreground hover:text-foreground"
            >
              How It Works
            </a>
          </div>
        </div>

        {/* Right: trust stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              value: "97%",
              label: "of people search online before calling a local business",
              icon: Search,
            },
            {
              value: "46%",
              label: "of all Google searches are looking for something local",
              icon: MapPin,
            },
            {
              value: "70%",
              label: "of customers skip businesses with no website",
              icon: Globe,
            },
            {
              value: "$0",
              label: "to see your completed website — we build it first",
              icon: Check,
            },
          ].map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm shadow-stone-100"
            >
              <stat.icon className="h-5 w-5 text-green" aria-hidden="true" />
              <p className="mt-3 text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Build + commit**
```bash
npm run build 2>&1 | tail -10
git add app/page.tsx
git commit -m "design: hero — split layout, left-aligned, trust stat cards"
```

---

### Task 5: Rewrite Problem section

**Step 1: Replace Problem function**

The Problem section now flows naturally from the hero stats — keep it brief, punchy.

```tsx
function Problem() {
  return (
    <section className="border-t border-border bg-stone-50 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          You&rsquo;re Great at What You Do.
          <br />
          <span className="text-muted">But Can Customers Find You?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Most local service businesses win on quality — but lose customers every
          day because they don&rsquo;t show up when people search. Your
          competitors are getting those calls. We fix that.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-full bg-green px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-dark"
          >
            See What&rsquo;s Included
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Build + commit**
```bash
npm run build 2>&1 | tail -10
git add app/page.tsx
git commit -m "design: problem section — punchy copy, stone-50 bg"
```

---

### Task 6: Rewrite Services section

**Step 1: Replace the `services` array and `Services` function**

```tsx
const services = [
  {
    icon: Globe,
    title: "Professional Website",
    description:
      "Custom-built, mobile-first, and SEO-ready. Your site is built specifically for your business — not a template anyone else has.",
  },
  {
    icon: MapPin,
    title: "Google Business Profile",
    description:
      "We optimize your Google listing so you rank higher when people nearby search for what you do.",
  },
  {
    icon: BarChart3,
    title: "Monthly SEO Report",
    description:
      "A clear monthly report showing your traffic, rankings, and visibility. Know exactly what&rsquo;s working.",
  },
  {
    icon: MessageSquare,
    title: "Automated Review Responses",
    description:
      "Every Google review gets a professional response — automatically, 24/7. Never let a review go unanswered.",
  },
  {
    icon: Activity,
    title: "Analytics Dashboard",
    description:
      "See who&rsquo;s visiting your site, where they came from, and what pages they view. Real data, plain language.",
  },
];

function Services() {
  return (
    <section id="services" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Everything Included
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            One Plan. Your Complete Online Presence.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Everything below is included. No add-ons, no hidden fees, no tech
            skills required on your end.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-border bg-surface p-7 transition-all hover:border-green/40 hover:shadow-md hover:shadow-stone-100"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-light">
                <service.icon className="h-5 w-5 text-green" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
            </div>
          ))}

          <div className="flex flex-col items-start justify-between rounded-2xl border border-dashed border-green/40 bg-green-light p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green/10">
              <Star className="h-5 w-5 text-green" aria-hidden="true" />
            </div>
            <div className="mt-5">
              <h3 className="text-base font-semibold text-foreground">
                All of the Above
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Every service above is included in one simple monthly price.
              </p>
              <a
                href="#pricing"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:text-green-dark transition-colors"
              >
                See pricing <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Build + commit**
```bash
npm run build 2>&1 | tail -10
git add app/page.tsx
git commit -m "design: services — left-aligned header, tinted CTA card"
```

---

### Task 7: Rewrite How It Works section

**Step 1: Replace HowItWorks function**

```tsx
function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "We Research Your Business",
      description:
        "We find your Google listing, study your reviews, and learn what makes your business stand out. No questionnaires. No homework for you.",
    },
    {
      num: "02",
      icon: Hammer,
      title: "We Build Your Online Presence",
      description:
        "A professional website, optimized Google profile, automated review responses, and analytics — all set up and ready before we reach out.",
    },
    {
      num: "03",
      icon: Users,
      title: "You Start Showing Up",
      description:
        "Once you&rsquo;re live, local customers searching for what you do will find you. More visibility means more calls, more jobs, more revenue.",
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-border bg-stone-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            The Process
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            We Do the Work. You Get the Customers.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Three steps. Zero hassle. You don&rsquo;t touch a thing until you
            see your finished site.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute top-6 left-full hidden w-full border-t border-dashed border-border md:block" style={{ width: "calc(100% - 3rem)", left: "calc(50% + 1.5rem)" }} aria-hidden="true" />
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-green bg-green-light">
                <step.icon className="h-5 w-5 text-green" aria-hidden="true" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-green">
                Step {step.num}
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-green px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-green-dark"
          >
            Get My Free Preview
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Build + commit**
```bash
npm run build 2>&1 | tail -10
git add app/page.tsx
git commit -m "design: how it works — left-aligned, step connectors"
```

---

### Task 8: Rewrite About section

**Step 1: Replace About function**

```tsx
function About() {
  return (
    <section id="about" className="border-t border-border py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-center md:gap-16">
          <a
            href="https://www.linkedin.com/in/ryan-irwin-tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0"
            aria-label="Ryan Irwin on LinkedIn"
          >
            <div className="relative">
              <Image
                src="/ryan.jpg"
                alt="Ryan Irwin, founder of Grow Local Visibility"
                width={200}
                height={200}
                className="rounded-2xl border border-border object-cover transition-all group-hover:border-green"
                priority={false}
              />
              <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-md transition-transform group-hover:scale-110">
                <LinkedinIcon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          </a>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green">
              About
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Hi, I&rsquo;m Ryan.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              I started Grow Local Visibility because I kept seeing the same
              problem: talented tradespeople and local service pros losing
              customers to competitors — not because they did worse work, but
              because they were invisible online. I handle everything technical
              so you can stay focused on the work you&rsquo;re good at.
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              Every site I build is researched and written specifically for your
              business. Not a template. Not a form you fill out. I do the
              work upfront — you only pay if you want to keep it.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="https://www.linkedin.com/in/ryan-irwin-tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                <LinkedinIcon className="h-4 w-4 text-[#0A66C2]" aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green transition-colors hover:text-green-dark"
              >
                Work with me
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Build + commit**
```bash
npm run build 2>&1 | tail -10
git add app/page.tsx
git commit -m "design: about — left-aligned, expanded copy, cleaner photo"
```

---

### Task 9: Rewrite Pricing section

**Step 1: Replace Pricing function**

```tsx
function Pricing() {
  const plans = [
    {
      name: "Free Preview",
      price: "$0",
      period: "",
      description: "We build your site first. You see it, review it, and decide. No risk, no card required.",
      features: [
        "Custom-built website preview",
        "See your site before committing",
        "No credit card required",
        "Zero obligation",
      ],
      cta: "Request Free Preview",
      href: "#contact",
      highlighted: false,
    },
    {
      name: "Keep It Live",
      price: "$99",
      period: "/mo",
      description: "Everything you need to stay found online — website, Google, reviews, and analytics. All handled.",
      features: [
        "Professional website, hosted & maintained",
        "Google Business Profile optimization",
        "Monthly SEO performance report",
        "Automated Google review responses",
        "Analytics dashboard",
        "Unlimited content changes",
        "Priority support",
      ],
      cta: "Start With Free Preview",
      href: "#contact",
      highlighted: true,
    },
    {
      name: "Own It Outright",
      price: "$500",
      period: " one-time",
      description: "Get the full source code. Host it yourself, wherever you want. Yours permanently.",
      features: [
        "Full website source code",
        "Deploy to any host",
        "One-time payment",
        "No ongoing fees",
      ],
      cta: "Request Free Preview",
      href: "#contact",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="border-t border-border bg-stone-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            No Surprises. No Contracts.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Start free. Keep it only if you love it.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-green bg-surface shadow-lg shadow-green/5"
                  : "border-border bg-surface"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-green px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-muted">{plan.period}</span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {plan.description}
              </p>

              <ul className="mt-8 flex-1 space-y-3" role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-green text-white hover:bg-green-dark"
                    : "border border-border text-foreground hover:border-green hover:text-green"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Build + commit**
```bash
npm run build 2>&1 | tail -10
git add app/page.tsx
git commit -m "design: pricing — left-aligned header, stone-50 bg, refined copy"
```

---

### Task 10: Rewrite FAQ + Contact + Footer

**Step 1: Replace FAQItem and FAQ functions**

```tsx
function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span className="pr-4 text-sm font-semibold text-foreground">{faq.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-5" : "max-h-0"}`}>
        <p className="text-sm leading-relaxed text-muted">{faq.a}</p>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <section id="faq" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Common Questions
            </h2>
            <p className="mt-4 text-lg text-muted">
              Everything you need to know before getting started.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-green transition-colors hover:text-green-dark"
            >
              Still have questions? Reach out
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} faq={faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Replace Contact function**

Keep all form logic (`handleSubmit`, `isPending`, `submitted`, `error`) exactly as-is. Only change styles and copy:

```tsx
function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <section id="contact" className="border-t border-border bg-stone-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green">
              Get Started
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Request Your Free Preview
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Fill out the form and we&rsquo;ll get back to you within 24 hours
              with a preview of your new website. No obligations, no credit
              card, no risk.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-light">
                  <Check className="h-5 w-5 text-green" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted">
                  We research and build your site before you commit to anything
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-light">
                  <Check className="h-5 w-5 text-green" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted">
                  You only pay if you want to keep it live
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-light">
                  <Check className="h-5 w-5 text-green" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted">
                  Questions? Email{" "}
                  <a
                    href="mailto:ryan@growlocalvisibility.com"
                    className="font-medium text-foreground hover:text-green transition-colors"
                  >
                    ryan@growlocalvisibility.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm shadow-stone-100">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-light">
                  <Check className="h-7 w-7 text-green" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">You&rsquo;re on the list!</h3>
                <p className="mt-2 text-sm text-muted">
                  We&rsquo;ll be in touch within 24 hours with your preview.
                </p>
              </div>
            ) : (
              <form action={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                    <input
                      id="name" name="name" type="text" required
                      placeholder="John Smith"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-green focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="business" className="mb-1.5 block text-sm font-medium text-foreground">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                    <input
                      id="business" name="business" type="text" required
                      placeholder="Smith's Plumbing"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-green focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                      <input
                        id="phone" name="phone" type="tel"
                        placeholder="(555) 123-4567"
                        className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-green focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                      <input
                        id="email" name="email" type="email" required
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-green focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="google-maps" className="mb-1.5 block text-sm font-medium text-foreground">
                    Google Maps Link{" "}
                    <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                    <input
                      id="google-maps" name="google-maps" type="url"
                      placeholder="https://maps.google.com/..."
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-green focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                    Message{" "}
                    <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <MessageCircle className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden="true" />
                    <textarea
                      id="message" name="message" rows={3}
                      placeholder="Tell us about your business..."
                      className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-green focus:outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-full bg-green py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "Sending..." : "Get My Free Preview"}
                </button>

                <p className="text-center text-xs text-muted">
                  No credit card required. We&rsquo;ll never spam you.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Replace Footer function**

```tsx
function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-bold tracking-tight text-foreground">
            Grow<span className="text-green">Local</span>Visibility
          </span>
          <a
            href="mailto:ryan@growlocalvisibility.com"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            ryan@growlocalvisibility.com
          </a>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Grow Local Visibility
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 4: Final build check**
```bash
npm run build 2>&1 | tail -15
```
Expected: clean build, no type errors

**Step 5: Commit**
```bash
git add app/page.tsx
git commit -m "design: FAQ split layout, contact light theme, footer wordmark"
```

---

### Task 11: Push and verify

**Step 1: Push to GitHub**
```bash
git push origin main
```

**Step 2: Confirm Vercel auto-deploy picks it up**
Check https://github.com/rcirwin/growlocalvisibility-site/actions or Vercel dashboard.

**Step 3: Smoke-check live site**
- [ ] Font loads (Plus Jakarta Sans visible, not system fallback)
- [ ] Light background throughout (no dark sections)
- [ ] Hero: left-aligned on desktop, stacked on mobile
- [ ] Contact form submits successfully
- [ ] All nav anchors scroll to correct sections

---

**Skills applied in this redesign:**
- `frontend-design` — production-grade design structure, no generic AI aesthetics
- `high-end-visual-design` — agency quality bar, banned patterns avoided
- `design-taste-frontend` — layout variance, left-aligned headers, stone-50 section rhythm
- `emil-design-eng` — button `:active` scale(0.97) only, no gratuitous animations
