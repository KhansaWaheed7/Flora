import { Link } from "react-router-dom";
import { CalendarHeart } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";

export default function NoCycleData() {
  return (
    <PageLayout
      title="Cycle Tracker Dashboard"
      subtitle="Track your cycle, understand your body."
    >
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FEE4EB]">
          <CalendarHeart className="h-9 w-9 text-[#F33B7D]" />
        </div>
        <h2 className="mt-5 font-display text-xl font-semibold text-[#0D0D0D]">
          No Cycle Data Yet
        </h2>
        <p className="mt-2 max-w-sm text-sm text-[#8F8C8C]">
          Start tracking your menstrual cycle to receive predictions,
          fertility insights and personalized health tips.
        </p>
        <Link
          to="/cycle-tracker/log"
          className="mt-6 rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5"
        >
          Log Your First Period
        </Link>
      </div>
    </PageLayout>
  );
}
