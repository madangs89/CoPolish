import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuthTrue, setUser } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "./Loaders/ButtonLoader";
const AuthOverlay = ({ open, onClose }) => {
  const [mode, setMode] = useState("login");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      gsap.to("#cursor", {
        opacity: 0,
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to("#cursor", {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    return () => {
      gsap.to("#cursor", {
        opacity: 1,
        scale: 1,
        duration: 0.2,
      });
    };
  }, [open]);

  const handleGoogleLogin = async (obj) => {
    try {
      setIsGoogleLoading(true);
      const { data } = await axios.post(
        `http://localhost:3000/api/auth/v1/google/login`,
        { code: obj.code },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data.success) {
        dispatch(setAuthTrue(true));
        dispatch(setUser(data));
        toast.success("Login Success");
        console.log(data.user);

        if (
          data.user.currentResumeId == "" ||
          data.user.currentResumeId == undefined
        ) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: handleGoogleLogin,
    flow: "auth-code",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      {/* Background */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />

      {/* Card */}
      <div className="relative w-[420px] rounded-2xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.3)] p-8 z-10">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 opacity-60 hover:opacity-100 transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#1f2430]">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm text-[#6b6b6b] mt-1">
            {mode === "login"
              ? "Login to polish your resume & LinkedIn"
              : "Start building a standout professional profile"}
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {mode === "signup" && (
            <input type="text" placeholder="Full name" className="auth-input" />
          )}

          <input
            type="email"
            placeholder="Email address"
            className="auth-input"
          />

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
          />
        </div>

        {/* Primary CTA */}
        <button className="w-full mt-6 rounded-full bg-black text-white py-3 text-sm font-medium hover:scale-[1.02] transition">
          {mode === "login" ? "Login" : "Create account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-[1px] bg-[#e5e5e5] flex-1" />
          <span className="text-xs text-[#6b6b6b]">OR</span>
          <div className="h-[1px] bg-[#e5e5e5] flex-1" />
        </div>

        {/* OAuth */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => googleLogin()}
            className="w-full rounded-full border py-3 text-sm flex items-center justify-center font-medium hover:bg-[#f5f5f5] transition"
          >
            {isGoogleLoading ? (
              <ButtonLoader color="black" />
            ) : (
              <p>Continue with Google</p>
            )}
          </button>

          <button
            onClick={() => console.log("GitHub Auth")}
            className="w-full rounded-full border py-3 text-sm font-medium hover:bg-[#f5f5f5] transition"
          >
            Continue with GitHub
          </button>
        </div>

        {/* Switch */}
        <p className="text-xs text-center text-[#6b6b6b] mt-6">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <span
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            {mode === "login" ? "Create account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthOverlay;
