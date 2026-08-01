import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import PageLayout from "../../layouts/PageLayout";
import {
  getCycles,
  getPrediction,
  symptomEnumToLabel,
} from "../../services/cycle.service";

export default function CycleStatistics() {
  const [cycles, setCycles] = useState([]);
  const [regularity, setRegularity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCycles();
        const list = res.data || res.cycles || res;
        setCycles(Array.isArray(list) ? list : []);
      } catch (err) {
        setError("Could not load cycle statistics.");
      } finally {
        setLoading(false);
      }
      // Regularity comes from the prediction endpoint's health.status —
      // fetch it separately since it needs at least one cycle and can 404 alone.
      try {
        const predRes = await getPrediction();
        const prediction = predRes.data || predRes;
        setRegularity(prediction?.health?.status || null);
      } catch (err) {
        setRegularity(null);
      }
    };
    load();
  }, []);

  const { stats, cycleLengthData, periodLengthData, commonSymptoms } =
    useMemo(() => {
      if (cycles.length === 0) {
        return {
          stats: [
            { label: "Total Cycles", value: "0" },
            { label: "Average Cycle Length", value: "-" },
            { label: "Average Period Length", value: "-" },
            { label: "Regularity", value: "-" },
          ],
          cycleLengthData: [],
          periodLengthData: [],
          commonSymptoms: [],
        };
      }

      const regularityColor =
        regularity === "Irregular"
          ? "#D97706"
          : regularity === "Regular"
          ? "#22C55E"
          : "#0D0D0D";

      const sorted = [...cycles].sort(
        (a, b) => new Date(a.periodStart) - new Date(b.periodStart)
      );

      const avgCycle =
        sorted.reduce((sum, c) => sum + (c.cycleLength || 0), 0) /
        sorted.length;
      const avgPeriod =
        sorted.reduce((sum, c) => sum + (c.periodLength || 0), 0) /
        sorted.length;

      const cycleLengthData = sorted.map((c) => ({
        month: new Date(c.periodStart).toLocaleDateString("en-US", {
          month: "short",
        }),
        length: c.cycleLength || 0,
      }));

      const periodLengthData = sorted.map((c) => ({
        month: new Date(c.periodStart).toLocaleDateString("en-US", {
          month: "short",
        }),
        length: c.periodLength || 0,
      }));

      const symptomCounts = {};
      sorted.forEach((c) => {
        (c.symptoms || []).forEach((s) => {
          if (s === "none") return;
          symptomCounts[s] = (symptomCounts[s] || 0) + 1;
        });
      });
      const commonSymptoms = Object.entries(symptomCounts)
        .map(([enumVal, count]) => ({
          label: symptomEnumToLabel[enumVal] || enumVal,
          pct: Math.round((count / sorted.length) * 100),
        }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 4);

      return {
        stats: [
          { label: "Total Cycles", value: String(sorted.length) },
          {
            label: "Average Cycle Length",
            value: `${Math.round(avgCycle)} Days`,
          },
          {
            label: "Average Period Length",
            value: `${Math.round(avgPeriod)} Days`,
          },
          {
            label: "Regularity",
            value: regularity || "-",
            color: regularityColor,
          },
        ],
        cycleLengthData,
        periodLengthData,
        commonSymptoms,
      };
    }, [cycles, regularity]);

  return (
    <PageLayout
      title="Cycle Statistics"
      subtitle="Overview of your cycle trends."
      backTo="/cycle-tracker"
    >
      <div className="mx-auto max-w-4xl space-y-4">
        {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stat boxes */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
                >
                  <p className="text-xs text-[#8F8C8C]">{label}</p>
                  <p
                    className="mt-1 font-display text-xl font-semibold"
                    style={{ color: color || "#0D0D0D" }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {cycles.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                Log a few cycles to see your trends here.
              </div>
            ) : (
              <>
                {/* Cycle Length chart */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                  <h2 className="mb-3 font-display text-sm font-semibold text-[#0D0D0D]">
                    Cycle Length (Days)
                  </h2>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cycleLengthData}>
                        <CartesianGrid vertical={false} stroke="#F5EAEF" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#8F8C8C" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#8F8C8C" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Bar
                          dataKey="length"
                          fill="#F33B7D"
                          radius={[4, 4, 0, 0]}
                          barSize={22}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {/* Period Length chart */}
                  <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                    <h2 className="mb-3 font-display text-sm font-semibold text-[#0D0D0D]">
                      Period Length (Days)
                    </h2>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={periodLengthData}>
                          <CartesianGrid vertical={false} stroke="#F5EAEF" />
                          <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: "#8F8C8C" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 11, fill: "#8F8C8C" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="length"
                            stroke="#F33B7D"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Most Common Symptoms */}
                  <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                    <h2 className="mb-3 font-display text-sm font-semibold text-[#0D0D0D]">
                      Most Common Symptoms
                    </h2>
                    {commonSymptoms.length === 0 ? (
                      <p className="text-sm text-[#8F8C8C]">
                        No symptoms logged yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {commonSymptoms.map(({ label, pct }) => (
                          <div key={label}>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-[#3D3939]">{label}</span>
                              <span className="font-semibold text-[#0D0D0D]">
                                {pct}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F5EAEF]">
                              <div
                                className="h-full rounded-full bg-[#F33B7D]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
