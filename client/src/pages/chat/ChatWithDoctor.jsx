import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Send,
  Paperclip,
  FileText,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

import {
  getMyRequests,
  getChatMessages,
  sendChatAttachment,
  getChatAttachment,
} from "../../services/chat.service";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function Avatar({ name, image, size = "h-9 w-9" }) {
  const initials =
    name
      ?.split(" ")
      .map((word) => word?.[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div
      className={`${size} rounded-full overflow-hidden flex-shrink-0 bg-[#F33B7D] flex items-center justify-center text-white font-semibold ring-2 ring-[#FDE4EE]`}
    >
      {image ? (
        <img
          src={image}
          alt={name || "User"}
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
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

  if (value.userId) {
    return value.userId.toString();
  }

  return null;
}

function isSameUser(first, second) {
  const firstId = getUserId(first);
  const secondId = getUserId(second);

  if (!firstId || !secondId) {
    return false;
  }

  return firstId.toString() === secondId.toString();
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function ChatWithDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { socket, connected } = useSocket();
  const { user } = useAuth();

  const [consultation, setConsultation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [openingAttachment, setOpeningAttachment] =
    useState(null);

  const [otherTyping, setOtherTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // --------------------------------------------------
  // Load consultation and messages
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadChat = async () => {
      try {
        setLoading(true);

        const list = await getMyRequests();

        if (!mounted) return;

        const found = list?.find(
          (item) =>
            item?._id?.toString() === id?.toString()
        );

        if (!found) {
          setConsultation(null);
          setMessages([]);
          return;
        }

        setConsultation(found);

        const history = await getChatMessages(id);

        if (!mounted) return;

        setMessages(history || []);
      } catch (error) {
        console.error("Failed to load chat:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadChat();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  // --------------------------------------------------
  // Scroll to bottom
  // --------------------------------------------------

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  }, [messages]);

  // --------------------------------------------------
  // Socket
  // --------------------------------------------------

  useEffect(() => {
    if (!socket || !connected || !id) {
      return;
    }

    socket.emit("join-chat", id);

    socket.emit("mark-read", {
      chatId: id,
    });

    const handleNewMessage = (message) => {
      if (!message) return;

      const messageChatId =
        message.chat?._id ||
        message.chat?.id ||
        message.chat ||
        message.chatId;

      if (
        messageChatId?.toString() !== id?.toString()
      ) {
        return;
      }

      setMessages((prev) => {
        if (
          message._id &&
          prev.some(
            (existing) =>
              existing?._id?.toString() ===
              message._id?.toString()
          )
        ) {
          return prev;
        }

        return [...prev, message];
      });

      if (message._id) {
        socket.emit("message-delivered", {
          messageId: message._id,
        });
      }

      socket.emit("mark-read", {
        chatId: id,
      });
    };

    const handleTyping = ({ userId }) => {
      const typingUserId = getUserId(userId);
      const currentUserId = getUserId(user);

      if (
        typingUserId &&
        currentUserId &&
        typingUserId !== currentUserId
      ) {
        setOtherTyping(true);
      }
    };

    const handleStopTyping = ({ userId }) => {
      const typingUserId = getUserId(userId);
      const currentUserId = getUserId(user);

      if (
        !typingUserId ||
        !currentUserId ||
        typingUserId !== currentUserId
      ) {
        setOtherTyping(false);
      }
    };

    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleTyping);
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
        "user-typing",
        handleTyping
      );
      socket.off(
        "user-stop-typing",
        handleStopTyping
      );
    };
  }, [socket, connected, id, user]);

  // --------------------------------------------------
  // Typing
  // --------------------------------------------------

  const handleDraftChange = (event) => {
    const value = event.target.value;

    setDraft(value);

    if (!socket || !connected || !id) {
      return;
    }

    clearTimeout(typingTimeoutRef.current);

    if (value.trim()) {
      socket.emit("typing", {
        chatId: id,
      });

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", {
          chatId: id,
        });
      }, 1000);
    } else {
      socket.emit("stop-typing", {
        chatId: id,
      });
    }
  };

  // --------------------------------------------------
  // Send text message
  // --------------------------------------------------

  const handleSendMessage = () => {
    if (
      !draft.trim() ||
      !socket ||
      !connected ||
      sending
    ) {
      return;
    }

    const messageText = draft.trim();

    setDraft("");

    socket.emit("stop-typing", {
      chatId: id,
    });

    socket.emit("send-message", {
      chatId: id,
      message: messageText,
    });
  };

  // --------------------------------------------------
  // Enter to send
  // --------------------------------------------------

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // --------------------------------------------------
  // File selection
  // --------------------------------------------------

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  // --------------------------------------------------
  // Remove file
  // --------------------------------------------------

  const removeSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --------------------------------------------------
  // Send attachment
  // --------------------------------------------------

  const handleSendAttachment = async () => {
    if (!selectedFile || sending) {
      return;
    }

    try {
      setSending(true);

      const response = await sendChatAttachment(
        id,
        selectedFile
      );

      const newMessage =
        response?.data ||
        response?.message ||
        response;

      if (newMessage) {
        setMessages((prev) => {
          if (
            newMessage._id &&
            prev.some(
              (message) =>
                message?._id?.toString() ===
                newMessage._id?.toString()
            )
          ) {
            return prev;
          }

          return [...prev, newMessage];
        });
      }

      removeSelectedFile();
    } catch (error) {
      console.error(
        "Failed to send attachment:",
        error
      );
    } finally {
      setSending(false);
    }
  };

  // --------------------------------------------------
  // Open attachment
  // --------------------------------------------------

  const handleOpenAttachment = async (message) => {
    if (!message?._id) return;

    try {
      setOpeningAttachment(message._id);

      const blob = await getChatAttachment(
        message._id
      );

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      console.error(
        "Failed to open attachment:",
        error
      );
    } finally {
      setOpeningAttachment(null);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <PageLayout
        title="Chat"
        subtitle="Loading conversation..."
      >
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2
            className="animate-spin text-[#F33B7D]"
            size={32}
          />
        </div>
      </PageLayout>
    );
  }

  // --------------------------------------------------
  // Consultation not found
  // --------------------------------------------------

  if (!consultation) {
    return (
      <PageLayout
        title="Chat"
        subtitle="Consultation"
      >
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <p className="text-gray-600 mb-4">
            Consultation not found.
          </p>

          <button
            onClick={() => navigate("/chat")}
            className="px-5 py-2 rounded-lg bg-[#F33B7D] text-white hover:bg-[#E83270]"
          >
            Back to Chat
          </button>
        </div>
      </PageLayout>
    );
  }

  // --------------------------------------------------
  // Doctor
  // --------------------------------------------------

  const doctor = consultation.doctor;

  const doctorName =
    doctor?.fullName ||
    doctor?.name ||
    "Doctor";

  const doctorImage =
    doctor?.profilePicture ||
    doctor?.profileImage ||
    doctor?.avatar;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <PageLayout
      title="Chat"
      subtitle="Talk to your doctor"
    >
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Single unified card: header + messages + input */}
        <div className="bg-white border border-[#F4DCE6] rounded-2xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F4DCE6] bg-[#FFF9FB]">

            <button
              onClick={() => navigate("/chat")}
              className="group flex items-center gap-1.5 rounded-full border border-[#F4DCE6] bg-white px-3 py-2 text-sm font-medium text-[#3D3939] shadow-sm transition hover:border-[#F33B7D] hover:bg-[#FFF1F6] hover:text-[#F33B7D] active:scale-95"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />

            </button>

            {/* Clickable doctor: avatar + name → profile */}
            <button
              type="button"
              onClick={() =>
                navigate(`/chat/${id}/doctor-profile`)
              }
              className="group flex items-center gap-3 rounded-xl -mx-2 px-2 py-1.5 text-left transition hover:bg-[#FFF1F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F33B7D]/40 active:scale-[0.98]"
              title="View doctor profile"
            >
              <Avatar
                name={doctorName}
                image={doctorImage}
                size="h-11 w-11"
              />

              <div>
                <h2 className="font-semibold text-[#2F292B] transition group-hover:text-[#F33B7D]">
                  {doctorName}
                </h2>

                <p className="text-xs text-gray-500">
                  {doctor?.specialization ||
                    "Gynecologist"}
                </p>
              </div>
            </button>

          </div>

          {/* Messages */}
          <div className="h-[60vh] overflow-y-auto px-5 py-5 bg-[#FFF9FB]">

            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-[#FDE4EE] flex items-center justify-center">
                    <Send
                      size={24}
                      className="text-[#F33B7D]"
                    />
                  </div>

                  <p className="font-medium text-[#3D3939]">
                    Start your conversation
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Send a message to your doctor.
                  </p>

                </div>

              </div>
            ) : (
              <div className="space-y-3">

                {messages.map((message) => {

                  // ==================================================
                  // IMPORTANT FIX
                  // ==================================================
                  //
                  // This page is PATIENT -> DOCTOR.
                  //
                  // If the sender is the doctor:
                  //     LEFT + LIGHT PINK
                  //
                  // Otherwise:
                  //     RIGHT + DARK PINK
                  //
                  // We do NOT rely on the patient's auth ID.
                  // ==================================================

                  const senderRole = (
                    message.sender?.role || ""
                  )
                    .toString()
                    .toLowerCase();

                  const isDoctorMessage =
                    isSameUser(
                      message.sender,
                      doctor
                    ) ||
                    senderRole === "doctor";

                  const isMine =
                    !isDoctorMessage;

                  const isLoadingAttachment =
                    openingAttachment ===
                    message._id;

                  const isSystemMessage =
                    message.messageType ===
                    "system";

                  // ------------------------------------------------
                  // System message
                  // ------------------------------------------------

                  if (isSystemMessage) {
                    return (
                      <div
                        key={message._id}
                        className="flex justify-center my-4"
                      >
                        <div className="bg-[#FDECF3] text-[#8C6B77] text-xs px-4 py-2 rounded-full">
                          {message.message ||
                            "System message"}
                        </div>
                      </div>
                    );
                  }

                  // ------------------------------------------------
                  // Normal message
                  // ------------------------------------------------

                  return (
                    <div
                      key={message._id}
                      className={`flex w-full ${
                        isMine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          isMine
                            ? "bg-[#F33B7D] text-white rounded-br-md"
                            : "bg-[#FFF1F6] text-[#3D3939] border border-[#F7D9E5] rounded-bl-md"
                        }`}
                      >

                        {/* Attachment */}
                        {message.messageType !==
                          "text" &&
                          message.attachment && (
                            <button
                              onClick={() =>
                                handleOpenAttachment(
                                  message
                                )
                              }
                              disabled={
                                isLoadingAttachment
                              }
                              className={`flex items-center gap-2 mb-2 p-2 rounded-lg w-full text-left ${
                                isMine
                                  ? "bg-white/15 hover:bg-white/20"
                                  : "bg-white hover:bg-[#FDE4EE]"
                              }`}
                            >

                              {isLoadingAttachment ? (
                                <Loader2
                                  size={18}
                                  className="animate-spin"
                                />
                              ) : (
                                <FileText
                                  size={18}
                                />
                              )}

                              <span className="truncate">
                                {message.attachment
                                  ?.originalName ||
                                  "Attachment"}
                              </span>

                            </button>
                          )}

                        {/* Message */}
                        {message.message && (
                          <p className="whitespace-pre-wrap break-words">
                            {message.message}
                          </p>
                        )}

                        {/* Time */}
                        <div
                          className={`text-[10px] mt-1 ${
                            isMine
                              ? "text-white/75"
                              : "text-gray-400"
                          }`}
                        >
                          {formatTime(
                            message.createdAt
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}

                {/* Typing */}
                {otherTyping && (
                  <div className="flex justify-start">

                    <div className="bg-[#FFF1F6] border border-[#F7D9E5] rounded-2xl rounded-bl-md px-4 py-2">

                      <div className="flex items-center gap-1">

                        <span className="h-1.5 w-1.5 bg-[#D99AAF] rounded-full animate-bounce" />

                        <span
                          className="h-1.5 w-1.5 bg-[#D99AAF] rounded-full animate-bounce"
                          style={{
                            animationDelay:
                              "0.15s",
                          }}
                        />

                        <span
                          className="h-1.5 w-1.5 bg-[#D99AAF] rounded-full animate-bounce"
                          style={{
                            animationDelay:
                              "0.3s",
                          }}
                        />

                      </div>

                    </div>

                  </div>
                )}

                <div ref={messagesEndRef} />

              </div>
            )}

          </div>

          {/* Selected file */}
          {selectedFile && (
            <div className="px-4 pt-3">

              <div className="flex items-center justify-between bg-[#FFF1F6] border border-[#F7D9E5] rounded-xl px-3 py-2">

                <div className="flex items-center gap-2 min-w-0">

                  <FileText
                    size={18}
                    className="text-[#F33B7D] flex-shrink-0"
                  />

                  <span className="text-sm text-[#3D3939] truncate">
                    {selectedFile.name}
                  </span>

                </div>

                <button
                  onClick={removeSelectedFile}
                  className="text-gray-400 hover:text-[#F33B7D]"
                >
                  <X size={18} />
                </button>

              </div>

            </div>
          )}

          {/* Input */}
          <div className="border-t border-[#F4DCE6] p-4">

            <div className="flex items-end gap-2">

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="h-11 w-11 flex-shrink-0 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#F33B7D] hover:bg-[#FFF1F6] transition"
              >
                <Paperclip size={20} />
              </button>

              <textarea
                value={draft}
                onChange={handleDraftChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-[#EBD5DE] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F33B7D]/20 focus:border-[#F33B7D]"
              />

              {selectedFile ? (
                <button
                  type="button"
                  onClick={handleSendAttachment}
                  disabled={sending}
                  className="h-11 w-11 flex-shrink-0 rounded-xl bg-[#F33B7D] text-white flex items-center justify-center hover:bg-[#E83270] disabled:opacity-50 transition"
                >
                  {sending ? (
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={
                    !draft.trim() ||
                    !connected ||
                    sending
                  }
                  className="h-11 w-11 flex-shrink-0 rounded-xl bg-[#F33B7D] text-white flex items-center justify-center hover:bg-[#E83270] disabled:opacity-50 transition"
                >
                  <Send size={20} />
                </button>
              )}

            </div>

            <p className="text-[10px] text-gray-400 mt-2 px-1">
              Press Enter to send • Shift + Enter for
              a new line
            </p>

          </div>

        </div>
      </div>
    </PageLayout>
  );
}