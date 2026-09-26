import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck, RefreshCw, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notification.service";

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleString();
}

export default function DoctorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getNotifications({ limit: 100 });
      const list = Array.isArray(response) ? response : response?.data || [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const visible =
    filter === "unread"
      ? notifications.filter((item) => !item.read)
      : notifications;

  const markRead = async (id) => {
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

  const markAllRead = async () => {
    try {
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
    }
  };

  const getNotificationLink = (notification) => {
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
};

  return (
    <DoctorLayout
      title="Notifications"
      subtitle="Consultation, message, and practice updates."
      showSearch={false}
    >
      <div className="mx-auto max-w-4xl">
        {/* ── Toolbar ───────────────────────────── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* filter pill container — no shadow */}
          <div className="flex gap-1 rounded-full bg-white p-1 ring-1 ring-[#F0DCE4]">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                filter === "all"
                  ? "bg-[#F33B7D] text-white"
                  : "text-[#8F8C8C] hover:bg-[#FEF4F4] hover:text-[#F33B7D]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                filter === "unread"
                  ? "bg-[#F33B7D] text-white"
                  : "text-[#8F8C8C] hover:bg-[#FEF4F4] hover:text-[#F33B7D]"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    filter === "unread"
                      ? "bg-white/25 text-white"
                      : "bg-[#FEE4EB] text-[#F33B7D]"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#8F8C8C] ring-1 ring-[#F0DCE4] transition-all duration-200 hover:bg-[#FEF4F4] hover:text-[#F33B7D] hover:ring-[#F8C9DA] disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F33B7D] px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#d92b6b]"
              >
                <CheckCheck className="h-3.5 w-3.5" />
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
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </div>
        )}

        {/* ── Empty state ──────────────────────── */}
        {!loading && !error && visible.length === 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-white p-10 text-center ring-1 ring-[#F5E4EC]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#FEE4EB] to-transparent opacity-60" />
            <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FEE4EB] to-[#FCE4EB] ring-1 ring-[#F8C9DA]">
              <Bell className="h-6 w-6 text-[#F33B7D]" strokeWidth={1.75} />
            </span>
            <p className="relative mt-3 text-sm font-semibold text-[#3D2A33]">
              {filter === "unread"
                ? "You're all caught up"
                : "No notifications yet"}
            </p>
            <p className="relative mt-1 text-xs text-[#8F8C8C]">
              New consultation and message updates will appear here.
            </p>
          </div>
        )}

        {/* ── List ─────────────────────────────── */}
        {!loading && !error && visible.length > 0 && (
          <div className="space-y-3">
            {visible.map((notification) => {
              const notificationLink = getNotificationLink(notification);
              const isUnread = !notification.read;

              const content = (
                <div
                  onClick={() => isUnread && markRead(notification._id)}
                  className={`group relative flex cursor-pointer gap-3 overflow-hidden rounded-2xl bg-white p-4 ring-1 transition-all duration-300 hover:-translate-y-0.5 ${
                    isUnread
                      ? "ring-[#F8C9DA] hover:ring-[#F33B7D]/40"
                      : "ring-[#F5E4EC] hover:ring-[#F8C9DA]"
                  }`}
                >
                  {/* soft gradient blob */}
                  <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#FEE4EB] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* left accent bar for unread */}
                  {isUnread && (
                    <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#F33B7D] to-[#d92b6b]" />
                  )}

                  {/* icon chip */}
                  <span
                    className={`relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-300 ${
                      isUnread
                        ? "bg-gradient-to-br from-[#FEE4EB] to-[#FCE4EB] ring-[#F8C9DA] group-hover:from-[#F33B7D] group-hover:to-[#F33B7D] group-hover:ring-[#F33B7D]"
                        : "bg-gradient-to-br from-[#FDF6F8] to-[#FEE4EB] ring-[#F5E4EC] group-hover:from-[#FEE4EB] group-hover:to-[#FCE4EB] group-hover:ring-[#F8C9DA]"
                    }`}
                  >
                    <Bell
                      className={`h-5 w-5 text-[#F33B7D] transition-colors duration-300 ${
                        isUnread ? "group-hover:text-white" : ""
                      }`}
                      strokeWidth={1.75}
                    />
                    {isUnread && (
                      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#F33B7D] ring-2 ring-white" />
                    )}
                  </span>

                  {/* content */}
                  <div className="relative min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className={`text-sm text-[#3D2A33] ${
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
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-medium text-[#B8B4B4]">
                        {formatTime(notification.createdAt)}
                      </span>
                      {notification.read && notification.readAt && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-[#E8D5DD]" />
                          <span className="text-[10px] font-medium text-[#B8B4B4]">
                            Read
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* chevron (only if link) */}
                  {notificationLink && (
                    <ChevronRight className="relative h-4 w-4 flex-shrink-0 self-center text-[#E8D5DD] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#F33B7D]" />
                  )}
                </div>
              );

              return notificationLink ? (
                <Link
                  key={notification._id}
                  to={notificationLink}
                  className="block"
                >
                  {content}
                </Link>
              ) : (
                <div key={notification._id}>{content}</div>
              );
            })}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}