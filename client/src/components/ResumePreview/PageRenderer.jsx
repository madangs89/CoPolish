import { useEffect, useRef, useState } from "react";

const PageRenderer = ({ Component, data, config }) => {
  const measureRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);

  const { width, minHeight, padding, background } = config.page;
  const contentHeight = minHeight - padding * 2;
  const contentWidth = width - padding * 2;

  /* ---------- MEASURE CONTENT ---------- */
  useEffect(() => {
    if (!measureRef.current) return;

    const totalHeight = measureRef.current.scrollHeight;
    setPageCount(Math.max(1, Math.ceil(totalHeight / contentHeight)));
  }, [data, config, Component]);

  return (
    <>
      {/* HIDDEN MEASUREMENT (UNSCALED) */}
      <div
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          width: contentWidth,
        }}
      >
        <Component data={data} config={config} />
      </div>

      {/* REAL PAGES */}
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
              style={{
                height: contentHeight,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  transform: `translateY(-${
                    pageIndex * contentHeight
                  }px)`,
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
