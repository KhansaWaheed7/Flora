import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import {
  getCycle,
  updateCycle,
  symptomLabelToEnum,
  symptomEnumToLabel,
} from "../../services/cycle.service";

const symptomOptions = Object.keys(symptomLabelToEnum);

function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function EditCycle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCycle = async () => {
      try {
        const res = await getCycle(id);
        const cycle = res.data || res.cycle || res;
        setPeriodStart(toDateInput(cycle.periodStart));
        setPeriodEnd(toDateInput(cycle.periodEnd));
        setSymptoms(
          (cycle.symptoms || []).map((s) => symptomEnumToLabel[s] || s)
        );
        setNotes(cycle.notes || "");
      } catch (err) {
        setError("Could not load this cycle.");
      } finally {
        setFetching(false);
      }
    };
    loadCycle();
  }, [id]);

  const periodLength =
    periodStart && periodEnd
      ? Math.max(
          1,
          Math.round(
            (new Date(periodEnd) - new Date(periodStart)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : null;

  const toggleSymptom = (symptom) => {
    if (symptom === "None") {
      setSymptoms(["None"]);
      return;
    }
    setSymptoms((prev) => {
      const withoutNone = prev.filter((s) => s !== "None");
      return withoutNone.includes(symptom)
        ? withoutNone.filter((s) => s !== symptom)
        : [...withoutNone, symptom];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await updateCycle(id, {
        periodStart,
        periodEnd,
        periodLength,
        symptoms: symptoms.map((s) => symptomLabelToEnum[s]),
        notes,
      });
      navigate(`/cycle-tracker/${id}`);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update cycle. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageLayout
        title="Edit Cycle"
        subtitle="Update your period details."
        backTo="/cycle-tracker/history"
      >
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Edit Cycle"
      subtitle="Update your period details."
      backTo={`/cycle-tracker/${id}`}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Period Dates */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <h2 className="mb-4 font-display text-sm font-semibold text-[#0D0D0D]">
            1. Period Dates
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#3D3939]">
                Start Date
              </label>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-3.5 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#3D3939]">
  End Date{" "}
  <span className="font-normal text-[#B8AEB2]">
    (Add when period finishes)
  </span>
</label>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-3.5 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
              />
            </div>
          </div>
          {periodLength && (
            <p className="mt-3 text-xs font-semibold text-[#F33B7D]">
              Period Length: {periodLength} Days
            </p>
          )}
        </div>

        {/* Symptoms */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-[#0D0D0D]">
              2. Symptoms
            </h2>
            <button
              type="button"
              onClick={() => setSymptoms([])}
              className="text-xs font-semibold text-[#F33B7D]"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map((symptom) => {
              const active = symptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${
                    active
                      ? "border-[#F33B7D] bg-[#FEE4EB] text-[#F33B7D]"
                      : "border-[#F0DCE4] bg-white text-[#3D3939]"
                  }`}
                >
                  {symptom}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <h2 className="mb-4 font-display text-sm font-semibold text-[#0D0D0D]">
            3. Notes{" "}
            <span className="font-normal text-[#B8AEB2]">(Optional)</span>
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling today?"
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-3.5 py-2.5 text-sm text-[#0D0D0D] outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Cycle"}
        </button>
      </form>
    </PageLayout>
  );
}
