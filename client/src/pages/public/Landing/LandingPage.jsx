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
  Utensils,
  Dumbbell,
  FileSearch,
  Bot,
  Award,
  CheckCircle,
  Zap,
} from "lucide-react";
import IconPng from "../../../assets/icons.png";
import AbstractPng from "../../../assets/abstract.png";
import backgroundPng from "../../../assets/womencherrybg.png";
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
    desc: "AI-powered screening tools built with input from practicing gynecologists.",
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
    title: "Dietary Management",
    desc: "Trimester-based meal plans tailored to your pregnancy needs.",
  },
  {
    icon: Dumbbell,
    title: "Maternity Exercises",
    desc: "Doctor-recommended, pregnancy-safe exercises with video guides.",
  },
  {
    icon: FileSearch,
    title: "Report Analyzer",
    desc: "Upload medical reports and get simple, easy-to-understand summaries.",
  },
  {
    icon: Bot,
    title: "Health Assistant",
    desc: "Guided symptom assessment and personalized self-care tips.",
  },
  {
    icon: BookOpen,
    title: "Health Education",
    desc: "Clear, judgment-free answers in English and Urdu.",
  },
];

const resources = [
  {
    category: "Articles",
    icon: BookOpen,
    items: [
      "Understanding PCOS: Symptoms and Management",
      "Your Guide to a Healthy Pregnancy",
      "Menstrual Health: What's Normal and What's Not",
      "Nutrition During Pregnancy: Essential Nutrients",
      "Exercise Safety During Pregnancy",
    ],
  },
  {
    category: "FAQs",
    icon: HelpCircle,
    items: [
      "What are the early signs of PCOS?",
      "When should I see a gynecologist?",
      "How does Flora protect my privacy?",
      "Is the AI diagnosis accurate?",
      "How do I connect with a doctor?",
    ],
  },
  {
    category: "Awareness",
    icon: Award,
    items: [
      "PCOS Awareness Month",
      "International Women's Health Day",
      "Maternal Health Week",
      "Reproductive Health Education",
    ],
  },
];

const reasons = [
  "Personal insights backed by real medical knowledge",
  "AI-powered screening for early detection",
  "Designed by women, for women",
  "Trusted by gynecologists and healthcare experts",
  "Your data stays private, encrypted, and yours alone",
  "Available in English and Urdu",
];

const trustPoints = [
  { icon: ShieldCheck, label: "Private & Secure" },
  { icon: Stethoscope, label: "Backed by Experts" },
  { icon: Sparkles, label: "AI-Powered" },
  { icon: Globe, label: "Bilingual (EN/UR)" },
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
    links: [
      { label: "Cycle Tracker", path: "/login" },
      { label: "PCOS Detection", path: "/login" },
      { label: "Pregnancy Care", path: "/login" },
      { label: "Doctor Chat", path: "/login" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Articles", path: "/login" },
      { label: "FAQs", path: "/login" },
      { label: "Health Glossary", path: "/login" },
      { label: "Support Center", path: "/login" },
    ],

  },
  {
    title: "Company",
    links: [
      { label: "About Us", path: "#about" },
      { label: "Contact Us", path: "#contact" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms & Conditions", path: "/terms" },
    ],
  },
];

// Mobile Nav Items
const mobileNavItems = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: Sparkles, label: "Features", href: "#features" },
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

  
  React.useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [menuOpen]);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-[#2B1620] antialiased">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
      />

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-[#ffcfdf] bg-[#FFF5F7]/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <FloraLogo />
          <nav className="hidden items-center gap-9 text-sm font-medium text-[#5B4650] md:flex">
            <a href="#features" className="transition hover:text-[#EB6991]">Features</a>
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
            className="md:hidden relative z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border border-[#FBE4EC] shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5 text-[#EB6991]" />
            ) : (
              <Menu className="h-5 w-5 text-[#5B4650]" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Transparent Background with Blur */}
        <div
          className={`
            fixed inset-x-0 bottom-0 z-40
            bg-white/80 backdrop-blur-xl
            transition-all duration-300 ease-in-out md:hidden
            ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          style={{ top: "72px", height: "calc(100dvh - 72px)" }}
        >
          <div className="relative flex flex-col h-full px-6 py-8 overflow-y-auto overscroll-contain mobile-menu-scroll">
            {/* Subtle decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EB6991]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F33B7D]/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#EB6991]/5 rounded-full blur-3xl" />

            {/* Main Navigation Items */}
            <div className="relative space-y-3">
              {mobileNavItems.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-md border border-[#FBE4EC]/60 shadow-sm hover:shadow-lg hover:border-[#EB6991]/40 transition-all duration-300 group hover:bg-white/80"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#FEE4EB] to-[#FDE3E5] text-[#EB6991] group-hover:bg-gradient-to-br group-hover:from-[#EB6991] group-hover:to-[#F33B7D] group-hover:text-white transition-all duration-300 shadow-[0_4px_12px_rgba(235,105,145,0.15)] group-hover:shadow-[0_8px_20px_rgba(235,105,145,0.35)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-base font-semibold text-[#2B1620] group-hover:text-[#EB6991] transition-colors duration-300">
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4 ml-auto text-[#B8AEB2] group-hover:text-[#EB6991] group-hover:translate-x-1 transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Divider with decorative dots */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#FBE4EC]/60"></div>
              </div>
              <div className="relative flex justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EB6991]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F33B7D]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EB6991]"></span>
              </div>
            </div>

            {/* Language & CTA */}
            <div className="relative space-y-4">
              <button className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-[#FBE4EC]/60 text-sm font-medium text-[#5B4650] hover:border-[#EB6991]/40 hover:shadow-md transition-all duration-300">
                <Globe className="h-4 w-4" />
                EN <ChevronDown className="h-3.5 w-3.5" />
              </button>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-full bg-gradient-to-r from-[#EB6991] to-[#F33B7D] text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(235,105,145,0.5)] hover:shadow-[0_12px_28px_-4px_rgba(235,105,145,0.6)] transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Links at bottom */}
            <div className="relative mt-6 flex justify-center gap-6 pb-6">
              <a href="#features" className="text-xs text-[#8F7C87] hover:text-[#EB6991] transition-colors" onClick={() => setMenuOpen(false)}>Features</a>
              <span className="text-[#FBE4EC]/60">|</span>
              <a href="#about" className="text-xs text-[#8F7C87] hover:text-[#EB6991] transition-colors" onClick={() => setMenuOpen(false)}>About</a>
              <span className="text-[#FBE4EC]/60">|</span>
              <a href="#resources" className="text-xs text-[#8F7C87] hover:text-[#EB6991] transition-colors" onClick={() => setMenuOpen(false)}>Resources</a>
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

  <div className="mx-auto max-w-7xl px-6 pt-40 pb-32 md:pt-48">
    <div className="max-w-lg ml-8 md:ml-16 lg:ml-24">
      <h1
        className="text-4xl font-semibold leading-[1.15] text-[#6E364B] sm:text-5xl"
        style={{ 
          fontFamily: "'Poppins', sans-serif",
          textShadow: '0 2px 20px rgba(255,255,255,0.8), 0 2px 4px rgba(255,255,255,0.9)'
        }}
      >
        Your Health.
        <br />
        Your Journey.
        <br />
        <span
          className="relative inline-block text-[#EB6991]"
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontStyle: "italic",
            textShadow: '0 2px 20px rgba(255,255,255,0.8), 0 2px 4px rgba(255,255,255,0.9)'
          }}
        >
          Your Flora.
        </span>
      </h1>
      <p 
        className="mt-6 max-w-md text-base leading-relaxed text-[#6E364B]"
        style={{
          textShadow: '0 2px 20px rgba(255,255,255,0.8), 0 2px 4px rgba(255,255,255,0.9)'
        }}
      >
        AI-powered gynecological health platform for cycle tracking,
        PCOS screening, pregnancy care, and doctor consultation.
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
<div className="mx-auto mt-6 max-w-7xl px-6 relative z-10">
  <div className="relative">
    {/* Decorative glow behind the trust bar */}
    <div className="absolute -inset-1 bg-gradient-to-r from-[#EB6991]/20 via-[#F33B7D]/10 to-[#EB6991]/20 rounded-[2rem] blur-xl opacity-70"></div>
    
    <div className="relative flex flex-col gap-6 rounded-[2rem] bg-white/50 backdrop-blur-md p-6 shadow-[0_20px_60px_-15px_rgba(235,105,145,0.3)] ring-1 ring-[#FDE3E5] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-7">
      {/* Left section with abstract */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#EB6991]/20 to-[#F33B7D]/20 blur-md"></div>
          <span className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FEE4EB] to-[#FDE3E5]">
            <img src={AbstractPng} alt="Abstract" className="h-16 w-auto object-cover" />
          </span>
        </div>
        <div>
          <p className="text-base font-semibold leading-snug text-[#2B1620]">
            Care that understands
            <br className="hidden sm:block" /> 
            <span className="text-[#EB6991]">you, naturally.</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <CheckCircle className="h-3.5 w-3.5 text-[#EB6991]" />
            <span className="text-xs text-[#8F7C87]">Trusted by women worldwide</span>
          </div>
        </div>
      </div>

      <div className="hidden h-10 w-px bg-gradient-to-b from-transparent via-[#F3DCE4] to-transparent sm:block" />

      {/* Trust Points */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        {trustPoints.map(({ icon: Icon, label }) => (
          <div key={label} className="group flex flex-col items-center gap-1.5 text-center transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FEE4EB] to-[#FDE3E5] text-[#EB6991] shadow-[0_4px_12px_rgba(235,105,145,0.15)] transition group-hover:shadow-[0_8px_20px_rgba(235,105,145,0.25)]">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-[#5B4650] group-hover:text-[#EB6991] transition-colors">{label}</span>
          </div>
        ))}
      </div>

      <div className="hidden h-10 w-px bg-gradient-to-b from-transparent via-[#F3DCE4] to-transparent sm:block" />

      {/* Social Proof - Only Rating */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 fill-[#EB6991] text-[#EB6991]" />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-[#2B1620]">4.8</span>
            <span className="text-[10px] text-[#8F7C87]">Avg. Rating</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Smooth transition wave to next section */}
        <div className="relative mt-16">
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[#FFF5F7]"></div>
        </div>
      </section>

      {/* FEATURES - With smooth pink gradient */}
      <section 
        id="features" 
        className="relative overflow-hidden py-20 bg-gradient-to-b from-[#FFF5F7] via-[#FDE8EE] to-[#FEF6F6]"
      >
        {/* Decorative top wave */}
        <div className="absolute top-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" fill="#FFF5F7" className="w-full">
            <path d="M0,0 C360,60 720,0 1080,40 C1260,60 1380,40 1440,20 L1440,0 L0,0 Z"/>
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EB6991]/10 text-[#EB6991] text-sm font-medium mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Comprehensive Care</span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-[#2B1620] sm:text-4xl">
              All the Tools You Need,{' '}
              <span className="text-[#EB6991]" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                in One Place
              </span>
            </h2>
            <p className="mt-4 text-base text-[#5B4650]">
              Everything you need to track, understand, and improve your
              health — thoughtfully designed around how women actually live.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl bg-white/50 backdrop-blur-sm p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] ring-1 ring-[#FBE4EC] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(235,105,145,0.25)] hover:ring-[#EB6991]/30 hover:bg-white"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEE4EB] to-[#FDE3E5] text-[#EB6991] shadow-[0_4px_10px_rgba(235,105,145,0.15)] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#EB6991] group-hover:to-[#F33B7D] group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(235,105,145,0.35)] group-hover:scale-110">
                  <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-display text-base font-semibold text-[#2B1620] group-hover:text-[#EB6991] transition-colors duration-300">
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

      {/* RESOURCES SECTION */}
      <section id="resources" className="py-20 bg-gradient-to-b from-[#FEF6F6] via-[#FFF5F7] to-[#FDE8EE]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-[#2B1620] sm:text-4xl">
              Health <span className="text-[#EB6991]" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>Resources</span>
            </h2>
            <p className="mt-4 text-[#5B4650]">
              Empowering you with knowledge in both English and Urdu.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {resources.map(({ category, icon: Icon, items }) => (
              <div
                key={category}
                className="rounded-2xl bg-white/90 backdrop-blur-sm p-6 ring-1 ring-[#FBE4EC] transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(235,105,145,0.2)] hover:ring-[#EB6991]/30 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FEE4EB] to-[#FDE3E5] text-[#EB6991]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#2B1620]">
                    {category}
                  </h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-[#5B4650] hover:text-[#EB6991] transition-colors cursor-pointer group/item">
                      <span className="mt-1 text-[#EB6991] transition-transform group-hover/item:scale-125">•</span>
                      <span className="group-hover/item:translate-x-0.5 transition-transform">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section id="about" className="py-20 bg-gradient-to-b from-[#FDE8EE] via-[#FEF6F6] to-[#FFF5F7]">
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
                <li key={reason} className="flex items-start gap-3 group">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#EB6991]/10 text-[#EB6991] group-hover:bg-[#EB6991] group-hover:text-white transition-all duration-300">
                    <Heart className="h-3 w-3 fill-current" strokeWidth={0} />
                  </span>
                  <span className="text-sm text-[#5B4650] group-hover:text-[#2B1620] transition-colors">{reason}</span>
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
        <div className="grid grid-cols-2 gap-6 rounded-3xl bg-[#FBE4EC]/50 backdrop-blur-sm p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] ring-1 ring-[#fcd3e2] sm:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center group">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FEE4EB] to-[#FDE3E5] text-[#EB6991] shadow-[0_4px_10px_rgba(235,105,145,0.15)] transition-all duration-300 group-hover:shadow-[0_8px_20px_rgba(235,105,145,0.3)] group-hover:scale-110">
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EB6991] to-[#F33B7D] px-8 py-14 text-center shadow-[0_30px_60px_-15px_rgba(235,105,145,0.5)] sm:px-16">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
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
<footer id="contact" className="border-t border-[#F7DCE4] bg-gradient-to-b from-[#FFF5F7] to-[#FEF6F6]">
  <div className="mx-auto max-w-7xl px-6 py-14">
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <FloraLogo />
        <p className="mt-4 max-w-xs text-sm text-[#8F7C87]">
          Your all-in-one platform for women's health and well-being.
        </p>
        <div className="mt-4">
          <p className="text-sm text-[#8F7C87]">
            <span className="font-medium text-[#5B4650]">Support:</span>{" "}
            <a 
              href="mailto:flora.app.project@gmail.com" 
              className="text-[#EB6991] hover:underline transition-colors"
            >
              flora.app.project@gmail.com
            </a>
          </p>
        </div>
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
            {col.links.map((link) => {
              const isTerms = link.label === "Terms & Conditions";
              const isPrivacy = link.label === "Privacy Policy";
              const isAbout = link.label === "About Us";
              const isContact = link.label === "Contact Us";
              const isLogin = link.path === "/login";
              
              return (
                <li key={link.label}>
                  {isTerms ? (
                    <Link
                      to={link.path}
                      className="text-sm text-[#8F7C87] hover:text-[#EB6991] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : isPrivacy ? (
                    <Link
                      to={link.path}
                      className="text-sm text-[#8F7C87] hover:text-[#EB6991] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : isAbout || isContact ? (
                    <a
                      href={link.path}
                      className="text-sm text-[#8F7C87] hover:text-[#EB6991] transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : isLogin ? (
                    <Link
                      to={link.path}
                      className="text-sm text-[#8F7C87] hover:text-[#EB6991] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-sm text-[#8F7C87] hover:text-[#EB6991] transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
    <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#F7DCE4] pt-6 text-xs text-[#8A7B8F] sm:flex-row">
      <p>© 2026 Flora. All rights reserved.</p>
      <p>Made with <span className="text-[#EB6991]">❤</span> for women everywhere.</p>
    </div>
  </div>
</footer>
    </div>
  );
}