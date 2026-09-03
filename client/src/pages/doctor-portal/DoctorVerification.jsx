import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import DoctorLayout from "../../layouts/DoctorLayout";
import {
  getDoctorVerification,
  uploadDoctorDocument,
} from "../../services/doctorVerification.service";

const DOCUMENTS = [
  {
    type: "pmdc_certificate",
    label: "PMDC Certificate",
  },
  {
    type: "medical_degree",
    label: "Medical Degree",
  },
  {
    type: "specialist_certificate",
    label: "Specialization Certificate",
  },
  {
    type: "identity_document",
    label: "Identity Document",
  },
];

function StatusBadge({ status }) {
  if (status === "verified") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
        <XCircle className="h-3.5 w-3.5" />
        Rejected
      </span>
    );
  }

  if (status === "suspended") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
        <XCircle className="h-3.5 w-3.5" />
        Suspended
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
      <Clock className="h-3.5 w-3.5" />
      Pending Review
    </span>
  );
}

export default function DoctorVerification() {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRefs = useRef({});

  const loadVerification = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctorVerification();
      setVerification(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load doctor verification information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerification();
  }, []);

  const getDocument = (type) => {
    return verification?.doctorVerification?.documents?.find(
      (doc) => doc.type === type
    );
  };

  const handleFileChange = async (event, documentType) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadingType(documentType);
    setError("");
    setSuccess("");

    try {
      const data = await uploadDoctorDocument(
        file,
        documentType
      );

      setVerification((prev) => ({
        ...prev,
        doctorVerification: {
          ...prev.doctorVerification,
          documents:
            data?.document
              ? [
                  ...(prev.doctorVerification?.documents || []).filter(
                    (doc) => doc.type !== documentType
                  ),
                  data.document,
                ]
              : prev.doctorVerification?.documents || [],
          status: "pending",
          rejectionReason: "",
          verifiedAt: null,
          verifiedBy: null,
        },
      }));

      setSuccess(
        "Document uploaded successfully and sent for review."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to upload document."
      );
    } finally {
      setUploadingType("");

      if (fileInputRefs.current[documentType]) {
        fileInputRefs.current[documentType].value = "";
      }
    }
  };

  if (loading) {
    return (
      <DoctorLayout
        title="Doctor Verification"
        subtitle="Manage your professional verification."
      >
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-sm text-[#8F8C8C]">
            Loading verification information...
          </p>
        </div>
      </DoctorLayout>
    );
  }

  if (error && !verification) {
    return (
      <DoctorLayout
        title="Doctor Verification"
        subtitle="Manage your professional verification."
      >
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      </DoctorLayout>
    );
  }

  const doctorVerification =
    verification?.doctorVerification || {};

  const status = doctorVerification.status || "pending";

  const documents = doctorVerification.documents || [];

  const allRequiredUploaded = DOCUMENTS.every((item) =>
    documents.some((doc) => doc.type === item.type)
  );

  return (
    <DoctorLayout
      title="Doctor Verification"
      subtitle="Submit your professional information and documents for verification."
    >
      <div className="mx-auto max-w-3xl space-y-5">

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600 ring-1 ring-green-100">
            {success}
          </div>
        )}

        {/* Verification Status */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#F33B7D]" />

                <h2 className="text-base font-semibold text-[#0D0D0D]">
                  Verification Status
                </h2>
              </div>

              <p className="mt-1 text-xs text-[#8F8C8C]">
                Your professional credentials are reviewed by an administrator.
              </p>
            </div>

            <StatusBadge status={status} />
          </div>
        </div>

        {/* Rejection Notice */}
        {status === "rejected" && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />

              <div>
                <h3 className="text-sm font-semibold text-red-700">
                  Verification Rejected
                </h3>

                <p className="mt-2 text-xs font-medium text-red-600">
                  Reason:
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {doctorVerification.rejectionReason ||
                    "Your submitted information requires correction."}
                </p>

                <p className="mt-3 text-xs text-red-500">
                  Please replace the required document and submit it again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Information */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <h2 className="text-base font-semibold text-[#0D0D0D]">
            Your Submitted Information
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-[#8F8C8C]">
                PMDC Registration Number
              </p>

              <p className="mt-1 text-sm font-medium text-[#3D3939]">
                {doctorVerification.pmdcRegistrationNumber || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#8F8C8C]">
                Registration Type
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-[#3D3939]">
                {doctorVerification.registrationType || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#8F8C8C]">
                Specialization
              </p>

              <p className="mt-1 text-sm font-medium text-[#3D3939]">
                {verification?.specialization || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#8F8C8C]">
                Hospital
              </p>

              <p className="mt-1 text-sm font-medium text-[#3D3939]">
                {verification?.hospital || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#0D0D0D]">
              Verification Documents
            </h2>

            <p className="mt-1 text-xs text-[#8F8C8C]">
              Upload clear JPG, PNG, WEBP, or PDF files. Maximum size: 5 MB.
            </p>
          </div>

          <div className="space-y-3">
            {DOCUMENTS.map((item) => {
              const document = getDocument(item.type);
              const isUploading = uploadingType === item.type;

              return (
                <div
                  key={item.type}
                  className="flex flex-col gap-4 rounded-xl border border-[#F0DCE4] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#3D3939]">
                      {item.label}
                    </p>

                    {document ? (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />

                        <span className="truncate">
                          {document.originalName || "Uploaded"}
                        </span>
                      </div>
                    ) : (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-red-500">
                        <XCircle className="h-3.5 w-3.5" />
                        Not uploaded
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {document && (
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full border border-[#F0DCE4] bg-white px-3 py-2 text-xs font-semibold text-[#3D3939] transition hover:bg-[#FEF4F4]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </a>
                    )}

                    <input
                      ref={(element) => {
                        fileInputRefs.current[item.type] = element;
                      }}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      className="hidden"
                      onChange={(event) =>
                        handleFileChange(event, item.type)
                      }
                    />

                    <button
                      type="button"
                      disabled={isUploading || status === "verified"}
                      onClick={() =>
                        fileInputRefs.current[item.type]?.click()
                      }
                      className="flex items-center gap-1.5 rounded-full bg-[#F33B7D] px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_18px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Uploading...
                        </>
                      ) : document ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5" />
                          Replace
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          Upload
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit status */}
        <div className="rounded-2xl bg-[#FEF4F4] p-5">
          {status === "pending" && allRequiredUploaded ? (
            <>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-amber-500" />

                <div>
                  <p className="text-sm font-semibold text-[#3D3939]">
                    Documents ready for review
                  </p>

                  <p className="mt-1 text-xs text-[#8F8C8C]">
                    Your documents have been uploaded. They will be reviewed by
                    an administrator.
                  </p>
                </div>
              </div>
            </>
          ) : status === "verified" ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />

              <div>
                <p className="text-sm font-semibold text-green-700">
                  Your account is verified
                </p>

                <p className="mt-1 text-xs text-green-600">
                  You can now use the verified doctor features of Flora.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-xs text-[#8F8C8C]">
              Upload all required documents to complete your verification.
            </p>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}