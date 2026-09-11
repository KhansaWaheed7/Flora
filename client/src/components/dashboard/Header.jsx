// Header.jsx
import { Link } from "react-router-dom";
import { getCurrentUser, logout } from "../../utils/auth";
import Avatar from "../common/Avatar";
import {
  Bell,
  User,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  Calendar,
  MessageCircle,
  FileText,
  ClipboardList,
  BellRing,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notification.service";

// Notifications are loaded from the Flora notification API.
const headerService = {
  getNotifications: () => getNotifications({ limit: 50 }),
  markNotificationAsRead,
  markAllNotificationsAsRead,
};

// Map notification types -> { icon component, accent color }
// Keeps the dropdown consistent with the rest of the Flora design system.
function getNotificationMeta(type) {
  switch (type) {
    case "reminder":
      return { Icon: BellRing, color: "#F33B7D" };
    case "appointment":
      return { Icon: Calendar, color: "#F59E0B" };
    case "message":
      return { Icon: MessageCircle, color: "#3B82F6" };
    case "report":
      return { Icon: FileText, color: "#A855F7" };
    case "assessment":
      return { Icon: ClipboardList, color: "#22C55E" };
    default:
      return { Icon: Info, color: "#8F8C8C" };
  }
}

// Notification Item Component
function NotificationItem({ notification, onRead }) {
  const { Icon, color } = getNotificationMeta(notification.type);

  return (
    <button
      type="button"
      className={`w-full text-left rounded-xl px-3 py-2 transition-colors hover:bg-[#FEF4F4] ${
        !notification.read ? "bg-[#FEF4F4]" : ""
      }`}
      onClick={() => onRead(notification._id)}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#0D0D0D] truncate">
            {notification.title}
          </p>
          <p className="text-xs text-[#8F8C8C] line-clamp-2">
            {notification.message}
          </p>
          <p className="mt-0.5 text-[10px] text-[#B8AEB2]">
            {notification.createdAt
              ? new Date(notification.createdAt).toLocaleString()
              : ""}
          </p>
        </div>
        {!notification.read && (
          <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#EB6991]" />
        )}
      </div>
    </button>
  );
}

// Search Results Component
function SearchResults({ results, onSelect }) {
  if (results.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-[#8F8C8C] text-center">
        No results found
      </div>
    );
  }

  return (
    <div className="max-h-60 overflow-y-auto">
      {results.map((result) => (
        <button
          key={result.id}
          onClick={() => onSelect(result)}
          className="w-full text-left px-3 py-2 hover:bg-[#FEF4F4] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">{result.icon || "📄"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#0D0D0D]">{result.title}</p>
              <p className="text-xs text-[#8F8C8C] truncate">
                {result.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function Header({
  title,
  subtitle,
  notifOpen,
  setNotifOpen,
  profileOpen,
  setProfileOpen,
  sidebarOpen,
  setSidebarOpen,
  onSearch,
  user,
}) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Fetch notifications on mount (and poll every 30s)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await headerService.getNotifications();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.notifications)
          ? data.notifications
          : [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?._id]);

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotificationRead = async (notificationId) => {
    try {
      await headerService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await headerService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setLoading(true);
    try {
      const results = await headerService.search(query);
      if (results && results.length > 0) {
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        // Demo search results if API not available
        const demoResults = [
          {
            id: "1",
            title: `Results for "${query}"`,
            description: "View all matching items",
            icon: "🔍",
          },
        ];
        setSearchResults(demoResults);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSelect = (result) => {
    setShowSearchResults(false);
    setSearchQuery("");
    if (onSearch) {
      onSearch(result);
    }
    if (result.path) {
      navigate(result.path);
    }
  };

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow ring-1 ring-black/5 lg:hidden"
        >
          <Menu className="h-5 w-5 text-[#3D3939]" />
        </button>

        <div>
          <h1 className="font-display text-xl font-semibold text-[#0D0D0D] sm:text-2xl">
            {title || "Dashboard"}
          </h1>
          <p className="mt-0.5 text-sm text-[#8F8C8C]">
            {subtitle || "Welcome back!"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block" ref={searchContainerRef}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />
          <input
            ref={searchInputRef}
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() =>
              searchQuery.length >= 2 && setShowSearchResults(true)
            }
            className="w-56 rounded-xl border border-[#F0DCE4] bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
          />

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-30 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin h-5 w-5 border-b-2 border-[#F33B7D] rounded-full"></div>
                </div>
              ) : (
                <SearchResults
                  results={searchResults}
                  onSelect={handleSearchSelect}
                />
              )}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative z-20">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.06)] ring-1 ring-black/5 transition hover:-translate-y-0.5"
          >
            <Bell className="h-4 w-4 text-[#3D3939]" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F33B7D] text-[9px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="absolute right-0 top-12 w-80 max-h-[400px] overflow-y-auto rounded-2xl bg-white p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#F0DCE4]">
                  <p className="text-xs font-semibold text-[#8F8C8C]">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#F33B7D] hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                        onRead={handleNotificationRead}
                      />
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-[#8F8C8C]">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="px-3 py-2 border-t border-[#F0DCE4]">
                  <Link
                    to="/notifications"
                    className="block text-center text-xs font-semibold text-[#F33B7D]"
                    onClick={() => setNotifOpen(false)}
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative z-20">
          <button
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2"
          >
            <Avatar
              name={user?.fullName || user?.name || "User"}
              image={user?.avatar}
            />
            <span className="hidden text-sm font-medium text-[#0D0D0D] sm:inline">
              {user?.fullName || user?.name || "User"}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
              <div className="px-3 py-2 border-b border-[#F0DCE4]">
                <p className="text-sm font-semibold text-[#0D0D0D]">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-[#8F8C8C]">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#3D3939] hover:bg-[#FEF4F4] transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>

              <Link
                to="/settings"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#3D3939] hover:bg-[#FEF4F4] transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>

              <div className="border-t border-[#F0DCE4] mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#F33B7D] hover:bg-[#FEF4F4]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}