import React, { useEffect, useRef, useState } from "react";
import { MailCheck } from "lucide-react";
import { AuthSplitLayout, PrimaryButton } from "./AuthLayout";

const CODE_LENGTH = 6;
const EXPIRY_SECONDS = 5 * 60 - 1; // 04:59
const RESEND_SECONDS = 59; // 00:59

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function VerifyEmailPage({ email = "sarah.khan@email.com" }) {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [expiresIn, setExpiresIn] = useState(EXPIRY_SECONDS);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresIn((s) => (s > 0 ? s - 1 : 0));
      setResendIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <AuthSplitLayout
      showBack
      illustrationSrc="/verify-email-illustration.png"
      illustrationAlt="Envelope with a checkmark"
      heading="Verify Your"
      headingAccent="Email"
      subtitle={
        <>
          We've sent a 6-digit verification code to your email address.
          <br />
          <span className="font-semibold text-[#F33B7D]">{email}</span>
        </>
      }
      leftExtra={
        <p className="mt-4 text-xs text-[#8F8C8C]">
          Didn't receive the code? Check your spam folder.
        </p>
      }
    >
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE4EB]">
        <MailCheck className="h-5 w-5 text-[#F33B7D]" />
      </div>
      <h2 className="text-center font-display text-xl font-semibold text-[#0D0D0D]">
        Enter Verification Code
      </h2>
      <p className="mt-1 text-center text-sm text-[#8F8C8C]">
        Enter the 6-digit code sent to your email.
      </p>

      <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-center gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              maxLength={1}
              inputMode="numeric"
              className="h-12 w-11 rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] text-center font-display text-lg font-semibold text-[#0D0D0D] outline-none transition focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
            />
          ))}
        </div>

        <p className="text-center text-xs text-[#8F8C8C]">
          Code expires in{" "}
          <span className="font-semibold text-[#F33B7D]">
            {formatTime(expiresIn)}
          </span>
        </p>

        <PrimaryButton type="submit">Verify Email</PrimaryButton>
      </form>

      <p className="mt-4 text-center text-sm text-[#8F8C8C]">
        {resendIn > 0 ? (
          <span className="font-semibold text-[#F33B7D]">
            Resend Code ({formatTime(resendIn)})
          </span>
        ) : (
          <button type="button" className="font-semibold text-[#F33B7D]">
            Resend Code
          </button>
        )}
      </p>
    </AuthSplitLayout>
  );
}
