import React from "react";
import { Link } from "react-router-dom";
import LogoPng from "../../assets/Logo.png";

export default function FloraLogo() {
  return (
    <Link to="/" className="flex items-center -space-x-2">
      <img src={LogoPng} alt="Flora" className="h-10 w-auto object-cover" />
      <span
        className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-[#F33B7D] to-[#EB6991] bg-clip-text text-transparent"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        flora
      </span>
    </Link>
  );
}