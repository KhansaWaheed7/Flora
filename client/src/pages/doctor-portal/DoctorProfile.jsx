import DoctorLayout from "../../layouts/DoctorLayout";

export default function DoctorProfile() {
  return (
    <DoctorLayout
      title="Profile"
      subtitle="View and manage your professional profile."
      showSearch={false}
    >
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#0D0D0D]">
            Doctor Profile
          </h2>

          <p className="mt-2 text-sm text-[#8F8C8C]">
            Profile screen coming next.
          </p>
        </div>
      </div>
    </DoctorLayout>
  );
}