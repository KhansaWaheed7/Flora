import { useEffect, useMemo, useState } from "react";
import { Clock, Plus, Save, Trash2, CalendarDays } from "lucide-react";
import DoctorLayout from "../../layouts/DoctorLayout";
import {
  getDoctorSchedule,
  updateDoctorSchedule,
} from "../../services/doctorPortal.service";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const emptySchedule = DAYS.map((name, day) => ({
  day,
  name,
  enabled: false,
  slots: [],
}));

const createSlot = () => ({ start: "09:00", end: "17:00" });

export default function DoctorSchedule() {
  const [schedule, setSchedule] = useState(emptySchedule);
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDoctorSchedule();
        setSchedule(
          (data?.schedule || emptySchedule).map((item) => ({
            ...item,
            name: DAYS[item.day],
            slots: Array.isArray(item.slots) ? item.slots : [],
          }))
        );
        setTimezone(data?.scheduleTimezone || "Asia/Karachi");
      } catch (err) {
        setError(err?.response?.data?.message || "Could not load your schedule.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateDay = (day, changes) => {
    setSchedule((current) =>
      current.map((item) => (item.day === day ? { ...item, ...changes } : item))
    );
  };

  const updateSlot = (day, index, field, value) => {
    setSchedule((current) =>
      current.map((item) => {
        if (item.day !== day) return item;
        const slots = item.slots.map((slot, slotIndex) =>
          slotIndex === index ? { ...slot, [field]: value } : slot
        );
        return { ...item, slots };
      })
    );
  };

  const addSlot = (day) => {
    setSchedule((current) =>
      current.map((item) =>
        item.day === day
          ? { ...item, enabled: true, slots: [...item.slots, createSlot()] }
          : item
      )
    );
  };

  const removeSlot = (day, index) => {
    setSchedule((current) =>
      current.map((item) => {
        if (item.day !== day) return item;
        const slots = item.slots.filter((_, slotIndex) => slotIndex !== index);
        return { ...item, slots, enabled: slots.length > 0 };
      })
    );
  };

  const activeDays = useMemo(
    () => schedule.filter((day) => day.enabled && day.slots.length > 0).length,
    [schedule]
  );

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = schedule.map(({ name, ...day }) => day);
      const data = await updateDoctorSchedule(payload, timezone);
      setSchedule(
        (data?.schedule || payload).map((item) => ({
          ...item,
          name: DAYS[item.day],
        }))
      );
      setMessage("Your weekly schedule has been saved.");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save your schedule.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DoctorLayout title="Schedule" subtitle="Manage your availability and consultation schedule." showSearch={false}>
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#A8849A]">
          Loading your schedule...
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout title="Schedule" subtitle="Manage your weekly availability and consultation schedule." showSearch={false}>
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEE4EB]">
                <CalendarDays className="h-5 w-5 text-[#F33B7D]" />
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-[#3D2A33]">Weekly Availability</h2>
                <p className="mt-1 text-xs text-[#A8849A]">
                  {activeDays} {activeDays === 1 ? "day" : "days"} currently available
                </p>
              </div>
            </div>

            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="rounded-xl border border-[#F0DCE4] bg-white px-3 py-2 text-xs text-[#3D2A33] outline-none focus:border-[#F33B7D]"
            >
              <option value="Asia/Karachi">Pakistan Standard Time (Asia/Karachi)</option>
            </select>
          </div>
        </div>

        {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-100">{message}</div>}
        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">{error}</div>}

        <div className="space-y-3">
          {schedule.map((day) => (
            <div key={day.day} className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <label className="flex min-w-[145px] items-center gap-3">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      updateDay(day.day, {
                        enabled,
                        slots: enabled && day.slots.length === 0 ? [createSlot()] : day.slots,
                      });
                    }}
                    className="h-4 w-4 accent-[#F33B7D]"
                  />
                  <span className="font-semibold text-[#3D2A33]">{day.name}</span>
                </label>

                <div className="flex-1">
                  {!day.enabled ? (
                    <p className="py-1 text-xs text-[#A8849A]">Unavailable</p>
                  ) : (
                    <div className="space-y-2">
                      {day.slots.map((slot, index) => (
                        <div key={`${day.day}-${index}`} className="flex flex-wrap items-center gap-2">
                          <Clock className="h-4 w-4 text-[#F33B7D]" />
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateSlot(day.day, index, "start", e.target.value)}
                            className="rounded-xl border border-[#F0DCE4] px-3 py-2 text-sm text-[#3D2A33] outline-none focus:border-[#F33B7D]"
                          />
                          <span className="text-xs text-[#A8849A]">to</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateSlot(day.day, index, "end", e.target.value)}
                            className="rounded-xl border border-[#F0DCE4] px-3 py-2 text-sm text-[#3D2A33] outline-none focus:border-[#F33B7D]"
                          />
                          <button
                            type="button"
                            onClick={() => removeSlot(day.day, index)}
                            className="rounded-lg p-2 text-[#A8849A] hover:bg-red-50 hover:text-red-500"
                            aria-label={`Remove ${day.name} time slot`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addSlot(day.day)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE4EB] px-3 py-1.5 text-xs font-semibold text-[#F33B7D] hover:bg-[#FCE0E9]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add time
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F33B7D] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-4px_rgba(243,59,125,0.35)] hover:bg-[#d92b6b] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Schedule"}
        </button>
      </div>
    </DoctorLayout>
  );
}
