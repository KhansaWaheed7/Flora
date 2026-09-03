import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { getDoctors, approveDoctor, rejectDoctor, getPendingDoctors } from "../../services/admin.service";
import { 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Mail, 
  Stethoscope, 
  FileText, 
  Calendar, 
  Building2, 
  IdCard,
  BriefcaseMedical,
  GraduationCap,
  User,
  Phone,
  Clock,
  AlertCircle,
  ExternalLink,
  File,
  Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

// Use these icons instead of FilePdf/FileImage
const FilePdfIcon = FileText; // Reuse FileText for PDFs
const FileImageIcon = ImageIcon; // Use Image icon for images

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        // Try to get from pending doctors first (most likely to be there)
        const res = await getPendingDoctors();
        const found = res.data?.doctors?.find(d => d._id === id);
        
        if (found) {
          setDoctor(found);
        } else {
          // If not in pending, try all doctors
          const allRes = await getDoctors({ page: 1, limit: 100 });
          const foundInAll = allRes.data?.doctors?.find(d => d._id === id);
          if (!foundInAll) throw new Error("Doctor not found");
          setDoctor(foundInAll);
        }
        
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await approveDoctor(id);
      toast.success("Doctor approved successfully!");
      navigate("/admin/doctor-approval");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve doctor");
      toast.error(err?.response?.data?.message || "Failed to approve doctor");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (reason === null) return; // User cancelled
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    
    try {
      setActionLoading(true);
      await rejectDoctor(id, reason);
      toast.success("Doctor rejected successfully!");
      navigate("/admin/doctor-approval");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reject doctor");
      toast.error(err?.response?.data?.message || "Failed to reject doctor");
    } finally {
      setActionLoading(false);
    }
  };

  const getDocumentIcon = (doc) => {
    const url = doc?.url || "";
    const isPDF = url.toLowerCase().includes('.pdf') || 
                  doc?.resourceType === 'pdf' ||
                  url.includes('application/pdf');
    const isImage = url && (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || 
                           doc?.resourceType === 'image');
    
    if (isPDF) return FilePdfIcon;
    if (isImage) return FileImageIcon;
    return File;
  };

  const getFileType = (doc) => {
    const url = doc?.url || "";
    if (url.toLowerCase().includes('.pdf') || doc?.resourceType === 'pdf') {
      return 'PDF';
    }
    if (url && (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || doc?.resourceType === 'image')) {
      return 'Image';
    }
    return 'File';
  };

  const openDocument = (url, doc) => {
    if (!url) {
      toast.error("Document URL is missing");
      return;
    }
    
    const isPDF = url.toLowerCase().includes('.pdf') || 
                  doc?.resourceType === 'pdf' ||
                  url.includes('application/pdf');
    
    if (isPDF) {
      // Open PDF in new tab
      window.open(url, '_blank');
    } else {
      // Open image or other file in new tab
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Doctor Details" subtitle="Review doctor application">
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-2 text-sm text-[#8F8C8C]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#F33B7D] border-t-transparent"></div>
            Loading doctor details...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!doctor) {
    return (
      <AdminLayout title="Doctor Details" subtitle="Review doctor application">
        <div className="text-center py-12">
          <p className="text-sm text-red-600">Doctor not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={doctor.fullName} subtitle="Review and make approval decision">
      <button
        onClick={() => navigate("/admin/doctor-approval")}
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F33B7D] hover:text-[#d92b6b] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Approvals
      </button>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          {/* Profile Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-[#F33B7D] flex items-center justify-center text-white text-xl font-bold">
              {doctor.fullName?.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg font-semibold text-[#0D0D0D]">{doctor.fullName}</h2>
                {doctor.doctorVerification?.status && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    doctor.doctorVerification.status === 'verified' ? 'bg-green-100 text-green-700' :
                    doctor.doctorVerification.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {doctor.doctorVerification.status.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#8F8C8C] flex items-center gap-1">
                <Stethoscope className="h-3.5 w-3.5" />
                {doctor.specialization || "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Contact Information */}
            <div className="border-b border-[#F0DCE4] pb-4">
              <h3 className="text-sm font-semibold text-[#0D0D0D] mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-[#F33B7D]" />
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#3D3939]">
                  <Mail className="h-4 w-4 text-[#8F8C8C]" />
                  <span>{doctor.email}</span>
                </div>
                {doctor.phone && (
                  <div className="flex items-center gap-2 text-sm text-[#3D3939]">
                    <Phone className="h-4 w-4 text-[#8F8C8C]" />
                    <span>{doctor.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Details */}
            <div className="border-b border-[#F0DCE4] pb-4">
              <h3 className="text-sm font-semibold text-[#0D0D0D] mb-3 flex items-center gap-2">
                <BriefcaseMedical className="h-4 w-4 text-[#F33B7D]" />
                Professional Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-[#8F8C8C]">Specialization:</span>
                  <span className="text-[#0D0D0D] font-medium">{doctor.specialization || "N/A"}</span>
                </div>
                {doctor.hospital && (
                  <div className="flex justify-between py-1">
                    <span className="text-[#8F8C8C]">Hospital/Clinic:</span>
                    <span className="text-[#0D0D0D] font-medium flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-[#8F8C8C]" />
                      {doctor.hospital}
                    </span>
                  </div>
                )}
                {doctor.doctorVerification?.pmdcRegistrationNumber && (
                  <div className="flex justify-between py-1">
                    <span className="text-[#8F8C8C]">PMDC Registration:</span>
                    <span className="text-[#0D0D0D] font-medium flex items-center gap-1">
                      <IdCard className="h-3.5 w-3.5 text-[#8F8C8C]" />
                      {doctor.doctorVerification.pmdcRegistrationNumber}
                    </span>
                  </div>
                )}
                {doctor.doctorVerification?.registrationType && (
                  <div className="flex justify-between py-1">
                    <span className="text-[#8F8C8C]">Registration Type:</span>
                    <span className="text-[#0D0D0D] font-medium">
                      {doctor.doctorVerification.registrationType.charAt(0).toUpperCase() + 
                       doctor.doctorVerification.registrationType.slice(1)}
                    </span>
                  </div>
                )}
                {doctor.yearsOfExperience !== undefined && doctor.yearsOfExperience !== null && (
                  <div className="flex justify-between py-1">
                    <span className="text-[#8F8C8C]">Years of Experience:</span>
                    <span className="text-[#0D0D0D] font-medium flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#8F8C8C]" />
                      {doctor.yearsOfExperience} {doctor.yearsOfExperience === 1 ? 'year' : 'years'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Qualifications Section */}
            {doctor.doctorVerification?.qualifications?.length > 0 && (
              <div className="border-b border-[#F0DCE4] pb-4">
                <h3 className="text-sm font-semibold text-[#0D0D0D] mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#F33B7D]" />
                  Qualifications
                </h3>
                <div className="space-y-3">
                  {doctor.doctorVerification.qualifications.map((qual, index) => (
                    <div key={index} className="bg-[#FEFAFB] p-3 rounded-lg border border-[#F0DCE4]">
                      <p className="text-sm font-medium text-[#0D0D0D]">{qual.degree || "N/A"}</p>
                      <p className="text-sm text-[#8F8C8C]">{qual.institution || "N/A"}</p>
                      {qual.completionYear && (
                        <p className="text-xs text-[#8F8C8C] flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Completed: {qual.completionYear}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Documents Section */}
            {doctor.doctorVerification?.documents?.length > 0 && (
              <div className="border-b border-[#F0DCE4] pb-4">
                <h3 className="text-sm font-semibold text-[#0D0D0D] mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#F33B7D]" />
                  Verification Documents ({doctor.doctorVerification.documents.length})
                </h3>

                <div className="space-y-2">
                  {doctor.doctorVerification.documents.map((doc, index) => {
                    const DocumentIcon = getDocumentIcon(doc);
                    const fileType = getFileType(doc);
                    const hasUrl = doc?.url && doc.url.length > 0;
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[#FEF4F4] rounded-lg hover:bg-[#FDE8EE] transition-colors border border-[#F0DCE4]"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <DocumentIcon className="h-5 w-5 text-[#F33B7D] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-[#0D0D0D] truncate">
                                {doc.type?.replace(/_/g, ' ').toUpperCase() || 'Document ' + (index + 1)}
                              </p>
                              <span className="text-xs bg-[#F33B7D]/10 text-[#F33B7D] px-2 py-0.5 rounded-full flex-shrink-0">
                                {fileType}
                              </span>
                              {!hasUrl && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex-shrink-0">
                                  No URL
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                              {doc.uploadedAt && (
                                <p className="text-xs text-[#8F8C8C] flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                                </p>
                              )}
                              {doc.originalName && (
                                <p className="text-xs text-[#8F8C8C] truncate max-w-xs">
                                  {doc.originalName}
                                </p>
                              )}
                              {doc.publicId && (
                                <p className="text-xs text-[#8F8C8C]">
                                  ID: {doc.publicId.substring(0, 20)}...
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {hasUrl ? (
                            <button
                              onClick={() => openDocument(doc.url, doc)}
                              className="text-sm font-semibold text-[#F33B7D] hover:underline flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-[#F33B7D]/10 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View
                            </button>
                          ) : (
                            <span className="text-sm text-red-500 flex items-center gap-1 px-3 py-1">
                              <AlertCircle className="h-4 w-4" />
                              Missing URL
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bio */}
            {doctor.bio && (
              <div>
                <h3 className="text-sm font-semibold text-[#0D0D0D] mb-2">About</h3>
                <p className="text-sm text-[#3D3939] leading-relaxed">{doctor.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 h-fit sticky top-4">
          <h3 className="text-sm font-semibold text-[#0D0D0D] mb-4">Approval Decision</h3>
          
          <div className="space-y-3">
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#22C55E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#16a34a] disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              {actionLoading ? "Processing..." : "Approve"}
            </button>

            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              <XCircle className="h-4 w-4" />
              {actionLoading ? "Processing..." : "Reject"}
            </button>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[#FEF4F4] text-xs">
            <p className="font-semibold text-[#0D0D0D] mb-2">Review checklist:</p>
            <ul className="space-y-1.5 text-[#8F8C8C]">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-[#22C55E]" />
                Verify identity
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-[#22C55E]" />
                Check specialization
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-[#22C55E]" />
                Review qualifications
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-[#22C55E]" />
                Validate PMDC registration
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-[#22C55E]" />
                Review documents
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}