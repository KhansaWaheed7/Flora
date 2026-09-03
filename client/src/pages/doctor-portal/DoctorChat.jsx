import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

import DoctorLayout from "../../layouts/DoctorLayout";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

import { getConversations } from "../../services/doctorPortal.service";
import { getChatMessages } from "../../services/chat.service";

function Avatar({ name, image, size = "h-11 w-11" }) {
  const [imageError, setImageError] = useState(false);

  const initials = (name || "P")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (image && !imageError) {
    return (
      <img
        src={image}
        alt={name || "Patient"}
        onError={() => setImageError(true)}
        className={`${size} flex-shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${size} flex-shrink-0 rounded-full bg-[#F33B7D] flex items-center justify-center text-sm font-semibold text-white`}
    >
      {initials}
    </div>
  );
}

function getUserId(value) {
  if (!value) return null;

  if (typeof value === "string") {
    return value.toString();
  }

  if (value._id) {
    return value._id.toString();
  }

  if (value.id) {
    return value.id.toString();
  }

  return null;
}

function formatTime(value) {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}



export default function DoctorChat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { socket, connected } = useSocket();
  const { user } = useAuth();
  const currentUserId = getUserId(user);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // =========================================
  // Load Conversation + Messages
  // =========================================

  useEffect(() => {
    const loadChat = async () => {
      try {
        setLoading(true);
        setError("");

        const conversations = await getConversations();

        const found = conversations.find(
          (chat) => chat._id === id
        );

        if (!found) {
          setError("Consultation not found.");
          return;
        }

        setConversation(found);

        const history = await getChatMessages(id);

        setMessages(history || []);
      } catch (err) {
        console.error("Doctor chat loading error:", err);

        setError(
          err?.response?.data?.message ||
            "Could not load this consultation."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadChat();
    }
  }, [id]);

  // =========================================
  // Socket Events
  // =========================================

  useEffect(() => {
    if (!socket || !connected || !id) return;

    // Join this consultation room
    socket.emit("join-chat", id);

    // Existing unread messages are now being viewed
    socket.emit("mark-read", {
      chatId: id,
    });

    // -----------------------------------------
    // New Message
    // -----------------------------------------

    const handleNewMessage = (message) => {
  const messageChatId =
    message.chat?._id ||
    message.chat?.id ||
    message.chatId ||
    message.chat;

  if (messageChatId?.toString() !== id.toString()) {
    return;
  }

  console.log("📩 Doctor received message:", message);

  setMessages((prev) => {
    const alreadyExists = prev.some(
      (item) => item._id === message._id
    );

    if (alreadyExists) {
      return prev;
    }

    return [...prev, message];
  });

  const senderId = getUserId(message.sender);
  const currentUserIdNormalized = getUserId(user);

  const isFromPatient =
    senderId !== null &&
    currentUserIdNormalized !== null &&
    senderId !== currentUserIdNormalized;

  // Message reached doctor
  if (message._id && isFromPatient) {
    console.log(
      "📦 Sending delivery acknowledgement:",
      message._id
    );

    socket.emit("message-delivered", {
      messageId: message._id,
    });
  }

  // Chat is open, so mark messages as read
  socket.emit("mark-read", {
    chatId: id,
  });
};

    // -----------------------------------------
    // Message Delivered
    // -----------------------------------------

    const handleMessageDelivered = (data) => {
      if (
        data?.chatId?.toString() !== id.toString()
      ) {
        return;
      }

      setMessages((prev) =>
        prev.map((message) =>
          message._id === data.messageId
            ? {
                ...message,
                isDelivered: true,
                deliveredAt: data.deliveredAt,
              }
            : message
        )
      );
    };

    // -----------------------------------------
    // Messages Read
    // -----------------------------------------

    const handleMessagesRead = (data) => {
      if (
        data?.chatId?.toString() !== id.toString()
      ) {
        return;
      }

      setMessages((prev) =>
        prev.map((message) => {
          const senderId =
            message.sender?._id ||
            message.sender?.id ||
            message.sender;

          const isMine =
            senderId?.toString() ===
            currentUserId?.toString();

          if (isMine) {
            return {
              ...message,
              isRead: true,
              readAt: new Date().toISOString(),
            };
          }

          return message;
        })
      );
    };

    // -----------------------------------------
    // Typing
    // -----------------------------------------

   const handleTyping = ({ userId }) => {
  const typingUserId = getUserId(userId);
  const myUserId = getUserId(user);

  if (
    typingUserId &&
    myUserId &&
    typingUserId !== myUserId
  ) {
    setOtherTyping(true);
  }
};

    const handleStopTyping = () => {
      setOtherTyping(false);
    };

    socket.on(
      "new-message",
      handleNewMessage
    );

    socket.on(
      "message-delivered",
      handleMessageDelivered
    );

    socket.on(
      "messages-read",
      handleMessagesRead
    );

    socket.on(
      "user-typing",
      handleTyping
    );

    socket.on(
      "user-stop-typing",
      handleStopTyping
    );

    return () => {
      socket.off(
        "new-message",
        handleNewMessage
      );

      socket.off(
        "message-delivered",
        handleMessageDelivered
      );

      socket.off(
        "messages-read",
        handleMessagesRead
      );

      socket.off(
        "user-typing",
        handleTyping
      );

      socket.off(
        "user-stop-typing",
        handleStopTyping
      );

      clearTimeout(
        typingTimeoutRef.current
      );
    };
  }, [
    socket,
    connected,
    id,
    user?._id,
    currentUserId
  ]);

  // =========================================
  // Scroll To Bottom
  // =========================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, otherTyping]);

  // =========================================
  // Typing
  // =========================================

  const handleDraftChange = (e) => {
    const value = e.target.value;

    setDraft(value);

    if (!socket || !id) return;

    socket.emit("typing", {
      chatId: id,
    });

    clearTimeout(
      typingTimeoutRef.current
    );

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        chatId: id,
      });
    }, 1500);
  };

  // =========================================
  // Send Message
  // =========================================

  const handleSend = (e) => {
    e.preventDefault();

    if (!draft.trim() || !socket || !connected) {
      return;
    }

    socket.emit("send-message", {
      chatId: id,
      message: draft.trim(),
    });

    setDraft("");

    socket.emit("stop-typing", {
      chatId: id,
    });
  };

  // =========================================
  // Loading
  // =========================================

  if (loading) {
    return (
      <DoctorLayout
        title="Patient Chat"
        subtitle="Loading consultation..."
        showSearch={false}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[#8F8C8C]">
            Loading conversation...
          </p>
        </div>
      </DoctorLayout>
    );
  }

  // =========================================
  // Error
  // =========================================

  if (error || !conversation) {
    return (
      <DoctorLayout
        title="Patient Chat"
        subtitle="Consultation"
        showSearch={false}
      >
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-sm text-red-600">
            {error || "Consultation not found."}
          </p>

          <button
            onClick={() =>
              navigate("/doctor/active-patients")
            }
            className="mt-5 rounded-full bg-[#F33B7D] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Active Patients
          </button>
        </div>
      </DoctorLayout>
    );
  }

  const patient =
    conversation.otherParticipant;

  return (
    <DoctorLayout
      title="Patient Chat"
      subtitle="Continue your consultation."
      showSearch={false}
    >
      <div className="mx-auto flex h-[72vh] max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">

        {/* =====================================
            Header
        ===================================== */}

        <div className="flex items-center gap-4 border-b border-[#F0DCE4] bg-white px-5 py-4">

          <button
            onClick={() =>
              navigate("/doctor/active-patients")
            }
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#8F8C8C] transition hover:bg-[#FFF1F6] hover:text-[#F33B7D]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <Avatar
            name={patient?.fullName}
            image={patient?.profilePicture}
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-[#0D0D0D]">
              {patient?.fullName || "Patient"}
            </p>

            <p className="mt-0.5 text-xs text-[#8F8C8C]">
              {otherTyping
                ? "Typing..."
                : connected
                ? "Online"
                : "Connecting..."}
            </p>
          </div>

          <span className="rounded-full bg-[#FFF1F6] px-3 py-1 text-[10px] font-semibold text-[#F33B7D]">
            Patient
          </span>

        </div>

        {/* =====================================
            Messages
        ===================================== */}

        <div className="flex-1 space-y-3 overflow-y-auto bg-[#FFFAFB] p-5">

          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-[#B8AEB2]">
                No messages yet.
              </p>
            </div>
          )}

          {messages.map((message) => {
  const senderId = getUserId(message.sender);

  const isMine =
    senderId !== null &&
    currentUserId !== null &&
    senderId === currentUserId;

  return (
    <div
      key={message._id}
      className={`flex ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
          isMine
            ? "rounded-br-md bg-[#F33B7D] text-white"
            : "rounded-bl-md bg-[#FFF1F6] text-[#3D3939] border border-[#F7D9E5]"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm">
          {message.message}
        </p>

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            isMine
              ? "text-white/75"
              : "text-[#B8AEB2]"
          }`}
        >
          <span>
            {formatTime(message.createdAt)}
          </span>

          {isMine && (
            <span className="font-semibold">
              {message.isRead
                ? "✓✓"
                : message.isDelivered
                ? "✓✓"
                : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
})}

          {otherTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-xs text-[#8F8C8C] ring-1 ring-[#F0DCE4]">
                Patient is typing...
              </div>
            </div>
          )}

          <div ref={bottomRef} />

        </div>

        {/* =====================================
            Composer
        ===================================== */}

        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 border-t border-[#F0DCE4] bg-white p-4"
        >

          <input
            value={draft}
            onChange={handleDraftChange}
            placeholder={
              connected
                ? "Type your message..."
                : "Connecting..."
            }
            disabled={!connected}
            className="flex-1 rounded-full border border-[#F0DCE4] bg-[#FFFAFB] px-4 py-3 text-sm text-[#3D3939] outline-none transition focus:border-[#F33B7D] disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={
              !draft.trim() ||
              !connected
            }
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-white shadow-[0_8px_18px_-5px_rgba(243,59,125,0.5)] transition hover:bg-[#E72E70] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>

        </form>

      </div>
    </DoctorLayout>
  );
}