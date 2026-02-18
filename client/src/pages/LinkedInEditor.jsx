import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentLinkedInData,
  setCurrentToneForHeadline,
  setGlobalLoader,
  setSectionLoader,
} from "../redux/slice/linkedInSlice";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import BlackLoader from "../components/Loaders/BlackLoader";
import ButtonLoader from "../components/Loaders/ButtonLoader";
import StatusBadge from "../components/StatusShower/StatusBadge";
import { setCredits } from "../redux/slice/authSlice";
import DiffViewer from "react-diff-viewer";
import { Maximize2 } from "lucide-react";

const returnProperData = (data) => {
  const { currentTone, options } = data || {};

  const currentOption = options?.find((option) => option.tone === currentTone);

  if (currentOption && currentOption?.text?.length > 0) {
    return currentOption.text;
  } else {
    return "Your LinkedIn headline is not set. Set it to get a better score.";
  }
};

const returnRequestedData = (data, tone) => {
  const { options } = data || {};
  const currentOption = options?.find((option) => option.tone === tone);

  if (currentOption && currentOption?.text?.length > 0) {
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
  const authSlice = useSelector((state) => state.auth);
  const currentLinkedIn = useSelector(
    (state) => state.linkedin.currentLinkedInData,
  );
  const [updateDataLoader, setUpdateDataLoader] = useState(false);
  const [updateScoreLoader, setUpdateScoreLoader] = useState(false);

  const linkedInSlice = useSelector((state) => state.linkedin);

  const [currentChangesShowModal, setCurrentChangesShowModal] = useState("");

  const [postShowModal, setPostShowModal] = useState({
    show: false,
    post: null,
  });

  const { id } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [postData, setPostData] = useState(currentLinkedIn?.posts || []);

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
    currentLinkedIn?.isLinkedInConnected || false,
  );

  const handleOptimize = async (section, tone) => {
    console.log("Optimize request:", section, tone);

    try {
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
      if (d.data.success) {
        dispatch(setGlobalLoader("running"));

        dispatch(setSectionLoader(d?.data?.sections || []));
        dispatch(setCredits(authSlice.user.totalCredits - d.data.totalCredits));
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to optimize LinkedIn section. Please try again.",
      );
      console.log("Error optimizing LinkedIn section:", error);
    }
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
      if (id?.length > 0 || location?.state?.linkedin?._id.length > 0) {
        try {
          setLoading(true);
          const linkedinData = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/linkedin/v1/linkedin/${id || location?.state?.linkedin?._id}`,
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
  }, [location?.state?.linkedin?._id, dispatch, id]);

  useEffect(() => {
    if (socketSlice.socket) {
      socketSlice.socket.on("job:update:linkedin", (data) => {
        let parsedData = JSON.parse(data);
        const {
          jobId,
          userId,
          sections,
          status,
          isScoreFound,
          score,
          fullLinkedInVersion,
          creditsRefunded,
        } = parsedData;
        if (status) {
          dispatch(setGlobalLoader(status));

          const isAllSectionCompleted =
            sections &&
            sections.length > 0 &&
            sections.every(
              (section) =>
                section.status === "success" ||
                section.status === "failed" ||
                section.status === "completed",
            );
          if (isAllSectionCompleted && fullLinkedInVersion && !score) {
            setUpdateDataLoader(true);
            setTimeout(() => {
              dispatch(setCurrentLinkedInData(JSON.parse(fullLinkedInVersion)));
              toast.success("LinkedIn optimization completed!");
              setUpdateDataLoader(false);
            }, 1200);
          }
          if (
            status == "completed" &&
            isScoreFound &&
            score &&
            fullLinkedInVersion
          ) {
            setUpdateScoreLoader(true);
            setTimeout(() => {
              dispatch(setCurrentLinkedInData(JSON.parse(fullLinkedInVersion)));
              toast.success("LinkedIn optimization completed!");
              setUpdateScoreLoader(false);
            }, 1200);
          }
        }
        if (sections && sections.length > 0) {
          dispatch(setSectionLoader(sections));
        }

        if (creditsRefunded && creditsRefunded > 0) {
          dispatch(setCredits(authSlice.user.totalCredits + creditsRefunded));
        }
        console.log(status, score, sections, fullLinkedInVersion);
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

  const handleLinkedInAuth = () => {
    const scope = "openid profile email w_member_social";

    const redirectUrl =
      "https://www.linkedin.com/oauth/v2/authorization?" +
      `response_type=code` +
      `&client_id=${import.meta.env.VITE_LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(
        import.meta.env.VITE_LINKEDIN_REDIRECT_URI,
      )}` +
      `&scope=${encodeURIComponent(scope)}`;

    const currentLocation = location.pathname;

    localStorage.setItem("redirect", currentLocation);

    window.location.href = redirectUrl;
  };

  useEffect(() => {
    if (currentLinkedIn?.headline) {
      setHeadlineTone(currentLinkedIn.headline.currentTone || "FORMAL");
      setHeadlineCurrentText(returnProperData(currentLinkedIn.headline));
    }

    if (currentLinkedIn?.about) {
      setAboutTone(currentLinkedIn.about.currentTone || "FORMAL");
      setAboutCurrentText(returnProperData(currentLinkedIn.about));
    }

    if (currentLinkedIn?.experience) {
      setExperienceData(currentLinkedIn.experience);
    }

    if (currentLinkedIn?.isLinkedInConnected !== undefined) {
      setConnected(currentLinkedIn.isLinkedInConnected);
    }

    if (currentLinkedIn?.posts) {
      setPostData(currentLinkedIn.posts);
    }
  }, [currentLinkedIn]);

  if (loading || authSlice.isAuth === false) {
    return (
      <div className="min-h-screen flex items-center w-screen  justify-center">
        <BlackLoader />
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-[#F4F2EE] flex justify-center">
        <div className="w-full max-w-3xl my-20 flex flex-col gap-5">
          {/* ================= PROFILE HEADER ================= */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-36">
              {/* Cover Image */}
              <img
                src="https://img.freepik.com/free-vector/half-tone-blue-abstract-background-with-text-space_1017-41428.jpg"
                className="w-full h-full object-cover"
                alt="cover"
              />

              {/* Status Badge */}

              {/* Profile Image */}
              <img
                src={
                  currentLinkedIn?.personalInfo?.profileUrl ||
                  "https://www.gravatar.com/avatar/?d=mp&s=150"
                }
                className="absolute left-6 -bottom-12 w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
                alt="profile"
              />
            </div>

            <div className="pt-16 px-6 pb-4">
              <div className="flex items-center justify-between w-full">
                <h1 className="text-xl font-semibold">
                  {currentLinkedIn?.personalInfo?.fullName?.toUpperCase()}
                </h1>
                <StatusBadge
                  status={linkedInSlice.globalLoader}
                  sections={linkedInSlice.sectionLoaders}
                />
              </div>

              <p
                className={`text-sm mt-1 transition-opacity duration-300 ${
                  linkedInSlice.globalLoader === "running"
                    ? "text-gray-500 opacity-70"
                    : "text-gray-800"
                }`}
              >
                {returnProperData(currentLinkedIn?.headline)}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {currentLinkedIn?.personalInfo?.location}
              </p>
            </div>
          </div>

          {/* ================= HEADLINE OPTIMIZER ================= */}
          <div
            className={`
          bg-white   rounded-xl px-6 min-h-[200px] py-4
          ${linkedInSlice.globalLoader == "running" && linkedInSlice.sectionLoaders && linkedInSlice.sectionLoaders.length > 0 && linkedInSlice.sectionLoaders.find((section) => section.name == "headline" && section.status == "running") ? "linkedInLoader cursor-not-allowed" : ""}
          `}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Headline</h2>
              <div className="flex items-center justify-center gap-3">
                {currentLinkedIn?.changes?.headline?.length > 0 && (
                  <button
                    className="text-blue-600 text-sm font-medium"
                    onClick={() => setCurrentChangesShowModal("headline")}
                  >
                    <p className="px-3 py-1 bg-zinc-100 border rounded-md">
                      Changes
                    </p>
                  </button>
                )}
                <button
                  className="text-blue-600 text-sm font-medium"
                  onClick={() => handleOptimize("headline", "ALL")}
                >
                  {linkedInSlice.globalLoader == "running" &&
                  linkedInSlice.sectionLoaders &&
                  linkedInSlice.sectionLoaders.length > 0 &&
                  linkedInSlice.sectionLoaders.find(
                    (section) =>
                      section.name == "headline" && section.status == "running",
                  ) ? (
                    <span className="ml-2">
                      <BlackLoader />
                    </span>
                  ) : (
                    <p className="px-3 py-1 bg-zinc-100 border rounded-md">
                      Optimize
                    </p>
                  )}
                </button>
              </div>
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
          <div
            className={`
          
          bg-white rounded-xl px-6 py-4

          ${linkedInSlice.globalLoader == "running" && linkedInSlice.sectionLoaders && linkedInSlice.sectionLoaders.length > 0 && linkedInSlice.sectionLoaders.find((section) => section.name == "about" && section.status == "running") ? "linkedInLoader cursor-not-allowed" : ""}
            
          
          `}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">About</h2>

              <div className="flex items-center justify-center gap-3">
                {currentLinkedIn?.changes?.about?.length > 0 && (
                  <button
                    className="text-blue-600 text-sm font-medium"
                    onClick={() => setCurrentChangesShowModal("about")}
                  >
                    <p className="px-3 py-1 bg-zinc-100 border rounded-md">
                      Changes
                    </p>
                  </button>
                )}
                <button
                  className="text-blue-600 text-sm font-medium"
                  onClick={() => handleOptimize("about", "ALL")}
                >
                  {linkedInSlice.globalLoader == "running" &&
                  linkedInSlice.sectionLoaders &&
                  linkedInSlice.sectionLoaders.length > 0 &&
                  linkedInSlice.sectionLoaders.find(
                    (section) =>
                      section.name == "about" && section.status == "running",
                  ) ? (
                    <span className="ml-2">
                      <BlackLoader />
                    </span>
                  ) : (
                    <p className="px-3 py-1 bg-zinc-100 border rounded-md">
                      Optimize
                    </p>
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              {currentLinkedIn?.about?.options &&
                currentLinkedIn?.about?.options.length > 0 &&
                [...currentLinkedIn?.about?.options]
                  .sort((a, b) => {
                    if (a.tone === currentLinkedIn?.about.currentTone)
                      return -1;
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
          <div
            className={`
          
          bg-white rounded-xl px-6 py-6 shadow-sm
                    ${linkedInSlice.globalLoader == "running" && linkedInSlice.sectionLoaders && linkedInSlice.sectionLoaders.length > 0 && linkedInSlice.sectionLoaders.find((section) => section.name == "experience" && section.status == "running") ? "linkedInLoader cursor-not-allowed" : ""}
            
          
          `}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-gray-900">
                Experience
              </h2>

              <div className="flex items-center justify-center gap-3">
                {currentLinkedIn?.changes?.experience?.length > 0 && (
                  <button
                    className="text-blue-600 text-sm font-medium"
                    onClick={() => setCurrentChangesShowModal("experience")}
                  >
                    <p className="px-3 py-1 bg-zinc-100 border rounded-md">
                      Changes
                    </p>
                  </button>
                )}
                <button
                  className="text-blue-600 text-sm font-medium hover:underline"
                  onClick={() => handleOptimize("experience", "ALL")}
                >
                  {linkedInSlice.globalLoader == "running" &&
                  linkedInSlice.sectionLoaders &&
                  linkedInSlice.sectionLoaders.length > 0 &&
                  linkedInSlice.sectionLoaders.find(
                    (section) =>
                      section.name == "experience" &&
                      section.status == "running",
                  ) ? (
                    <span className="ml-2">
                      <BlackLoader />
                    </span>
                  ) : (
                    <p className="px-3 py-1 bg-zinc-100 border rounded-md">
                      Optimize
                    </p>
                  )}
                </button>
              </div>
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
                          <p className="text-sm text-gray-600">
                            {exp?.company}
                          </p>
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
              {/* <button className="text-blue-600 text-sm font-medium">
              ✨ Optimize
            </button> */}
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
                {
                  label: "Clarity",
                  value: currentLinkedIn?.score?.clarity || 0,
                },
                { label: "Impact", value: currentLinkedIn?.score?.impact || 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center ">
                  <span className="text-xs w-24 text-gray-600">
                    {item.label}
                  </span>
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
            {postData && postData.length > 0 ? (
              postData.map((post) => {
                const isPosted = post.posting.status === "posted";

                return (
                  <div
                    key={post.postId}
                    className="w-full bg-white relative rounded-lg shadow p-4 border"
                  >
                    <div className="flex items-center mb-3 w-full justify-between">
                      <h1 className="text-[13px] w-[70%]  font-medium">
                        {post?.aiMeta?.topic.split("|")[0]}{" "}
                      </h1>
                      <button
                        onClick={() => setPostShowModal({ show: true, post })}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Maximize2 className="w-4 h-4 " />
                      </button>
                    </div>
                    {/* Text */}
                    <p className="text-sm text-gray-800">
                      {post.content.text.slice(0, 200)}...........
                    </p>

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
              })
            ) : (
              <p className="text-sm text-gray-500 mt-2 px-2">
                No post suggestions available.
              </p>
            )}
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
                  onClick={handleLinkedInAuth}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Connect LinkedIn
                </button>
              )}
            </div>
          </div>
        </div>

        {updateDataLoader && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="flex items-center gap-4 px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
              {/* Spinner */}
              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              {/* Text */}
              <p className="text-white text-sm font-medium tracking-wide">
                Updating enhanced data...
              </p>
            </div>
          </div>
        )}

        {updateScoreLoader && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="flex items-center gap-4 px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
              {/* Spinner */}
              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              {/* Text */}
              <p className="text-white text-sm font-medium tracking-wide">
                Updating Score
              </p>
            </div>
          </div>
        )}

        {currentChangesShowModal && (
          <div className="fixed right-6 bottom-10 z-[99999999] w-[460px] max-h-[480px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50 rounded-t-xl">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Changes Applied
                </h3>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  Section: {currentChangesShowModal}
                </p>
              </div>

              <button
                onClick={() => setCurrentChangesShowModal("")}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-5 py-4 space-y-6 text-sm">
              {currentLinkedIn?.changes?.[currentChangesShowModal]?.length >
              0 ? (
                currentLinkedIn.changes[currentChangesShowModal].map(
                  (change, index) => (
                    <div key={index} className="space-y-3">
                      {/* Diff Block */}
                      <div className="border rounded-lg overflow-hidden">
                        <DiffViewer
                          oldValue={change.before || ""}
                          newValue={change.after || ""}
                          splitView={false}
                          showDiffOnly
                          hideLineNumbers
                        />
                      </div>

                      {/* Reason Block */}
                      {change.reason && (
                        <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                          <p className="text-xs text-gray-500 mb-1">
                            Why this change?
                          </p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {change.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  ),
                )
              ) : (
                <p className="text-gray-500 text-sm">No changes found.</p>
              )}
            </div>
          </div>
        )}

        {postShowModal.show && postShowModal.post && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-xl shadow-xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {postShowModal.post?.aiMeta?.topic?.split("|")[0] ||
                      "LinkedIn Post"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Tone: {postShowModal.post?.aiMeta?.tone || "CONFIDENT"}
                  </p>
                </div>

                <button
                  onClick={() => setPostShowModal({ show: false, post: null })}
                  className="text-gray-400 hover:text-black transition text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto px-6 py-5 text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                {postShowModal.post?.content?.text}
              </div>

              {/* Hashtags */}
              {postShowModal.post?.content?.hashtags?.length > 0 && (
                <div className="px-6 pb-4 flex flex-wrap gap-2">
                  {postShowModal.post.content.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 border-t flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {postShowModal.post?.posting?.status || "DRAFT"}
                </span>

                {postShowModal.post?.posting?.status !== "POSTED" && (
                  <button
                    className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
                    onClick={() =>
                      console.log("Publish:", postShowModal.post.postId)
                    }
                  >
                    Publish to LinkedIn
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default LinkedInEditor;
