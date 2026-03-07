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
  const [downloading, setDownloading] = useState(false);

  const currentResume = useSelector((s) => s.resume.currentResume);
  const config = useSelector((s) => s.resume.currentResumeConfig);

  const Component =
    templateRegistry[currentResume.templateId] ||
    templateRegistry["ModernMinimalResume"];

  /* ── FILTER DATA ── */
  const filteredData = useMemo(() => {
    const result = {};
    Object.keys(resumeData).forEach((key) => {
      if (checkedFields.includes(key)) result[key] = resumeData[key];
    });
    return result;
  }, [resumeData, checkedFields]);

  /* ── RESPONSIVE SCALE ── */
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      setScale(Math.min(containerWidth / config.page.width, 1));
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [config.page.width]);

  /* ── DOWNLOAD PDF ──
   * We send the EXPORT element's innerHTML (a plain continuous div, no translateY)
   * and also pass the padding so the backend can set @page margin correctly.
   */
  const downloadResume = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      // Give React one frame to ensure export element is rendered
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => setTimeout(r, 200));

      const exportEl = document.getElementById("resume-export");
      if (!exportEl) throw new Error("Export element not found");

      const html = exportEl.innerHTML; // just the inner content, not the wrapper

      const res = await fetch("http://localhost:3000/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          paddingPx: config.page.padding,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download resume. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-[90%] relative bg-gray-200 flex justify-center overflow-y-scroll scrollbar-minimal overflow-x-hidden p-2"
    >
      {/* PAGE COUNT / DOWNLOAD BUTTON */}
      <div
        onClick={downloadResume}
        className="absolute top-4 right-14 z-50 px-3 py-1 bg-white shadow text-xs rounded cursor-pointer select-none"
        style={{ opacity: downloading ? 0.5 : 1 }}
      >
        {downloading
          ? "Generating…"
          : `${pageCount} Page${pageCount > 1 ? "s" : ""}`}
      </div>

      {/* EXPAND */}
      {!open && (
        <Maximize
          onClick={() => setOpen(true)}
          className="absolute top-5 right-7 w-4 h-4 cursor-pointer text-gray-600 z-50"
        />
      )}

      {/* SCALED PREVIEW */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          // Keep the container the right height so scroll works
          height: `${(1122 * pageCount + 24 * (pageCount - 1)) * scale}px`,
        }}
      >
        <div id="resume-preview">
          <PageRenderer
            Component={Component}
            data={filteredData}
            config={config}
            onPageCountChange={setPageCount}
            exportMode={false}
          />
        </div>
      </div>

      {/* HIDDEN EXPORT VERSION — continuous, no translateY, no scale */}
      <div
        id="resume-export"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          width: config.page.width,
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <PageRenderer
          Component={Component}
          data={filteredData}
          config={config}
          onPageCountChange={() => {}}
          exportMode={true}
        />
      </div>

      {/* FULLSCREEN VIEW */}
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
                  exportMode={false}
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
