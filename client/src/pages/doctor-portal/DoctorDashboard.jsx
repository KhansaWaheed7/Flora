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
  Activity,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { useAuth } from "../../context/AuthContext";
import { getDoctorDashboard } from "../../services/doctorPortal.service";
import { getNotifications } from "../../services/notification.service";

function StatCard({ label, value, hint, icon: Icon, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-[#F5E4EC] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(243,59,125,0.35)]">
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#FEE4EB] to-transparent opacity-80 transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#A8849A]">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-[#3D2A33]">
            {value}
          </p>
          {hint && (
            <p className="mt-1 truncate text-xs text-[#C9A8B8]">{hint}</p>
          )}
        </div>
        {Icon && (
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEE4EB] to-[#FCE4EB] ring-1 ring-[#F8C9DA] transition-colors duration-300 group-hover:from-[#F33B7D] group-hover:to-[#F33B7D]">
            <Icon
              className="h-4 w-4 text-[#F33B7D] transition-colors duration-300 group-hover:text-white"
              strokeWidth={1.75}
            />
          </span>
        )}
      </div>
      {accent && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#F33B7D] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
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

function getNotificationLink(notification) {
  if (!notification) return null;

  const type = String(notification.type || "").toLowerCase();
  const title = String(notification.title || "").toLowerCase();
  const message = String(notification.message || "").toLowerCase();

  // =========================
  // CHAT / MESSAGE
  // =========================
  const isChatNotification =
    type.includes("message") ||
    type.includes("chat") ||
    type.includes("consultation_message") ||
    title.includes("message") ||
    title.includes("chat") ||
    message.includes("message");

  if (isChatNotification) {
    const chatId =
      notification.metadata?.chatId ||
      notification.metadata?.consultationId ||
      notification.consultationId ||
      notification.consultation?._id ||
      notification.chatId ||
      notification.conversationId ||
      notification.data?.chatId ||
      notification.data?.consultationId ||
      notification.data?.conversationId;

    if (chatId) {
      return `/doctor/messages/${chatId}`;
    }
  }

  // =========================
  // CLOSED CONSULTATION
  // =========================
  const isClosedConsultation =
    type.includes("consultation_closed") ||
    type.includes("closed_consultation") ||
    title.includes("consultation closed") ||
    title.includes("consultation has been closed") ||
    message.includes("consultation closed") ||
    message.includes("consultation has been closed");

  if (isClosedConsultation) {
    return "/doctor/closed-consultations";
  }

  // =========================
  // OTHER NOTIFICATIONS
  // =========================
  if (notification.link) {
    return notification.link;
  }

  return null;
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
        title={`Welcome, ${user?.fullName || ""}`}
        subtitle="Here's what's happening today."
        showSearch
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-gradient-to-br from-[#FEE4EB] to-[#FDF6F8] ring-1 ring-[#F5E4EC]"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="h-40 animate-pulse rounded-2xl bg-gradient-to-br from-[#FEE4EB] to-[#FDF6F8] ring-1 ring-[#F5E4EC]" />
            <div className="h-40 animate-pulse rounded-2xl bg-gradient-to-br from-[#FEE4EB] to-[#FDF6F8] ring-1 ring-[#F5E4EC]" />
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout
      title={`Welcome, ${user?.fullName || ""}`}
      subtitle="Here's what's happening today."
      showSearch
    >
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {/* ── Stat cards ───────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pending Requests"
          value={data?.pendingRequests ?? 0}
          hint={
            data?.pendingRequests
              ? `${data.pendingRequests} awaiting review`
              : "No pending requests"
          }
          icon={ClipboardList}
          accent
        />
        <StatCard
          label="Active Consultations"
          value={data?.activePatients ?? 0}
          hint={
            data?.activePatients
              ? `${data.activePatients} ongoing`
              : "No active consultations"
          }
          icon={Activity}
          accent
        />
        <StatCard
          label="Closed Consultations"
          value={data?.closedConsultations ?? 0}
          icon={CheckCircle2}
          accent
        />
        <Link to="/doctor/messages" className="block">
          <StatCard
            label="Unread Messages"
            value={data?.unreadMessages ?? 0}
            hint={
              data?.unreadMessages ? "Open messages" : "No unread messages"
            }
            icon={MessageSquare}
            accent
          />
        </Link>
      </div>

      {/* ── Schedule + Notifications ─────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2 xl:items-stretch">
        {/* Weekly Schedule — compact */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-[#FEE4EB] to-transparent opacity-60" />

          <div className="relative mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-semibold text-[#3D2A33]">
                Weekly Schedule
              </h2>
              <p className="text-[11px] text-[#A8849A]">
                Your availability
              </p>
            </div>

            <Link
              to="/doctor/schedule"
              className="text-[11px] font-semibold text-[#F33B7D] transition-colors hover:text-[#d92b6b]"
            >
              Manage
            </Link>
          </div>

          {Array.isArray(data?.schedule) && data.schedule.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-4">
              {data.schedule.map((day) => {
                const hasSchedule =
                  day.enabled &&
                  Array.isArray(day.slots) &&
                  day.slots.length > 0;

                return (
                  <div
                    key={day.day}
                    className={`group/day flex flex-col rounded-xl p-2 ring-1 transition-all duration-300 hover:-translate-y-0.5 ${
                      hasSchedule
                        ? "bg-gradient-to-br from-[#FEE4EB] to-[#FCE4EB] ring-[#F8C9DA] hover:shadow-[0_8px_20px_-8px_rgba(243,59,125,0.4)]"
                        : "bg-[#FDF6F8] ring-[#F5E4EC]"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <p
                        className={`text-[10px] font-bold uppercase tracking-wide ${
                          hasSchedule ? "text-[#F33B7D]" : "text-[#C9A8B8]"
                        }`}
                      >
                        {day.name.slice(0, 3)}
                      </p>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          hasSchedule
                            ? "animate-pulse bg-[#F33B7D]"
                            : "bg-[#E8D5DD]"
                        }`}
                      />
                    </div>

                    {hasSchedule ? (
                      <div className="flex flex-1 flex-col gap-1">
                        {day.slots.slice(0, 2).map((slot, index) => (
                          <span
                            key={`${day.day}-${index}`}
                            className="rounded-md bg-white/80 px-1.5 py-0.5 text-[9px] font-semibold text-[#F33B7D] shadow-sm backdrop-blur-sm transition-colors group-hover/day:bg-white"
                          >
                            {slot.start}–{slot.end}
                          </span>
                        ))}
                        {day.slots.length > 2 && (
                          <span className="text-[9px] font-semibold text-[#F33B7D]/70">
                            +{day.slots.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="mt-auto text-[9px] font-medium text-[#C9A8B8]">
                        Off
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative flex flex-1 flex-col items-center justify-center py-4 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEE4EB] to-[#FCE4EB] ring-1 ring-[#F8C9DA]">
                <CalendarX2 className="h-5 w-5 text-[#F33B7D]" strokeWidth={1.75} />
              </span>

              <p className="mt-2 text-xs font-medium text-[#3D2A33]">
                No weekly schedule set
              </p>

              <Link
                to="/doctor/schedule"
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F33B7D] to-[#d92b6b] px-3 py-1 text-[11px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(243,59,125,0.5)] transition-transform hover:scale-[1.03]"
              >
                Set Schedule
              </Link>
            </div>
          )}
        </div>

        {/* Notifications — matches user dashboard styling */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0_8px_24px_-6px_rgba(243,59,125,0.10),0_2px_6px_rgba(0,0,0,0.04)] ring-1 ring-[#F5E4EC]">
          <div className="relative mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-semibold text-[#3D2A33]">
                Latest Notifications
              </h2>
              <p className="text-[11px] text-[#A8849A]">
                Recent updates
              </p>
            </div>
            <Link
              to="/doctor/notifications"
              className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#F33B7D] transition-colors hover:text-[#d92b6b]"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {notifications.length === 0 ? (
            <div className="relative flex flex-1 flex-col items-center justify-center py-4 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FDF6F8] to-[#FEE4EB] ring-1 ring-[#F5E4EC]">
                <Bell className="h-5 w-5 text-[#D8D3D5]" strokeWidth={1.75} />
              </span>
              <p className="mt-2 text-xs font-medium text-[#3D2A33]">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="relative divide-y divide-[#F5E4EC]">
              {notifications.slice(0, 3).map((notification) => {
                const isUnread = !notification.read;
                const link =
                  getNotificationLink(notification) || "/doctor/notifications";

                return (
                  <Link
                    key={notification._id}
                    to={link}
                    className="group relative flex items-center gap-3 px-2 py-3 -mx-2 first:pt-0 last:pb-0 rounded-xl transition-all duration-200 hover:bg-[#FEF4F4] hover:shadow-[0_2px_8px_rgba(243,59,125,0.06)]"
                  >
                    {/* Pink accent bar for unread */}
                    {isUnread && (
                      <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#F33B7D] shadow-[0_0_8px_rgba(243,59,125,0.5)]" />
                    )}

                    {/* Icon */}
                    <span
                      className={`ml-2 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 transition-transform duration-200 group-hover:scale-105 ${
                        isUnread
                          ? "bg-[#F33B7D] text-white ring-[#F33B7D]"
                          : "bg-[#FEE4EB] text-[#F33B7D] ring-[#F5E4EC]"
                      }`}
                    >
                      <Bell className="h-4 w-4" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm ${
                          isUnread
                            ? "font-bold text-[#3D2A33]"
                            : "font-semibold text-[#3D2A33]"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p
                        className={`truncate text-xs ${
                          isUnread ? "text-[#A8849A]" : "text-[#C9A8B8]"
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <span className="flex-shrink-0 text-[10px] font-medium text-[#C9A8B8]">
                      {formatNotificationTime(notification.createdAt)}
                    </span>

                    {/* Pulsing unread dot */}
                    {isUnread && (
                      <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F33B7D] opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#F33B7D] shadow-[0_0_0_3px_rgba(243,59,125,0.18)]" />
                      </span>
                    )}

                    <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-[#E8D5DD] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#F33B7D]" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Actions ────────────────────────── */}
      <div className="relative mt-6 overflow-hidden rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#FEE4EB] to-transparent opacity-50" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-tl from-[#FEE4EB] to-transparent opacity-50" />

        <div className="relative mb-5">
          <h2 className="font-display text-lg font-semibold text-[#3D2A33]">
            Quick Actions
          </h2>
          <p className="text-sm text-[#A8849A]">
            Manage your practice with one tap
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEE4EB] to-[#FCE4EB] p-4 ring-1 ring-[#F8C9DA] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-10px_rgba(243,59,125,0.5)]"
            >
              <span className="pointer-events-none absolute -inset-x-10 -top-10 h-20 rotate-12 bg-white/40 blur-2xl transition-transform duration-500 group-hover:translate-y-20" />

              <div className="relative flex flex-col items-start gap-2.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 shadow-sm ring-1 ring-[#F8C9DA] transition-all duration-300 group-hover:bg-[#F33B7D] group-hover:ring-[#F33B7D]">
                  <action.icon
                    className="h-6 w-6 text-[#F33B7D] transition-colors duration-300 group-hover:text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3D2A33] transition-colors duration-300 group-hover:text-[#F33B7D]">
                    {action.label}
                  </p>
                  <p className="text-xs text-[#A8849A]">{action.sub}</p>
                </div>
              </div>

              <ChevronRight className="absolute right-3 top-3 h-4 w-4 text-[#F33B7D] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}