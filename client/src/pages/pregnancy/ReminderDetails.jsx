import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import {
  getPregnancy,
  getReminders,
  completeReminder,
  dateForWeek,
  formatDate,
} from "../../services/pregnancy.service";

export default function ReminderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pregnancy, setPregnancy] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [pregRes, remRes] = await Promise.all([
          getPregnancy(),
          getReminders(),
        ]);
        setPregnancy(pregRes?.pregnancy || null);
        const list = remRes?.reminders || remRes || [];
        const found = (Array.isArray(list) ? list : []).find(
          (r) => r._id === id
        );
        setReminder(found || null);
      } catch (err) {
        setError("Could not load this reminder.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleComplete = async () => {
    setSaving(true);
    try {
      await completeReminder(id);
      setReminder((r) => ({ ...r, completed: true, completedAt: new Date() }));
    } catch (err) {
      setError("Could not mark this reminder as completed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      title="Reminder Details"
      subtitle="View and manage your reminder."
      backTo="/pregnancy/reminders"
    >
      {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {!loading && !reminder && !error && (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          Reminder not found.
        </div>
      )}

      {!loading && reminder && (
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-[#0D0D0D]">
              <CalendarClock className="h-4.5 w-4.5 text-[#F33B7D]" />
              Week {reminder.week} - {reminder.title}
            </h2>
            <span
              className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                reminder.completed
                  ? "bg-green-50 text-green-600"
                  : "bg-[#FEF3C7] text-[#D97706]"
              }`}
            >
              {reminder.completed ? "Completed" : "Upcoming"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#FEF4F4] p-3">
              <p className="text-xs text-[#8F8C8C]">Week</p>
              <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
                {reminder.week}
              </p>
            </div>
            <div className="rounded-xl bg-[#FEF4F4] p-3">
              <p className="text-xs text-[#8F8C8C]">Status</p>
              <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
                {reminder.completed ? "Completed" : "Upcoming"}
              </p>
            </div>
            <div className="col-span-2 rounded-xl bg-[#FEF4F4] p-3">
              <p className="text-xs text-[#8F8C8C]">Approximate Date</p>
              <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
                {formatDate(dateForWeek(pregnancy?.lastPeriodDate, reminder.week))}
              </p>
            </div>
          </div>

          {!reminder.completed && (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="mt-5 w-full rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Mark as Completed"}
            </button>
          )}
        </div>
      )}
    </PageLayout>
  );
}
