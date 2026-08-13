import React from "react";
import { Link } from "react-router-dom";
import LogoPng from "../../assets/Logo.png";
export default function FloraLogo() {
  return (
    <Link to="/" className="flex items-center -space-x-4">
      <img src={LogoPng} alt="Flora" className="h-14 w-auto object-cover" />
      <span
        className="text-3xl font-semibold tracking-tight text-[#EB6991]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        flora
      </span>
    </Link>
  );
}