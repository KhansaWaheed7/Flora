import React, { useState } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import FloraLogo from "../../../components/common/Logo";
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
  Globe,
  ArrowRight,
  Home,
  Info,
  Mail as MailIcon,
  FileText,
  HelpCircle,
} from "lucide-react";
import IconPng from "../../../assets/icons.png";
import AbstractPng from "../../../assets/abstract.png";
import backgroundPng from "../../../assets/background.png";
import Background2Png from "../../../assets/background2.png";
import phoneMockupPng from "../../../assets/phone-mockup.png";

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

const trustPoints = [
  { icon: ShieldCheck, label: "Private & Secure" },
  { icon: Stethoscope, label: "Backed by Experts" },
  { icon: Sparkles, label: "Personalized for You" },
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

// Mobile Nav Items
const mobileNavItems = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: Sparkles, label: "Features", href: "#features" },
  { icon: Heart, label: "For You", href: "#for-you" },
  { icon: Info, label: "About Us", href: "#about" },
  { icon: FileText, label: "Resources", href: "#resources" },
  { icon: MailIcon, label: "Contact", href: "#contact" },
];

function FlowerMark({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path
        d="M16 16c0-4 2-7 2-7s2 3 2 7-2 7-2 7-2-3-2-7Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M16 16c-4 0-7 2-7 2s3 2 7 2 7-2 7-2-3-2-7-2Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M16 16c-2.8-2.8-6.5-3.3-6.5-3.3s.5 3.7 3.3 6.5c2.8 2.8 6.5 3.3 6.5 3.3s-.5-3.7-3.3-6.5Z"
        fill="currentColor"
        opacity="0.55"
      />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
    </svg>
  );
}

export default function FloraLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-[#2B1620] antialiased">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
      />

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-[#FBE4EC] bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <FloraLogo />
          <nav className="hidden items-center gap-9 text-sm font-medium text-[#5B4650] md:flex">
            <a href="#features" className="transition hover:text-[#EB6991]">Features</a>
            <a href="#for-you" className="transition hover:text-[#EB6991]">For You</a>
            <a href="#about" className="transition hover:text-[#EB6991]">About Us</a>
            <a href="#resources" className="transition hover:text-[#EB6991]">Resources</a>
            <a href="#contact" className="transition hover:text-[#EB6991]">Contact</a>
          </nav>
          <div className="hidden items-center gap-5 md:flex">
            <button className="flex items-center gap-1 text-sm font-medium text-[#5B4650]">
              <Globe className="h-4 w-4" />
              EN <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <Link
              to="/register"
              className="rounded-full bg-[#EB6991] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(235,105,145,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-4px_rgba(235,105,145,0.6)]"
            >
              Get Started
            </Link>
          </div>
          <button
            className="md:hidden relative z-50"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-[#EB6991]" />
            ) : (
              <Menu className="h-6 w-6 text-[#5B4650]" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Beautiful Overlay */}
        <div
          className={`
            fixed inset-0 z-40 bg-gradient-to-b from-[#FFF5F7] to-[#FEF6F6]
            transition-all duration-300 ease-in-out md:hidden
            ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          style={{ top: '72px' }}
        >
          <div className="flex flex-col h-full px-6 py-8 overflow-y-auto">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EB6991]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F33B7D]/5 rounded-full blur-3xl" />
            
            {/* Navigation Items */}
            <div className="relative space-y-2">
              {mobileNavItems.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#FBE4EC] shadow-sm hover:shadow-md hover:border-[#EB6991]/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FEE4EB] text-[#EB6991] group-hover:bg-[#EB6991] group-hover:text-white transition-colors duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#2B1620] group-hover:text-[#EB6991] transition-colors duration-200">
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4 ml-auto text-[#B8AEB2] group-hover:text-[#EB6991] group-hover:translate-x-1 transition-all duration-200" />
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#FBE4EC]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs font-medium text-[#B8AEB2] bg-[#FEF6F6]">or</span>
              </div>
            </div>

            {/* Language & CTA */}
            <div className="relative space-y-4">
              <button className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-[#FBE4EC] text-sm font-medium text-[#5B4650] hover:border-[#EB6991]/30 transition-all duration-200">
                <Globe className="h-4 w-4" />
                EN <ChevronDown className="h-3.5 w-3.5" />
              </button>
              
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-full bg-gradient-to-r from-[#EB6991] to-[#F33B7D] text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(235,105,145,0.5)] hover:shadow-[0_12px_24px_-4px_rgba(235,105,145,0.6)] transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="relative mt-8 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#FBE4EC]">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="-ml-2 h-8 w-8 rounded-full border-2 border-white bg-[#EB6991]/70 first:ml-0"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#2B1620]">50K+ Happy Women</p>
                  <p className="text-[10px] text-[#8F7C87]">Join the community</p>
                </div>
                <div className="h-8 w-px bg-[#FBE4EC]" />
                <div className="flex items-center gap-1 text-[#EB6991]">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold text-[#2B1620]">4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative overflow-hidden bg-cover bg-center -mt-23"
        style={{ backgroundImage: `url(${backgroundPng})` }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/40 via-transparent to-white/70" />

        <div className="mx-auto max-w-7xl px-6 pt-24 pb-32 md:pt-32">
          <div className="max-w-lg ml-8 md:ml-16 lg:ml-24">
            <h1
              className="text-4xl font-semibold leading-[1.15] text-[#6E364B] sm:text-5xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Your Health.
              <br />
              Your Journey.
              <br />
              <span
                className="relative inline-block text-[#EB6991]"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
              >
                Your Flora.
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6c30-8 60-8 98 0s70 6 98-2"
                    stroke="#F8A8C4"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#8F7C87]">
              Flora is your trusted companion for women's health, cycle
              tracking, PCOS care, and overall wellness.
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#EB6991] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(235,105,145,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_-6px_rgba(235,105,145,0.65)]"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* FLOATING TRUST BAR */}
        <div className="mx-auto -mt-16 max-w-6xl px-6">
          <div className="flex flex-col gap-6 rounded-[2rem] p-6 shadow-[0_25px_60px_-15px_rgba(236,213,214,0.4)] ring-1 ring-[#ECD5D6]/30 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-7" style={{ backgroundColor: '#FDE3E5' }}>
            <div className="flex items-center gap-3">
              <span className="flex h-28 w-20 flex-shrink-0 items-center justify-center rounded-full bg-[#FDE3E5] text-[#EB6991]">
                <img src={AbstractPng} alt="Abstract" className="h-25 w-auto object-cover" />
              </span>
              <p className="text-base font-semibold leading-snug text-[#2B1620]">
                Care that understands
                <br className="hidden sm:block" /> you, naturally.
              </p>
            </div>

            <div className="hidden h-10 w-px bg-[#F3DCE4] sm:block" />

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {trustPoints.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="h-7 w-7 text-[#EB6991]" />
                  <span className="text-xs font-medium text-[#5B4650]">{label}</span>
                </div>
              ))}
            </div>

            <div className="hidden h-10 w-px bg-[#F3DCE4] sm:block" />

            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="-ml-2 h-7 w-7 rounded-full border-2 border-white bg-[#EB6991]/70 first:ml-0"
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-[#5B4650]">
                  50K+ Happy Women
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1 text-[#EB6991]">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold text-[#2B1620]">4.8</span>
                </div>
                <span className="text-xs font-medium text-[#5B4650]">
                  Average Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section 
  id="features" 
  className="relative overflow-hidden py-20 bg-gradient-to-b from-[#ef90ac] via-[#F5A0B8] to-[#FEF6F6]"
>
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-[#6E364B] sm:text-4xl">
              Comprehensive Care, All in One Place
            </h2>
            <p className="mt-4 text-[#6E364B]">
              Everything you need to track, understand, and improve your
              health — thoughtfully designed around how women actually live.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-10px_rgba(235,105,145,0.25)] hover:ring-transparent"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#EB6991] shadow-[0_4px_10px_rgba(235,105,145,0.15)] transition group-hover:bg-[#EB6991] group-hover:text-white group-hover:shadow-[0_8px_16px_rgba(235,105,145,0.35)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-[#2B1620]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8F7C87]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section id="about" className="bg-[#FEF6F6] py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold text-[#2B1620] sm:text-4xl">
              Why Choose <span
                className="relative inline-block text-[#EB6991]"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
              >
                Flora
              </span>
            </h2>
            <ul className="mt-8 space-y-4">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#EB6991]/10 text-[#EB6991]">
                    <Heart className="h-3 w-3 fill-current" strokeWidth={0} />
                  </span>
                  <span className="text-sm text-[#5B4650]">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto flex h-full w-full max-w-[600px] items-center justify-center">
            <div className="relative w-full max-w-[500px]">
              <img
                src={phoneMockupPng}
                alt="Flora app dashboard preview"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-6 rounded-3xl bg-white p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEE4EB] text-[#EB6991] shadow-[0_4px_10px_rgba(235,105,145,0.15)]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display text-2xl font-semibold text-[#2B1620]">
                {value}
              </p>
              <p className="mt-1 text-xs text-[#8F7C87]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#EB6991] px-8 py-14 text-center shadow-[0_30px_60px_-15px_rgba(235,105,145,0.5)] sm:px-16">
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
            <Link to="/register" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#EB6991] shadow-[0_10px_24px_-4px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white/90">
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
              <FloraLogo />
              <p className="mt-4 max-w-xs text-sm text-[#8F7C87]">
                Your all-in-one platform for women's health and well-being.
              </p>
              <div className="mt-5 flex gap-3">
                {["instagram", "facebook", "twitter", "youtube"].map((name) => (
                  <a
                    key={name}
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EB6991] text-white shadow-[0_4px_10px_rgba(235,105,145,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(235,105,145,0.35)]"
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
                <h4 className="font-display text-sm font-semibold text-[#2B1620]">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-[#8F7C87] hover:text-[#EB6991]"
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