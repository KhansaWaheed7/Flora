import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  CheckCircle2,
  MessageCircle,
  CalendarDays,
  User,
  Settings,
  LifeBuoy,
} from "lucide-react";
import Logo from "../common/Logo";

function NavItem({ icon: Icon, label, path, active, badge, onClick }) {
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
      {badge != null && badge > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            active ? "bg-white/25 text-white" : "bg-[#FEE4EB] text-[#F33B7D]"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function DoctorSidebar({
  sidebarOpen,
  setSidebarOpen,
  user = { fullName: "Doctor" },
  counts = {},
}) {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/doctor/dashboard" },
    {
      icon: ClipboardList,
      label: "Consultation Requests",
      path: "/doctor/consultation-requests",
      badge: counts.pendingRequests,
    },
    {
      icon: Users,
      label: "Active Patients",
      path: "/doctor/active-patients",
      badge: counts.activePatients,
    },
    {
      icon: CheckCircle2,
      label: "Closed Consultations",
      path: "/doctor/closed-consultations",
      badge: counts.closedConsultations,
    },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/doctor/messages",
      badge: counts.unreadMessages,
    },
    { icon: CalendarDays, label: "Schedule", path: "/doctor/schedule" },
    { icon: User, label: "Profile", path: "/doctor/profile" },
    { icon: Settings, label: "Settings", path: "/doctor/settings" },
  ];

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
        <div className="flex flex-col px-4 py-6 border-b border-[#F0DCE4] flex-shrink-0">
          <Logo />
          <span className="mt-1 text-[11px] font-medium text-[#8F8C8C]">Doctor Portal</span>
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

        <div className="flex-shrink-0 p-4">
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEE4EB]">
              <LifeBuoy className="h-5 w-5 text-[#F33B7D]" />
            </div>
            <p className="text-xs font-semibold text-[#0D0D0D]">Need Help?</p>
            <p className="mt-0.5 text-[11px] text-[#8F8C8C]">
              We're here to support you.
            </p>
            <Link
              to="/doctor/support"
              className="mt-3 inline-block w-full rounded-lg bg-[#F33B7D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d92b6b] transition-colors"
            >
              Contact Admin
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
