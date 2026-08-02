import { useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  Utensils,
  CalendarDays,
  Activity,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import PageLayout from "../../layouts/PageLayout";

// Backend recommendations arrive as plain text strings (from
// utils/pcosRecommendations.js) with unconfirmed exact wording, so
// icons are picked by keyword match rather than a fixed list.
function pickIcon(text) {
  const t = text.toLowerCase();
  if (t.includes("consult") || t.includes("doctor") || t.includes("gynecologist"))
    return Users;
  if (t.includes("weight")) return ShieldCheck;
  if (t.includes("food") || t.includes("diet") || t.includes("eat"))
    return Utensils;
  if (t.includes("cycle") || t.includes("period") || t.includes("track"))
    return CalendarDays;
  if (t.includes("exercise") || t.includes("activity") || t.includes("workout"))
    return Activity;
  if (t.includes("stress") || t.includes("sleep") || t.includes("relax"))
    return HeartHandshake;
  return Sparkles;
}

export default function PCOSRecommendations() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;
  const recommendations = result?.recommendations || [];

  return (
    <PageLayout
      title="Personalized Recommendations"
      subtitle="Based on your assessment results."
    >
      <div className="mx-auto max-w-3xl">
        {recommendations.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            No recommendations available. Take an assessment first.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {recommendations.map((text) => {
              const Icon = pickIcon(text);
              return (
                <div
                  key={text}
                  className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm text-[#3D3939]">{text}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 rounded-2xl bg-[#FEE4EB] p-4">
          <p className="text-sm text-[#3D3939]">
            <span className="font-semibold text-[#F33B7D]">Remember:</span>{" "}
            Consistency is key. Small changes today can lead to a healthier
            tomorrow.
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => navigate("/pcos-detection/history")}
            className="flex-1 rounded-full border border-[#F0DCE4] bg-white px-6 py-3 text-sm font-semibold text-[#3D3939] transition hover:bg-[#FEF4F4]"
          >
            Save Assessment
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
