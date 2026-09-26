import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Clock, AlertTriangle, X } from "lucide-react";
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

export default function CycleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteCycle(id);
      navigate("/cycle-tracker/history");
    } catch (err) {
      alert("Failed to delete. Try again.");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Cycle Details"
        subtitle="Detailed information about this cycle."
        backTo="/cycle-tracker/history"
      >
        <p className="text-sm text-[#A8849A]">Loading...</p>
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

  const cycleLabel = formatRange(cycle.periodStart, cycle.periodEnd);

  return (
    <PageLayout
      title="Cycle Details"
      subtitle="Detailed information about this cycle."
      backTo="/cycle-tracker/history"
    >
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base font-semibold text-[#3D2A33]">
                {formatDate(cycle.periodStart)} - {formatDate(cycle.periodEnd)}
              </p>
              <p className="text-xs text-[#A8849A]">
                Logged on {formatDateTime(cycle.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#F5E4EC] pt-5 text-sm">
            <div>
              <p className="text-xs text-[#A8849A]">Cycle Length</p>
              <p className="mt-0.5 font-semibold text-[#3D2A33]">
                {cycle.cycleLength ?? "-"} Days
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A8849A]">Period Length</p>
              <p className="mt-0.5 font-semibold text-[#3D2A33]">
                {cycle.periodLength ?? "-"} Days
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A8849A]">Period Start</p>
              <p className="mt-0.5 font-semibold text-[#3D2A33]">
                {formatDate(cycle.periodStart)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A8849A]">Period End</p>
              <p className="mt-0.5 font-semibold text-[#3D2A33]">
                {formatDate(cycle.periodEnd)}
              </p>
            </div>
          </div>

          {symptoms.length > 0 && (
            <div className="mt-5 border-t border-[#F5E4EC] pt-5">
              <p className="mb-2 text-xs font-semibold text-[#3D2A33]">
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
            <div className="mt-5 border-t border-[#F5E4EC] pt-5">
              <p className="mb-2 text-xs font-semibold text-[#3D2A33]">
                Notes
              </p>
              <p className="text-sm text-[#A8849A]">{cycle.notes}</p>
            </div>
          )}

          <div className="mt-5 space-y-2 border-t border-[#F5E4EC] pt-5">
            <div className="flex items-center gap-2 text-xs text-[#A8849A]">
              <Clock className="h-3.5 w-3.5" /> Created{" "}
              {formatDateTime(cycle.createdAt)}
            </div>
            {cycle.updatedAt && cycle.updatedAt !== cycle.createdAt && (
              <div className="flex items-center gap-2 text-xs text-[#A8849A]">
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
            className="flex-1 rounded-full border border-[#F0DCE4] bg-white px-6 py-3 text-sm font-semibold text-[#3D2A33] transition hover:bg-[#FEF4F4]"
          >
            Delete Cycle
          </button>
        </div>
      </div>

      {/* Overlay delete confirmation */}
      <ConfirmDeleteModal
        open={confirmOpen}
        cycleLabel={cycleLabel}
        deleting={deleting}
        onCancel={() => !deleting && setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
}