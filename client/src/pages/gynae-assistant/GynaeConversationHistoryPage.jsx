// client/src/pages/gynae-assistant/GynaeConversationHistoryPage.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";

import {
  getGynaeHistory,
} from "../../services/gynaeAssistant.service";

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
    };
  }

  if (riskLevel === "medium") {
    return {
      text: "text-orange-500",
      dot: "bg-orange-400",
      label: "Medium Risk",
    };
  }

  if (riskLevel === "low") {
    return {
      text: "text-green-600",
      dot: "bg-green-500",
      label: "Low Risk",
    };
  }

  return {
    text: "text-[#8F8C8C]",
    dot: "bg-[#B8AEB2]",
    label: "No Risk Level",
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

export default function GynaeConversationHistoryPage() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getGynaeHistory();

        setConversations(
          Array.isArray(result?.data)
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load Gynae history:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load your conversation history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredConversations = useMemo(() => {
    if (filter === "all") {
      return conversations;
    }

    return conversations.filter(
      (conversation) =>
        conversation.status === filter
    );
  }, [conversations, filter]);

  return (
    <PageLayout
      title="Conversation History"
      subtitle="Review your previous conversations with Flora."
      backTo="/gynae-assistant"
    >
      <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">

        {/* TOP ACTIONS */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-wrap gap-2">

            {[
              ["all", "All"],
              ["active", "Active"],
              ["completed", "Completed"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  filter === value
                    ? "bg-[#F33B7D] text-white"
                    : "bg-[#FEF4F4] text-[#8F8C8C] hover:bg-[#FEE4EB] hover:text-[#F33B7D]"
                }`}
              >
                {label}
              </button>
            ))}

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/gynae-assistant")
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F33B7D] bg-white px-4 py-2.5 text-xs font-semibold text-[#F33B7D] transition hover:bg-[#FEE4EB]"
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </button>

        </div>

        {/* CONTENT */}

        <div className="mt-6">

          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex items-center gap-3 text-sm text-[#8F8C8C]">
                <Sparkles className="h-4 w-4 text-[#F33B7D]" />
                Loading conversation history...
              </div>

            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl bg-[#FEF4F4] p-5 text-sm text-[#8F8C8C]">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            filteredConversations.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE4EB] text-[#F33B7D]">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#0D0D0D]">
                  No conversations found
                </h3>

                <p className="mt-1 max-w-sm text-xs leading-5 text-[#8F8C8C]">
                  Your conversations with Flora will appear here.
                </p>

              </div>
            )}

          {!loading &&
            !error &&
            filteredConversations.length > 0 && (
              <div className="space-y-3">

                {filteredConversations.map(
                  (conversation) => {
                    const risk =
                      getRiskStyles(
                        conversation?.assessment
                          ?.riskLevel
                      );

                    const completed =
                      conversation.status ===
                      "completed";

                    const title =
                      categoryTitle[
                        conversation.category
                      ] ||
                      "Gynae Conversation";

                    return (
                      <button
                        key={conversation._id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/gynae-assistant/history/${conversation._id}`
                          )
                        }
                        className="flex w-full items-center gap-4 rounded-2xl border border-[#F1E8EA] bg-white px-4 py-4 text-left transition hover:border-[#F33B7D] hover:bg-[#FFFAFB]"
                      >

                        {/* ICON */}

                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB] text-[#F33B7D]">
                          <CalendarDays className="h-5 w-5" />
                        </div>

                        {/* MAIN INFO */}

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-semibold text-[#0D0D0D]">
                            {title}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">

                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] ${
                                completed
                                  ? "text-green-600"
                                  : "text-[#F33B7D]"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  completed
                                    ? "bg-green-500"
                                    : "bg-[#F33B7D]"
                                }`}
                              />

                              {completed
                                ? "Completed"
                                : "Active"}
                            </span>

                            {conversation?.assessment
                              ?.riskLevel && (
                              <span
                                className={`inline-flex items-center gap-1.5 text-[11px] ${risk.text}`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${risk.dot}`}
                                />

                                {risk.label}
                              </span>
                            )}

                          </div>

                        </div>

                        {/* DATE */}

                        <div className="hidden flex-shrink-0 text-right sm:block">

                          <p className="text-[11px] font-medium text-[#3D3939]">
                            {formatDate(
                              conversation.updatedAt
                            )}
                          </p>

                          <p className="mt-1 text-[10px] text-[#8F8C8C]">
                            {formatTime(
                              conversation.updatedAt
                            )}
                          </p>

                        </div>

                        <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#8F8C8C]" />

                      </button>
                    );
                  }
                )}

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
              Only you can view your Gynae Assistant conversation history.
            </p>
          </div>

        </div>

      </div>
    </PageLayout>
  );
}