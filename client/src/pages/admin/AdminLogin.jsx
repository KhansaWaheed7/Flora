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

      /*
       * Adjust these keys if your existing login response
       * uses different names.
       */
      const token =
        data?.accessToken ||
        data?.token ||
        response.data?.accessToken ||
        response.data?.token;

      const user = data?.user || response.data?.user;

      // -----------------------------------------
      // Admin-only check
      // -----------------------------------------

      if (user?.role !== "admin") {
        setError("Access denied. This login is for administrators only.");
        return;
      }

      // -----------------------------------------
      // Store authentication
      // -----------------------------------------

      if (token) {
        // Always store in localStorage for admin
        localStorage.setItem("token", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // -----------------------------------------
      // Go to Admin Dashboard
      // -----------------------------------------

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
    <div className="relative min-h-screen overflow-hidden bg-[#FFF5FA]">

      {/* =========================================
          Decorative Background
      ========================================= */}

      {/* Top-right soft shape */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#FCE0F0] opacity-80" />

      <div className="pointer-events-none absolute -right-32 -top-20 h-60 w-60 rounded-full border-[28px] border-[#F7D1E7] opacity-70" />

      {/* Bottom-left soft shape */}
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#F7C7E4] opacity-80" />

      <div className="pointer-events-none absolute -bottom-32 -left-12 h-64 w-64 rounded-full border-[30px] border-[#FADDED] opacity-80" />

      {/* Left dots */}
      <div className="pointer-events-none absolute left-5 top-5 grid grid-cols-4 gap-2 opacity-70">
        {Array.from({ length: 20 }).map((_, index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-[#E98BC5]"
          />
        ))}
      </div>

      {/* Right bottom dots */}
      <div className="pointer-events-none absolute bottom-24 right-6 grid grid-cols-4 gap-2 opacity-60">
        {Array.from({ length: 20 }).map((_, index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-[#E98BC5]"
          />
        ))}
      </div>

      {/* =========================================
          Decorative Left Branch
      ========================================= */}

      <div className="pointer-events-none absolute bottom-40 left-7 hidden h-72 w-32 opacity-60 lg:block">
        <div className="absolute bottom-0 left-1/2 h-64 w-[2px] rotate-[20deg] bg-[#EAA4C9]" />

        <div className="absolute bottom-10 left-1 h-7 w-16 -rotate-[30deg] rounded-full border-t-2 border-[#EAA4C9]" />
        <div className="absolute bottom-24 left-0 h-7 w-16 -rotate-[35deg] rounded-full border-t-2 border-[#EAA4C9]" />
        <div className="absolute bottom-40 left-5 h-7 w-16 -rotate-[55deg] rounded-full border-t-2 border-[#EAA4C9]" />

        <div className="absolute bottom-16 left-16 h-7 w-16 rotate-[28deg] rounded-full border-t-2 border-[#EAA4C9]" />
        <div className="absolute bottom-32 left-14 h-7 w-16 rotate-[35deg] rounded-full border-t-2 border-[#EAA4C9]" />
        <div className="absolute bottom-50 left-12 h-7 w-16 rotate-[55deg] rounded-full border-t-2 border-[#EAA4C9]" />
      </div>

      {/* =========================================
          Decorative Right Branch
      ========================================= */}

      <div className="pointer-events-none absolute right-8 top-48 hidden h-72 w-32 opacity-55 lg:block">
        <div className="absolute bottom-0 left-1/2 h-64 w-[2px] -rotate-[18deg] bg-[#EAA4C9]" />

        <div className="absolute bottom-12 left-0 h-7 w-16 rotate-[28deg] rounded-full border-t-2 border-[#EAA4C9]" />
        <div className="absolute bottom-28 left-2 h-7 w-16 rotate-[35deg] rounded-full border-t-2 border-[#EAA4C9]" />
        <div className="absolute bottom-44 left-8 h-7 w-16 rotate-[55deg] rounded-full border-t-2 border-[#EAA4C9]" />

        <div className="absolute bottom-20 left-14 h-7 w-16 -rotate-[30deg] rounded-full border-t-2 border-[#EAA4C9]" />
        <div className="absolute bottom-36 left-14 h-7 w-16 -rotate-[35deg] rounded-full border-t-2 border-[#EAA4C9]" />
      </div>

      {/* =========================================
          Main Content
      ========================================= */}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">

        {/* Login Card */}
        <div className="w-full max-w-[390px] rounded-2xl bg-white/95 px-6 py-7 shadow-[0_12px_35px_rgba(180,70,130,0.12)] ring-1 ring-[#F4DCE9] sm:px-8">

          {/* =====================================
              Logo - Updated to match LoginPage.jsx
          ===================================== */}

          <div className="text-center">

            <div className="flex items-center justify-center gap-2.5">
              {/* HeartPulse icon matching LoginPage */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FEE4EB] to-[#FCE0F0] text-[#F33B7D] shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </div>

              {/* flora text - matching LoginPage style */}
              <span className="font-display text-[30px] font-semibold leading-none text-[#F33B7D]">
                flora
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-[#F33B7D]">
              Admin Portal
            </p>

          </div>

          {/* =====================================
              Welcome Text
          ===================================== */}

          <div className="mt-5 text-center">
            <h1 className="font-display text-lg font-semibold text-[#211A2B]">
              Welcome back, Admin!
            </h1>

            <p className="mx-auto mt-1.5 max-w-[245px] text-[10px] leading-4 text-[#8F8C8C]">
              Sign in to access the Flora Admin Dashboard
              and manage the platform.
            </p>
          </div>

          {/* =====================================
              Error
          ===================================== */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-600">
              {error}
            </div>
          )}

          {/* =====================================
              Login Form
          ===================================== */}

          <form
            onSubmit={handleLogin}
            className="mt-6 space-y-4"
          >

            {/* Email */}
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
                />
              </div>
            </div>

            {/* Password */}
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
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8C8C] transition hover:text-[#F33B7D]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#F33B7D] text-xs font-semibold text-white shadow-[0_8px_18px_rgba(243,59,125,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(243,59,125,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck className="h-4 w-4" />

              {loading ? "Signing in..." : "Login"}
            </button>

          </form>

          {/* =====================================
              Secure Access
          ===================================== */}

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#F1E3EA]" />

            <div className="flex items-center gap-1.5 text-[9px] text-[#A69BA3]">
              <ShieldCheck className="h-3 w-3 text-[#F33B7D]" />
              Secure Access
            </div>

            <div className="h-px flex-1 bg-[#F1E3EA]" />
          </div>

          {/* =====================================
              Need Help
          ===================================== */}

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

        </div>

        {/* =========================================
            Footer
        ========================================= */}

        <p className="mt-5 text-[9px] text-[#A89DA5]">
          © 2025 Flora. All rights reserved.
          <span className="ml-1 text-[#F33B7D]">♥</span>
        </p>

      </div>
    </div>
  );
}