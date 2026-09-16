import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getDashboardStats,
  getPendingDoctors,
} from "../../services/admin.service";
import { Users, Stethoscope, UserCheck, ShieldAlert } from "lucide-react";

const statCards = [
  {
    key: "totalPatients",
    label: "Total Users",
    icon: Users,
    color: "#F33B7D",
    path: "/admin/users",
  },
  {
    key: "totalDoctors",
    label: "Total Doctors",
    icon: Stethoscope,
    color: "#A855F7",
    path: "/admin/doctors",
  },
  {
    key: "pendingDoctors",
    label: "Pending Approvals",
    icon: UserCheck,
    color: "#F59E0B",
    path: "/admin/doctor-approval",
  },
  {
    key: "suspendedAccounts",
    label: "Suspended Accounts",
    icon: ShieldAlert,
    color: "#EF4444",
    path: "/admin/users?status=suspended",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDoctors, setPendingDoctors] = useState([]);
const [pendingDoctorsLoading, setPendingDoctorsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setPendingDoctorsLoading(true);

      const [statsRes, pendingDoctorsRes] = await Promise.all([
        getDashboardStats(),
        getPendingDoctors(),
      ]);

      // Dashboard stats
      setStats(statsRes.data);

      // Actual pending doctor applications
      setPendingDoctors(pendingDoctorsRes.data?.doctors || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
      setPendingDoctorsLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  const handleCardClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleKeyDown = (e, path) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(path);
    }
  };

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Welcome back, Admin!">
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {/* Stat cards - clickable with navigation */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color, path }) => (
          <div
            key={key}
            onClick={() => handleCardClick(path)}
            onKeyDown={(e) => handleKeyDown(e, path)}
            className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center justify-between">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}1A`, color }}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-[#0D0D0D]">
              {loading ? "—" : stats?.[key] ?? 0}
            </p>
            <p className="text-sm text-[#8F8C8C]">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick links to the real screens */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-[#0D0D0D]">
        Review Doctor Applications
      </p>

      <p className="mt-1 text-xs text-[#8F8C8C]">
        {pendingDoctorsLoading
          ? "Loading..."
          : `${pendingDoctors.length} pending approval`}
      </p>
    </div>

    <Link
      to="/admin/doctor-approval"
      className="text-xs font-semibold text-[#F33B7D] hover:underline"
    >
      View All
    </Link>
  </div>

  <div className="mt-4">
    {pendingDoctorsLoading ? (
      <p className="text-xs text-[#8F8C8C]">
        Loading applications...
      </p>
    ) : pendingDoctors.length === 0 ? (
      <div className="rounded-xl bg-[#FEF4F4] px-4 py-3">
        <p className="text-xs text-[#8F8C8C]">
          No pending doctor applications.
        </p>
      </div>
    ) : (
      <div className="space-y-3">
        {pendingDoctors.slice(0, 3).map((doctor) => (
          <Link
            key={doctor._id}
            to={`/admin/doctor-details/${doctor._id}`}
            className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-[#FEF4F4] transition-colors"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-sm font-bold text-white">
              {doctor.fullName?.charAt(0)?.toUpperCase() || "D"}
            </div>

            {/* Doctor information */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0D0D0D]">
                {doctor.fullName || "Unknown Doctor"}
              </p>

              <p className="truncate text-xs text-[#8F8C8C]">
                {doctor.specialization || "Specialization not specified"}
              </p>

              {doctor.hospital && (
                <p className="truncate text-xs text-[#A5A2A2]">
                  {doctor.hospital}
                </p>
              )}
            </div>

            {/* Applied date */}
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-[#A5A2A2]">
                Applied
              </p>

              <p className="text-[11px] font-medium text-[#6B6B6B]">
                {doctor.createdAt
                  ? new Date(doctor.createdAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </Link>
        ))}

        {pendingDoctors.length > 3 && (
          <Link
            to="/admin/doctor-approval"
            className="block pt-2 text-center text-xs font-semibold text-[#F33B7D] hover:underline"
          >
            +{pendingDoctors.length - 3} more applications
          </Link>
        )}
      </div>
    )}
  </div>
</div>

        <Link
          to="/admin/users"
          className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:-translate-y-0.5 transition-transform"
        >
          <p className="text-sm font-semibold text-[#0D0D0D]">
            Manage Users
          </p>
          <p className="mt-1 text-xs text-[#8F8C8C]">
            View, search and suspend patient accounts
          </p>
        </Link>
      </div>

      {/* Placeholder for widgets with no backend data yet */}
      <div className="mt-6 rounded-2xl border border-dashed border-[#F0DCE4] bg-white/60 p-6 text-center">
        <p className="text-sm font-semibold text-[#3D3939]">
          Users growth chart, consultations overview, recent activity and
          system overview
        </p>
        <p className="mt-1 text-xs text-[#8F8C8C]">
          These widgets from the Figma design need dedicated backend
          endpoints (analytics + activity log) before they can show real
          data.
        </p>
      </div>
    </AdminLayout>
  );
}