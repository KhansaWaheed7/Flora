import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import {
  getPregnancy,
  getReminders,
  dateForWeek,
  formatDate,
} from "../../services/pregnancy.service";

const tabs = [
  { key: "all", label: "All Reminders" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
];

export default function PregnancyReminders() {
  const [pregnancy, setPregnancy] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const [pregRes, remRes] = await Promise.all([
          getPregnancy(),
          getReminders(),
        ]);
        setPregnancy(pregRes?.pregnancy || null);
        const list = remRes?.reminders || remRes || [];
        setReminders(Array.isArray(list) ? list : []);
      } catch (err) {
        setError("Could not load your reminders.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = reminders.filter((r) => {
    if (tab === "upcoming") return !r.completed;
    if (tab === "completed") return r.completed;
    return true;
  });

  return (
    <PageLayout
      title="Pregnancy Reminders"
      subtitle="Stay on top of your important appointments and tests."
      backTo="/pregnancy"
    >
      <div className="mb-4 flex gap-2 overflow-x-auto rounded-full bg-[#FEF4F4] p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
              tab === t.key
                ? "bg-[#F33B7D] text-white"
                : "text-[#3D3939] hover:bg-[#FEE4EB]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          No reminders here.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Link
              key={r._id}
              to={`/pregnancy/reminders/${r._id}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition hover:-translate-y-0.5"
            >
              <span
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                  r.completed
                    ? "bg-green-50 text-green-600"
                    : "bg-[#FEE4EB] text-[#F33B7D]"
                }`}
              >
                <CalendarClock className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0D0D0D]">
                  Week {r.week} - {r.title}
                </p>
                <p className="text-xs text-[#8F8C8C]">
                  {formatDate(dateForWeek(pregnancy?.lastPeriodDate, r.week))}
                </p>
              </div>
              <span
                className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  r.completed
                    ? "bg-green-50 text-green-600"
                    : "bg-[#FEF3C7] text-[#D97706]"
                }`}
              >
                {r.completed ? "Completed" : "Upcoming"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
