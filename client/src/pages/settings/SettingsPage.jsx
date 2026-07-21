
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  MessageCircle,
  HeartHandshake,
  BookOpen,
  Mail,
  Phone,
  Lock,
  Globe,
  Ruler,
  Clock,
  ShieldCheck,
  History,
  Smartphone,
  Download,
  Trash2,
  ChevronRight,
  Menu,
} from "lucide-react";



const securityRows = [
  { icon: ShieldCheck, label: "Two-Factor Authentication", value: "Off" },
  { icon: History, label: "Login Activity", value: "See recent activity" },
  { icon: Smartphone, label: "Devices", value: "Manage devices" },
];

function Row({ icon: Icon, label, value, danger }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-[#FEF4F4] ${
        danger ? "text-[#EF4444]" : "text-[#0D0D0D]"
      }`}
    >
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
          danger ? "bg-[#FEE2E2] text-[#EF4444]" : "bg-[#FEE4EB] text-[#F33B7D]"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className={`truncate text-xs ${danger ? "text-[#F87171]" : "text-[#8F8C8C]"}`}>
          {value}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#B8AEB2]" />
    </button>
  );
}

export default function SettingsPage() {
  const storedUser =
    JSON.parse(localStorage.getItem("user")) || {};

    
const accountRows = [
  {
    icon: Mail,
    label: "Email",
    value: storedUser.email || "Not added",
  },
  {
    icon: Phone,
    label: "Phone Number",
    value: storedUser.phone || "Not added",
  },
  {
    icon: Lock,
    label: "Password",
    value: "••••••••",
  },
  {
    icon: Globe,
    label: "Language",
    value: storedUser.language || "English",
  },
  {
    icon: Ruler,
    label: "Units",
    value: storedUser.units || "Metric (kg, cm)",
  },
  {
    icon: Clock,
    label: "Time Zone",
    value: storedUser.timezone || "(GMT+05:00) Pakistan Time",
  },
];


  return (
    <DashboardLayout
    title="Account Settings"
    subtitle="Manage your account preferences and security."
>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Account Settings */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-2 font-display text-base font-semibold text-[#0D0D0D]">
              Account Settings
            </h2>
            <div className="divide-y divide-[#F5EAEF]">
              {accountRows.map((row) => (
                <Row key={row.label} {...row} />
              ))}
            </div>
          </div>

          {/* Security + Data & Privacy */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <h2 className="mb-2 font-display text-base font-semibold text-[#0D0D0D]">
                Security
              </h2>
              <div className="divide-y divide-[#F5EAEF]">
                {securityRows.map((row) => (
                  <Row key={row.label} {...row} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <h2 className="mb-2 font-display text-base font-semibold text-[#0D0D0D]">
                Data & Privacy
              </h2>
              <div className="divide-y divide-[#F5EAEF]">
                <Row icon={Download} label="Download My Data" value="Get a copy of your data" />
                <Row
                  icon={Trash2}
                  label="Delete Account"
                  value="Permanently delete your account"
                  danger
                />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
  );
}