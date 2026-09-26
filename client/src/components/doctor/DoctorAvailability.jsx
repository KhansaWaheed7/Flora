import { CalendarDays, Clock } from "lucide-react";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorAvailability({ schedule = [], compact = false }) {
  const byName = new Map(schedule.map((day) => [day.name, day]));
  const days = DAY_ORDER.map((name) => byName.get(name) || { name, enabled: false, slots: [] });

  const availableDays = days.filter((day) => day.enabled && day.slots?.length);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEE4EB]">
          <CalendarDays className="h-5 w-5 text-[#F33B7D]" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">Availability</h2>
          <p className="text-sm text-[#8F8C8C]">Weekly consultation hours</p>
        </div>
      </div>

      {availableDays.length === 0 ? (
        <p className="mt-4 rounded-xl bg-[#FEF4F4] p-4 text-sm text-[#8F8C8C]">
          This doctor has not added weekly availability yet.
        </p>
      ) : (
        <div className={`mt-4 ${compact ? "space-y-2" : "space-y-3"}`}>
          {days.map((day) => (
            <div key={day.name} className="flex flex-col gap-2 rounded-xl bg-[#FEF4F4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-semibold text-[#3D2A33]">{day.name}</span>
              {day.enabled && day.slots?.length ? (
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#5F5A5D] ring-1 ring-[#F0DCE4]">
                      <Clock className="h-3 w-3 text-[#F33B7D]" />
                      {slot.start} – {slot.end}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-[#B8AEB2]">Unavailable</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
