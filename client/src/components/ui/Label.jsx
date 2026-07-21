import React from "react";
export default function Label({ children }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-[#3D3939]">
      {children}
    </label>
  );
}
