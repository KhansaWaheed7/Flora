import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Link } from "react-router-dom";
import Avatar from "../../components/common/Avatar";
import { useEffect} from "react";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
} from "../../services/profile.service";

import {
  Camera,
  ArrowLeft,
} from "lucide-react";



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
          <option key={o} value={o}>
  {o || "Select"}
</option>
        ))}
      </select>
    </label>
  );
}


export default function EditProfilePage() {
  
  const [saved, setSaved] = useState(false);

const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  bloodGroup: "",
  location: "",
  dateOfBirth: "",
  height: "",
  weight: "",
  allergies: "",
  medicalConditions: "",
});

const [avatar, setAvatar] = useState("");

const fetchProfile = async () => {
  try {
    const res = await getProfile();

    const { user, profile } = res.data;

    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: profile.gender || "",
      bloodGroup: profile.bloodGroup || "",
      location: profile.location || "",
      dateOfBirth: profile.dateOfBirth
        ? profile.dateOfBirth.slice(0,10)
        : "",
      height: profile.height || "",
      weight: profile.weight || "",
      allergies: profile.allergies
        ? profile.allergies.join(", ")
        : "",
      medicalConditions: profile.medicalConditions
        ? profile.medicalConditions.join(", ")
        : "",
    });

    setAvatar(profile.avatar || "");

  } catch(err){
    console.log("Profile fetch error:",err);
  }
};

useEffect(() => {
  fetchProfile();
}, []);

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};



const handleAvatarUpload = async (e) => {
  try {
    const file = e.target.files[0];

    if (!file) return;

    const data = new FormData();
    data.append("avatar", file);

    console.log("Uploading avatar:", file.name, file.type, file.size);

    const res = await uploadAvatar(data);

    console.log("Avatar upload response:", res);

    setAvatar(res.data.avatar);

    await fetchProfile();

  } catch (err) {
    console.error(
      "Avatar upload error:",
      err.response?.data || err.message || err
    );
  }
};


const handleRemoveAvatar = async () => {
  try {
    await removeAvatar();

    setAvatar("");

    await fetchProfile();
  } catch (err) {
    console.log("Avatar removal error:", err);

    const message =
      err.response?.data?.message ||
      "Failed to remove profile picture.";

    alert(message);
  }
};

  const handleSave = async (e) => {
  e.preventDefault();

  try {
    await updateProfile({
      fullName: formData.fullName,
      phone: formData.phone,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      location: formData.location,
      dateOfBirth: formData.dateOfBirth,
      height: formData.height
 ? Number(formData.height)
 : null,

weight: formData.weight
 ? Number(formData.weight)
 : null,
      allergies: formData.allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      medicalConditions: formData.medicalConditions
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    });

    setSaved(true);

    fetchProfile();

    setTimeout(() => {
      setSaved(false);
    }, 2000);

  } catch (err) {
    console.log(err);
  }
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

        <form 
onSubmit={handleSave} 
className="grid grid-cols-1 gap-4 lg:grid-cols-3"
>

<div className="mb-5 flex justify-end lg:col-span-3">
    <button
        type="submit"
        className="rounded-full bg-[#F33B7D] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
    >
        {saved ? "Saved ✓" : "Save Changes"}
    </button>
</div>
          {/* Personal Information */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
            <h2 className="mb-4 font-display text-base font-semibold text-[#0D0D0D]">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
label="Full Name"
name="fullName"
value={formData.fullName}
onChange={handleChange}
/>
              </div>
              <Field
label="Email Address"
name="email"
value={formData.email}
readOnly
/>
              <Field
label="Phone Number"
name="phone"
value={formData.phone}
onChange={handleChange}
/>
              <Field
  label="Date of Birth"
  type="date"
  name="dateOfBirth"
  value={formData.dateOfBirth}
  onChange={handleChange}
/>
              <SelectField
  label="Gender"
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  options={[
  "",
  "Female",
  "Male",
  "Prefer not to say",
]}
/>
              <SelectField
  label="Blood Group"
  name="bloodGroup"
  value={formData.bloodGroup}
  onChange={handleChange}
  options={[
  "",
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
]}
/>
              <div className="sm:col-span-2">
                <Field label="Location" name="location"
value={formData.location}
onChange={handleChange} />
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
              <Avatar
  name={formData.fullName || "User"}
  image={avatar}
  size="h-24 w-24 text-xl"
/>
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
              <input
  type="file"
  id="avatar"
  accept="image/*"
  hidden
  onChange={handleAvatarUpload}
/>
              <label
htmlFor="avatar"
className="mt-4 w-full cursor-pointer rounded-full bg-[#F33B7D] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
>
Change Photo
</label>
{avatar && (
  <button
    type="button"
    onClick={handleRemoveAvatar}
    className="mt-2 w-full rounded-full border border-[#F0DCE4] bg-white px-4 py-2.5 text-xs font-semibold text-[#F33B7D] transition hover:bg-[#FFF5F8]"
  >
    Remove Photo
  </button>
)}
            </div>

            {/* Medical Information */}
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <h2 className="mb-4 font-display text-base font-semibold text-[#0D0D0D]">
                Medical Information{" "}
                <span className="font-normal text-[#B8AEB2]">(Optional)</span>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Height" name="height"
value={formData.height}
onChange={handleChange} />
                <Field label="Weight" name="weight"
value={formData.weight}
onChange={handleChange}/>
                <div className="col-span-2">
                  <Field label="Allergies" name="allergies"
value={formData.allergies}
onChange={handleChange}/>
                </div>
                <div className="col-span-2">
                  <Field label="Medical Conditions" name="medicalConditions"
value={formData.medicalConditions}
onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </DashboardLayout>
  );
}