import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize, FileDown, FileText, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

import PageRenderer from "./PageRenderer";
import MobileResumeWrapper from "./MobileResumeWrapper";
import { templateRegistry } from "../../config/templateRegistory";

const API = import.meta.env.VITE_BACKEND_URL;

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

  /* ── Close menu on outside click ── */
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menuOpen]);

  /* ── Shared: get export HTML ── */
  const getExportHtml = async () => {
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => setTimeout(r, 200));
    const el = document.getElementById("resume-export");
    if (!el) throw new Error("Export element not found");
    return el.innerHTML;
  };

  /* ── Shared: trigger file download ── */
  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* ── Download PDF ── */
  const downloadPdf = async () => {
    if (downloading) return;
    setDownloading("pdf");
    setMenuOpen(false);
    try {
      const html = await getExportHtml();
      const res = await fetch(`${API}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, paddingPx: config.page.padding ?? 1 }),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      triggerDownload(await res.blob(), "resume.pdf");
    } catch (err) {
      console.error("PDF failed:", err);
      alert("Failed to download PDF.");
    } finally {
      setDownloading(null);
    }
  };

  /* ── Download DOCX (same HTML as PDF → LibreOffice converts it) ── */
  const downloadDocx = async () => {
    if (downloading) return;
    setDownloading("docx");
    setMenuOpen(false);
    try {
      const html = await getExportHtml();
      const res = await fetch(`${API}/download-docx`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, paddingPx: config.page.padding ?? 1 }),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      triggerDownload(await res.blob(), "resume.docx");
    } catch (err) {
      console.error("DOCX failed:", err);
      alert("Failed to download DOCX.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-[90%] relative bg-gray-200 flex justify-center overflow-y-scroll scrollbar-minimal overflow-x-hidden p-2"
    >
      {/* ── SPLIT DOWNLOAD BUTTON ── */}
      <div className="absolute top-4 right-14 z-50 md:flex hidden items-center rounded shadow overflow-visible">
        {/* Primary: PDF */}
        <button
          onClick={downloadPdf}
          disabled={!!downloading}
          title="Download PDF"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 border-r border-gray-200 disabled:opacity-50 transition-colors"
        >
          <FileDown className="w-3.5 h-3.5 text-red-500" />
          {downloading === "pdf" ? "Generating…" : `PDF · ${pageCount}p`}
        </button>
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

      {/* ── HIDDEN EXPORT (used for both PDF and DOCX) ── */}
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
