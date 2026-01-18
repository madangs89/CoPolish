import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize } from "lucide-react";
import { useSelector } from "react-redux";

import PageRenderer from "./PageRenderer";
import MobileResumeWrapper from "./MobileResumeWrapper";
import { templateRegistry } from "../../config/templateRegistory";

const ResumePreview = ({ resumeData, checkedFields }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [open, setOpen] = useState(false);

  const currentResume = useSelector((s) => s.resume.currentResume);
  const config = useSelector((s) => s.resume.currentResumeConfig);

  const Component = templateRegistry["ResumeClassicBlue"];

  // templateRegistry[currentResume.templateId] ||
  /* ---------- FILTER DATA BASED ON CHECKED FIELDS ---------- */
  const filteredData = useMemo(() => {
    const result = {};
    Object.keys(resumeData).forEach((key) => {
      if (checkedFields.includes(key)) {
        result[key] = resumeData[key];
      }
    });
    return result;
  }, [resumeData, checkedFields]);

  /* ---------- RESPONSIVE SCALE ---------- */
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      setScale(Math.min(containerWidth / config.page.width, 1));
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [config.page.width]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative flex justify-center overflow-y-auto p-3"
    >
      {/* PAGE COUNT */}
      <div className="absolute top-2 right-14 z-50 px-3 py-1 bg-white shadow text-xs rounded">
        Preview
      </div>

      {/* EXPAND */}
      {!open && (
        <Maximize
          onClick={() => setOpen(true)}
          className="absolute top-3 right-7 w-4 h-4 cursor-pointer text-gray-600 z-50"
        />
      )}

      {/* PREVIEW */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <PageRenderer
          Component={Component}
          data={filteredData}
          config={config}
        />
      </div>

      {/* FULLSCREEN MODAL (SAME RENDERER) */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60">
          <div className="flex justify-center overflow-y-auto py-6">
            <div className="relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-10 right-0 bg-white px-3 py-1 shadow rounded text-sm"
              >
                Close
              </button>

              <MobileResumeWrapper>
                <PageRenderer
                  Component={Component}
                  data={filteredData}
                  config={config}
                />
              </MobileResumeWrapper>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
