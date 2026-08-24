import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import {
  getPregnancy,
  createPregnancy,
  updatePregnancy,
  formatDate,
} from "../../services/pregnancy.service";

function estimateDueDate(lmp) {
  if (!lmp) return null;
  const d = new Date(lmp);
  d.setDate(d.getDate() + 280);
  return d;
}

function weeksPregnant(lmp) {
  if (!lmp) return null;
  const days = Math.floor((Date.now() - new Date(lmp)) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.floor(days / 7));
}

export default function RegisterPregnancy() {
  const navigate = useNavigate();
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [isExisting, setIsExisting] = useState(false); // NEW
  const [checkingExisting, setCheckingExisting] = useState(true); // NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPregnancy();
        if (res?.pregnancy?.lastPeriodDate) {
          setLastPeriodDate(
            new Date(res.pregnancy.lastPeriodDate).toISOString().split("T")[0]
          );
          setIsExisting(true); // NEW — a record exists, so submit should UPDATE
        }
      } catch (err) {
        // No existing pregnancy — fine, form just starts empty, stays a CREATE
      } finally {
        setCheckingExisting(false); // NEW
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isExisting) {
        await updatePregnancy(lastPeriodDate);
      } else {
        await createPregnancy(lastPeriodDate); // NEW — actually creates on first register
      }
      navigate("/pregnancy");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not save. Check the date and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const dueDate = estimateDueDate(lastPeriodDate);
  const weeks = weeksPregnant(lastPeriodDate);

  if (checkingExisting) {
    return (
      <PageLayout title="Register Pregnancy" subtitle="Enter your last menstrual period to get started." backTo="/pregnancy">
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={isExisting ? "Update Pregnancy" : "Register Pregnancy"}
      subtitle="Enter your last menstrual period to get started."
      backTo="/pregnancy"
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
      >
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#3D3939]">
            Last Menstrual Period (LMP)
          </label>
          <p className="mb-2 text-xs text-[#8F8C8C]">
            Select the first day of your last period.
          </p>
          <input
            type="date"
            required
            value={lastPeriodDate}
            onChange={(e) => setLastPeriodDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-3.5 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
          />
        </div>

        {dueDate && (
          <div className="rounded-xl bg-[#FEE4EB] p-4">
            <p className="text-xs font-semibold text-[#F33B7D]">
              Your Estimated Due Date
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-[#0D0D0D]">
              {formatDate(dueDate)}
            </p>
            <p className="mt-1 text-xs text-[#3D3939]">
              You are approximately {weeks} Weeks Pregnant
            </p>
          </div>
        )}

        <div className="rounded-xl bg-[#FEF4F4] p-3 text-xs text-[#8F8C8C]">
          <span className="font-semibold text-[#3D3939]">Note: </span>
          Due date is calculated based on a 28-day cycle. It may vary as your
          pregnancy progresses.
        </div>

        <button
          type="submit"
          disabled={loading || !lastPeriodDate}
          className="w-full rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </PageLayout>
  );
}