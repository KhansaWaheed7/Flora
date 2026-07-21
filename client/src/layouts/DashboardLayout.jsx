// DashboardLayout.jsx
import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

// Service to get user data
const userService = {
  getUser: async () => {
    // Replace with actual API call
    // const response = await fetch('/api/user/profile');
    // return response.json();
    return null;
  }
};

export default function DashboardLayout({
  children,
  title,
  subtitle,
}) {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
 const storedUser = JSON.parse(localStorage.getItem("user")) || {};

const [user, setUser] = useState({
  name: storedUser.fullName || "",
  email: storedUser.email || "",
});

const currentHour = new Date().getHours();

let greeting = "Good Morning";

if (currentHour >= 12 && currentHour < 17) {
  greeting = "Good Afternoon";
} else if (currentHour >= 17 && currentHour < 21) {
  greeting = "Good Evening";
} else if (currentHour >= 21 || currentHour < 5) {
  greeting = "Good Night";
}

const userName = user.name?.split(" ")[0] || "there";
const greetingTitle = `${greeting}, ${userName} `;

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getUser();
        if (userData) {
          setUser(userData);
        }
        // If API returns null, keep default user
      } catch (error) {
        console.error('Error fetching user:', error);
        // Keep default user
      } 
    };

    fetchUser();
  }, []);

  // Handle search from header
  const handleSearch = (result) => {
    console.log('Search result selected:', result);
    // You can add navigation logic here
    if (result.path) {
      // Navigate to result path
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FEF4F4]">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />

      <main className="flex-1 p-5 sm:p-7">
        <Header
          title={greetingTitle}
          subtitle={subtitle}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          onSearch={handleSearch}
        />

        {children}
      </main>
    </div>
  );
}