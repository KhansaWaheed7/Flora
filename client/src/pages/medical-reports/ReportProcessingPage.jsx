import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Check,
  Clock3,
  FileSearch,
  FileText,
  LoaderCircle,
  ShieldCheck,
  Sparkles,

} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";
import { getReportStatus } from "../../services/medicalReport.service";

const processingSteps = [
  {
    key: "uploaded",
    title: "File uploaded",
    description: "Your file has been uploaded successfully.",
    icon: Check,
  },
  {
    key: "processing",
    title: "Extracting information",
    description: "We are extracting text from your report.",
    icon: FileSearch,
  },
  {
    key: "ocr_done",
    title: "Analyzing results",
    description: "We are identifying tests and values.",
    icon: Sparkles,
  },
  {
    key: "parsing_done",
    title: "Generating summary",
    description: "Flora is creating insights for you.",
    icon: Clock3,
  },
];

const statusOrder = {
  uploaded: 0,
  processing: 1,
  ocr_done: 2,
  parsing_done: 3,
  completed: 4,
};

function formatFileSize(bytes = 0) {
  if (!bytes) return "";

  const megabytes = bytes / (1024 * 1024);

  if (megabytes >= 1) {
    return `${megabytes.toFixed(1)} MB`;
  }

  return `${Math.ceil(bytes / 1024)} KB`;
}

export default function ReportProcessingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const fileName =
    location.state?.fileName || "Medical report";
  const fileSize = location.state?.fileSize || 0;

  const [status, setStatus] = useState("uploaded");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return undefined;

    let stopped = false;
    let redirectTimer;

    const checkStatus = async () => {
      try {
        const response = await getReportStatus(id);

        if (stopped) return;

        const latestStatus = response.data.processingStatus;
        setStatus(latestStatus);

        if (latestStatus === "completed") {
          stopped = true;

          redirectTimer = window.setTimeout(() => {
            navigate(`/medical-reports/${id}`, {
              replace: true,
            });
          }, 1000);
        }

        if (latestStatus === "failed") {
          stopped = true;

          setError(
            response.data.processingError ||
              "The report could not be analyzed."
          );
        }
      } catch (requestError) {
        if (stopped) return;

        stopped = true;

        setError(
          requestError.response?.data?.message ||
            "Could not check the report status."
        );
      }
    };

    checkStatus();

    const interval = window.setInterval(() => {
      if (!stopped) {
        checkStatus();
      }
    }, 2000);

    return () => {
      stopped = true;
      window.clearInterval(interval);
      window.clearTimeout(redirectTimer);
    };
  }, [id, navigate]);

  const currentPosition = statusOrder[status] ?? 0;

  return (
    <PageLayout
      title="Analyzing Your Report"
      subtitle="Please wait while Flora analyzes your report."
      backTo="/medical-reports"
    >
      <section className="mx-auto mt-8 max-w-4xl">
        <div className="grid gap-6 rounded-2xl border border-[#F0DCE4] bg-white p-6 shadow-sm md:grid-cols-[220px_1fr]">
          <ReportFileCard
            fileName={fileName}
            fileSize={fileSize}
            status={status}
          />

          <div className="space-y-1">
            {processingSteps.map((step, index) => {
              const isCompleted = currentPosition > index;
              const isActive = currentPosition === index;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-[#FFF0F5] text-[#F33B7D]"
                            : "bg-[#F7F5F6] text-[#B8B4B5]"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : isActive ? (
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>

                    {index < processingSteps.length - 1 && (
                      <div
                        className={`h-12 w-0.5 ${
                          isCompleted
                            ? "bg-green-300"
                            : "bg-[#EEE8EA]"
                        }`}
                      />
                    )}
                  </div>

                  <div className="pt-1">
                    <h2 className="text-sm font-semibold text-[#2F2B2B]">
                      {step.title}
                    </h2>

                    <p className="mt-1 text-xs text-[#8F8C8C]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {status === "completed" && (
          <div className="mt-5 rounded-xl bg-green-50 px-5 py-4 text-center text-sm font-medium text-green-600">
            Analysis completed. Opening your report...
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-5 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => navigate("/medical-reports")}
              className="mt-3 text-sm font-semibold text-[#F33B7D]"
            >
              Return to reports
            </button>
          </div>
        )}

        {!error && status !== "completed" && (
          <p className="mt-6 text-center text-sm text-[#8F8C8C]">
            You will be redirected automatically when the analysis
            is complete.
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8F8C8C]">
          <ShieldCheck className="h-4 w-4 text-[#F33B7D]" />
          Your report is encrypted and securely processed.
        </div>
      </section>
    </PageLayout>
  );
}

function ReportFileCard({
  fileName,
  fileSize,
  status,
}) {
  const isFailed = status === "failed";
  const isCompleted = status === "completed";

  let statusLabel = "Processing...";

  if (isFailed) statusLabel = "Analysis Failed";
  if (isCompleted) statusLabel = "Completed";

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FFF7FA] p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
        <FileText className="h-7 w-7 text-[#F33B7D]" />
      </div>

      <h2 className="mt-4 max-w-full truncate text-sm font-semibold text-[#2F2B2B]">
        {fileName}
      </h2>

      {fileSize > 0 && (
        <p className="mt-1 text-xs text-[#8F8C8C]">
          {formatFileSize(fileSize)}
        </p>
      )}

      <span
        className={`mt-4 rounded-full px-4 py-1.5 text-xs font-medium ${
          isFailed
            ? "bg-red-100 text-red-600"
            : isCompleted
              ? "bg-green-100 text-green-600"
              : "bg-[#FFE3EC] text-[#F33B7D]"
        }`}
      >
        {statusLabel}
      </span>
    </div>
  );
}