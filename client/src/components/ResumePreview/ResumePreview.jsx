import { useEffect, useRef, useState } from "react";
import ResumeClassicV1 from "../ResumeTemplates/ResumeClassicV1";
import ResumeClassicV2 from "../ResumeTemplates/ResumeClassicV2";
import ResumeClassicBlue from "../ResumeTemplates/ResumeClassicBlue";
import { Expand } from "lucide-react";
import MobileResumeWrapper from "./MobileResumeWrapper";

const ResumePreview = () => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      const resumeWidth = 794; // A4 width

      const newScale = Math.min(containerWidth / resumeWidth, 1);
      setScale(newScale);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const resumeSettings = {
    fontFamily: "Times New Roman, Times, serif",
    primaryColor: "#2563eb",
    textColor: "#000000",

    fontSizes: {
      name: 26,
      section: 13,
      body: 11,
      small: 10.5,
    },

    margin: 40,

    photo: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
  };

  const resumeData = {
    personal: {
      name: "Rahul Sharma",
      title: "Senior Software Engineer",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      address: "Bengaluru, India",
      summary:
        "Senior Software Engineer with 10+ years of experience designing, building, and scaling distributed systems and high-traffic web platforms. Proven expertise in system design, backend architecture, and performance optimization. Strong background in leading complex projects, mentoring engineers, and collaborating with product and business stakeholders to deliver impact at scale.",
      github: "github.com/rahulsharma",
      linkedin: "linkedin.com/in/rahulsharma",
      avatar:
        "data:image/jpeg;base64,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",
    },

    experience: [
      {
        role: "Senior Software Engineer",
        company: "TechNova Solutions",
        duration: "July 2019 – Present",
        description: [
          "Designed and led development of scalable microservices handling over 20M+ requests per day using Node.js, Java, and cloud-native architectures.",
          "Owned end-to-end system design for critical business workflows, improving system reliability to 99.99% uptime.",
          "Optimized database performance and caching layers, reducing average API latency by 45%.",
          "Collaborated closely with product managers and architects to define technical roadmaps and long-term platform strategy.",
          "Mentored 6+ junior and mid-level engineers, conducted design reviews, and established coding best practices across teams.",
        ],
      },
      {
        role: "Software Engineer",
        company: "NextGen Digital Systems",
        duration: "June 2015 – June 2019",
        description: [
          "Built and maintained core backend services for a SaaS platform used by enterprise customers across multiple regions.",
          "Implemented CI/CD pipelines and automated testing frameworks, reducing deployment failures by 60%.",
          "Worked extensively on RESTful APIs, authentication systems, and data pipelines using Node.js, Python, and SQL databases.",
        ],
      },
    ],

    projects: [
      {
        title: "High-Scale Resume Intelligence Platform",
        description: [
          "Architected a distributed MERN-based platform capable of analyzing and scoring resumes at scale using AI-driven keyword extraction.",
          "Designed backend services for ATS compatibility analysis, improving recruiter matching accuracy by over 40%.",
          "Integrated role-based access control, audit logging, and performance monitoring for enterprise clients.",
        ],
      },
      {
        title: "Real-Time Analytics Dashboard",
        description: [
          "Built a real-time analytics system using WebSockets and event-driven architecture to process millions of events daily.",
          "Optimized data ingestion pipelines and caching strategies to support low-latency dashboards for business stakeholders.",
        ],
      },
    ],

    skills: [
      "System Design",
      "Distributed Systems",
      "Microservices Architecture",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Java",
      "React",
      "Cloud Architecture (AWS)",
      "REST APIs",
      "Databases (PostgreSQL, MongoDB)",
      "Caching (Redis)",
      "CI/CD",
      "Docker",
      "Kubernetes",
      "Git",
    ],

    education: [
      {
        degree: "Bachelor of Engineering in Computer Science",
        institute: "ABC Institute of Technology",
        from: "2011",
        to: "2015",
      },
    ],
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-[#eef1f5] flex justify-center items-start p-2"
    >
      {/* Expand button */}
      <Expand
        onClick={() => setOpen(true)}
        className="absolute w-4 h-4 cursor-pointer text-[#6B6B6B] top-3 right-7 z-[100]"
      />

      {/* SCROLL CONTAINER (NOT SCALED) */}
      <div className="w-full h-full overflow-x-hidden overflow-y-auto scrollbar-minimal pr-5 flex justify-center">
        {/* SCALE WRAPPER (NO SCROLL HERE) */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {/* FIXED WIDTH RESUME */}
          <ResumeClassicBlue data={resumeData} settings={resumeSettings} />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* Modal container */}
          <div
            className="absolute inset-0 flex flex-col overflow-x-hidden overflow-scroll"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            {/* White sheet */}
            <div
              className="
          relative
          shadow-2xl
          mx-auto
          my-4
          w-[794px]
          max-w-[95vw]
          flex
          flex-col
        "
            >
              {/* Header */}
              <div className="sticky top-0 z-50 flex justify-end p-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-1  rounded shadow bg-white text-sm"
                >
                  Close
                </button>
              </div>

              {/* Scrollable resume */}
              <div className="flex-1 overflow-auto">
                <MobileResumeWrapper>
                  <ResumeClassicBlue
                    data={resumeData}
                    settings={resumeSettings}
                  />
                </MobileResumeWrapper>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
