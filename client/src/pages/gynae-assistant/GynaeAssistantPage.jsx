import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paperclip,
  Smile,
  Send,
  Trash2,
  Sparkles,
  Check,
  History,
} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";

import {
  createGynaeConversation,
  sendGynaeMessage,
} from "../../services/gynaeAssistant.service";

import womanImage from "../../assets/woman.png";

const initialAssistantMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm Flora 🌸\n\nI'm here to help with your gynecological and reproductive health concerns. Please describe what you're experiencing or ask me a question.",
};

/*
 * These are the categories that actually have
 * structured assessment question flows in the backend.
 *
 * General menstrual/general gynae/out-of-scope categories
 * should remain normal Gemini conversation.
 */
const structuredAssessmentCategories = new Set([
  "missed_period",
  "pelvic_pain",
  "vaginal_discharge",
  "painful_period",
  "abnormal_bleeding",
  "urinary_symptoms",
  "pregnancy_concern",
]);

/*
 * Matches the number of questions in:
 * server/src/data/gynae/questions.js
 */
const assessmentQuestionCounts = {
  missed_period: 10,
  pelvic_pain: 7,
  vaginal_discharge: 7,
  painful_period: 6,
  abnormal_bleeding: 7,
  urinary_symptoms: 7,
  pregnancy_concern: 5,
};

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
  out_of_scope: "Out of Scope",
};

export default function GynaeAssistantPage() {
  const navigate = useNavigate();

  const [conversationId, setConversationId] = useState(null);

  const [messages, setMessages] = useState(() => [
    {
      ...initialAssistantMessage,
      id: `welcome-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [category, setCategory] = useState(null);
  const [assessment, setAssessment] = useState(null);

  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Shows the polished completion summary when an assessment finishes.
  const [showAssessmentComplete, setShowAssessmentComplete] = useState(false);

  const formatTime = (date = new Date()) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ======================================================
  // START / RESET CONVERSATION
  // ======================================================

  const startConversation = useCallback(async () => {
    try {
      setLoading(true);

      const result = await createGynaeConversation();

      console.log("CREATE GYNAE RESPONSE:", result);

      const data = result?.data;

      if (!data?.conversationId) {
        throw new Error("Backend did not return a conversationId.");
      }

      setConversationId(data.conversationId);

      setMessages([
        {
          ...initialAssistantMessage,
          id: `welcome-${Date.now()}`,
          timestamp: formatTime(),
        },
      ]);

      setCurrentQuestion(null);
      setSelectedOptions([]);

      setCategory(null);
      setAssessment(null);

      setAnsweredQuestions(0);
      setTotalQuestions(0);
      setShowAssessmentComplete(false);

      setInput("");
    } catch (error) {
      console.error("Failed to create Gynae conversation:", error);
      console.error("Backend response:", error?.response?.data);

      setConversationId(null);

      setMessages([
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I'm sorry, I couldn't start the conversation right now. Please try again.",
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================================================
  // INITIAL CONVERSATION
  // ======================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      startConversation();
    }, 0);

    return () => clearTimeout(timer);
  }, [startConversation]);

  // ======================================================
  // MESSAGE HELPERS
  // ======================================================

  const addUserMessage = (content) => {
    setMessages((previous) => [
      ...previous,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: formatTime(),
      },
    ]);
  };

  const addAssistantMessage = (content) => {
    setMessages((previous) => [
      ...previous,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: formatTime(),
      },
    ]);
  };

  // ======================================================
  // SEND MESSAGE
  // ======================================================

  const handleSend = async (
    message = input,
    isStructuredAssessmentAnswer = false
  ) => {
    const cleanMessage = message.trim();

    if (!cleanMessage || loading) {
      return;
    }

    if (message === input) {
      setInput("");
    }

    addUserMessage(cleanMessage);

    setLoading(true);

    try {
      if (!conversationId) {
        throw new Error(
          "No conversation ID exists. Please start a new conversation."
        );
      }

      console.log("SENDING GYNAE MESSAGE:", {
        conversationId,
        message: cleanMessage,
      });

      const result = await sendGynaeMessage(
        conversationId,
        cleanMessage
      );

      console.log("GYNAE MESSAGE RESPONSE:", result);

      const data = result?.data;

      if (data?.conversationId) {
        setConversationId(data.conversationId);
      }

      // ==================================================
      // CATEGORY
      // ==================================================

      if (data?.category) {
        setCategory(data.category);

        if (structuredAssessmentCategories.has(data.category)) {
          setTotalQuestions(
            assessmentQuestionCounts[data.category] || 0
          );
        } else {
          /*
           * General Gemini categories are not assessments.
           */
          setTotalQuestions(0);
          setAnsweredQuestions(0);
        }
      }

      // ==================================================
      // ASSESSMENT PROGRESS
      // ==================================================

      /*
       * Only option buttons / multi-choice Continue count
       * as answered assessment questions.
       *
       * A free-text general question while an assessment is
       * active must NOT increase progress.
       */
      if (isStructuredAssessmentAnswer) {
        setAnsweredQuestions((previous) => {
          const maxQuestions =
            assessmentQuestionCounts[
              data?.category || category
            ] || totalQuestions;

          if (!maxQuestions) {
            return previous + 1;
          }

          return Math.min(previous + 1, maxQuestions);
        });
      }

      // ==================================================
      // CURRENT QUESTION
      // ==================================================

      if (data?.question) {
        setCurrentQuestion(data.question);
      } else {
        setCurrentQuestion(null);
      }

      setSelectedOptions([]);

      // ==================================================
      // ASSESSMENT RESULT
      // ==================================================

      if (data?.assessment) {
        setAssessment(data.assessment);

        if (data?.completed === true) {
          const finalTotal =
            assessmentQuestionCounts[
              data?.category || category
            ] || totalQuestions;

          if (finalTotal) {
            setAnsweredQuestions(finalTotal);
            setTotalQuestions(finalTotal);
          }

          setShowAssessmentComplete(true);
        }
      } else {
        setAssessment(null);
      }

      // ==================================================
      // FLORA RESPONSE
      // ==================================================

      if (data?.response) {
        addAssistantMessage(data.response);
      }
    } catch (error) {
      console.error("GYNAE ASSISTANT ERROR:", error);
      console.error("STATUS:", error?.response?.status);
      console.error("BACKEND ERROR:", error?.response?.data);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error;

      addAssistantMessage(
        backendMessage ||
          "I'm sorry, I couldn't process that right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ASSESSMENT OPTIONS
  // ======================================================

  const handleOptionClick = (option) => {
    if (!currentQuestion || loading) {
      return;
    }

    if (currentQuestion.type === "multi_choice") {
      setSelectedOptions((previous) => {
        if (option.value === "none") {
          return previous.includes("none") ? [] : ["none"];
        }

        const withoutNone = previous.filter(
          (value) => value !== "none"
        );

        if (withoutNone.includes(option.value)) {
          return withoutNone.filter(
            (value) => value !== option.value
          );
        }

        return [...withoutNone, option.value];
      });

      return;
    }

    /*
     * Single-choice option = real structured assessment answer.
     */
    handleSend(option.value, true);
  };

  const handleMultiChoiceSubmit = () => {
    if (selectedOptions.length === 0 || loading) {
      return;
    }

    /*
     * One multi-choice Continue counts as one answered question.
     */
    handleSend(JSON.stringify(selectedOptions), true);
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const getCategoryTitle = () => {
    return categoryTitle[category] || "Current Assessment";
  };

  const isStructuredAssessment =
    structuredAssessmentCategories.has(category);

  /*
   * Current question position:
   *
   * Before answering first question:
   * 1 of 10
   *
   * After answering first:
   * next question = 2 of 10
   */
  const currentQuestionNumber =
    currentQuestion && totalQuestions > 0
      ? Math.min(answeredQuestions + 1, totalQuestions)
      : answeredQuestions;

  const progressPercentage = assessment?.result
    ? 100
    : totalQuestions > 0 && currentQuestion
      ? Math.min(
          (currentQuestionNumber / totalQuestions) * 100,
          100
        )
      : 0;

  const assessmentRiskLevel = assessment?.riskLevel || "low";

  const assessmentRiskLabel =
    assessmentRiskLevel === "high"
      ? "High"
      : assessmentRiskLevel === "medium"
        ? "Medium"
        : "Low";

  const assessmentRiskClasses =
    assessmentRiskLevel === "high"
      ? "bg-red-50 text-red-600 ring-red-100"
      : assessmentRiskLevel === "medium"
        ? "bg-orange-50 text-orange-600 ring-orange-100"
        : "bg-green-50 text-green-600 ring-green-100";

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <PageLayout
      title="Gynae Assistant"
      subtitle="Your AI assistant for women's gynecological and reproductive health."
    >
      {/* ==================================================
          PAGE ACTION
      ================================================== */}

      <div className="mb-4 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/gynae-assistant/history")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E7DDE0] bg-white px-4 py-2.5 text-xs font-semibold text-[#3D3939] transition hover:border-[#F33B7D] hover:bg-[#FEE4EB] hover:text-[#F33B7D]"
        >
          <History className="h-4 w-4" />
          Conversation History
        </button>

        <button
          type="button"
          onClick={startConversation}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#F33B7D] bg-white px-4 py-2.5 text-xs font-semibold text-[#F33B7D] transition hover:bg-[#FEE4EB] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-lg leading-none">+</span>
          New Conversation
        </button>
      </div>

      {/* ==================================================
          MAIN CHAT + RIGHT PANEL
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">

        {/* ==================================================
            CHAT CARD
        ================================================== */}

        <section className="flex min-h-[680px] min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">

          {/* Chat top bar */}

          <div className="flex items-center justify-between border-b border-[#F4E8EB] px-5 py-4">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEE4EB] text-[#F33B7D]">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="font-display text-sm font-semibold text-[#0D0D0D]">
                  Flora Assistant
                </p>

                <p className="text-xs text-[#8F8C8C]">
                  General health information and guided assessments
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={startConversation}
              disabled={loading}
              title="Start a new conversation"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8F8C8C] transition hover:bg-[#FEF4F4] hover:text-[#F33B7D] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>

          </div>

          {/* ==================================================
              MESSAGES
          ================================================== */}

          {assessment?.result && showAssessmentComplete ? (
            <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-8 sm:px-6">
              <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 sm:p-8">

                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 ring-8 ring-green-50/60">
                    <Check className="h-8 w-8" />
                  </div>

                  <h2 className="mt-5 font-display text-2xl font-semibold text-[#0D0D0D]">
                    Assessment Complete!
                  </h2>

                  <p className="mt-2 text-xs text-[#8F8C8C]">
                    Thank you for answering all the questions.
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-3">
                    <span className="text-sm font-semibold text-[#3D3939]">
                      Risk Level
                    </span>

                    <span
                      className={`rounded-lg px-4 py-2 text-sm font-semibold ring-1 ${assessmentRiskClasses}`}
                    >
                      {assessmentRiskLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-green-100 bg-green-50/70 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-green-600">
                        <Check className="h-3.5 w-3.5" />
                      </div>

                      <p className="text-xs leading-5 text-[#3D3939]">
                        Your assessment is complete. Review the summary and recommendation below, and seek professional care if your symptoms are severe, worsening, persistent, or concerning.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#F1E8EA] bg-white p-5">
                    <p className="text-xs font-semibold text-[#0D0D0D]">
                      Summary
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#3D3939]">
                      {assessment.result.summary}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#F1E8EA] bg-white p-5">
                    <p className="text-xs font-semibold text-[#0D0D0D]">
                      Recommendation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#3D3939]">
                      {assessment.result.recommendation}
                    </p>
                  </div>

                  {assessment.redFlags?.length > 0 && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                      <p className="text-xs font-semibold text-red-700">
                        Red flags
                      </p>

                      <ul className="mt-2 space-y-2">
                        {assessment.redFlags.map((flag, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-xs leading-5 text-red-700"
                          >
                            <span>•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="rounded-xl border border-[#FEE4EB] bg-[#FEF4F4] p-4">
                    <p className="text-xs leading-5 text-[#8F8C8C]">
                      Please remember that this assessment does not provide a medical diagnosis. It is for informational purposes only.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAssessmentComplete(false)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F33B7D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E72F70]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Back to Chat
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <>
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {message.role === "assistant" && (
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FEE4EB] text-[#F33B7D]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
                    message.role === "user"
                      ? "bg-[#FEE4EB]"
                      : "bg-[#FEF4F4]"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#3D3939]">
                      {message.role === "user"
                        ? "You"
                        : "Flora Assistant"}
                    </span>

                    <span className="text-[10px] text-[#B8AEB2]">
                      {message.timestamp || formatTime()}
                    </span>
                  </div>

                  <p className="whitespace-pre-line text-sm leading-6 text-[#3D3939]">
                    {message.content}
                  </p>

                  {message.role === "user" && (
                    <span className="mt-1 block text-right text-[10px] font-semibold text-[#F33B7D]">
                      ✓✓
                    </span>
                  )}
                </div>

              </div>
            ))}

            {/* ==================================================
                STRUCTURED ASSESSMENT QUESTION
            ================================================== */}

            {currentQuestion && (
              <div className="ml-0 rounded-2xl border border-[#FEE4EB] bg-white p-4 sm:ml-12 sm:p-5">

                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">

                    <span className="rounded-full bg-[#FEE4EB] px-2.5 py-1 text-[10px] font-semibold text-[#F33B7D]">
                      Question {currentQuestionNumber} of{" "}
                      {totalQuestions}
                    </span>

                  </div>

                  <h3 className="text-sm font-semibold leading-6 text-[#0D0D0D]">
                    {currentQuestion.text}
                  </h3>

                  <p className="mt-1 text-xs text-[#8F8C8C]">
                    {currentQuestion.type === "multi_choice"
                      ? "Select all options that apply, then press Continue."
                      : "Select the option that best describes your situation."}
                  </p>
                </div>

                <div className="space-y-2">

                  {currentQuestion.options?.map((option) => {
                    const selected =
                      selectedOptions.includes(option.value);

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        disabled={loading}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs font-medium transition ${
                          selected
                            ? "border-[#F33B7D] bg-[#FEE4EB] text-[#F33B7D]"
                            : "border-[#EDE4E6] bg-white text-[#3D3939] hover:border-[#F33B7D] hover:bg-[#FEF4F4]"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <span
                          className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? "border-[#F33B7D]"
                              : "border-[#B8AEB2]"
                          }`}
                        >
                          {selected && (
                            <span className="h-2 w-2 rounded-full bg-[#F33B7D]" />
                          )}
                        </span>

                        {option.label}
                      </button>
                    );
                  })}

                </div>

                {currentQuestion.type === "multi_choice" && (
                  <button
                    type="button"
                    onClick={handleMultiChoiceSubmit}
                    disabled={
                      loading || selectedOptions.length === 0
                    }
                    className="mt-4 rounded-xl bg-[#F33B7D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#E72F70] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                  </button>
                )}

              </div>
            )}

            {/* ==================================================
                ASSESSMENT RESULT
            ================================================== */}

            {assessment?.result && (
              <div className="ml-0 rounded-2xl bg-[#FEF4F4] p-5 ring-1 ring-[#FEE4EB] sm:ml-12">

                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEE4EB] text-[#F33B7D]">
                    <Check className="h-4 w-4" />
                  </div>

                  <h3 className="font-display text-base font-semibold text-[#0D0D0D]">
                    {assessment.result.title}
                  </h3>
                </div>

                <p className="text-sm leading-6 text-[#3D3939]">
                  {assessment.result.summary}
                </p>

                <div className="mt-4 rounded-xl bg-white p-4">
                  <p className="text-xs font-semibold text-[#0D0D0D]">
                    Recommendation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8F8C8C]">
                    {assessment.result.recommendation}
                  </p>
                </div>

                {assessment.redFlags?.length > 0 && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                    <p className="text-xs font-semibold text-red-700">
                      Red flags
                    </p>

                    <ul className="mt-2 space-y-1.5">
                      {assessment.redFlags.map((flag, index) => (
                        <li
                          key={index}
                          className="flex gap-2 text-xs leading-5 text-red-700"
                        >
                          <span>•</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            )}

            {/* Loading */}

            {loading && (
              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEE4EB] text-[#F33B7D]">
                  <Sparkles className="h-4 w-4" />
                </div>

                <div className="rounded-2xl bg-[#FEF4F4] px-4 py-3 text-xs text-[#8F8C8C]">
                  Flora is thinking...
                </div>

              </div>
            )}

          </div>

            </>
          )}

          {/* ==================================================
              MESSAGE INPUT
          ================================================== */}

          {!showAssessmentComplete && (
            <div className="border-t border-[#F4E8EB] bg-white p-4 sm:p-5">

              <div className="flex min-h-14 items-center gap-2 rounded-2xl border border-[#E7DDE0] bg-white px-3 transition focus-within:border-[#F33B7D]">

              <input
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    /*
                     * Free-text input is always sent as normal
                     * conversation text. Backend decides how
                     * to handle it while preserving assessments.
                     */
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                disabled={
                  loading || Boolean(assessment?.result)
                }
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-[#3D3939] outline-none placeholder:text-[#B8AEB2] disabled:cursor-not-allowed"
              />

              {/* UI icons retained from your design.
                  Attachment/emoji functionality will be
                  checked separately against backend support. */}

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8F8C8C] transition hover:bg-[#FEF4F4] hover:text-[#F33B7D]"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8F8C8C] transition hover:bg-[#FEF4F4] hover:text-[#F33B7D]"
              >
                <Smile className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={
                  loading ||
                  !input.trim() ||
                  Boolean(assessment?.result)
                }
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-white transition hover:bg-[#E72F70] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>

              </div>

            </div>
          )}

        </section>

        {/* ==================================================
            RIGHT PANEL
        ================================================== */}

        <aside className="space-y-4">

          {/* ==================================================
              ABOUT FLORA
          ================================================== */}

          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">

            <h2 className="font-display text-sm font-semibold text-[#0D0D0D]">
              About Flora
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#8F8C8C]">
              Flora provides general information about women's
              gynecological and reproductive health.
            </p>

            <div className="mt-4 space-y-3">

              {[
                "Not a medical diagnosis",
                "General information only",
                "Always consult a doctor for medical advice",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2"
                >
                  <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>

                  <span className="text-xs leading-5 text-[#3D3939]">
                    {item}
                  </span>
                </div>
              ))}

            </div>

            <img
              src={womanImage}
              alt="Flora women's health"
              className="mx-auto mt-4 h-44 w-44 object-contain"
            />

          </div>

          {/* ==================================================
              CURRENT ASSESSMENT
          ================================================== */}

          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEE4EB] text-[#F33B7D]">
                <Sparkles className="h-4 w-4" />
              </div>

              <h2 className="font-display text-sm font-semibold text-[#0D0D0D]">
                Current Assessment
              </h2>
            </div>

            {/* ==================================================
                NO STRUCTURED ASSESSMENT
            ================================================== */}

            {!isStructuredAssessment &&
              !currentQuestion &&
              !assessment?.result && (
                <div className="mt-5">

                  <p className="text-[11px] text-[#8F8C8C]">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#0D0D0D]">
                    No assessment started
                  </p>

                  <p className="mt-1 text-xs text-[#8F8C8C]">
                    Waiting for assessment
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#FEE4EB]">
                    <div className="h-full w-0 rounded-full bg-[#F33B7D]" />
                  </div>

                </div>
              )}

            {/* ==================================================
                ASSESSMENT IN PROGRESS
            ================================================== */}

            {isStructuredAssessment &&
              currentQuestion &&
              !assessment?.result && (
                <div className="mt-5">

                  <p className="text-[11px] text-[#8F8C8C]">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-semibold leading-5 text-[#0D0D0D]">
                    {getCategoryTitle()}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[11px] text-[#8F8C8C]">
                      Progress
                    </p>

                    <p className="text-[11px] font-semibold text-[#F33B7D]">
                      {Math.round(progressPercentage)}%
                    </p>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#FEE4EB]">
                    <div
                      className="h-full rounded-full bg-[#F33B7D] transition-all duration-300"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs font-medium text-[#3D3939]">
                    Question {currentQuestionNumber} of{" "}
                    {totalQuestions}
                  </p>

                  <p className="mt-1 text-xs text-[#8F8C8C]">
                    Assessment in progress
                  </p>

                </div>
              )}

            {/* ==================================================
                COMPLETED ASSESSMENT
            ================================================== */}

            {assessment?.result && (
              <div className="mt-5">

                <p className="text-[11px] text-[#8F8C8C]">
                  Category
                </p>

                <p className="mt-1 text-sm font-semibold leading-5 text-[#0D0D0D]">
                  {getCategoryTitle()}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[11px] text-[#8F8C8C]">
                    Progress
                  </p>

                  <p className="text-[11px] font-semibold text-[#F33B7D]">
                    100%
                  </p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#FEE4EB]">
                  <div className="h-full w-full rounded-full bg-[#F33B7D]" />
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5">

                  <Check className="h-4 w-4 flex-shrink-0 text-green-600" />

                  <span className="text-xs font-semibold text-green-700">
                    Assessment completed
                  </span>

                </div>

              </div>
            )}

          </div>

        </aside>

      </div>
    </PageLayout>
  );
}