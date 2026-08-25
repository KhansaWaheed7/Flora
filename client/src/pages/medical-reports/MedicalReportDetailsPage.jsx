import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  HeartPulse,
  Lightbulb,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";
import {
  downloadMedicalReport,
  getMedicalReport,
} from "../../services/medicalReport.service";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "All Results" },
  { id: "insights", label: "Insights" },
  { id: "recommendations", label: "Recommendations" },
];

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatFileSize(bytes = 0) {
  if (!bytes) return "";

  const megabytes = bytes / (1024 * 1024);

  if (megabytes >= 1) {
    return `${megabytes.toFixed(1)} MB`;
  }

  return `${Math.ceil(bytes / 1024)} KB`;
}

export default function MedicalReportDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMedicalReport(id);
        const reportData = response.data;

        if (reportData.processingStatus !== "completed") {
          navigate(`/medical-reports/${id}/processing`, {
            replace: true,
          });
          return;
        }

        setReport(reportData);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Could not load this medical report."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id, navigate]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError("");

      const response = await downloadMedicalReport(id);
      const fileUrl = URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = fileUrl;
      link.download = report.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(fileUrl);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not download this report."
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Medical Report"
        backTo="/medical-reports"
      >
        <div className="mt-8 rounded-2xl bg-white p-10 text-center text-sm text-[#8F8C8C]">
          Loading report...
        </div>
      </PageLayout>
    );
  }

  if (error && !report) {
    return (
      <PageLayout
        title="Medical Report"
        backTo="/medical-reports"
      >
        <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </PageLayout>
    );
  }

  const results = report?.extractedData || [];
  const abnormalResults = report?.abnormalResults || [];
  const abnormalCount = abnormalResults.length;
  const normalCount = results.filter(
    (result) => result.status === "normal"
  ).length;
  const unknownCount = results.filter(
    (result) => result.status === "unknown"
  ).length;

  return (
    <PageLayout
      title={report.reportType || "Medical Report"}
      subtitle={`${report.fileName} · Uploaded ${formatDate(
        report.createdAt
      )} · ${formatFileSize(report.fileSize)}`}
      backTo="/medical-reports"
    >
      <section className="mt-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 rounded-xl border border-[#F0DCE4] bg-white px-5 py-2.5 text-sm font-semibold text-[#3D3939] transition hover:bg-[#FFF0F5] disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Downloading..." : "Download"}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2 overflow-x-auto rounded-xl bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#F33B7D] text-white"
                  : "text-[#8F8C8C] hover:bg-[#FFF0F5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {activeTab === "overview" && (
            <OverviewTab
              report={report}
              total={results.length}
              normal={normalCount}
              abnormal={abnormalCount}
              unknown={unknownCount}
            />
          )}

          {activeTab === "results" && (
            <ResultsTab results={results} />
          )}

          {activeTab === "insights" && (
            <InsightsTab insights={report.insights} />
          )}

          {activeTab === "recommendations" && (
            <RecommendationsTab
              insights={report.insights}
              abnormalResults={abnormalResults}
            />
          )}
        </div>

        <div className="mt-5 flex gap-3 rounded-2xl border border-[#F7DCE7] bg-[#FFF5F8] p-5">
          <ShieldCheck className="h-5 w-5 flex-shrink-0 text-[#F33B7D]" />

          <p className="text-xs leading-5 text-[#6F6A6B]">
            {report.disclaimer ||
              "This analysis is for informational purposes only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional."}
          </p>
        </div>
      </section>
    </PageLayout>
  );
}

function OverviewTab({
  report,
  total,
  normal,
  abnormal,
  unknown,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5">
        <Card title="Analysis Overview">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBox
              value={total}
              label="Tests Analyzed"
              color="text-blue-600"
              background="bg-blue-50"
            />

            <StatBox
              value={normal}
              label="Normal"
              color="text-green-600"
              background="bg-green-50"
            />

            <StatBox
              value={abnormal}
              label="Abnormal"
              color="text-red-500"
              background="bg-red-50"
            />

            <StatBox
              value={unknown}
              label="Unknown"
              color="text-[#3D3939]"
              background="bg-[#F7F5F6]"
            />
          </div>
        </Card>

        <Card title="Key Findings">
          {report.abnormalResults?.length > 0 ? (
            <div className="space-y-3">
              {report.abnormalResults.map((result, index) => (
                <ResultRow
                  key={`${result.test}-${index}`}
                  result={result}
                />
              ))}
            </div>
          ) : (
            <EmptyMessage message="No abnormal findings were detected." />
          )}
        </Card>

        <Card >
          <div 
            className="text-sm leading-6 text-[#6F6A6B] [&>strong]:font-semibold [&>strong]:text-[#2F2B2B]"
            dangerouslySetInnerHTML={{ 
              __html: report.summary || "No report summary is available." 
            }}
          />
        </Card>
      </div>

      <div className="space-y-5">
        <Card title="Flora's Insights">
          <p className="text-sm leading-6 text-[#6F6A6B]">
            {report.insights?.overview ||
              "No overview is available for this report."}
          </p>

          <InsightList
            title="Key findings"
            items={report.insights?.keyFindings}
          />

          <InsightList
            title="Normal results"
            items={report.insights?.normalResults}
            green
          />
        </Card>

        {report.insights?.whenToSeeDoctor && (
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
            <div className="flex gap-3">
              <Stethoscope className="h-5 w-5 flex-shrink-0 text-orange-500" />

              <div>
                <h3 className="text-sm font-semibold text-[#2F2B2B]">
                  When to see a doctor
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#6F6A6B]">
                  {report.insights.whenToSeeDoctor}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsTab({ results }) {
  if (results.length === 0) {
    return (
      <Card title="All Results">
        <EmptyMessage message="No test results were extracted." />
      </Card>
    );
  }

  return (
    <Card title="All Results">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead>
            <tr className="border-b border-[#F0DCE4] text-xs text-[#8F8C8C]">
              <th className="px-3 py-3 font-medium">Test</th>
              <th className="px-3 py-3 font-medium">Value</th>
              <th className="px-3 py-3 font-medium">Reference Range</th>
              <th className="px-3 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {results.map((result, index) => (
              <tr
                key={`${result.test}-${index}`}
                className="border-b border-[#F7F1F3] text-sm"
              >
                <td className="px-3 py-4 font-medium text-[#2F2B2B]">
                  {result.test || "Unknown test"}
                </td>

                <td className="px-3 py-4 text-[#6F6A6B]">
                  {result.value || "—"} {result.unit || ""}
                </td>

                <td className="px-3 py-4 text-[#6F6A6B]">
                  {result.referenceRange || "N/A"}
                </td>

                <td className="px-3 py-4">
                  <StatusBadge status={result.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function InsightsTab({ insights }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <InfoCard
        icon={HeartPulse}
        title="Overview"
        text={insights?.overview}
      />

      <ListCard
        icon={Lightbulb}
        title="Key Findings"
        items={insights?.keyFindings}
      />

      <ListCard
        icon={CheckCircle2}
        title="Normal Results"
        items={insights?.normalResults}
        green
      />

      <InfoCard
        icon={Stethoscope}
        title="When to See a Doctor"
        text={insights?.whenToSeeDoctor}
        orange
      />
    </div>
  );
}

function RecommendationsTab({ insights, abnormalResults }) {
  const recommendations = [
    ...(insights?.recommendations || []),
    ...abnormalResults
      .map((result) => result.recommendation)
      .filter(Boolean),
  ];

  return (
    <Card title="Recommendations">
      {recommendations.length > 0 ? (
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li
              key={`${recommendation}-${index}`}
              className="flex gap-3 rounded-xl bg-[#FFF7FA] p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#F33B7D]" />

              <p className="text-sm leading-6 text-[#6F6A6B]">
                {recommendation}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyMessage message="No recommendations are available." />
      )}
    </Card>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#F0DCE4] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-[#2F2B2B]">
        {title}
      </h2>

      {children}
    </div>
  );
}

function StatBox({ value, label, color, background }) {
  return (
    <div className={`rounded-xl p-4 text-center ${background}`}>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-[#8F8C8C]">{label}</p>
    </div>
  );
}

function ResultRow({ result }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#2F2B2B]">
          {result.test}
        </p>

        <p className="mt-1 text-xs text-[#8F8C8C]">
          Reference: {result.referenceRange || "N/A"}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-[#2F2B2B]">
          {result.value} {result.unit}
        </p>

        <StatusBadge status={result.status} />
      </div>
    </div>
  );
}

function StatusBadge({ status = "unknown" }) {
  const styles = {
    normal: "bg-green-100 text-green-600",
    low: "bg-orange-100 text-orange-600",
    high: "bg-red-100 text-red-600",
    abnormal: "bg-red-100 text-red-600",
    unknown: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        styles[status] || styles.unknown
      }`}
    >
      {status}
    </span>
  );
}

function InsightList({ title, items = [], green = false }) {
  if (!items?.length) return null;

  return (
    <div className="mt-5">
      <h3 className="text-xs font-semibold uppercase text-[#8F8C8C]">
        {title}
      </h3>

      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex gap-2 text-sm text-[#6F6A6B]"
          >
            <span
              className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                green ? "bg-green-500" : "bg-[#F33B7D]"
              }`}
            />

            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text, orange = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        orange
          ? "border-orange-100 bg-orange-50"
          : "border-[#F0DCE4] bg-white"
      }`}
    >
      <Icon
        className={`h-6 w-6 ${
          orange ? "text-orange-500" : "text-[#F33B7D]"
        }`}
      />

      <h2 className="mt-4 font-semibold text-[#2F2B2B]">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#6F6A6B]">
        {text || "No information is available."}
      </p>
    </div>
  );
}

function ListCard({ icon: Icon, title, items = [], green = false }) {
  return (
    <div className="rounded-2xl border border-[#F0DCE4] bg-white p-5">
      <Icon
        className={`h-6 w-6 ${
          green ? "text-green-500" : "text-[#F33B7D]"
        }`}
      />

      <h2 className="mt-4 font-semibold text-[#2F2B2B]">
        {title}
      </h2>

      {items?.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex gap-2 text-sm leading-6 text-[#6F6A6B]"
            >
              <span
                className={`mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                  green ? "bg-green-500" : "bg-[#F33B7D]"
                }`}
              />

              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[#8F8C8C]">
          No information is available.
        </p>
      )}
    </div>
  );
}

function EmptyMessage({ message }) {
  return (
    <div className="rounded-xl bg-[#F9F7F8] p-5 text-center">
      <FileText className="mx-auto h-6 w-6 text-[#B8B4B5]" />
      <p className="mt-2 text-sm text-[#8F8C8C]">{message}</p>
    </div>
  );
}