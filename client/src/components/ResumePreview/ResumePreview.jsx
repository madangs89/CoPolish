import { useEffect, useRef, useState } from "react";
import { Maximize } from "lucide-react";
import { useSelector } from "react-redux";

import ModernMinimalResume from "../ResumeTemplates/ModernMinimalResume";
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
  const measureRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [open, setOpen] = useState(false);

  const currentResume = useSelector((s) => s.resume.currentResume);
  const config = useSelector((s) => s.resume.currentResumeConfig);

  const { width, minHeight, padding, background } = config.page;

  const Component =
    templateRegistry[currentResume.templateId] ||
    ModernMinimalResume;

  const contentHeightPerPage = minHeight - padding * 2;

  /* ---------- SCALE ---------- */
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      setScale(Math.min(containerWidth / width, 1));
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [width]);

  /* ---------- PAGE COUNT ---------- */
  useEffect(() => {
    if (!measureRef.current) return;

    const totalContentHeight = measureRef.current.scrollHeight;
    const pages = Math.max(
      1,
      Math.ceil(totalContentHeight / contentHeightPerPage)
    );

    setPageCount(pages);
  }, [resumeData, config, Component, contentHeightPerPage]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-[#eef1f5] flex justify-center p-2"
    >
      {/* PAGE COUNT */}
      <div className="absolute top-2 right-14 z-50 px-3 py-1 rounded-full bg-white shadow text-xs">
        {pageCount} Page{pageCount > 1 ? "s" : ""}
      </div>

      {/* EXPAND */}
      {!open && (
        <Maximize
          onClick={() => setOpen(true)}
          className="absolute w-4 h-4 cursor-pointer text-gray-600 top-3 right-7 z-50"
        />
      )}

      {/* SCROLL AREA */}
      <div className="w-full h-full overflow-y-auto flex justify-center">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {/* HIDDEN MEASUREMENT (FULL CONTENT, NO PADDING) */}
          <div
            ref={measureRef}
            className="absolute  opacity-0 pointer-events-none"
            style={{ width }}
          >
            <Component data={resumeData} config={config} />
          </div>

          {/* REAL PAGED RENDER */}
          {Array.from({ length: pageCount }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="shadow-md mb-6 bg-white"
              style={{
                width,
                height: minHeight,
                background,
              }}
            >
              {/* PAGE PADDING */}
              <div
                style={{
                  padding,
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                {/* CLIP AREA */}
                <div
                  style={{
                    height: contentHeightPerPage,
                    overflow: "hidden",
                  }}
                >
                  {/* CONTENT SLICE */}
                  <div
                    style={{
                      transform: `translateY(-${
                        pageIndex * contentHeightPerPage
                      }px)`,
                    }}
                  >
                    <Component data={resumeData} config={config} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60">
          <div className="absolute inset-0 flex justify-center overflow-y-auto py-6">
            <div
              className="bg-white shadow-2xl relative"
              style={{ width }}
            >
              {/* FLOATING CLOSE */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-50 px-3 py-1 rounded bg-white shadow text-sm"
              >
                Close
              </button>

              <MobileResumeWrapper>
                <Component data={resumeData} config={config} />
              </MobileResumeWrapper>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
