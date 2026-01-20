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
  const [pageCount, setPageCount] = useState(1);

  const currentResume = useSelector((s) => s.resume.currentResume);
  const config = useSelector((s) => s.resume.currentResumeConfig);

  const Component =
    templateRegistry[currentResume.templateId] ||
    templateRegistry["ModernMinimalResume"];

  /* ---------- FILTER DATA ---------- */
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
      className="w-full h-[90%] relative  bg-gray-200 flex justify-center overflow-y-scroll scrollbar-minimal overflow-x-hidden p-2"
    >
      {/* PAGE COUNT BADGE */}
      <div className="absolute top-4 right-14 z-50 px-3 py-1 bg-transparent shadow text-xs rounded">
        {pageCount} Page{pageCount > 1 ? "s" : ""}
      </div>

      {/* EXPAND */}
      {!open && (
        <Maximize
          onClick={() => setOpen(true)}
          className="absolute top-5 right-7 w-4 h-4 cursor-pointer text-gray-600 z-50"
        />
      )}

      {/* PREVIEW */}
      <div
      className=""
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <PageRenderer
          Component={Component}
          data={filteredData}
          config={config}
          onPageCountChange={setPageCount}
        />
      </div>

      {/* FULLSCREEN */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60">
          <div className="flex justify-center overflow-y-auto py-6">
            <div className="relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-6 right-0 bg-white px-3 py-1 shadow rounded text-sm"
              >
                Close
              </button>

              <MobileResumeWrapper>
                <PageRenderer
                  Component={Component}
                  data={filteredData}
                  config={config}
                  onPageCountChange={setPageCount}
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
