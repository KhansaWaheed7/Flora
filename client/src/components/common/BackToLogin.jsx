import React from "react";
export default function BackToLogin() {
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

