import React, { useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

const DOCUMENT_TYPES = [
  { value: 'pmdc_certificate', label: 'PMDC Certificate' },
  { value: 'medical_degree', label: 'Medical Degree' },
  { value: 'specialist_certificate', label: 'Specialist Certificate' },
  { value: 'identity_document', label: 'Identity Document' },
  { value: 'other', label: 'Other' },
];

export default function DoctorDocumentUpload({ onDocumentsChange, errors }) {
  const [documents, setDocuments] = useState([]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      documentType: '',
    }));

    const updated = [...documents, ...newDocuments];
    setDocuments(updated);
    onDocumentsChange(updated);
  };

  const removeDocument = (index) => {
    const updated = documents.filter((_, i) => i !== index);
    setDocuments(updated);
    onDocumentsChange(updated);
  };

  const updateDocumentType = (index, documentType) => {
    const updated = documents.map((doc, i) =>
      i === index ? { ...doc, documentType } : doc
    );
    setDocuments(updated);
    onDocumentsChange(updated);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-[#3D3939] mb-1">
          Required Documents
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              errors?.documents
                ? 'border-red-500 bg-red-50'
                : 'border-[#F0DCE4] hover:border-[#F33B7D] hover:bg-[#FEF4F4]'
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-[#8F8C8C]" />
              <p className="mb-2 text-sm text-[#3D3939]">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-[#8F8C8C]">
                JPG, PNG, WEBP, PDF (Max 5MB each)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              multiple
              onChange={handleFileUpload}
            />
          </label>
        </div>
        {errors?.documents && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.documents}
          </p>
        )}
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#F0DCE4]"
            >
              <div className="flex-shrink-0">
                <File className="w-5 h-5 text-[#8F8C8C]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0D0D0D] truncate">
                  {doc.name}
                </p>
                <p className="text-xs text-[#8F8C8C]">
                  {(doc.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex-shrink-0 w-40">
                <select
                  value={doc.documentType}
                  onChange={(e) => updateDocumentType(index, e.target.value)}
                  className="w-full rounded-lg border border-[#F0DCE4] px-2 py-1 text-xs outline-none focus:border-[#F33B7D]"
                >
                  <option value="">Select type</option>
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeDocument(index)}
                className="flex-shrink-0 p-1 text-[#8F8C8C] hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}