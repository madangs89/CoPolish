import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Cursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    // make cursor not intercept any pointer events
    el.style.pointerEvents = "none";
    // tell browser we will animate transform for better perf
    el.style.willChange = "transform";

    // compute half-size for centering the cursor under pointer
    const rect = el.getBoundingClientRect();
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      gsap.to(el, {
       x: clientX -16/2, y: clientY -16/2, duration:1, ease:"power3.out", delay:0,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      id="cursor"
      className="w-4 h-4 mix-blend-difference fixed  rounded-full top-0 left-0 z-[1111110] bg-white pointer-events-none"
    />
  );
};

export default Cursor;
