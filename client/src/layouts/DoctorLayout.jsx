
import { useState, useEffect } from "react";

import DoctorSidebar from "../components/doctor/DoctorSidebar";
import DoctorHeader from "../components/doctor/DoctorHeader";

import { useAuth } from "../context/AuthContext";

import {
  getDoctorDashboard,
  getDoctorProfile,
} from "../services/doctorPortal.service";

export default function DoctorLayout({
  children,
  title,
  subtitle,
  showSearch = true,
  onSearchChange,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, setUser } = useAuth();

  const [counts, setCounts] = useState({});

  /*
   * IMPORTANT:
   * Start with the user already stored in localStorage.
   * This means the header can show the existing profile picture
   * immediately instead of waiting for the API.
   */
  const [doctorProfile, setDoctorProfile] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Failed to read stored doctor profile:", error);
    }

    return null;
  });

  /*
   * Fetch sidebar counts whenever the layout/page changes.
   */
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
              (data.pendingRequests || 0) +
              (data.unreadMessages || 0),
          }));
        }
      } catch {
        // Badges are non-critical.
      }
    };

    fetchCounts();

    return () => {
      cancelled = true;
    };
  }, [title]);

  /*
   * Fetch the latest doctor profile.
   *
   * This runs in the background.
   * The header DOES NOT wait for it because doctorProfile
   * already starts with the cached localStorage user.
   */
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const response = await getDoctorProfile();

        if (cancelled) return;

        const latestProfile = response.data;

        /*
         * Update local DoctorLayout profile.
         */
        setDoctorProfile((prev) => ({
          ...prev,
          ...latestProfile,
        }));

        /*
         * Update AuthContext user as well.
         */
        const updatedUser = {
          ...user,
          ...latestProfile,
        };

        setUser(updatedUser);

        /*
         * Save latest profile to localStorage.
         *
         * This is the important part:
         * On the next route change, the profile picture
         * is already available immediately.
         */
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      } catch (error) {
        console.error("Doctor profile fetch error:", error);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Merge AuthContext user and cached/fresh doctor profile.
   *
   * doctorProfile is preferred because it contains
   * the latest profilePicture.
   */
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
          notificationCount={counts.notificationCount}
          showSearch={showSearch}
          onSearchChange={onSearchChange}
        />

        {children}
      </main>
    </div>
  );
}
