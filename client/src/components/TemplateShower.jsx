import React from "react";
import { useDispatch, useSelector } from "react-redux";
import BalancedTwoColumnResume from "./ResumeTemplates/BalancedTwoColumnResume";
import CareerTimelineResume from "./ResumeTemplates/CareerTimelineResume";
import CleanProfessionalResume from "./ResumeTemplates/CleanProfessionalResume";
import HarvardResume from "./ResumeTemplates/HarvardResume";
import ModernMinimalResume from "./ResumeTemplates/ModernMinimalResume";
import ProfessionalSidebarResume from "./ResumeTemplates/ProfessionalSidebarResume";
import ResumeClassicBlue from "./ResumeTemplates/ResumeClassicBlue";
import ResumeClassicV1 from "./ResumeTemplates/ResumeClassicV1";
import { setCurrentResumeTemplateId } from "../redux/slice/resumeSlice";
import { templateRegistry } from "../config/templateRegistory";
import { useEffect } from "react";

const fakeResumeData = {
  personal: {
    name: "Amit Kumar",
    title: "Senior Full Stack Engineer | Tech Lead",
    email: "amit.kumar@example.com",
    phone: "+91 98765 43210",
    summary:
      "Senior Full Stack Engineer with 7+ years of experience building large-scale, high-performance web platforms serving millions of users. Expert in system design, distributed systems, and leading engineering teams to deliver business-critical products.",
    github: "https://github.com/amitkumar",
    linkedin: "https://linkedin.com/in/amitkumar",
    address: "Bangalore, India",
    hackerRank: "https://www.hackerrank.com/amitkumar",
  },

  education: [
    {
      degree: "B.Tech in Computer Science",
      institute: "Indian Institute of Technology (IIT)",
      from: "2014",
      to: "2018",
    },
  ],

  experience: [
    {
      role: "Senior Software Engineer / Tech Lead",
      company: "Global FinTech Corp",
      from: "Jul 2021",
      to: "Present",
      duration: "3+ years",
      description: [
        "Led a team of 8 engineers to build a high-traffic financial platform handling 10M+ monthly users",
        "Designed scalable microservices architecture reducing API latency by 45%",
        "Implemented distributed caching and queue-based processing improving system throughput by 3×",
        "Worked closely with product and business teams to deliver features impacting ₹200Cr+ annual revenue",
      ],
    },
    {
      role: "Software Engineer",
      company: "Product-Based SaaS Company",
      from: "Aug 2018",
      to: "Jun 2021",
      duration: "3 years",
      description: [
        "Built core frontend architecture using React and Redux for enterprise dashboards",
        "Developed backend services using Node.js, MongoDB, and PostgreSQL",
        "Optimized database queries and indexes improving report generation speed by 60%",
      ],
    },
  ],

  skills: [
    "JavaScript (ES6+)",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "NestJS",
    "MongoDB",
    "PostgreSQL",
    "Redis",
    "Kafka",
    "System Design",
    "Microservices",
    "AWS",
    "Docker",
    "Kubernetes",
  ],

  projects: [
    {
      title: "Enterprise Resume Intelligence Platform",
      description: [
        "Architected an AI-driven resume analysis platform used by large recruitment firms",
        "Designed scalable backend handling 100K+ resume uploads per day",
        "Integrated LLM-based scoring and recommendation engine improving recruiter efficiency by 40%",
      ],
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Redis",
        "Kafka",
        "AWS",
        "LLM APIs",
      ],
      link: [
        {
          title: "GitHub",
          url: "https://github.com/amitkumar/resume-intelligence-platform",
        },
        {
          title: "Live Product",
          url: "https://resume-intelligence.example.com",
        },
      ],
    },
  ],

  certifications: [
    {
      name: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      year: "2022",
      credentialUrl: "",
      link: [
        {
          title: "Credential",
          url: "https://www.credly.com/badges/aws-solutions-architect-professional",
        },
      ],
    },
  ],

  achievements: [
    "Promoted twice within 3 years for exceptional technical leadership",
    "Designed systems handling peak traffic of 50K requests per second",
    "Speaker at national-level tech conferences on system design",
  ],

  hobbies: [
    "System design blogging",
    "Mentoring junior engineers",
    "Competitive badminton",
  ],

  extracurricular: [
    {
      role: "Engineering Mentor",
      activity: "Open Source Community",
      year: "2020–Present",
      description:
        "Mentored 100+ engineers in system design, backend architecture, and career growth",
    },
  ],

  templateId: "modern",
  changes: [],
  scoreBefore: 78,
  scoreAfter: 92,
  suggestions: [
    "Highlight cross-team leadership impact",
    "Add quantified business outcomes in projects",
    "Include global-scale architecture keywords",
  ],
};

// templateRegistry

const TemplateShower = ({ setResumeTemplate }) => {
  const config = useSelector((state) => state.resume.config);
  const currentResume = useSelector((state) => state.resume.currentResume);
  const currentTemplateId = useSelector(
    (state) => state.resume.currentResume.templateId,
  );

  const dispatch = useDispatch();

  return (
    <div className="w-full px-2 h-screen flex flex-col gap-4  ">
      {Object.keys(templateRegistry).map((key) => {
        const TemplateComponent = templateRegistry[key];

        if (!TemplateComponent) return null; // safety

        return (
          <div
            key={key}
            onClick={() => {
              setResumeTemplate(key);
            }}
            className={`w-full ${currentTemplateId === key ? "border-2 border-blue-500" : "border"} cursor-pointer bg-gray-100 flex h-[600px] items-start flex-col  rounded-lg p-4 `}
          >
            <h1 className="text-sm  font-semibold mb-2">{key}</h1>

            <div className="relative h-full w-[330px] overflow-hidden border bg-white">
              <div
                className="origin-top-left p-5 scale-[0.45]"
                style={{ width: "800px" }}
              >
                <TemplateComponent data={fakeResumeData} config={config} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TemplateShower;
