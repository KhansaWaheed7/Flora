import React, { useState } from "react";
import { Mail, Mail as MailIcon, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../services/auth.service";
import toast from "react-hot-toast";
import { AuthSplitLayout } from "../../../layouts/AuthLayout";
import Label from "../../../components/ui/Label";
import TextField from "../../../components/ui/TextField";
import PasswordField from "../../../components/ui/PasswordField";
import Button from "../../../components/ui/Button";
import ForgotPng from "../../../assets/forgot.png"


export default function ForgotPasswordPage() {
  const navigate = useNavigate();
const [form, setForm] = useState({
  email: "",
});
const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email) {
    alert("Please enter your email.");
    return;
  }

  try {
    const res = await forgotPassword(form.email);

    alert(
      res.message || "Password reset link has been sent to your email."
    );

    navigate("/login");
  } catch (err) {
    console.error(err);

    toast.success(
      err.response?.data?.message ||
      "Failed to send password reset email."
    );
  }
};

  return (
    <>
      <AuthSplitLayout
        showBack
        illustrationSrc={ForgotPng}
        illustrationAlt="Envelope with a locked padlock"
        heading="Forgot Your"
        headingAccent="Password?"
        subtitle="No worries! Enter your email address and we'll send you a link to reset your password."
      >
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE4EB]">
          <MailIcon className="h-5 w-5 text-[#F33B7D]" />
        </div>
        <h2 className="text-center font-display text-xl font-semibold text-[#0D0D0D]">
          Reset Password Link
        </h2>
        <p className="mt-1 text-center text-sm text-[#8F8C8C]">
          Enter the email address associated with your account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Email</Label>
            <TextField
            icon={Mail}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"/>
          </div>

          <Button type="submit">Send Reset Link</Button>
        </form>

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#FEE4EB] p-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F33B7D]" />
          <p className="text-xs text-[#3D3939]">
            For your security, we will send the reset link to your
            registered email address only.
          </p>
        </div>
      </AuthSplitLayout>
    </>
  );
}