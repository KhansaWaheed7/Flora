import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  MessageCircle,
  Search,
  ChevronRight,
} from "lucide-react";

import DoctorLayout from "../../layouts/DoctorLayout";

import {
  getConversations,
} from "../../services/doctorPortal.service";

// =====================================================
// Format message time
// =====================================================

const formatMessageTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// =====================================================
// Normalize profile picture URL
// =====================================================

const getProfilePictureUrl = (profilePicture) => {
  if (!profilePicture) {
    return "";
  }

  // If backend returns an object
  if (typeof profilePicture === "object") {
    profilePicture =
      profilePicture.url ||
      profilePicture.secure_url ||
      profilePicture.path ||
      profilePicture.src ||
      "";
  }

  if (typeof profilePicture !== "string") {
    return "";
  }

  const image = profilePicture.trim();

  if (!image) {
    return "";
  }

  // Already a complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:image/")
  ) {
    return image;
  }

  // Backend API URL
  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  /*
   * Remove /api/v1 from the API URL because uploaded
   * files normally live at the backend root.
   */
  const backendUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

  // If image starts with /
  if (image.startsWith("/")) {
    return `${backendUrl}${image}`;
  }

  return `${backendUrl}/${image}`;
};

// =====================================================
// Avatar Component
// =====================================================

function Avatar({
  name,
  image,
  className = "",
}) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = getProfilePictureUrl(image);

  // Reset image error if image changes
  useEffect(() => {
    setImageError(false);
  }, [image]);

  if (imageUrl && !imageError) {
    return (
      <img
        src={imageUrl}
        alt={name || "Patient"}
        onError={() => setImageError(true)}
        className={`h-12 w-12 flex-shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  const initials = (name || "P")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB] text-sm font-bold text-[#F33B7D] ${className}`}
    >
      {initials}
    </div>
  );
}

// =====================================================
// Message Preview
// =====================================================

function MessagePreview({
  message,
  sender,
}) {
  if (!message) {
    return "No messages yet";
  }

  const truncated =
    message.length > 60
      ? message.substring(0, 60) + "..."
      : message;

  if (sender?.role === "doctor") {
    return `You: ${truncated}`;
  }

  return truncated;
}

// =====================================================
// Doctor Messages
// =====================================================

export default function DoctorMessages() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ===================================================
  // Fetch conversations
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getConversations();

        console.log(
          "DOCTOR CONVERSATIONS:",
          data
        );

        if (!cancelled) {
          setConversations(
            Array.isArray(data) ? data : []
          );
        }
      } catch (err) {
        console.error(
          "Failed to load conversations:",
          err
        );

        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Failed to load conversations. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchConversations();

    return () => {
      cancelled = true;
    };
  }, []);

  // ===================================================
  // Filter conversations
  // ===================================================

  const filteredConversations =
    conversations.filter((chat) => {
      const name =
        chat?.otherParticipant?.fullName ||
        chat?.otherParticipant?.name ||
        "Patient";

      const matchesSearch = name
        .toLowerCase()
        .includes(search.toLowerCase());

      if (filter === "unread") {
        return (
          matchesSearch &&
          (chat?.unreadCount || 0) > 0
        );
      }

      if (filter === "read") {
        return (
          matchesSearch &&
          (chat?.unreadCount || 0) === 0
        );
      }

      return matchesSearch;
    });

  // ===================================================
  // Unread count
  // ===================================================

  const unreadCount = conversations.reduce(
    (total, chat) => {
      return total + (chat?.unreadCount || 0);
    },
    0
  );

  // ===================================================
  // Render
  // ===================================================

  return (
    <DoctorLayout
      title="Messages"
      subtitle="View and manage your patient conversations."
      showSearch={false}
    >
      <div className="mx-auto max-w-3xl">

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-3 gap-3">

          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <p className="text-xs text-[#8F8C8C]">
              Total
            </p>

            <p className="text-xl font-bold text-[#0D0D0D]">
              {conversations.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <p className="text-xs text-[#8F8C8C]">
              Unread
            </p>

            <p className="text-xl font-bold text-[#F33B7D]">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <p className="text-xs text-[#8F8C8C]">
              Active
            </p>

            <p className="text-xl font-bold text-green-600">
              {
                conversations.filter(
                  (c) => c?.lastMessageAt
                ).length
              }
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-5 space-y-3">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search patients..."
              className="w-full rounded-2xl border border-[#F0DCE4] bg-white py-3 pl-10 pr-4 text-sm text-[#0D0D0D] outline-none transition focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              {
                key: "all",
                label: "All",
              },
              {
                key: "unread",
                label: "Unread",
                badge: unreadCount,
              },
              {
                key: "read",
                label: "Read",
              },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() =>
                  setFilter(f.key)
                }
                className={`relative rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
                  filter === f.key
                    ? "bg-[#F33B7D] text-white shadow-[0_4px_12px_rgba(243,59,125,0.3)]"
                    : "bg-white text-[#8F8C8C] ring-1 ring-black/5 hover:ring-[#F33B7D]/30"
                }`}
              >
                {f.label}

                {f.badge > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {f.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#FEE4EB] border-t-[#F33B7D]" />

              <p className="mt-4 text-sm font-medium text-[#4A4A4A]">
                Loading conversations...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-red-400" />

            <p className="mt-4 text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 rounded-full bg-[#F33B7D] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(243,59,125,0.3)] transition hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredConversations.length === 0 && (
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FEE4EB]">
                  <MessageCircle className="h-10 w-10 text-[#F33B7D]" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-[#0D0D0D]">
                  No conversations found
                </h2>

                <p className="mt-2 text-sm text-[#8F8C8C]">
                  {search
                    ? "No patients match your search."
                    : "You don't have any conversations yet."}
                </p>
              </div>
            </div>
          )}

        {/* Conversations */}
        {!loading &&
          !error &&
          filteredConversations.length > 0 && (
            <div className="space-y-3">

              {filteredConversations.map(
                (chat) => {
                  const patient =
                    chat?.otherParticipant || {};

                  const patientName =
                    patient.fullName ||
                    patient.name ||
                    "Patient";

                  const lastMessage =
                    chat?.lastMessage?.message ||
                    "No messages yet";

                  const unreadCount =
                    chat?.unreadCount || 0;

                  const patientPicture =
                    patient.profilePicture ||
                    patient.avatar ||
                    patient.profile?.profilePicture ||
                    "";

                  return (
                    <button
                      key={chat._id}
                      onClick={() =>
                        navigate(
                          `/doctor/messages/${chat._id}`
                        )
                      }
                      className="group flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(243,59,125,0.1)]"
                    >

                      {/* Patient Avatar */}
                      <Avatar
                        name={patientName}
                        image={patientPicture}
                        className={
                          unreadCount > 0
                            ? "ring-2 ring-[#F33B7D]"
                            : ""
                        }
                      />

                      {/* Content */}
                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-3">

                          <div className="flex items-center gap-2">

                            <h3
                              className={`truncate text-sm font-semibold ${
                                unreadCount > 0
                                  ? "text-[#0D0D0D]"
                                  : "text-[#4A4A4A]"
                              }`}
                            >
                              {patientName}
                            </h3>

                            {unreadCount > 0 && (
                              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F33B7D] px-1.5 text-[10px] font-bold text-white">
                                {unreadCount}
                              </span>
                            )}
                          </div>

                          {(chat?.lastMessageAt ||
                            chat?.lastMessage?.createdAt) && (
                            <span className="flex-shrink-0 text-[11px] text-[#8F8C8C]">
                              {formatMessageTime(
                                chat?.lastMessageAt ||
                                  chat?.lastMessage
                                    ?.createdAt
                              )}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center justify-between">

                          <p
                            className={`truncate text-sm ${
                              unreadCount > 0
                                ? "font-semibold text-[#4A4A4A]"
                                : "text-[#8F8C8C]"
                            }`}
                          >
                            <MessagePreview
                              message={lastMessage}
                              sender={
                                chat?.lastMessage
                                  ?.sender
                              }
                            />
                          </p>

                          <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0 text-[#8F8C8C] transition group-hover:text-[#F33B7D]" />
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}
      </div>
    </DoctorLayout>
  );
}