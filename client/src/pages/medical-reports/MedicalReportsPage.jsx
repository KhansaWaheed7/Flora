import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  HeartPulse,
  MoreVertical,
  Search,
  TestTube,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";
import {
  deleteMedicalReport,
  getMedicalReports,
} from "../../services/medicalReport.service";

const reportIcons = {
  "Blood Test": TestTube,
  "Urine Test": TestTube,
  Cardiology: HeartPulse,
};

const statusStyles = {
  completed: {
    label: "Analysis Complete",
    className: "bg-green-50 text-green-600",
  },
  failed: {
    label: "Analysis Failed",
    className: "bg-red-50 text-red-600",
  },
  default: {
    label: "Processing",
    className: "bg-orange-50 text-orange-500",
  },
};

function formatFileSize(bytes = 0) {
  if (!bytes) return "0 KB";

  const megabytes = bytes / (1024 * 1024);

  if (megabytes >= 1) {
    return `${megabytes.toFixed(1)} MB`;
  }

  return `${Math.ceil(bytes / 1024)} KB`;
}

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MedicalReportsPage() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadReports = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await getMedicalReports(page, 6);

      setReports(response.data || []);
      setPagination(
        response.pagination || {
          page: 1,
          pages: 1,
          total: 0,
        }
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not load your medical reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialReports = async () => {
      try {
        const response = await getMedicalReports(1, 6);

        if (cancelled) return;

        setReports(response.data || []);
        setPagination(
          response.pagination || {
            page: 1,
            pages: 1,
            total: 0,
          }
        );
      } catch (requestError) {
        if (cancelled) return;

        setError(
          requestError.response?.data?.message ||
            "Could not load your medical reports."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialReports();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleReports = reports.filter((report) => {
    const matchesSearch = report.fileName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "all" ||
      report.processingStatus === "completed";

    return matchesSearch && matchesFilter;
  });

  const handleViewReport = (report) => {
    setOpenMenuId(null);

    if (report.processingStatus === "completed") {
      navigate(`/medical-reports/${report._id}`);
      return;
    }

    navigate(`/medical-reports/${report._id}/processing`, {
      state: {
        fileName: report.fileName,
        fileSize: report.fileSize,
      },
    });
  };

  const openDeleteModal = (report) => {
    setOpenMenuId(null);
    setReportToDelete(report);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setReportToDelete(null);
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await deleteMedicalReport(reportToDelete._id);

      const shouldGoToPreviousPage =
        reports.length === 1 && pagination.page > 1;

      const pageToLoad = shouldGoToPreviousPage
        ? pagination.page - 1
        : pagination.page;

      setReportToDelete(null);
      await loadReports(pageToLoad);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not delete this report."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageLayout
      title="Medical Reports"
      subtitle="Your uploaded medical reports in one place."
    >
      <section
        className="mt-6"
        onClick={() => setOpenMenuId(null)}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-xl bg-white p-1 shadow-sm">
            <FilterButton
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            >
              All
            </FilterButton>

            <FilterButton
              active={activeFilter === "completed"}
              onClick={() => setActiveFilter("completed")}
            >
              Completed
            </FilterButton>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reports..."
                className="w-full rounded-xl border border-[#F0DCE4] bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#F33B7D] sm:w-64"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/medical-reports/upload")}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#F33B7D] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#F33B7D]/20 transition hover:bg-[#E72E70]"
            >
              <Upload className="h-4 w-4" />
              Upload Report
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center text-sm text-[#8F8C8C]">
            Loading reports...
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => loadReports(pagination.page)}
              className="mt-3 text-sm font-semibold text-[#F33B7D]"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && visibleReports.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#F0DCE4] bg-white p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-[#F5A0BE]" />

            <h2 className="mt-3 font-semibold text-[#2F2B2B]">
              No reports found
            </h2>

            <p className="mt-1 text-sm text-[#8F8C8C]">
              Upload your first medical report to analyze it.
            </p>
          </div>
        )}

        {!loading && !error && visibleReports.length > 0 && (
          <>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleReports.map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  menuOpen={openMenuId === report._id}
                  onView={() => handleViewReport(report)}
                  onDelete={() => openDeleteModal(report)}
                  onMenuClick={(event) => {
                    event.stopPropagation();

                    setOpenMenuId((currentId) =>
                      currentId === report._id
                        ? null
                        : report._id
                    );
                  }}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-[#8F8C8C]">
                {pagination.total} report
                {pagination.total === 1 ? "" : "s"} in total
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    loadReports(pagination.page - 1)
                  }
                  className="rounded-lg border border-[#F0DCE4] bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() =>
                    loadReports(pagination.page + 1)
                  }
                  className="rounded-lg border border-[#F0DCE4] bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {reportToDelete && (
        <DeleteConfirmationModal
          report={reportToDelete}
          deleting={deleting}
          onCancel={closeDeleteModal}
          onConfirm={handleDeleteReport}
        />
      )}
    </PageLayout>
  );
}

function ReportCard({
  report,
  menuOpen,
  onView,
  onDelete,
  onMenuClick,
}) {
  const Icon = reportIcons[report.reportType] || FileText;
  const status =
    statusStyles[report.processingStatus] || statusStyles.default;

  const tests = report.extractedData?.length || 0;
  const abnormal = report.abnormalResults?.length || 0;
  const normal = Math.max(tests - abnormal, 0);

  return (
    <article className="rounded-2xl border border-[#F0DCE4] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F5]">
          <Icon className="h-5 w-5 text-[#F33B7D]" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-[#8F8C8C]">
            {report.reportType || "Medical Report"}
          </p>

          <h3 className="mt-1 truncate text-sm font-semibold text-[#2F2B2B]">
            {report.fileName}
          </h3>

          <p className="mt-1 text-xs text-[#8F8C8C]">
            Uploaded {formatDate(report.createdAt)} ·{" "}
            {formatFileSize(report.fileSize)}
          </p>
        </div>
      </div>

      <span
        className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
      >
        {status.label}
      </span>

      <div className="mt-5 grid grid-cols-3 text-center">
        <ReportStat value={tests} label="Tests" />
        <ReportStat value={normal} label="Normal" />
        <ReportStat value={abnormal} label="Abnormal" />
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onView}
          className="flex-1 rounded-xl border border-[#F0DCE4] px-4 py-2.5 text-sm font-semibold text-[#F33B7D] transition hover:bg-[#FFF0F5]"
        >
          View Report
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Report options"
            className="rounded-xl border border-[#F0DCE4] p-2.5 text-[#8F8C8C] transition hover:bg-[#FFF0F5]"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div
              onClick={(event) => event.stopPropagation()}
              className="absolute bottom-12 right-0 z-20 w-40 rounded-xl border border-[#F0DCE4] bg-white p-1.5 shadow-lg"
            >
              <button
                type="button"
                onClick={onView}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#3D3939] hover:bg-[#FFF0F5]"
              >
                <FileText className="h-4 w-4" />
                View Report
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Report
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function ReportStat({ value, label }) {
  return (
    <div>
      <p className="text-lg font-semibold text-[#2F2B2B]">
        {value}
      </p>
      <p className="text-xs text-[#8F8C8C]">{label}</p>
    </div>
  );
}

function FilterButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
        active
          ? "bg-[#F33B7D] text-white"
          : "text-[#8F8C8C] hover:bg-[#FFF0F5]"
      }`}
    >
      {children}
    </button>
  );
}

function DeleteConfirmationModal({
  report,
  deleting,
  onCancel,
  onConfirm,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-report-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={deleting}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#8F8C8C] hover:bg-[#FFF0F5]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <Trash2 className="h-6 w-6 text-red-500" />
        </div>

        <h2
          id="delete-report-title"
          className="mt-5 text-xl font-semibold text-[#2F2B2B]"
        >
          Delete this report?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#8F8C8C]">
          This action cannot be undone. The report and its analysis
          will be permanently deleted.
        </p>

        <p className="mt-3 truncate rounded-lg bg-[#F9F7F8] px-3 py-2 text-xs font-medium text-[#6F6A6B]">
          {report.fileName}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl border border-[#F33B7D] px-4 py-3 text-sm font-semibold text-[#F33B7D] transition hover:bg-[#FFF0F5] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Report"}
          </button>
        </div>
      </div>
    </div>
  );
}