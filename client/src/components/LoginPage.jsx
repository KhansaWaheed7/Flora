import React, { useState } from "react";
import { Mail, Lock, HeartPulse, ShieldCheck, Users } from "lucide-react";
import {
  AuthSplitLayout,
  FieldLabel,
  TextField,
  PasswordField,
  PrimaryButton,
} from "./AuthLayout";

const trustBadges = [
  { icon: HeartPulse, label: "Your Health\nOur Priority" },
  { icon: ShieldCheck, label: "Secure\n& Private" },
  { icon: Users, label: "Trusted by\nThousands" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <AuthSplitLayout
        illustrationSrc="/login-illustration.png"
        illustrationAlt="Woman relaxing with tea"
        heading="Welcome"
        headingAccent="Back!"
        subtitle="Login to continue your journey towards better health."
        leftExtra={
          <div className="mt-8 grid grid-cols-3 gap-3">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#F33B7D] shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="whitespace-pre-line text-[10px] leading-tight text-[#8F8C8C]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        }
      >
        <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
          Login
        </h2>
        <p className="mt-1 text-sm text-[#8F8C8C]">
          Welcome back! Please login to your account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
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
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-[#3D3939]">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-[#F0DCE4] text-[#F33B7D] focus:ring-[#F33B7D]/30"
              />
              Remember me
            </label>
            <a href="/forgot-password" className="font-semibold text-[#F33B7D]">
              Forgot Password?
            </a>
          </div>

          <PrimaryButton type="submit">Login</PrimaryButton>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-[#B8AEB2]">
          <div className="h-px flex-1 bg-[#F0DCE4]" />
          or continue with
          <div className="h-px flex-1 bg-[#F0DCE4]" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {["Google", "Apple", "Facebook"].map((provider) => (
            <button
              key={provider}
              type="button"
              className="rounded-xl border border-[#F0DCE4] bg-white py-2.5 text-xs font-semibold text-[#3D3939] transition hover:bg-[#FEF4F4]"
            >
              {provider}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-[#B8AEB2]">
          By continuing, you agree to our{" "}
          <a href="/terms" className="font-semibold text-[#F33B7D]">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="font-semibold text-[#F33B7D]">
            Privacy Policy
          </a>
          .
        </p>
      </AuthSplitLayout>

      <p className="relative mt-4 text-center text-sm text-[#8F8C8C]">
        New here?{" "}
        <a href="/register" className="font-semibold text-[#F33B7D]">
          Create an account →
        </a>
      </p>
    </>
  );
}
