import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, Check } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { questions, TOTAL_QUESTIONS } from "../../data/pcosQuestions";

// Shapes the raw answers into the payload sent to POST /pcos.
// NOTE: server/src/validators/pcos.validator.js hasn't been shared yet,
// so these exact field names/types are a best guess (yes/no -> boolean,
// height/weight flattened, bmi computed client-side). If submission
// fails validation, share that validator file and this will be corrected.
function buildPayload(answers) {
  const height = Number(answers.heightWeight?.height);
  const weight = Number(answers.heightWeight?.weight);
  const bmi =
    height && weight ? +(weight / (height / 100) ** 2).toFixed(1) : undefined;

  // Field names match server/src/validators/pcos.validator.js exactly.
  return {
    age: Number(answers.age),
    height,
    weight,
    bmi,
    cycleLength: Number(answers.cycleLength),
    irregularPeriods: answers.irregularCycles === "Yes",
    weightGain: answers.weightGain === "Yes",
    acne: answers.acne === "Yes",
    hairLoss: answers.hairLoss === "Yes",
    excessiveHairGrowth: answers.hirsutism === "Yes",
    darkSkinPatches: answers.skinPatches === "Yes",
    exerciseFrequency: Number(answers.exerciseFrequency),
    fastFood: answers.fastFood === "Yes",
  };
}

export default function PCOSQuestionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = questions[step];
  const isLast = step === TOTAL_QUESTIONS - 1;

  const isAnswered = () => {
    const val = answers[current.key];
    if (current.type === "height_weight") {
      return val?.height && val?.weight;
    }
    return val !== undefined && val !== "";
  };

  const handleNext = () => {
    if (!isAnswered()) return;
    if (isLast) {
      navigate("/pcos-detection/analyzing", {
        state: { payload: buildPayload(answers) },
      });
    } else {
      setStep((s) => s + 1);
    }
  };

  const handlePrevious = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
  };

  const setAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
  };

  return (
    <PageLayout
      title="PCOS Assessment"
      subtitle="Answer the following questions to help us analyze your risk."
    >
      <div className="mx-auto max-w-2xl">
        {/* Progress dots */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          {questions.map((q, i) => (
            <div
              key={q.key}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                i === step
                  ? "bg-[#F33B7D] text-white"
                  : i < step
                  ? "bg-[#FEE4EB] text-[#F33B7D]"
                  : "bg-[#F5EAEF] text-[#B8AEB2]"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Question card */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-xs font-semibold text-[#F33B7D]">
            Question {step + 1} of {TOTAL_QUESTIONS}
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-[#0D0D0D]">
            {current.label}
          </h2>
          {current.hint && (
            <p className="mt-1 text-sm text-[#8F8C8C]">{current.hint}</p>
          )}

          <div className="mt-5">
            {current.type === "number" && (
              <div className="relative">
                <input
                  type="number"
                  value={answers[current.key] || ""}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={current.placeholder}
                  className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-4 py-3.5 text-lg font-semibold text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
                />
                {current.unit && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#8F8C8C]">
                    {current.unit}
                  </span>
                )}
              </div>
            )}

            {current.type === "height_weight" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="mb-1.5 block text-xs font-semibold text-[#3D3939]">
                    Height
                  </label>
                  <input
                    type="number"
                    value={answers.heightWeight?.height || ""}
                    onChange={(e) =>
                      setAnswer({
                        ...answers.heightWeight,
                        height: e.target.value,
                      })
                    }
                    placeholder="165"
                    className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-4 py-3 pr-12 text-sm font-semibold text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
                  />
                  <span className="absolute right-4 top-[38px] text-xs text-[#8F8C8C]">
                    cm
                  </span>
                </div>
                <div className="relative">
                  <label className="mb-1.5 block text-xs font-semibold text-[#3D3939]">
                    Weight
                  </label>
                  <input
                    type="number"
                    value={answers.heightWeight?.weight || ""}
                    onChange={(e) =>
                      setAnswer({
                        ...answers.heightWeight,
                        weight: e.target.value,
                      })
                    }
                    placeholder="60"
                    className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-4 py-3 pr-12 text-sm font-semibold text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
                  />
                  <span className="absolute right-4 top-[38px] text-xs text-[#8F8C8C]">
                    kg
                  </span>
                </div>
              </div>
            )}

            {current.type === "yesno" && (
              <div className="grid grid-cols-2 gap-4">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswer(opt)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      answers[current.key] === opt
                        ? "border-[#F33B7D] bg-[#FEE4EB] text-[#F33B7D]"
                        : "border-[#F0DCE4] bg-white text-[#3D3939]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {current.helperNote && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#FEE4EB] p-3">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F33B7D]" />
                <p className="text-xs text-[#3D3939]">{current.helperNote}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={step === 0}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#F0DCE4] bg-white px-6 py-3 text-sm font-semibold text-[#3D3939] transition hover:bg-[#FEF4F4] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!isAnswered()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLast ? "Analyze" : "Next"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Assessment Questions overview */}
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <h3 className="mb-3 font-display text-sm font-semibold text-[#0D0D0D]">
            Assessment Questions
          </h3>
          <div className="space-y-2">
            {questions.slice(0, Math.max(step + 2, 5)).map((q, i) => {
              const status =
                i < step ? "completed" : i === step ? "current" : "pending";
              return (
                <div
                  key={q.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                        status === "completed"
                          ? "bg-[#F33B7D] text-white"
                          : status === "current"
                          ? "border border-[#F33B7D] text-[#F33B7D]"
                          : "bg-[#F5EAEF] text-[#B8AEB2]"
                      }`}
                    >
                      {status === "completed" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span
                      className={
                        status === "pending"
                          ? "text-[#B8AEB2]"
                          : "text-[#3D3939]"
                      }
                    >
                      {q.sidebarLabel}
                    </span>
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      status === "completed"
                        ? "text-green-600"
                        : status === "current"
                        ? "text-[#F33B7D]"
                        : "text-[#B8AEB2]"
                    }`}
                  >
                    {status === "completed"
                      ? "Completed"
                      : status === "current"
                      ? "Current"
                      : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-[#8F8C8C]">
            Total Questions: {TOTAL_QUESTIONS}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
