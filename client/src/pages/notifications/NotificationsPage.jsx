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

  const content = (
    <div
      className={`flex gap-4 rounded-2xl p-4 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md ${
        notification.read ? "bg-white" : "bg-[#FEF4F4]"
      }`}
      onClick={() => !notification.read && onRead(notification._id)}
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-[#0D0D0D]">{notification.title}</p>
          {!notification.read && (
            <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#F33B7D]" />
          )}
        </div>
        <p className="mt-1 text-sm leading-5 text-[#6F686B]">{notification.message}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-[#B8AEB2]">
          <span>{formatTime(notification.createdAt)}</span>
          {notification.priority === "high" && (
            <span className="rounded-full bg-[#FEE4EB] px-2 py-0.5 font-semibold text-[#F33B7D]">
              Important
            </span>
          )}
        </div>
      </div>
      {notification.link && (
        <ChevronRight className="mt-3 h-4 w-4 flex-shrink-0 text-[#B8AEB2]" />
      )}
    </div>
  );

  return notification.link ? (
    <Link to={notification.link}>{content}</Link>
  ) : <div>{content}</div>;
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
          item._id === id ? { ...item, read: true, readAt: new Date().toISOString() } : item
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
        items.map((item) => ({ ...item, read: true, readAt: new Date().toISOString() }))
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
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 rounded-full bg-[#FEF4F4] p-1">
            {filters.map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  filter === item.key
                    ? "bg-[#F33B7D] text-white"
                    : "text-[#4A4A4A] hover:bg-[#FEE4EB]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#4A4A4A] ring-1 ring-black/5 hover:bg-[#FEF4F4]"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={working}
                className="flex items-center gap-2 rounded-xl bg-[#F33B7D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d92b6b]"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <p className="mb-4 text-xs text-[#8F8C8C]">
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </p>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] ring-1 ring-black/5">
            Loading notifications...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-100">{error}</div>
        )}

        {!loading && !error && visibleNotifications.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-black/5">
            <Bell className="mx-auto h-8 w-8 text-[#F33B7D]" />
            <p className="mt-3 text-sm font-semibold text-[#0D0D0D]">
              {filter === "unread" ? "You're all caught up" : "No notifications yet"}
            </p>
            <p className="mt-1 text-xs text-[#8F8C8C]">
              New reminders and health updates will appear here automatically.
            </p>
          </div>
        )}

        {!loading && !error && visibleNotifications.length > 0 && (
          <div className="space-y-3">
            {visibleNotifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onRead={handleRead}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
