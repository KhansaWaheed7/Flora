import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  Stethoscope,
  Users,
  MessageCircle,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
} from "lucide-react";
import Logo from "../common/Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: UserCheck, label: "Doctor Approval", path: "/admin/doctor-approval" },
  { icon: Stethoscope, label: "Doctors", path: "/admin/doctors" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: MessageCircle, label: "Chat Monitoring", path: "/admin/chat-monitoring" },
  { icon: BarChart3, label: "Consultations", path: "/admin/consultations" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

function NavItem({ icon: Icon, label, active, path, onClick }) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-[#F33B7D] text-white shadow-lg shadow-[#F33B7D]/30"
          : "text-[#4A4A4A] hover:bg-[#FCE4EB] hover:text-[#F33B7D]"
      }`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-white" : "text-[#8F8C8C]"}`} />
      <span className="flex-1">{label}</span>
    </Link>
  );
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, user = { fullName: "Admin" } }) {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:sticky left-0 top-0 z-50 h-screen bg-[#FEE4EB] transition-all duration-300 ease-in-out flex flex-col border-r border-[#F0DCE4] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="flex items-center px-4 py-6 border-b border-[#F0DCE4] flex-shrink-0">
          <Logo />
          <span className="ml-1 -translate-y-1 rounded-full bg-[#F33B7D] px-2 py-0.5 text-[10px] font-bold text-white">
            Admin
          </span>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                {...item}
                active={isActive(item.path)}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-[#F0DCE4] p-4 flex-shrink-0 bg-[#FEE4EB]">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-sm font-bold text-white">
              {(user?.fullName || "A").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0D0D0D] truncate">{user?.fullName || "Admin"}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-[#8F8C8C]" />
          </div>
        </div>
      </aside>
    </>
  );
}