// client/src/pages/gynae-assistant/GynaeConversationHistoryPage.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";

import {
  getGynaeHistory,
  deleteGynaeConversation,
} from "../../services/gynaeAssistant.service";

// Keep this as fallback for categories without titles
const categoryTitle = {
  missed_period: "Missed or Irregular Period",
  pelvic_pain: "Pelvic Pain",
  vaginal_discharge: "Vaginal Discharge",
  painful_period: "Painful Periods",
  abnormal_bleeding: "Abnormal Bleeding",
  urinary_symptoms: "Urinary Symptoms",
  general_menstrual_health: "General Menstrual Health",
  pregnancy_concern: "Pregnancy Concern",
  general_gynae: "General Gynecological Health",
  out_of_scope: "General Conversation",
};

const getRiskStyles = (riskLevel) => {
  if (riskLevel === "high") {
    return {
      text: "text-red-600",
      dot: "bg-red-500",
      label: "High Risk",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  }

  if (riskLevel === "medium") {
    return {
      text: "text-orange-500",
      dot: "bg-orange-400",
      label: "Medium Risk",
      bg: "bg-orange-50",
      border: "border-orange-200",
    };
  }

  if (riskLevel === "low") {
    return {
      text: "text-green-600",
      dot: "bg-green-500",
      label: "Low Risk",
      bg: "bg-green-50",
      border: "border-green-200",
    };
  }

  return {
    text: "text-[#8F8C8C]",
    dot: "bg-[#B8AEB2]",
    label: "No Risk Level",
    bg: "bg-gray-50",
    border: "border-gray-200",
  };
};

const formatDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTimeAgo = (value) => {
  if (!value) return "";

  const now = new Date();
  const date = new Date(value);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(value);
};

// Helper to get conversation display title
const getConversationDisplayTitle = (conversation) => {
  // Priority 1: Use the conversation title if it exists
  if (conversation.title) {
    return conversation.title;
  }
  
  // Priority 2: Use category title as fallback
  if (conversation.category && categoryTitle[conversation.category]) {
    return categoryTitle[conversation.category];
  }
  
  // Priority 3: Generate from first user message
  if (conversation.messages && conversation.messages.length > 0) {
    const firstUserMessage = conversation.messages.find(msg => msg.role === "user");
    if (firstUserMessage) {
      const content = firstUserMessage.content.trim();
      // Clean up common greetings
      const cleaned = content
        .replace(/^(hi|hello|hey|good morning|good afternoon|good evening)[\s,!.]*/i, '')
        .replace(/^flora[\s,!.]*/i, '')
        .trim();
      
      if (cleaned) {
        const title = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        return title.length > 50 ? title.substring(0, 50) + '...' : title;
      }
    }
  }
  
  // Final fallback
  return "Gynae Conversation";
};

export default function GynaeConversationHistoryPage() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Toast notification state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getGynaeHistory();

      setConversations(
        Array.isArray(result?.data) ? result.data : []
      );
    } catch (err) {
      console.error("Failed to load Gynae history:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to load your conversation history."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = useMemo(() => {
    if (filter === "all") {
      return conversations;
    }

    return conversations.filter(
      (conversation) => conversation.status === filter
    );
  }, [conversations, filter]);

  const handleDeleteClick = (e, conversation) => {
    e.stopPropagation();
    setSelectedConversation(conversation);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedConversation) return;

    try {
      setIsDeleting(true);
      await deleteGynaeConversation(selectedConversation._id);

      // Remove from state
      setConversations((prev) =>
        prev.filter((conv) => conv._id !== selectedConversation._id)
      );

      // Show success toast
      setToast({
        type: "success",
        message: "Conversation deleted successfully",
      });

      setShowDeleteModal(false);
      setSelectedConversation(null);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      setToast({
        type: "error",
        message: error?.response?.data?.message || "Failed to delete conversation",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedConversation(null);
  };

  const dismissToast = () => {
    setToast(null);
  };

  const getMessagePreview = (messages) => {
    if (!messages || messages.length === 0) return "No messages";
    
    const userMessages = messages.filter((msg) => msg.role === "user");
    if (userMessages.length === 0) return "No messages";
    
    const lastMessage = userMessages[userMessages.length - 1];
    const content = lastMessage?.content || "";
    
    if (content.length > 60) {
      return content.substring(0, 60) + "...";
    }
    return content;
  };

  const getMessageCount = (messages) => {
    if (!messages) return 0;
    return messages.filter((msg) => msg.role === "user").length;
  };

  return (
    <PageLayout
      title="Conversation History"
      subtitle="Review your previous conversations with Flora."
      backTo="/gynae-assistant"
    >
      <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`mb-4 flex items-center justify-between rounded-xl p-4 ${
              toast.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <span className="text-sm">{toast.message}</span>
            <button
              onClick={dismissToast}
              className="rounded-full p-1 hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TOP ACTIONS */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              ["all", `All (${conversations.length})`],
              ["active", `Active (${conversations.filter(c => c.status === "active").length})`],
              ["completed", `Completed (${conversations.filter(c => c.status === "completed").length})`],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  filter === value
                    ? "bg-[#F33B7D] text-white shadow-sm"
                    : "bg-[#FEF4F4] text-[#8F8C8C] hover:bg-[#FEE4EB] hover:text-[#F33B7D]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate("/gynae-assistant")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F33B7D] bg-white px-4 py-2.5 text-xs font-semibold text-[#F33B7D] transition hover:bg-[#FEE4EB]"
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </button>
        </div>

        {/* CONTENT */}
        <div className="mt-6">
          {/* Loading State */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-[#8F8C8C]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F33B7D] border-t-transparent" />
                Loading conversation history...
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-2xl bg-[#FEF4F4] p-5 text-sm text-[#8F8C8C]">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-[#F33B7D]" />
                <div>
                  <p className="font-medium text-[#3D3939]">Failed to load conversations</p>
                  <p className="mt-1">{error}</p>
                  <button
                    onClick={loadConversations}
                    className="mt-3 rounded-lg bg-[#F33B7D] px-4 py-2 text-xs font-medium text-white hover:bg-[#d92f6b]"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredConversations.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE4EB] text-[#F33B7D]">
                <CalendarDays className="h-8 w-8" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-[#0D0D0D]">
                {filter === "all"
                  ? "No conversations found"
                  : `No ${filter} conversations found`}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-5 text-[#8F8C8C]">
                {filter === "all"
                  ? "Your conversations with Flora will appear here. Start a new conversation to get personalized health insights."
                  : `You don't have any ${filter} conversations. Start a new conversation to begin.`}
              </p>

              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="mt-4 rounded-lg bg-[#F33B7D] px-4 py-2 text-xs font-medium text-white hover:bg-[#d92f6b]"
                >
                  View all conversations
                </button>
              )}
            </div>
          )}

          {/* Conversations List */}
          {!loading && !error && filteredConversations.length > 0 && (
            <div className="space-y-3">
              {filteredConversations.map((conversation) => {
                const risk = getRiskStyles(conversation?.assessment?.riskLevel);
                const completed = conversation.status === "completed";
                const messageCount = getMessageCount(conversation.messages);
                const preview = getMessagePreview(conversation.messages);
                // Use the new helper function to get the display title
                const displayTitle = getConversationDisplayTitle(conversation);

                return (
                  <div
                    key={conversation._id}
                    className="group relative flex items-stretch overflow-hidden rounded-2xl border border-[#F1E8EA] bg-white transition-all hover:border-[#F33B7D] hover:shadow-md"
                  >
                    {/* Main clickable area */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/gynae-assistant/history/${conversation._id}`)
                      }
                      className="flex flex-1 items-center gap-4 px-4 py-4 text-left"
                    >
                      {/* Icon */}
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB] text-[#F33B7D]">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      {/* Main Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-[#0D0D0D]">
                            {displayTitle}
                          </p>
                          {/* Mobile date */}
                          <span className="ml-auto text-[10px] text-[#8F8C8C] sm:hidden">
                            {getTimeAgo(conversation.updatedAt)}
                          </span>
                        </div>

                        {/* Preview */}
                        <p className="mt-1 truncate text-xs text-[#8F8C8C]">
                          {preview}
                        </p>

                        {/* Tags */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                              completed ? "text-green-600" : "text-[#F33B7D]"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                completed ? "bg-green-500" : "bg-[#F33B7D]"
                              }`}
                            />
                            {completed ? "Completed" : "Active"}
                          </span>

                          {conversation?.assessment?.riskLevel && (
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${risk.text}`}
                            >
                              <span className={`h-2 w-2 rounded-full ${risk.dot}`} />
                              {risk.label}
                            </span>
                          )}

                          <span className="text-[10px] text-[#B8AEB2]">
                            {messageCount} message{messageCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Date - Desktop */}
                      <div className="hidden flex-shrink-0 text-right sm:block">
                        <p className="text-[11px] font-medium text-[#3D3939]">
                          {formatDate(conversation.updatedAt)}
                        </p>
                        <p className="mt-1 text-[10px] text-[#8F8C8C]">
                          {formatTime(conversation.updatedAt)}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#8F8C8C]" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteClick(e, conversation)}
                      className="absolute right-3 top-3 rounded-full p-1.5 transition-all hover:bg-red-50 sm:relative sm:right-0 sm:top-0"
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-4 w-4 text-[#8F8C8C] transition-colors hover:text-red-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PRIVACY NOTE */}
        <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#FEF4F4] p-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-green-600">
            <ShieldCheck className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-semibold text-[#3D3939]">
              Your conversations are private and secure.
            </p>
            <p className="mt-1 text-xs leading-5 text-[#8F8C8C]">
              Only you can view your Gynae Assistant conversation history. All data is
              encrypted and stored securely.
            </p>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-[#F1E8EA] px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0D0D0D]">
                  Delete Conversation
                </h3>
                <button
                  onClick={handleCancelDelete}
                  className="rounded-full p-1 hover:bg-[#FEF4F4]"
                >
                  <X className="h-5 w-5 text-[#8F8C8C]" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-50">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-[#3D3939]">
                    Are you sure you want to delete this conversation?
                  </p>
                  <p className="mt-1 text-sm text-[#8F8C8C]">
                    <span className="font-medium">
                      "{getConversationDisplayTitle(selectedConversation)}"
                    </span>
                    <br />
                    This action cannot be undone and all messages will be permanently removed.
                  </p>
                  {selectedConversation.messages && (
                    <p className="mt-2 text-xs text-[#B8AEB2]">
                      {getMessageCount(selectedConversation.messages)} messages will be deleted
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#F1E8EA] px-6 py-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl border border-[#F1E8EA] bg-white px-4 py-2.5 text-sm font-medium text-[#3D3939] transition hover:bg-[#FEF4F4] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}