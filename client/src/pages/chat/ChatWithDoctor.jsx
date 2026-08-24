import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Paperclip } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { getMyRequests, getChatMessages } from "../../services/chat.service";

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

  const [consultation, setConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        socket.emit("mark-read", { chatId: id });
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

  const handleSend = (e) => {
    e.preventDefault();
    if (!draft.trim() || !socket) return;
    socket.emit("send-message", { chatId: id, message: draft.trim() });
    setDraft("");
    socket.emit("stop-typing", { chatId: id });
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
            const isMine =
              (m.sender?._id || m.sender) === user?._id ||
              (m.sender?._id || m.sender) === user?.id;
            return (
              <div
                key={m._id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isMine
                      ? "bg-[#F33B7D] text-white"
                      : "bg-[#FEF4F4] text-[#3D3939]"
                  }`}
                >
                  <p>{m.message}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMine ? "text-white/70" : "text-[#B8AEB2]"
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
            className="flex items-center gap-2 border-t border-[#F7DCE4] p-3"
          >
            <button
              type="button"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[#8F8C8C] hover:bg-[#FEF4F4]"
            >
              <Paperclip className="h-4 w-4" />
            </button>
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
