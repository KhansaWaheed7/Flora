import { Menu, Search, Bell } from "lucide-react";

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

        <button className="relative rounded-full bg-white p-2.5 text-[#4A4A4A] shadow-sm ring-1 ring-black/5 hover:bg-[#FEF4F4]">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F33B7D] text-[9px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <div className="relative h-9 w-9 flex-shrink-0 rounded-full bg-[#F33B7D] text-sm font-bold text-white flex items-center justify-center">
          {(user?.fullName || "D").charAt(0)}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
        </div>
      </div>
    </div>
  );
}
