import React from "react";
export default function PasswordField({ icon: Icon, show, onToggle, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />
      )}
      <input
        {...props}
        type={show ? "text" : "password"}
        className="w-full rounded-xl border border-[#F0DCE4] bg-[#FEFAFB] px-3.5 py-2.5 pl-10 pr-10 text-sm text-[#0D0D0D] placeholder:text-[#B8AEB2] outline-none transition focus:border-[##F33B7D] focus:ring-2 focus:ring-[#F33B7D]/15"
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