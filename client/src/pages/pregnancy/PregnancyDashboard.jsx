import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Baby, Droplet, Stethoscope } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import PregnancyOnboarding from "./PregnancyOnboarding";
import {
  getPregnancyDashboard,
  formatDate,
  trimesterLabel,
} from "../../services/pregnancy.service";

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
      <PageLayout
        title="Pregnancy"
        subtitle="Track your pregnancy journey and stay healthy."
      >
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  if (error === "error") {
    return (
      <PageLayout
        title="Pregnancy"
        subtitle="Track your pregnancy journey and stay healthy."
      >
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-sm font-semibold text-red-600">
            Couldn't load your pregnancy dashboard.
          </p>
          <p className="mt-1 text-xs text-[#8F8C8C]">
            Try refreshing the page.
          </p>
        </div>
      </PageLayout>
    );
  }

  if (!data) {
    return <PregnancyOnboarding />;
  }

  const { pregnancy, progress, weeksRemaining, weekInfo, upcomingReminder } =
    data;
  const currentWeek = pregnancy?.currentWeek;

  return (
    <PageLayout
      title="Pregnancy Dashboard"
      subtitle="Track your pregnancy journey and stay healthy."
    >
      <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[#8F8C8C]">Current Week</p>
            <p className="mt-1 font-display text-3xl font-semibold text-[#0D0D0D]">
              {currentWeek}{" "}
              <span className="text-base font-normal text-[#B8AEB2]">
                of 40
              </span>
            </p>
            <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-[#FEE4EB]">
              <div
                className="h-full rounded-full bg-[#F33B7D]"
                style={{ width: `${Math.min(100, progress ?? 0)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-[#8F8C8C]">
              {progress ?? "-"}% complete
            </p>
          </div>
          <div className="flex items-center justify-center sm:justify-end">
            <div className="rounded-full bg-[#FEE4EB] px-5 py-3 text-center">
              <p className="text-xs text-[#F33B7D]">Trimester</p>
              <p className="font-display text-lg font-semibold text-[#F33B7D]">
                {trimesterLabel[pregnancy?.trimester] || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[#FEF4F4] p-3">
            <p className="flex items-center gap-1.5 text-xs text-[#8F8C8C]">
              <Calendar className="h-3.5 w-3.5" /> Due Date
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
              {formatDate(pregnancy?.dueDate)}
            </p>
          </div>
          <div className="rounded-xl bg-[#FEF4F4] p-3">
            <p className="flex items-center gap-1.5 text-xs text-[#8F8C8C]">
              <Baby className="h-3.5 w-3.5" /> Baby Size
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
              {weekInfo?.babySize || "-"}
            </p>
          </div>
          <div className="rounded-xl bg-[#FEF4F4] p-3">
            <p className="flex items-center gap-1.5 text-xs text-[#8F8C8C]">
              <Droplet className="h-3.5 w-3.5" /> Baby Weight
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
              {weekInfo?.babyWeight || "-"}
            </p>
          </div>
        </div>

        {upcomingReminder && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#FEE4EB] p-3">
            <Stethoscope className="h-4 w-4 flex-shrink-0 text-[#F33B7D]" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#F33B7D]">
                Next Reminder
              </p>
              <p className="truncate text-xs text-[#3D3939]">
                {upcomingReminder.title} - Week {upcomingReminder.week}
              </p>
            </div>
            <Link
              to="/pregnancy/reminders"
              className="flex-shrink-0 text-xs font-semibold text-[#F33B7D]"
            >
              View
            </Link>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <h2 className="mb-4 font-display text-sm font-semibold text-[#0D0D0D]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Weekly Guide", to: "/pregnancy/weekly-guide" },
            { label: "Reminders", to: "/pregnancy/reminders" },
            { label: "Update Pregnancy", to: "/pregnancy/update" },
            { label: "View Timeline", to: "/pregnancy/timeline" },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="flex flex-col items-center gap-2 rounded-xl bg-[#FEF4F4] px-3 py-4 text-center transition hover:bg-[#FEE4EB]"
            >
              <span className="text-sm font-medium text-[#3D3939]">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
