import React, { useRef, useState } from "react";
import { Upload, File, X, AlertCircle, CheckCircle } from "lucide-react";

const DOCUMENT_FIELDS = [
  {
    key: "pmdc_certificate",
    label: "PMDC Certificate",
    required: true,
    description: "Your valid PMDC registration certificate",
  },
  {
    key: "medical_degree",
    label: "Medical Degree",
    required: true,
    description: "Your medical degree (e.g. MBBS)",
  },
  {
    key: "identity_document",
    label: "Identity Document / CNIC",
    required: true,
    description: "A clear copy of your CNIC or other identity document",
  },
  {
    key: "specialist_certificate",
    label: "Specialist Certificate / Document",
    required: false,
    description: "Optional — upload if applicable",
  },
];

const ACCEPT = ".jpg,.jpeg,.png,.webp,.pdf";

export default function DoctorDocumentUpload({ onDocumentsChange, errors = {} }) {
  const [documents, setDocuments] = useState({});
  const inputRefs = useRef({});

  const updateDocuments = (next) => {
    setDocuments(next);
    onDocumentsChange(next);
  };

  const handleFileUpload = (documentType, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const next = {
      ...documents,
      [documentType]: {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      },
    };

    updateDocuments(next);
    e.target.value = "";
  };

  const removeDocument = (documentType) => {
    const next = { ...documents };
    delete next[documentType];
    updateDocuments(next);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-[#3D3939] mb-1">
          Verification Documents
        </label>
        <p className="text-[11px] text-[#8F8C8C] mb-3">
          PMDC Certificate, Medical Degree, and ID/CNIC are required.
          Specialist Certificate/Document is optional.
        </p>

        <div className="space-y-2">
          {DOCUMENT_FIELDS.map((document) => {
            const uploaded = documents[document.key];
            const error = errors[document.key];

            return (
              <div
                key={document.key}
                className={`rounded-lg border p-3 ${
                  error
                    ? "border-red-500 bg-red-50"
                    : "border-[#F0DCE4] bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0D0D0D]">
                      {document.label}{" "}
                      {document.required ? (
                        <span className="text-red-500">*</span>
                      ) : (
                        <span className="text-[#8F8C8C] font-normal">
                          (Optional)
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-[#8F8C8C]">
                      {document.description}
                    </p>
                  </div>

                  {uploaded ? (
                    <button
                      type="button"
                      onClick={() => removeDocument(document.key)}
                      className="flex-shrink-0 p-1 text-[#8F8C8C] hover:text-red-500 transition-colors"
                      disabled={false}
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <label className="flex-shrink-0 cursor-pointer">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F33B7D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#e52f70] transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                      </span>
                      <input
                        ref={(el) => {
                          inputRefs.current[document.key] = el;
                        }}
                        type="file"
                        className="hidden"
                        accept={ACCEPT}
                        onChange={(e) =>
                          handleFileUpload(document.key, e)
                        }
                      />
                    </label>
                  )}
                </div>

                {uploaded && (
                  <div className="mt-2 flex items-center gap-2 rounded-md bg-[#FEF4F4] px-2.5 py-2">
                    <File className="w-4 h-4 flex-shrink-0 text-[#8F8C8C]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#0D0D0D] truncate">
                        {uploaded.name}
                      </p>
                      <p className="text-[10px] text-[#8F8C8C]">
                        {(uploaded.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-500" />
                  </div>
                )}

                {error && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-2 text-[10px] text-[#8F8C8C]">
          Accepted formats: JPG, PNG, WEBP, PDF. Maximum 5 MB per document.
        </p>
      </div>
    </div>
  );
}
