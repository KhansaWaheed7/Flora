// DashboardPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
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
  Clock,
  Heart,
  Droplets,
  Sun,
  ChevronDown,
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
  Tooltip,
} from "recharts";

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


const cyclePieData = [
  { name: "Period", value: 5, color: "#F33B7D" },
  { name: "Follicular", value: 5, color: "#FBCFE8" },
  { name: "Fertile", value: 6, color: "#A855F7" },
  { name: "Luteal", value: 12, color: "#E5E7EB" },
];

const cycleLegend = [
  { label: "Period", days: "Day 1 - 5", color: "#F33B7D" },
  { label: "Fertile Window", days: "Day 10 - 16", color: "#A855F7" },
  { label: "Ovulation", days: "Day 14", color: "#22C55E" },
  { label: "Luteal Phase", days: "Day 15 - 28", color: "#D1D5DB" },
];

const insights = [
  {
    icon: ActivityIcon,
    title: "Stay Active",
    detail: "You've completed 3 workouts this week.",
    tag: "Great",
    tagColor: "#22C55E",
  },
  {
    icon: Droplet,
    title: "Hydration",
    detail: "You drink 6 of 8 glasses of water daily.",
    tag: "Good",
    tagColor: "#3B82F6",
  },
  {
    icon: Apple,
    title: "Nutrition",
    detail: "Keep eating more iron-rich foods.",
    tag: "Improve",
    tagColor: "#F59E0B",
  },
  {
    icon: Moon,
    title: "Sleep",
    detail: "You slept 7h 25m on average.",
    tag: "Good",
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
    detail: "Flow: Moderate",
    time: "19 May 2025, 9:20 AM",
  },
  {
    icon: ClipboardList,
    color: "#A855F7",
    title: "Report Analyzed",
    detail: "Iron Deficiency",
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
    detail: "Intensity: Yoga - 30 min",
    time: "17 May 2025, 8:45 AM",
  },
];

const reminders = [
  {
    title: "Doctor Appointment",
    time: "20 May 2025 - 10:00 AM",
    tag: "Upcoming",
    tagColor: "#F59E0B",
  },
  {
    title: "Ayesha Exam",
    time: "25 May 2025 - 11:30 AM",
    tag: "Important",
    tagColor: "#F33B7D",
  },
  {
    title: "Iron Supplement",
    time: "Daily - 9:00 AM",
    tag: "Daily",
    tagColor: "#3B82F6",
  },
  {
    title: "Blood Test",
    time: "30 May 2025 - 9:00 AM",
    tag: "Upcoming",
    tagColor: "#A855F7",
  },
];

const cycleHistory = [
  { month: "Jan", period: 5, cycle: 27, ovulation: 13 },
  { month: "Feb", period: 6, cycle: 28, ovulation: 14 },
  { month: "Mar", period: 5, cycle: 29, ovulation: 15 },
  { month: "Apr", period: 5, cycle: 28, ovulation: 14 },
  { month: "May", period: 4, cycle: 27, ovulation: 13 },
  { month: "Jun", period: 5, cycle: 28, ovulation: 14 },
  { month: "Jul", period: 5, cycle: 28, ovulation: 14 },
  { month: "Aug", period: 6, cycle: 29, ovulation: 15 },
  { month: "Sep", period: 5, cycle: 28, ovulation: 14 },
  { month: "Oct", period: 4, cycle: 27, ovulation: 13 },
  { month: "Nov", period: 5, cycle: 28, ovulation: 14 },
  { month: "Dec", period: 5, cycle: 28, ovulation: 14 },
];

function Sparkline({ color }) {
  const data = Array.from({ length: 8 }, (_, i) => ({
    v: 10 + Math.abs(Math.sin(i / 1.3 + 0.5) * 8) + 0.5,
  }));

  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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

function StatCard({ label, value, unit, sub, color, icon: Icon }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs text-[#8F8C8C]">{label}</p>
      </div>
      <p className="mt-2 font-display text-xl font-semibold text-[#0D0D0D]">
        {value}
        {unit && <span className="ml-0.5 text-sm font-normal text-[#B8AEB2]">{unit}</span>}
      </p>
      <p className="mt-0.5 text-xs text-[#B8AEB2]">{sub}</p>
      <Sparkline color={color} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout subtitle="Here's your personalized health overview.">
      {/* Log Health Data Button */}
      <div className="mb-6 flex justify-end">
        <button className="flex items-center gap-1.5 rounded-full bg-[#FEE4EB] px-4 py-2 text-xs font-semibold text-[#F33B7D]">
          <Plus className="h-3.5 w-3.5" /> Log Health Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Middle Section */}
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
              <p className="font-display text-2xl font-semibold text-[#0D0D0D]">12</p>
              <p className="text-xs text-[#8F8C8C]">of 28</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {cycleLegend.map(({ label, days, color }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#3D3939]">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
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
            <button className="flex items-center gap-1 text-xs font-medium text-[#8F8C8C]">
              This Week <ChevronDown className="h-3 w-3" />
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

        {/* Upcoming Reminders + Tip */}
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
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
    {quickActions.map(({ icon: Icon, label }) => (
      <button
        key={label}
        className="flex items-center gap-3 rounded-xl bg-[#FEF4F4] px-4 py-3 text-left transition hover:bg-[#FEE4EB]"
      >
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#F33B7D] shadow-sm">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium text-[#3D3939]">
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
              Cycle History <span className="font-normal text-[#8F8C8C]">(Last 6 Cycles)</span>
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

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cycleHistory.slice(-6)}>
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
                <Tooltip />
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
          
          <button className="mt-3 w-full text-center text-xs font-semibold text-[#F33B7D]">
            View Full History →
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#F33B7D] p-5 text-white shadow-[0_20px_40px_-10px_rgba(168,85,247,0.4)]">
          <p className="font-display text-base font-semibold">Flora Premium</p>
          <p className="mt-2 text-xs text-white/85 leading-relaxed">
            Unlock advanced insights, expert consultations and personalized
            health plans.
          </p>
          <button className="mt-4 rounded-full bg-white px-6 py-2 text-xs font-semibold text-[#F33B7D] hover:bg-white/90 transition-colors">
            Explore Premium →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}