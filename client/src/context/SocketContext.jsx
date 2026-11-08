import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { getUnreadNotificationCount } from "../services/notification.service";

const SOCKET_URL = (import.meta.env.VITE_API_URL || "").replace(/\/api\/v1\/?$/, "");
const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
      setUnreadNotificationCount(0);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const connection = io(SOCKET_URL, { auth: { token }, withCredentials: true, reconnection: true });
    socketRef.current = connection;
    setSocket(connection);

    const refreshCount = async () => {
      try { setUnreadNotificationCount(await getUnreadNotificationCount()); }
      catch (error) { console.error("Unable to sync unread notifications:", error); }
    };
    const onCreated = ({ notification, unreadCount }) => {
      if (Number.isFinite(unreadCount)) setUnreadNotificationCount(unreadCount);
      else setUnreadNotificationCount((count) => count + 1);
      if (notification?.title) toast(notification.title, { icon: "🔔" });
    };
    const onCount = ({ unreadCount } = {}) => {
      if (Number.isFinite(unreadCount)) setUnreadNotificationCount(unreadCount);
    };

    connection.on("connect", () => { setConnected(true); refreshCount(); });
    connection.on("disconnect", () => setConnected(false));
    connection.on("notification:created", onCreated);
    connection.on("notification:count-updated", onCount);
    connection.on("notification:updated", onCount);
    connection.on("connect_error", (error) => console.error("Socket connection error:", error.message));

    return () => {
      connection.off("notification:created", onCreated);
      connection.off("notification:count-updated", onCount);
      connection.off("notification:updated", onCount);
      connection.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, connected, unreadNotificationCount, setUnreadNotificationCount }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
  return ctx;
}
