import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  CloudUpload,
  FileText,
  ShieldCheck,
  X,
} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";
import { uploadMedicalReport } from "../../services/medicalReport.service";

const allowedExtensions = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".txt",
];

const maximumFileSize = 50 * 1024 * 1024;

function formatFileSize(bytes) {
  const megabytes = bytes / (1024 * 1024);

  if (megabytes >= 1) {
    return `${megabytes.toFixed(1)} MB`;
  }

  return `${Math.ceil(bytes / 1024)} KB`;
}

function isAllowedFile(file) {
  const fileName = file.name.toLowerCase();

  return allowedExtensions.some((extension) =>
    fileName.endsWith(extension)
  );
}

export default function UploadMedicalReportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const validateAndSelectFile = (file) => {
    setError("");

    if (!file) return;

    if (!isAllowedFile(file)) {
      setError("Select a PDF, JPG, PNG, WEBP or TXT file.");
      return;
      
    }

    if (file.size > maximumFileSize) {
      setError("The selected file must be smaller than 50 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInput = (event) => {
    validateAndSelectFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    validateAndSelectFile(event.dataTransfer.files?.[0]);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Choose a medical report first.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const response = await uploadMedicalReport(selectedFile);
      const reportId = response.data?.reportId;

      if (!reportId) {
        throw new Error("The server did not return a report ID.");
      }

      navigate(`/medical-reports/${reportId}/processing`, {
        state: {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
        },
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "The report could not be uploaded."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageLayout
      title="Upload Medical Report"
      subtitle="Upload a report and Flora will extract and analyze its information."
      backTo="/medical-reports"
    >
      <section className="mx-auto mt-8 max-w-4xl">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed bg-white px-6 py-14 text-center transition ${
            dragging
              ? "border-[#F33B7D] bg-[#FFF7FA]"
              : "border-[#F5A0BE]"
          }`}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F5]">
            <CloudUpload className="h-8 w-8 text-[#F33B7D]" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-[#2F2B2B]">
            Upload your report
          </h2>

          <p className="mt-2 text-sm text-[#8F8C8C]">
            Drag and drop your file here
          </p>

          <p className="mt-2 text-xs text-[#A5A1A1]">
            PDF · JPG · PNG · WEBP · TXT
          </p>

          <p className="mt-1 text-xs text-[#A5A1A1]">
            Maximum size: 50 MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.txt"
            onChange={handleFileInput}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-6 rounded-xl border border-[#F33B7D] px-6 py-2.5 text-sm font-semibold text-[#F33B7D] transition hover:bg-[#FFF0F5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Choose File
          </button>
        </div>

        {selectedFile && (
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[#F7DCE7] bg-[#FFF5F8] p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <FileText className="h-6 w-6 text-[#F33B7D]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#2F2B2B]">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-xs text-[#8F8C8C]">
                {formatFileSize(selectedFile.size)}
              </p>

              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                File ready
              </p>
            </div>

            <button
              type="button"
              onClick={removeSelectedFile}
              disabled={uploading}
              aria-label="Remove selected file"
              className="rounded-lg p-2 text-[#8F8C8C] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="mt-5 w-full rounded-xl bg-[#F33B7D] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#F33B7D]/20 transition hover:bg-[#E72E70] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading Report..." : "Analyze Report"}
        </button>

        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8F8C8C]">
          <ShieldCheck className="h-4 w-4" />
          Your information is private and securely processed.
        </p>
      </section>
    </PageLayout>
  );
}