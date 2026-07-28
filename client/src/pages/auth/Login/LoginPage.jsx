import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { login } from "../../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, HeartPulse, ShieldCheck, Users } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../../services/auth.service";

import { AuthSplitLayout } from "../../../layouts/AuthLayout";
import Label from "../../../components/ui/Label";
import TextField from "../../../components/ui/TextField";
import PasswordField from "../../../components/ui/PasswordField";
import Button from "../../../components/ui/Button";
import FloraLogo from "../../../components/common/Logo"
import WomanPng from "../../../assets/woman.png"

const trustBadges = [
  { icon: HeartPulse, label: "Your Health\nOur Priority" },
  { icon: ShieldCheck, label: "Secure\n& Private" },
  { icon: Users, label: "Trusted by\nThousands" },
];

export default function LoginPage() {
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });


const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  try {
    setLoading(true);

    await login(
      form.email,
      form.password
    );

    navigate("/dashboard");

  } catch (err) {

    setError(
      err.response?.data?.message ||
      "Login failed."
    );

  } finally {

    setLoading(false);

  }
};

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
   
  };



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
        <div className="flex justify-center mb-6">
          <FloraLogo />
        </div>

        <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
          Login
        </h2>
        <p className="mt-1 text-sm text-[#8F8C8C]">
          Welcome back! Please login to your account.
        </p>
        {
  error && (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {error}
    </div>
  )
}

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
            />
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
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-[#3D3939]">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                className="h-3.5 w-3.5 rounded border-[#F33B7D] text-[#F33B7D] focus:ring-[#F33B7D]/30"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-semibold text-[#F33B7D]">
              Forgot Password?
            </Link>
          </div>

          {error && (
  <p className="text-sm text-red-500">
    {error}
  </p>
)}
          <Button type="submit" disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-[#B8AEB2]">
          <div className="h-px flex-1 bg-[#F0DCE4]" />
          or continue with
          <div className="h-px flex-1 bg-[#F0DCE4]" />
        </div>


        <div className="mt-2 flex justify-center px-4 sm:px-0">
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
          borderRadius: '8px',
          width: '100%'
        }
      }}
      onSuccess={async (credentialResponse) => {
        try {
          setLoading(true);
          const response = await googleLogin(
            credentialResponse.credential
          );
          login(
            response.data.accessToken,
            response.data.refreshToken,
            response.data.user
          );
          toast.success("Welcome back!");
          navigate("/dashboard");
        } catch (err) {
          toast.error(
            err.response?.data?.message ||
            "Google login failed."
          );
        } finally {
          setLoading(false);
        }
      }}
      onError={() => {
        toast.error("Google Sign-In failed.");
      }}
    />
  </div>
</div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-[#B8AEB2]">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="font-semibold text-[#F33B7D]">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="font-semibold text-[#F33B7D]">
            Privacy Policy
          </Link>
          .
        </p>
      </AuthSplitLayout>

      <p className="relative mt-4 text-center text-sm text-[#8F8C8C]">
        New here?{" "}
        <Link to="/register" className="font-semibold text-[#F33B7D]">
          Create an account →
        </Link>
      </p>
    </>
  );
}