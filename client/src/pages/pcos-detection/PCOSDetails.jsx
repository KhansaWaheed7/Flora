import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import {
  getAssessmentHistory,
  deleteAssessment,
} from "../../services/pcos.service";

function getRiskColor(risk) {
  const r = (risk || "").toLowerCase();
  if (r.includes("high")) return "#F33B7D";
  if (r.includes("medium") || r.includes("moderate")) return "#F59E0B";
  if (r.includes("low")) return "#22C55E";
  return "#F59E0B";
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PCOSDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // No GET /pcos/:id on the backend - fetch the full history and
    // find this one client-side instead.
    const load = async () => {
      try {
        const history = await getAssessmentHistory();
        const found = history.find((a) => a._id === id);
        if (!found) {
          setError("Assessment not found.");
        } else {
          setAssessment(found);
        }
      } catch (err) {
        setError("Could not load this assessment.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this assessment? This can't be undone.")) return;
    try {
      await deleteAssessment(id);
      navigate("/pcos-detection/history");
    } catch (err) {
      alert("Failed to delete. Try again.");
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Assessment Details"
        subtitle="Detailed information about this assessment."
        backTo="/pcos-detection/history"
      >
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  if (error || !assessment) {
    return (
      <PageLayout
        title="Assessment Details"
        subtitle="Detailed information about this assessment."
        backTo="/pcos-detection/history"
      >
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "Assessment not found."}
        </div>
      </PageLayout>
    );
  }

  const color = getRiskColor(assessment.risk);
  const factors = assessment.topFactors || [];
  const recommendations = assessment.recommendations || [];

  return (
    <PageLayout
      title="Assessment Details"
      subtitle="Detailed information about this assessment."
      backTo="/pcos-detection/history"
    >
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Stat row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[#FEE4EB] p-4">
            <p className="text-xs text-[#8F8C8C]">Risk Level</p>
            <p
              className="mt-1 font-display text-lg font-semibold capitalize"
              style={{ color }}
            >
              {assessment.risk}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <p className="text-xs text-[#8F8C8C]">Probability</p>
            <p className="mt-1 font-display text-lg font-semibold text-[#0D0D0D]">
              {Math.round(assessment.probability)}%
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <p className="text-xs text-[#8F8C8C]">Confidence</p>
            <p className="mt-1 font-display text-lg font-semibold text-[#0D0D0D]">
              {Math.round(assessment.confidence)}%
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-xs text-[#8F8C8C]">Date</p>
          <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
            {formatDateTime(assessment.createdAt)}
          </p>
        </div>

        {/* Factors + Recommendations */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-3 font-display text-sm font-semibold text-[#0D0D0D]">
              Top Contributing Factors
            </h2>
            {factors.length === 0 ? (
              <p className="text-sm text-[#8F8C8C]">None recorded.</p>
            ) : (
              <div className="space-y-2">
                {factors.map((factor, i) => (
                  <div key={factor} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB] text-xs font-semibold text-[#F33B7D]">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#3D3939]">{factor}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-3 font-display text-sm font-semibold text-[#0D0D0D]">
              Recommendations
            </h2>
            {recommendations.length === 0 ? (
              <p className="text-sm text-[#8F8C8C]">None recorded.</p>
            ) : (
              <div className="space-y-2">
                {recommendations.map((rec) => (
                  <div key={rec} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-[#3D3939]">{rec}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() =>
                navigate("/pcos-detection/recommendations", {
                  state: { result: assessment },
                })
              }
              className="mt-4 w-full rounded-full border border-[#F33B7D] px-4 py-2 text-xs font-semibold text-[#F33B7D] transition hover:bg-[#FEE4EB]"
            >
              View All Recommendations
            </button>
          </div>
        </div>

        {assessment.disclaimer && (
          <div className="rounded-2xl bg-[#FEE4EB] p-4">
            <p className="text-xs leading-relaxed text-[#3D3939]">
              <span className="font-semibold text-[#F33B7D]">
                Disclaimer:
              </span>{" "}
              {assessment.disclaimer}
            </p>
          </div>
        )}

        <button
          onClick={handleDelete}
          className="w-full rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5"
        >
          Delete Assessment
        </button>
      </div>
    </PageLayout>
  );
}
