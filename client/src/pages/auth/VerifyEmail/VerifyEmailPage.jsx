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
  }, [token]);

  const handleLoginRedirect = () => {
    toast.success("Redirecting to login...");
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

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
        <div className="mt-6 text-center">
          <p className="text-sm text-[#8F8C8C] mb-3">
            Your email has been successfully verified. You can now log in to your account.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="rounded-xl bg-[#F33B7D] px-8 py-3 font-medium text-white transition hover:opacity-90 hover:shadow-lg"
          >
            Login Now
          </button>
        </div>
      )}

      {!loading && !success && (
        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl bg-[#F33B7D] px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Back to Login
          </button>
          <div>
            <button
              onClick={() => navigate("/resend-verification")}
              className="text-sm text-[#F33B7D] hover:underline"
            >
              Resend verification email
            </button>
          </div>
        </div>
      )}
    </AuthSplitLayout>
  );
}