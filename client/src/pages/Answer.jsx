import React, { useRef, useState } from "react";

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
  const question = fakeQuestions[0];
  const [activeTab, setActiveTab] = useState("js");

  const shortAnswerRef = useRef(null);
  const definitionRef = useRef(null);
  const explanationRef = useRef(null);
  const codeRef = useRef(null);
  const realWorldExampleRef = useRef(null);
  const mainRef = useRef(null);

  const allRefData = {
    "Short Answer": shortAnswerRef,
    Definition: definitionRef,
    Explanation: explanationRef,
    Code: codeRef,
    "Real World Example": realWorldExampleRef,
  };

  const languages = Object.keys(question.codeSnippet).filter(
    (lang) => question.codeSnippet[lang],
  );

  return (
    <div className="mt-16 flex bg-white min-h-screen">
      <div className="hidden md:block w-72 scrollbar-minimal bg-white border-r px-6 py-2 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
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
              allRefData[subject].current.scrollIntoView({ behavior: "smooth" })
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
      <div ref={mainRef} className="flex-1 mx-auto px-6  py-2">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {question.topicOrder}. {question.question}
        </h1>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 mb-6 border-b pb-4">
          <span className="mr-4">
            Difficulty: <b>{question.difficulty}</b>
          </span>
          <span className="mr-4">Views: {question.views}</span>
          <span className="mr-4">Likes: {question.likes}</span>
          <span>Asked in: {question.interviewCount} interviews</span>
        </div>

        {/* Short Answer */}
        <div ref={shortAnswerRef} className="mb-8 scroll-mt-24">
          <h2 className="text-xl font-semibold mb-2 border-b pb-2">
            Interview Short Answer
          </h2>
          <p className="text-gray-700 leading-7">
            {question.shortAnswer.answer}
          </p>
          {question.shortAnswer.example && (
            <p className="mt-3 text-gray-600 italic">
              Example: {question.shortAnswer.example}
            </p>
          )}
        </div>

        {/* Definition */}
        <div ref={definitionRef} className="mb-8">
          <h2 className="text-xl font-semibold mb-2 border-b pb-2">
            Definition
          </h2>
          <p className="text-gray-700 leading-7">
            {question.detailedAnswer.definition}
          </p>
        </div>

        {/* Explanation */}
        <div ref={explanationRef} className="mb-8">
          <h2 className="text-xl font-semibold mb-2 border-b pb-2">
            Explanation
          </h2>
          <p className="text-gray-700 leading-7">
            {question.detailedAnswer.explanation}
          </p>
        </div>

        {/* Code Section */}
        <div ref={codeRef} className="">
          {languages.length > 0 && (
            <div className="mb-10">
              {/* Tabs */}
              <div className="flex border-b mb-4">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                      activeTab === lang
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-black"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <pre class="line-numbers">
                <code class="language-cpp">
                  {question.codeSnippet[activeTab]}
                </code>
              </pre>
            </div>
          )}
        </div>

        {/* Interview Tip */}
        {question.detailedAnswer.interviewTip && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 border-b pb-2">
              Interview Tip
            </h2>
            <p className="text-gray-700 leading-7">
              {question.detailedAnswer.interviewTip}
            </p>
          </div>
        )}

        {/* Real World Example */}
        {question.detailedAnswer.realWorldExample && (
          <div ref={realWorldExampleRef} className="mb-8">
            <h2 className="text-xl font-semibold mb-2 border-b pb-2">
              Real World Example
            </h2>
            <p className="text-gray-700 leading-7">
              {question.detailedAnswer.realWorldExample}
            </p>
          </div>
        )}

        {/* Common Mistake */}
        {question.detailedAnswer.commonMistake && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 border-b pb-2">
              Common Mistake
            </h2>
            <p className="text-gray-700 leading-7">
              {question.detailedAnswer.commonMistake}
            </p>
          </div>
        )}
      </div>

      <div className="hidden md:block w-72 scrollbar-minimal bg-white border-l px-6 py-2 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        <h2 className="text-lg font-semibold mb-6">Related Questions</h2>
      </div>
    </div>
  );
};

export default Answer;
