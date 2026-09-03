import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
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
  Building2,
  IdCard,
  BriefcaseMedical,
} from "lucide-react";

import { registerWithFiles } from "../../../services/auth.service";
import { AuthSplitLayout } from "../../../layouts/AuthLayout";
import Label from "../../../components/ui/Label";
import TextField from "../../../components/ui/TextField";
import PasswordField from "../../../components/ui/PasswordField";
import Button from "../../../components/ui/Button";
import DoctorDocumentUpload from "../../../components/auth/DoctorDocumentUpload";

const perks = [
  { icon: Activity, text: "Track your cycle and symptoms" },
  { icon: Sparkles, text: "Get AI-powered health insights" },
  { icon: Stethoscope, text: "Connect with expert doctors" },
  { icon: ShieldCheck, text: "100% Secure and private" },
];

// =========================================
// Validation Helpers
// =========================================

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("one special character");
  }

  return errors;
};

// =========================================
// Initial Form
// =========================================

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user",

  // Doctor fields
  specialization: "",
  hospital: "",
  yearsOfExperience: "",
  pmdcRegistrationNumber: "",
  registrationType: "",

  qualifications: [
    {
      degree: "",
      institution: "",
      completionYear: "",
    },
  ],

  terms: false,
};

// =========================================
// Component
// =========================================

export default function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [documents, setDocuments] = useState([]);

  const [form, setForm] = useState(initialForm);

  // =========================================
  // Handle Input Changes
  // =========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user edits field
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // =========================================
  // Handle Doctor Documents
  // =========================================

  const handleDocumentsChange = (newDocuments) => {
    setDocuments(newDocuments);

    if (fieldErrors.documents) {
      setFieldErrors((prev) => ({
        ...prev,
        documents: null,
      }));
    }
  };

  // =========================================
  // Validate Form
  // =========================================

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // -----------------------------------------
    // Full Name
    // -----------------------------------------

    if (!form.name.trim()) {
      errors.name = "Full name is required";
      isValid = false;
    } else if (form.name.trim().length < 2) {
      errors.name = "Full name must be at least 2 characters";
      isValid = false;
    } else if (form.name.trim().length > 50) {
      errors.name = "Full name must be less than 50 characters";
      isValid = false;
    } else if (!/^[a-zA-Z\s\-']+$/.test(form.name.trim())) {
      errors.name =
        "Full name can only contain letters, spaces, hyphens, and apostrophes";
      isValid = false;
    }

    // -----------------------------------------
    // Email
    // -----------------------------------------

    if (!form.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(form.email.trim())) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // -----------------------------------------
    // Password
    // -----------------------------------------

    const passwordErrors = validatePassword(form.password);

    if (!form.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (passwordErrors.length > 0) {
      errors.password = `Password must contain ${passwordErrors.join(", ")}`;
      isValid = false;
    } else if (form.password.length > 128) {
      errors.password = "Password must be less than 128 characters";
      isValid = false;
    }

    // -----------------------------------------
    // Confirm Password
    // -----------------------------------------

    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // -----------------------------------------
    // Terms
    // -----------------------------------------

    if (!form.terms) {
      errors.terms = "You must accept the Terms & Conditions";
      isValid = false;
    }

    // =========================================
    // Doctor Validation
    // =========================================

    if (form.role === "doctor") {
      // Specialization
      if (!form.specialization.trim()) {
        errors.specialization = "Specialization is required";
        isValid = false;
      }

      // Hospital
      if (!form.hospital.trim()) {
        errors.hospital = "Hospital or clinic is required";
        isValid = false;
      }

      // Years of Experience
      if (form.yearsOfExperience === "") {
        errors.yearsOfExperience = "Years of experience is required";
        isValid = false;
      } else {
        const experience = Number(form.yearsOfExperience);

        if (!Number.isInteger(experience) || experience < 0) {
          errors.yearsOfExperience =
            "Years of experience must be a whole number";
          isValid = false;
        }
      }

      // PMDC Registration Number
      if (!form.pmdcRegistrationNumber.trim()) {
        errors.pmdcRegistrationNumber =
          "PMDC registration number is required";
        isValid = false;
      }

      // Registration Type
      if (!form.registrationType) {
        errors.registrationType = "Registration type is required";
        isValid = false;
      }

      // Qualifications
      if (!form.qualifications.length) {
        errors.qualifications =
          "At least one medical qualification is required";
        isValid = false;
      }

      form.qualifications.forEach((qualification, index) => {
        if (!qualification.degree.trim()) {
          errors[`qualification_degree_${index}`] = "Degree is required";
          isValid = false;
        }

        if (!qualification.institution.trim()) {
          errors[`qualification_institution_${index}`] =
            "Institution is required";
          isValid = false;
        }

        if (!qualification.completionYear) {
          errors[`qualification_year_${index}`] =
            "Completion year is required";
          isValid = false;
        } else {
          const year = Number(qualification.completionYear);
          const currentYear = new Date().getFullYear();

          if (
            !Number.isInteger(year) ||
            year < 1950 ||
            year > currentYear
          ) {
            errors[`qualification_year_${index}`] =
              "Please enter a valid completion year";
            isValid = false;
          }
        }
      });

      // Documents
      if (documents.length === 0) {
        errors.documents =
          "Please upload at least one verification document";
        isValid = false;
      } else {
        const hasInvalidDocument = documents.some(
          (doc) => !doc.documentType
        );

        if (hasInvalidDocument) {
          errors.documents =
            "Please select a document type for each uploaded file";
          isValid = false;
        }
      }
    }

    setFieldErrors(errors);

    return isValid;
  };

  // =========================================
  // Backend Error Helpers
  // =========================================

  const showErrorToast = (message, icon = "") => {
    toast.error(message, {
      style: {
        background: "rgba(254, 226, 226, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(252, 165, 165, 0.4)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(252, 165, 165, 0.15)",
        color: "#991B1B",
        borderRadius: "16px",
        padding: "16px 24px",
      },
      icon,
    });
  };

  // =========================================
  // Map Backend Validation Errors
  // =========================================

  const handleBackendValidationErrors = (backendErrors) => {
    console.log("Backend validation errors:", backendErrors);

    const mappedErrors = {};

    // -----------------------------------------
    // Case 1:
    // Zod returns an array of issues
    // -----------------------------------------

    if (Array.isArray(backendErrors)) {
      backendErrors.forEach((err) => {
        const path = err?.path?.[0];
        const message = err?.message || "Invalid value";

        if (path === "fullName") {
          mappedErrors.name = message;
        } else if (path === "email") {
          mappedErrors.email = message;
        } else if (path === "password") {
          mappedErrors.password = message;
        } else if (path === "specialization") {
          mappedErrors.specialization = message;
        } else if (path === "hospital") {
          mappedErrors.hospital = message;
        } else if (path === "yearsOfExperience") {
          mappedErrors.yearsOfExperience = message;
        } else if (path === "pmdcRegistrationNumber") {
          mappedErrors.pmdcRegistrationNumber = message;
        } else if (path === "registrationType") {
          mappedErrors.registrationType = message;
        } else if (path === "qualifications") {
          mappedErrors.qualifications = message;
        } else if (path === "terms") {
          mappedErrors.terms = message;
        } else {
          showErrorToast(message);
        }
      });

      setFieldErrors((prev) => ({
        ...prev,
        ...mappedErrors,
      }));

      return true;
    }

    // -----------------------------------------
    // Case 2:
    // Zod flatten().fieldErrors returns object
    //
    // Example:
    // {
    //   email: ["Invalid email"],
    //   password: ["Password too short"]
    // }
    // -----------------------------------------

    if (
      backendErrors &&
      typeof backendErrors === "object" &&
      !Array.isArray(backendErrors)
    ) {
      Object.entries(backendErrors).forEach(([field, value]) => {
        let message = "Invalid value";

        if (Array.isArray(value)) {
          message = value[0] || "Invalid value";
        } else if (typeof value === "string") {
          message = value;
        } else if (value?.message) {
          message = value.message;
        }

        // Backend -> Frontend field mapping
        if (field === "fullName") {
          mappedErrors.name = message;
        } else if (field.startsWith("qualification")) {
          mappedErrors[field] = message;
        } else {
          mappedErrors[field] = message;
        }
      });

      setFieldErrors((prev) => ({
        ...prev,
        ...mappedErrors,
      }));

      return true;
    }

    return false;
  };

  // =========================================
  // Submit Registration
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFieldErrors({});

    // -----------------------------------------
    // Frontend Validation
    // -----------------------------------------

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    toast.loading("Creating your account...", {
      id: "register-loading",
      style: {
        background: "rgba(243, 244, 246, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        color: "#1F2937",
        borderRadius: "16px",
        padding: "16px 24px",
      },
    });

    try {
      // =========================================
      // Create FormData
      // =========================================

      const formData = new FormData();

      formData.append("fullName", form.name.trim());
      formData.append("email", form.email.trim().toLowerCase());
      formData.append("password", form.password);
      formData.append("role", form.role);

      // =========================================
      // Doctor Data
      // =========================================

      if (form.role === "doctor") {
        formData.append(
          "specialization",
          form.specialization.trim()
        );

        formData.append("hospital", form.hospital.trim());

        formData.append(
          "yearsOfExperience",
          String(Number(form.yearsOfExperience))
        );

        formData.append(
          "pmdcRegistrationNumber",
          form.pmdcRegistrationNumber.trim()
        );

        formData.append(
          "registrationType",
          form.registrationType
        );

        // Qualifications
        const qualifications = form.qualifications.map(
          (qualification) => ({
            degree: qualification.degree.trim(),
            institution: qualification.institution.trim(),
            completionYear: Number(
              qualification.completionYear
            ),
          })
        );

        formData.append(
          "qualifications",
          JSON.stringify(qualifications)
        );

        // Documents
        documents.forEach((doc) => {
          formData.append("documents", doc.file);
          formData.append(
            "documentTypes",
            doc.documentType
          );
        });
      }

      // =========================================
      // API Request
      // =========================================

      const response = await registerWithFiles(formData);

      // =========================================
      // Success
      // =========================================

      toast.dismiss("register-loading");

      const isDoctor = form.role === "doctor";

      toast.success(
        (t) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">
              Registration Successful!
            </span>

            <span className="text-sm">
              Welcome to Flora! You can now log in to your account.
            </span>

            {isDoctor && (
              <>
                <span className="text-sm font-medium text-amber-600 mt-1">
                  Your doctor registration has been submitted
                  for admin approval.
                </span>

                <span className="text-xs text-gray-500 mt-0.5">
                  You will be able to login once your account is
                  verified by an admin.
                </span>
              </>
            )}

            {response?.data?.requiresEmailVerification && (
              <span className="text-xs text-gray-600 mt-1">
                Please check your email to verify your account.
              </span>
            )}
          </div>
        ),
        {
          duration: isDoctor ? 10000 : 5000,

          style: {
            background: "#FEE4EB",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(244, 114, 182, 0.4)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(244, 114, 182, 0.15)",
            color: "#831843",
            borderRadius: "16px",
            padding: "16px 24px",
            maxWidth: "420px",
          },

          icon: "",
        }
      );

      // =========================================
      // Reset Form
      // =========================================

      setForm(initialForm);
      setDocuments([]);
      setFieldErrors({});

      // =========================================
      // Navigate to Login
      // =========================================

      const navigationDelay = isDoctor ? 4000 : 2000;

      setTimeout(() => {
        navigate("/login");
      }, navigationDelay);
    } catch (error) {
      console.error("Registration error:", error);

      toast.dismiss("register-loading");

      // =========================================
      // Backend Response Exists
      // =========================================

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data || {};

        console.log("Registration backend response:", data);

        // -----------------------------------------
        // Validation Errors
        // -----------------------------------------

        if (data.errors) {
          const handled = handleBackendValidationErrors(
            data.errors
          );

          if (handled) {
            return;
          }
        }

        // -----------------------------------------
        // General Backend Message
        // -----------------------------------------

        const message =
          data.message ||
          data.error ||
          "";

        // -----------------------------------------
        // Email Already Exists
        // -----------------------------------------

        if (
          status === 400 ||
          status === 409
        ) {
          const lowerMessage = message.toLowerCase();

          if (
            lowerMessage.includes("email already") ||
            lowerMessage.includes("already exists") ||
            lowerMessage.includes("already registered")
          ) {
            setFieldErrors((prev) => ({
              ...prev,
              email: "Email already exists",
            }));

            return;
          }
        }

        // -----------------------------------------
        // Bad Request
        // -----------------------------------------

        if (status === 400) {
          showErrorToast(
            message ||
              "Invalid registration details. Please check your input."
          );

          return;
        }

        // -----------------------------------------
        // Conflict
        // -----------------------------------------

        if (status === 409) {
          setFieldErrors((prev) => ({
            ...prev,
            email: "Email already exists",
          }));

          return;
        }

        // -----------------------------------------
        // Unprocessable Entity
        // -----------------------------------------

        if (status === 422) {
          showErrorToast(
            "Please check all fields and try again."
          );

          return;
        }

        // -----------------------------------------
        // Too Many Requests
        // -----------------------------------------

        if (status === 429) {
          showErrorToast(
            "Too many attempts. Please wait a moment before trying again."
          );

          return;
        }

        // -----------------------------------------
        // Server Error
        // -----------------------------------------

        if (status >= 500) {
          showErrorToast(
            "Server error. Please try again later."
          );

          return;
        }

        // -----------------------------------------
        // Other HTTP Errors
        // -----------------------------------------

        showErrorToast(
          message ||
            "Registration failed. Please try again."
        );

        return;
      }

      // =========================================
      // Request Sent But No Response
      // =========================================

      if (error.request) {
        if (!navigator.onLine) {
          showErrorToast(
            "No internet connection. Please check your network.",
            ""
          );
        } else {
          showErrorToast(
            "Connection error. Please check your internet and try again.",
            ""
          );
        }

        return;
      }

      // =========================================
      // Unknown Error
      // =========================================

      showErrorToast(
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================
  // JSX
  // =========================================

  return (
    <AuthSplitLayout
      heading="Create Your"
      headingAccent="Account"
      subtitle="Join Flora and take the first step towards a healthier you."
      leftExtra={
        <ul className="mt-6 w-full space-y-3 text-left">
          {perks.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-3"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#EB6991] shadow-sm">
                <Icon className="h-3.5 w-3.5" />
              </span>

              <span className="text-sm text-[#3D3939]">
                {text}
              </span>
            </li>
          ))}
        </ul>
      }
    >
      {/* Heading */}

      <div className="flex flex-col items-center justify-center mb-6">
        <h2 className="font-display text-lg font-semibold text-[#0D0D0D] text-center">
          Register
        </h2>

        <p className="mt-0.5 text-sm text-[#8F8C8C] text-center">
          Create your account to get started.
        </p>
      </div>

      {/* Form */}

      <form
        className="mt-4 space-y-3"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* =========================================
            Full Name
        ========================================= */}

        <div>
          <Label className="text-xs">
            Full Name
          </Label>

          <TextField
            icon={User}
            type="text"
            placeholder="Enter your full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`py-2 text-sm ${
              fieldErrors.name
                ? "border-red-500"
                : ""
            }`}
            disabled={isLoading}
            autoComplete="name"
          />

          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* =========================================
            Email
        ========================================= */}

        <div>
          <Label className="text-xs">
            Email
          </Label>

          <TextField
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`py-2 text-sm ${
              fieldErrors.email
                ? "border-red-500"
                : ""
            }`}
            disabled={isLoading}
            autoComplete="email"
          />

          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.email}
            </p>
          )}

          {form.email &&
            !fieldErrors.email &&
            validateEmail(form.email) && (
              <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Valid email format
              </p>
            )}
        </div>

        {/* =========================================
            Password
        ========================================= */}

        <div>
          <Label className="text-xs">
            Password
          </Label>

          <PasswordField
            icon={Lock}
            show={showPassword}
            onToggle={() =>
              setShowPassword((v) => !v)
            }
            placeholder="Create a password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`py-2 text-sm ${
              fieldErrors.password
                ? "border-red-500"
                : ""
            }`}
            disabled={isLoading}
            autoComplete="new-password"
          />

          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.password}
            </p>
          )}

          {form.password &&
            !fieldErrors.password &&
            validatePassword(form.password).length ===
              0 && (
              <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Strong password
              </p>
            )}

          {form.password &&
            validatePassword(form.password).length > 0 && (
              <p className="mt-1 text-xs text-amber-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Password needs:{" "}
                {validatePassword(form.password).join(
                  ", "
                )}
              </p>
            )}
        </div>

        {/* =========================================
            Confirm Password
        ========================================= */}

        <div>
          <Label className="text-xs">
            Confirm Password
          </Label>

          <PasswordField
            icon={Lock}
            show={showConfirm}
            onToggle={() =>
              setShowConfirm((v) => !v)
            }
            placeholder="Confirm your password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`py-2 text-sm ${
              fieldErrors.confirmPassword
                ? "border-red-500"
                : ""
            }`}
            disabled={isLoading}
            autoComplete="new-password"
          />

          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.confirmPassword}
            </p>
          )}

          {form.confirmPassword &&
            !fieldErrors.confirmPassword &&
            form.password ===
              form.confirmPassword && (
              <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Passwords match
              </p>
            )}
        </div>

        {/* =========================================
            Role
        ========================================= */}

        <div>
          <Label className="text-xs">
            I am a
          </Label>

          <div className="grid grid-cols-2 gap-2">
            {/* User */}

            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  role: "user",
                }));

                setFieldErrors((prev) => ({
                  ...prev,
                  role: null,
                }));
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                form.role === "user"
                  ? "border-[#EB6991] bg-[#FEE4EB] text-[#EB6991]"
                  : "border-[#F0DCE4] bg-white text-[#3D3939]"
              }`}
              disabled={isLoading}
            >
              Patient / User
            </button>

            {/* Doctor */}

            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  role: "doctor",
                }));

                setFieldErrors((prev) => ({
                  ...prev,
                  role: null,
                }));
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

        {/* =========================================
            Doctor Details
        ========================================= */}

        {form.role === "doctor" && (
          <div className="space-y-3 rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] p-4">
            <p className="text-[11px] font-semibold text-[#8F8C8C] mb-2">
              Doctor details (required for approval)
            </p>

            {/* Specialization */}

            <div>
              <Label className="text-xs">
                Specialization
              </Label>

              <TextField
                icon={Stethoscope}
                name="specialization"
                placeholder="e.g. Gynecology"
                value={form.specialization}
                onChange={handleChange}
                className={`py-2 text-sm ${
                  fieldErrors.specialization
                    ? "border-red-500"
                    : ""
                }`}
                disabled={isLoading}
              />

              {fieldErrors.specialization && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.specialization}
                </p>
              )}
            </div>

            {/* PMDC Registration Number */}

            <div>
              <Label className="text-xs">
                PMDC Registration Number
              </Label>

              <TextField
                icon={IdCard}
                name="pmdcRegistrationNumber"
                placeholder="Enter PMDC registration number"
                value={
                  form.pmdcRegistrationNumber
                }
                onChange={handleChange}
                className={`py-2 text-sm ${
                  fieldErrors.pmdcRegistrationNumber
                    ? "border-red-500"
                    : ""
                }`}
                disabled={isLoading}
              />

              {fieldErrors.pmdcRegistrationNumber && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {
                    fieldErrors.pmdcRegistrationNumber
                  }
                </p>
              )}
            </div>

            {/* Registration Type */}

            <div>
              <Label className="text-xs">
                Registration Type
              </Label>

              <select
                name="registrationType"
                value={form.registrationType}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition ${
                  fieldErrors.registrationType
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#F0DCE4] focus:border-[#EB6991]"
                }`}
                disabled={isLoading}
              >
                <option value="">
                  Select registration type
                </option>

                <option value="permanent">
                  Permanent
                </option>

                <option value="provisional">
                  Provisional
                </option>

                <option value="specialist">
                  Specialist
                </option>
              </select>

              {fieldErrors.registrationType && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.registrationType}
                </p>
              )}
            </div>

            {/* Medical Qualification */}

            <div>
              <Label className="text-xs">
                Medical Qualification
              </Label>

              <div className="space-y-2">
                {/* Degree */}

                <TextField
                  type="text"
                  placeholder="Degree (e.g. MBBS)"
                  value={
                    form.qualifications[0].degree
                  }
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      qualifications: [
                        {
                          ...prev.qualifications[0],
                          degree: e.target.value,
                        },
                      ],
                    }));

                    setFieldErrors((prev) => ({
                      ...prev,
                      qualification_degree_0:
                        null,
                    }));
                  }}
                  className={`py-2 text-sm ${
                    fieldErrors
                      .qualification_degree_0
                      ? "border-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                />

                {fieldErrors.qualification_degree_0 && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {
                      fieldErrors
                        .qualification_degree_0
                    }
                  </p>
                )}

                {/* Institution */}

                <TextField
                  type="text"
                  placeholder="Institution"
                  value={
                    form.qualifications[0]
                      .institution
                  }
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      qualifications: [
                        {
                          ...prev.qualifications[0],
                          institution:
                            e.target.value,
                        },
                      ],
                    }));

                    setFieldErrors((prev) => ({
                      ...prev,
                      qualification_institution_0:
                        null,
                    }));
                  }}
                  className={`py-2 text-sm ${
                    fieldErrors
                      .qualification_institution_0
                      ? "border-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                />

                {fieldErrors.qualification_institution_0 && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {
                      fieldErrors
                        .qualification_institution_0
                    }
                  </p>
                )}

                {/* Completion Year */}

                <TextField
                  type="number"
                  placeholder="Completion year"
                  value={
                    form.qualifications[0]
                      .completionYear
                  }
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      qualifications: [
                        {
                          ...prev.qualifications[0],
                          completionYear:
                            e.target.value,
                        },
                      ],
                    }));

                    setFieldErrors((prev) => ({
                      ...prev,
                      qualification_year_0: null,
                    }));
                  }}
                  className={`py-2 text-sm ${
                    fieldErrors
                      .qualification_year_0
                      ? "border-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                />

                {fieldErrors.qualification_year_0 && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {
                      fieldErrors
                        .qualification_year_0
                    }
                  </p>
                )}

                {fieldErrors.qualifications && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.qualifications}
                  </p>
                )}
              </div>
            </div>

            {/* Hospital */}

            <div>
              <Label className="text-xs">
                Hospital / Clinic
              </Label>

              <TextField
                icon={Building2}
                name="hospital"
                placeholder="e.g. Lahore General Hospital"
                value={form.hospital}
                onChange={handleChange}
                className={`py-2 text-sm ${
                  fieldErrors.hospital
                    ? "border-red-500"
                    : ""
                }`}
                disabled={isLoading}
              />

              {fieldErrors.hospital && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.hospital}
                </p>
              )}
            </div>

            {/* Years of Experience */}

            <div>
              <Label className="text-xs">
                Years of Experience
              </Label>

              <TextField
                icon={BriefcaseMedical}
                type="number"
                min="0"
                name="yearsOfExperience"
                placeholder="e.g. 8"
                value={form.yearsOfExperience}
                onChange={handleChange}
                className={`py-2 text-sm ${
                  fieldErrors.yearsOfExperience
                    ? "border-red-500"
                    : ""
                }`}
                disabled={isLoading}
              />

              {fieldErrors.yearsOfExperience && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {
                    fieldErrors.yearsOfExperience
                  }
                </p>
              )}
            </div>

            {/* Doctor Documents */}

            <DoctorDocumentUpload
              onDocumentsChange={
                handleDocumentsChange
              }
              errors={fieldErrors}
            />
          </div>
        )}

        {/* =========================================
            Terms & Conditions
        ========================================= */}

        <label className="flex items-start gap-1.5 text-xs text-[#3D3939]">
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
            className={`mt-0.5 h-3 w-3 rounded border-[#F0DCE4] text-[#EB6991] focus:ring-[#F33B7D]/30 ${
              fieldErrors.terms
                ? "border-red-500"
                : ""
            }`}
            disabled={isLoading}
          />

          <span>
            I agree to{" "}
            <Link
              to="/terms"
              className="font-semibold text-[#EB6991] hover:underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-semibold text-[#EB6991] hover:underline"
            >
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

        {/* =========================================
            Submit
        ========================================= */}

        <Button
          type="submit"
          className="mt-1 py-2 text-sm"
          disabled={isLoading}
        >
          {isLoading
            ? "Creating Account..."
            : "Create Account"}
        </Button>
      </form>

      {/* =========================================
          Login Link
      ========================================= */}

      <p className="mt-4 text-center text-xs text-[#8F8C8C]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#F33B7D] hover:underline"
        >
          Login →
        </Link>
      </p>
    </AuthSplitLayout>
  );
}