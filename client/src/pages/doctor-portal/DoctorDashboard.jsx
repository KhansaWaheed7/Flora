import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import { useAuth } from "../../context/AuthContext";
import { getDoctorDashboard } from "../../services/doctorPortal.service";
import {
  ClipboardList,
  Users,
  CalendarClock,
  User,
  CalendarX2,
  ChevronRight,
} from "lucide-react";

// Pink-toned neutral palette (matching the user dashboard)
//   primaryText  : #3D2A33
//   secondaryText: #A8849A
//   tertiaryText : #C9A8B8
//   divider      : #F5E4EC
//   softFill     : #FDF2F7

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(243,59,125,0.12)]">
      <p className="text-xs text-[#A8849A]">{label}</p>
      <p className="mt-2 font-display text-xl font-semibold text-[#3D2A33]">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-[#C9A8B8]">{hint}</p>}
    </div>
  );
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await getDoctorDashboard();
        setData(res);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const quickActions = [
    {
      icon: ClipboardList,
      label: "View Requests",
      sub: "Review new requests",
      path: "/doctor/consultation-requests",
    },
    {
      icon: Users,
      label: "Active Patients",
      sub: "Continue conversations",
      path: "/doctor/active-patients",
    },
    {
      icon: CalendarClock,
      label: "Schedule",
      sub: "Manage availability",
      path: "/doctor/schedule",
    },
    {
      icon: User,
      label: "Profile",
      sub: "View your profile",
      path: "/doctor/profile",
    },
  ];

  if (loading) {
    return (
      <DoctorLayout
        title={`Welcome , ${user?.fullName || ""} `}
        subtitle="Here's what's happening today."
        showSearch
      >
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-[#A8849A]">Loading your dashboard...</p>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout
      title={`Welcome , ${user?.fullName || ""} `}
      subtitle="Here's what's happening today."
      showSearch
    >
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pending Requests"
          value={data?.pendingRequests ?? 0}
          hint={
            data?.pendingRequests
              ? `${data.pendingRequests} awaiting review`
              : undefined
          }
        />
        <StatCard
          label="Active Consultations"
          value={data?.activePatients ?? 0}
          hint={data?.activePatients ? `${data.activePatients} ongoing` : undefined}
        />
        <StatCard
          label="Closed Consultations"
          value={data?.closedConsultations ?? 0}
        />
        <Link to="/doctor/messages" className="block">
          <StatCard
            label="Unread Messages"
            value={data?.unreadMessages ?? 0}
            hint={
              data?.unreadMessages
                ? `${data.unreadMessages} unread message${
                    data.unreadMessages > 1 ? "s" : ""
                  }`
                : "No unread messages"
            }
          />
        </Link>
      </div>

      {/* Today's Schedule - full width */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-[#3D2A33]">
              Today's Schedule
            </h2>
            <p className="text-xs text-[#A8849A]">
              Your availability for today
            </p>
          </div>
          <Link
            to="/doctor/schedule"
            className="text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b] transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEE4EB]">
            <CalendarX2 className="h-7 w-7 text-[#F33B7D]" />
          </span>
          <p className="text-sm font-medium text-[#3D2A33]">
            No availability set yet
          </p>
          <p className="text-xs text-[#A8849A]">
            Set your weekly schedule to start receiving consultation requests.
          </p>
          <Link
            to="/doctor/schedule"
            className="mt-1 rounded-full bg-[#F33B7D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#d92b6b] transition-colors"
          >
            Set Your Weekly Schedule
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
        <div className="mb-5">
          <h2 className="font-display text-lg font-semibold text-[#3D2A33]">
            Quick Actions
          </h2>
          <p className="text-sm text-[#A8849A]">
            Manage your practice with one tap
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="group relative overflow-hidden rounded-2xl bg-[#FEE4EB] p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="relative flex flex-col items-start gap-2.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEE4EB] shadow-sm transition-all duration-300 group-hover:bg-[#F33B7D]">
                  <action.icon
                    className="h-6 w-6 text-[#F33B7D] transition-all duration-300 group-hover:text-white"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="w-full">
                  <p className="text-sm font-semibold text-[#3D2A33] group-hover:text-[#F33B7D] transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-[#A8849A]">{action.sub}</p>
                </div>

                <div className="absolute right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <ChevronRight className="h-4 w-4 text-[#F33B7D]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}