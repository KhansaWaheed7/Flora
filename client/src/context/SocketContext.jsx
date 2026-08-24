import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

/*
NOTE: The exact auth handshake shape expected by
server/src/socket/middleware/socketAuth.js hasn't been confirmed -
this uses the most common pattern (auth: { token }) with the same
access token used for REST calls. If the socket fails to connect /
authenticate, share that middleware file and this will be corrected.

VITE_API_URL is like "http://localhost:5000/api/v1" - the socket
server itself runs on the bare origin (no /api/v1), so that suffix
is stripped here.
*/
const SOCKET_URL = (import.meta.env.VITE_API_URL || "").replace(
  /\/api\/v1\/?$/,
  ""
);

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    const socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return ctx;
}
