import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarClock,
  CalendarX2,
  ChevronRight,
  ClipboardList,
  Users,
  User,
} from "lucide-react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { useAuth } from "../../context/AuthContext";
import { getDoctorDashboard } from "../../services/doctorPortal.service";
import { getNotifications } from "../../services/notification.service";

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
      <p className="text-xs text-[#A8849A]">{label}</p>
      <p className="mt-2 font-display text-xl font-semibold text-[#3D2A33]">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-[#C9A8B8]">{hint}</p>}
    </div>
  );
}

function formatNotificationTime(value) {
  if (!value) return "";
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      const [dashboard, notificationResponse] = await Promise.all([
        getDoctorDashboard(),
        getNotifications({ limit: 6 }),
      ]);

      setData(dashboard);
      const list = Array.isArray(notificationResponse)
        ? notificationResponse
        : notificationResponse?.data || [];
      setNotifications(Array.isArray(list) ? list : []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { icon: ClipboardList, label: "View Requests", sub: "Review new requests", path: "/doctor/consultation-requests" },
    { icon: Users, label: "Active Patients", sub: "Continue conversations", path: "/doctor/active-patients" },
    { icon: CalendarClock, label: "Schedule", sub: "Manage availability", path: "/doctor/schedule" },
    { icon: User, label: "Profile", sub: "View your profile", path: "/doctor/profile" },
  ];

  if (loading) {
    return (
      <DoctorLayout title={`Welcome, ${user?.fullName || ""}`} subtitle="Here's what's happening today." showSearch>
        <div className="flex items-center justify-center py-12 text-sm text-[#A8849A]">Loading your dashboard...</div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout title={`Welcome, ${user?.fullName || ""}`} subtitle="Here's what's happening today." showSearch>
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">{error}</div>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pending Requests" value={data?.pendingRequests ?? 0} hint={data?.pendingRequests ? `${data.pendingRequests} awaiting review` : "No pending requests"} />
        <StatCard label="Active Consultations" value={data?.activePatients ?? 0} hint={data?.activePatients ? `${data.activePatients} ongoing` : "No active consultations"} />
        <StatCard label="Closed Consultations" value={data?.closedConsultations ?? 0} />
        <Link to="/doctor/messages" className="block">
          <StatCard label="Unread Messages" value={data?.unreadMessages ?? 0} hint={data?.unreadMessages ? "Open messages" : "No unread messages"} />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[#3D2A33]">
                Weekly Schedule
              </h2>
              <p className="text-xs text-[#A8849A]">
                Your availability for the week
              </p>
            </div>

            <Link
              to="/doctor/schedule"
              className="text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b]"
            >
              Manage
            </Link>
          </div>

          {Array.isArray(data?.schedule) && data.schedule.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {data.schedule.map((day) => {
                const hasSchedule =
                  day.enabled &&
                  Array.isArray(day.slots) &&
                  day.slots.length > 0;

                return (
                  <div
                    key={day.day}
                    className={`flex flex-col rounded-2xl p-3 ring-1 transition ${
                      hasSchedule
                        ? "bg-gradient-to-br from-[#FEE4EB] to-[#FCE4EB] ring-[#F8C9DA]"
                        : "bg-[#FDF6F8] ring-[#F5E4EC]"
                    }`}
                  >
                    {/* Day name */}
                    <div className="mb-2 flex items-center justify-between">
                      <p
                        className={`text-xs font-bold uppercase tracking-wide ${
                          hasSchedule ? "text-[#F33B7D]" : "text-[#C9A8B8]"
                        }`}
                      >
                        {day.name.slice(0, 3)}
                      </p>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          hasSchedule ? "bg-[#F33B7D]" : "bg-[#E8D5DD]"
                        }`}
                      />
                    </div>

                    {/* Slots */}
                    {hasSchedule ? (
                      <div className="flex flex-1 flex-col gap-1.5">
                        {day.slots.map((slot, index) => (
                          <span
                            key={`${day.day}-${index}`}
                            className="rounded-lg bg-white/80 px-2 py-1 text-[10px] font-semibold text-[#F33B7D] shadow-sm"
                          >
                            {slot.start} – {slot.end}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-auto text-[10px] font-medium text-[#C9A8B8]">
                        Not available
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEE4EB]">
                <CalendarX2 className="h-6 w-6 text-[#F33B7D]" />
              </span>

              <p className="mt-3 text-sm font-medium text-[#3D2A33]">
                No weekly schedule set
              </p>

              <p className="mt-1 text-xs text-[#A8849A]">
                Set your availability to let patients know when you are available.
              </p>

              <Link
                to="/doctor/schedule"
                className="mt-3 text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b]"
              >
                Set Schedule
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[#3D2A33]">Notifications</h2>
              <p className="text-xs text-[#A8849A]">Recent updates for your practice</p>
            </div>
            <Link to="/doctor/notifications" className="inline-flex items-center gap-1 text-xs font-semibold text-[#F33B7D]">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-7 w-7 text-[#D8D3D5]" />
              <p className="mt-2 text-sm font-medium text-[#3D2A33]">No notifications yet</p>
              <p className="mt-1 text-xs text-[#A8849A]">New consultation and message updates will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 4).map((notification) => (
                <Link
                  key={notification._id}
                  to={notification.link || "/doctor/notifications"}
                  className={`flex gap-3 rounded-xl p-3 transition hover:bg-[#FEF4F4] ${notification.read ? "bg-white" : "bg-[#FEF4F4]"}`}
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FCE4EB]">
                    <Bell className="h-4 w-4 text-[#F33B7D]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-[#3D2A33]">{notification.title}</span>
                      {!notification.read && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F33B7D]" />}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-[#8F8C8C]">{notification.message}</span>
                    <span className="mt-1 block text-[10px] text-[#B8B4B4]">{formatNotificationTime(notification.createdAt)}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
        <div className="mb-5">
          <h2 className="font-display text-lg font-semibold text-[#3D2A33]">Quick Actions</h2>
          <p className="text-sm text-[#A8849A]">Manage your practice with one tap</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.path} className="group relative overflow-hidden rounded-2xl bg-[#FEE4EB] p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex flex-col items-start gap-2.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEE4EB] shadow-sm group-hover:bg-[#F33B7D]">
                  <action.icon className="h-6 w-6 text-[#F33B7D] group-hover:text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3D2A33] group-hover:text-[#F33B7D]">{action.label}</p>
                  <p className="text-xs text-[#A8849A]">{action.sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}