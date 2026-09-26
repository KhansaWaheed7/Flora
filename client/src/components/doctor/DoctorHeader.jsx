import { Menu, Bell, User, Settings, LogOut, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "../common/Avatar";
import { logout } from "../../utils/auth";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "D";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function DoctorAvatar({ user, size = "h-9 w-9 text-sm" }) {
  const name = user?.fullName || user?.name || "Doctor";
  const image = user?.profilePicture || user?.avatar || "";

  if (image && image.trim() !== "") {
    return <Avatar name={name} image={image} size={size} />;
  }

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full bg-[#FCE4EB] font-bold text-[#F33B7D] ring-1 ring-[#F0DCE4] ${size}`}
    >
      {getInitials(name)}
    </div>
  );
}

function formatNotificationTime(value) {
  if (!value) return "";
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (diff < 60 * 1000) return "Just now";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

export default function DoctorHeader({
  title,
  subtitle,
  sidebarOpen,
  setSidebarOpen,
  user,
  notificationCount = 0,
  notifications = [],
}) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-[#4A4A4A] hover:bg-[#FEE4EB] lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#0D0D0D] sm:text-xl">{title}</h1>
          {subtitle && <p className="text-xs text-[#8F8C8C] sm:text-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative z-30">
          <button
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfile(false);
            }}
            className="relative rounded-full bg-white p-2.5 text-[#4A4A4A] shadow-sm ring-1 ring-black/5 hover:bg-[#FEF4F4]"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F33B7D] text-[9px] font-bold text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-[#F0DCE4] bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-[#F0DCE4] px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0D0D0D]">Notifications</h3>
                  <p className="text-xs text-[#8F8C8C]">
                    {notificationCount} unread
                  </p>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="mx-auto h-8 w-8 text-[#D8D3D5]" />
                    <p className="mt-2 text-sm font-medium text-[#4A4A4A]">No notifications</p>
                    <p className="mt-1 text-xs text-[#8F8C8C]">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() => {
                        setShowNotifications(false);
                        if (notification.link) navigate(notification.link);
                      }}
                      className={`flex w-full gap-3 border-b border-[#F7E9EE] px-4 py-3 text-left hover:bg-[#FEF4F4] ${
                        notification.read ? "bg-white" : "bg-[#FEF4F4]"
                      }`}
                    >
                      <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FCE4EB]">
                        <Bell className="h-4 w-4 text-[#F33B7D]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-[#0D0D0D]">
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#F33B7D]" />
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-[#8F8C8C]">
                          {notification.message}
                        </span>
                        <span className="mt-1 block text-[10px] text-[#B8B4B4]">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowNotifications(false);
                  navigate("/doctor/notifications");
                }}
                className="flex w-full items-center justify-center gap-1 border-t border-[#F0DCE4] px-4 py-3 text-xs font-semibold text-[#F33B7D] hover:bg-[#FEF4F4]"
              >
                View all notifications
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="relative z-30">
          <button
            onClick={() => {
              setShowProfile((prev) => !prev);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-white"
          >
            <DoctorAvatar user={user} size="h-9 w-9 text-sm" />
            <span className="hidden max-w-[150px] truncate text-sm font-medium text-[#0D0D0D] sm:inline">
              {user?.fullName || user?.name || "Doctor"}
            </span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 z-50 w-60 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
              <div className="border-b border-[#F0DCE4] px-3 py-3">
                <div className="flex items-center gap-3">
                  <DoctorAvatar user={user} size="h-10 w-10 text-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0D0D0D]">{user?.fullName || user?.name || "Doctor"}</p>
                    <p className="truncate text-xs text-[#8F8C8C]">{user?.email || "doctor@example.com"}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => { setShowProfile(false); navigate("/doctor/profile"); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#3D3939] hover:bg-[#FEF4F4]">
                <User className="h-4 w-4" /> <span>Profile</span>
              </button>
              <button onClick={() => { setShowProfile(false); navigate("/doctor/settings"); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#3D3939] hover:bg-[#FEF4F4]">
                <Settings className="h-4 w-4" /> <span>Settings</span>
              </button>
              <div className="mt-1 border-t border-[#F0DCE4] pt-1">
                <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#F33B7D] hover:bg-[#FEF4F4]">
                  <LogOut className="h-4 w-4" /> <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
