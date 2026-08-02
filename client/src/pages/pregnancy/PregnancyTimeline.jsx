import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, MapPin } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import {
  getPregnancy,
  getReminders,
  dateForWeek,
  formatDate,
} from "../../services/pregnancy.service";

export default function PregnancyTimeline() {
  const [pregnancy, setPregnancy] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Could not load your pregnancy timeline.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const currentWeek = pregnancy?.currentWeek;

  return (
    <PageLayout
      title="Pregnancy Timeline"
      subtitle="Visualize your pregnancy journey."
      backTo="/pregnancy"
    >
      {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {!loading && !error && reminders.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          No timeline milestones yet.
        </div>
      )}

      {!loading && !error && reminders.length > 0 && (
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <ol className="relative border-l-2 border-[#F0DCE4] pl-6">
            {currentWeek && (
              <li className="relative mb-6">
                <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-[#F33B7D] ring-4 ring-white">
                  <MapPin className="h-3 w-3 text-white" />
                </span>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#0D0D0D]">
                    Week {currentWeek}
                  </p>
                  <span className="rounded-full bg-[#FEE4EB] px-2 py-0.5 text-[10px] font-semibold text-[#F33B7D]">
                    You are here
                  </span>
                </div>
              </li>
            )}

            {reminders.map((r) => (
              <li key={r._id} className="relative mb-6 last:mb-0">
                <span
                  className={`absolute -left-[27px] flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-white ${
                    r.completed ? "bg-green-500" : "bg-[#A855F7]"
                  }`}
                />
                <Link
                  to={`/pregnancy/reminders/${r._id}`}
                  className="block rounded-xl px-2 py-1 transition hover:bg-[#FEF4F4]"
                >
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-[#0D0D0D]">
                    <CalendarClock className="h-3.5 w-3.5 text-[#8F8C8C]" />
                    Week {r.week} - {r.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8F8C8C]">
                    {formatDate(dateForWeek(pregnancy?.lastPeriodDate, r.week))}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
    </PageLayout>
  );
}
