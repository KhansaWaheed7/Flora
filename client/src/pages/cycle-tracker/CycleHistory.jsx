import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Edit3, Trash2, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
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
  if (!start || !end) return "";
  const s = new Date(start);
  const e = new Date(end);
  const opts = { day: "numeric", month: "long", year: "numeric" };
  return `${s.getDate()} - ${e.toLocaleDateString("en-US", opts)}`;
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

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Delete this cycle entry?")) return;
    try {
      await deleteCycle(id);
      setCycles((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete. Try again.");
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
          <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <button
              onClick={() => setView("calendar")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                view === "calendar"
                  ? "bg-[#FEE4EB] text-[#F33B7D]"
                  : "text-[#8F8C8C]"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                view === "list" ? "bg-[#F33B7D] text-white" : "text-[#8F8C8C]"
              }`}
            >
              List
            </button>
          </div>

          <select className="rounded-xl border border-[#F0DCE4] bg-white px-3 py-2 text-xs font-medium text-[#3D3939] outline-none">
            <option>Sort: Latest</option>
            <option>Sort: Oldest</option>
          </select>
        </div>

        {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
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
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
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
                    className="block rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(243,59,125,0.1)]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#0D0D0D]">
                        {formatRange(cycle.periodStart, cycle.periodEnd)}
                      </p>
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/cycle-tracker/${cycle._id}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#8F8C8C] hover:text-[#F33B7D]"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(e, cycle._id)}
                          className="text-[#8F8C8C] hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#8F8C8C]">
                      <span>
                        Cycle Length{" "}
                        <span className="font-semibold text-[#0D0D0D]">
                          {cycle.cycleLength ?? "-"} Days
                        </span>
                      </span>
                      <span>
                        Period Length{" "}
                        <span className="font-semibold text-[#0D0D0D]">
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
                            <span className="text-[#B8AEB2]">+{extra}</span>
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
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#F0DCE4] bg-white px-6 py-3 text-sm font-semibold text-[#3D3939] transition hover:bg-[#FEF4F4]"
            >
              <CalendarDays className="h-4 w-4" /> View Calendar
            </button>
          </>
        )}
      </div>
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
    if (!c.periodStart || !c.periodEnd) return;
    eachDay(c.periodStart, c.periodEnd).forEach((d) =>
      periodDays.add(dayKey(d))
    );
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

  const goPrevMonth = () =>
    setMonthCursor(new Date(year, month - 1, 1));
  const goNextMonth = () =>
    setMonthCursor(new Date(year, month + 1, 1));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goPrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#3D3939] hover:bg-[#FEE4EB] hover:text-[#F33B7D]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-sm font-semibold text-[#0D0D0D]">
          {monthLabel}
        </p>
        <button
          onClick={goNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#3D3939] hover:bg-[#FEE4EB] hover:text-[#F33B7D]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-xs font-medium text-[#B8AEB2]">
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
            cellClass += " ring-2 ring-[#F33B7D] text-[#0D0D0D]";
          } else {
            cellClass += " text-[#3D3939]";
          }

          return (
            <div key={i}>
              <div className={cellClass}>{d}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#F0DCE4] pt-4 text-xs text-[#8F8C8C]">
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
