import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, Briefcase } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { getAvailableDoctors } from "../../services/chat.service";

function Avatar({ name, image }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
      />
    );
  }
  const initials = (name || "Dr")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-lg font-semibold text-white">
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
        setError("Could not load available doctors.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialization, or hospital..."
            className="w-full rounded-full border border-[#F0DCE4] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
          />
        </div>

        {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#8F8C8C] shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            No doctors found.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((doctor) => (
            <div
              key={doctor._id}
              className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
            >
              <div className="flex items-center gap-3">
                <Avatar name={doctor.fullName} image={doctor.profilePicture} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-[#0D0D0D]">
                    Dr. {doctor.fullName}
                  </p>
                  <p className="truncate text-xs text-[#8F8C8C]">
                    {doctor.specialization || "General Physician"}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 border-t border-[#F7DCE4] pt-3">
                {doctor.hospital && (
                  <p className="flex items-center gap-1.5 text-xs text-[#8F8C8C]">
                    <Building2 className="h-3.5 w-3.5" /> {doctor.hospital}
                  </p>
                )}
                {doctor.yearsOfExperience !== undefined && (
                  <p className="flex items-center gap-1.5 text-xs text-[#8F8C8C]">
                    <Briefcase className="h-3.5 w-3.5" />{" "}
                    {doctor.yearsOfExperience} years experience
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  navigate(`/chat/doctors/${doctor._id}`, {
                    state: { doctor },
                  })
                }
                className="mt-4 w-full rounded-full bg-[#F33B7D] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_24px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
