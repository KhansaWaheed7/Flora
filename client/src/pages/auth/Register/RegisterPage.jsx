import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Activity,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { register } from "../../../services/auth.service";

import { AuthSplitLayout } from "../../../layouts/AuthLayout";
import Label from "../../../components/ui/Label";
import TextField from "../../../components/ui/TextField";
import PasswordField from "../../../components/ui/PasswordField";
import Button from "../../../components/ui/Button";

const perks = [
  { icon: Activity, text: "Track your cycle and symptoms" },
  { icon: Sparkles, text: "Get AI-powered health insights" },
  { icon: Stethoscope, text: "Connect with expert doctors" },
  { icon: ShieldCheck, text: "100% Secure and private" },
];

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("one number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("one special character");
  return errors;
};

// Custom toast styles
const toastStyles = {
  error: {
    style: {
      background: '#FEE2E2',
      color: '#991B1B',
      border: '1px solid #FCA5A5',
    },
    icon: '❌',
  },
  success: {
    style: {
      background: '#DCFCE7',
      color: '#166534',
      border: '1px solid #86EFAC',
    },
    icon: '✅',
  },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field-specific errors when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // 1. Validate Full Name
    if (!form.name.trim()) {
      errors.name = "Full name is required";
      toast.error("Please enter your full name", { 
        id: "name-error",
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    } else if (form.name.trim().length < 2) {
      errors.name = "Full name must be at least 2 characters";
      toast.error("Name must be at least 2 characters long", { 
        id: "name-error",
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    } else if (form.name.trim().length > 50) {
      errors.name = "Full name must be less than 50 characters";
      toast.error("Name is too long (maximum 50 characters)", { 
        id: "name-error",
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    } else if (!/^[a-zA-Z\s\-']+$/.test(form.name.trim())) {
      errors.name = "Full name can only contain letters, spaces, hyphens, and apostrophes";
      toast.error("Name contains invalid characters", { 
        id: "name-error",
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    }

    // 2. Validate Email
    if (!form.email.trim()) {
      errors.email = "Email is required";
      toast.error("Please enter your email address", { 
        id: "email-error",
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    } else if (!validateEmail(form.email)) {
      errors.email = "Please enter a valid email address";
      toast.error("Please enter a valid email address", { 
        id: "email-error",
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    }

    // 3. Validate Password
    const passwordErrors = validatePassword(form.password);
    if (!form.password) {
      errors.password = "Password is required";
      toast.error("Please create a password", { 
        id: "password-error",
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    } else if (passwordErrors.length > 0) {
      errors.password = `Password must contain ${passwordErrors.join(", ")}`;
      toast.error(`Password must contain: ${passwordErrors.join(", ")}`, { 
        id: "password-error",
        duration: 5000,
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    } else if (form.password.length > 128) {
      errors.password = "Password must be less than 128 characters";
      toast.error("Password is too long", { 
        id: "password-error",
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    }

    // 4. Validate Confirm Password
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      toast.error("Please confirm your password", { 
        id: "confirm-error",
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      toast.error("Passwords do not match", { 
        id: "confirm-error",
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    }

    // 5. Validate Terms
    if (!form.terms) {
      errors.terms = "You must accept the Terms & Conditions";
      toast.error("Please accept the Terms & Conditions", { 
        id: "terms-error",
        duration: 4000,
        style: toastStyles.error.style,
        icon: toastStyles.error.icon,
      });
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setFieldErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    toast.loading("Creating your account...", { 
      id: "register-loading",
      style: {
        background: '#F3F4F6',
        color: '#1F2937',
      },
    });

    try {
      const response = await register({
        fullName: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });

      console.log(response);

      // Dismiss loading toast
      toast.dismiss("register-loading");

      // Success message with green styling
      toast.success(
        (t) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Registration Successful!</span>
            <span className="text-sm">Welcome to Flora! You can now log in to your account.</span>
            {response?.data?.requiresEmailVerification && (
              <span className="text-xs text-gray-600 mt-1">
                Please check your email to verify your account.
              </span>
            )}
          </div>
        ),
        { 
          duration: 5000,
          style: toastStyles.success.style,
          icon: toastStyles.success.icon,
        }
      );

      // Reset form after successful registration
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "patient",
        terms: false,
      });

      // Navigate to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      console.error("Registration error:", error);
      
      // Dismiss loading toast
      toast.dismiss("register-loading");

      // Handle different error scenarios with red styling
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "";
        const errors = error.response.data?.errors || {};

        // Handle field-specific errors from backend
        if (errors.email) {
          const emailError = errors.email;
          setFieldErrors((prev) => ({ ...prev, email: emailError }));
          
          if (emailError.toLowerCase().includes("already") || 
              emailError.toLowerCase().includes("exists")) {
            toast.error(
              (t) => (
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Email Already Registered</span>
                  <span className="text-sm">This email is already in use.</span>
                  <button 
                    onClick={() => {
                      toast.dismiss(t.id);
                      navigate("/login");
                    }}
                    className="text-[#DC2626] font-semibold text-sm mt-1 hover:underline text-left"
                  >
                    Login instead →
                  </button>
                </div>
              ),
              { 
                duration: 5000,
                style: toastStyles.error.style,
                icon: toastStyles.error.icon,
              }
            );
          } else {
            toast.error(emailError, { 
              id: "email-error",
              style: toastStyles.error.style,
              icon: toastStyles.error.icon,
            });
          }
        } else if (errors.fullName) {
          setFieldErrors((prev) => ({ ...prev, name: errors.fullName }));
          toast.error(errors.fullName, { 
            id: "name-error",
            style: toastStyles.error.style,
            icon: toastStyles.error.icon,
          });
        } else if (errors.password) {
          setFieldErrors((prev) => ({ ...prev, password: errors.password }));
          toast.error(errors.password, { 
            id: "password-error",
            duration: 5000,
            style: toastStyles.error.style,
            icon: toastStyles.error.icon,
          });
        } else {
          // Handle common status codes
          if (status === 400) {
            if (message.toLowerCase().includes("email already") || 
                message.toLowerCase().includes("already exists") ||
                message.toLowerCase().includes("already registered")) {
              toast.error(
                (t) => (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Account Already Exists</span>
                    <span className="text-sm">An account with this email already exists.</span>
                    <button 
                      onClick={() => {
                        toast.dismiss(t.id);
                        navigate("/login");
                      }}
                      className="text-[#DC2626] font-semibold text-sm mt-1 hover:underline text-left"
                    >
                      Login instead →
                    </button>
                  </div>
                ),
                { 
                  duration: 5000,
                  style: toastStyles.error.style,
                  icon: toastStyles.error.icon,
                }
              );
              setFieldErrors((prev) => ({ ...prev, email: "Email already exists" }));
            } else {
              toast.error(message || "Invalid registration details. Please check your input.", {
                style: toastStyles.error.style,
                icon: toastStyles.error.icon,
              });
            }
          } else if (status === 409) {
            toast.error(
              (t) => (
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Email Conflict</span>
                  <span className="text-sm">This email is already registered.</span>
                  <button 
                    onClick={() => {
                      toast.dismiss(t.id);
                      navigate("/login");
                    }}
                    className="text-[#DC2626] font-semibold text-sm mt-1 hover:underline text-left"
                  >
                    Login instead →
                  </button>
                </div>
              ),
              { 
                duration: 5000,
                style: toastStyles.error.style,
                icon: toastStyles.error.icon,
              }
            );
            setFieldErrors((prev) => ({ ...prev, email: "Email already exists" }));
          } else if (status === 422) {
            toast.error("Please check all fields and try again.", {
              style: toastStyles.error.style,
              icon: toastStyles.error.icon,
            });
          } else if (status === 429) {
            toast.error("Too many attempts. Please wait a moment before trying again.", {
              style: toastStyles.error.style,
              icon: toastStyles.error.icon,
            });
          } else if (status >= 500) {
            toast.error("Server error. Please try again later.", {
              style: toastStyles.error.style,
              icon: toastStyles.error.icon,
            });
          } else {
            toast.error(message || "Registration failed. Please try again.", {
              style: toastStyles.error.style,
              icon: toastStyles.error.icon,
            });
          }
        }
      } else if (error.request) {
        // Network errors with red styling
        if (!navigator.onLine) {
          toast.error("No internet connection. Please check your network.", {
            style: toastStyles.error.style,
            icon: toastStyles.error.icon,
          });
        } else {
          toast.error("Connection error. Please check your internet and try again.", {
            style: toastStyles.error.style,
            icon: toastStyles.error.icon,
          });
        }
      } else {
        // Other errors with red styling
        toast.error("Registration failed. Please try again.", {
          style: toastStyles.error.style,
          icon: toastStyles.error.icon,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      heading="Create Your"
      headingAccent="Account"
      subtitle="Join Flora and take the first step towards a healthier you."
      leftExtra={
        <ul className="mt-6 w-full space-y-3 text-left">
          {perks.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#EB6991] shadow-sm">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm text-[#3D3939]">{text}</span>
            </li>
          ))}
        </ul>
      }
    >
      <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
        Register
      </h2>
      <p className="mt-0.5 text-sm text-[#8F8C8C]">
        Create your account to get started.
      </p>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit} noValidate>
        <div>
          <Label className="text-xs">Full Name</Label>
          <TextField 
            icon={User} 
            type="text" 
            placeholder="Enter your full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`py-2 text-sm ${fieldErrors.name ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs">Email</Label>
          <TextField 
            icon={Mail} 
            type="email" 
            placeholder="Enter your email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`py-2 text-sm ${fieldErrors.email ? 'border-red-500' : ''}`}
            disabled={isLoading}
            autoComplete="email"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.email}
            </p>
          )}
          {form.email && !fieldErrors.email && validateEmail(form.email) && (
            <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Valid email format
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs">Password</Label>
          <PasswordField
            icon={Lock}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            placeholder="Create a password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`py-2 text-sm ${fieldErrors.password ? 'border-red-500' : ''}`}
            disabled={isLoading}
            autoComplete="new-password"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.password}
            </p>
          )}
          {form.password && !fieldErrors.password && validatePassword(form.password).length === 0 && (
            <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Strong password ✓
            </p>
          )}
          {form.password && validatePassword(form.password).length > 0 && (
            <p className="mt-1 text-xs text-amber-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Password needs: {validatePassword(form.password).join(", ")}
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs">Confirm Password</Label>
          <PasswordField
            icon={Lock}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            placeholder="Confirm your password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`py-2 text-sm ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
            disabled={isLoading}
            autoComplete="new-password"
          />
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.confirmPassword}
            </p>
          )}
          {form.confirmPassword && !fieldErrors.confirmPassword && form.password === form.confirmPassword && (
            <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Passwords match ✓
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs">I am a</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, role: "patient" }));
                setFieldErrors((prev) => ({ ...prev, role: null }));
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                form.role === "patient"
                  ? "border-[#EB6991] bg-[#FEE4EB] text-[#EB6991]"
                  : "border-[#F0DCE4] bg-white text-[#3D3939]"
              }`}
              disabled={isLoading}
            >
              Patient / User
            </button>
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, role: "doctor" }));
                setFieldErrors((prev) => ({ ...prev, role: null }));
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                form.role === "doctor"
                  ? "border-[#EB6991] bg-[#FEE4EB] text-[#EB6991]"
                  : "border-[#F0DCE4] bg-white text-[#3D3939]"
              }`}
              disabled={isLoading}
            >
              Doctor
            </button>
          </div>
        </div>

        <label className="flex items-start gap-1.5 text-xs text-[#3D3939]">
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
            className={`mt-0.5 h-3 w-3 rounded border-[#F0DCE4] text-[#EB6991] focus:ring-[#F33B7D]/30 ${
              fieldErrors.terms ? 'border-red-500' : ''
            }`}
            disabled={isLoading}
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="font-semibold text-[#EB6991] hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-semibold text-[#EB6991] hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {fieldErrors.terms && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {fieldErrors.terms}
          </p>
        )}

        <Button 
          type="submit" 
          className="mt-1 py-2 text-sm"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-[#8F8C8C]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#F33B7D] hover:underline">
          Login →
        </Link>
      </p>
    </AuthSplitLayout>
  );
}