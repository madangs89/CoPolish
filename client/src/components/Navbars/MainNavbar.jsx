import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { setIsPaymentModelOpen } from "../../redux/slice/paymentSlice";

const MainNavbar = () => {
  const location = useLocation();
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_ID;
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const totalCredits = useSelector(
    (state) => state.auth.user?.totalCredits || 0,
  );

  useEffect(() => {
    gsap.fromTo(
      ".sc",
      { backgroundColor: "transparent", opacity: 0 },
      {
        backgroundColor: "white",
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      },
    );
  }, [location]);

  if (location.pathname.includes("editor/resume")) return null;

  return (
    <div className="fixed sc top-0 left-0 w-full z-[99999]">
      <div className="w-full mx-auto px-6 py-3 flex items-center justify-between">
        <h1
          onClick={() => navigate("/")}
          className="text-black cursor-pointer  slider text-[22px] font-medium"
        >
          CoPolish
        </h1>

        {/* {!location.pathname.includes("onboarding") &&
          !location.pathname.includes("approve") && (
            <div className="hidden md:flex gap-7 items-center">
              <span className="text-[14px] hover:underline cursor-pointer">
                Resume
              </span>
              <span className="text-[14px] hover:underline cursor-pointer">
                LinkedIn
              </span>
              <span className="text-[14px] hover:underline cursor-pointer">
                Post
              </span>
              <span className="text-[14px] hover:underline cursor-pointer">
                ATS Match
              </span>
            </div>
          )} */}

        <div className="flex gap-2">
          <button
            onClick={() => dispatch(setIsPaymentModelOpen(true))}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[14px] 
              bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition"
          >
            <span className="font-medium">Credits</span>
            <span className="px-2 py-[2px] rounded-full text-[12px] bg-yellow-600 text-white">
              {totalCredits}
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
