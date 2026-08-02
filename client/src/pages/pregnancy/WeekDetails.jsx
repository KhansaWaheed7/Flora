import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Apple } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { getPregnancyDashboard } from "../../services/pregnancy.service";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "checklist", label: "Checklist" },
  { key: "nutrition", label: "Nutrition Tips" },
  { key: "warning", label: "Warning Signs" },
];

export default function WeekDetails() {
  const { week } = useParams();
  const weekNum = Number(week);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPregnancyDashboard();
        setData(res || null);
      } catch (err) {
        setError("Could not load week details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const currentWeek = data?.pregnancy?.currentWeek;
  const isCurrentWeek = weekNum === currentWeek;
  const weekInfo = isCurrentWeek ? data?.weekInfo : null;

  return (
    <PageLayout
      title={`Week ${weekNum} Details`}
      subtitle="Your baby's development and body changes."
      backTo="/pregnancy/weekly-guide"
    >
      {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && !isCurrentWeek && (
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-sm font-semibold text-[#0D0D0D]">
            Week {weekNum} details aren't available yet.
          </p>
          <p className="mt-1 text-xs text-[#8F8C8C]">
            Right now, detailed info is only available for your current week
            (Week {currentWeek ?? "-"}). Check back once you reach Week{" "}
            {weekNum}.
          </p>
          <Link
            to={`/pregnancy/weekly-guide/${currentWeek}`}
            className="mt-4 inline-block rounded-full bg-[#F33B7D] px-5 py-2 text-xs font-semibold text-white"
          >
            View Week {currentWeek}
          </Link>
        </div>
      )}

      {!loading && !error && isCurrentWeek && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto rounded-full bg-[#FEF4F4] p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  tab === t.key
                    ? "bg-[#F33B7D] text-white"
                    : "text-[#3D3939] hover:bg-[#FEE4EB]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <h2 className="mb-3 font-display text-sm font-semibold text-[#0D0D0D]">
                  Baby Development
                </h2>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-[#FEF4F4] p-3">
                    <p className="text-xs text-[#8F8C8C]">Size</p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
                      {weekInfo?.babySize || "-"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FEF4F4] p-3">
                    <p className="text-xs text-[#8F8C8C]">Weight</p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
                      {weekInfo?.babyWeight || "-"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FEF4F4] p-3">
                    <p className="text-xs text-[#8F8C8C]">Length</p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
                      {weekInfo?.babyLength || "-"}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#3D3939]">
                  {weekInfo?.babyDevelopment}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <h2 className="mb-2 font-display text-sm font-semibold text-[#0D0D0D]">
                  Mother's Body Changes
                </h2>
                <p className="text-sm leading-relaxed text-[#3D3939]">
                  {weekInfo?.motherChanges}
                </p>
              </div>
            </div>
          )}

          {tab === "checklist" && (
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              {weekInfo?.checklist?.length > 0 ? (
                <ul className="space-y-3">
                  {weekInfo.checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#3D3939]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#22C55E]" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#8F8C8C]">
                  No checklist items for this week.
                </p>
              )}
            </div>
          )}

          {tab === "nutrition" && (
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              {weekInfo?.nutritionTips?.length > 0 ? (
                <ul className="space-y-3">
                  {weekInfo.nutritionTips.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#3D3939]">
                      <Apple className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F59E0B]" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#8F8C8C]">
                  No nutrition tips for this week.
                </p>
              )}
            </div>
          )}

          {tab === "warning" && (
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              {weekInfo?.warningSigns?.length > 0 ? (
                <ul className="space-y-3">
                  {weekInfo.warningSigns.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#3D3939]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#8F8C8C]">
                  No warning signs listed for this week.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
