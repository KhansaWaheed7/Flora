import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Edit3, Trash2, ChevronLeft, ChevronRight, CalendarDays, AlertTriangle, X } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import {
  getCycles,
  getPrediction,
  deleteCycle,
  symptomEnumToLabel,
} from "../../services/cycle.service";

const symptomEmoji = {
  Cramps: "🔴",
  Bloating: "💧",
  Fatigue: "😴",
  Headache: "🤕",
  "Mood Swings": "🎭",
  "Back Pain": "🦴",
  "Breast Tenderness": "💗",
  Acne: "🌸",
  Nausea: "🤢",
  Insomnia: "🌙",
};

function formatRange(start, end) {
  if (!start) return "";

  const s = new Date(start);

  const opts = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (!end) {
    return `${s.toLocaleDateString("en-US", opts)} - Present`;
  }

  const e = new Date(end);

  return `${s.getDate()} - ${e.toLocaleDateString(
    "en-US",
    opts
  )}`;
}

// Local-date-only key (avoids timezone shifting a date to the wrong day)
function dayKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function eachDay(start, end) {
  const days = [];
  const d = new Date(start);
  d.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (d <= last) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// Custom overlay confirmation modal — replaces window.confirm
function ConfirmDeleteModal({ open, cycleLabel, onCancel, onConfirm, deleting }) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape" && !deleting) onCancel();
    };

    document.addEventListener("keydown", handleKey);
    // Prevent background scroll while modal is open
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

      {/* Keyframes (scoped via inline style tag so no tailwind config change is needed) */}
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

export default function CycleHistory() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState(
    searchParams.get("view") === "calendar" ? "calendar" : "list"
  );
  const [cycles, setCycles] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  // Delete confirmation modal state
  const [confirmTarget, setConfirmTarget] = useState(null); // { id, label } | null
  const [deleting, setDeleting] = useState(false);

  const loadCycles = async () => {
    setLoading(true);
    try {
      const res = await getCycles();
      const list = res.data || res.cycles || res;
      setCycles(Array.isArray(list) ? list : []);
    } catch (err) {
      setError("Could not load your cycle history.");
    } finally {
      setLoading(false);
    }
    // Prediction is optional for this page (calendar still works without it) —
    // don't let a failed/empty prediction block the cycle list from loading.
    try {
      const predRes = await getPrediction();
      setPrediction(predRes.data || predRes);
    } catch (err) {
      setPrediction(null);
    }
  };

  useEffect(() => {
    loadCycles();
  }, []);

  // Open the custom overlay instead of window.confirm
  const handleDelete = (e, cycle) => {
    e.preventDefault();
    e.stopPropagation();
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
      setCycles((prev) => prev.filter((c) => c._id !== confirmTarget.id));
      setConfirmTarget(null);
    } catch (err) {
      alert("Failed to delete. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageLayout
      title="Cycle History"
      subtitle="View your past cycles."
      backTo="/cycle-tracker"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-[#F5E4EC]">
            <button
              onClick={() => setView("calendar")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                view === "calendar"
                  ? "bg-[#FEE4EB] text-[#F33B7D]"
                  : "text-[#A8849A]"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                view === "list" ? "bg-[#F33B7D] text-white" : "text-[#A8849A]"
              }`}
            >
              List
            </button>
          </div>

          <select className="rounded-xl border border-[#F0DCE4] bg-white px-3 py-2 text-xs font-medium text-[#3D2A33] outline-none">
            <option>Sort: Latest</option>
            <option>Sort: Oldest</option>
          </select>
        </div>

        {loading && <p className="text-sm text-[#A8849A]">Loading...</p>}
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && view === "calendar" && (
          <CalendarGrid
            cycles={cycles}
            prediction={prediction}
            monthCursor={monthCursor}
            setMonthCursor={setMonthCursor}
          />
        )}

        {!loading && !error && view === "list" && (
          <>
            {cycles.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#A8849A] shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
                No cycles logged yet.
              </div>
            )}

            <div className="space-y-3">
              {cycles.map((cycle) => {
                const symptomLabels = (cycle.symptoms || [])
                  .filter((s) => s !== "none")
                  .map((s) => symptomEnumToLabel[s] || s);
                const shown = symptomLabels.slice(0, 3);
                const extra = symptomLabels.length - shown.length;

                return (
                  <Link
                    key={cycle._id}
                    to={`/cycle-tracker/${cycle._id}`}
                    className="block rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(243,59,125,0.1)]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#3D2A33]">
                        {formatRange(cycle.periodStart, cycle.periodEnd)}
                      </p>
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/cycle-tracker/${cycle._id}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#A8849A] hover:text-[#F33B7D]"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(e, cycle)}
                          className="text-[#A8849A] hover:text-red-500"
                          aria-label="Delete cycle"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#A8849A]">
                      <span>
                        Cycle Length{" "}
                        <span className="font-semibold text-[#3D2A33]">
                          {cycle.cycleLength ?? "-"} Days
                        </span>
                      </span>
                      <span>
                        Period Length{" "}
                        <span className="font-semibold text-[#3D2A33]">
                          {cycle.periodLength ?? "-"} Days
                        </span>
                      </span>
                      {shown.length > 0 && (
                        <span className="flex items-center gap-1">
                          Symptoms
                          {shown.map((s) => (
                            <span key={s}>{symptomEmoji[s] || "🔸"}</span>
                          ))}
                          {extra > 0 && (
                            <span className="text-[#C9A8B8]">+{extra}</span>
                          )}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => setView("calendar")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#F0DCE4] bg-white px-6 py-3 text-sm font-semibold text-[#3D2A33] transition hover:bg-[#FEF4F4]"
            >
              <CalendarDays className="h-4 w-4" /> View Calendar
            </button>
          </>
        )}
      </div>

      {/* Overlay delete confirmation */}
      <ConfirmDeleteModal
        open={!!confirmTarget}
        cycleLabel={confirmTarget?.label}
        deleting={deleting}
        onCancel={() => !deleting && setConfirmTarget(null)}
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
}

function CalendarGrid({ cycles, prediction, monthCursor, setMonthCursor }) {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday

  // Build lookup sets so each day only needs an O(1) check
  const periodDays = new Set();

  cycles.forEach((c) => {
    if (!c.periodStart) return;

    const start = new Date(c.periodStart);

    const end = c.periodEnd ? new Date(c.periodEnd) : new Date();

    eachDay(start, end).forEach((d) => {
      periodDays.add(dayKey(d));
    });
  });

  const predictedPeriodDays = new Set();
  if (prediction?.nextPeriod) {
    const length = prediction.periodLength || 5;
    const start = new Date(prediction.nextPeriod);
    const end = new Date(start);
    end.setDate(end.getDate() + length - 1);
    eachDay(start, end).forEach((d) => predictedPeriodDays.add(dayKey(d)));
  }

  const fertileDays = new Set();
  if (prediction?.fertileWindow?.start && prediction?.fertileWindow?.end) {
    eachDay(
      prediction.fertileWindow.start,
      prediction.fertileWindow.end
    ).forEach((d) => fertileDays.add(dayKey(d)));
  }

  const ovulationKey = prediction?.ovulation
    ? dayKey(new Date(prediction.ovulation))
    : null;

  const todayKey = dayKey(new Date());

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = monthCursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goPrevMonth = () => setMonthCursor(new Date(year, month - 1, 1));
  const goNextMonth = () => setMonthCursor(new Date(year, month + 1, 1));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goPrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#3D2A33] hover:bg-[#FEE4EB] hover:text-[#F33B7D]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-sm font-semibold text-[#3D2A33]">
          {monthLabel}
        </p>
        <button
          onClick={goNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#3D2A33] hover:bg-[#FEE4EB] hover:text-[#F33B7D]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-xs font-medium text-[#C9A8B8]">
            {d}
          </div>
        ))}

        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;

          const date = new Date(year, month, d);
          const key = dayKey(date);
          const isPeriod = periodDays.has(key);
          const isPredicted = !isPeriod && predictedPeriodDays.has(key);
          const isOvulation = key === ovulationKey;
          const isFertile = !isOvulation && fertileDays.has(key);
          const isToday = key === todayKey;

          let cellClass =
            "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm";

          if (isPeriod) {
            cellClass += " bg-[#F33B7D] font-semibold text-white";
          } else if (isOvulation) {
            cellClass += " bg-[#A855F7] font-semibold text-white";
          } else if (isPredicted) {
            cellClass +=
              " border-2 border-dashed border-[#F33B7D] font-semibold text-[#F33B7D]";
          } else if (isFertile) {
            cellClass += " bg-[#F3E8FF] text-[#7E22CE]";
          } else if (isToday) {
            cellClass += " ring-2 ring-[#F33B7D] text-[#3D2A33]";
          } else {
            cellClass += " text-[#3D2A33]";
          }

          return (
            <div key={i}>
              <div className={cellClass}>{d}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#F0DCE4] pt-4 text-xs text-[#A8849A]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F33B7D]" /> Period
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-[#F33B7D]" />{" "}
          Predicted Period
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#A855F7]" /> Ovulation
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F3E8FF]" /> Fertile
          Window
        </span>
      </div>
    </div>
  );
}