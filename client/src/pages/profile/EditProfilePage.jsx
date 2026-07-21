import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Link } from "react-router-dom";
import Avatar from "../../components/common/Avatar";

import {
  Camera,
  ArrowLeft,
} from "lucide-react";

// Sample reminders data (you can import from your data file)
const reminders = [
  { title: "Take Prenatal Vitamins", time: "Today, 8:00 AM" },
  { title: "Doctor's Appointment", time: "Tomorrow, 10:00 AM" },
  { title: "Fertility Check", time: "May 22, 2:00 PM" },
];

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#3D3939]">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-[#F0DCE4] bg-white px-3 py-2.5 text-sm text-[#0D0D0D] outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
      />
    </label>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#3D3939]">{label}</span>
      <select
        {...props}
        className="w-full rounded-xl border border-[#F0DCE4] bg-white px-3 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#EB6991]"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
const storedUser = JSON.parse(localStorage.getItem("user")) || {};

const user = {
  name: storedUser.fullName || "",
  email: storedUser.email || "",
  phone: storedUser.phone || "",
  gender: storedUser.gender || "",
  bloodGroup: storedUser.bloodGroup || "",
  location: storedUser.location || "",
  dateOfBirth: storedUser.dateOfBirth || "",
};

export default function EditProfilePage() {
  
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
<DashboardLayout
    title="Edit Profile"
    subtitle="Update your personal information."
>

        <Link
          to="/profile"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#8F8C8C] hover:text-[#F33B7D]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <div className="mb-5 flex justify-end">
    <button
        onClick={handleSave}
        className="rounded-full bg-[#F33B7D] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
    >
        {saved ? "Saved ✓" : "Save Changes"}
    </button>
</div>
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Personal Information */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
            <h2 className="mb-4 font-display text-base font-semibold text-[#0D0D0D]">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Full Name" defaultValue={user.name} />
              </div>
              <Field label="Email Address" type="email" defaultValue={user.email} />
              <Field label="Phone Number" type="tel" defaultValue={user.phone} />
              <Field label="Date of Birth" type="date" defaultValue={user.dateOfBirth} />
              <SelectField
              label="Gender"
              defaultValue={user.gender}
              options={[
        "Female",
        "Male",
        "Prefer not to say",
    ]}
/>
              <SelectField
    label="Blood Group"
    defaultValue={user.bloodGroup}
    options={[
        "B+",
        "A+",
        "O+",
        "AB+",
        "B-",
        "A-",
        "O-",
        "AB-",
    ]}
/>
              <div className="sm:col-span-2">
                <Field label="Location" defaultValue={user.location} />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <h2 className="mb-4 self-start font-display text-base font-semibold text-[#0D0D0D]">
                Profile Picture
              </h2>
              <div className="relative">
                <Avatar name={user.name} size="h-24 w-24 text-xl" />
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#F33B7D] text-white shadow-[0_4px_10px_rgba(243,59,125,0.4)]"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-4 text-[10px] text-[#B8AEB2]">
                JPG, PNG or GIF. Max size 2MB.
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-full bg-[#F33B7D] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
              >
                Change Photo
              </button>
            </div>

            {/* Medical Information */}
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <h2 className="mb-4 font-display text-base font-semibold text-[#0D0D0D]">
                Medical Information{" "}
                <span className="font-normal text-[#B8AEB2]">(Optional)</span>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Height" placeholder="165 cm" />
                <Field label="Weight" placeholder="58 kg" />
                <div className="col-span-2">
                  <Field label="Allergies" placeholder="No known allergies" />
                </div>
                <div className="col-span-2">
                  <Field label="Medical Conditions" placeholder="None" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </DashboardLayout>
  );
}