import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Building2,
  Briefcase,
  CircleCheck,
} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";
import { getAvailableDoctors } from "../../services/chat.service";

function Avatar({ name, image, onClick }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        onClick={onClick}
        className="h-14 w-14 flex-shrink-0 cursor-pointer rounded-full object-cover transition duration-200 hover:scale-105 hover:ring-2 hover:ring-[#F33B7D] hover:ring-offset-2"
      />
    );
  }

  const initials = (name || "Dr")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      onClick={onClick}
      className="flex h-14 w-14 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F33B7D] text-lg font-semibold text-white transition duration-200 hover:scale-105 hover:ring-2 hover:ring-[#F33B7D] hover:ring-offset-2"
    >
      {initials}
    </div>
  );
}

export default function FindDoctor() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getAvailableDoctors();

        setDoctors(list || []);
      } catch (err) {
        console.error("Failed to load doctors:", err);
        setError("Could not load available doctors.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openDoctorProfile = (doctor) => {
    navigate(`/chat/doctors/${doctor._id}`, {
      state: { doctor },
    });
  };

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase();

    return (
      d.fullName?.toLowerCase().includes(q) ||
      d.specialization?.toLowerCase().includes(q) ||
      d.hospital?.toLowerCase().includes(q)
    );
  });

  return (
    <PageLayout
      title="Find a Doctor"
      subtitle="Choose a doctor to start your consultation."
    >
      <div className="mx-auto max-w-4xl">

        {/* Search */}
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialization, or hospital..."
            className="w-full rounded-full border border-[#F0DCE4] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[30vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#FEE4EB] border-t-[#F33B7D]" />

              <p className="mt-3 text-sm text-[#8F8C8C]">
                Loading doctors...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* No Doctors */}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            No doctors found.
          </div>
        )}

        {/* Doctor Cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((doctor) => (
              <div
                key={doctor._id}
                className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
              >
                {/* Doctor Header */}
                <div className="flex items-center gap-3">

                  {/* Clickable Profile Picture */}
                  <Avatar
                    name={doctor.fullName}
                    image={doctor.profilePicture}
                    onClick={() => openDoctorProfile(doctor)}
                  />

                  <div className="min-w-0 flex-1">

                    {/* Doctor Name + Active Badge */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openDoctorProfile(doctor)}
                        className="block min-w-0 max-w-full text-left"
                      >
                        <p className="truncate font-display text-sm font-semibold text-[#0D0D0D] transition hover:text-[#F33B7D]">
                          {doctor.fullName}
                        </p>

                        <p className="truncate text-xs text-[#8F8C8C]">
                          {doctor.specialization || "General Physician"}
                        </p>
                      </button>

                      {/* Active Chat Badge */}
                      {doctor.hasActiveChat && (
                        <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600 ring-1 ring-green-100">
                          <CircleCheck className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="mt-3 space-y-1.5 border-t border-[#F7DCE4] pt-3">

                  {doctor.hospital && (
                    <p className="flex items-center gap-1.5 text-xs text-[#8F8C8C]">
                      <Building2 className="h-3.5 w-3.5" />
                      {doctor.hospital}
                    </p>
                  )}

                  {doctor.yearsOfExperience !== undefined &&
                    doctor.yearsOfExperience !== null && (
                      <p className="flex items-center gap-1.5 text-xs text-[#8F8C8C]">
                        <Briefcase className="h-3.5 w-3.5" />
                        {doctor.yearsOfExperience} years experience
                      </p>
                    )}

                </div>

                {/* View Profile Button */}
                <button
                  type="button"
                  onClick={() => openDoctorProfile(doctor)}
                  className="mt-4 w-full rounded-full bg-[#F33B7D] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_24px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5 hover:bg-[#e82f70]"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
