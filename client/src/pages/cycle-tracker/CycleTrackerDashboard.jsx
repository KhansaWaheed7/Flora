import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Droplet,
  Repeat,
  History,
  CalendarDays,
  BarChart3,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import PageLayout from "../../layouts/PageLayout";
import { getCycleDashboard } from "../../services/cycle.service";
import NoCycleData from "./NoCycleData";

const quickActions = [
  { icon: Droplet, label: "Log Period", to: "/cycle-tracker/log" },
  { icon: Repeat, label: "Predictions", to: "/cycle-tracker/predictions" },
  { icon: History, label: "History", to: "/cycle-tracker/history" },
  {
    icon: CalendarDays,
    label: "Calendar",
    to: "/cycle-tracker/history?view=calendar",
  },
  { icon: BarChart3, label: "Statistics", to: "/cycle-tracker/statistics" },
];

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CycleTrackerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCycleDashboard();
        setData(res.data || res);
      } catch (err) {
        // 404/empty likely means no cycles logged yet
        setError(err?.response?.status === 404 ? "empty" : "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <PageLayout
        title="Cycle Tracker Dashboard"
        subtitle="Track your cycle, understand your body."
      >
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  if (error === "empty") {
    return <NoCycleData />;
  }

  if (error === "error" || !data) {
    return (
      <PageLayout
        title="Cycle Tracker Dashboard"
        subtitle="Track your cycle, understand your body."
      >
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-sm font-semibold text-red-600">
            Couldn't load your dashboard.
          </p>
          <p className="mt-1 text-xs text-[#8F8C8C]">
            This usually means the request failed (session expired, network
            issue, or server error) — not that your data is gone. Try
            refreshing the page.
          </p>
        </div>
      </PageLayout>
    );
  }

  // Real backend shape: { latestCycle, prediction }
  // prediction = { averageCycleLength, periodLength, nextPeriod, ovulation,
  //                fertileWindow: { start, end }, irregularCycle, health: { status, insights } }
  const { latestCycle, prediction } = data;

  const periodInProgress =
  !latestCycle?.periodEnd;

const cycleLength =
  prediction?.averageCycleLength ??
  latestCycle?.cycleLength ??
  28;

const periodLength =
  prediction?.periodLength ??
  latestCycle?.periodLength ??
  5;

// Backend now calculates the current phase
const currentDay =
  prediction?.currentPhase?.cycleDay ?? null;

const currentPhase =
  prediction?.currentPhase?.phase ?? "Unknown";

const phaseDescription =
  prediction?.currentPhase?.description ||
  "Your current cycle phase is being estimated.";

const daysUntilNextPeriod = prediction?.nextPeriod
  ? Math.ceil(
      (new Date(prediction.nextPeriod) - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  : null;

const insight =
  prediction?.health?.insights?.[0] ||
  "Log your next period to keep predictions accurate.";

const cyclePieData = [
  {
    name: "Current Day",
    value: currentDay || 1,
    color: "#F33B7D",
  },
  {
    name: "Remaining",
    value: Math.max(
      0,
      cycleLength - (currentDay || 1)
    ),
    color: "#FBCFE8",
  },
];

  return (
    <PageLayout
      title="Cycle Tracker Dashboard"
      subtitle="Track your cycle, understand your body."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Current Cycle */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-xs font-semibold text-[#8F8C8C]">Current Cycle</p>
          <p className="mt-1 font-display text-lg font-semibold text-[#0D0D0D]">
            Day {currentDay ?? "-"} of {cycleLength}
          </p>
          <div className="mt-2 flex items-center gap-2">
  <span className="rounded-full bg-[#FEE4EB] px-3 py-1 text-xs font-semibold text-[#F33B7D]">
    {currentPhase} Phase
  </span>
</div>


{periodInProgress && (
  <div className="mt-3 rounded-xl bg-[#FEE4EB] p-3">
    <p className="text-xs font-semibold text-[#F33B7D]">
      Period in progress
    </p>

    <p className="mt-1 text-xs text-[#3D3939]">
      Your period started on{" "}
      {formatDate(latestCycle.periodStart)}.
      Add the end date when your period finishes.
    </p>

    <Link
      to={`/cycle-tracker/${latestCycle._id}/edit`}
      className="mt-2 inline-flex text-xs font-semibold text-[#F33B7D] hover:underline"
    >
      Add End Date →
    </Link>
  </div>
)}

          <div className="relative mx-auto my-4 h-36 w-36">
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
  <p className="font-display text-2xl font-semibold text-[#0D0D0D]">
    {currentDay ?? "-"}
  </p>

  <p className="text-xs text-[#8F8C8C]">
    of {cycleLength}
  </p>

  <p className="mt-1 text-[10px] font-semibold text-[#F33B7D]">
    {currentPhase}
  </p>
</div>
          </div>

          <div className="rounded-xl bg-[#FEF4F4] p-3">
            <p
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                prediction?.health?.status === "Irregular"
                  ? "text-amber-600"
                  : "text-green-600"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Cycle Health
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[#0D0D0D]">
              {prediction?.health?.status || "-"}
            </p>
            <p className="text-xs text-[#8F8C8C]">{insight}</p>
          </div>
        </div>

        {/* Next Period */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-xs font-semibold text-[#8F8C8C]">Next Period</p>
          <p className="mt-1 font-display text-3xl font-semibold text-[#F33B7D]">
  {periodInProgress
    ? "Period in progress"
    : daysUntilNextPeriod === null
    ? "-"
    : daysUntilNextPeriod < 0
    ? `${Math.abs(daysUntilNextPeriod)} Days Late`
    : `${daysUntilNextPeriod} Days Left`}
</p>
          <p className="mt-1 text-sm text-[#8F8C8C]">
            {periodInProgress ? "Next period expected on" : "Expected on"}{" "}
            <span className="font-semibold text-[#0D0D0D]">
              {formatDate(prediction?.nextPeriod)}
            </span>
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#FEF4F4] p-3">
              <p className="text-xs text-[#8F8C8C]">Ovulation</p>
              <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
                {formatDate(prediction?.ovulation)}
              </p>
            </div>
            <div className="rounded-xl bg-[#FEF4F4] p-3">
              <p className="text-xs text-[#8F8C8C]">Fertile Window</p>
              <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
                {formatDate(prediction?.fertileWindow?.start)} -{" "}
                {formatDate(prediction?.fertileWindow?.end)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-[#FEE4EB] p-3">
            <p className="text-xs font-semibold text-[#F33B7D]">
              Today's Insight
            </p>
            

<p className="mt-2 text-xs text-[#3D3939]">
  {insight}
</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <h2 className="mb-4 font-display text-base font-semibold text-[#0D0D0D]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {quickActions.map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              className="flex flex-col items-center gap-2 rounded-xl bg-[#FEF4F4] p-3 text-center transition hover:bg-[#FEE4EB]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#F33B7D] shadow-sm">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-medium leading-tight text-[#3D3939]">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="mt-4 rounded-2xl bg-[#F33B7D] p-4 text-white shadow-[0_10px_24px_-4px_rgba(243,59,125,0.4)]">
        <p className="text-sm font-semibold">Tip of the Day</p>
        <p className="mt-1 text-xs text-white/85">
          Drinking warm water and stretching can help reduce period pain.
        </p>
      </div>
    </PageLayout>
  );
}
