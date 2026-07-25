// Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Repeat,
  Stethoscope,
  Baby,
  MessageCircle,
  HeartHandshake,
  Apple,
  FileText,
  BookOpen,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Dumbbell,
} from "lucide-react";
import { useState } from "react";
import Logo from "../../components/common/Logo"

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Repeat, label: "Cycle Tracker", path: "/cycle-tracker" },
  { icon: Stethoscope, label: "PCOS Detection", path: "/pcos-detection" },
  { icon: Baby, label: "Pregnancy", path: "/pregnancy" },
  { icon: MessageCircle, label: "Chat", badge: 3, path: "/chat" },
  { icon: HeartHandshake, label: "Health Assistant", path: "/health-assistant" },
  { icon: Apple, label: "Diet & Nutrition", path: "/diet-nutrition" },
  { icon: Dumbbell, label: "Exercise", path: "/exercise" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: BookOpen, label: "Education", path: "/education" },
  { icon: Bell, label: "Notifications", badge: 2, path: "/notifications" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

function NavItem({ icon: Icon, label, active, badge, path, onClick }) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`
        flex items-center gap-3 rounded-xl px-3 py-2.5 
        text-sm font-medium transition-all duration-200
        ${active 
          ? "bg-[#F33B7D] text-white shadow-lg shadow-[#F33B7D]/30" 
          : "text-[#4A4A4A] hover:bg-[#FCE4EB] hover:text-[#F33B7D]"
        }
      `}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-white" : "text-[#8F8C8C] group-hover:text-[#F33B7D]"}`} />
      <span className="flex-1">{label}</span>
      {badge && badge > 0 && (
        <span className={`
          flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold
          ${active 
            ? "bg-white/20 text-white" 
            : "bg-[#F33B7D] text-white"
          }
        `}>
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    user = { name: "Sarah Khan" }
}) {
  const location = useLocation();

  // Check if a path is active
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky left-0 top-0 z-50 h-screen
          bg-[#FEE4EB]
          transition-all duration-300 ease-in-out
          flex flex-col border-r border-[#F0DCE4]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          w-64
        `}
      >
        {/* Logo - Fixed at top */}
        <div className="flex items-center px-4 py-6 border-b border-[#F0DCE4] flex-shrink-0">
          <Logo />
        </div>

        {/* Navigation - Scrollable */}
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

          {/* Talk to a Gynecologist - Inside scrollable area */}
          <div className="mt-4 rounded-2xl bg-[#F33B7D] p-4 text-white shadow-lg shadow-[#F33B7D]/30">
            <p className="text-sm font-semibold">Talk to a Gynecologist</p>
            <p className="mt-1 text-xs text-white/85">
              Get expert advice for your health concerns
            </p>
            <button className="mt-3 w-full rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#F33B7D] hover:bg-[#FEF4F4] transition-colors">
              Start Chat
            </button>
          </div>
        </div>

        {/* Bottom Section - Fixed at bottom */}
        <div className="border-t border-[#F0DCE4] p-4 flex-shrink-0 bg-[#FEE4EB]">
          {/* User Profile */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-sm font-bold text-white">
              {(user?.fullName || user?.name || "U").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0D0D0D]">
                {user?.fullName || user?.name || "User"}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-[#8F8C8C]" />
          </div>

          {/* Light Mode & Language */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#3D3939]">Light Mode</span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#8F8C8C]">EN ▾</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}