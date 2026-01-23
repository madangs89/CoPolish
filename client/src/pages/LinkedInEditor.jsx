import React, { useState } from "react";

const LinkedInEditor = () => {
  const fakeData = {
    personalInfo: {
      fullName: "Aarav Mehta",
      location: "Bengaluru, Karnataka, India",
      email: "aarav.mehta@protonmail.com",
      phone: "+91 98XXX XXXXX",
      linkedinUrl: "https://www.linkedin.com/in/aaravmehta",
      portfolioUrl: "https://aaravmehta.dev",
      githubUrl: "https://github.com/aaravmehta",
      banner: "",
      profileUrl:
        "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1",
    },

    // ================= HEADLINE =================
    headline: {
      currentId: "201",
      options: [
        {
          _id: "201",
          text: "Staff Software Engineer | Designing Large-Scale Distributed Systems | Node.js, React, Cloud & AI Platforms | Building Products Used by Millions",
          structure: "PARAGRAPH",
          tone: "FORMAL",
          hookScore: 0.92,
          createdAt: new Date(),
        },
        {
          _id: "202",
          text: "Staff Engineer building high-scale platforms used by millions 🚀 | Distributed Systems, Cloud, Node.js, React | Turning complex problems into reliable products",
          structure: "PARAGRAPH",
          tone: "CONFIDENT",
          hookScore: 0.9,
          createdAt: new Date(),
        },
        {
          _id: "203",
          text: "Driving engineering excellence at scale | Architecting systems that power millions of users | Staff Engineer | Cloud, Distributed Systems, AI",
          structure: "PARAGRAPH",
          tone: "BOLD",
          hookScore: 0.88,
          createdAt: new Date(),
        },
      ],
    },

    // ================= ABOUT =================
    about: {
      currentId: "301",
      options: [
        {
          _id: "301",
          text: "I am a Staff Software Engineer with 10+ years of experience building and scaling high-impact software products. I specialize in designing distributed systems, leading complex technical initiatives, and mentoring engineering teams. Over my career, I have architected platforms serving millions of users with a strong focus on reliability, performance, and long-term maintainability.\n\nI have deep expertise in Node.js, React, cloud-native architectures, and data-driven systems. I enjoy working at the intersection of business and engineering—translating ambiguous problems into clear technical solutions. I believe great engineering is not just about writing code, but about making thoughtful decisions that scale teams and products sustainably.",
          structure: "PARAGRAPH",
          tone: "FORMAL",
          hookScore: 0.93,
          createdAt: new Date(),
        },
        {
          _id: "302",
          text: "• Staff Software Engineer with 10+ years of experience building large-scale systems\n• Architected platforms serving millions of users with high availability and low latency\n• Expert in Node.js, React, cloud-native architecture, and distributed systems\n• Led critical technical initiatives across multiple teams and stakeholders\n• Strong believer in clean architecture, engineering rigor, and mentorship\n• Passionate about solving complex problems with simple, scalable solutions\n• Experienced in guiding teams through growth, scale, and technical transformation",
          structure: "BULLETS",
          tone: "CONFIDENT",
          hookScore: 0.91,
          createdAt: new Date(),
        },
        {
          _id: "303",
          text: "• STAFF ENGINEER driving large-scale systems used by millions\n• ARCHITECT of resilient, cloud-native platforms\n• TECHNICAL LEADER mentoring teams and setting engineering standards\n• PROBLEM SOLVER trusted with mission-critical systems\n• BUILDER focused on long-term scalability, reliability, and impact",
          structure: "BULLETS",
          tone: "BOLD",
          hookScore: 0.88,
          createdAt: new Date(),
        },
      ],
    },

    // ================= EXPERIENCE =================
    experience: [
      {
        role: "Staff Software Engineer",
        company: "Global Tech Company",
        from: "2019-06-01",
        to: "Present",
        bullets: {
          currentTone: "FORMAL",
          current: [
            "Led architecture and development of distributed systems serving over 10M+ monthly active users",
            "Drove technical decisions across multiple teams, improving system reliability and performance",
            "Mentored senior and mid-level engineers, setting engineering standards and best practices",
          ],
          suggestions: [
            {
              bullets: [
                "Architected and scaled a core platform handling 100K+ requests per second with 99.99% uptime",
                "Reduced infrastructure costs by 35% through system redesign and cloud optimization",
              ],
              improvementType: "IMPACT",
              createdAt: new Date(),
            },
          ],
        },
        type: "FULL_TIME",
      },
      {
        role: "Staff Software Engineer",
        company: "Global Tech Company",
        from: "2019-06-01",
        to: "Present",
        bullets: {
          current: [
            "Led architecture and development of distributed systems serving over 10M+ monthly active users",
            "Drove technical decisions across multiple teams, improving system reliability and performance",
            "Mentored senior and mid-level engineers, setting engineering standards and best practices",
          ],
          suggestions: [
            {
              bullets: [
                "Architected and scaled a core platform handling 100K+ requests per second with 99.99% uptime",
                "Reduced infrastructure costs by 35% through system redesign and cloud optimization",
              ],
              improvementType: "IMPACT",
              createdAt: new Date(),
            },
          ],
        },
      },
    ],

    // ================= SKILLS =================
    skills: {
      current: [
        "Distributed Systems",
        "System Design",
        "Node.js",
        "React",
        "Cloud Architecture",
        "Microservices",
        "Leadership",
        "Mentorship",
      ],
      suggestions: [
        {
          skills: [
            "Event-Driven Architecture",
            "Kubernetes",
            "AI Platform Design",
          ],
          reason: "JD_MATCH",
          createdAt: new Date(),
        },
      ],
    },

    // ================= SEO =================
    seo: {
      activeKeywords: [
        "Staff Software Engineer",
        "Distributed Systems",
        "System Design",
        "Cloud Architecture",
        "Technical Leadership",
      ],
      suggestedSets: [
        {
          keywords: ["Staff Engineer", "System Design", "Distributed Systems"],
          jobRole: "Staff Software Engineer",
          matchScore: 0.97,
        },
      ],
    },

    // ================= SCORE =================
    score: {
      before: {
        type: 0,
        default: 0,
      },
      after: {
        type: 0,
        default: 0,
      },
      searchability: 92,
      clarity: 90,
      impact: 94,
    },
  };

  // ---------------- STATE ----------------
  const [headlineId, setHeadlineId] = useState(fakeData.headline.currentId);
  const [aboutId, setAboutId] = useState(fakeData.about.currentId);

  const currentHeadline = fakeData.headline.options.find(
    (o) => o._id === headlineId,
  );

  const currentAbout = fakeData.about.options.find((o) => o._id === aboutId);

  // ---------------- HANDLERS ----------------
  const handleOptimize = (section, tone) => {
    console.log("Optimize request:", section, tone);
    // 👉 Call API here
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] flex justify-center">
      <div className="w-full max-w-3xl my-20 flex flex-col gap-5">
        {/* ================= PROFILE HEADER ================= */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="relative h-36">
            <img
              src="https://img.freepik.com/free-vector/half-tone-blue-abstract-background-with-text-space_1017-41428.jpg"
              className="w-full h-full object-cover"
            />
            <img
              src={fakeData.personalInfo.profileUrl}
              className="absolute left-6 -bottom-12 w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>

          <div className="pt-16 px-6 pb-4">
            <h1 className="text-xl font-semibold">
              {fakeData.personalInfo.fullName.toUpperCase()}
            </h1>

            <p className="text-sm text-gray-800 mt-1">{currentHeadline.text}</p>

            <p className="text-xs text-gray-500 mt-1">
              {fakeData.personalInfo.location}
            </p>
          </div>
        </div>

        {/* ================= HEADLINE OPTIMIZER ================= */}
        <div className="bg-white rounded-xl px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Headline</h2>
            <button
              className="text-blue-600 text-sm font-medium"
              onClick={() => handleOptimize("headline", currentHeadline.tone)}
            >
              ✨ Optimize
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            {fakeData.headline.options.map((opt) => (
              <button
                key={opt._id}
                onClick={() => setHeadlineId(opt._id)}
                className={`px-3 py-1 text-xs rounded-md border
                  ${
                    opt._id === headlineId
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
              >
                {opt.tone}
              </button>
            ))}
          </div>

          <p className="text-sm mt-3 text-gray-900">{currentHeadline.text}</p>
        </div>

        {/* ================= ABOUT OPTIMIZER ================= */}
        <div className="bg-white rounded-xl px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">About</h2>
            <button
              className="text-blue-600 text-sm font-medium"
              onClick={() => handleOptimize("about", currentAbout.tone)}
            >
              ✨ Optimize
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            {fakeData.about.options.map((opt) => (
              <button
                key={opt._id}
                onClick={() => setAboutId(opt._id)}
                className={`px-3 py-1 text-xs rounded-md border
                  ${
                    opt._id === aboutId
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
              >
                {opt.tone}
              </button>
            ))}
          </div>

          <p className="text-sm mt-3 whitespace-pre-line text-gray-900">
            {currentAbout.text}
          </p>
        </div>

        {/* ================= EXPERIENCE ================= */}
        <div className="bg-white rounded-xl px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Experience</h2>
            <button className="text-blue-600 text-sm font-medium">
              ✨ Optimize
            </button>
          </div>

          {fakeData.experience.map((exp, idx) => (
            <div key={idx} className="mt-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">
                  {exp.role} · {exp.company}
                </p>
                {/* <div className="flex items-center justify-center gap-2 mt-3"> */}
                {exp.bullets.suggestions.map((opt, sindex) => (
                  <button
                    key={sindex}
                    //   onClick={() => setAboutId(opt._id)}
                    className={`px-3 py-1 text-xs rounded-md border
                  ${
                    opt.improvementType === opt.bullets.currentTone
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  >
                    {opt.improvementType}
                  </button>
                ))}
                {/* </div> */}
              </div>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                {exp.bullets.current.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ================= SKILLS ================= */}
        <div className="bg-white rounded-xl px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Skills</h2>
            <button className="text-blue-600 text-sm font-medium">
              ✨ Optimize
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {fakeData.skills.current.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-100 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Score Section */}
      <div className="fixed top-20 bg-white left-5 z-50">
        <div className="bg-transparent rounded-xl  p-4 w-[250px] flex flex-col gap-4">
          {/* Main Score */}
          <div className="flex  items-center  gap-4">
            <div className="relative  score  overflow-hidden  w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-gray-200"></div>
              <div className="absolute inset-0 rounded-full bg-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                92
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-xs text-gray-500">Overall</p>
              <p className="text-sm font-medium text-gray-900">Excellent</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex flex-col gap-2">
            {[
              { label: "Searchability", value: 92 },
              { label: "Clarity", value: 90 },
              { label: "Impact", value: 94 },
            ].map((item) => (
              <div key={item.label} className="flex items-center ">
                <span className="text-xs w-24 text-gray-600">{item.label}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

         
        </div>
      </div>




      <div className="fixed w-[250px] right-10 top-20 z-50 h-[300px] bg-white"> 
      
      
      </div>
    </div>
  );
};

export default LinkedInEditor;
