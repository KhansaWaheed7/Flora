import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, Check, Minus, Plus } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { questions, TOTAL_QUESTIONS } from "../../data/pcosQuestions";

function frequencyToBoolean(value) {
  return ["Yes", "Often", "Frequently"].includes(value);
}

// Per-unit validation ranges (start = typical for a 10-year-old female)
const HEIGHT_RANGES = {
  cm: { min: 120, max: 200, step: 1 },
  ft: { min: 4.0, max: 6.6, step: 0.1 },
  in: { min: 48, max: 79, step: 1 },
};

const WEIGHT_RANGES = {
  kg: { min: 20, max: 150, step: 0.5 },
};

// Menstrual cycle length ranges (days)
const CYCLE_RANGES = {
  min: 15,
  max: 90,
  regularMin: 21,
  regularMax: 35,
};

// Exercise frequency range (days per week)
const EXERCISE_RANGES = {
  min: 0,
  max: 7,
  step: 1,
};

function isCycleIrregular(cycleLength, irregularCyclesAnswer) {
  const n = Number(cycleLength);
  const outOfRange =
    !isNaN(n) && (n < CYCLE_RANGES.regularMin || n > CYCLE_RANGES.regularMax);
  return outOfRange || frequencyToBoolean(irregularCyclesAnswer);
}

function buildPayload(answers) {
  const heightValue = Number(answers.heightWeight?.height);
  const heightUnit = answers.heightWeight?.heightUnit || "cm";

  let heightInCm = heightValue;
  if (heightUnit === "ft") {
    heightInCm = heightValue * 30.48;
  } else if (heightUnit === "in") {
    heightInCm = heightValue * 2.54;
  }

  const weight = Number(answers.heightWeight?.weight);

  const bmi =
    heightInCm && weight
      ? +(weight / (heightInCm / 100) ** 2).toFixed(1)
      : undefined;

  return {
    age: Number(answers.age),
    height: heightInCm,
    weight,
    bmi,
    cycleLength: Number(answers.cycleLength),
    irregularPeriods: isCycleIrregular(
      answers.cycleLength,
      answers.irregularCycles
    ),
    weightGain: frequencyToBoolean(answers.weightGain),
    acne: frequencyToBoolean(answers.acne),
    hairLoss: frequencyToBoolean(answers.hairLoss),
    excessiveHairGrowth: frequencyToBoolean(answers.hirsutism),
    darkSkinPatches: frequencyToBoolean(answers.skinPatches),
    exerciseFrequency: Number(answers.exerciseFrequency),
    fastFood: frequencyToBoolean(answers.fastFood),
  };
}

// Reusable stepper input with custom +/- buttons
function StepperInput({
  value,
  onChange,
  onStep,
  min,
  max,
  step = 1,
  placeholder,
  unit,
  className = "",
}) {
  const numeric = value === "" || value === undefined ? null : Number(value);
  const canDecrement = numeric === null || numeric > min;
  const canIncrement = numeric === null || numeric < max;

  return (
    <div className="relative">
      <input
        type="number"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-4 py-3.5 pr-28 text-lg font-semibold text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
      />
      {unit && (
        <span className="absolute right-[5.5rem] top-1/2 -translate-y-1/2 text-sm text-[#8F8C8C]">
          {unit}
        </span>
      )}
      <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
        <button
          type="button"
          aria-label="Decrease"
          onClick={() => onStep(-step)}
          disabled={!canDecrement}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F0DCE4] bg-white text-[#3D3939] transition hover:bg-[#FEF4F4] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Increase"
          onClick={() => onStep(step)}
          disabled={!canIncrement}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F0DCE4] bg-white text-[#3D3939] transition hover:bg-[#FEF4F4] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function PCOSQuestionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = questions[step];
  const isLast = step === TOTAL_QUESTIONS - 1;

  const heightUnit = answers.heightWeight?.heightUnit || "cm";
  const heightRange = HEIGHT_RANGES[heightUnit] || HEIGHT_RANGES.cm;
  const weightRange = WEIGHT_RANGES.kg;

  const isAnswered = () => {
    const val = answers[current.key];

    if (current.key === "age") {
      const age = Number(val);
      if (!Number.isInteger(age) || age < 10 || age > 60) return false;
      return true;
    }

    if (current.key === "cycleLength") {
      const n = Number(val);
      if (!Number.isInteger(n)) return false;
      if (n < CYCLE_RANGES.min || n > CYCLE_RANGES.max) return false;
      return true;
    }

    if (current.key === "exerciseFrequency") {
      const n = Number(val);
      if (!Number.isInteger(n)) return false;
      if (n < EXERCISE_RANGES.min || n > EXERCISE_RANGES.max) return false;
      return true;
    }

    if (current.type === "height_weight") {
      const height = Number(val?.height);
      const weight = Number(val?.weight);
      if (!val?.heightUnit) return false;
      if (isNaN(height) || height < heightRange.min || height > heightRange.max)
        return false;
      if (isNaN(weight) || weight < weightRange.min || weight > weightRange.max)
        return false;
      return true;
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

  // Generic number input
  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (value === "" || value === "-") {
      setAnswer(value);
      return;
    }
    const num = Number(value);
    if (!isNaN(num) && num >= 0) {
      setAnswer(value);
    }
  };

  // Age input (10–60)
  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setAnswer("");
      return;
    }
    if (!/^\d+$/.test(value)) return;

    const num = Number(value);
    if (num < 10) {
      setAnswer("10");
      return;
    }
    if (num > 60) {
      setAnswer("60");
      return;
    }
    setAnswer(value);
  };

  const handleAgeStep = (delta) => {
    const currentVal =
      answers.age === "" || answers.age === undefined ? 10 : Number(answers.age);
    const next = Math.min(60, Math.max(10, currentVal + delta));
    setAnswer(String(next));
  };

  const handleNumberStep = (delta) => {
    const currentVal =
      answers[current.key] === "" || answers[current.key] === undefined
        ? 0
        : Number(answers[current.key]);
    const next = Math.max(0, currentVal + delta);
    setAnswer(String(next));
  };

  // Cycle length input (15–90 days, clamped)
  const handleCycleChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setAnswer("");
      return;
    }

    if (!/^\d+$/.test(value)) return;

    const num = Number(value);

    if (num < CYCLE_RANGES.min) {
      setAnswer(String(CYCLE_RANGES.min));
      return;
    }
    if (num > CYCLE_RANGES.max) {
      setAnswer(String(CYCLE_RANGES.max));
      return;
    }

    setAnswer(value);
  };

  const handleCycleStep = (delta) => {
    const currentVal =
      answers.cycleLength === "" || answers.cycleLength === undefined
        ? CYCLE_RANGES.regularMin
        : Number(answers.cycleLength);
    const next = Math.min(
      CYCLE_RANGES.max,
      Math.max(CYCLE_RANGES.min, currentVal + delta)
    );
    setAnswer(String(next));
  };

  // Exercise frequency input (0–7 days, clamped)
  const handleExerciseChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setAnswer("");
      return;
    }

    if (!/^\d+$/.test(value)) return;

    const num = Number(value);

    if (num < EXERCISE_RANGES.min) {
      setAnswer(String(EXERCISE_RANGES.min));
      return;
    }
    if (num > EXERCISE_RANGES.max) {
      setAnswer(String(EXERCISE_RANGES.max));
      return;
    }

    setAnswer(value);
  };

  const handleExerciseStep = (delta) => {
    const currentVal =
      answers.exerciseFrequency === "" ||
      answers.exerciseFrequency === undefined
        ? EXERCISE_RANGES.min
        : Number(answers.exerciseFrequency);
    const next = Math.min(
      EXERCISE_RANGES.max,
      Math.max(EXERCISE_RANGES.min, currentVal + delta)
    );
    setAnswer(String(next));
  };

  // Height input — clamps to the range of the currently selected unit
  const handleHeightChange = (e) => {
    const value = e.target.value;
    const currentHeightWeight = answers.heightWeight || { heightUnit: "cm" };

    if (value === "") {
      setAnswer({ ...currentHeightWeight, height: "" });
      return;
    }
    if (value === ".") {
      setAnswer({ ...currentHeightWeight, height: "0." });
      return;
    }

    const num = Number(value);
    if (isNaN(num)) return;

    if (num < heightRange.min) {
      setAnswer({ ...currentHeightWeight, height: String(heightRange.min) });
      return;
    }
    if (num > heightRange.max) {
      setAnswer({ ...currentHeightWeight, height: String(heightRange.max) });
      return;
    }

    setAnswer({ ...currentHeightWeight, height: value });
  };

  const handleHeightStep = (delta) => {
    const currentHeightWeight = answers.heightWeight || { heightUnit: "cm" };
    const currentVal =
      currentHeightWeight.height === "" ||
      currentHeightWeight.height === undefined
        ? heightRange.min
        : Number(currentHeightWeight.height);
    const next = Math.min(
      heightRange.max,
      Math.max(heightRange.min, +(currentVal + delta).toFixed(2))
    );
    setAnswer({ ...currentHeightWeight, height: String(next) });
  };

  // Weight input — clamps to weight range
  const handleWeightChange = (e) => {
    const value = e.target.value;
    const currentHeightWeight = answers.heightWeight || { heightUnit: "cm" };

    if (value === "") {
      setAnswer({ ...currentHeightWeight, weight: "" });
      return;
    }
    if (value === ".") {
      setAnswer({ ...currentHeightWeight, weight: "0." });
      return;
    }

    const num = Number(value);
    if (isNaN(num)) return;

    if (num < weightRange.min) {
      setAnswer({ ...currentHeightWeight, weight: String(weightRange.min) });
      return;
    }
    if (num > weightRange.max) {
      setAnswer({ ...currentHeightWeight, weight: String(weightRange.max) });
      return;
    }

    setAnswer({ ...currentHeightWeight, weight: value });
  };

  const handleWeightStep = (delta) => {
    const currentHeightWeight = answers.heightWeight || { heightUnit: "cm" };
    const currentVal =
      currentHeightWeight.weight === "" ||
      currentHeightWeight.weight === undefined
        ? weightRange.min
        : Number(currentHeightWeight.weight);
    const next = Math.min(
      weightRange.max,
      Math.max(weightRange.min, +(currentVal + delta).toFixed(1))
    );
    setAnswer({ ...currentHeightWeight, weight: String(next) });
  };

  const getHeightPlaceholder = () => {
    switch (heightUnit) {
      case "ft":
        return "5.8";
      case "in":
        return "65";
      case "cm":
      default:
        return "165";
    }
  };

  return (
    <PageLayout
      title="PCOS Assessment"
      subtitle="Answer the following questions to estimate your PCOS risk. This is a screening assessment, not a medical diagnosis."
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
            {current.type === "number" &&
              (current.key === "age" ? (
                <StepperInput
                  value={answers.age}
                  onChange={handleAgeChange}
                  onStep={handleAgeStep}
                  min={10}
                  max={60}
                  step={1}
                  placeholder={current.placeholder}
                  unit={current.unit}
                />
              ) : current.key === "cycleLength" ? (
                <>
                  <StepperInput
                    value={answers.cycleLength}
                    onChange={handleCycleChange}
                    onStep={handleCycleStep}
                    min={CYCLE_RANGES.min}
                    max={CYCLE_RANGES.max}
                    step={1}
                    placeholder={current.placeholder}
                    unit={current.unit || "days"}
                  />
                  {answers.cycleLength !== "" &&
                    answers.cycleLength !== undefined &&
                    (() => {
                      const n = Number(answers.cycleLength);
                      const isRegular =
                        n >= CYCLE_RANGES.regularMin &&
                        n <= CYCLE_RANGES.regularMax;
                      return (
                        <p
                          className={`mt-2 text-xs font-medium ${
                            isRegular ? "text-green-600" : "text-[#F33B7D]"
                          }`}
                        >
                          {isRegular
                            ? `Regular cycle (${CYCLE_RANGES.regularMin}–${CYCLE_RANGES.regularMax} days)`
                            : `Outside the typical ${CYCLE_RANGES.regularMin}–${CYCLE_RANGES.regularMax}-day window — this will be counted as an irregular cycle.`}
                        </p>
                      );
                    })()}
                </>
              ) : current.key === "exerciseFrequency" ? (
                <>
                  <StepperInput
                    value={answers.exerciseFrequency}
                    onChange={handleExerciseChange}
                    onStep={handleExerciseStep}
                    min={EXERCISE_RANGES.min}
                    max={EXERCISE_RANGES.max}
                    step={EXERCISE_RANGES.step}
                    placeholder={current.placeholder}
                    unit={current.unit || "days/week"}
                  />
                  <p className="mt-1 text-[10px] text-[#8F8C8C]">
                    {EXERCISE_RANGES.min}–{EXERCISE_RANGES.max} days/week
                  </p>
                </>
              ) : (
                <StepperInput
                  value={answers[current.key]}
                  onChange={handleNumberChange}
                  onStep={handleNumberStep}
                  min={0}
                  max={Infinity}
                  step={1}
                  placeholder={current.placeholder}
                  unit={current.unit}
                />
              ))}

            {current.type === "height_weight" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#3D3939]">
                    Height
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step={heightRange.step}
                        value={answers.heightWeight?.height || ""}
                        onChange={handleHeightChange}
                        placeholder={getHeightPlaceholder()}
                        className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-3 py-3 pr-16 text-sm font-semibold text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                        <button
                          type="button"
                          aria-label="Decrease height"
                          onClick={() => handleHeightStep(-heightRange.step)}
                          className="flex h-7 w-6 items-center justify-center rounded border border-[#F0DCE4] bg-white text-[#3D3939] transition hover:bg-[#FEF4F4] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          aria-label="Increase height"
                          onClick={() => handleHeightStep(heightRange.step)}
                          className="flex h-7 w-6 items-center justify-center rounded border border-[#F0DCE4] bg-white text-[#3D3939] transition hover:bg-[#FEF4F4] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <select
                      value={heightUnit}
                      onChange={(e) => {
                        const unit = e.target.value;
                        const currentHeightWeight = answers.heightWeight || {};
                        setAnswer({
                          ...currentHeightWeight,
                          heightUnit: unit,
                          height: "", // Clear height when switching units
                        });
                      }}
                      className="w-[70px] rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-2 py-3 text-sm font-semibold text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
                    >
                      <option value="cm">cm</option>
                      <option value="ft">ft</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                  <p className="mt-1 text-[10px] text-[#8F8C8C]">
                    {heightRange.min}–{heightRange.max} {heightUnit}
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#3D3939]">
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={weightRange.step}
                      value={answers.heightWeight?.weight || ""}
                      onChange={handleWeightChange}
                      placeholder="60"
                      className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-4 py-3 pr-20 text-sm font-semibold text-[#0D0D0D] outline-none focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-[4.25rem] top-1/2 -translate-y-1/2 text-xs text-[#8F8C8C]">
                      kg
                    </span>
                    <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                      <button
                        type="button"
                        aria-label="Decrease weight"
                        onClick={() => handleWeightStep(-weightRange.step)}
                        className="flex h-7 w-6 items-center justify-center rounded border border-[#F0DCE4] bg-white text-[#3D3939] transition hover:bg-[#FEF4F4] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Increase weight"
                        onClick={() => handleWeightStep(weightRange.step)}
                        className="flex h-7 w-6 items-center justify-center rounded border border-[#F0DCE4] bg-white text-[#3D3939] transition hover:bg-[#FEF4F4] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-[10px] text-[#8F8C8C]">
                    {weightRange.min}–{weightRange.max} kg
                  </p>
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
                        : "border-[#F0DCE4] bg-white text-[#3D3939] hover:bg-[#FEF4F4]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {current.type === "frequency" && (
              <div className="space-y-3">
                {["Never", "Rarely", "Sometimes", "Often", "Frequently"].map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswer(opt)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition ${
                        answers[current.key] === opt
                          ? "border-[#F33B7D] bg-[#FEE4EB] text-[#F33B7D]"
                          : "border-[#F0DCE4] bg-white text-[#3D3939] hover:bg-[#FEF4F4]"
                      }`}
                    >
                      <span>{opt}</span>
                      {answers[current.key] === opt && (
                        <Check className="h-4 w-4 text-[#F33B7D]" />
                      )}
                    </button>
                  )
                )}
              </div>
            )}

            {current.helperNote && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#FEE4EB] p-3">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F33B7D]" />
                <p className="text-xs text-[#3D3939]">{current.helperNote}</p>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-xl bg-[#FEF4F4] p-3">
            <p className="text-xs leading-relaxed text-[#6B5F63]">
              <span className="font-semibold text-[#F33B7D]">Important:</span>{" "}
              This assessment provides a PCOS risk screening and prediction based on
              the information you provide. It does not detect or diagnose PCOS and
              cannot replace evaluation by a qualified healthcare professional.
            </p>
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
              {isLast ? "Check My Risk" : "Next"}{" "}
              <ArrowRight className="h-4 w-4" />
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