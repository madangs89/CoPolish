import { useEffect, useRef } from "react";
import { Wand2, Linkedin, FileUser, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dash-word", {
        y: 90,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "power4.out",
      });

      gsap.from(".score-block", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        stagger: 0.2,
        ease: "power3.out",
      });
      gsap.from(".aiInsight", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.from(".resume-preview", {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        delay: 1.1,
        ease: "power4.out",
      });

      gsap.from(".cta-block", {
        scale: 0.94,
        opacity: 0,
        duration: 1,
        delay: 1.3,
        ease: "power4.out",
      });

      gsap.from(".linkedin-float", {
        x: 120,
        opacity: 0,
        duration: 1,
        delay: 1.4,
        ease: "power4.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#f7f7f7] px-6 md:px-16 py-16 overflow-hidden relative"
    >
      {/* ================= HERO ================= */}
      <h1 className="text-[2.8rem] md:text-[4.8rem] font-semibold leading-[1.05] text-[#1f2430] max-w-6xl">
        {"Your profile is visible,".split(" ").map((w, i) => (
          <span key={i} className="dash-word inline-block mr-3">
            {w}
          </span>
        ))}
        <br />
        {"but not impressive yet.".split(" ").map((w, i) => (
          <span key={i} className="dash-word inline-block mr-3">
            {w}
          </span>
        ))}
      </h1>

      {/* ================= AI INSIGHT ================= */}
      <p className="mt-10 aiInsight max-w-3xl text-lg text-[#555]">
        Our AI analyzed your resume and LinkedIn profile and detected
        <span className="text-black font-medium">
          {" "}
          critical performance gaps{" "}
        </span>
        affecting recruiter visibility.
      </p>

      {/* ================= SCORES ================= */}
      <div className="mt-16 flex flex-col md:flex-row gap-14">
        <div className="score-block">
          <p className="text-sm uppercase tracking-wide text-[#888] mb-2">
            Resume Score
          </p>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-semibold text-[#1f2430]">78</span>
            <span className="text-lg text-[#999] mb-1">/100</span>
          </div>
          <p className="text-sm text-[#777] mt-1">
            Missing ATS keywords & impact metrics
          </p>
        </div>

        <div className="score-block">
          <p className="text-sm uppercase tracking-wide text-[#888] mb-2">
            LinkedIn Score
          </p>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-semibold text-[#1f2430]">71</span>
            <span className="text-lg text-[#999] mb-1">/100</span>
          </div>
          <p className="text-sm text-[#777] mt-1">
            Headline & About section need clarity
          </p>
        </div>
        <div className="score-block">
          <p className="text-sm uppercase tracking-wide text-[#888] mb-2">
            LinkedIn Score
          </p>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-semibold text-[#1f2430]">71</span>
            <span className="text-lg text-[#999] mb-1">/100</span>
          </div>
          <p className="text-sm text-[#777] mt-1">
            Headline & About section need clarity
          </p>
        </div>
      </div>

      {/* ================= RESUME PREVIEW ================= */}
      <div className="cta-block mt-20 max-w-4xl">
        <div className="rounded-[32px] bg-black text-white px-10 py-14">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Credits available: <span className="text-white ml-1">52</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Your resume is strong —
            <br />
            but not competitive.
          </h2>

          <button
            onClick={() => navigate("/editor/resume/1324")}
            className="inline-flex items-center gap-3 mt-4 text-sm font-medium
            px-7 py-3 rounded-full bg-white text-black hover:scale-105 transition"
          >
            <Wand2 className="w-4 h-4" />
            Improve Resume Now
          </button>
        </div>
      </div>

      {/* ================= LINKEDIN FLOAT ================= */}
      <div
        className="
    linkedin-float
    relative
    mt-16
    w-full
    lg:mt-0
    lg:absolute
    lg:right-16
    lg:top-[60%]
    lg:w-[300px]
  "
      >
        <div className="rounded-3xl bg-white shadow-2xl p-6">
          <p className="font-medium text-sm mb-3">LinkedIn Preview</p>

          <p className="text-sm font-medium">
            Full Stack Developer | MERN | AI Tools
          </p>

          <p className="text-xs text-[#777] mt-2 leading-relaxed">
            Headline lacks clarity and keyword alignment. About section is
            under-optimized.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
