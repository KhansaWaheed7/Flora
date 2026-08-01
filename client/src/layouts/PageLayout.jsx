import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { useAuth } from "../context/AuthContext";

export default function PageLayout({ children, title, subtitle, backTo }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAuth();

  const titleNode = backTo ? (
    <span className="flex items-center gap-2">
      <Link
        to={backTo}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#3D3939] hover:bg-[#FEE4EB] hover:text-[#F33B7D]"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>
      {title}
    </span>
  ) : (
    title
  );

  return (
    <div className="flex min-h-screen w-full bg-[#FEF4F4]">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />

      <main className="flex-1 p-5 sm:p-7">
        <Header
          title={titleNode}
          subtitle={subtitle}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
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
