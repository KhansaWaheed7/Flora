import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { createPregnancy } from "../../services/pregnancy.service";

export default function PregnancyOnboarding() {
  const navigate = useNavigate();
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createPregnancy(lastPeriodDate);
      navigate("/pregnancy");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not start tracking. Check the date and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Pregnancy"
      subtitle="Track your pregnancy journey and stay healthy."
    >
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 sm:p-8">
        <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-[#FEE4EB]">
          <Heart className="h-12 w-12 text-[#F33B7D]" strokeWidth={1.5} />
        </div>

        <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
          Start Your Pregnancy Journey
        </h2>
        <p className="mt-1 text-sm text-[#8F8C8C]">
          Track your pregnancy with personalized guidance at every stage.
        </p>

        <form onSubmit={handleStart} className="mt-6 space-y-4 text-left">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#3D3939]">
              Last Menstrual Period (LMP)
            </label>
            <input
              type="date"
              required
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-3.5 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !lastPeriodDate}
            className="w-full rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Starting..." : "Start Tracking"}
          </button>
          <p className="text-center text-xs text-[#B8AEB2]">
            Your due date will be calculated automatically.
          </p>
        </form>
      </div>
    </PageLayout>
  );
}
