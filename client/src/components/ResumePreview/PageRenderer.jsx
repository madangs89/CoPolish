import { useEffect, useRef, useState } from "react";

const PageRenderer = ({ Component, data, config, onPageCountChange }) => {
  const measureRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);

  const { width, minHeight, padding, background } = config.page;
  const contentHeight = minHeight - padding * 2;

  /* ---------- PAGE COUNT CALCULATION (FINAL & STABLE) ---------- */
  useEffect(() => {
    if (!measureRef.current || contentHeight <= 0) return;

    const totalHeight = measureRef.current.scrollHeight;

    let pages;
    // ⬇️ TOLERANCE FIX (MANDATORY FOR BROWSER LAYOUTS)
    if (totalHeight <= contentHeight * 1.02) {
      pages = 1;
    } else {
      pages = Math.ceil(totalHeight / contentHeight);
    }

    setPageCount((prev) => {
      if (prev !== pages) {
        onPageCountChange?.(pages);
        return pages;
      }
      return prev;
    });
  }, [data, config, Component, contentHeight, onPageCountChange]);

  return (
    <>
      {/* 🔹 REAL PAGINATED PAGES */}
      {Array.from({ length: pageCount }).map((_, pageIndex) => (
        <div
          key={pageIndex}
          style={{
            width,
            height: minHeight,
            background,
            marginBottom: 24,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              padding,
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              ref={pageIndex === 0 ? measureRef : null}
              style={{
                height: contentHeight,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  transform: `translateY(-${pageIndex * contentHeight}px)`,
                }}
              >
                <Component data={data} config={config} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PageRenderer;
