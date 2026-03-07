import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize, FileText, FileDown, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

import PageRenderer from "./PageRenderer";
import MobileResumeWrapper from "./MobileResumeWrapper";
import { templateRegistry } from "../../config/templateRegistory";

const API = "http://localhost:3000";

const ResumePreview = ({ resumeData, checkedFields }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [open, setOpen] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [downloading, setDownloading] = useState(null); // "pdf" | "docx" | null
  const [menuOpen, setMenuOpen] = useState(false);

  const currentResume = useSelector((s) => s.resume.currentResume);
  const config = useSelector((s) => s.resume.currentResumeConfig);

  const Component =
    templateRegistry[currentResume.templateId] ||
    templateRegistry["ModernMinimalResume"];

  /* ── Filter data ── */
  const filteredData = useMemo(() => {
    const result = {};
    Object.keys(resumeData).forEach((key) => {
      if (checkedFields.includes(key)) result[key] = resumeData[key];
    });
    return result;
  }, [resumeData, checkedFields]);

  /* ── Responsive scale ── */
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(entry.contentRect.width / config.page.width, 1));
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [config.page.width]);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [menuOpen]);

  /* ── Download PDF ── */
  const downloadPdf = async () => {
    if (downloading) return;
    setDownloading("pdf");
    setMenuOpen(false);
    try {
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => setTimeout(r, 200));

      const exportEl = document.getElementById("resume-export");
      if (!exportEl) throw new Error("Export element not found");

      const res = await fetch(`${API}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: exportEl.innerHTML,
          paddingPx: config.page.padding ?? 1,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      triggerDownload(await res.blob(), "resume.pdf");
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  /* ── Download DOCX ── */
  const downloadDocx = async () => {
    if (downloading) return;
    setDownloading("docx");
    setMenuOpen(false);
    try {
      const res = await fetch(`${API}/download-docx`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: filteredData,
          order: config?.content?.order ?? [],
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      triggerDownload(await res.blob(), "resume.docx");
    } catch (err) {
      console.error("DOCX download failed:", err);
      alert("Failed to download DOCX. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const triggerDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-[90%] relative bg-gray-200 flex justify-center overflow-y-scroll scrollbar-minimal overflow-x-hidden p-2"
    >
      {/* ── DOWNLOAD BUTTON (split: PDF left, chevron right) ── */}
      <div className="absolute top-4 right-14 z-50 flex items-center shadow rounded overflow-visible">
        {/* Main action: PDF */}
        <button
          onClick={downloadPdf}
          disabled={!!downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 border-r border-gray-200 transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          {downloading === "pdf" ? "Generating…" : `PDF · ${pageCount}p`}
        </button>

        {/* Dropdown toggle */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            disabled={!!downloading}
            className="flex items-center px-1.5 py-1.5 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-40 bg-white rounded shadow-lg border border-gray-100 overflow-hidden z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={downloadPdf}
                disabled={!!downloading}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <FileDown className="w-3.5 h-3.5 text-red-500" />
                Download PDF
              </button>
              <button
                onClick={downloadDocx}
                disabled={!!downloading}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                {downloading === "docx" ? "Generating…" : "Download DOCX"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── EXPAND ── */}
      {!open && (
        <Maximize
          onClick={() => setOpen(true)}
          className="absolute top-5 right-7 w-4 h-4 cursor-pointer text-gray-600 z-50"
        />
      )}

      {/* ── SCALED PREVIEW ── */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
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

      {/* ── HIDDEN EXPORT (used only for PDF) ── */}
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

      {/* ── FULLSCREEN ── */}
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
