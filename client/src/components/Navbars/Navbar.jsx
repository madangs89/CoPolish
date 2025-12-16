import React, { useState } from "react";
import AuthOverlay from "../AuthOverlay"
import { gsap } from "gsap";

const Navbar = () => {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <div className="max-w-5xl  z-[99999] mx-auto flex items-center justify-between">
      <h1 className="text-black text-[22px] ">CoPolish</h1>

      <div className="flex gap-7 items-center justify-center">
        <h1 className=" text-[14px] font-thin">Features</h1>
        <h1 className=" text-[14px] font-thin">How It Works</h1>
        <h1 className=" text-[14px] font-thin">Pricing</h1>
        <h1 className=" text-[14px] font-thin">FAQ</h1>
      </div>

      <button
        onMouseEnter={() => {
          gsap.to("#cursor", {
            scale: 1.5,
            color: "white",
            duration: 0.3,
          });
        }}
        onMouseLeave={() => {
          gsap.to("#cursor", { scale: 1, color: "white", duration: 0.3 });
        }}
        onClick={() => setAuthOpen(true)}
        className="bg-black flex items-center justify-center text-[14px] px-4 py-1.5 rounded-full text-white"
      >
        Login
      </button>

      <AuthOverlay open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Navbar;
