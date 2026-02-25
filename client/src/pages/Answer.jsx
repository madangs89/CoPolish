import React, { useState } from "react";
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
  const question = fakeQuestions[0]; // just showing first fake question
  const [activeTab, setActiveTab] = useState("js");

  const languages = Object.keys(question.codeSnippet).filter(
    (lang) => question.codeSnippet[lang],
  );

  return (
    <div className="mt-16 px-6 py-8 bg-gray-50 min-h-screen">
      {/* Title Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {question.topicOrder + ". " + question.question}
          </h1>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium
              ${
                question.difficulty === "Basic"
                  ? "bg-green-100 text-green-700"
                  : question.difficulty === "Easy"
                    ? "bg-blue-100 text-blue-700"
                    : question.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
              }
            `}
          >
            {question.difficulty}
          </span>
        </div>

        <div className="text-sm text-gray-500 mt-2">
          👁 {question.views} views • ❤️ {question.likes} likes • 🏢 Asked{" "}
          {question.interviewCount} times
        </div>
      </div>

      {/* Short Answer */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6">
        <h2 className="font-semibold mb-2">Short Answer</h2>
        <p>{question.shortAnswer.answer}</p>
        {question.shortAnswer.example && (
          <p className="mt-2 text-sm text-gray-600">
            Example: {question.shortAnswer.example}
          </p>
        )}
      </div>

      {/* Detailed Explanation */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-3">Definition</h2>
        <p className="mb-4">{question.detailedAnswer.definition}</p>

        <h2 className="text-lg font-semibold mb-3">Explanation</h2>
        <p>{question.detailedAnswer.explanation}</p>
      </div>

      {/* Code Section */}
      {languages.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h2 className="text-lg font-semibold mb-4">Code Example</h2>

          {/* Tabs */}
          <div className="flex gap-3 mb-4">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-3 py-1 rounded-md text-sm ${
                  activeTab === lang ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Code Block */}
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
            {question.codeSnippet[activeTab]}
          </pre>
        </div>
      )}

      {/* Interview Tip */}
      {question.detailedAnswer.interviewTip && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md mb-6">
          <h3 className="font-semibold mb-2">Interview Tip</h3>
          <p>{question.detailedAnswer.interviewTip}</p>
        </div>
      )}

      {/* Real World Example */}
      {question.detailedAnswer.realWorldExample && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
          <h3 className="font-semibold mb-2">Real World Example</h3>
          <p>{question.detailedAnswer.realWorldExample}</p>
        </div>
      )}

      {/* Common Mistake */}
      {question.detailedAnswer.commonMistake && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
          <h3 className="font-semibold mb-2">Common Mistake</h3>
          <p>{question.detailedAnswer.commonMistake}</p>
        </div>
      )}
    </div>
  );
};

export default Answer;
