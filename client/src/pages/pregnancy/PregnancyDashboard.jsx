import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Baby,
  Droplet,
  CalendarClock,
  ClipboardList,
  CalendarDays,
  Sprout,
  Milestone,
} from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import PregnancyOnboarding from "./PregnancyOnboarding";
import {
  getPregnancyDashboard,
  formatDate,
  trimesterLabel,
} from "../../services/pregnancy.service";
import babyImg from "../../assets/baby.png";

const TIPS = [
  "Stay hydrated and eat iron-rich foods.",
  "Light walks can help ease pregnancy fatigue and improve mood.",
  "Don't skip your prenatal vitamins, especially folic acid and iron.",
  "Prioritize sleep — your body is working hard even at rest.",
  "Small, frequent meals can help with nausea and energy dips.",
];

export default function PregnancyDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPregnancyDashboard();
        setData(res || null);
      } catch (err) {
        setError("error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <PageLayout title="Pregnancy" subtitle="Track your pregnancy journey and stay healthy.">
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  if (error === "error") {
    return (
      <PageLayout title="Pregnancy" subtitle="Track your pregnancy journey and stay healthy.">
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-sm font-semibold text-red-600">Couldn't load your pregnancy dashboard.</p>
          <p className="mt-1 text-xs text-[#8F8C8C]">Try refreshing the page.</p>
        </div>
      </PageLayout>
    );
  }

  if (!data) {
    return <PregnancyOnboarding />;
  }

  const { pregnancy, progress, weeksRemaining, weekInfo, upcomingReminder } = data;
  const currentWeek = pregnancy?.currentWeek;
  const pct = Math.min(100, Math.max(0, progress ?? 0));

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const tipIndex = new Date().getDate() % TIPS.length;
  const todaysTip = TIPS[tipIndex];

  const statCards = [
    {
      icon: Calendar,
      label: "Due Date",
      value: formatDate(pregnancy?.dueDate),
      sub: pregnancy?.dueDate
        ? new Date(pregnancy.dueDate).toLocaleDateString("en-US", { weekday: "long" })
        : "",
    },
    {
      icon: Baby,
      label: "Baby Size",
      value: weekInfo?.babySize || "-",
      sub: weekInfo?.babyLength || "",
    },
    {
      icon: Droplet,
      label: "Baby Weight",
      value: weekInfo?.babyWeight || "-",
      sub: "(approx.)",
    },
  ];

  const quickActions = [
    { label: "Weekly Guide", to: "/pregnancy/weekly-guide", icon: ClipboardList },
    { label: "Reminders", to: "/pregnancy/reminders", icon: CalendarDays },
    { label: "Update Pregnancy", to: "/pregnancy/update", icon: Sprout },
    { label: "View Timeline", to: "/pregnancy/timeline", icon: Milestone },
  ];

  return (
    <PageLayout title="Pregnancy Dashboard" subtitle="Track your pregnancy journey and stay healthy.">
      {/* Top summary card */}
      <div className="rounded-2xl bg-[#FEF4F4] p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs text-[#8F8C8C]">Current Week</p>
            <p className="mt-1 font-display text-3xl font-semibold text-[#0D0D0D]">
              {currentWeek} <span className="text-sm font-normal text-[#B8AEB2]">of 40 Weeks</span>
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#FEE4EB" strokeWidth="9" />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#F33B7D"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-4 overflow-hidden rounded-full bg-white">
                <img
                  src={babyImg}
                  alt=""
                  className="h-full w-full object-cover object-left"
                />
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-[#8F8C8C]">Trimester</p>
            <p className="mt-1 font-display text-xl font-semibold text-[#0D0D0D]">
              {trimesterLabel[pregnancy?.trimester] || "-"}
            </p>
            {pregnancy?.trimester && (
              <p className="text-xs text-[#8F8C8C]">
                {pregnancy.trimester === 1 ? "1 - 13" : pregnancy.trimester === 2 ? "14 - 27" : "28 - 40"} Weeks
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#FEE4EB]">
            <div className="h-full rounded-full bg-[#F33B7D]" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-[#8F8C8C]">
            <span>{pct}% complete</span>
            {weeksRemaining != null && <span>{weeksRemaining} Weeks to go</span>}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statCards.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEE4EB]">
              <Icon className="h-4 w-4 text-[#F33B7D]" strokeWidth={1.5} />
            </div>
            <p className="mt-3 text-xs text-[#8F8C8C]">{label}</p>
            <p className="mt-0.5 font-display text-lg font-semibold text-[#0D0D0D]">{value}</p>
            {sub && <p className="text-xs text-[#B8AEB2]">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Next Reminder + Today's Tip */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#FEF4F4] p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-[#F33B7D]" />
            <p className="text-xs font-semibold text-[#F33B7D]">Next Reminder</p>
          </div>
          {upcomingReminder ? (
            <>
              <p className="mt-2 font-display text-sm font-semibold text-[#0D0D0D]">
                Week {upcomingReminder.week} – {upcomingReminder.title}
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-[#8F8C8C]">
                <span>
                  {weeksRemaining != null && currentWeek != null
                    ? `${Math.max(0, upcomingReminder.week - currentWeek)} Weeks left`
                    : ""}
                </span>
                <Link to="/pregnancy/reminders" className="font-semibold text-[#F33B7D]">
                  View
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-2 text-xs text-[#8F8C8C]">No upcoming reminders.</p>
          )}
        </div>

        <div className="rounded-2xl bg-[#FEF4F4] p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-xs font-semibold text-[#F33B7D]">Today's Tip</p>
          <p className="mt-1 text-xs text-[#3D3939]">{todaysTip}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="flex flex-col items-center gap-2 rounded-xl bg-[#FEF4F4] px-3 py-4 text-center transition hover:bg-[#FEE4EB]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <Icon className="h-4 w-4 text-[#F33B7D]" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-[#3D3939]">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}