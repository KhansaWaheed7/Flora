import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import {
  getPregnancyDashboard,
  formatDate,
  trimesterLabel,
} from "../../services/pregnancy.service";

export default function PregnancyOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPregnancyDashboard();
        setData(res || null);
      } catch (err) {
        setError("Could not load your pregnancy overview.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageLayout
      title="Pregnancy Overview"
      subtitle="Overview of your current pregnancy."
      backTo="/pregnancy"
    >
      {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {!loading && !error && !data && (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          No active pregnancy found.
        </div>
      )}

      {!loading && !error && data && (
        <div className="mx-auto max-w-lg space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-4 font-display text-sm font-semibold text-[#0D0D0D]">
              Pregnancy Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#8F8C8C]">Current Week</span>
                <span className="font-semibold text-[#0D0D0D]">
                  {data.pregnancy?.currentWeek} Weeks
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F8C8C]">Trimester</span>
                <span className="font-semibold text-[#0D0D0D]">
                  {trimesterLabel[data.pregnancy?.trimester] || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F8C8C]">Due Date</span>
                <span className="font-semibold text-[#0D0D0D]">
                  {formatDate(data.pregnancy?.dueDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F8C8C]">Weeks Remaining</span>
                <span className="font-semibold text-[#0D0D0D]">
                  {data.weeksRemaining ?? "-"} Weeks
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F8C8C]">Pregnancy Progress</span>
                <span className="font-semibold text-[#0D0D0D]">
                  {data.progress ?? "-"}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F8C8C]">Pregnancy Status</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE4EB]">
              <Heart className="h-7 w-7 text-[#F33B7D]" />
            </div>
            <p className="text-sm font-semibold text-[#0D0D0D]">
              You are in your{" "}
              {trimesterLabel[data.pregnancy?.trimester] || "-"}
            </p>
            <p className="mt-1 text-xs text-[#8F8C8C]">
              Your baby is growing beautifully!
            </p>
            <p className="mt-3 text-xs text-[#B8AEB2]">
              Stay consistent with your prenatal care and follow a healthy
              lifestyle.
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
