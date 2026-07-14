import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Calendar,
  Activity,
  Baby,
  MessageCircle,
  Apple,
  BookOpen,
  Star,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  Users,
  Stethoscope,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Cycle Tracking",
    desc: "Log your cycle and get predictions that get smarter every month.",
  },
  {
    icon: Activity,
    title: "PCOS Detection",
    desc: "Early screening tools built with input from practicing gynecologists.",
  },
  {
    icon: Baby,
    title: "Pregnancy Care",
    desc: "Week-by-week guidance from conception through postpartum.",
  },
  {
    icon: MessageCircle,
    title: "Doctor Chat",
    desc: "Message a verified doctor privately, whenever something feels off.",
  },
  {
    icon: Apple,
    title: "Diet & Exercise",
    desc: "Plans that adjust to your cycle phase, not a generic calendar.",
  },
  {
    icon: BookOpen,
    title: "Health Education",
    desc: "Clear, judgment-free answers to the questions you've always had.",
  },
];

const reasons = [
  "Personal insights backed by real medical knowledge",
  "Designed by women, for women",
  "Trusted by gynecologists and healthcare experts",
  "Your data stays private, encrypted, and yours alone",
  "Available in English and Urdu",
];

const stats = [
  { icon: Users, value: "30,000+", label: "Happy Users" },
  { icon: Stethoscope, value: "50+", label: "Expert Doctors" },
  { icon: Lock, value: "100%", label: "Confidential" },
  { icon: Star, value: "4.8/5", label: "Average Rating" },
];

const footerCols = [
  {
    title: "Product",
    links: ["Features", "How It Works", "Success Stories", "Pricing"],
  },
  {
    title: "Resources",
    links: ["Articles", "FAQs", "Health Glossary", "Support Center"],
  },
  {
    title: "Company",
    links: ["About Us", "Contact Us", "Privacy Policy", "Terms & Conditions"],
  },
];

function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2">
      <img src="/icons.png" alt="Flora" className="h-8 w-auto object-cover scale-200" />
      <span
        className={`font-display text-xl font-semibold tracking-tight ${
          light ? "text-white" : "text-[#0D0D0D]"
        }`}
      >
        Flora
      </span>
    </div>
  );
}

function PhoneIllustration() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[300px] items-center justify-center">
      <div className="absolute -top-6 -left-8 h-24 w-24 rounded-full bg-[#F33B7D]/15 blur-2xl" />
      <div className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full bg-[#F33B7D]/20 blur-2xl" />
      <img
        src="/phone-mockup.png"
        alt="Flora app dashboard preview"
        className="relative w-full max-w-[260px] drop-shadow-[0_35px_60px_rgba(243,59,125,0.35)]"
      />
      <Sparkles className="absolute -right-2 top-6 h-6 w-6 text-[#F33B7D] drop-shadow-[0_4px_6px_rgba(243,59,125,0.4)]" />
      <Sparkles className="absolute -left-3 bottom-10 h-4 w-4 text-[#F33B7D]/70" />
    </div>
  );
}

export default function FloraLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-[#0D0D0D] antialiased">
      <style>{`
        .font-display { font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif; }
        .font-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap"
      />

      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/80 shadow-[0_1px_20px_rgba(243,59,125,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#3D3939] md:flex">
            <a href="#home" className="hover:text-[#F33B7D]">Home</a>
            <a href="#features" className="hover:text-[#F33B7D]">Features</a>
            <a href="#about" className="hover:text-[#F33B7D]">About Us</a>
            <a href="#contact" className="hover:text-[#F33B7D]">Contact</a>
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <button className="flex items-center gap-1 text-sm font-medium text-[#3D3939]">
              EN <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <Link to="/register" className="rounded-full bg-[#F33B7D] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-4px_rgba(243,59,125,0.6)]">
              Get Started
            </Link>
          </div>
          <button
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="flex flex-col gap-4 border-t border-[#F7DCE4] px-6 py-4 text-sm font-medium text-[#3D3939] md:hidden">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
            <Link to="/register" className="mt-2 rounded-full bg-[#F33B7D] px-5 py-2.5 text-center text-white">
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FEF4F4] to-white" />
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FEE4EB] px-3 py-1 text-xs font-semibold text-[#F33B7D] shadow-[0_4px_10px_rgba(243,59,125,0.1)]">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted women's health platform
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight text-[#0D0D0D] sm:text-5xl">
              Your Health.
              <br />
              <span className="text-[#F33B7D]">Our Priority.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#8F8C8C]">
              Flora is your all-in-one women's health platform. Track,
              understand and take control of your well-being with smart
              insights and expert care.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_-6px_rgba(243,59,125,0.65)]">
                Get Started Free
              </Link>
              <a href="#features" className="rounded-full border border-[#E9D2E0] bg-white px-6 py-3 text-sm font-semibold text-[#0D0D0D] shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
                Explore Features
              </a>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <div className="flex items-center">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="-ml-2 h-8 w-8 rounded-full border-2 border-white bg-[#F33B7D]/70 first:ml-0"
                  />
                ))}
                <span className="ml-3 text-xs text-[#8F8C8C]">
                  Trusted by 30,000+ women
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-[#F33B7D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#8F8C8C]">4.8 (12k+ reviews)</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-14 -right-10 h-52 w-52 rounded-full bg-[#F33B7D]/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-[#F33B7D]/10 blur-3xl" />
            <div className="relative">
              <img
                src="/hero.png"
                alt="Woman using the Flora app"
                className="w-full rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(243,59,125,0.35)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-[#0D0D0D] sm:text-4xl">
            Comprehensive Care, All in One Place
          </h2>
          <p className="mt-4 text-[#8F8C8C]">
            Everything you need to track, understand, and improve your
            health — thoughtfully designed around how women actually live.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-10px_rgba(243,59,125,0.25)] hover:ring-transparent"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D] shadow-[0_4px_10px_rgba(243,59,125,0.15)] transition group-hover:bg-[#F33B7D] group-hover:text-white group-hover:shadow-[0_8px_16px_rgba(243,59,125,0.35)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#0D0D0D]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8F8C8C]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section id="about" className="bg-[#FEF6F6] py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold text-[#0D0D0D] sm:text-4xl">
              Why Choose <span className="text-[#F33B7D]">Flora?</span>
            </h2>
            <ul className="mt-8 space-y-4">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D]/10 text-[#F33B7D]">
                    <Heart className="h-3 w-3 fill-current" strokeWidth={0} />
                  </span>
                  <span className="text-sm text-[#3D3939]">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <PhoneIllustration />
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-6 rounded-3xl bg-white p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEE4EB] text-[#F33B7D] shadow-[0_4px_10px_rgba(243,59,125,0.15)]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display text-2xl font-semibold text-[#0D0D0D]">
                {value}
              </p>
              <p className="mt-1 text-xs text-[#8F8C8C]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#F33B7D] px-8 py-14 text-center shadow-[0_30px_60px_-15px_rgba(243,59,125,0.5)] sm:px-16">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-white/10" />
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Take Charge of Your Health Today
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/90">
            Join thousands of women already tracking, understanding, and
            improving their well-being with Flora.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#F33B7D] shadow-[0_10px_24px_-4px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white/90">
              Get Started for Free
            </Link>
            <a href="#features" className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="border-t border-[#F7DCE4] bg-[#FEF6F6]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-4 max-w-xs text-sm text-[#8F8C8C]">
                Your all-in-one platform for women's health and well-being.
              </p>
              <div className="mt-5 flex gap-3">
                {["instagram", "facebook", "twitter", "youtube"].map((name) => (
                  <a
                    key={name}
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F33B7D] text-white shadow-[0_4px_10px_rgba(243,59,125,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(243,59,125,0.35)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                      {name === "facebook" && (
                        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
                      )}
                      {name === "twitter" && (
                        <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.6 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.4a11.7 11.7 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" />
                      )}
                      {name === "instagram" && (
                        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.6.5.6.3 1.1.6 1.6 1.1.5.5.8 1 1.1 1.6.2.6.4 1.4.5 2.6.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.5 2.6a4.4 4.4 0 0 1-2.7 2.7c-.6.2-1.4.4-2.6.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.6-.5a4.4 4.4 0 0 1-2.7-2.7c-.2-.6-.4-1.4-.5-2.6-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-2 .5-2.6.3-.6.6-1.1 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.2 1.4-.4 2.6-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-2 .4-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 2 .2.5.4.8.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 2-.4.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-2a3.3 3.3 0 0 0-.8-1.2 3.3 3.3 0 0 0-1.2-.8c-.4-.2-1-.3-2-.4-1.2-.1-1.6-.1-4.7-.1zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.2-2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
                      )}
                      {name === "youtube" && (
                        <path d="M23 12s0-3.6-.5-5.3a2.9 2.9 0 0 0-2-2C18.7 4.2 12 4.2 12 4.2s-6.7 0-8.5.5a2.9 2.9 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3a2.9 2.9 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.9 2.9 0 0 0 2-2C23 15.6 23 12 23 12zM9.7 15.5V8.5l6 3.5-6 3.5z" />
                      )}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            {footerCols.map((col) => (
              <div key={col.title}>
                <h4 className="font-display text-sm font-semibold text-[#0D0D0D]">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-[#8F8C8C] hover:text-[#F33B7D]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#F7DCE4] pt-6 text-xs text-[#8A7B8F] sm:flex-row">
            <p>© 2025 Flora. All rights reserved.</p>
            <p>Made with ❤ for women everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
