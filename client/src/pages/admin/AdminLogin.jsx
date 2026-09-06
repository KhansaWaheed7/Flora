import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Headphones,
} from "lucide-react";

import api from "../../api/axios";
import { AuthSplitLayout } from "../../layouts/AuthLayout";
import WomanPng from "../../assets/woman.png";

// Reusing the same trustBadges or creating admin-specific ones
const adminTrustBadges = [
  { icon: ShieldCheck, label: "Secure\nAccess" },
  { icon: Headphones, label: "24/7\nSupport" },
  { icon: ShieldCheck, label: "Admin\nControl" },
];

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const data = response.data?.data || response.data;

      const token =
        data?.accessToken ||
        data?.token ||
        response.data?.accessToken ||
        response.data?.token;

      const user = data?.user || response.data?.user;

      if (user?.role !== "admin") {
        setError("Access denied. This login is for administrators only.");
        return;
      }

      if (token) {
        localStorage.removeItem("token");
        localStorage.setItem("accessToken", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      console.log("Admin login successful");
      console.log("Admin user:", user);
      console.log("Admin token stored:", !!token);

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Admin login failed:", err);

      setError(
        err?.response?.data?.message ||
          "Invalid admin email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      illustrationSrc={WomanPng}
      illustrationAlt="Woman relaxing with tea"
      heading="Admin"
      headingAccent="Portal"
      subtitle="Sign in to access the Flora Admin Dashboard and manage the platform."
      leftExtra={
        <div className="mt-8 grid grid-cols-3 gap-3">
          {adminTrustBadges.map(({ icon: Icon, label }) => (
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
          Admin Login
        </h2>
        <p className="mt-1 text-sm text-[#8F8C8C] text-center">
          Welcome back! Please login to your admin account.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleLogin}>
        <div>
          <label
            htmlFor="admin-email"
            className="mb-1.5 block text-[11px] font-semibold text-[#443C48]"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D95EAE]" />
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter admin email"
              autoComplete="email"
              className="h-9 w-full rounded-lg border border-[#EEDCE7] bg-white pl-10 pr-3 text-xs text-[#3D3540] outline-none transition placeholder:text-[#B9AEB5] focus:border-[#F33B7D] focus:ring-2 focus:ring-[#FCE4F0]"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-1.5 block text-[11px] font-semibold text-[#443C48]"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D95EAE]" />
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter password"
              autoComplete="current-password"
              className="h-9 w-full rounded-lg border border-[#EEDCE7] bg-white pl-10 pr-10 text-xs text-[#3D3540] outline-none transition placeholder:text-[#B9AEB5] focus:border-[#F33B7D] focus:ring-2 focus:ring-[#FCE4F0]"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8C8C] transition hover:text-[#F33B7D]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#F33B7D] text-xs font-semibold text-white shadow-[0_8px_18px_rgba(243,59,125,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(243,59,125,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShieldCheck className="h-4 w-4" />
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-[#B8AEB2]">
        <div className="h-px flex-1 bg-[#F0DCE4]" />
        Secure Admin Access
        <div className="h-px flex-1 bg-[#F0DCE4]" />
      </div>

      <div className="rounded-lg border border-[#F5DDEA] bg-[#FFF1F8] px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white">
            <Headphones className="h-4 w-4 text-[#F33B7D]" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#F33B7D]">
              Need help?
            </p>
            <p className="mt-0.5 text-[9px] text-[#766B74]">
              Contact the system administrator for assistance.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-[#B8AEB2]">
        By continuing, you agree to our{" "}
        <a href="/terms" className="font-semibold text-[#F33B7D] hover:underline">
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="/privacy" className="font-semibold text-[#F33B7D] hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </AuthSplitLayout>
  );
}