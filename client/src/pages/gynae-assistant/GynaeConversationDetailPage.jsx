import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";

import {
  getGynaeConversation,
} from "../../services/gynaeAssistant.service";

const categoryTitle = {
  missed_period: "Missed or Irregular Period",
  pelvic_pain: "Pelvic or Abdominal Pain",
  vaginal_discharge: "Vaginal Discharge",
  painful_period: "Painful Periods",
  abnormal_bleeding: "Abnormal Vaginal Bleeding",
  urinary_symptoms: "Urinary Symptoms",
  general_menstrual_health: "General Menstrual Health",
  pregnancy_concern: "Pregnancy Concern",
  general_gynae: "General Gynecological Health",
  out_of_scope: "General Conversation",
};

const getRiskStyle = (riskLevel) => {
  if (riskLevel === "high") {
    return {
      label: "High Risk",
      className: "bg-red-50 text-red-600",
    };
  }

  if (riskLevel === "medium") {
    return {
      label: "Medium Risk",
      className: "bg-orange-50 text-orange-600",
    };
  }

  return {
    label: "Low Risk",
    className: "bg-green-50 text-green-600",
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

export default function GynaeConversationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConversation = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getGynaeConversation(id);

        setConversation(result?.data || null);
      } catch (err) {
        console.error(
          "Failed to load Gynae conversation:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load this conversation."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadConversation();
    }
  }, [id]);

  const title =
    categoryTitle[conversation?.category] ||
    "Gynae Conversation";

  const riskLevel =
    conversation?.assessment?.riskLevel;

  const risk =
    riskLevel
      ? getRiskStyle(riskLevel)
      : null;

  return (
    <PageLayout
      title={title}
      subtitle="Review your previous conversation with Flora."
    >
      {/* BACK BUTTON */}

      <div className="mb-4">
        <button
          type="button"
          onClick={() =>
            navigate("/gynae-assistant/history")
          }
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8F8C8C] transition hover:text-[#F33B7D]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Conversation History
        </button>
      </div>

      {loading && (
        <div className="flex min-h-[500px] items-center justify-center rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center gap-3 text-sm text-[#8F8C8C]">
            <Sparkles className="h-5 w-5 text-[#F33B7D]" />
            Loading conversation...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl bg-white p-6 text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          {error}
        </div>
      )}

      {!loading && !error && conversation && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">

          {/* CHAT HISTORY */}

          <section className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">

            <div className="border-b border-[#F4E8EB] px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                  <h2 className="text-sm font-semibold text-[#0D0D0D]">
                    {title}
                  </h2>

                  <p className="mt-1 text-xs text-[#8F8C8C]">
                    {formatDate(
                      conversation.createdAt
                    )}{" "}
                    {formatTime(
                      conversation.createdAt
                    )}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                    conversation.status ===
                    "completed"
                      ? "bg-green-50 text-green-600"
                      : "bg-[#FEE4EB] text-[#F33B7D]"
                  }`}
                >
                  {conversation.status ===
                  "completed"
                    ? "Completed"
                    : "Active"}
                </span>

              </div>
            </div>

            <div className="min-h-[500px] space-y-5 px-5 py-6">

              {conversation.messages?.length >
              0 ? (
                conversation.messages.map(
                  (message, index) => (
                    <div
                      key={
                        message._id ||
                        `${message.role}-${index}`
                      }
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      {message.role ===
                        "assistant" && (
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB] text-[#F33B7D]">
                          <Sparkles className="h-4 w-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-[#FEE4EB]"
                            : "bg-[#FEF4F4]"
                        }`}
                      >
                        <p className="mb-1 text-xs font-semibold text-[#3D3939]">
                          {message.role === "user"
                            ? "You"
                            : "Flora Assistant"}
                        </p>

                        <p className="whitespace-pre-line text-sm leading-6 text-[#3D3939]">
                          {message.content}
                        </p>
                      </div>

                    </div>
                  )
                )
              ) : (
                <div className="flex min-h-[350px] items-center justify-center text-sm text-[#8F8C8C]">
                  No messages in this conversation.
                </div>
              )}

            </div>

          </section>

          {/* RIGHT SIDE */}

          <aside className="space-y-4">

            {/* CONVERSATION INFO */}

            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">

              <h2 className="text-sm font-semibold text-[#0D0D0D]">
                Conversation Details
              </h2>

              <div className="mt-5">
                <p className="text-[11px] text-[#8F8C8C]">
                  Category
                </p>

                <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
                  {title}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-[11px] text-[#8F8C8C]">
                  Status
                </p>

                <p className="mt-1 text-sm font-medium text-[#3D3939]">
                  {conversation.status ===
                  "completed"
                    ? "Completed"
                    : "Active"}
                </p>
              </div>

              {risk && (
                <div className="mt-4">
                  <p className="text-[11px] text-[#8F8C8C]">
                    Risk Level
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${risk.className}`}
                  >
                    {risk.label}
                  </span>
                </div>
              )}

            </div>

            {/* ASSESSMENT RESULT */}

            {conversation?.assessment
              ?.completed &&
              conversation?.assessment?.result && (
                <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">

                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEE4EB] text-[#F33B7D]">
                      <Check className="h-4 w-4" />
                    </div>

                    <h2 className="text-sm font-semibold text-[#0D0D0D]">
                      Assessment Result
                    </h2>

                  </div>

                  <p className="mt-4 text-sm font-semibold leading-5 text-[#0D0D0D]">
                    {
                      conversation.assessment
                        .result.title
                    }
                  </p>

                  <p className="mt-3 text-xs leading-5 text-[#8F8C8C]">
                    {
                      conversation.assessment
                        .result.summary
                    }
                  </p>

                  <div className="mt-4 rounded-xl bg-[#FEF4F4] p-4">

                    <p className="text-xs font-semibold text-[#0D0D0D]">
                      Recommendation
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#8F8C8C]">
                      {
                        conversation.assessment
                          .result.recommendation
                      }
                    </p>

                  </div>

                  {conversation.assessment
                    .redFlags?.length > 0 && (
                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">

                      <div className="flex items-center gap-2 text-red-600">
                        <ShieldAlert className="h-4 w-4" />

                        <p className="text-xs font-semibold">
                          Red flags
                        </p>
                      </div>

                      <ul className="mt-2 space-y-2">

                        {conversation.assessment.redFlags.map(
                          (flag, index) => (
                            <li
                              key={index}
                              className="flex gap-2 text-xs leading-5 text-red-600"
                            >
                              <span>•</span>
                              <span>{flag}</span>
                            </li>
                          )
                        )}

                      </ul>

                    </div>
                  )}

                </div>
              )}

          </aside>

        </div>
      )}
    </PageLayout>
  );
}