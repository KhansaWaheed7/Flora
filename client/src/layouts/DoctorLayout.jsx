import { useEffect, useState } from "react";

import DoctorSidebar from "../components/doctor/DoctorSidebar";
import DoctorHeader from "../components/doctor/DoctorHeader";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import {
  getDoctorDashboard,
  getDoctorProfile,
} from "../services/doctorPortal.service";
import { getNotifications } from "../services/notification.service";

const normalizeNotifications = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.notifications)) return response.notifications;
  return [];
};

export default function DoctorLayout({
  children,
  title,
  subtitle,
  showSearch = true,
  onSearchChange,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, setUser } = useAuth();
  const { socket, unreadNotificationCount } = useSocket();
  const [counts, setCounts] = useState({});
  const [notifications, setNotifications] = useState([]);

  const [doctorProfile, setDoctorProfile] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to read stored doctor profile:", error);
    }
    return null;
  });

  const loadDoctorData = async () => {
    try {
      const [dashboard, notificationResponse] = await Promise.all([
        getDoctorDashboard(),
        getNotifications({ limit: 6 }),
      ]);

      const latestNotifications = normalizeNotifications(notificationResponse);

      setNotifications(latestNotifications);
      setCounts((prev) => ({
        ...prev,
        pendingRequests: dashboard?.pendingRequests || 0,
        closedConsultations: dashboard?.closedConsultations || 0,
        activePatients: dashboard?.activePatients || 0,
        unreadMessages: dashboard?.unreadMessages || 0,
        notificationCount: unreadNotificationCount,
      }));
    } catch {
      // Header badges are non-critical.
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const dashboard = await getDoctorDashboard();
        if (!cancelled) {
          setCounts((prev) => ({
            ...prev,
            pendingRequests: dashboard.pendingRequests,
            closedConsultations: dashboard.closedConsultations,
            activePatients: dashboard.activePatients,
            unreadMessages: dashboard.unreadMessages,
          }));
        }

        const notificationResponse = await getNotifications({ limit: 6 });
        if (!cancelled) {
          const latest = normalizeNotifications(notificationResponse);
          setNotifications(latest);
          setCounts((prev) => ({
            ...prev,
            notificationCount: unreadNotificationCount,
          }));
        }
      } catch {
        // Badges are non-critical.
      }
    };

    fetchData();

    const interval = setInterval(() => {
      if (!cancelled) loadDoctorData();
    }, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [title]);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const response = await getDoctorProfile();
        if (cancelled) return;

        const latestProfile = response;
        setDoctorProfile((prev) => ({ ...prev, ...latestProfile }));

        const updatedUser = { ...user, ...latestProfile };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Doctor profile fetch error:", error);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setCounts((prev) => ({ ...prev, notificationCount: unreadNotificationCount }));
  }, [unreadNotificationCount]);

  useEffect(() => {
    if (!socket) return;
    const onCreated = ({ notification }) => {
      if (notification?._id) setNotifications((items) => [notification, ...items.filter((item) => item._id !== notification._id)].slice(0, 6));
    };
    const onUpdated = (payload) => {
      if (payload?.markAllRead) setNotifications((items) => items.map((item) => ({ ...item, read: true })));
      else if (payload?._id) setNotifications((items) => items.map((item) => item._id === payload._id ? payload : item));
    };
    const onDeleted = ({ id }) => setNotifications((items) => items.filter((item) => item._id !== id));
    socket.on("notification:created", onCreated);
    socket.on("notification:updated", onUpdated);
    socket.on("notification:deleted", onDeleted);
    return () => { socket.off("notification:created", onCreated); socket.off("notification:updated", onUpdated); socket.off("notification:deleted", onDeleted); };
  }, [socket]);

  const headerUser = {
    ...(user || {}),
    ...(doctorProfile || {}),
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FEF4F4]">
      <DoctorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={headerUser}
        counts={counts}
      />

      <main className="flex-1 p-5 sm:p-7">
        <DoctorHeader
          title={title}
          subtitle={subtitle}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={headerUser}
          notificationCount={unreadNotificationCount}
          notifications={notifications}
          showSearch={showSearch}
          onSearchChange={onSearchChange}
        />

        {children}
      </main>
    </div>
  );
}
