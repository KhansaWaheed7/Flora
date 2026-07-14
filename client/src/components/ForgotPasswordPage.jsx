import React from "react";
import { Mail, Mail as MailIcon, ShieldCheck } from "lucide-react";
import {
  AuthSplitLayout,
  FieldLabel,
  TextField,
  PrimaryButton,
} from "./AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthSplitLayout
        showBack
        illustrationSrc="/forgot-password-illustration.png"
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

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <FieldLabel>Email</FieldLabel>
            <TextField icon={Mail} type="email" placeholder="Enter your email" />
          </div>

          <PrimaryButton type="submit">Send Reset Link</PrimaryButton>
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
