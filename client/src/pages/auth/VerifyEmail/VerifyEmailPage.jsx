import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import { MailCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { AuthSplitLayout } from "../../../layouts/AuthLayout";
import VerifyPng from "../../../assets/verify.png";

import { verifyEmail } from "../../../services/auth.service";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();

const hasVerified = useRef(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (hasVerified.current) return;
  hasVerified.current = true;
    const verify = async () => {
      try {
        const res = await verifyEmail(token);

        setSuccess(true);
        setMessage(
          res.message || "Your email has been verified successfully."
        );

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (err) {
        setSuccess(false);

        setMessage(
          err.response?.data?.message ||
            "Verification link is invalid or has expired."
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <AuthSplitLayout
      illustrationSrc={VerifyPng}
      illustrationAlt="Verify Email"
      heading="Verify Your"
      headingAccent="Email"
      subtitle="Please wait while we verify your Flora account."
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE4EB]">
        {loading ? (
          <Loader2 className="h-7 w-7 animate-spin text-[#F33B7D]" />
        ) : success ? (
          <CheckCircle2 className="h-7 w-7 text-green-500" />
        ) : (
          <XCircle className="h-7 w-7 text-red-500" />
        )}
      </div>

      <h2 className="text-center font-display text-2xl font-semibold text-[#0D0D0D]">
        {loading
          ? "Verifying..."
          : success
          ? "Email Verified!"
          : "Verification Failed"}
      </h2>

      <p className="mt-3 text-center text-sm leading-relaxed text-[#8F8C8C]">
        {message}
      </p>

      {success && (
        <p className="mt-4 text-center text-sm font-medium text-[#F33B7D]">
          Redirecting to Dashboard...
        </p>
      )}

      {!loading && !success && (
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl bg-[#F33B7D] px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Back to Login
          </button>
        </div>
      )}
    </AuthSplitLayout>
  );
}