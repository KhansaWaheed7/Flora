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
  Camera,
  Cake,
  Venus,
  Droplet,
  MapPin,
  ChevronRight,
  UserCog,
  ShieldCheck,
  KeyRound,
  Heart,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard" },
  { icon: Repeat, label: "Cycle Tracker" },
  { icon: Stethoscope, label: "PCOS Detection" },
  { icon: Baby, label: "Pregnancy" },
  { icon: MessageCircle, label: "Chat" },
  { icon: HeartHandshake, label: "Health Assistant" },
  { icon: Apple, label: "Diet & Exercise" },
  { icon: FileText, label: "Reports" },
  { icon: BookOpen, label: "Education" },
  { icon: Bell, label: "Notifications" },
  { icon: User, label: "Profile", active: true },
  { icon: Settings, label: "Settings" },
];

const reminders = [
  { title: "Doctor Appointment", time: "20 May 2025 · 10:00 AM" },
  { title: "Anomaly Scan", time: "25 May 2025 · 11:30 AM" },
];

const badges = [
  { icon: Cake, value: "12 March 1996", label: "Date of Birth" },
  { icon: Venus, value: "Female", label: "Gender" },
  { icon: Droplet, value: "B+", label: "Blood Group" },
  { icon: MapPin, value: "Lahore, Pakistan", label: "Location" },
];

const healthSummary = [
  { label: "Cycle Length", value: "28 Days", sub: "Average" },
  { label: "Period Length", value: "5 Days", sub: "Average" },
  { label: "Last Period", value: "10 May 2025", sub: "" },
  { label: "Next Period", value: "15 May 2025", sub: "In 5 Days" },
];

const quickActions = [
  { icon: UserCog, label: "Edit Profile", to: "/profile/edit" },
  { icon: ShieldCheck, label: "Account Settings", to: "/settings" },
  { icon: Heart, label: "Health Preferences", to: "/settings" },
  { icon: KeyRound, label: "Privacy & Security", to: "/settings" },
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

export default function ProfilePage() {
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
          {navItems.map(({ icon: Icon, label, active }) => (
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
              My Profile
            </h1>
            <p className="mt-0.5 text-sm text-[#8F8C8C]">
              Manage your personal information and health preferences.
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
                  2
                </span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                  <p className="px-3 py-2 text-xs font-semibold text-[#8F8C8C]">
                    Notifications
                  </p>
                  {reminders.map((r) => (
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
                  <Link to="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#3D3939] hover:bg-[#FEF4F4]">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#3D3939] hover:bg-[#FEF4F4]">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <Link to="/login" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#F33B7D] hover:bg-[#FEF4F4]">
                    <LogOut className="h-4 w-4" /> Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile summary + completion */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
            <div className="flex flex-wrap items-start gap-5">
              <div className="relative">
                <Avatar name="Sarah Khan" size="h-20 w-20 text-lg" />
                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#F33B7D] text-white shadow-[0_4px_10px_rgba(243,59,125,0.4)]">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
                  Sarah Khan
                </h2>
                <p className="mt-1 text-sm text-[#8F8C8C]">sarah.khan@email.com</p>
                <p className="text-sm text-[#8F8C8C]">+92 300 1234567</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {badges.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl bg-[#FEF4F4] px-3 py-2.5">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-[#F33B7D]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#0D0D0D]">{value}</p>
                    <p className="text-[10px] text-[#B8AEB2]">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <p className="text-xs font-semibold text-[#F33B7D]">Profile Completion</p>
            <div className="relative mt-4 h-28 w-28">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#FEE4EB" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#F33B7D"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - 0.8)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-2xl font-semibold text-[#0D0D0D]">80%</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#8F8C8C]">
              Complete your profile to get more personalized insights.
            </p>
            <Link
              to="/profile/edit"
              className="mt-4 w-full rounded-full bg-[#F33B7D] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
            >
              Complete Now
            </Link>
          </div>
        </div>

        {/* Health Summary + Quick Actions */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#0D0D0D]">Health Summary</h2>
              <button className="text-xs font-semibold text-[#F33B7D]">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {healthSummary.map(({ label, value, sub }) => (
                <div key={label} className="rounded-xl bg-[#FEF4F4] p-3">
                  <p className="text-[10px] text-[#8F8C8C]">{label}</p>
                  <p className="mt-1 font-display text-sm font-semibold text-[#0D0D0D]">{value}</p>
                  {sub && <p className="mt-0.5 text-[10px] text-[#B8AEB2]">{sub}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-3 font-display text-base font-semibold text-[#0D0D0D]">Quick Actions</h2>
            <div className="space-y-1">
              {quickActions.map(({ icon: Icon, label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-[#3D3939] transition hover:bg-[#FEF4F4]"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#FEE4EB] text-[#F33B7D]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 font-medium">{label}</span>
                  <ChevronRight className="h-4 w-4 text-[#B8AEB2]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
