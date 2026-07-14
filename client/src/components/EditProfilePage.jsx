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
  ArrowLeft,
  Camera,
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

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#3D3939]">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-[#F0DCE4] bg-white px-3 py-2.5 text-sm text-[#0D0D0D] outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
      />
    </label>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#3D3939]">{label}</span>
      <select
        {...props}
        className="w-full rounded-xl border border-[#F0DCE4] bg-white px-3 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#F33B7D]"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function EditProfilePage() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-[#0D0D0D] sm:text-2xl">
              Edit Profile
            </h1>
            <p className="mt-0.5 text-sm text-[#8F8C8C]">
              Update your personal information.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="rounded-full bg-[#F33B7D] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
            >
              {saved ? "Saved ✓" : "Save Changes"}
            </button>

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

        <Link
          to="/profile"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#8F8C8C] hover:text-[#F33B7D]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Personal Information */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
            <h2 className="mb-4 font-display text-base font-semibold text-[#0D0D0D]">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Full Name" defaultValue="Sarah Khan" />
              </div>
              <Field label="Email Address" type="email" defaultValue="sarah.khan@email.com" />
              <Field label="Phone Number" type="tel" defaultValue="+92 300 1234567" />
              <Field label="Date of Birth" type="date" defaultValue="1996-03-12" />
              <SelectField label="Gender" options={["Female", "Male", "Prefer not to say"]} />
              <SelectField
                label="Blood Group"
                options={["B+", "A+", "O+", "AB+", "B-", "A-", "O-", "AB-"]}
              />
              <div className="sm:col-span-2">
                <Field label="Location" defaultValue="Lahore, Pakistan" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <h2 className="mb-4 self-start font-display text-base font-semibold text-[#0D0D0D]">
                Profile Picture
              </h2>
              <div className="relative">
                <Avatar name="Sarah Khan" size="h-24 w-24 text-xl" />
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#F33B7D] text-white shadow-[0_4px_10px_rgba(243,59,125,0.4)]"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-4 text-[10px] text-[#B8AEB2]">
                JPG, PNG or GIF. Max size 2MB.
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-full bg-[#F33B7D] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
              >
                Change Photo
              </button>
            </div>

            {/* Medical Information */}
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <h2 className="mb-4 font-display text-base font-semibold text-[#0D0D0D]">
                Medical Information{" "}
                <span className="font-normal text-[#B8AEB2]">(Optional)</span>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Height" placeholder="165 cm" />
                <Field label="Weight" placeholder="58 kg" />
                <div className="col-span-2">
                  <Field label="Allergies" placeholder="No known allergies" />
                </div>
                <div className="col-span-2">
                  <Field label="Medical Conditions" placeholder="None" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
