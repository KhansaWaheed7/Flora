import React from "react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img src="/icons.png" alt="Flora" className="h-7 w-auto object-cover scale-200" />
      <span className="font-display text-lg font-semibold tracking-tight text-[#0D0D0D]">
        Flora
      </span>
    </div>
  );
}

export function BackToLogin() {
  return (
    <div className="mb-4 flex justify-end">
      <a
        href="/login"
        className="text-sm font-semibold text-[#F33B7D] hover:underline"
      >
        ← Back to Login
      </a>
    </div>
  );
}

/**
 * Two-panel auth shell: pink illustration/info panel on the left,
 * white form panel on the right. Matches the Figma auth screens.
 */
export function AuthSplitLayout({
  showBack = false,
  illustrationSrc,
  illustrationAlt = "",
  heading,
  headingAccent,
  subtitle,
  leftExtra,
  children,
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FEF4F4] p-4 sm:p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#F33B7D]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#F33B7D]/10 blur-3xl" />

      {showBack && <BackToLogin />}

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-15px_rgba(243,59,125,0.2)] ring-1 ring-black/5 md:grid-cols-2">
        {/* Left panel */}
        <div className="relative flex flex-col bg-gradient-to-br from-[#FEE4EB] to-[#FEF4F4] p-8 sm:p-10">
          <Logo />
          <div className="mt-8 flex flex-1 flex-col items-center justify-center text-center">
            {illustrationSrc && (
              <img
                src={illustrationSrc}
                alt={illustrationAlt}
                className="mb-6 w-full max-w-[220px]"
              />
            )}
            <h1 className="font-display text-2xl font-semibold text-[#0D0D0D]">
              {heading}{" "}
              {headingAccent && (
                <span className="text-[#F33B7D]">{headingAccent}</span>
              )}
            </h1>
            <p className="mt-2 max-w-xs text-sm text-[#8F8C8C]">{subtitle}</p>
            {leftExtra}
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex flex-col justify-center p-8 sm:p-10">{children}</div>
      </div>
    </div>
  );
}

export function FieldLabel({ children }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-[#3D3939]">
      {children}
    </label>
  );
}

export function TextField({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />
      )}
      <input
        {...props}
        className={`w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-3.5 py-2.5 text-sm text-[#0D0D0D] placeholder:text-[#B8AEB2] outline-none transition focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15 ${
          Icon ? "pl-10" : ""
        }`}
      />
    </div>
  );
}

export function PasswordField({ icon: Icon, show, onToggle, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />
      )}
      <input
        {...props}
        type={show ? "text" : "password"}
        className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-3.5 py-2.5 pl-10 pr-10 text-sm text-[#0D0D0D] placeholder:text-[#B8AEB2] outline-none transition focus:border-[#F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8F8C8C]"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_-6px_rgba(243,59,125,0.6)]"
    >
      {children}
    </button>
  );
}
