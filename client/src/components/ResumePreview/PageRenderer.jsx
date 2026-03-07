import { useEffect, useRef, useState } from "react";

/**
 * A4 at 96dpi = 794 × 1122px
 *
 * The ONLY source of truth for page slicing is:
 *   contentH = PAGE_H - (pad * 2)
 *
 * Preview clips each page by translating the full render upward.
 * Export renders ONE continuous div — Puppeteer's @page handles breaks.
 *
 * CRITICAL: pad here MUST equal the @page margin (in px) you pass to Puppeteer.
 * Since you set paddingPx=1 in generatePdf, set PAGE_MARGIN=1 below.
 */

const PAGE_W = 794;
const PAGE_H = 1122;

const PageRenderer = ({
  Component,
  data,
  config,
  onPageCountChange,
  exportMode = false,
}) => {
  const measureRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);

  // Use config.page.padding so preview always matches whatever padding you set
  const pad = config?.page?.padding ?? 40;
  const contentH = PAGE_H - pad * 2;

  /* ── Measure ── */
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.scrollHeight;
      const pages = Math.max(1, Math.ceil(h / contentH));
      setPageCount((prev) => {
        if (prev !== pages) onPageCountChange?.(pages);
        return pages;
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data, config, Component, contentH, onPageCountChange]);

  /* ── EXPORT: single continuous div ── */
  if (exportMode) {
    return (
      <div
        style={{
          width: PAGE_W,
          background: config?.page?.background ?? "#fff",
        }}
      >
        <Component data={data} config={config} />
      </div>
    );
  }

  /* ── PREVIEW: sliced A4 pages ── */
  return (
    <div style={{ position: "relative" }}>
      {/* Hidden measure — full render, no clip */}
      <div
        ref={measureRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: PAGE_W,
          padding: pad,
          paddingBottom: 0,
          boxSizing: "border-box",
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <Component data={data} config={config} />
      </div>

      {Array.from({ length: pageCount }).map((_, i) => (
        <div
          key={i}
          style={{
            width: PAGE_W,
            height: PAGE_H,
            background: config?.page?.background ?? "#fff",
            marginBottom: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
            overflow: "hidden",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: pad,
              overflow: "hidden",
            }}
          >
            <div style={{ transform: `translateY(-${i * contentH}px)` }}>
              <Component data={data} config={config} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PageRenderer;
