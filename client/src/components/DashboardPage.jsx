import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Repeat,
  Stethoscope,
  Baby,
  MessageCircle,
  HeartHandshake,
  Apple,
  FileText,
  BookOpen,
  Bell,
  User,
  Settings,
  LogOut,
  Search,
  Plus,
  CalendarClock,
  ChevronRight,
  Sparkles,
  Droplet,
  Moon,
  Activity as ActivityIcon,
  Upload,
  Calendar,
  ShieldCheck,
  ClipboardList,
  Dumbbell,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const navItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Repeat, label: "Cycle Tracker" },
  { icon: Stethoscope, label: "PCOS Detection" },
  { icon: Baby, label: "Pregnancy" },
  { icon: MessageCircle, label: "Chat", badge: 3 },
  { icon: HeartHandshake, label: "Health Assistant" },
  { icon: Apple, label: "Diet & Exercise" },
  { icon: FileText, label: "Reports" },
  { icon: BookOpen, label: "Education" },
  { icon: Bell, label: "Notifications", badge: 2 },
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Settings" },
];

const sparkline = (seed) =>
  Array.from({ length: 8 }, (_, i) => ({
    v: 10 + Math.abs(Math.sin(i / 1.3 + seed) * 8) + seed,
  }));

const stats = [
  {
    label: "Next Period",
    value: "5",
    unit: "",
    sub: "Days Left",
    color: "#F33B7D",
    icon: Calendar,
  },
  {
    label: "Cycle Day",
    value: "12",
    unit: "/28",
    sub: "Today",
    color: "#A855F7",
    icon: Repeat,
  },
  {
    label: "PCOS Risk",
    value: "Low",
    unit: "",
    sub: "Risk Level",
    color: "#22C55E",
    icon: ShieldCheck,
  },
  {
    label: "Pregnancy",
    value: "16 Weeks",
    unit: "",
    sub: "3rd Trimester",
    color: "#F59E0B",
    icon: Baby,
  },
  {
    label: "Unread Messages",
    value: "3",
    unit: "",
    sub: "From Doctor",
    color: "#3B82F6",
    icon: MessageCircle,
  },
];

const cycleLegend = [
  { label: "Period", days: "Day 1 - 5", color: "#F33B7D" },
  { label: "Fertile Window", days: "Day 10 - 16", color: "#A855F7" },
  { label: "Ovulation", days: "Day 14", color: "#22C55E" },
  { label: "Luteal Phase", days: "Day 15 - 28", color: "#D1D5DB" },
];

const cyclePieData = [
  { name: "Period", value: 5, color: "#F33B7D" },
  { name: "Follicular", value: 5, color: "#FBCFE8" },
  { name: "Fertile", value: 6, color: "#A855F7" },
  { name: "Luteal", value: 12, color: "#E5E7EB" },
];

const insights = [
  {
    icon: ActivityIcon,
    title: "Stay Active",
    detail: "You've completed 3 workouts this week",
    tag: "Great",
    tagColor: "#22C55E",
  },
  {
    icon: Droplet,
    title: "Hydration",
    detail: "You drank 6 of 8 glasses of water today",
    tag: "Good",
    tagColor: "#3B82F6",
  },
  {
    icon: Apple,
    title: "Nutrition",
    detail: "Keep eating more iron-rich foods",
    tag: "Improve",
    tagColor: "#F59E0B",
  },
  {
    icon: Moon,
    title: "Sleep",
    detail: "You slept 7h 20m on average",
    tag: "Good",
    tagColor: "#3B82F6",
  },
];

const reminders = [
  {
    title: "Doctor Appointment",
    time: "20 May 2025 · 10:00 AM",
    tag: "Tomorrow",
    tagColor: "#F33B7D",
  },
  {
    title: "Anomaly Scan",
    time: "25 May 2025 · 11:30 AM",
    tag: "5 Days Left",
    tagColor: "#A855F7",
  },
  {
    title: "Iron Supplement",
    time: "Daily",
    tag: "Daily",
    tagColor: "#F59E0B",
  },
  {
    title: "Blood Test",
    time: "30 May 2025 · 9:00 AM",
    tag: "10 Days Left",
    tagColor: "#3B82F6",
  },
];

const quickActions = [
  { icon: Calendar, label: "Log Period" },
  { icon: ShieldCheck, label: "PCOS Assessment" },
  { icon: Upload, label: "Upload Report" },
  { icon: MessageCircle, label: "Talk to Doctor" },
  { icon: BookOpen, label: "Health Education" },
  { icon: Dumbbell, label: "Diet & Exercise" },
];

const recentActivity = [
  {
    icon: Calendar,
    color: "#F33B7D",
    title: "Period Logged",
    detail: "Flow: Medium",
    time: "19 May 2025, 9:20 AM",
  },
  {
    icon: ClipboardList,
    color: "#A855F7",
    title: "Report Analyzed",
    detail: "Thyroid Report",
    time: "18 May 2025, 4:30 PM",
  },
  {
    icon: MessageCircle,
    color: "#22C55E",
    title: "Chat with Dr. Ayesha",
    detail: "Hello Doctor, I have a question...",
    time: "18 May 2025, 10:15 AM",
  },
  {
    icon: Dumbbell,
    color: "#F59E0B",
    title: "Workout Completed",
    detail: "Prenatal Yoga · 20 min",
    time: "17 May 2025, 8:45 AM",
  },
];

const cycleHistory = [
  { month: "Dec", period: 5, cycle: 27, ovulation: 13 },
  { month: "Jan", period: 6, cycle: 28, ovulation: 14 },
  { month: "Feb", period: 5, cycle: 29, ovulation: 15 },
  { month: "Mar", period: 5, cycle: 28, ovulation: 14 },
  { month: "Apr", period: 4, cycle: 27, ovulation: 13 },
  { month: "May", period: 5, cycle: 28, ovulation: 14 },
];

function Avatar({ name, size = "h-9 w-9" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-xs font-semibold text-white`}
    >
      {initials}
    </div>
  );
}

function Sparkline({ color, seed }) {
  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sparkline(seed)}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardPage() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#FEF4F4]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-gradient-to-b from-[#FEE4EB] to-[#FEF4F4] p-5 md:flex">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2">
          <img src="/icons.png" alt="Flora" className="h-7 w-auto object-cover scale-200" />
          <span className="font-display text-lg font-semibold text-[#0D0D0D]">
            Flora
          </span>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, active, badge }) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#F33B7D] text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)]"
                  : "text-[#3D3939] hover:bg-white/70"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                    active
                      ? "bg-white text-[#F33B7D]"
                      : "bg-[#F33B7D] text-white"
                  }`}
                >
                  {badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        <div className="mt-4 rounded-2xl bg-[#F33B7D] p-4 text-white shadow-[0_10px_24px_-4px_rgba(243,59,125,0.4)]">
          <p className="text-sm font-semibold">Talk to a Gynecologist</p>
          <p className="mt-1 text-xs text-white/85">
            Get expert advice for your health concerns
          </p>
          <button className="mt-3 w-full rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#F33B7D]">
            Start Chat
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between px-2">
          <span className="text-xs font-medium text-[#3D3939]">Light Mode</span>
          <div className="h-5 w-9 rounded-full bg-[#F33B7D] p-0.5">
            <div className="ml-auto h-4 w-4 rounded-full bg-white" />
          </div>
        </div>
        <button className="mt-2 px-2 text-left text-xs font-medium text-[#8F8C8C]">
          EN ▾
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-5 sm:p-7">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-[#0D0D0D] sm:text-2xl">
              Good Morning, Sarah!
            </h1>
            <p className="mt-0.5 text-sm text-[#8F8C8C]">
              Here's your personalized health overview.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />
              <input
                placeholder="Search anything..."
                className="w-56 rounded-xl border border-[#F0DCE4] bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
              />
            </div>

            {(notifOpen || profileOpen) && (
              <div
                className="fixed inset-0 z-10"
                onClick={() => {
                  setNotifOpen(false);
                  setProfileOpen(false);
                }}
              />
            )}

            <div className="relative z-20">
              <button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.06)] ring-1 ring-black/5 transition hover:-translate-y-0.5"
              >
                <Bell className="h-4 w-4 text-[#3D3939]" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F33B7D] text-[9px] font-semibold text-white">
                  3
                </span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                  <p className="px-3 py-2 text-xs font-semibold text-[#8F8C8C]">
                    Notifications
                  </p>
                  {reminders.slice(0, 3).map((r) => (
                    <div key={r.title} className="rounded-xl px-3 py-2 hover:bg-[#FEF4F4]">
                      <p className="text-sm font-medium text-[#0D0D0D]">{r.title}</p>
                      <p className="text-xs text-[#8F8C8C]">{r.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative z-20">
              <button
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <Avatar name="Sarah Khan" />
                <span className="hidden text-sm font-medium text-[#0D0D0D] sm:inline">
                  Sarah Khan
                </span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                  <a href="#" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#3D3939] hover:bg-[#FEF4F4]">
                    <User className="h-4 w-4" /> Profile
                  </a>
                  <a href="#" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#3D3939] hover:bg-[#FEF4F4]">
                    <Settings className="h-4 w-4" /> Settings
                  </a>
                  <Link to="/login" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#F33B7D] hover:bg-[#FEF4F4]">
                    <LogOut className="h-4 w-4" /> Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-end">
          <button className="flex items-center gap-1.5 rounded-full bg-[#FEE4EB] px-4 py-2 text-xs font-semibold text-[#F33B7D]">
            <Plus className="h-3.5 w-3.5" /> Log Health Data
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ label, value, unit, sub, color, icon: Icon }, i) => (
            <div
              key={label}
              className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${color}1A`, color }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <p className="text-xs text-[#8F8C8C]">{label}</p>
              </div>
              <p className="mt-2 font-display text-xl font-semibold" style={{ color: unit || sub === "Risk Level" || sub === "3rd Trimester" || sub === "From Doctor" || sub === "Today" ? "#0D0D0D" : color }}>
                {value}
                {unit && <span className="ml-0.5 text-sm font-normal text-[#B8AEB2]">{unit}</span>}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: label === "PCOS Risk" ? color : "#B8AEB2" }}>
                {sub}
              </p>
              <Sparkline color={color} seed={i} />
            </div>
          ))}
        </div>

        {/* Cycle Overview / Health Insights / Upcoming Reminders */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Cycle Overview */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                Cycle Overview
              </h2>
              <button className="text-xs font-semibold text-[#F33B7D]">
                View Calendar
              </button>
            </div>

            <div className="relative mx-auto h-36 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cyclePieData}
                    dataKey="value"
                    innerRadius={48}
                    outerRadius={64}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {cyclePieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs text-[#8F8C8C]">Day</p>
                <p className="font-display text-2xl font-semibold text-[#0D0D0D]">
                  12
                </p>
                <p className="text-xs text-[#8F8C8C]">of 28</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {cycleLegend.map(({ label, days, color }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-[#3D3939]">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </span>
                  <span className="text-[#B8AEB2]">{days}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#FEE4EB] p-3">
              <Sparkles className="h-4 w-4 flex-shrink-0 text-[#F33B7D]" />
              <p className="text-xs text-[#3D3939]">
                You are in your <span className="font-semibold text-[#F33B7D]">fertile window</span>. Chance of getting pregnant is high.
              </p>
              <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0 text-[#F33B7D]" />
            </div>
          </div>

          {/* Health Insights */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                Health Insights
              </h2>
              <button className="text-xs font-medium text-[#8F8C8C]">
                This Week ▾
              </button>
            </div>
            <div className="space-y-4">
              {insights.map(({ icon: Icon, title, detail, tag, tagColor }) => (
                <div key={title} className="flex items-start gap-3">
                  <span
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0D0D0D]">{title}</p>
                    <p className="truncate text-xs text-[#8F8C8C]">{detail}</p>
                  </div>
                  <span
                    className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
                  >
                    {tag}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center text-xs font-semibold text-[#F33B7D]">
              View Detailed Insights →
            </button>
          </div>

          {/* Upcoming Reminders + Tip of the Day */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                  Upcoming Reminders
                </h2>
                <button className="text-xs font-semibold text-[#F33B7D]">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {reminders.map(({ title, time, tag, tagColor }) => (
                  <div key={title} className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
                    >
                      <CalendarClock className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#0D0D0D]">{title}</p>
                      <p className="truncate text-xs text-[#8F8C8C]">{time}</p>
                    </div>
                    <span
                      className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
                    >
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#F33B7D] p-4 text-white shadow-[0_10px_24px_-4px_rgba(243,59,125,0.4)]">
              <p className="text-sm font-semibold">Tip of the Day</p>
              <p className="mt-1 max-w-[70%] text-xs text-white/85">
                A balanced diet and regular exercise can improve your mood and
                energy levels during pregnancy.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions + Recent Activity */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-4 font-display text-base font-semibold text-[#0D0D0D]">
              Quick Actions
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {quickActions.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl bg-[#FEF4F4] p-3 text-center transition hover:bg-[#FEE4EB]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#F33B7D] shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-medium leading-tight text-[#3D3939]">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                Recent Activity
              </h2>
              <button className="text-xs font-semibold text-[#F33B7D]">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentActivity.map(({ icon: Icon, color, title, detail, time }) => (
                <div key={title} className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}1A`, color }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0D0D0D]">{title}</p>
                    <p className="truncate text-xs text-[#8F8C8C]">{detail}</p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] text-[#B8AEB2]">
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cycle History + Premium Banner */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                Cycle History{" "}
                <span className="font-normal text-[#8F8C8C]">(Last 6 Cycles)</span>
              </h2>
              <div className="flex items-center gap-3 text-[10px] text-[#8F8C8C]">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#F33B7D]" /> Period Days
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#A855F7]" /> Cycle Length
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#22C55E]" /> Ovulation Day
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-48 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cycleHistory}>
                    <CartesianGrid vertical={false} stroke="#F5EAEF" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#8F8C8C" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#8F8C8C" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Bar dataKey="period" fill="#F33B7D" radius={[3, 3, 0, 0]} barSize={8} />
                    <Bar dataKey="cycle" fill="#A855F7" radius={[3, 3, 0, 0]} barSize={8} />
                    <Line
                      type="monotone"
                      dataKey="ovulation"
                      stroke="#22C55E"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="hidden w-32 flex-shrink-0 flex-col gap-3 sm:flex">
                <div className="rounded-xl bg-[#FEF4F4] p-3 text-center">
                  <p className="font-display text-lg font-semibold text-[#0D0D0D]">
                    28
                  </p>
                  <p className="text-[10px] text-[#8F8C8C]">
                    Avg Cycle Length (Days)
                  </p>
                </div>
                <div className="rounded-xl bg-[#FEF4F4] p-3 text-center">
                  <p className="font-display text-lg font-semibold text-[#0D0D0D]">
                    14
                  </p>
                  <p className="text-[10px] text-[#8F8C8C]">
                    Avg Ovulation Day
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#F33B7D] p-5 text-white shadow-[0_20px_40px_-10px_rgba(168,85,247,0.4)]">
            <p className="font-display text-base font-semibold">Flora Premium</p>
            <p className="mt-2 max-w-[75%] text-xs text-white/85">
              Unlock advanced insights, expert consultations and personalized
              health plans.
            </p>
            <button className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#F33B7D]">
              Explore Premium →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
