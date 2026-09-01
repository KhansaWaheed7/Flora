import AdminLayout from "../../layouts/AdminLayout";
import { BarChart3 } from "lucide-react";

export default function Consultations() {
  return (
    <AdminLayout title="Consultations Analytics" subtitle="View consultation statistics and trends">
      <div className="rounded-2xl bg-white p-12 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-[#FEE4EB] flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-[#F33B7D]" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-[#0D0D0D] mb-2">Consultations Analytics Coming Soon</h2>
        <p className="text-sm text-[#8F8C8C] max-w-md mx-auto">
          Backend endpoints for consultations analytics are not implemented yet. This feature will display consultation statistics, trends, and performance metrics.
        </p>
        <p className="text-xs text-[#B8AEB2] mt-4">
          Status: Pending backend development
        </p>
      </div>
    </AdminLayout>
  );
}
