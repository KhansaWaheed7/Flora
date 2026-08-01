import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import {
  getCycle,
  deleteCycle,
  symptomEnumToLabel,
} from "../../services/cycle.service";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CycleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCycle(id);
        setCycle(res.data || res.cycle || res);
      } catch (err) {
        setError("Could not load this cycle.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this cycle entry? This can't be undone.")) return;
    try {
      await deleteCycle(id);
      navigate("/cycle-tracker/history");
    } catch (err) {
      alert("Failed to delete. Try again.");
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Cycle Details"
        subtitle="Detailed information about this cycle."
        backTo="/cycle-tracker/history"
      >
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  if (error || !cycle) {
    return (
      <PageLayout
        title="Cycle Details"
        subtitle="Detailed information about this cycle."
        backTo="/cycle-tracker/history"
      >
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "Cycle not found."}
        </div>
      </PageLayout>
    );
  }

  const symptoms = (cycle.symptoms || [])
    .filter((s) => s !== "none")
    .map((s) => symptomEnumToLabel[s] || s);

  return (
    <PageLayout
      title="Cycle Details"
      subtitle="Detailed information about this cycle."
      backTo="/cycle-tracker/history"
    >
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base font-semibold text-[#0D0D0D]">
                {formatDate(cycle.periodStart)} - {formatDate(cycle.periodEnd)}
              </p>
              <p className="text-xs text-[#8F8C8C]">
                Logged on {formatDateTime(cycle.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#F7DCE4] pt-5 text-sm">
            <div>
              <p className="text-xs text-[#8F8C8C]">Cycle Length</p>
              <p className="mt-0.5 font-semibold text-[#0D0D0D]">
                {cycle.cycleLength ?? "-"} Days
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8F8C8C]">Period Length</p>
              <p className="mt-0.5 font-semibold text-[#0D0D0D]">
                {cycle.periodLength ?? "-"} Days
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8F8C8C]">Period Start</p>
              <p className="mt-0.5 font-semibold text-[#0D0D0D]">
                {formatDate(cycle.periodStart)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8F8C8C]">Period End</p>
              <p className="mt-0.5 font-semibold text-[#0D0D0D]">
                {formatDate(cycle.periodEnd)}
              </p>
            </div>
          </div>

          {symptoms.length > 0 && (
            <div className="mt-5 border-t border-[#F7DCE4] pt-5">
              <p className="mb-2 text-xs font-semibold text-[#3D3939]">
                Symptoms
              </p>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[#FEE4EB] px-3 py-1 text-xs font-medium text-[#F33B7D]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cycle.notes && (
            <div className="mt-5 border-t border-[#F7DCE4] pt-5">
              <p className="mb-2 text-xs font-semibold text-[#3D3939]">
                Notes
              </p>
              <p className="text-sm text-[#8F8C8C]">{cycle.notes}</p>
            </div>
          )}

          <div className="mt-5 space-y-2 border-t border-[#F7DCE4] pt-5">
            <div className="flex items-center gap-2 text-xs text-[#8F8C8C]">
              <Clock className="h-3.5 w-3.5" /> Created{" "}
              {formatDateTime(cycle.createdAt)}
            </div>
            {cycle.updatedAt && cycle.updatedAt !== cycle.createdAt && (
              <div className="flex items-center gap-2 text-xs text-[#8F8C8C]">
                <Clock className="h-3.5 w-3.5" /> Updated{" "}
                {formatDateTime(cycle.updatedAt)}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/cycle-tracker/${id}/edit`)}
            className="flex-1 rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5"
          >
            Edit Cycle
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 rounded-full border border-[#F0DCE4] bg-white px-6 py-3 text-sm font-semibold text-[#3D3939] transition hover:bg-[#FEF4F4]"
          >
            Delete Cycle
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
