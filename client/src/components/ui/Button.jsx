import React from "react";
export default function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_-6px_rgba(243,59,125,0.6)]"
    >
      {children}
    </button>
  );
}