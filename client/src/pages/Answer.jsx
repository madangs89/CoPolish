import { Check, Heart, BookOpen, List, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import BlackLoader from "../components/Loaders/BlackLoader";

const Answer = () => {
  const [question, setQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState("js");
  const navigate = useNavigate();

  const [hoveredSection, setHoveredSection] = useState(null);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [likedCount, setLikedCount] = useState(question?.likes || 0);

  // State to check if question is solved by user or not
  const [isQuestionSolved, setIsQuestionSolved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Mobile modal states
  const [showTableModal, setShowTableModal] = useState(false);
  const [showRelatedModal, setShowRelatedModal] = useState(false);

  // Loaders
  const [mainLoading, setMainLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [headerLoading, setHeaderLoading] = useState(false);
  const [markAsSolvedLoading, setMarkAsSolvedLoading] = useState(false);

  const shortAnswerRef = useRef(null);
  const definitionRef = useRef(null);
  const explanationRef = useRef(null);
  const codeRef = useRef(null);
  const realWorldExampleRef = useRef(null);
  const mainRef = useRef(null);

  const params = useParams();

  const allRefData = {
    "Short Answer": shortAnswerRef,
    Definition: definitionRef,
    Explanation: explanationRef,
    Code: codeRef,
    "Real World Example": realWorldExampleRef,
  };

  const languages = Object.keys(question?.codeSnippet || {}).filter(
    (lang) => question.codeSnippet[lang],
  );

  const markAsSolvedHandler = async () => {
    if (!question?._id || isQuestionSolved || markAsSolvedLoading) return;

    try {
      setMarkAsSolvedLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/mark-completed`,
        {
          questionId: question._id,
          difficulty: question.difficulty,
          subject: question.subject,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setIsQuestionSolved(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to mark question as solved");
    } finally {
      setMarkAsSolvedLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isLiked) {
      try {
        setIsLiked(true);
        setLikedCount((prev) => prev + 1);

        const markLikeRes = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/mark-liked`,
          {
            questionId: question._id,
            isLiked: false,
          },
          {
            withCredentials: true,
          },
        );
      } catch (error) {
        setIsLiked(false);
        setLikedCount((prev) => prev - 1);
        toast.error("Failed to like the question");
      }
    } else {
      try {
        setIsLiked(false);
        setLikedCount((prev) => {
          prev = prev - 1;
          if (prev < 0) prev = 0;
          return prev;
        });

        const markUnLikeRes = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/mark-liked`,
          {
            questionId: question._id,
            isLiked: true,
          },
          {
            withCredentials: true,
          },
        );
      } catch (error) {
        setIsLiked(true);
        setLikedCount((prev) => prev + 1);
        toast.error("Failed to unLike the question");
      }
    }
  };

  useEffect(() => {
    const { subject, slug, id } = params;
    (async () => {
      try {
        setMainLoading(true);
        const QuestionRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/question/v1/get/question/${id}`,
          {
            withCredentials: true,
          },
        );
        if (QuestionRes.data.success) {
          setQuestion(QuestionRes.data.question);
          setLikedCount(QuestionRes.data.question.likes);
        }
      } catch (error) {
        toast.error("Failed to fetch questions");
      } finally {
        setMainLoading(false);
      }
    })();
  }, [params]);

  useEffect(() => {
    if (question?._id) {
      (async () => {
        try {
          setRelatedLoading(true);

          const relatedQuestions = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/question/v1/get/related/questions?keywords=${question?.keywords}&_id=${question?._id}&subject=${question?.subject}`,
            {
              withCredentials: true,
            },
          );

          if (relatedQuestions.data.success) {
            setRelatedQuestions(relatedQuestions.data.relatedQuestions);
          }
        } catch (error) {
          toast.error("Failed to fetch Related questions");
        } finally {
          setRelatedLoading(false);
        }
      })();
    }
  }, [question]);

  // fetch user progress for the question
  useEffect(() => {
    if (question?._id) {
      (async () => {
        try {
          setHeaderLoading(true);
          const userProgress = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/question/progress/${question?._id}`,
            {
              withCredentials: true,
            },
          );
          console.log({ userProgress });

          if (userProgress.data.success) {
            setIsQuestionSolved(
              userProgress?.data?.progress?.completed || false,
            );
            setIsLiked(userProgress?.data?.progress?.liked || false);
          }
        } catch (error) {
          console.log(error);
          toast.error("Unable to fetch Progress");
        } finally {
          setHeaderLoading(false);
        }
      })();
    }
  }, [question]);

  // Lock body scroll when a modal is open on mobile
  useEffect(() => {
    if (showTableModal || showRelatedModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTableModal, showRelatedModal]);

  if (mainLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <BlackLoader />
      </div>
    );
  }

  return (
    <div className="mt-16 flex bg-white min-h-screen">
      {/* Left Sidebar - desktop only */}
      <div className="hidden md:block w-72 scrollbar-minimal bg-white border-r px-6 py-2 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="">
          <h2 className="text-lg font-semibold mb-3">Table</h2>

          {[
            "Short Answer",
            "Definition",
            "Explanation",
            "Code",
            "Real World Example",
          ].map((subject) => (
            <label
              onClick={() =>
                allRefData[subject].current.scrollIntoView({
                  behavior: "smooth",
                })
              }
              key={subject}
              className="flex items-center gap-3 mb-2 cursor-pointer group"
            >
              <span className="text-sm text-gray-600 group-hover:text-black">
                {subject}
              </span>
            </label>
          ))}
        </div>

        {/* tip */}
        <div className="flex w-full flex-col my-4">
          <h2 className="text-lg font-semibold mb-2">💡Interview Tip</h2>
          <p className="text-gray-700 text-sm whitespace-pre-line">
            {question?.detailedAnswer?.interviewTip}
          </p>
        </div>
        {/* mistake */}
        <div className="flex w-full flex-col my-4">
          <h2 className="text-lg font-semibold mb-2">Common Mistake</h2>
          <p className="text-gray-700 text-sm whitespace-pre-line">
            {question?.detailedAnswer?.commonMistake}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 md:max-w-4xl h-screen overflow-scroll [&::-webkit-scrollbar]:hidden max-w-full mx-auto px-4 md:px-8 py-3 pb-24 md:pb-3"
      >
        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
          {question.topicOrder}. {question.question}
        </h1>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 mb-6 border-b gap-5 pb-4">
          {headerLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <BlackLoader />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="">
                  Difficulty: <b>{question.difficulty}</b>
                </span>
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-3 py-1 rounded-md transition group"
                >
                  <Heart
                    size={20}
                    className={`transition 
      ${
        isLiked ? "fill-red-600 stroke-red-600 " : "fill-none stroke-red-600 "
      }`}
                  />
                  <span className="font-medium">{likedCount}</span>
                </button>
                <span>Asked in: {question.interviewCount} interviews</span>
              </div>
              <button
                onClick={markAsSolvedHandler}
                className={`mt-3 px-4 py-2 rounded-md text-white transition 
    ${
      isQuestionSolved
        ? "bg-blue-500"
        : "bg-green-700 hover:bg-green-800 cursor-pointer"
    }`}
                disabled={isQuestionSolved}
              >
                {markAsSolvedLoading ? (
                  <BlackLoader />
                ) : isQuestionSolved ? (
                  "Solved"
                ) : (
                  "Mark as Solved"
                )}
              </button>
            </>
          )}
        </div>

        {/* Short Answer */}
        <div
          ref={shortAnswerRef}
          className="mb-10 bg-white border border-gray-200 rounded-xl p-6 shadow-sm scroll-mt-28"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Interview Short Answer
          </h2>

          <p className="text-gray-700 leading-7 whitespace-pre-line">
            {question.shortAnswer.answer}
          </p>

          {question.shortAnswer.example && (
            <p className="mt-4 text-gray-500 italic border-l-4 border-blue-500 pl-4">
              Example: {question.shortAnswer.example}
            </p>
          )}
        </div>

        {/* Definition */}
        <div
          ref={definitionRef}
          className="mb-10 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Definition
          </h2>

          <p className="text-gray-700 leading-7 whitespace-pre-line">
            {question.detailedAnswer.definition}
          </p>
        </div>

        {/* Explanation */}
        <div
          ref={explanationRef}
          className="mb-10 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Explanation
          </h2>

          <p className="text-gray-700 leading-7 whitespace-pre-line">
            {question.detailedAnswer.explanation}
          </p>
        </div>

        {/* Code Section */}
        <div
          ref={codeRef}
          className="mb-10 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          {languages.length > 0 && (
            <div>
              {/* Tabs */}
              <div className="flex border-b mb-6 overflow-x-auto">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                      activeTab === lang
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-100">
                <pre className="whitespace-pre-wrap">
                  <code>{question.codeSnippet[activeTab]}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Real World Example */}
        {question.detailedAnswer.realWorldExample && (
          <div
            ref={realWorldExampleRef}
            className="mb-10 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Real World Example
            </h2>

            <p className="text-gray-700 leading-7">
              {question.detailedAnswer.realWorldExample}
            </p>
          </div>
        )}
      </main>

      {/* Right Sidebar - desktop only */}
      <div className="hidden md:block w-72 scrollbar-minimal bg-white border-l px-6 py-2 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        {/* Related Questions */}
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Related Questions</h2>
          <div className="w-full flex flex-col">
            {relatedLoading ? (
              <div className="w-full flex items-center justify-center py-10">
                <BlackLoader />
              </div>
            ) : relatedQuestions.length > 0 ? (
              relatedQuestions.map((q) => (
                <div
                  key={q._id}
                  onMouseEnter={() => setHoveredSection(q.slug)}
                  onMouseLeave={() => setHoveredSection(null)}
                  onClick={() =>
                    navigate(`/answer/${q.subject}/${q.slug}/${q._id}`)
                  }
                  className="flex group relative rounded-md border-gray-400 
                   justify-between cursor-pointer border-b w-full 
                   py-2 text-lg items-center"
                >
                  <div className="flex gap-2 items-center">
                    <h3 className="text-sm">
                      {q.topicOrder + ". " + q.question}
                    </h3>
                  </div>

                  <div
                    className="flex absolute right-0 h-full w-full items-center 
                     justify-between bg-white px-4 py-2 
                     rounded-md opacity-0 group-hover:opacity-100 
                     transition pointer-events-none"
                  >
                    <span className="text-sm text-gray-500">
                      {q.difficulty}
                    </span>

                    <div className="w-6 h-4 flex items-center justify-center">
                      {q.solved ? (
                        <div className="flex items-center gap-2">
                          <Check className="text-green-800 w-5 h-5" />
                          <p className="text-sm">Solved</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Unsolved</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-10">
                No related questions found.
              </p>
            )}
          </div>
        </div>
        {/* Key words */}
        <div className="flex w-full flex-col my-2">
          <h2 className="text-lg font-semibold mb-2">Question KeyWord</h2>
          <div className="w-full flex flex-wrap gap-2">
            {question.keywords.length > 0 ? (
              question.keywords.map((q, index) => {
                return (
                  <div
                    key={index}
                    className="py-2 px-2 bg-gray-300 rounded-md text-sm text-black"
                  >
                    {q}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm text-center py-10">
                No keywords found for this question.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom FAB Buttons - visible only on mobile */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 md:hidden z-40">
        <button
          onClick={() => setShowTableModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-3 rounded-full shadow-lg text-sm font-medium"
        >
          <List size={16} />
          Contents
        </button>
        <button
          onClick={() => setShowRelatedModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-3 rounded-full shadow-lg text-sm font-medium"
        >
          <BookOpen size={16} />
          Related
        </button>
      </div>

      {/* 1 */}
      <div
        className={`fixed inset-0 z-[999999] md:hidden transition-opacity duration-300
  ${showRelatedModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setShowRelatedModal(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[80vw] max-w-xs bg-white px-6 pt-6 pb-8 overflow-y-auto
    transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
    ${showRelatedModal ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Related Questions</h2>
            <button onClick={() => setShowRelatedModal(false)}>
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Related Questions List */}
          <div className="w-full flex flex-col">
            {relatedLoading ? (
              <div className="w-full flex items-center justify-center py-10">
                <BlackLoader />
              </div>
            ) : relatedQuestions.length > 0 ? (
              relatedQuestions.map((q) => (
                <div
                  key={q._id}
                  onClick={() => {
                    navigate(`/answer/${q.subject}/${q.slug}/${q._id}`);
                    setShowRelatedModal(false);
                  }}
                  className="flex justify-between items-center cursor-pointer border-b border-gray-200 py-3 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-sm text-gray-800 flex-1 pr-2">
                    {q.topicOrder + ". " + q.question}
                  </h3>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-gray-400">
                      {q.difficulty}
                    </span>

                    {q.solved && (
                      <Check className="text-green-800 w-4 h-4 ml-1" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-10">
                No related questions found.
              </p>
            )}
          </div>

          {/* Keywords */}
          <div className="flex w-full flex-col mt-6">
            <h2 className="text-lg font-semibold mb-2">Question Keyword</h2>

            <div className="w-full flex flex-wrap gap-2">
              {question?.keywords?.length > 0 ? (
                question.keywords.map((q, index) => (
                  <div
                    key={index}
                    className="py-2 px-2 bg-gray-300 rounded-md text-sm text-black"
                  >
                    {q}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-10">
                  No keywords found for this question.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2 */}
      <div
        className={`fixed inset-0 z-[999999] md:hidden transition-opacity duration-300
  ${showTableModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setShowTableModal(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-[80vw] max-w-xs bg-white px-6 pt-6 pb-8 overflow-y-auto
    transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
    ${showTableModal ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Table of Contents</h2>
            <button onClick={() => setShowTableModal(false)}>
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Section Links */}
          <div className="flex flex-col">
            {[
              "Short Answer",
              "Definition",
              "Explanation",
              "Code",
              "Real World Example",
            ].map((subject) => (
              <label
                key={subject}
                onClick={() => {
                  allRefData[subject]?.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  setShowTableModal(false);
                }}
                className="flex items-center gap-3 mb-3 cursor-pointer group hover:bg-gray-50 px-2 py-2 rounded transition"
              >
                <span className="text-sm text-gray-600 group-hover:text-black">
                  {subject}
                </span>
              </label>
            ))}
          </div>

          {/* Interview Tip */}
          <div className="flex w-full flex-col mt-6 mb-4">
            <h2 className="text-lg font-semibold mb-2">💡 Interview Tip</h2>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
              {question?.detailedAnswer?.interviewTip ||
                "No interview tips available."}
            </p>
          </div>

          {/* Common Mistake */}
          <div className="flex w-full flex-col mb-4">
            <h2 className="text-lg font-semibold mb-2">Common Mistake</h2>
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
              {question?.detailedAnswer?.commonMistake ||
                "No common mistakes listed."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
