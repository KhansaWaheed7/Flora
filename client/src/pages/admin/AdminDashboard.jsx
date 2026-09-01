import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { getDashboardStats } from "../../services/admin.service";
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getDashboardStats();
        // ApiResponse shape: { statusCode, message, data }
        setStats(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load dashboard stats."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
        <Link
          to="/admin/doctor-approval"
          className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:-translate-y-0.5 transition-transform"
        >
          <p className="text-sm font-semibold text-[#0D0D0D]">
            Review Doctor Applications
          </p>
          <p className="mt-1 text-xs text-[#8F8C8C]">
            {loading
              ? "Loading..."
              : `${stats?.pendingDoctors ?? 0} pending approval`}
          </p>
        </Link>

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
          data — flagging so we don't fake it.
        </p>
      </div>
    </AdminLayout>
  );
}