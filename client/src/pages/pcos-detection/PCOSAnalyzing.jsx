import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { submitAssessment } from "../../services/pcos.service";

const steps = [
  "Analyzing symptoms...",
  "Running AI model...",
  "Calculating risk score...",
  "Preparing recommendations...",
];

export default function PCOSAnalyzing() {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = location.state?.payload;
  const [activeStep, setActiveStep] = useState(0);
  const hasSubmitted = useRef(false); // Track if submitted

  useEffect(() => {
    if (!payload) {
      navigate("/pcos-detection");
      return;
    }

    // PREVENT DUPLICATE SUBMISSION
    if (hasSubmitted.current) {
      console.log('🛑 Duplicate submission blocked by useRef');
      return;
    }

    const interval = setInterval(() => {
      setActiveStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 700);

    const run = async () => {
      hasSubmitted.current = true; // Mark as submitted
      
      try {
        console.log('🟢 Submitting assessment once');
        const assessment = await submitAssessment(payload);
        setTimeout(() => {
          clearInterval(interval);
          navigate("/pcos-detection/result", { state: { result: assessment } });
        }, steps.length * 700 + 400);
      } catch (err) {
        setTimeout(() => {
          clearInterval(interval);
          navigate("/pcos-detection/result", {
            state: {
              error:
                err?.response?.data?.message ||
                "Couldn't complete your assessment. Try again.",
            },
          });
        }, steps.length * 700 + 400);
      }
    };
    run();

    return () => clearInterval(interval);
  }, [payload, navigate]);

  return (
    <PageLayout
      title="PCOS Detection"
      subtitle="Please wait while our AI model evaluates your data."
    >
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
          Analyzing Your Symptoms
        </h2>

        <div className="relative mx-auto my-6 flex h-32 w-32 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#FEE4EB] border-t-[#F33B7D]" />
          <span className="text-4xl">🧠</span>
        </div>

        <div className="space-y-2 text-left">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              {i < activeStep ? (
                <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
              ) : i === activeStep ? (
                <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-[#F33B7D]" />
              ) : (
                <span className="h-4 w-4 flex-shrink-0 rounded-full border border-[#F0DCE4]" />
              )}
              <span
                className={`text-sm ${
                  i <= activeStep ? "text-[#3D3939]" : "text-[#B8AEB2]"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-[#FEF4F4] p-3">
          <p className="text-xs text-[#8F8C8C]">
            This will only take a few seconds. Thank you for your patience.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}