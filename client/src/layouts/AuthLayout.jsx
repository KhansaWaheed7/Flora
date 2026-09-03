import React from "react";
import Logo from "../components/common/Logo";
import BackToLogin from "../components/common/BackToLogin";

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
        <div className="relative flex flex-col bg-gradient-to-br from-[#FEE4EB] to-[#FEF4F4] p-7 sm:p-15">
          <Logo />
          <div className="mt-30 flex flex-1 flex-col items-center text-center">
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