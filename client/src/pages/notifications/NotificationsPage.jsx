import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, Calendar, HeartPulse, Baby, ShieldCheck, FileText,
  MessageCircle, Stethoscope, User, CheckCheck, ChevronRight, RefreshCw,
} from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notification.service";

const iconMap = {
  cycle: Calendar,
  pregnancy: Baby,
  pcos: ShieldCheck,
  medical_report: FileText,
  consultation: Stethoscope,
  message: MessageCircle,
  gynae: HeartPulse,
  profile: User,
  system: Bell,
};

const filters = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
];

function formatTime(date) {
  if (!date) return "";
  const value = new Date(date);
  const diff = Date.now() - value.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return value.toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function NotificationCard({ notification, onRead }) {
  const Icon = iconMap[notification.type] || Bell;
  const isUnread = !notification.read;
  const isHigh = notification.priority === "high";

  const content = (
    <div
      onClick={() => isUnread && onRead(notification._id)}
      className={`group relative flex cursor-pointer gap-4 overflow-hidden rounded-2xl bg-white p-4 ring-1 transition-all duration-300 hover:-translate-y-0.5 ${
        isUnread
          ? "ring-[#F8C9DA] hover:ring-[#F33B7D]/40"
          : "ring-[#F5E4EC] hover:ring-[#F8C9DA]"
      }`}
    >
      <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#FEE4EB] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {isUnread && (
        <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#F33B7D] to-[#d92b6b]" />
      )}

      <span
        className={`relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-300 ${
          isUnread
            ? "bg-gradient-to-br from-[#FEE4EB] to-[#FCE4EB] ring-[#F8C9DA] group-hover:from-[#F33B7D] group-hover:to-[#F33B7D] group-hover:ring-[#F33B7D]"
            : "bg-gradient-to-br from-[#FDF6F8] to-[#FEE4EB] ring-[#F5E4EC] group-hover:from-[#FEE4EB] group-hover:to-[#FCE4EB] group-hover:ring-[#F8C9DA]"
        }`}
      >
        <Icon
          className={`h-5 w-5 text-[#F33B7D] transition-colors duration-300 ${
            isUnread ? "group-hover:text-white" : ""
          }`}
          strokeWidth={1.75}
        />
        {isUnread && (
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#F33B7D] ring-2 ring-white" />
        )}
      </span>

      <div className="relative min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={`text-sm text-[#0D0D0D] ${
              isUnread ? "font-bold" : "font-semibold"
            }`}
          >
            {notification.title}
          </p>
          {isUnread && (
            <span className="mt-0.5 flex-shrink-0 rounded-full bg-[#F33B7D]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#F33B7D]">
              New
            </span>
          )}
        </div>

        <p className="mt-1 text-sm leading-5 text-[#6F686B]">
          {notification.message}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#B8AEB2]">
          <span className="font-medium">{formatTime(notification.createdAt)}</span>

          {isHigh && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE4EB] px-2 py-0.5 font-semibold text-[#F33B7D] ring-1 ring-[#F8C9DA]">
              <span className="h-1 w-1 rounded-full bg-[#F33B7D]" />
              Important
            </span>
          )}

          {notification.read && notification.readAt && (
            <>
              <span className="h-1 w-1 rounded-full bg-[#E8D5DD]" />
              <span className="font-medium">Read</span>
            </>
          )}
        </div>
      </div>

      {notification.link && (
        <ChevronRight className="relative mt-3 h-4 w-4 flex-shrink-0 text-[#E8D5DD] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#F33B7D]" />
      )}
    </div>
  );

  return notification.link ? (
    <Link to={notification.link} className="block">
      {content}
    </Link>
  ) : (
    <div>{content}</div>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    try {
      setError("");
      const data = await getNotifications({ limit: 100 });
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const visibleNotifications =
    filter === "unread"
      ? notifications.filter((item) => !item.read)
      : notifications;

  const handleRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((items) =>
        items.map((item) =>
          item._id === id
            ? { ...item, read: true, readAt: new Date().toISOString() }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;
    try {
      setWorking(true);
      await markAllNotificationsAsRead();
      setNotifications((items) =>
        items.map((item) => ({
          ...item,
          read: true,
          readAt: new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    } finally {
      setWorking(false);
    }
  };

  return (
    <PageLayout
      title="Notifications"
      subtitle="Your latest health updates, reminders and consultation activity."
    >
      <div className="mx-auto max-w-4xl">
        {/* ── Toolbar ───────────────────────────── */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {/* filter pill container — no shadow */}
          <div className="flex gap-1 rounded-full bg-white p-1 ring-1 ring-[#F0DCE4]">
            {filters.map((item) => {
              const active = filter === item.key;
              const count = item.key === "unread" ? unreadCount : null;
              return (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "bg-[#F33B7D] text-white"
                      : "text-[#4A4A4A] hover:bg-[#FEF4F4] hover:text-[#F33B7D]"
                  }`}
                >
                  {item.label}
                  {count !== null && count > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        active
                          ? "bg-white/25 text-white"
                          : "bg-[#FEE4EB] text-[#F33B7D]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#4A4A4A] ring-1 ring-[#F0DCE4] transition-all duration-200 hover:bg-[#FEF4F4] hover:text-[#F33B7D] hover:ring-[#F8C9DA] disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={working}
                className="flex items-center gap-2 rounded-xl bg-[#F33B7D] px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#d92b6b] disabled:opacity-60"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* ── Loading skeleton ─────────────────── */}
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-gradient-to-br from-[#FEE4EB] to-[#FDF6F8] ring-1 ring-[#F5E4EC]"
              />
            ))}
          </div>
        )}

        {/* ── Error ────────────────────────────── */}
        {error && !loading && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </div>
        )}

        {/* ── Empty state ──────────────────────── */}
        {!loading && !error && visibleNotifications.length === 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-white p-10 text-center ring-1 ring-[#F5E4EC]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#FEE4EB] to-transparent opacity-60" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-[#FEE4EB] to-transparent opacity-40" />
            <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FEE4EB] to-[#FCE4EB] ring-1 ring-[#F8C9DA]">
              <Bell className="h-7 w-7 text-[#F33B7D]" strokeWidth={1.75} />
            </span>
            <p className="relative mt-4 text-sm font-semibold text-[#0D0D0D]">
              {filter === "unread"
                ? "You're all caught up"
                : "No notifications yet"}
            </p>
            <p className="relative mt-1 text-xs text-[#8F8C8C]">
              New reminders and health updates will appear here automatically.
            </p>
          </div>
        )}

        {/* ── List ─────────────────────────────── */}
        {!loading && !error && visibleNotifications.length > 0 && (
          <>
            {unreadCount > 0 && (
              <p className="mb-3 text-xs font-medium text-[#8F8C8C]">
                <span className="font-bold text-[#F33B7D]">{unreadCount}</span>{" "}
                unread notification{unreadCount === 1 ? "" : "s"}
              </p>
            )}

            <div className="space-y-3">
              {visibleNotifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onRead={handleRead}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}