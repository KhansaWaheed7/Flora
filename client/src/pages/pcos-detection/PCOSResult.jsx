import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, CalendarDays } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import PageLayout from "../../layouts/PageLayout";

// risk comes from the AI model as free text (exact casing/wording
// unconfirmed), so color is picked by keyword match rather than an
// exact string match
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

export default function PCOSResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, error } = location.state || {};

  if (error || !result) {
    return (
      <PageLayout
        title="Your Assessment Result"
        subtitle="Here is your PCOS risk analysis."
      >
        <div className="mx-auto max-w-md rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "No result data found."}
        </div>
      </PageLayout>
    );
  }

  const probability = Math.round(result.probability ?? 0);
  const confidence = Math.round(result.confidence ?? 0);
  const factors = result.topFactors || [];
  const color = getRiskColor(result.risk);

  const pieData = [
    { value: probability, color },
    { value: 100 - probability, color: "#F5EAEF" },
  ];

  return (
    <PageLayout
      title="Your Assessment Result"
      subtitle="Here is your PCOS risk analysis."
    >
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Risk banner */}
        <div className="rounded-2xl bg-[#FEE4EB] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#8F8C8C]">
                Risk Level
              </p>
              <p
                className="mt-1 font-display text-2xl font-semibold capitalize"
                style={{ color }}
              >
                {result.risk}
              </p>
              {result.prediction && (
                <span className="mt-2 inline-block rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#8F8C8C]">
                  {result.prediction}
                </span>
              )}
            </div>
            <div className="relative h-24 w-24 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={32}
                    outerRadius={44}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-display text-lg font-semibold text-[#0D0D0D]">
                  {probability}%
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="-mt-2 text-center text-xs text-[#8F8C8C]">
          Probability
        </p>

        {/* Confidence + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <p className="flex items-center gap-1.5 text-xs text-[#8F8C8C]">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500" />{" "}
              Confidence Score
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-[#0D0D0D]">
              {confidence}%
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <p className="flex items-center gap-1.5 text-xs text-[#8F8C8C]">
              <CalendarDays className="h-3.5 w-3.5 text-[#F33B7D]" />{" "}
              Assessment Date
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
              {formatDateTime(result.createdAt)}
            </p>
          </div>
        </div>

        {/* Top Contributing Factors */}
        {factors.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-1 font-display text-sm font-semibold text-[#0D0D0D]">
              Top Contributing Factors
            </h2>
            <p className="mb-3 text-xs text-[#8F8C8C]">
              These factors most influenced the prediction
            </p>
            <div className="space-y-2">
              {factors.map((factor, i) => (
  <div
    key={factor.factor || factor}
    className="flex items-center gap-3"
  >
    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB] text-xs font-semibold text-[#F33B7D]">
      {i + 1}
    </span>

    <span className="text-sm text-[#3D3939]">
      {typeof factor === "string"
        ? factor
        : factor.factor}
    </span>
  </div>
))}
            </div>

            {result.disclaimer && (
              <div className="mt-4 rounded-xl bg-[#FEE4EB] p-3">
                <p className="text-xs leading-relaxed text-[#3D3939]">
                  <span className="font-semibold text-[#F33B7D]">
                    Disclaimer:
                  </span>{" "}
                  {result.disclaimer}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/pcos-detection")}
            className="flex-1 rounded-full border border-[#F0DCE4] bg-white px-6 py-3 text-sm font-semibold text-[#3D3939] transition hover:bg-[#FEF4F4]"
          >
            Done
          </button>
          <button
            onClick={() =>
              navigate("/pcos-detection/recommendations", {
                state: { result },
              })
            }
            className="flex-1 rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5"
          >
            View Recommendations
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
