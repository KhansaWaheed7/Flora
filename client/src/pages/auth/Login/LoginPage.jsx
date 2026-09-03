import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { resendVerification } from "../../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, HeartPulse, ShieldCheck, Users, Clock, AlertCircle, CheckCircle } from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../../services/auth.service";

import { AuthSplitLayout } from "../../../layouts/AuthLayout";
import Label from "../../../components/ui/Label";
import TextField from "../../../components/ui/TextField";
import PasswordField from "../../../components/ui/PasswordField";
import Button from "../../../components/ui/Button";
import WomanPng from "../../../assets/woman.png";

const trustBadges = [
  { icon: HeartPulse, label: "Your Health\nOur Priority" },
  { icon: ShieldCheck, label: "Secure\n& Private" },
  { icon: Users, label: "Trusted by\nThousands" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    login: saveLogin,
    googleLogin: saveGoogleLogin
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: ""
  });
  const [showPendingApproval, setShowPendingApproval] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendingVerification, setResendingVerification] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: "",
      password: ""
    };
    let isValid = true;

    if (!form.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleResendVerification = async () => {
    if (!verificationEmail) return;
    
    try {
      setResendingVerification(true);
      await resendVerification(verificationEmail);
      
      toast.success("Verification email resent successfully! Please check your inbox.", {
        duration: 5000,
        style: {
          background: 'rgba(220, 252, 231, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(134, 239, 172, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(134, 239, 172, 0.15)',
          color: '#166534',
          borderRadius: '16px',
          padding: '16px 24px',
        },
        icon: '📧',
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend verification email. Please try again.",
        {
          style: {
            background: 'rgba(254, 226, 226, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(252, 165, 165, 0.4)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(252, 165, 165, 0.15)',
            color: '#991B1B',
            borderRadius: '16px',
            padding: '16px 24px',
          },
          icon: '❌',
        }
      );
    } finally {
      setResendingVerification(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setFieldErrors({ email: "", password: "" });
    setShowPendingApproval(false);
    setShowEmailVerification(false);

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await saveLogin(form.email, form.password);

      const role = response?.data?.user?.role;

      // Show success toast
      toast.success("Welcome back!", {
        style: {
          background: 'rgba(220, 252, 231, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(134, 239, 172, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(134, 239, 172, 0.15)',
          color: '#166534',
          borderRadius: '16px',
          padding: '16px 24px',
        },
        icon: '✅',
      });

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "";
      const errorCode = err.response?.data?.errorCode || "";

      // Handle email verification
      if (status === 403 && (message.includes("verify your email") || message.includes("email verified"))) {
        setVerificationEmail(form.email);
        setShowEmailVerification(true);
        return;
      }

      // Handle doctor verification statuses
      if (status === 403) {
        if (errorCode === "PENDING_DOCTOR_VERIFICATION" || message.includes("pending")) {
          setPendingEmail(form.email);
          setShowPendingApproval(true);
          return;
        } else if (errorCode === "REJECTED_DOCTOR_VERIFICATION" || message.includes("rejected")) {
          toast.error(
            "Your doctor account application has been rejected. Please contact support for more information.",
            { 
              duration: 6000,
              style: {
                background: 'rgba(254, 226, 226, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(252, 165, 165, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(252, 165, 165, 0.15)',
                color: '#991B1B',
                borderRadius: '16px',
                padding: '16px 24px',
              },
              icon: '❌',
            }
          );
          return;
        } else if (errorCode === "SUSPENDED_DOCTOR_ACCOUNT" || message.includes("suspended")) {
          toast.error(
            "Your doctor account has been suspended. Please contact support.",
            { 
              duration: 6000,
              style: {
                background: 'rgba(254, 226, 226, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(252, 165, 165, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(252, 165, 165, 0.15)',
                color: '#991B1B',
                borderRadius: '16px',
                padding: '16px 24px',
              },
              icon: '🚫',
            }
          );
          return;
        }
      }

      // Handle other errors
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Pending Approval Screen
  if (showPendingApproval) {
    return (
      <AuthSplitLayout
        illustrationSrc={WomanPng}
        illustrationAlt="Woman relaxing with tea"
        heading="Account Pending"
        headingAccent="Approval"
        subtitle="Your doctor registration is being reviewed by our admin team"
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#0D0D0D] mb-2">
            Registration Submitted for Approval
          </h3>
          <p className="text-sm text-[#8F8C8C] max-w-md">
            Your registration as a doctor has been submitted and is waiting for admin's approval.
            It may take a few hours. Once approved, you will be able to log in to your account.
          </p>
          {pendingEmail && (
            <p className="text-xs text-[#B8AEB2] mt-2">
              We'll notify you at <span className="font-semibold text-[#F33B7D]">{pendingEmail}</span> 
              {' '}when your account is approved.
            </p>
          )}
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200 max-w-md">
            <p className="text-xs text-amber-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>You will receive an email notification once your account is verified by an admin.</span>
            </p>
          </div>
          <button
            onClick={() => {
              setShowPendingApproval(false);
              setPendingEmail("");
              navigate("/login");
            }}
            className="mt-6 text-sm font-semibold text-[#F33B7D] hover:underline transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </AuthSplitLayout>
    );
  }

  // Email Verification Screen
  if (showEmailVerification) {
    return (
      <AuthSplitLayout
        illustrationSrc={WomanPng}
        illustrationAlt="Woman relaxing with tea"
        heading="Verify Your"
        headingAccent="Email"
        subtitle="Please verify your email address to continue"
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#0D0D0D] mb-2">
            Email Verification Required
          </h3>
          <p className="text-sm text-[#8F8C8C] max-w-md">
            Please verify your email address before logging in. 
            We've sent a verification link to your email.
          </p>
          {verificationEmail && (
            <p className="text-xs text-[#B8AEB2] mt-2">
              Verification email sent to <span className="font-semibold text-[#F33B7D]">{verificationEmail}</span>
            </p>
          )}
          
          <div className="mt-6 w-full max-w-md space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Check your inbox and click the verification link to activate your account.</span>
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Didn't receive the email? Check your spam folder or request a new one.</span>
              </p>
            </div>

            <button
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="w-full py-2.5 text-sm font-semibold text-white bg-[#F33B7D] rounded-lg hover:bg-[#d92b6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendingVerification ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => {
                setShowEmailVerification(false);
                setVerificationEmail("");
                navigate("/login");
              }}
              className="text-sm font-semibold text-[#F33B7D] hover:underline transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <>
      <AuthSplitLayout
        illustrationSrc={WomanPng}
        illustrationAlt="Woman relaxing with tea"
        heading="Welcome"
        headingAccent="Back!"
        subtitle="Login to continue your journey towards better health."
        leftExtra={
          <div className="mt-8 grid grid-cols-3 gap-3">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#EB6991] shadow-sm">
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
        <div className="flex flex-col items-center justify-center mb-6">
          <h2 className="font-display text-xl font-semibold text-[#0D0D0D] text-center">
            Login
          </h2>
          <p className="mt-1 text-sm text-[#8F8C8C] text-center">
            Welcome back! Please login to your account.
          </p>
        </div>
        
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Email</Label>
            <TextField
              icon={Mail}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={fieldErrors.email ? "border-red-500 focus:border-red-500" : ""}
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <PasswordField
              icon={Lock}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={fieldErrors.password ? "border-red-500 focus:border-red-500" : ""}
              disabled={loading}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-[#3D3939]">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                className="h-3.5 w-3.5 rounded border-[#F33B7D] text-[#F33B7D] focus:ring-[#F33B7D]/30"
                disabled={loading}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-semibold text-[#F33B7D] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-[#B8AEB2]">
          <div className="h-px flex-1 bg-[#F0DCE4]" />
          or continue with
          <div className="h-px flex-1 bg-[#F0DCE4]" />
        </div>

        <div className="mt-2 flex justify-center">
          <div className="w-full">
            <GoogleLogin
              theme="outline"
              size="large"
              shape="rectangular"
              text="continue_with"
              width="100%"
              logo_alignment="center"
              containerProps={{
                style: {
                  width: '100%',
                  borderRadius: '8px'
                }
              }}
              onSuccess={async (credentialResponse) => {
                try {
                  setLoading(true);
                  const response = await googleLogin(
                    credentialResponse.credential
                  );
                  saveGoogleLogin(response.data);
                  toast.success("Welcome back!", {
                    style: {
                      background: 'rgba(220, 252, 231, 0.7)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(134, 239, 172, 0.4)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(134, 239, 172, 0.15)',
                      color: '#166534',
                      borderRadius: '16px',
                      padding: '16px 24px',
                    },
                    icon: '✅',
                  });

                  const role = response?.data?.user?.role;

                  if (role === "admin") {
                    navigate("/admin/dashboard");
                  } else if (role === "doctor") {
                    navigate("/doctor/dashboard");
                  } else {
                    navigate("/dashboard");
                  }
                } catch (err) {
                  const status = err.response?.status;
                  const message = err.response?.data?.message || "";
                  const errorCode = err.response?.data?.errorCode || "";

                  // Handle email verification for Google login
                  if (status === 403 && (message.includes("verify your email") || message.includes("email verified"))) {
                    setVerificationEmail(form.email || "your email");
                    setShowEmailVerification(true);
                    return;
                  }

                  // Handle doctor verification statuses for Google login
                  if (status === 403) {
                    if (errorCode === "PENDING_DOCTOR_VERIFICATION" || message.includes("pending")) {
                      setPendingEmail(form.email || "your email");
                      setShowPendingApproval(true);
                      return;
                    } else if (errorCode === "REJECTED_DOCTOR_VERIFICATION" || message.includes("rejected")) {
                      toast.error(
                        "Your doctor account application has been rejected. Please contact support.",
                        { duration: 6000 }
                      );
                      return;
                    } else if (errorCode === "SUSPENDED_DOCTOR_ACCOUNT" || message.includes("suspended")) {
                      toast.error(
                        "Your doctor account has been suspended. Please contact support.",
                        { duration: 6000 }
                      );
                      return;
                    }
                  }

                  toast.error(
                    err.response?.data?.message ||
                    "Google login failed. Please try again."
                  );
                } finally {
                  setLoading(false);
                }
              }}
              onError={() => {
                toast.error("Google Sign-In failed. Please try again.", {
                  style: {
                    background: 'rgba(254, 226, 226, 0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(252, 165, 165, 0.4)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(252, 165, 165, 0.15)',
                    color: '#991B1B',
                    borderRadius: '16px',
                    padding: '16px 24px',
                  },
                  icon: '❌',
                });
              }}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-[#B8AEB2]">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="font-semibold text-[#F33B7D] hover:underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="font-semibold text-[#F33B7D] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </AuthSplitLayout>

      <p className="relative mt-4 text-center text-sm text-[#8F8C8C]">
        New here?{" "}
        <Link to="/register" className="font-semibold text-[#F33B7D] hover:underline">
          Create an account →
        </Link>
      </p>
    </>
  );
}