import { Check } from "lucide-react";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import axios from "axios";
import { toast } from "react-hot-toast";
import ButtonLoader from "../components/Loaders/ButtonLoader";
import BlackLoader from "../components/Loaders/BlackLoader";
const subjectsList = ["DSA", "OOPS", "OS", "CN", "DBMS"];
const statusList = ["Solved", "Unsolved", "Attempted"];

const difficultyList = ["Basic", "Easy", "Medium", "Hard"];

const fakeQuestions = [
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

const Question = () => {
  const navigate = useNavigate();

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const mainRef = useRef(null);

  const [allQuestions, setAllQuestions] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);

  const [pages, setPages] = useState(1);
  const pageRef = useRef(1);
  const [mainLoading, setMainLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    console.log(searchParams.getAll("subject"));
  }, [searchParams]);

  const handleSubjectChange = (subject) => {
    const newParams = new URLSearchParams(searchParams);

    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );

    if (newParams.getAll("subject").includes(subject)) {
      const values = newParams.getAll("subject").filter((s) => s !== subject);
      newParams.delete("subject");
      values.forEach((s) => newParams.append("subject", s));
    } else {
      newParams.append("subject", subject);
    }

    setSearchParams(newParams);
  };

  const handleDifficultyChange = (level) => {
    const newParams = new URLSearchParams(searchParams);
    setSelectedDifficulty((prev) =>
      prev.includes(level) ? prev.filter((d) => d !== level) : [...prev, level],
    );

    if (newParams.getAll("difficulty").includes(level)) {
      const values = newParams.getAll("difficulty").filter((d) => d !== level);
      newParams.delete("difficulty");
      values.forEach((d) => newParams.append("difficulty", d));
    } else {
      newParams.append("difficulty", level);
    }

    setSearchParams(newParams);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const returnProperSubjectName = (subject) => {
    switch (subject) {
      case "DSA":
        return "Data Structures and Algorithms";
      case "OOPS":
        return "Object Oriented Programming";
      case "DBMS":
        return "Database Management System";
      case "CN":
        return "Computer Networks";
      case "OS":
        return "Operating System";
      default:
        return subject;
    }
  };

  const getPageWiseData = async () => {
    try {
      setPageLoading(true);
      let allSubjects = searchParams.getAll("subject");
      let allDifficulties = searchParams.getAll("difficulty");

      if (allDifficulties.length == 0) {
        allDifficulties = ["Basic", "Easy", "Medium", "Hard"];
      }

      let next = pageRef.current + 1;

      const QuestionRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/question/v1/get/${allSubjects}/${allDifficulties}/${next}`,
        {
          withCredentials: true,
        },
      );

      if (QuestionRes.data.success) {
        pageRef.current = next;
        setPages((prev) => prev + 1);
        setAllQuestions((prev) => [...prev, ...QuestionRes.data.questions]);
      }
    } catch (error) {
      toast.error("Failed to fetch questions");
    } finally {
      setPageLoading(true);
    }
  };

  useEffect(() => {
    let allSubjects = searchParams.getAll("subject");
    let allDifficulties = searchParams.getAll("difficulty");

    setPages(1);
    pageRef.current = 1;

    console.log(allSubjects);

    if (allSubjects.length == 0) {
      allSubjects = ["OOPS", "DBMS", "OS", "CN", "DSA"];
      allDifficulties = ["Basic", "Easy", "Medium", "Hard"];
    }

    if (allDifficulties.length == 0) {
      allDifficulties = ["Basic", "Easy", "Medium", "Hard"];
    }
    (async () => {
      try {
        setMainLoading(true);
        const QuestionRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/question/v1/get/${allSubjects}/${allDifficulties}/1`,
          {
            withCredentials: true,
          },
        );
        if (QuestionRes.data.success) {
          setAllQuestions(QuestionRes.data.questions);
        }
      } catch (error) {
        toast.error("Failed to fetch questions");
      } finally {
        setMainLoading(false);
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;
    const handleScroll = () => {
      if (
        mainEl.scrollTop + mainEl.clientHeight >= mainEl.scrollHeight - 5 &&
        !mainLoading
      ) {
        getPageWiseData();
      }
    };
    mainEl.addEventListener("scroll", handleScroll);
    return () => {
      mainEl.removeEventListener("scroll", handleScroll);
    };
  }, [mainRef, mainLoading]);

  return (
    <div className="w-full mt-16  flex min-h-screen pl-6 bg-white">
      {/* Sidebar */}
      <div className="hidden md:block w-72 scrollbar-minimal bg-white border-r p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        <h2 className="text-xl font-bold mb-6">Filters</h2>

        {/* Subjects */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-gray-700">Subjects</h3>
          {subjectsList.map((subject) => (
            <label
              key={subject}
              className="flex items-center gap-3 mb-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={
                  // selectedSubjects.includes(subject) ||
                  searchParams.getAll("subject").includes(subject.toUpperCase())
                }
                onChange={() => handleSubjectChange(subject)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="text-sm text-gray-600 group-hover:text-black">
                {returnProperSubjectName(subject)}
              </span>
            </label>
          ))}
        </div>

        {/* Difficulty */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Difficulty</h3>
          {difficultyList.map((level) => (
            <label
              key={level}
              className="flex items-center gap-3 mb-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedDifficulty.includes(level)}
                onChange={() => handleDifficultyChange(level)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="text-sm text-gray-600 group-hover:text-black">
                {level}
              </span>
            </label>
          ))}
        </div>

        {/* Status */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-gray-700">Status</h3>
          {statusList.map((status) => (
            <label
              key={status}
              className="flex items-center gap-3 mb-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedStatus.includes(status)}
                onChange={() => handleStatusChange(status)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="text-sm text-gray-600 group-hover:text-black">
                {status}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={mainRef}
        className="flex-1 overflow-scroll scrollbar-minimal max-auto pr-3 h-screen bg-white pt-2 pb-32 pl-3"
      >
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full md:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
            <option value="interview">Most Asked</option>
          </select>
        </div>

        {/* Placeholder for Question Cards */}
        <div className="gap-2 flex flex-col ">
          {mainLoading ? (
            <div className="flex items-center justify-center mt-20">
              <BlackLoader />
            </div>
          ) : allQuestions.length == 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-20">
              {/* <img src="/empty.svg" alt="No questions" className="w-48 h-48" /> */}
              <h2 className="text-xl text-gray-600">No questions found</h2>
            </div>
          ) : (
            allQuestions.map((q, index) => {
              return (
                <div
                  onClick={() =>
                    navigate(`/answer/${q.subject}/${q.slug}/${q._id}`)
                  }
                  key={index}
                  className="flex  rounded-md border-gray-400 justify-between cursor-pointer border-b w-full py-4 text-lg px-1 items-center"
                >
                  <div className="flex  gap-2 items-center justify-center">
                    <div className="w-6 h-4 flex items-center justify-center">
                      {q.solved && (
                        <Check className="text-green-800 ml-2 w-5 h-5" />
                      )}
                    </div>
                    <h3>{q.topicOrder + ". " + q.question}</h3>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                      {q.difficulty}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {pageLoading && (
            <div className="flex w-full items-center justify-center mt-4">
              <BlackLoader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
