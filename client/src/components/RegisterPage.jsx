import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Activity,
  Sparkles,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import {
  AuthSplitLayout,
  FieldLabel,
  TextField,
  PasswordField,
  PrimaryButton,
} from "./AuthLayout";

const perks = [
  { icon: Activity, text: "Track your cycle and symptoms" },
  { icon: Sparkles, text: "Get AI-powered health insights" },
  { icon: Stethoscope, text: "Connect with expert doctors" },
  { icon: ShieldCheck, text: "100% Secure and private" },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState("patient");

  return (
    <AuthSplitLayout
      heading="Create Your"
      headingAccent="Account"
      subtitle="Join Flora and take the first step towards a healthier you."
      leftExtra={
        <ul className="mt-8 w-full space-y-4 text-left">
          {perks.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#F33B7D] shadow-sm">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm text-[#3D3939]">{text}</span>
            </li>
          ))}
        </ul>
      }
    >
      <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
        Register
      </h2>
      <p className="mt-1 text-sm text-[#8F8C8C]">
        Create your account to get started.
      </p>

      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <TextField icon={User} type="text" placeholder="Enter your full name" />
        </div>

        <div>
          <FieldLabel>Email</FieldLabel>
          <TextField icon={Mail} type="email" placeholder="Enter your email" />
        </div>

        <div>
          <FieldLabel>Password</FieldLabel>
          <PasswordField
            icon={Lock}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            placeholder="Create a password"
          />
        </div>

        <div>
          <FieldLabel>Confirm Password</FieldLabel>
          <PasswordField
            icon={Lock}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            placeholder="Confirm your password"
          />
        </div>

        <div>
          <FieldLabel>I am a</FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                role === "patient"
                  ? "border-[#F33B7D] bg-[#FEE4EB] text-[#F33B7D]"
                  : "border-[#F0DCE4] bg-white text-[#3D3939]"
              }`}
            >
              Patient / User
            </button>
            <button
              type="button"
              onClick={() => setRole("doctor")}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                role === "doctor"
                  ? "border-[#F33B7D] bg-[#FEE4EB] text-[#F33B7D]"
                  : "border-[#F0DCE4] bg-white text-[#3D3939]"
              }`}
            >
              Doctor
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-[#3D3939]">
          <input
            type="checkbox"
            className="mt-0.5 h-3.5 w-3.5 rounded border-[#F0DCE4] text-[#F33B7D] focus:ring-[#F33B7D]/30"
          />
          I agree to the{" "}
          <a href="/terms" className="font-semibold text-[#F33B7D]">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="font-semibold text-[#F33B7D]">
            Privacy Policy
          </a>
        </label>

        <PrimaryButton type="submit">Create Account</PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-[#8F8C8C]">
        Already have an account?{" "}
        <a href="/login" className="font-semibold text-[#F33B7D]">
          Login →
        </a>
      </p>
    </AuthSplitLayout>
  );
}
