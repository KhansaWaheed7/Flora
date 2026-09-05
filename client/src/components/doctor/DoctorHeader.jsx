
import { Menu, Search, Bell, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "../common/Avatar";
import { logout } from "../../utils/auth";

export default function DoctorHeader({
  title,
  subtitle,
  sidebarOpen,
  setSidebarOpen,
  user,
  notificationCount = 0,
  showSearch = true,
  onSearchChange,
}) {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    setShowProfile(false);
    navigate("/doctor/profile");
  };

  const handleSettingsClick = () => {
    setShowProfile(false);
    navigate("/doctor/settings");
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-[#4A4A4A] hover:bg-[#FEE4EB] lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#0D0D0D] sm:text-xl">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs text-[#8F8C8C] sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        {showSearch && (
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />

            <input
              type="text"
              placeholder="Search patients..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-56 rounded-xl border border-[#F0DCE4] bg-white py-2 pl-9 pr-3 text-sm text-[#3D3939] placeholder:text-[#B8B4B4] focus:border-[#F33B7D] focus:outline-none focus:ring-1 focus:ring-[#F33B7D]"
            />
          </div>
        )}

        {/* Notifications */}
        <div className="relative z-30">
          <button
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfile(false);
            }}
            className="relative rounded-full bg-white p-2.5 text-[#4A4A4A] shadow-sm ring-1 ring-black/5 hover:bg-[#FEF4F4]"
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
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#F0DCE4] px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0D0D0D]">
                    Notifications
                  </h3>

                  <p className="text-xs text-[#8F8C8C]">
                    {notificationCount}{" "}
                    {notificationCount === 1
                      ? "notification"
                      : "notifications"}
                  </p>
                </div>

                {notificationCount > 0 && (
                  <span className="rounded-full bg-[#FCE4EB] px-2 py-1 text-[10px] font-bold text-[#F33B7D]">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </div>

              {/* Notification content */}
              {notificationCount > 0 ? (
                <div className="max-h-72 overflow-y-auto">
                  <div className="flex cursor-pointer gap-3 border-b border-[#F7E9EE] px-4 py-3 hover:bg-[#FEF4F4]">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FCE4EB]">
                      <Bell className="h-4 w-4 text-[#F33B7D]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D0D0D]">
                        Consultation Request
                      </p>

                      <p className="mt-0.5 text-xs text-[#8F8C8C]">
                        You have a new consultation request from a patient.
                      </p>

                      <p className="mt-1 text-[10px] text-[#B8B4B4]">
                        Just now
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <Bell className="mx-auto h-8 w-8 text-[#D8D3D5]" />

                  <p className="mt-2 text-sm font-medium text-[#4A4A4A]">
                    No new notifications
                  </p>

                  <p className="mt-1 text-xs text-[#8F8C8C]">
                    You're all caught up!
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-[#F0DCE4] px-4 py-3">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full text-center text-xs font-semibold text-[#F33B7D] hover:underline"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Doctor Profile */}
        <div className="relative z-30">
          <button
            onClick={() => {
              setShowProfile((prev) => !prev);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-white"
          >
            <Avatar
              name={user?.fullName || user?.name || "Doctor"}
              image={user?.profilePicture || user?.avatar || ""}
              size="h-9 w-9 text-sm"
            />

            <span className="hidden max-w-[150px] truncate text-sm font-medium text-[#0D0D0D] sm:inline">
              {user?.fullName || user?.name || "Doctor"}
            </span>
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-12 z-50 w-60 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
              {/* Doctor info */}
              <div className="border-b border-[#F0DCE4] px-3 py-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={user?.fullName || user?.name || "Doctor"}
                    image={user?.profilePicture || user?.avatar || ""}
                    size="h-10 w-10 text-sm"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0D0D0D]">
                      {user?.fullName || user?.name || "Doctor"}
                    </p>

                    <p className="truncate text-xs text-[#8F8C8C]">
                      {user?.email || "doctor@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <button
                onClick={handleProfileClick}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#3D3939] transition-colors hover:bg-[#FEF4F4]"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>

              {/* Settings */}
              <button
                onClick={handleSettingsClick}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#3D3939] transition-colors hover:bg-[#FEF4F4]"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>

              {/* Logout */}
              <div className="mt-1 border-t border-[#F0DCE4] pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#F33B7D] transition-colors hover:bg-[#FEF4F4]"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
