import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import { getPregnancyDashboard, trimesterLabel } from "../../services/pregnancy.service";

const ALL_WEEKS = Array.from({ length: 40 }, (_, i) => i + 1);

export default function WeeklyGuide() {
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
        setError("Could not load your weekly guide.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const currentWeek = data?.pregnancy?.currentWeek;

  return (
    <PageLayout
      title="Weekly Guide"
      subtitle="Explore week-by-week information."
      backTo="/pregnancy"
    >
      {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-5">
            <p className="text-xs text-[#8F8C8C]">Current Week</p>
            <p className="font-display text-2xl font-semibold text-[#0D0D0D]">
              {currentWeek}
            </p>
            <p className="text-xs text-[#8F8C8C]">
              {trimesterLabel[data.pregnancy?.trimester]}
            </p>
          </div>

          <p className="mb-3 text-xs text-[#8F8C8C]">
            Explore your pregnancy week by week.
          </p>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
            {ALL_WEEKS.map((week) => {
              const isCurrent = week === currentWeek;
              return (
                <button
                  key={week}
                  onClick={() => navigate(`/pregnancy/weekly-guide/${week}`)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                    isCurrent
                      ? "bg-[#F33B7D] text-white"
                      : "bg-[#FEF4F4] text-[#3D3939] hover:bg-[#FEE4EB]"
                  }`}
                >
                  {week}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-[#FEF4F4] p-3 text-xs text-[#8F8C8C]">
            Tap on any week to view detailed information about your baby's
            development and body changes.
          </div>
        </div>
      )}
    </PageLayout>
  );
}
