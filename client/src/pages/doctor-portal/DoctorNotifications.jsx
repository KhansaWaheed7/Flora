import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
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
  const visible = filter === "unread"
    ? notifications.filter((item) => !item.read)
    : notifications;

  const markRead = async (id) => {
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

  const markAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((items) =>
        items.map((item) => ({ ...item, read: true, readAt: new Date().toISOString() }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  return (
    <DoctorLayout title="Notifications" subtitle="Consultation, message, and practice updates." showSearch={false}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setFilter("all")} className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === "all" ? "bg-[#F33B7D] text-white" : "bg-white text-[#8F8C8C] ring-1 ring-[#F0DCE4]"}`}>
              All
            </button>
            <button onClick={() => setFilter("unread")} className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === "unread" ? "bg-[#F33B7D] text-white" : "bg-white text-[#8F8C8C] ring-1 ring-[#F0DCE4]"}`}>
              Unread ({unreadCount})
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#8F8C8C] ring-1 ring-[#F0DCE4] hover:bg-[#FEF4F4]">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="inline-flex items-center gap-1.5 rounded-xl bg-[#F33B7D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d92b6b]">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
        </div>

        {loading && <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] ring-1 ring-black/5">Loading notifications...</div>}
        {error && !loading && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        {!loading && !error && visible.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-black/5">
            <Bell className="mx-auto h-8 w-8 text-[#F33B7D]" />
            <p className="mt-3 text-sm font-semibold text-[#3D2A33]">{filter === "unread" ? "You're all caught up" : "No notifications yet"}</p>
            <p className="mt-1 text-xs text-[#8F8C8C]">New consultation and message updates will appear here.</p>
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="space-y-3">
            {visible.map((notification) => {
              const content = (
                <div
                  onClick={() => !notification.read && markRead(notification._id)}
                  className={`flex gap-3 rounded-2xl p-4 ring-1 ring-black/5 transition hover:ring-[#F0DCE4] ${notification.read ? "bg-white" : "bg-[#FEF4F4]"}`}
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#FCE4EB]">
                    <Bell className="h-5 w-5 text-[#F33B7D]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-[#3D2A33]">{notification.title}</p>
                      {!notification.read && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#F33B7D]" />}
                    </div>
                    <p className="mt-1 text-sm leading-5 text-[#6F686B]">{notification.message}</p>
                    <p className="mt-2 text-[10px] text-[#B8B4B4]">{formatTime(notification.createdAt)}</p>
                  </div>
                </div>
              );
              return notification.link ? <Link key={notification._id} to={notification.link}>{content}</Link> : <div key={notification._id}>{content}</div>;
            })}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
