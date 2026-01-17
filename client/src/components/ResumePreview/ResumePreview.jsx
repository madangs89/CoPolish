import { useEffect, useRef, useState } from "react";

import { Expand, Maximize } from "lucide-react";

import ModernMinimalResume from "../ResumeTemplates/ModernMinimalResume";
import { useSelector } from "react-redux";
import BalancedTwoColumnResume from "../ResumeTemplates/BalancedTwoColumnResume";
import CareerTimelineResume from "../ResumeTemplates/CareerTimelineResume";
import CleanProfessionalResume from "../ResumeTemplates/CleanProfessionalResume";
import HarvardResume from "../ResumeTemplates/HarvardResume";
import ProfessionalSidebarResume from "../ResumeTemplates/ProfessionalSidebarResume";
import ResumeClassicBlue from "../ResumeTemplates/ResumeClassicBlue";
import ResumeClassicV1 from "../ResumeTemplates/ResumeClassicV1";
import MobileResumeWrapper from "./MobileResumeWrapper";

const templateRegistry = {
  BalancedTwoColumnResume,
  CareerTimelineResume,
  CleanProfessionalResume,
  HarvardResume,
  ModernMinimalResume,
  ProfessionalSidebarResume,
  ResumeClassicBlue,
  ResumeClassicV1,
   "default-template": ModernMinimalResume,
};

const ResumePreview = ({ resumeData }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [open, setOpen] = useState(false);
  const config = useSelector((state) => state.resume.currentResumeConfig);
  const currentResumeDetails = useSelector(
    (state) => state.resume.currentResume
  );

  let Component = templateRegistry[currentResumeDetails.templateId] || ModernMinimalResume;
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      const resumeWidth = 794; // A4 width

      const newScale = Math.min(containerWidth / resumeWidth, 1);
      setScale(newScale);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-[#eef1f5] flex justify-center items-start p-2"
    >
      {/* Expand button */}
      {!open && (
        <Maximize
          onClick={() => setOpen(true)}
          className="absolute w-4 h-4 cursor-pointer text-[#6B6B6B] top-3 right-7 z-[100]"
        />
      )}

      {/* SCROLL CONTAINER (NOT SCALED) */}
      <div className="w-full h-full overflow-x-hidden overflow-y-auto scrollbar-minimal pr-5 flex justify-center">
        {/* SCALE WRAPPER (NO SCROLL HERE) */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {/* FIXED WIDTH RESUME */}
          {/* <ResumeClassicBlue data={resumeData} settings={resumeSettings} /> */}
          <BalancedTwoColumnResume data={resumeData} config={config} />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* Modal container */}
          <div
            className="absolute inset-0 flex flex-col overflow-x-hidden overflow-hidden"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            {/* White sheet */}
            <div
              className="
          relative
          shadow-2xl
          mx-auto
          my-4
          w-[794px]
          max-w-[95vw]
          flex
          flex-col
        "
            >
              {/* Header */}
              <div className="sticky top-0 z-50 flex justify-end p-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-1  rounded shadow bg-white text-sm"
                >
                  Close
                </button>
              </div>

              {/* Scrollable resume */}
              <div className="flex-1 z-[99999]  ">
                <MobileResumeWrapper>
                  <Component data={resumeData} config={config} />
                </MobileResumeWrapper>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
