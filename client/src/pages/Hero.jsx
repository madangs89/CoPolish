import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import linkedInImage from "../../public/linkedIn.png";
import { ChevronRight } from "lucide-react";

import FeatureGrid from "../components/FeatureGrid";
import WhyChoose from "../components/WhyChoose";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import FinalCTA from "../components/FinalCTA";
import Cursor from "../components/Cursor";
import Navbar from "../components/Navbars/Navbar";
import { setAuthOpen } from "../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import AuthOverlay from "../components/AuthOverlay";

let heroTittle = "AI That Makes Your Resume And LinkedIn Shine";

const Hero = () => {
  const ref = useRef(null);
  const heroRef = useRef(null);

  const [boxes, setBoxes] = useState({ cols: 0, rows: 0 });

  const tilesWidth = 80;
  const tilesHeight = 80;
  const gap = 12;

  const authOpen = useSelector((state) => state.auth.authOpen);
  const dispatch = useDispatch();

  /* ================= GRID CALC ================= */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;

      setBoxes({
        cols: Math.floor(w / (tilesWidth + gap)),
        rows: Math.floor(h / (tilesHeight + gap)),
      });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  /* ================= GSAP FIX ================= */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });
      tl.from(".hero-heading", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
      })
        .from(
          ".hero-sub",
          {
            y: 40,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          ".hero-btn",
          {
            y: 40,
            opacity: 0,
            scale: 0.95,
            duration: 0.2,
          },
          "-=0.3",
        );

      tl.from(".f-grid", {
        y: 90,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "power4.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroRef}
      className="w-full relative min-h-screen h-screen overflow-x-hidden bg-white"
    >
      <Cursor />

      {/* ================= GRID BG ================= */}
      <div
        ref={ref}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.max(
            boxes.cols,
            1,
          )}, ${tilesWidth}px)`,
          gridAutoRows: `${tilesHeight}px`,
          gap: `${gap}px`,
          justifyContent: "center",
          alignContent: "center",
          padding: `${gap}px`,
        }}
      >
        {Array.from({ length: boxes.cols * boxes.rows }).map((_, index) => (
          <div
            key={index}
            className="w-20 h-20 bg-box bg-white border-2 rounded-md shadow-md"
          />
        ))}
      </div>

      {/* ================= OVERLAY ================= */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-white/100 via-[#a3a3a3]/90 to-[#a3a3a3]/95 opacity-85" />

      <div className="relative py-4 w-full h-full z-[100]">
        <div className="absolute inset-0 bg-white opacity-45 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto w-full h-full z-10">
          <Navbar />

          {/* ================= HERO ================= */}
          <div className="w-full mx-auto flex flex-col gap-6 mt-10 lg:mt-3 items-center justify-center h-[65%]">
            <h1
              onMouseEnter={() =>
                gsap.to("#cursor", { scale: 3.5, duration: 0.3 })
              }
              onMouseLeave={() =>
                gsap.to("#cursor", { scale: 1, duration: 0.3 })
              }
              className="font-bold  tracking-wide xl:text-7xl md:text-6xl text-5xl text-[#2A2C42] leading-[1.1] w-[90%] md:w-[75%] text-center"
            >
              {heroTittle.split(" ").map((t, index) => {
                return (
                  <span key={index} className="hero-heading inline-block mr-3">
                    {t}
                  </span>
                );
              })}
            </h1>

            <h3 className="font-bold hero-sub tracking-wide text-base xl:text-sm text-[#414565] w-[80%] md:w-[60%] text-center">
              Coploish.ai rewrites your resume, enhances your LinkedIn profile,
              and generates high-performing posts — all with the precision of an
              expert career coach.
            </h3>

            <button className="bg-black hero-btn flex items-center gap-1 rounded-full px-4 py-2.5 text-white text-[16px]">
              <p
                onMouseEnter={() =>
                  gsap.to("#cursor", { scale: 2.5, duration: 0.3 })
                }
                onMouseLeave={() =>
                  gsap.to("#cursor", { scale: 1, duration: 0.3 })
                }
              >
                Start Free
              </p>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <FeatureGrid />
          <HowItWorks />
          <WhyChoose />
          <Testimonials />
          <Pricing />
          <FAQ />
          <FinalCTA />
          <Footer />
        </div>
      </div>

      <AuthOverlay
        open={authOpen}
        onClose={() => dispatch(setAuthOpen(false))}
      />
    </div>
  );
};

export default Hero;
