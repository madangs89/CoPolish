import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useLocation } from "react-router-dom";
import { CircleUser } from "lucide-react";

const MainNavbar = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      ".sc",
      {
        backgroundColor: "transparent",

        opacity: 0,
      },
      {
        backgroundColor: "white",
        duration: 0.7,
        opacity: 1,
        delay: 0.2,
        ease: "power3.out",
      }
    );
  }, [location]);

  if (location.pathname.includes("editor/resume")) {
    return null;
  }

  return (
    <div className="fixed sc px-6 md:px-8  top-0 left-0 w-full z-[99999]">
      <div className="w-full mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-black text-[22px] font-medium">CoPolish</h1>

        {/* Links */}
        {(!location.pathname.includes("onboarding") && !location.pathname.includes("approve"))&& (
          <div className="hidden md:flex gap-7 items-center">
            <span className="text-[14px] hover:underline font-light cursor-pointer">
              Resume
            </span>
            <span className="text-[14px] hover:underline font-light cursor-pointer">
              LinkedIn
            </span>
            <span className="text-[14px] font-light hover:underline cursor-pointer">
              Post
            </span>
            <span className="text-[14px] font-light hover:underline cursor-pointer">
              ATS Match
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[14px] 
  bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition"
          >
            <span className="font-medium">Credits</span>
            <span className="px-2 py-[2px] rounded-full text-[12px] bg-yellow-600 text-white">
              52
            </span>
          </button>
          <button className="bg-black text-white text-[14px] px-5 py-2 rounded-full">
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
