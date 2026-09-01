import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { getPendingDoctors } from "../../services/admin.service";
import { Mail, Stethoscope, Eye } from "lucide-react";

export default function DoctorApproval() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await getPendingDoctors();
        setDoctors(res.data?.doctors || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load pending doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Doctor Approval" subtitle="Review and approve pending doctor applications">
        <div className="flex justify-center py-12">
          <p className="text-sm text-[#8F8C8C]">Loading pending applications...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Doctor Approval" subtitle="Review and approve pending doctor applications">
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 overflow-hidden">
        {doctors.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-[#8F8C8C]">No pending doctor applications</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0DCE4]">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="p-5 hover:bg-[#FEF4F4] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-full bg-[#F33B7D] flex items-center justify-center text-white font-bold">
                        {doctor.fullName?.charAt(0) || "D"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0D0D0D]">{doctor.fullName}</p>
                        <p className="text-xs text-[#8F8C8C]">{doctor.specialization}</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-[#3D3939]">
                        <Mail className="h-4 w-4 text-[#8F8C8C]" />
                        {doctor.email}
                      </div>
                      {doctor.hospital && (
                        <div className="flex items-center gap-2 text-[#3D3939]">
                          <Stethoscope className="h-4 w-4 text-[#8F8C8C]" />
                          {doctor.hospital}
                        </div>
                      )}
                      {doctor.licenseNumber && (
                        <div className="text-xs text-[#8F8C8C]">
                          License: {doctor.licenseNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/admin/doctor-details/${doctor._id}`}
                      className="flex items-center gap-2 rounded-lg bg-[#F33B7D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#d92b6b] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
