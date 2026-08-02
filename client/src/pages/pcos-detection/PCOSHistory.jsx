import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { getAssessmentHistory } from "../../services/pcos.service";

function getRiskColors(risk) {
  const r = (risk || "").toLowerCase();
  if (r.includes("high")) return { text: "text-[#F33B7D]", bg: "bg-[#FEE4EB]" };
  if (r.includes("medium") || r.includes("moderate"))
    return { text: "text-amber-600", bg: "bg-amber-50" };
  if (r.includes("low")) return { text: "text-green-600", bg: "bg-green-50" };
  return { text: "text-amber-600", bg: "bg-amber-50" };
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

export default function PCOSHistory() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const history = await getAssessmentHistory();
        setAssessments(history);
      } catch (err) {
        setError("Could not load your assessment history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageLayout
      title="Assessment History"
      subtitle="View and track your past PCOS assessments."
    >
      <div className="mx-auto max-w-2xl space-y-3">
        {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {!loading && !error && assessments.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <ShieldCheck className="mx-auto h-8 w-8 text-[#F33B7D]" />
            <p className="mt-3 text-sm font-semibold text-[#0D0D0D]">
              No assessments yet
            </p>
            <p className="mt-1 text-xs text-[#8F8C8C]">
              Take your first PCOS assessment to see results here.
            </p>
            <Link
              to="/pcos-detection"
              className="mt-4 inline-block rounded-full bg-[#F33B7D] px-6 py-2.5 text-sm font-semibold text-white"
            >
              Start Assessment
            </Link>
          </div>
        )}

        {assessments.map((a) => {
          const colors = getRiskColors(a.risk);
          return (
            <Link
              key={a._id}
              to={`/pcos-detection/${a._id}`}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(243,59,125,0.1)]"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}
                >
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-[#8F8C8C]">
                    {formatDateTime(a.createdAt)}
                  </p>
                  <p
                    className={`font-display text-sm font-semibold capitalize ${colors.text}`}
                  >
                    {a.risk}
                  </p>
                  <p className="text-xs text-[#8F8C8C]">
                    Confidence: {Math.round(a.confidence)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}
                >
                  {Math.round(a.probability)}% Probability
                </span>
                <ChevronRight className="h-4 w-4 text-[#B8AEB2]" />
              </div>
            </Link>
          );
        })}

        {assessments.length > 0 && (
          <div className="rounded-xl bg-[#FEF4F4] p-3 text-center">
            <p className="text-xs text-[#8F8C8C]">
              Regular assessments help you track your health progress over
              time.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
