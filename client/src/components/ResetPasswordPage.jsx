import React, { useMemo, useState } from "react";
import { Lock, KeyRound, Check } from "lucide-react";
import {
  AuthSplitLayout,
  FieldLabel,
  PasswordField,
  PrimaryButton,
} from "./AuthLayout";

const requirements = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", test: (v) => /[0-9]/.test(v) },
  { label: "One special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = useMemo(() => {
    const passed = requirements.filter((r) => r.test(password)).length;
    if (password.length === 0) return { label: "", pct: 0, color: "#F0DCE4" };
    if (passed <= 1) return { label: "Weak", pct: 25, color: "#F33B7D" };
    if (passed === 2) return { label: "Fair", pct: 50, color: "#F5A623" };
    if (passed === 3) return { label: "Good", pct: 75, color: "#22C55E" };
    return { label: "Strong", pct: 100, color: "#16A34A" };
  }, [password]);

  return (
    <AuthSplitLayout
      illustrationSrc="/reset-password-illustration.png"
      illustrationAlt="Padlock illustration"
      heading="Create New"
      headingAccent="Password"
      subtitle="Your new password must be different from previous used passwords."
    >
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE4EB]">
        <KeyRound className="h-5 w-5 text-[#F33B7D]" />
      </div>
      <h2 className="text-center font-display text-xl font-semibold text-[#0D0D0D]">
        Reset Your Password
      </h2>
      <p className="mt-1 text-center text-sm text-[#8F8C8C]">
        Enter your new password below.
      </p>

      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <FieldLabel>New Password</FieldLabel>
          <PasswordField
            icon={Lock}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F0DCE4]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${strength.pct}%`, backgroundColor: strength.color }}
                />
              </div>
              <span
                className="text-xs font-semibold"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <div>
          <FieldLabel>Confirm New Password</FieldLabel>
          <PasswordField
            icon={Lock}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-[#3D3939]">
            Password must contain:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {requirements.map(({ label, test }) => {
              const passed = test(password);
              return (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 text-xs ${
                    passed ? "text-green-600" : "text-[#B8AEB2]"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                      passed ? "bg-green-100" : "bg-[#F0DCE4]"
                    }`}
                  >
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        <PrimaryButton type="submit">Reset Password</PrimaryButton>
      </form>
    </AuthSplitLayout>
  );
}
