import DoctorLayout from "../../layouts/DoctorLayout";

export default function DoctorSchedule() {
  return (
    <DoctorLayout
      title="Schedule"
      subtitle="Manage your availability and consultation schedule."
      showSearch={false}
    >
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#0D0D0D]">
            Doctor Schedule
          </h2>

          <p className="mt-2 text-sm text-[#8F8C8C]">
            Schedule screen coming next.
          </p>
        </div>
      </div>
    </DoctorLayout>
  );
}