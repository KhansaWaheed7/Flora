import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Apple, Ruler, Scale, Sparkles } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { getPregnancyDashboard } from "../../services/pregnancy.service";
import babyImg from "../../assets/baby.png";
import motherImg from "../../assets/mother.png";

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

  // Same ring math as Dashboard/Weekly Guide, driven by real progress
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, data?.progress ?? 0));
  const offset = circumference - (pct / 100) * circumference;

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
              {/* Baby Development */}
              <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <h2 className="mb-4 font-display text-sm font-semibold text-[#0D0D0D]">
                  Baby Development
                </h2>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB]">
                        <Ruler className="h-4 w-4 text-[#F33B7D]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs text-[#8F8C8C]">Size</p>
                        <p className="text-sm font-semibold text-[#0D0D0D]">
                          {weekInfo?.babySize || "-"}
                          {weekInfo?.babyLength ? ` (${weekInfo.babyLength})` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB]">
                        <Scale className="h-4 w-4 text-[#F33B7D]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs text-[#8F8C8C]">Weight</p>
                        <p className="text-sm font-semibold text-[#0D0D0D]">
                          {weekInfo?.babyWeight || "-"}
                        </p>
                      </div>
                    </div>

                    {weekInfo?.babyDevelopment && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB]">
                          <Sparkles className="h-4 w-4 text-[#F33B7D]" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-xs text-[#8F8C8C]">Development</p>
                          <p className="text-sm font-semibold leading-snug text-[#0D0D0D]">
                            {weekInfo.babyDevelopment}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Same progress ring as Dashboard, driven by real progress */}
                  <div className="relative hidden h-32 w-32 flex-shrink-0 sm:block">
                    <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
                      <circle cx="60" cy="60" r={radius} fill="none" stroke="#FEE4EB" strokeWidth="9" />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke="#F33B7D"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-4 overflow-hidden rounded-full bg-white">
                      <img
                        src={babyImg}
                        alt=""
                        className="h-full w-full object-cover object-left"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mother's Body Changes */}
              <div className="rounded-2xl bg-[#FEF4F4] p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="mb-2 font-display text-sm font-semibold text-[#0D0D0D]">
                      Mother's Body Changes
                    </h2>
                    <p className="text-sm leading-relaxed text-[#3D3939]">
                      {weekInfo?.motherChanges}
                    </p>
                  </div>
                  <div className="hidden h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl sm:block">
                    <img
                      src={motherImg}
                      alt=""
                      className="h-full w-full scale-110 object-cover"
                      style={{ objectPosition: "50% 15%" }}
                    />
                  </div>
                </div>
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