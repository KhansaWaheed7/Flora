import { Link, useNavigate } from "react-router-dom";
import { Bell, Settings, LogOut, Menu, Search } from "lucide-react";
import Avatar from "../common/Avatar";
import { logout } from "../../utils/auth";

export default function AdminHeader({
  title,
  subtitle,
  profileOpen,
  setProfileOpen,
  sidebarOpen,
  setSidebarOpen,
  user,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow ring-1 ring-black/5 lg:hidden"
        >
          <Menu className="h-5 w-5 text-[#3D3939]" />
        </button>

        <div>
          <h1 className="font-display text-xl font-semibold text-[#0D0D0D] sm:text-2xl">
            {title || "Dashboard"}
          </h1>
          <p className="mt-0.5 text-sm text-[#8F8C8C]">{subtitle || "Welcome back, Admin!"}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />
          <input
            placeholder="Search..."
            className="w-56 rounded-xl border border-[#F0DCE4] bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
          />
        </div>

        <Link
          to="/admin/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.06)] ring-1 ring-black/5 transition hover:-translate-y-0.5"
        >
          <Bell className="h-4 w-4 text-[#3D3939]" />
        </Link>

        <div className="relative z-20">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2"
          >
            <Avatar name={user?.fullName || "Admin"} image={user?.avatar} />
            <span className="hidden text-sm font-medium text-[#0D0D0D] sm:inline">
              {user?.fullName || "Admin"}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
              <div className="px-3 py-2 border-b border-[#F0DCE4]">
                <p className="text-sm font-semibold text-[#0D0D0D]">{user?.fullName || "Admin"}</p>
                <p className="text-xs text-[#8F8C8C]">{user?.email || "admin@flora.com"}</p>
              </div>

              <Link
                to="/admin/settings"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#3D3939] hover:bg-[#FEF4F4] transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>

              <div className="border-t border-[#F0DCE4] mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#F33B7D] hover:bg-[#FEF4F4]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}