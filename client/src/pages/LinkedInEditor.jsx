import React from "react";

const LinkedInEditor = () => {
  const fakeData = {
    personalInfo: {
      fullName: "Jane Smith",
      location: "New York, NY",
      email: "jane.smith@example.com",
      phone: "+1 987-654-3210",
      linkedinUrl: "https://www.linkedin.com/in/janesmith",
      portfolioUrl: "https://www.janesmithportfolio.com",
      githubUrl: "https://github.com/janesmith",
      banner: "",
      profileUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVA_HrQLjkHiJ2Ag5RGuwbFeDKRLfldnDasw&s",
    },

    headline: {
      currentId: "125",
      options: [
        {
          _id: "125",
          text: "I am a Full Stack Developer with a passion for building web applications , I specialize in React and Node.js development , I specialize in React and Node.js development",
          structure: "PARAGRAPH",
          tone: "FORMAL",
          hookScore: 0.9,
          createdAt: new Date(),
        },
        {
          _id: "126",
          text: "I specialize in React and Node.js development",
          structure: "PARAGRAPH",
          tone: "CONFIDENT",
          hookScore: 0.85,
          createdAt: new Date(),
        },
        {
          _id: "127",
          text: "Experienced in building scalable applications and RESTful APIs",
          structure: "PARAGRAPH",
          tone: "BOLD",
          hookScore: 0.88,
          createdAt: new Date(),
        },
      ],
    },

    about: {
      currentId: "128",
      options: [
        {
          _id: "128",
          text: "I am a dedicated developer with a strong background in software engineering and a passion for learning new technologies.",
          structure: "PARAGRAPH",
          tone: "FORMAL",
          hookScore: 0.9,
          createdAt: new Date(),
        },
      ],
    },

    // ---------- EXPERIENCE ----------
    experience: [
      {
        role: "Software Engineer",
        company: "Tech Solutions Inc.",
        from: "2021-01-01",
        to: "Present",
        bullets: {
          current: [
            "Developed web applications",
            "Collaborated with cross-functional teams",
          ],
          suggestions: [
            {
              bullets: ["Implemented new features", "Optimized existing code"],
              improvementType: "IMPACT",
              createdAt: new Date(),
            },
          ],
        },
      },
    ],

    // ---------- SKILLS ----------
    skills: {
      current: ["JavaScript", "React", "Node.js", "MongoDB"],
      suggestions: [
        {
          skills: ["TypeScript", "GraphQL"],
          reason: "JD_MATCH",
          createdAt: new Date(),
        },
      ],
    },

    // ---------- SEO / KEYWORDS ----------
    seo: {
      activeKeywords: [
        "Full Stack Developer",
        "Web Applications",
        "Software Engineering",
      ],
      suggestedSets: [
        {
          keywords: ["JavaScript", "React", "Node.js"],
          jobRole: "Full Stack Developer",
          matchScore: 0.95,
        },
      ],
    },

    // ---------- SCORING ----------
    score: {
      before: {
        type: 0,
        default: 0,
      },
      after: {
        type: 0,
        default: 0,
      },
      searchability: 0,
      clarity: 0,
      impact: 0,
    },
  };
  return (
    <div className="mx-auto rounded-xl ruda-font   flex items-center  flex-col bg-[#F4F2EE] min-h-screen w-full">
      <div className="mx-auto max-w-4xl mt-20 rounded-xl flex flex-col items-center bg-[#F4F2EE] min-h-screen w-full">
        {/* Header Section */}

        <div className="w-full  rounded-xl pb-5 bg-white h-fit">
          <div className="w-full  rounded-t-xl  h-36 relative">
            <img
              src="https://img.freepik.com/free-vector/half-tone-blue-abstract-background-with-text-space_1017-41428.jpg?semt=ais_hybrid&w=740&q=80"
              className="w-full h-full rounded-t-xl object-cover"
            />

            <div className="absolute z-[100000] w-36 h-36 bg-zinc-400 rounded-full overflow-hidden -bottom-10 left-10">
              <img
                src={fakeData?.personalInfo?.profileUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="mt-10 max-w-3xl gap-1 flex-col text-wrap flex items-start justify-start px-5">
            <p className="font-bold text-wrap   text-2xl">
              {fakeData?.personalInfo?.fullName?.toUpperCase()}
            </p>

            <div className=" justify-center items-start  flex gap-2">
              <p className="text-wrap text-sm font-medium  text-black">
                {
                  fakeData?.headline?.options.find(
                    (opt) => opt._id === fakeData?.headline?.currentId,
                  )?.text
                }
              </p>
              <select name="headline" id="headline" className="p-2 border">
                {fakeData?.headline?.options.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.tone}
                  </option>
                ))}
              </select>
              <button className="p-2 bg-blue-600 text-white text-xs rounded-md ">
                Optimize
              </button>
            </div>
            <p className="text-wrap text-xs font-medium  text-gray-600">
              {fakeData?.personalInfo?.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInEditor;
