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
  Building2,
  IdCard,
  BriefcaseMedical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [documents, setDocuments] = useState([]);

  const [form, setForm] = useState({
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

  const handleDocumentsChange = (newDocuments) => {
    setDocuments(newDocuments);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // 1. Validate Full Name
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
      errors.name = "Full name can only contain letters, spaces, hyphens, and apostrophes";
      isValid = false;
    }

    // 2. Validate Email
    if (!form.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(form.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // 3. Validate Password
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

    // 4. Validate Confirm Password
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // 5. Validate Terms
    if (!form.terms) {
      errors.terms = "You must accept the Terms & Conditions";
      isValid = false;
    }

    // 6. Doctor-only required fields
    if (form.role === "doctor") {
      if (!form.specialization.trim()) {
        errors.specialization = "Specialization is required";
        isValid = false;
      }

      if (!form.hospital.trim()) {
        errors.hospital = "Hospital or clinic is required";
        isValid = false;
      }

      if (form.yearsOfExperience === "") {
        errors.yearsOfExperience = "Years of experience is required";
        isValid = false;
      } else if (
        Number(form.yearsOfExperience) < 0 ||
        !Number.isInteger(Number(form.yearsOfExperience))
      ) {
        errors.yearsOfExperience = "Years of experience must be a whole number";
        isValid = false;
      }

      if (!form.pmdcRegistrationNumber.trim()) {
        errors.pmdcRegistrationNumber = "PMDC registration number is required";
        isValid = false;
      }

      if (!form.registrationType) {
        errors.registrationType = "Registration type is required";
        isValid = false;
      }

      if (!form.qualifications.length) {
        errors.qualifications = "At least one medical qualification is required";
        isValid = false;
      }

      form.qualifications.forEach((qualification, index) => {
        if (!qualification.degree.trim()) {
          errors[`qualification_degree_${index}`] = "Degree is required";
          isValid = false;
        }

        if (!qualification.institution.trim()) {
          errors[`qualification_institution_${index}`] = "Institution is required";
          isValid = false;
        }

        if (!qualification.completionYear) {
          errors[`qualification_year_${index}`] = "Completion year is required";
          isValid = false;
        } else if (
          !Number.isInteger(Number(qualification.completionYear)) ||
          Number(qualification.completionYear) < 1950 ||
          Number(qualification.completionYear) > new Date().getFullYear()
        ) {
          errors[`qualification_year_${index}`] = "Please enter a valid completion year";
          isValid = false;
        }
      });

      // Validate documents
      if (documents.length === 0) {
        errors.documents = "Please upload at least one verification document";
        isValid = false;
      } else {
        const hasInvalidDoc = documents.some(doc => !doc.documentType);
        if (hasInvalidDoc) {
          errors.documents = "Please select a document type for each uploaded file";
          isValid = false;
        }
      }
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
        background: 'rgba(243, 244, 246, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        color: '#1F2937',
        borderRadius: '16px',
        padding: '16px 24px',
      },
    });

    try {
      const formData = new FormData();
      formData.append("fullName", form.name.trim());
      formData.append("email", form.email.trim().toLowerCase());
      formData.append("password", form.password);
      formData.append("role", form.role);
      
      if (form.role === "doctor") {
        formData.append("specialization", form.specialization.trim());
        formData.append("hospital", form.hospital.trim());
        formData.append("yearsOfExperience", Number(form.yearsOfExperience));
        formData.append("pmdcRegistrationNumber", form.pmdcRegistrationNumber.trim());
        formData.append("registrationType", form.registrationType);
        
        const qualifications = form.qualifications.map((qualification) => ({
          degree: qualification.degree.trim(),
          institution: qualification.institution.trim(),
          completionYear: Number(qualification.completionYear),
        }));
        formData.append("qualifications", JSON.stringify(qualifications));
        
        // Append documents
        documents.forEach((doc) => {
          formData.append("documents", doc.file);
          formData.append("documentTypes", doc.documentType);
        });
      }

      const response = await registerWithFiles(formData);

      // Dismiss loading toast
      toast.dismiss("register-loading");

      const isDoctor = form.role === "doctor";

      // Show success toast with longer duration for doctors
      toast.success(
        (t) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold"> Registration Successful!</span>
            <span className="text-sm">Welcome to Flora! You can now log in to your account.</span>
            {isDoctor && (
              <>
                <span className="text-sm font-medium text-amber-600 mt-1">
                  📋 Your doctor registration has been submitted for admin approval.
                </span>
                <span className="text-xs text-gray-500 mt-0.5">
                  You will be able to login once your account is verified by an admin.
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
          duration: isDoctor ? 10000 : 5000, // 10 seconds for doctors, 5 seconds for regular users
          style: {
            background: isDoctor 
              ? 'rgba(251, 191, 36, 0.15)' // Amber tint for doctors
              : 'rgba(220, 252, 231, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isDoctor
              ? '1px solid rgba(251, 191, 36, 0.4)'
              : '1px solid rgba(134, 239, 172, 0.4)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(134, 239, 172, 0.15)',
            color: isDoctor ? '#92400E' : '#166534',
            borderRadius: '16px',
            padding: '16px 24px',
            maxWidth: '420px',
          },
          icon: isDoctor ? '📋' : '',
        }
      );

      // Reset form after successful registration
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
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
      });
      setDocuments([]);

      // Navigate after a longer delay for doctors
      const navigationDelay = isDoctor ? 4000 : 2000;
      setTimeout(() => {
        navigate("/login");
      }, navigationDelay);
      
    } catch (error) {
      console.error("Registration error:", error);
      
      // Dismiss loading toast
      toast.dismiss("register-loading");

      // Handle validation errors from Zod
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const zodErrors = error.response.data.errors;
        
        // Map Zod errors to field errors
        zodErrors.forEach((err) => {
          const path = err.path[0];
          if (path === "fullName") {
            setFieldErrors((prev) => ({ ...prev, name: err.message }));
          } else if (path === "email") {
            setFieldErrors((prev) => ({ ...prev, email: err.message }));
          } else if (path === "password") {
            setFieldErrors((prev) => ({ ...prev, password: err.message }));
          } else if (path === "specialization") {
            setFieldErrors((prev) => ({ ...prev, specialization: err.message }));
          } else if (path === "hospital") {
            setFieldErrors((prev) => ({ ...prev, hospital: err.message }));
          } else if (path === "yearsOfExperience") {
            setFieldErrors((prev) => ({ ...prev, yearsOfExperience: err.message }));
          } else if (path === "pmdcRegistrationNumber") {
            setFieldErrors((prev) => ({ ...prev, pmdcRegistrationNumber: err.message }));
          } else if (path === "registrationType") {
            setFieldErrors((prev) => ({ ...prev, registrationType: err.message }));
          } else if (path === "qualifications") {
            setFieldErrors((prev) => ({ ...prev, qualifications: err.message }));
          } else {
            toast.error(err.message, {
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
          }
        });
        return;
      }

      // Handle other errors
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "";
        const errors = error.response.data?.errors || {};

        // Handle field-specific errors from backend
        if (errors.email) {
          const emailError = errors.email;
          setFieldErrors((prev) => ({ ...prev, email: emailError }));
        } else if (errors.fullName) {
          setFieldErrors((prev) => ({ ...prev, name: errors.fullName }));
        } else if (errors.password) {
          setFieldErrors((prev) => ({ ...prev, password: errors.password }));
        } else {
          if (status === 400) {
            if (message.toLowerCase().includes("email already") || 
                message.toLowerCase().includes("already exists") ||
                message.toLowerCase().includes("already registered")) {
              setFieldErrors((prev) => ({ ...prev, email: "Email already exists" }));
            } else {
              toast.error(message || "Invalid registration details. Please check your input.", {
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
            }
          } else if (status === 409) {
            setFieldErrors((prev) => ({ ...prev, email: "Email already exists" }));
          } else if (status === 422) {
            toast.error("Please check all fields and try again.", {
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
          } else if (status === 429) {
            toast.error("Too many attempts. Please wait a moment before trying again.", {
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
          } else if (status >= 500) {
            toast.error("Server error. Please try again later.", {
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
          } else {
            toast.error(message || "Registration failed. Please try again.", {
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
          }
        }
      } else if (error.request) {
        if (!navigator.onLine) {
          toast.error("No internet connection. Please check your network.", {
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
            icon: '🌐',
          });
        } else {
          toast.error("Connection error. Please check your internet and try again.", {
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
            icon: '📡',
          });
        }
      } else {
        toast.error("Registration failed. Please try again.", {
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
      {/* Moved heading and subtitle to be centered */}
      <div className="flex flex-col items-center justify-center mb-6">
        <h2 className="font-display text-lg font-semibold text-[#0D0D0D] text-center">
          Register
        </h2>
        <p className="mt-0.5 text-sm text-[#8F8C8C] text-center">
          Create your account to get started.
        </p>
      </div>

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
                setForm((prev) => ({ ...prev, role: "user" }));
                setFieldErrors((prev) => ({ ...prev, role: null }));
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

        {form.role === "doctor" && (
          <div className="space-y-3 rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] p-4">
            <p className="text-[11px] font-semibold text-[#8F8C8C] mb-2">
              Doctor details (required for approval)
            </p>

            {/* Specialization */}
            <div>
              <Label className="text-xs">Specialization</Label>
              <TextField
                icon={Stethoscope}
                name="specialization"
                placeholder="e.g. Gynecology"
                value={form.specialization}
                onChange={handleChange}
                className={`py-2 text-sm ${
                  fieldErrors.specialization ? "border-red-500" : ""
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
              <Label className="text-xs">PMDC Registration Number</Label>
              <TextField
                icon={IdCard}
                name="pmdcRegistrationNumber"
                placeholder="Enter PMDC registration number"
                value={form.pmdcRegistrationNumber}
                onChange={handleChange}
                className={`py-2 text-sm ${
                  fieldErrors.pmdcRegistrationNumber ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
              {fieldErrors.pmdcRegistrationNumber && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.pmdcRegistrationNumber}
                </p>
              )}
            </div>

            {/* Registration Type */}
            <div>
              <Label className="text-xs">Registration Type</Label>
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
                <option value="">Select registration type</option>
                <option value="permanent">Permanent</option>
                <option value="provisional">Provisional</option>
                <option value="specialist">Specialist</option>
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
              <Label className="text-xs">Medical Qualification</Label>
              <div className="space-y-2">
                <TextField
                  type="text"
                  placeholder="Degree (e.g. MBBS)"
                  value={form.qualifications[0].degree}
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
                  }}
                  className={`py-2 text-sm ${
                    fieldErrors.qualification_degree_0 ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                {fieldErrors.qualification_degree_0 && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.qualification_degree_0}
                  </p>
                )}

                <TextField
                  type="text"
                  placeholder="Institution"
                  value={form.qualifications[0].institution}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      qualifications: [
                        {
                          ...prev.qualifications[0],
                          institution: e.target.value,
                        },
                      ],
                    }));
                  }}
                  className={`py-2 text-sm ${
                    fieldErrors.qualification_institution_0 ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                {fieldErrors.qualification_institution_0 && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.qualification_institution_0}
                  </p>
                )}

                <TextField
                  type="number"
                  placeholder="Completion year"
                  value={form.qualifications[0].completionYear}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      qualifications: [
                        {
                          ...prev.qualifications[0],
                          completionYear: e.target.value,
                        },
                      ],
                    }));
                  }}
                  className={`py-2 text-sm ${
                    fieldErrors.qualification_year_0 ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                {fieldErrors.qualification_year_0 && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.qualification_year_0}
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
              <Label className="text-xs">Hospital / Clinic</Label>
              <TextField
                icon={Building2}
                name="hospital"
                placeholder="e.g. Lahore General Hospital"
                value={form.hospital}
                onChange={handleChange}
                className={`py-2 text-sm ${
                  fieldErrors.hospital ? "border-red-500" : ""
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
              <Label className="text-xs">Years of Experience</Label>
              <TextField
                icon={BriefcaseMedical}
                type="number"
                min="0"
                name="yearsOfExperience"
                placeholder="e.g. 8"
                value={form.yearsOfExperience}
                onChange={handleChange}
                className={`py-2 text-sm ${
                  fieldErrors.yearsOfExperience ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
              {fieldErrors.yearsOfExperience && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.yearsOfExperience}
                </p>
              )}
            </div>

            {/* Document Upload */}
            <DoctorDocumentUpload
              onDocumentsChange={handleDocumentsChange}
              errors={fieldErrors}
            />
          </div>
        )}

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