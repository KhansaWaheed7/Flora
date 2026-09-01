import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full bg-[#FEF4F4]">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />

      <main className="flex-1 p-5 sm:p-7">
        <AdminHeader
          title={title}
          subtitle={subtitle}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
        />

        {children}
      </main>
    </div>
  );
}