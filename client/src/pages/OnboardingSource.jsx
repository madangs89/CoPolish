import React, { useState } from "react";
import { FileText, Linkedin, Edit3, ArrowLeft } from "lucide-react";
import { gsap } from "gsap";
import ManualForm from "../components/ManualForm";
import UploadBox from "../components/UploadBox";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ResumeProgress from "../components/StatusShower/ResumeProgress";

const OnboardingSource = () => {
  const [view, setView] = useState("choose");
  const auth = useSelector((state) => state.auth);
  const [status, setstatus] = useState([]);
  const [isStatusTrue, setIsStatusTrue] = useState(false);

  if (auth?.user?.currentResumeId.length > 0) {
    return <Navigate to={"/dashboard"} replace />;
  }

  const handleHover = (scale) => {
    gsap.to("#cursor", {
      scale,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  return (
    <div className="min-h-screen relative w-full bg-[#f8f9fb] flex items-center justify-center">
      <div className="max-w-5xl w-full px-6">
        {/* BACK BUTTON */}
        {view !== "choose" && (
          <button
            onClick={() => setView("choose")}
            className="flex absolute top-10 items-center gap-2 text-sm text-[#6b6b6b] mb-10 hover:text-black transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}

        {/* ===================== CHOOSE ===================== */}
        {view === "choose" && (
          <>
            <div className="text-center mb-14">
              <h1 className="text-4xl font-bold text-[#1f2430]">
                Let’s build your professional profile
              </h1>
              <p className="text-sm text-[#6b6b6b] mt-3 max-w-xl mx-auto">
                Choose how you want to start. You can edit everything later —
                nothing is final without your approval.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Resume */}
              <Card
                icon={<FileText className="text-[#4f46e5]" />}
                bg="bg-[#eef2ff]"
                title="Upload Resume"
                desc="Upload your existing PDF or DOCX resume."
                footer="Supports PDF & DOCX →"
                onClick={() => setView("resume")}
                handleHover={handleHover}
              />

              {/* LinkedIn */}
              <Card
                icon={<Linkedin className="text-[#0a66c2]" />}
                bg="bg-[#e6f4ff]"
                title="Import LinkedIn PDF"
                desc="Upload the PDF you downloaded from LinkedIn."
                footer="Privacy-safe import →"
                onClick={() => setView("linkedin")}
                handleHover={handleHover}
              />

              {/* Manual */}
              <Card
                icon={<Edit3 className="text-[#f59e0b]" />}
                bg="bg-[#fff4e5]"
                title="Build Manually"
                desc="Start from scratch using guided forms."
                footer="Guided profile builder →"
                onClick={() => setView("manual")}
                handleHover={handleHover}
              />
            </div>
          </>
        )}

        {/* ===================== RESUME UPLOAD ===================== */}
        {view === "resume" && (
          <UploadBox
            setIsStatusTrue={setIsStatusTrue}
            status={status}
            setstatus={setstatus}
            title="Upload your resume"
            subtitle="Supported formats: PDF, DOCX"
          />
        )}

        {/* ===================== LINKEDIN UPLOAD ===================== */}
        {view === "linkedin" && (
          <UploadBox
            title="Upload LinkedIn Profile PDF"
            subtitle="LinkedIn → Profile → Save as PDF"
          />
        )}

        {/* ===================== MANUAL FORM ===================== */}
        {view === "manual" && <ManualForm />}
      </div>

      {isStatusTrue && (
        <div className="absolute z-[10000000000] inset-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
          <ResumeProgress status={status}  setstatus={setstatus} />
        </div>
      )}
    </div>
  );
};

export default OnboardingSource;
