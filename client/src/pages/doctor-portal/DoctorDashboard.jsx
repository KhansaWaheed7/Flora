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
  MessageSquarePlus,
  MessageCircle,
  CheckCircle2,
  FileUp,
  CalendarX2,
} from "lucide-react";

const ACTIVITY_ICON = {
  new_request: MessageSquarePlus,
  new_message: MessageCircle,
  closed: CheckCircle2,
  report_uploaded: FileUp,
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-medium text-[#8F8C8C]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#0D0D0D]">{value}</p>
      {hint && <p className="mt-1 text-[11px] font-medium text-[#F33B7D]">{hint}</p>}
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
    { icon: ClipboardList, label: "View Requests", sub: "Review new requests", path: "/doctor/consultation-requests" },
    { icon: Users, label: "Active Patients", sub: "Continue conversations", path: "/doctor/active-patients" },
    { icon: CalendarClock, label: "Schedule", sub: "Manage availability", path: "/doctor/schedule" },
    { icon: User, label: "Profile", sub: "View your profile", path: "/doctor/profile" },
  ];

  return (
    <DoctorLayout
      title={`Welcome , Dr. ${user?.fullName || ""} `}
      subtitle="Here's what's happening today."
      showSearch
    >
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-sm text-[#8F8C8C]">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Pending Requests"
              value={data?.pendingRequests ?? 0}
              hint={data?.pendingRequests ? `${data.pendingRequests} awaiting review` : undefined}
            />
            <StatCard
              label="Active Consultations"
              value={data?.activePatients ?? 0}
              hint={data?.activePatients ? `${data.activePatients} ongoing` : undefined}
            />
            <StatCard label="Closed Consultations" value={data?.closedConsultations ?? 0} />
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

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Today's Schedule */}
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#0D0D0D]">Today's Schedule</h2>
                <Link to="/doctor/schedule" className="text-xs font-medium text-[#F33B7D] hover:underline">
                  View all
                </Link>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <CalendarX2 className="h-8 w-8 text-[#D8D2D2]" />
                <p className="text-sm text-[#8F8C8C]">No availability set yet</p>
                <Link
                  to="/doctor/schedule"
                  className="text-xs font-semibold text-[#F33B7D] hover:underline"
                >
                  Set your weekly schedule
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <h2 className="mb-3 text-sm font-semibold text-[#0D0D0D]">Recent Activity</h2>

              {!data?.recentActivity?.length ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-[#8F8C8C]">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.recentActivity.map((item, idx) => {
                    const Icon = ACTIVITY_ICON[item.type] || MessageCircle;
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB]">
                          <Icon className="h-4 w-4 text-[#F33B7D]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#3D3939]">{item.text}</p>
                          <p className="text-[11px] text-[#B8B4B4]">{timeAgo(item.at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-5 rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-4 text-sm font-semibold text-[#0D0D0D]">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[#F0DCE4] p-4 text-center transition-colors hover:bg-[#FEF4F4]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEE4EB]">
                    <action.icon className="h-5 w-5 text-[#F33B7D]" />
                  </div>
                  <p className="text-xs font-semibold text-[#0D0D0D]">{action.label}</p>
                  <p className="text-[10px] text-[#8F8C8C]">{action.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </DoctorLayout>
  );
}
