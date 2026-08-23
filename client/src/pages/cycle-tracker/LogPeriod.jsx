import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import { createCycle, symptomLabelToEnum } from "../../services/cycle.service";

const symptomOptions = Object.keys(symptomLabelToEnum);

export default function LogPeriod() {
  const navigate = useNavigate();
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  if (!periodStart) {
    setError("Please select your period start date.");
    return;
  }

  if (
    periodEnd &&
    new Date(periodEnd) < new Date(periodStart)
  ) {
    setError("End date cannot be before start date.");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      periodStart,
      symptoms: symptoms.map(
        (s) => symptomLabelToEnum[s]
      ),
      notes,
    };

    // Only send periodEnd if the user has entered it.
    if (periodEnd) {
      payload.periodEnd = periodEnd;
    }

    await createCycle(payload);

    navigate("/cycle-tracker");
  } catch (err) {
    setError(
      err?.response?.data?.message ||
        "Failed to save cycle. Try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <PageLayout
      title="Log Period"
      subtitle="Add details about your period."
      backTo="/cycle-tracker"
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
    (Optional)
  </span>
</label>

              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-3.5 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
              />
              <p className="mt-3 text-xs text-[#8F8C8C]">
  You can log your period as soon as it starts.
  Add the end date when your period finishes.
</p>
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
          {loading
  ? "Saving..."
  : periodEnd
    ? "Save Period"
    : "Start Period"}
        </button>
      </form>
    </PageLayout>
  );
}
