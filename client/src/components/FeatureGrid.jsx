// FeatureGrid.tsx
import React from "react";
import linkedInImage from "../../public/linkedIn.png";
import githubImage from "../../public/github.png";
import resumeImage from "../../public/resume.png";
import profileImage from "../../public/profile.png";

const centerImage =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=0b1c5b6d2b0b9a9d9b5f3a6d8f8f1a1a";

export default function FeatureGrid() {
  return (
    <section className="lg:max-w-5xl w-full mx-auto px-4">
      <div className="max-w-5xl mx-auto flex gap-5 h-[400px]">
        {/* LEFT COLUMN */}
        <div className="w-[22%] h-full flex flex-col items-center justify-center gap-[7%]">
          <div className="h-[49%] border p-4 flex flex-col items-start justify-between border-[#e2e2e2] shadow-md w-full rounded-xl bg-[#F3F5F6]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-white p-2 overflow-hidden shadow-sm flex items-center justify-center">
                {/* Replace with integration icons */}
                <img
                  className="object-cover w-full h-full"
                  src={linkedInImage}
                  alt="LinkedIn"
                />
              </div>
              <div className="w-10 h-10 rounded-md bg-white p-2 overflow-hidden shadow-sm flex items-center justify-center">
                <img
                  className="object-cover w-full h-full"
                  src={githubImage}
                  alt="Resume"
                />
              </div>
              <div className="w-10 h-10 rounded-md bg-white p-2 overflow-hidden shadow-sm flex items-center justify-center">
                <img
                  className="object-cover w-full h-full"
                  src={resumeImage}
                  alt="Post"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-xl text-[#232532] font-semibold">
                Integrations
              </p>
              <p className="text-xs text-[#6b6b6b] mt-1">
                Connect LinkedIn, upload resumes, and sync profile data — work
                faster than manual edits.
              </p>
            </div>
          </div>

          <div className="h-[49%] border p-4 flex flex-col justify-end border-[#e2e2e2] shadow-md w-full rounded-xl bg-[#F3F5F6]">
            <div className="flex flex-col">
              <p className="text-4xl text-[#232532] font-extrabold">100×</p>
              <p className="text-xs text-[#6b6b6b] mt-1">
                faster resume improvements vs manual editing
              </p>
            </div>
          </div>
        </div>

        {/* CENTER IMAGE */}
        <div className="w-[28%] h-full rounded-xl overflow-hidden relative">
          <img
            src={profileImage}
            alt="Profile boost"
            className="object-cover w-full h-full rounded-xl"
          />
          <div className="absolute left-4 top-4 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
            Profile Boost
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-[50%] h-full flex flex-col items-center justify-center gap-[5%]">
          <div className="h-[48%] flex items-center justify-center gap-[5%] w-full rounded-xl">
            {/* Top-left */}
            <div className="w-[48%] h-full rounded-xl bg-gradient-to-br from-[#DFF0D9] to-[#C6E8AD] p-5 shadow-md relative">
              <h3 className="text-lg font-semibold text-[#1f2430]">
                AI Resume Rewrite
              </h3>
              <p className="text-sm text-[#4e5566] mt-2">
                Transform weak bullets into powerful, recruiter-ready
                statements.
              </p>
              <div className="absolute right-4 bottom-4 bg-white/80 px-3 py-1 rounded-md text-sm font-bold">
                92% clarity
              </div>
            </div>

            {/* Top-right */}
            <div className="w-[48%] h-full rounded-xl bg-gradient-to-br from-[#FFF7D1] to-[#FFE58A] p-5 shadow-md relative">
              <h3 className="text-lg font-semibold text-[#1f2430]">
                LinkedIn Optimization
              </h3>
              <p className="text-sm text-[#4e5566] mt-2">
                Rewrite your About, Experience, and Headline for maximum
                visibility.
              </p>
              <div className="absolute left-4 bottom-4 flex items-center gap-2">
                <div className="text-xl font-extrabold text-[#1f2430]">4×</div>
                <div className="text-xs text-[#4e5566]">profile visibility</div>
              </div>
            </div>
          </div>

          <div className="h-[48%] w-full rounded-xl bg-gradient-to-br from-[#FFF3E0] to-[#FFE7B8] p-6 shadow-md relative flex items-center">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[#1f2430]">
                AI Post Generator
              </h3>
              <p className="text-sm text-[#4e5566] mt-2 max-w-xl">
                Create engaging LinkedIn posts instantly using your polished
                profile and resume content — ready to schedule or post as
                drafts.
              </p>

              
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
}
