import { useEffect, useState } from "react";
import { CalendarHeart, Sparkles, Droplet, TrendingUp, ShieldCheck, AlertTriangle } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { getPrediction } from "../../services/cycle.service";

// Real shape returned by predictCycle():
// { averageCycleLength, periodLength, nextPeriod, ovulation,
//   fertileWindow: { start, end }, irregularCycle, health: { status, insights } }

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Predictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPrediction();
        setData(res.data || res);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Not enough cycle data yet to generate predictions."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <PageLayout
        title="Predictions"
        subtitle="Your upcoming cycle predictions."
        backTo="/cycle-tracker"
      >
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  if (error || !data) {
    return (
      <PageLayout
        title="Predictions"
        subtitle="Your upcoming cycle predictions."
        backTo="/cycle-tracker"
      >
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          {error}
        </div>
      </PageLayout>
    );
  }

  const daysUntilNextPeriod = data.nextPeriod
    ? Math.ceil((new Date(data.nextPeriod) - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <PageLayout
      title="Predictions"
      subtitle="Your upcoming cycle predictions."
      backTo="/cycle-tracker"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#F33B7D] p-6 text-white shadow-[0_20px_40px_-10px_rgba(243,59,125,0.4)]">
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/85">Next Period</p>
              <p className="mt-1 font-display text-3xl font-semibold">
                {formatDate(data.nextPeriod)}
              </p>
              <p className="mt-1 text-sm text-white/90">
                {daysUntilNextPeriod === null
                  ? "-"
                  : daysUntilNextPeriod < 0
                  ? `${Math.abs(daysUntilNextPeriod)} Days Late`
                  : `${daysUntilNextPeriod} Days Left`}
              </p>
            </div>
            <CalendarHeart className="h-12 w-12 text-white/70" />
          </div>
        </div>

        {/* Stat boxes */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3E8FF] text-[#A855F7]">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="mt-2 text-xs text-[#8F8C8C]">Ovulation</p>
            <p className="font-display text-sm font-semibold text-[#0D0D0D]">
              {formatDate(data.ovulation)}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEE4EB] text-[#F33B7D]">
              <Droplet className="h-4 w-4" />
            </span>
            <p className="mt-2 text-xs text-[#8F8C8C]">Fertile Window</p>
            <p className="font-display text-sm font-semibold text-[#0D0D0D]">
              {formatDate(data.fertileWindow?.start)} -{" "}
              {formatDate(data.fertileWindow?.end)}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <TrendingUp className="h-4 w-4" />
            </span>
            <p className="mt-2 text-xs text-[#8F8C8C]">Avg Cycle Length</p>
            <p className="font-display text-sm font-semibold text-[#0D0D0D]">
              {data.averageCycleLength ?? "-"} Days
            </p>
          </div>
        </div>

        {/* Extra info */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-[#8F8C8C]">Period Length</p>
              <p className="mt-0.5 text-sm font-semibold text-[#0D0D0D]">
                {data.periodLength ?? "-"} Days
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8F8C8C]">Irregular Cycle</p>
              <p
                className={`mt-0.5 flex items-center gap-1 text-sm font-semibold ${
                  data.irregularCycle ? "text-amber-600" : "text-green-600"
                }`}
              >
                {data.irregularCycle ? (
                  <AlertTriangle className="h-3.5 w-3.5" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5" />
                )}{" "}
                {data.irregularCycle ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8F8C8C]">Cycle Health</p>
              <p className="mt-0.5 text-sm font-semibold text-[#0D0D0D]">
                {data.health?.status || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Insights */}
        {data.health?.insights?.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-3 font-display text-sm font-semibold text-[#0D0D0D]">
              Insights
            </h2>
            <ul className="space-y-2">
              {data.health.insights.map((insight, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[#3D3939]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F33B7D]" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
