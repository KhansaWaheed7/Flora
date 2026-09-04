import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Paperclip, FileText, X, Loader2 } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import {
  getMyRequests,
  getChatMessages,
  sendChatAttachment,
  getChatAttachment,
} from "../../services/chat.service";

function Avatar({ name, image, size = "h-9 w-9" }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${size} flex-shrink-0 rounded-full object-cover`}
      />
    );
  }
  const initials = (name || "Dr")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-xs font-semibold text-white`}
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

export default function ChatWithDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const { user } = useAuth();
const currentUserId = getUserId(user);

  const [consultation, setConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
const [uploading, setUploading] = useState(false);

const fileInputRef = useRef(null);
  const [otherTyping, setOtherTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingAttachment, setOpeningAttachment] = useState(null);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getMyRequests();
        const found = list.find((c) => c._id === id);
        if (!found) {
          setError("Consultation not found.");
          setLoading(false);
          return;
        }
        setConsultation(found);

        try {
          const history = await getChatMessages(id);
          setMessages(history || []);
        } catch (err) {
          setMessages([]);
        }
      } catch (err) {
        setError("Could not load this consultation.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!socket || !connected) return;

    socket.emit("join-chat", id);
    socket.emit("mark-read", { chatId: id });

    const handleNewMessage = (message) => {
  if (message.chat === id || message.chatId === id) {
    setMessages((prev) => [...prev, message]);

    // Tell backend that this message reached the receiver
    if (message._id) {
      socket.emit("message-delivered", {
        messageId: message._id,
      });
    }

    // Since this chat is currently open, mark it as read
    socket.emit("mark-read", {
      chatId: id,
    });
  }
};

    const handleTyping = ({ userId }) => {
      if (userId !== user?._id) setOtherTyping(true);
    };

    const handleStopTyping = () => setOtherTyping(false);

    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
    };
  }, [socket, connected, id, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherTyping]);

  const handleDraftChange = (e) => {
    setDraft(e.target.value);
    if (!socket) return;
    socket.emit("typing", { chatId: id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { chatId: id });
    }, 1500);
  };

const handleFileSelect = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setSelectedFile(file);

  // Allow selecting the same file again later
  e.target.value = "";
};

const isImageAttachment = (message) => {
  const mimeType = message?.attachment?.mimeType || "";
  const fileName = message?.attachment?.originalName || "";

  return (
    mimeType.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp)$/i.test(fileName)
  );
};

const handleOpenAttachment = async (message) => {
  const newTab = window.open("", "_blank");

  if (!newTab) {
    setError(
      "The attachment could not be opened. Please allow pop-ups for this site."
    );
    return;
  }

  newTab.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Opening attachment...</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fffbfc;
            font-family: Arial, sans-serif;
          }

          .container {
            text-align: center;
            color: #3d3939;
          }

          .spinner {
            width: 42px;
            height: 42px;
            margin: 0 auto 18px;
            border: 4px solid #f7d9e5;
            border-top-color: #f33b7d;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          .title {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 6px;
          }

          .subtitle {
            font-size: 12px;
            color: #8f8c8c;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="spinner"></div>

          <div class="title">
            Opening attachment...
          </div>

          <div class="subtitle">
            Please wait while your file is being prepared.
          </div>
        </div>
      </body>
    </html>
  `);

  newTab.document.close();

  try {
    setOpeningAttachment(message._id);
    setError("");

    const blob = await getChatAttachment(
      id,
      message._id
    );

    const blobUrl = URL.createObjectURL(blob);

    newTab.location.href = blobUrl;

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 60000);
  } catch (err) {
    console.error("Failed to open attachment:", err);

    newTab.document.body.innerHTML = `
      <div style="
        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        font-family:Arial,sans-serif;
        background:#fffbfc;
      ">
        <div style="
          text-align:center;
          padding:30px;
        ">
          <div style="
            font-size:16px;
            font-weight:600;
            color:#dc2626;
            margin-bottom:8px;
          ">
            Failed to open attachment
          </div>

          <div style="
            font-size:13px;
            color:#8f8c8c;
          ">
            Please close this tab and try again.
          </div>
        </div>
      </div>
    `;

    setError(
      err?.response?.data?.message ||
        "Failed to open attachment."
    );
  } finally {
    setOpeningAttachment(null);
  }
};

  const handleSend = async (e) => {
  e.preventDefault();

  if (uploading) return;

  // Attachment message
  if (selectedFile) {
    try {
      setUploading(true);

      const newMessage = await sendChatAttachment(
        id,
        selectedFile,
        draft.trim()
      );

      setMessages((prev) => [...prev, newMessage]);

      setSelectedFile(null);
      setDraft("");

      if (socket) {
        socket.emit("stop-typing", { chatId: id });
      }
    } catch (err) {
      console.error("Attachment upload failed:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to upload attachment."
      );
    } finally {
      setUploading(false);
    }

    return;
  }

  // Normal text message
  if (!draft.trim() || !socket) return;

  socket.emit("send-message", {
    chatId: id,
    message: draft.trim(),
  });

  setDraft("");

  socket.emit("stop-typing", {
    chatId: id,
  });
};

  if (loading) {
    return (
      <PageLayout title="Chat" backTo="/chat/my-consultations">
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  if (error || !consultation) {
    return (
      <PageLayout title="Chat" backTo="/chat/my-consultations">
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "Consultation not found."}
        </div>
      </PageLayout>
    );
  }

  const doctor = consultation.doctor;
  const isClosed = consultation.status === "closed";

  return (
    <PageLayout title="Chat with Doctor" backTo="/chat/my-consultations">
      <div className="mx-auto flex h-[70vh] max-w-2xl flex-col rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <div className="flex items-center gap-3 border-b border-[#F7DCE4] p-4">
          <Avatar name={doctor?.fullName} image={doctor?.profilePicture} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#0D0D0D]">
              Dr. {doctor?.fullName}
            </p>
            <p className="text-xs text-[#8F8C8C]">
              {otherTyping ? "Typing..." : doctor?.specialization}
            </p>
          </div>
          {!connected && (
            <span className="text-[10px] font-semibold text-amber-600">
              Connecting...
            </span>
          )}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-center text-xs text-[#B8AEB2]">
              No messages yet. Say hello!
            </p>
          )}
          {messages.map((m) => {
  const senderId = (
    m.sender?._id ||
    m.sender?.id ||
    m.sender
  )?.toString();

  const isMine =
    senderId === currentUserId;

  const isLoadingAttachment = openingAttachment === m._id;

  return (
    <div
      key={m._id}
      className={`flex ${
        isMine
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
          isMine
            ? "bg-[#F33B7D] text-white"
            : "bg-[#FFF1F6] text-[#3D3939] border border-[#F7D9E5]"
        }`}
      >
        {m.attachment && (
  <button
    type="button"
    onClick={() => handleOpenAttachment(m)}
    disabled={isLoadingAttachment}
    className={`mb-1 flex w-full items-center gap-2 rounded-xl p-2 text-left transition ${
      isMine
        ? "bg-white/10 hover:bg-white/20"
        : "bg-white hover:bg-[#FFF8FA]"
    } ${isLoadingAttachment ? "cursor-wait opacity-70" : ""}`}
  >
    {isLoadingAttachment ? (
      <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin text-[#F33B7D]" />
    ) : (
      <FileText
        className={`h-5 w-5 flex-shrink-0 ${
          isMine ? "text-white" : "text-[#F33B7D]"
        }`}
      />
    )}

    <div className="min-w-0 flex-1">
      <p
        className={`truncate text-xs font-medium ${
          isMine ? "text-white" : "text-[#3D3939]"
        }`}
      >
        {isLoadingAttachment ? "Opening..." : m.attachment.originalName}
      </p>

      <p
        className={`text-[10px] ${
          isMine ? "text-white/70" : "text-[#B8AEB2]"
        }`}
      >
        {m.attachment.size
          ? `${(m.attachment.size / 1024).toFixed(1)} KB`
          : "Attachment"}
      </p>
    </div>
  </button>
)}

{m.message && (
  <p className="whitespace-pre-wrap break-words">
    {m.message}
  </p>
)}

        <p
          className={`mt-1 text-[10px] ${
            isMine
              ? "text-white/70"
              : "text-[#B8AEB2]"
          }`}
        >
          {formatTime(m.createdAt)}
        </p>
      </div>
    </div>
  );
})}
          <div ref={bottomRef} />
        </div>

        {isClosed ? (
          <div className="border-t border-[#F7DCE4] p-4 text-center text-xs text-[#8F8C8C]">
            This consultation has been closed.
          </div>
        ) : (
          <form
            onSubmit={handleSend}
            className="relative flex items-center gap-2 border-t border-[#F7DCE4] p-3"
          >
            {selectedFile && (
              <div className="absolute bottom-full left-0 right-0 border-t border-[#F7DCE4] bg-white px-3 py-2">
                <div className="flex items-center gap-2 rounded-xl bg-[#FFF1F6] px-3 py-2">
                  <FileText className="h-4 w-4 flex-shrink-0 text-[#F33B7D]" />
                  <span className="min-w-0 flex-1 truncate text-xs text-[#3D3939]">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-[#8F8C8C] hover:text-[#F33B7D]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[#8F8C8C] hover:bg-[#FEF4F4] disabled:opacity-40"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.webp,.mp3,.wav,.ogg"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              value={draft}
              onChange={handleDraftChange}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-[#F0DCE4] bg-[#FEFAFB] px-4 py-2.5 text-sm outline-none focus:border-[#F33B7D]"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-white transition hover:-translate-y-0.5 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </PageLayout>
  );
}