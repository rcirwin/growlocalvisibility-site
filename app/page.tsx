"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { submitContactForm } from "./actions/contact";
import {
  Globe,
  MapPin,
  BarChart3,
  MessageSquare,
  Activity,
  Search,
  Hammer,
  Users,
  ChevronDown,
  Check,
  ArrowRight,
  Mail,
  Phone,
  Building2,
  User,
  MessageCircle,
  Star,
  Menu,
  X,
  ExternalLink,
  Link2,
} from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  NAVIGATION                                                         */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  THE PROBLEM                                                        */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  SERVICES / VALUE STACK                                             */
/* ------------------------------------------------------------------ */

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
      "A clear monthly report showing your traffic, rankings, and visibility. Know exactly what\u2019s working.",
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
      "See who\u2019s visiting your site, where they came from, and what pages they view. Real data, plain language.",
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

/* ------------------------------------------------------------------ */
/*  HOW IT WORKS                                                       */
/* ------------------------------------------------------------------ */

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
        "Once you\u2019re live, local customers searching for what you do will find you. More visibility means more calls, more jobs, more revenue.",
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
                <div className="absolute top-6 hidden border-t border-dashed border-border md:block" style={{ width: "calc(100% - 3rem)", left: "calc(50% + 1.5rem)" }} aria-hidden="true" />
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

/* ------------------------------------------------------------------ */
/*  PRICING                                                            */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  ABOUT                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    q: "Do I need to do anything?",
    a: "No. We handle everything, from building your website to optimizing your Google listing. You just keep running your business.",
  },
  {
    q: "What if I don't like the website?",
    a: "No problem at all. The preview is completely free. If you don't love it, you don't pay a thing. Zero commitment.",
  },
  {
    q: "Can I make changes?",
    a: "Absolutely. Unlimited changes are included in the $99/mo plan. Just let us know what you need and we'll take care of it.",
  },
  {
    q: "Do I need to be tech-savvy?",
    a: "Not at all. We handle all the technical stuff. If you can send a text message, you can work with us.",
  },
  {
    q: "What's included in the $99/month?",
    a: "Everything: website hosting and maintenance, Google Business Profile optimization, monthly SEO reports, automated review responses, and your analytics dashboard. No hidden fees.",
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
        <span className="pr-4 text-base font-medium">{faq.q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-muted">{faq.a}</p>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <section id="faq" className="border-t border-border py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green">
            Questions?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-12">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACT / CTA                                                      */
/* ------------------------------------------------------------------ */

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
    <section
      id="contact"
      className="border-t border-border bg-surface py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green">
              Get Started
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Get Found by More Customers?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Fill out the form and we&rsquo;ll get back to you within 24 hours
              with your free website preview. No obligations, no credit card, no
              risk.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green/10">
                  <Mail className="h-5 w-5 text-green" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted">Email us directly</p>
                  <a
                    href="mailto:ryan@growlocalvisibility.com"
                    className="font-medium text-foreground hover:text-green"
                  >
                    ryan@growlocalvisibility.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green/10">
                  <Check className="h-8 w-8 text-green" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">
                  Thank You!
                </h3>
                <p className="mt-2 text-sm text-muted">
                  We&rsquo;ll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form
                action={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Your Name
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                      aria-hidden="true"
                    />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="John Smith"
                      className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted/50 transition-colors focus:border-green focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="business"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                      aria-hidden="true"
                    />
                    <input
                      id="business"
                      name="business"
                      type="text"
                      required
                      placeholder="Smith's Plumbing"
                      className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted/50 transition-colors focus:border-green focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Phone
                    </label>
                    <div className="relative">
                      <Phone
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                      />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted/50 transition-colors focus:border-green focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                      />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted/50 transition-colors focus:border-green focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="google-maps"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Google Maps Link{" "}
                    <span className="text-muted">(paste your business listing URL)</span>
                  </label>
                  <div className="relative">
                    <Link2
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                      aria-hidden="true"
                    />
                    <input
                      id="google-maps"
                      name="google-maps"
                      type="url"
                      placeholder="https://maps.google.com/..."
                      className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted/50 transition-colors focus:border-green focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Message{" "}
                    <span className="text-muted">(optional)</span>
                  </label>
                  <div className="relative">
                    <MessageCircle
                      className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted"
                      aria-hidden="true"
                    />
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      placeholder="Tell us about your business..."
                      className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted/50 transition-colors focus:border-green focus:outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-lg bg-green py-3.5 text-sm font-semibold text-background transition-all hover:bg-green-dark hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
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

/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-green" aria-hidden="true" />
            <span>
              Grow<span className="text-green">Local</span> Visibility
            </span>
          </div>

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
        <Services />
        <HowItWorks />
        <About />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
