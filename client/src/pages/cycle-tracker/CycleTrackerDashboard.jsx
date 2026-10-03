import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Droplet,
  Repeat,
  History,
  CalendarDays,
  BarChart3,
  Edit3,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import PageLayout from "../../layouts/PageLayout";
import { getCycleDashboard, deleteCycle } from "../../services/cycle.service";
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

function formatRange(start, end) {
  if (!start) return "";
  const s = new Date(start);
  const opts = { day: "numeric", month: "long", year: "numeric" };
  if (!end) {
    return `${s.toLocaleDateString("en-US", opts)} - Present`;
  }
  const e = new Date(end);
  return `${s.getDate()} - ${e.toLocaleDateString("en-US", opts)}`;
}

// Custom overlay confirmation modal — replaces window.confirm
function ConfirmDeleteModal({ open, cycleLabel, onCancel, onConfirm, deleting }) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape" && !deleting) onCancel();
    };

    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, deleting, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-cycle-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#3D2A33]/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
        onClick={() => !deleting && onCancel()}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_24px_60px_-12px_rgba(243,59,125,0.35)] ring-1 ring-[#F5E4EC] animate-[popIn_0.18s_ease-out]">
        <button
          onClick={() => !deleting && onCancel()}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#C9A8B8] transition hover:bg-[#FEF4F4] hover:text-[#F33B7D]"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEE4EB] text-[#F33B7D] shadow-[0_8px_20px_-6px_rgba(243,59,125,0.35)]">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h3
          id="delete-cycle-title"
          className="mt-4 text-center font-display text-lg font-semibold text-[#3D2A33]"
        >
          Delete this cycle?
        </h3>

        <p className="mt-2 text-center text-sm text-[#A8849A]">
          {cycleLabel ? (
            <>
              You're about to delete the cycle entry for{" "}
              <span className="font-semibold text-[#3D2A33]">{cycleLabel}</span>.
              This action can't be undone.
            </>
          ) : (
            "This action can't be undone."
          )}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 rounded-full border border-[#F5E4EC] bg-white px-4 py-2.5 text-sm font-semibold text-[#3D2A33] transition hover:bg-[#FEF4F4] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-full bg-[#F33B7D] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(243,59,125,0.6)] transition hover:bg-[#d92b6b] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function CycleTrackerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete confirmation modal state
  const [confirmTarget, setConfirmTarget] = useState(null); // { id, label } | null
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCycleDashboard();
      setData(res.data || res);
      setError("");
    } catch (err) {
      // 404/empty likely means no cycles logged yet
      setError(err?.response?.status === 404 ? "empty" : "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeleteClick = (cycle) => {
    setConfirmTarget({
      id: cycle._id,
      label: formatRange(cycle.periodStart, cycle.periodEnd),
    });
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteCycle(confirmTarget.id);
      setConfirmTarget(null);
      // Reload dashboard so the UI reflects the removal.
      // If it was the only cycle, the load will resolve to the empty state.
      await load();
    } catch (err) {
      alert("Failed to delete. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Cycle Tracker Dashboard"
        subtitle="Track your cycle, understand your body."
      >
        <p className="text-sm text-[#A8849A]">Loading...</p>
      </PageLayout>
    );
  }

  // Pregnancy and menstrual-cycle tracking are mutually exclusive.
  // Historical cycle data is preserved, but active cycle tracking/predictions pause.
  if (data?.isPaused || data?.prediction?.isPaused) {
    return (
      <PageLayout
        title="Cycle Tracker Dashboard"
        subtitle="Your menstrual cycle tracker is currently paused."
      >
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE4EB]">
            <span className="text-2xl">♥</span>
          </div>
          <h2 className="mt-5 font-display text-xl font-semibold text-[#3D2A33]">
            Menstrual Cycle Tracking Paused
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#A8849A]">
            Your active pregnancy has paused menstrual-cycle predictions and
            period logging. Your previous cycle history is safely preserved.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/pregnancy"
              className="rounded-full bg-[#F33B7D] px-5 py-2.5 text-sm font-semibold text-white"
            >
              View Pregnancy
            </Link>
            <Link
              to="/cycle-tracker/history"
              className="rounded-full border border-[#F0DCE4] bg-white px-5 py-2.5 text-sm font-semibold text-[#F33B7D]"
            >
              View Cycle History
            </Link>
          </div>
        </div>
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
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <p className="text-sm font-semibold text-red-600">
            Couldn't load your dashboard.
          </p>
          <p className="mt-1 text-xs text-[#A8849A]">
            This usually means the request failed (session expired, network
            issue, or server error) — not that your data is gone. Try
            refreshing the page.
          </p>
        </div>
      </PageLayout>
    );
  }

  // Real backend shape: { latestCycle, prediction }
  // prediction can also return { isTracking: false, reason: "no_cycle_data" }
  // for a new user who has not logged a period yet.
  const { latestCycle, prediction } = data;

  if (
    prediction?.requiresNewCycle === true ||
    prediction?.reason === "needs_new_cycle"
  ) {
    return (
      <PageLayout
        title="Cycle Tracker Dashboard"
        subtitle="Start a new menstrual cycle after pregnancy tracking."
      >
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE4EB]">
            <Droplet className="h-7 w-7 text-[#F33B7D]" />
          </div>

          <h2 className="mt-5 font-display text-xl font-semibold text-[#3D2A33]">
            Start a New Cycle
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#A8849A]">
            Your pregnancy tracking has ended. Please enter your latest period
            details to start menstrual cycle tracking again.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/cycle-tracker/log"
              className="rounded-full bg-[#F33B7D] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Log New Period
            </Link>

            <Link
              to="/cycle-tracker/history"
              className="rounded-full border border-[#F0DCE4] bg-white px-5 py-2.5 text-sm font-semibold text-[#F33B7D]"
            >
              View Cycle History
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (
    !latestCycle ||
    prediction?.isTracking === false ||
    prediction?.reason === "no_cycle_data"
  ) {
    return <NoCycleData />;
  }

  const periodInProgress = !latestCycle?.periodEnd;

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

  // Cycle health styling — bright green for regular, bright amber for irregular
  const isIrregular = prediction?.health?.status === "Irregular";

  const healthCardClasses = isIrregular
    ? "rounded-xl bg-amber-100 ring-1 ring-amber-300 p-3"
    : "rounded-xl bg-green-100 ring-1 ring-green-300 p-3";

  const healthHeaderClasses = isIrregular
    ? "flex items-center gap-1.5 text-xs font-semibold text-amber-700"
    : "flex items-center gap-1.5 text-xs font-semibold text-green-700";

  const healthValueClasses = isIrregular
    ? "mt-0.5 text-sm font-semibold text-amber-800"
    : "mt-0.5 text-sm font-semibold text-green-800";

  const healthInsightClasses = isIrregular
    ? "text-xs text-amber-800/80"
    : "text-xs text-green-800/80";

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
      {/* Quick Actions — moved to top */}
      <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
        <h2 className="mb-4 font-display text-base font-semibold text-[#3D2A33]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {quickActions.map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              className="group flex flex-col items-center gap-2 rounded-xl bg-[#FEE4EB] p-3 text-center ring-1 ring-[#FBCFE8] shadow-[0_2px_8px_rgba(243,59,125,0.08)] transition-all duration-200 hover:bg-[#FDD5E3] hover:ring-[#F9A8C7] hover:shadow-[0_6px_16px_rgba(243,59,125,0.18)] hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#F33B7D] shadow-[0_2px_6px_rgba(243,59,125,0.15)] transition-transform duration-200 group-hover:scale-110">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-semibold leading-tight text-[#3D2A33] group-hover:text-[#F33B7D] transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Current Cycle */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#A8849A]">Current Cycle</p>
              <p className="mt-1 font-display text-lg font-semibold text-[#3D2A33]">
                Day {currentDay ?? "Not available"} of {cycleLength}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Link
                to={`/cycle-tracker/${latestCycle._id}/edit`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#A8849A] transition hover:bg-[#FEF4F4] hover:text-[#F33B7D]"
                aria-label="Edit cycle"
                title="Edit cycle"
              >
                <Edit3 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDeleteClick(latestCycle)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#A8849A] transition hover:bg-red-50 hover:text-red-500"
                aria-label="Delete cycle"
                title="Delete cycle"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-[#F33B7D] px-3 py-1 text-xs font-semibold text-white">
              {currentPhase} Phase
            </span>
          </div>

          {periodInProgress && (
            <div className="mt-3 rounded-xl bg-[#FEE4EB] p-3">
              <p className="text-xs font-semibold text-[#F33B7D]">
                Period in progress
              </p>

              <p className="mt-1 text-xs text-[#3D2A33]">
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
              <p className="font-display text-2xl font-semibold text-[#3D2A33]">
                {currentDay ?? "Not available"}
              </p>

              <p className="text-xs text-[#A8849A]">
                of {cycleLength}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-[#F33B7D]">
                {currentPhase}
              </p>
            </div>
          </div>

          <div className={healthCardClasses}>
            <p className={healthHeaderClasses}>
              <ShieldCheck className="h-3.5 w-3.5" /> Cycle Health
            </p>
            <p className={healthValueClasses}>
              {prediction?.health?.status || "Not available"}
            </p>
            <p className={healthInsightClasses}>{insight}</p>
          </div>
        </div>

        {/* Next Period */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <p className="text-xs font-semibold text-[#A8849A]">Next Period</p>
          <p className="mt-1 font-display text-3xl font-semibold text-[#F33B7D]">
            {periodInProgress
              ? "Period in progress"
              : daysUntilNextPeriod === null
              ? "-"
              : daysUntilNextPeriod < 0
              ? `${Math.abs(daysUntilNextPeriod)} Days Late`
              : `${daysUntilNextPeriod} Days Left`}
          </p>
          <p className="mt-1 text-sm text-[#A8849A]">
            {periodInProgress ? "Next period expected on" : "Expected on"}{" "}
            <span className="font-semibold text-[#3D2A33]">
              {formatDate(prediction?.nextPeriod)}
            </span>
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#FEF4F4] p-3">
              <p className="text-xs text-[#A8849A]">Ovulation</p>
              <p className="mt-1 text-sm font-semibold text-[#3D2A33]">
                {formatDate(prediction?.ovulation)}
              </p>
            </div>
            <div className="rounded-xl bg-[#FEF4F4] p-3">
              <p className="text-xs text-[#A8849A]">Fertile Window</p>
              <p className="mt-1 text-sm font-semibold text-[#3D2A33]">
                {formatDate(prediction?.fertileWindow?.start)} -{" "}
                {formatDate(prediction?.fertileWindow?.end)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-[#FEE4EB] p-3">
            <p className="text-xs font-semibold text-[#F33B7D]">
              Today's Insight
            </p>

            <p className="mt-2 text-xs text-[#3D2A33]">
              {insight}
            </p>
          </div>
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="mt-4 rounded-2xl bg-[#F33B7D] p-4 text-white shadow-[0_10px_24px_-4px_rgba(243,59,125,0.4)]">
        <p className="text-sm font-semibold">Tip of the Day</p>
        <p className="mt-1 text-xs text-white/85">
          Drinking warm water and stretching can help reduce period pain.
        </p>
      </div>

      {/* Overlay delete confirmation */}
      <ConfirmDeleteModal
        open={!!confirmTarget}
        cycleLabel={confirmTarget?.label}
        onCancel={() => !deleting && setConfirmTarget(null)}
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
}