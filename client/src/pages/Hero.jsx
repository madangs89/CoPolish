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
import OnboardingSource from "./OnboardingSource";
import Navbar from "../components/Navbars/Navbar";
const Hero = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  const [boxes, setBoxes] = useState({ cols: 0, rows: 0 });
  let tilesWidth = 80; // 16 * 4 (including margin)
  let tilesHeight = 80; // 16 * 4 (including margin)
  let gap = 12;
  useEffect(() => {
    let el = ref.current;
    if (!el) {
      return;
    }

    let compute = () => {
      let w = el.clientWidth;
      let h = el.clientHeight;

      let cols = Math.floor(w / (tilesWidth + gap));
      let rows = Math.floor(h / (tilesHeight + gap));

      setBoxes((prev) => {
        return {
          ...prev,
          cols,
          rows,
        };
      });
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div className="w-full relative min-h-screen h-screen overflow-x-hidden  bg-white">
      <Cursor />
      <div
        ref={ref}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.max(
            boxes.cols,
            1
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
            className="w-20 h-20 bg-white border-2 rounded-md shadow-md m-1 inline-block"
          ></div>
        ))}
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none w-full h-full bg-gradient-to-t from-white/100 via-[#a3a3a3]/90 to-[#a3a3a3]/95 opacity-85 flex flex-col justify-center items-center text-center px-4"></div>
      <div className="relative  py-4 w-full h-full z-[100]">
        {/* background fade only */}
        <div className="absolute inset-0 bg-white opacity-45 pointer-events-none"></div>

        <div className="relative  w-full h-full  z-10">
          <Navbar />
          <div className="w-full mx-auto flex-col gap-6  flex items-center justify-center h-[65%]">
            <h1
              onMouseEnter={() => {
                gsap.to("#cursor", {
                  scale: 3.5,
                  color: "white",
                  duration: 0.3,
                });
              }}
              onMouseLeave={() => {
                gsap.to("#cursor", { scale: 1, color: "white", duration: 0.3 });
              }}
              className="font-bold tracking-wide text-6xl text-[#2A2C42] leading-[1.1]  w-[65%] text-center"
            >
              AI That Makes Your Resume And LinkedIn Shine
            </h1>

            <h3 className="font-bold tracking-wide text-sm text-[#414565] leading-[1.1]  w-[43%] text-center">
              Coploish.ai rewrites your resume, enhances your LinkedIn profile,
              and generates high-performing posts — all with the precision of an
              expert career coach.
            </h3>

            <button className="bg-black  shadow-white  flex items-center justify-center gap-1 rounded-full px-4 py-2.5 text-white text-[16px]">
              <p
                onMouseEnter={() => {
                  gsap.to("#cursor", {
                    scale: 2.5,
                    color: "white",
                    duration: 0.3,
                  });
                }}
                onMouseLeave={() => {
                  gsap.to("#cursor", {
                    scale: 1,
                    color: "white",
                    duration: 0.3,
                  });
                }}
              >
                Start Free
              </p>{" "}
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
          {/* <div className="h-20 w-full"></div> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
