// FeatureGrid.tsx
import React, { useEffect } from "react";
import linkedInImage from "../../public/linkedIn.png";
import githubImage from "../../public/github.png";
import resumeImage from "../../public/resume.png";
import profileImage from "../../public/profile.png";
import { motion } from "framer-motion";

import { gsap } from "gsap";

const centerImage =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=0b1c5b6d2b0b9a9d9b5f3a6d8f8f1a1a";

export default function FeatureGrid() {
  // useEffect(() => {
  //   gsap.from(".f-grid", {
  //     y: 90,
  //     opacity: 0,
  //     duration: 1.1,
  //     stagger: 0.08,
  //     ease: "power4.out",
  //   });
  // }, []);
  return (
    <div className="w-full f-grid max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[22%] flex flex-col gap-6">
          <div className="border p-4 lg:h-[50%] flex flex-col justify-between rounded-xl bg-[#F3F5F6] shadow-md min-h-[180px]">
            <div className="flex gap-3">
              {[linkedInImage, githubImage, resumeImage].map((img, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-md bg-white p-2 shadow-sm flex items-center justify-center"
                >
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div>
              <p className="text-lg font-semibold text-[#232532]">
                Integrations
              </p>
              <p className="text-xs text-[#6b6b6b] mt-1">
                Connect LinkedIn, upload resumes, and sync profile data.
              </p>
            </div>
          </div>

          <div className="border p-4 lg:h-[50%] rounded-xl bg-[#F3F5F6] shadow-md min-h-[140px] flex items-end">
            <div>
              <p className="text-4xl font-extrabold text-[#232532]">100×</p>
              <p className="text-xs text-[#6b6b6b]">
                faster resume improvements
              </p>
            </div>
          </div>
        </div>

        {/* CENTER IMAGE */}
        <div className="w-full lg:w-[28%] rounded-xl overflow-hidden relative min-h-[260px]">
          <img
            src={profileImage}
            alt="Profile boost"
            className="w-full h-full object-cover"
          />
          <div className="absolute left-4 top-4 bg-white/70 backdrop-blur px-3 py-1 rounded-lg text-sm font-medium">
            Profile Boost
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[50%] flex flex-col gap-6">
          <div className="grid grid-cols-1 h-[50%]  sm:grid-cols-2 gap-6">
            <div className="rounded-xl bg-gradient-to-br from-[#DFF0D9] to-[#C6E8AD] p-5 shadow-md relative">
              <h3 className="text-lg font-semibold">AI Resume Rewrite</h3>
              <p className="text-sm text-[#4e5566] mt-2">
                Transform weak bullets into powerful statements.
              </p>

              <div
                className="absolute right-3 flex gap-1 items-center justify-center  top-2 lg:top-auto lg:bottom-2
  h-fit  bg-white/80 px-3  rounded-md text-sm font-bold"
              >
                <span className="text-lg font-extrabold">92% </span>
                <span className="text-xs text-[#4e5566]">clarity</span>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-[#FFF7D1] to-[#FFE58A] p-5 shadow-md relative">
              <h3 className="text-lg font-semibold">LinkedIn Optimization</h3>
              <p className="text-sm text-[#4e5566] mt-2">
                Rewrite your profile for maximum reach.
              </p>
              <div
                className="absolute right-3 flex gap-1 items-center justify-center  top-2 lg:top-auto lg:bottom-2
  h-fit bg-white/80 px-3  rounded-md text-sm font-bold"
              >
                <span className="text-lg font-extrabold">4×</span>
                <span className="text-xs text-[#4e5566]">visibility</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br lg:h-[25%] from-[#FFF3E0] to-[#FFE7B8] p-6 shadow-md">
            <h3 className="text-xl font-semibold">AI Post Generator</h3>
            <p className="text-sm text-[#4e5566] mt-2 max-w-xl">
              Create engaging LinkedIn posts instantly using your resume data.
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br lg:h-[25%] from-[#ffe4e6] to-[#fecdd3] p-6 shadow-md">
            <h3 className="text-xl font-semibold">Free English Learning</h3>
            <p className="text-sm text-[#4e5566] mt-2 max-w-xl">
              Create engaging LinkedIn posts instantly using your resume data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
