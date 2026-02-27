import { Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import BlackLoader from "../components/Loaders/BlackLoader";

export const fakeQuestions = [
  {
    title: "What is Abstraction in OOPS?",
    slug: "what-is-abstraction-in-oops",
    subject: "OOPS",
    topic: "OOPS Basics",
    topicOrder: 1,
    difficulty: "Basic",
    question: "Explain abstraction in object-oriented programming.",
    shortAnswer: {
      answer:
        "Abstraction is hiding internal implementation and showing only essential features.",
      example: "ATM machine hides internal banking logic.",
    },
    detailedAnswer: {
      definition:
        "Abstraction is a principle of OOP that focuses on exposing only necessary features of an object.",
      explanation:
        "It reduces complexity by hiding unnecessary implementation details from the user.",
      image: "",
      video: "",
      interviewTip:
        "Always explain abstraction with real-life examples like ATM or car.",
      commonMistake: "Students confuse abstraction with encapsulation.",
      realWorldExample: "Using a mobile app without knowing backend logic.",
    },
    codeSnippet: {
      js: "class Car { start() { console.log('Car started'); } }",
      java: "abstract class Car { abstract void start(); }",
      cpp: "class Car { virtual void start() = 0; };",
      python: "from abc import ABC, abstractmethod",
      c: "",
    },
    keywords: ["abstraction", "oops", "principle"],
    isPremium: false,
    views: 1200,
    likes: 150,
    interviewCount: 23,
    company: ["Amazon", "TCS"],
    solved: true,
  },

  {
    title: "What is Encapsulation?",
    slug: "what-is-encapsulation",
    subject: "OOPS",
    topic: "OOPS Basics",
    topicOrder: 2,
    difficulty: "Easy",
    question: "Define encapsulation and explain its importance.",
    shortAnswer: {
      answer: "Encapsulation is wrapping data and methods into a single unit.",
      example: "Using private variables with getters and setters.",
    },
    detailedAnswer: {
      definition:
        "Encapsulation is binding data and behavior together inside a class.",
      explanation:
        "It protects data from unauthorized access and improves maintainability.",
      image: "",
      video: "",
      interviewTip: "Mention data hiding when explaining encapsulation.",
      commonMistake: "Thinking encapsulation and abstraction are the same.",
      realWorldExample: "Bank account class hiding balance variable.",
    },
    codeSnippet: {
      js: "class Person { #name; constructor(name){ this.#name = name; } }",
      java: "private String name;",
      cpp: "private: int age;",
      python: "_name = 'John'",
      c: "",
    },
    keywords: ["encapsulation", "oops"],
    isPremium: false,
    views: 950,
    likes: 120,
    interviewCount: 18,
    company: ["Infosys", "Wipro"],
    solved: false,
  },

  {
    title: "What is Normalization in DBMS?",
    slug: "what-is-normalization",
    subject: "DBMS",
    topic: "Normalization",
    topicOrder: 1,
    difficulty: "Medium",
    question: "Explain normalization and its types.",
    shortAnswer: {
      answer:
        "Normalization is the process of organizing data to reduce redundancy.",
      example: "Separating student and course tables.",
    },
    detailedAnswer: {
      definition:
        "Normalization is a database design technique to minimize redundancy.",
      explanation:
        "It divides large tables into smaller ones and links them using relationships.",
      image: "",
      video: "",
      interviewTip: "Mention 1NF, 2NF, 3NF in interviews.",
      commonMistake: "Forgetting to explain functional dependency.",
      realWorldExample: "E-commerce order and customer separation.",
    },
    codeSnippet: {
      js: "",
      java: "",
      cpp: "",
      python: "",
      c: "",
    },
    keywords: ["dbms", "normalization"],
    isPremium: true,
    views: 800,
    likes: 90,
    interviewCount: 15,
    company: ["Amazon"],
    solved: true,
  },

  {
    title: "What is Deadlock in Operating System?",
    slug: "what-is-deadlock",
    subject: "OS",
    topic: "Process Management",
    topicOrder: 3,
    difficulty: "Hard",
    question: "Explain deadlock and its necessary conditions.",
    shortAnswer: {
      answer:
        "Deadlock is a situation where processes wait indefinitely for resources.",
      example:
        "Two processes holding one resource each and waiting for the other.",
    },
    detailedAnswer: {
      definition:
        "Deadlock occurs when a set of processes are blocked because each holds a resource and waits for another.",
      explanation:
        "It happens when mutual exclusion, hold and wait, no preemption, and circular wait occur.",
      image: "",
      video: "",
      interviewTip: "Always mention the 4 Coffman conditions.",
      commonMistake: "Forgetting circular wait condition.",
      realWorldExample: "Two cars blocking each other at a narrow bridge.",
    },
    codeSnippet: {
      js: "",
      java: "",
      cpp: "",
      python: "",
      c: "",
    },
    keywords: ["deadlock", "os"],
    isPremium: true,
    views: 600,
    likes: 70,
    interviewCount: 20,
    company: ["Microsoft", "Google"],
    solved: false,
  },

  {
    title: "What is Time Complexity?",
    slug: "what-is-time-complexity",
    subject: "DSA",
    topic: "Complexity Analysis",
    topicOrder: 1,
    difficulty: "Basic",
    question: "Explain time complexity with examples.",
    shortAnswer: {
      answer:
        "Time complexity measures how algorithm runtime grows with input size.",
      example: "Linear search is O(n).",
    },
    detailedAnswer: {
      definition:
        "Time complexity is the computational complexity describing runtime growth.",
      explanation:
        "It helps compare algorithm efficiency using Big-O notation.",
      image: "",
      video: "",
      interviewTip: "Explain best, average, worst case.",
      commonMistake: "Confusing time complexity with actual execution time.",
      realWorldExample: "Searching contact in phone list.",
    },
    codeSnippet: {
      js: "for(let i=0;i<n;i++){ console.log(i); }",
      java: "for(int i=0;i<n;i++){}",
      cpp: "for(int i=0;i<n;i++){}",
      python: "for i in range(n): pass",
      c: "for(int i=0;i<n;i++){}",
    },
    keywords: ["dsa", "big-o"],
    isPremium: false,
    views: 1500,
    likes: 200,
    interviewCount: 30,
    company: ["TCS", "Accenture"],
    solved: false,
  },
];

const Answer = () => {
  const [question, setQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState("js");
  const navigate = useNavigate();

  const [hoveredSection, setHoveredSection] = useState(null);

  const [relatedQuestions, setRelatedQuestions] = useState([]);

  const [relatedLoading, setRelatedLoading] = useState(false);

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

  const [mainLoading, setMainLoading] = useState(true);
  useEffect(() => {
    // Fetching all questions from backend (for now using fake data)

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

  if (mainLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <BlackLoader />
      </div>
    );
  }

  return (
    <div className="mt-16 flex bg-white min-h-screen">
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
      <main ref={mainRef} className="flex-1 max-w-4xl mx-auto px-8 py-5">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
          {question.topicOrder}. {question.question}
        </h1>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 mb-6 border-b gap-5 pb-4">
          {" "}
          <div className="">
            {" "}
            <span className="mr-4">
              {" "}
              Difficulty: <b>{question.difficulty}</b>{" "}
            </span>{" "}
            <span className="mr-4">Views: {question.views}</span>{" "}
            <span className="mr-4">Likes: {question.likes}</span>{" "}
            <span>Asked in: {question.interviewCount} interviews</span>{" "}
          </div>{" "}
          <button className="bg-green-700 mt-3 text-white px-4 py-2 rounded-md hover:bg-green-800 transition">
            {" "}
            Mark as Solved{" "}
          </button>{" "}
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
              <div className="flex border-b mb-6">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
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
            {["abstraction", "oops", "dbms", "oops"].map((q, index) => {
              return (
                <div
                  key={index}
                  className="py-2 px-2 bg-gray-300 rounded-md text-sm text-black"
                >
                  {q}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
