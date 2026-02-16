import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentLinkedInData,
  setCurrentToneForHeadline,
} from "../redux/slice/linkedInSlice";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import BlackLoader from "../components/Loaders/BlackLoader";

const returnProperData = (data) => {
  const { currentTone, options } = data || {};

  const currentOption = options?.find((option) => option.tone === currentTone);

  if (currentOption?.text.length > 0) {
    return currentOption.text;
  } else {
    return "Your LinkedIn headline is not set. Set it to get a better score.";
  }
};

const returnRequestedData = (data, tone) => {
  const { options } = data || {};

  const currentOption = options?.find((option) => option.tone === tone);

  if (currentOption?.text.length > 0) {
    return currentOption.text;
  } else {
    return "No data available. Optimize this section to get suggestions.";
  }
};

const returnProperExperienceBullets = (data, tone) => {
  const bullets = data.find((option) => option.tone === tone);

  if (bullets?.bullets && bullets?.bullets.length > 0) {
    return bullets.bullets;
  } else {
    return ["No data available. Optimize this section to get suggestions."];
  }
};

const returnLevelOnScore = (score) => {
  if (score >= 90) {
    return "Excellent";
  } else if (score >= 75) {
    return "Good";
  } else if (score >= 60) {
    return "Average";
  } else {
    return "Poor";
  }
};
const LinkedInEditor = () => {
  const resumeSlice = useSelector((state) => state.resume.currentResume);
  const socketSlice = useSelector((state) => state.socket);
  const currentLinkedIn = useSelector(
    (state) => state.linkedin.currentLinkedInData,
  );

  const { id } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const fakePostData = [
    {
      postId: "post_1001",
      userId: "user_55421",
      platform: "linkedin",
      content: {
        text: "Today is a special milestone for our team — we’ve officially crossed 10,000 users. What started as a small idea has grown into a community we’re incredibly proud of. Huge thanks to every early supporter who believed in us. This is just the beginning.",
        hashtags: ["#StartupJourney", "#Milestone", "#Grateful", "#Growth"],
        mentions: ["@TeamAlpha"],
        link: "https://example.com/milestone",
      },
      media: [
        {
          type: "image",
          url: "https://example.com/media/team-celebration.jpg",
          thumbnail: "https://example.com/media/thumb-team.jpg",
        },
      ],
      posting: {
        status: "posted",
        scheduledAt: "2026-01-20T09:00:00Z",
        postedAt: "2026-01-20T09:01:12Z",
        linkedinPostUrn: "urn:li:activity:1001",
      },
      privacy: {
        visibility: "public",
      },
      aiMeta: {
        generatedByAI: true,
        tone: "celebratory",
        topic: "company milestone",
      },
      createdAt: "2026-01-19T15:10:00Z",
      updatedAt: "2026-01-20T09:05:00Z",
    },

    {
      postId: "post_1002",
      userId: "user_77892",
      platform: "linkedin",
      content: {
        text: "We’re expanding our team and looking for passionate frontend developers who love crafting beautiful user experiences. If you enjoy solving real-world problems and building products that impact people, we’d love to hear from you.",
        hashtags: ["#Hiring", "#FrontendDeveloper", "#Careers", "#TechJobs"],
        mentions: ["@TechCareers"],
        link: "https://example.com/jobs/frontend",
      },
      media: [],
      posting: {
        status: "scheduled",
        scheduledAt: "2026-02-02T11:00:00Z",
        postedAt: null,
        linkedinPostUrn: null,
      },
      privacy: {
        visibility: "public",
      },
      analytics: {
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
      },
      aiMeta: {
        generatedByAI: true,
        tone: "professional",
        topic: "job hiring",
      },
      createdAt: "2026-01-29T10:20:00Z",
      updatedAt: "2026-01-29T10:20:00Z",
    },

    {
      postId: "post_1003",
      userId: "user_33211",
      platform: "linkedin",
      content: {
        text: "Our latest blog explores how AI is reshaping small businesses in 2026 — from automation to smarter decision-making. If you're curious about where technology is heading and how it affects growth, this is worth a read.",
        hashtags: ["#ArtificialIntelligence", "#BusinessGrowth", "#TechTrends"],
        mentions: ["@BusinessInsights"],
        link: "https://example.com/blog/ai-business",
      },
      media: [
        {
          type: "image",
          url: "https://example.com/media/blog-cover.jpg",
          thumbnail: "https://example.com/media/thumb-blog.jpg",
        },
      ],
      posting: {
        status: "draft",
        scheduledAt: null,
        postedAt: null,
        linkedinPostUrn: null,
      },
      privacy: {
        visibility: "connections",
      },
      analytics: {
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
      },
      aiMeta: {
        generatedByAI: false,
        tone: "informational",
        topic: "AI trends",
      },
      createdAt: "2026-01-28T18:00:00Z",
      updatedAt: "2026-01-28T18:00:00Z",
    },
  ];

  const [headlineTone, setHeadlineTone] = useState(
    currentLinkedIn?.headline?.currentTone || "FORMAL",
  );
  const [headlineCurrentText, setHeadlineCurrentText] = useState(
    returnProperData(currentLinkedIn?.headline),
  );

  const [aboutTone, setAboutTone] = useState(
    currentLinkedIn?.about?.currentTone || "FORMAL",
  );
  const [aboutCurrentText, setAboutCurrentText] = useState(
    returnProperData(currentLinkedIn?.about),
  );

  const [experienceData, setExperienceData] = useState(
    currentLinkedIn?.experience || [],
  );

  const [connected, setConnected] = useState(
    currentLinkedIn?.linkedInConnected || false,
  );

  const handleOptimize = async (section, tone) => {
    console.log("Optimize request:", section, tone);

    const d = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/linkedin/v1/optimize-linkedin`,
      {
        section,
        tone,
        resumeId: resumeSlice._id,
        linkedInId: currentLinkedIn?._id,
      },
      {
        withCredentials: true,
      },
    );

    console.log("Optimization response:", d.data);
  };

  const handleUpdateHeadlineStates = (tone) => {
    setHeadlineTone(tone);
    setHeadlineCurrentText(
      returnRequestedData(currentLinkedIn?.headline, tone),
    );
  };

  const handleUpdateAboutStates = (tone) => {
    setAboutTone(tone);
    setAboutCurrentText(returnRequestedData(currentLinkedIn?.about, tone));
  };

  const updateExperienceCurrentTone = (tone, index) => {
    setExperienceData((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        bullets: {
          ...updated[index].bullets,
          currentTone: tone,
        },
      };

      return updated;
    });
  };

  useEffect(() => {
    console.log(id);

    (async () => {
      if (id.length > 0 || location.state?.linkedin?._id.length > 0) {
        try {
          setLoading(true);
          const linkedinData = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/linkedin/v1/linkedin/${id || location.state?.linkedin?._id}`,
            {
              withCredentials: true,
            },
          );

          console.log(linkedinData.data);

          if (linkedinData.data.success) {
            dispatch(setCurrentLinkedInData(linkedinData.data.data));
          }
        } catch (error) {
          toast.error("Failed to fetch LinkedIn data. Please try again.");
          console.log("Error fetching LinkedIn data:", error);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [location.state?.linkedin?._id, dispatch, id]);

  useEffect(() => {
    if (socketSlice.socket) {
      socketSlice.socket.on("job:update:linkedin", (data) => {
        console.log("job:update:linkedIn", data);
      });
    }

    return () => {
      if (socketSlice.socket) {
        socketSlice.socket.off("job:update:linkedin");
      }
    };
  }, [socketSlice.socket]);

  useEffect(() => {
    if (currentLinkedIn?.experience) {
      setExperienceData(currentLinkedIn.experience);
    }
  }, [currentLinkedIn?.experience]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center w-screen  justify-center">
        <BlackLoader />
      </div>
    );
  }

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
              src={
                currentLinkedIn?.personalInfo?.profileUrl ||
                "https://www.gravatar.com/avatar/?d=mp&s=150"
              }
              className="absolute left-6 -bottom-12 w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>

          <div className="pt-16 px-6 pb-4">
            <h1 className="text-xl font-semibold">
              {currentLinkedIn?.personalInfo?.fullName?.toUpperCase()}
            </h1>

            <p className="text-sm text-gray-800 mt-1">
              {returnProperData(currentLinkedIn?.headline)}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {currentLinkedIn?.personalInfo?.location}
            </p>
          </div>
        </div>

        {/* ================= HEADLINE OPTIMIZER ================= */}
        <div className="bg-white rounded-xl px-6 min-h-[200px] py-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Headline</h2>
            <button
              className="text-blue-600 text-sm font-medium"
              onClick={() => handleOptimize("headline", "ALL")}
            >
              ✨ Optimize
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            {currentLinkedIn?.headline.options &&
              currentLinkedIn?.headline.options.length > 0 &&
              [...currentLinkedIn?.headline.options]
                .sort((a, b) => {
                  if (a.tone === currentLinkedIn?.headline.currentTone)
                    return -1;
                  if (b.tone === currentLinkedIn?.headline.currentTone)
                    return 1;
                  return 0;
                })
                .map((opt) => (
                  <button
                    key={opt._id}
                    onClick={() => handleUpdateHeadlineStates(opt.tone)}
                    className={`px-3 py-1 text-xs rounded-md border
                  ${
                    headlineTone === opt.tone
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  >
                    {opt.tone}
                  </button>
                ))}
          </div>

          <p className="text-sm mt-3 text-gray-900">{headlineCurrentText}</p>
        </div>

        {/* ================= ABOUT OPTIMIZER ================= */}
        <div className="bg-white rounded-xl px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">About</h2>
            <button
              className="text-blue-600 text-sm font-medium"
              onClick={() => handleOptimize("about", "ALL")}
            >
              ✨ Optimize
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            {currentLinkedIn?.about?.options &&
              currentLinkedIn?.about?.options.length > 0 &&
              [...currentLinkedIn?.about?.options]
                .sort((a, b) => {
                  if (a.tone === currentLinkedIn?.about.currentTone) return -1;
                  if (b.tone === currentLinkedIn?.about.currentTone) return 1;
                  return 0;
                })
                .map((opt) => (
                  <button
                    key={opt._id}
                    onClick={() => handleUpdateAboutStates(opt.tone)}
                    className={`px-3 py-1 text-xs rounded-md border
                  ${
                    opt.tone === aboutTone
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  >
                    {opt.tone}
                  </button>
                ))}
          </div>

          <p className="text-sm mt-3 whitespace-pre-line text-gray-900">
            {aboutCurrentText}
          </p>
        </div>

        {/* ================= EXPERIENCE ================= */}
        {/* ================= EXPERIENCE ================= */}
        <div className="bg-white rounded-xl px-6 py-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg text-gray-900">Experience</h2>

            <button
              className="text-blue-600 text-sm font-medium hover:underline"
              onClick={() => handleOptimize("experience", "ALL")}
            >
              ✨ Optimize All
            </button>
          </div>

          {experienceData && experienceData.length > 0 ? (
            <div className="flex flex-col gap-6">
              {experienceData.map((exp, index) => {
                const currentTone = exp?.bullets?.currentTone;
                const suggestions = exp?.bullets?.suggestions || [];

                const matchedSuggestion = suggestions.find(
                  (s) => s.tone === currentTone,
                );

                const bulletsToRender =
                  matchedSuggestion?.bullets?.length > 0
                    ? matchedSuggestion.bullets
                    : exp?.bullets?.current?.length > 0
                      ? exp.bullets.current
                      : [
                          "No data available. Optimize this section to get suggestions.",
                        ];

                return (
                  <div
                    key={index}
                    className="border rounded-lg p-5 bg-gray-50 hover:shadow-md transition"
                  >
                    {/* HEADER */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">
                          {exp?.role}
                        </h3>
                        <p className="text-sm text-gray-600">{exp?.company}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {exp?.from} — {exp?.to || "Present"}
                        </p>
                      </div>

                      {/* Suggestion Type Badge */}
                      {matchedSuggestion?.improvementType && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {matchedSuggestion.improvementType}
                        </span>
                      )}
                    </div>

                    {/* Tone Switch */}
                    <div className="flex gap-2 mt-4">
                      {["FORMAL", "CONFIDENT", "BOLD"].map((tone) => (
                        <button
                          key={tone}
                          onClick={() =>
                            updateExperienceCurrentTone(tone, index)
                          }
                          className={`px-3 py-1 text-xs rounded-full border transition ${
                            tone === currentTone
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>

                    {/* BULLETS */}
                    <ul className="list-disc ml-5 mt-4 space-y-2">
                      {bulletsToRender.map((bullet, bId) => (
                        <li
                          key={bId}
                          className="text-sm text-gray-800 leading-relaxed"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No experience added yet.</p>
          )}
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
            {currentLinkedIn?.skills && currentLinkedIn?.skills.length > 0 ? (
              currentLinkedIn?.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm mt-3 text-gray-900">
                No skills added yet. Optimize this section to get suggestions.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Score Section */}
      <div className="fixed top-20 min-h-screen gap-3 flex flex-col  w-[250px] left-5 z-50">
        <div className="bg-transparent rounded-xl  p-4 w-full flex bg-white flex-col gap-4">
          {/* Main Score */}
          <div className="flex  items-center  gap-4">
            <div className="relative  score  overflow-hidden  w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-gray-200"></div>
              <div className="absolute inset-0 rounded-full bg-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {currentLinkedIn?.score?.currentScore}
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-xs text-gray-500">Overall</p>
              <p className="text-sm font-medium text-gray-900">
                {returnLevelOnScore(currentLinkedIn?.score?.currentScore)}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex flex-col gap-2">
            {[
              {
                label: "Searchability",
                value: currentLinkedIn?.score?.searchability || 0,
              },
              { label: "Clarity", value: currentLinkedIn?.score?.clarity || 0 },
              { label: "Impact", value: currentLinkedIn?.score?.impact || 0 },
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

        <div className="h-[300px] overflow-y-scroll scrollbar-minimal  flex flex-col w-full gap-2">
          <h1 className="text-lg p-2  font-medium sticky top-0 bg-white">
            Post Suggestions
          </h1>
          {fakePostData.map((post) => {
            const isPosted = post.posting.status === "posted";

            return (
              <div
                key={post.postId}
                className="w-full bg-white rounded-lg shadow p-4 border"
              >
                {/* Text */}
                <p className="text-sm text-gray-800">{post.content.text}</p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.content.hashtags.map((tag, i) => (
                    <span key={i} className="text-blue-600 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link */}
                {post.content.link && (
                  <a
                    href={post.content.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-green-600 mt-2 block"
                  >
                    {post.content.link}
                  </a>
                )}

                {/* Status / Action */}
                <div className="mt-3 flex items-center justify-between">
                  {isPosted ? (
                    <span className="text-xs text-green-600 font-medium">
                      ✅ Posted
                    </span>
                  ) : (
                    <button
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => console.log("Post now:", post.postId)}
                    >
                      Post Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed w-[250px] right-10 top-20 z-50 h-[300px] ">
        <div className="fixed w-[250px] right-10 top-20 z-50 h-fit">
          <div className="w-full bg-white border rounded-xl p-5 flex flex-col gap-3 h-full justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {connected ? "LinkedIn Connected" : "LinkedIn not connected"}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {connected
                  ? "You can now post directly to LinkedIn from this platform."
                  : "Connect your LinkedIn account to start posting directly from this platform."}
              </p>
            </div>

            {connected ? (
              <div className="flex items-center gap-2 mt-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <p className="text-sm text-gray-700 font-medium">
                  Account connected
                </p>
              </div>
            ) : (
              <button
                // onClick={handleConnect}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Connect LinkedIn
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInEditor;
