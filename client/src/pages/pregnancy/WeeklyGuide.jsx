import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import { getPregnancyDashboard, trimesterLabel } from "../../services/pregnancy.service";
import babyImg from "../../assets/baby.png";

const ALL_WEEKS = Array.from({ length: 40 }, (_, i) => i + 1);

const TRIMESTER_RANGE = {
  1: "1 - 13 Weeks",
  2: "14 - 27 Weeks",
  3: "28 - 40 Weeks",
};

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
  const trimester = data?.pregnancy?.trimester;

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, data?.progress ?? 0));
  const offset = circumference - (pct / 100) * circumference;

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
          {/* Current Week summary card with progress ring + baby illustration — made pink */}
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl bg-[#FEE4EB] p-5 ring-1 ring-[#FBCFE8] shadow-[0_4px_14px_rgba(243,59,125,0.10)]">
            <div>
              <p className="text-xs font-semibold text-[#F33B7D]">Current Week</p>
              <p className="font-display text-3xl font-semibold text-[#3D2A33]">
                {currentWeek}
              </p>
              <p className="text-xs text-[#A8849A]">
                {trimesterLabel[trimester]}
                {trimester && ` (${TRIMESTER_RANGE[trimester]})`}
              </p>
            </div>
            <div className="relative h-20 w-20 flex-shrink-0">
              <svg viewBox="0 0 120 120" className="h-20 w-20 -rotate-90">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#FFFFFF" strokeWidth="9" />
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
                  className={`rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isCurrent
                      ? "bg-[#F33B7D] text-white shadow-[0_6px_16px_rgba(243,59,125,0.35)]"
                      : "bg-[#FEE4EB] text-[#3D2A33] ring-1 ring-[#FBCFE8] shadow-[0_2px_8px_rgba(243,59,125,0.08)] hover:bg-[#FDD5E3] hover:ring-[#F9A8C7] hover:shadow-[0_6px_16px_rgba(243,59,125,0.18)] hover:-translate-y-0.5"
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