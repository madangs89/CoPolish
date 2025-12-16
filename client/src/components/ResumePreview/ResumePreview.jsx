import React, { useEffect, useRef, useState } from "react";

const A4_WIDTH = 794;

const ResumePreview = ({ children }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const newScale = containerWidth / A4_WIDTH;

      setScale(newScale > 1 ? 1 : newScale);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflow: "auto",
        background: "#f3f4f6",
        padding: "24px",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "794px",
          height: "1123px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ResumePreview;
