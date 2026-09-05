import { useState, useEffect } from "react";
import DoctorSidebar from "../components/doctor/DoctorSidebar";
import DoctorHeader from "../components/doctor/DoctorHeader";
import { useAuth } from "../context/AuthContext";
import { getDoctorDashboard } from "../services/doctorPortal.service";

export default function DoctorLayout({
  children,
  title,
  subtitle,
  showSearch = true,
  onSearchChange,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Sidebar badge counts - refetched on every route change inside this
  // layout so approving/rejecting a request updates the badges without
  // a full page reload.
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let cancelled = false;

    const fetchCounts = async () => {
      try {
        const data = await getDoctorDashboard();
        if (!cancelled) {
        setCounts((prev) => ({
  ...prev,
  pendingRequests: data.pendingRequests,
  closedConsultations: data.closedConsultations,
  unreadMessages: data.unreadMessages,
  notificationCount:
    (data.pendingRequests || 0) + (data.unreadMessages || 0),
}));
        }
      } catch {
        // Badges are non-critical - fail silently, sidebar just omits them.
      }
    };

    fetchCounts();

    return () => {
      cancelled = true;
    };
  }, [title]);

  return (
    <div className="flex min-h-screen w-full bg-[#FEF4F4]">
      <DoctorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        counts={counts}
      />

      <main className="flex-1 p-5 sm:p-7">
        <DoctorHeader
  title={title}
  subtitle={subtitle}
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  user={user}
  notificationCount={counts.notificationCount}
  showSearch={showSearch}
  onSearchChange={onSearchChange}
/>

        {children}
      </main>
    </div>
  );
}
