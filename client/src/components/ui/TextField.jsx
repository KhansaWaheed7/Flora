import React from "react";
export default function TextField({ icon: Icon, ...props }) {
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