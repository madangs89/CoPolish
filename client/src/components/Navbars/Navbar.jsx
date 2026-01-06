import React, { useEffect, useState } from "react";
import AuthOverlay from "../AuthOverlay";
import { gsap } from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { setAuthOpen } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const authOpen = useSelector((state) => state.auth.authOpen);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    gsap.from(".nav-bar", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    });
  }, []);

  return (
    <div className="max-w-6xl nav-bar z-[99999] mx-auto flex items-center px-4 lg:px-0 justify-between">
      <h1
        onClick={() => navigate("/")}
        className="text-black text-[22px] cursor-pointer font-medium"
      >
        CoPolish
      </h1>

      <div className="gap-7 lg:flex hidden items-center justify-center">
        <h1
          onMouseEnter={() => gsap.to("#cursor", { scale: 2.5, duration: 0.3 })}
          onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
          className=" cursor-pointer hover:underline text-[14px] font-thin"
        >
          Features
        </h1>
        <h1
          onMouseEnter={() => gsap.to("#cursor", { scale: 2.5, duration: 0.3 })}
          onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
          className=" cursor-pointer hover:underline text-[14px] font-thin"
        >
          How It Works
        </h1>
        <h1
          onMouseEnter={() => gsap.to("#cursor", { scale: 2.5, duration: 0.3 })}
          onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
          className=" cursor-pointer hover:underline text-[14px] font-thin"
        >
          Pricing
        </h1>
        <h1
          onMouseEnter={() => gsap.to("#cursor", { scale: 2.5, duration: 0.3 })}
          onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
          className=" cursor-pointer hover:underline text-[14px] font-thin"
        >
          FAQ
        </h1>
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
        onClick={() => dispatch(setAuthOpen(true))}
        className="bg-black flex items-center justify-center text-[14px] px-4 py-1.5 rounded-full text-white"
      >
        Login
      </button>
    </div>
  );
};

export default Navbar;
