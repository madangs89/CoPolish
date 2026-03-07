import { Check } from "lucide-react";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import axios from "axios";
import { toast } from "react-hot-toast";
import ButtonLoader from "../components/Loaders/ButtonLoader";
import BlackLoader from "../components/Loaders/BlackLoader";
const subjectsList = ["DSA", "OOPS", "OS", "CN", "DBMS"];
const statusList = ["solved", "unsolved", "attempted"];

const difficultyList = ["Basic", "Easy", "Medium", "Hard"];

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
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [allUserSolvedQuestions, setAllUserSolvedQuestions] = useState([]);
  const pageRef = useRef(1);
  const cursorRef = useRef(0);
  const hasMoreRef = useRef(true);
  const fetchingRef = useRef(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // modal
  const [showFilters, setShowFilters] = useState(false);

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
    const newParams = new URLSearchParams(searchParams);

    if (selectedStatus == status) {
      setSelectedStatus("");
      newParams.delete("status");
      newParams.append("status", "all");
    } else {
      setSelectedStatus(status);
      newParams.delete("status");
      newParams.append("status", status);
    }

    setSearchParams(newParams);
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
    console.log(pages, pageRef.current, totalPages);

    if (pageLoading) return;
    if (fetchingRef.current) return;

    console.log(allUserSolvedQuestions);

    if (!hasMoreRef.current) return;
    try {
      setPageLoading(true);
      fetchingRef.current = true;
      let allSubjects = searchParams.getAll("subject");
      let allDifficulties = searchParams.getAll("difficulty");

      if (allDifficulties.length == 0) {
        allDifficulties = ["Basic", "Easy", "Medium", "Hard"];
      }

      let next = pageRef.current + 1;

      const QuestionRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/question/v1/get/${allSubjects.length ? allSubjects : "all"}/${allDifficulties}/${next}/${cursorRef.current}/${selectedStatus.length ? selectedStatus : "all"}`,
        {
          withCredentials: true,
        },
      );

      if (QuestionRes.data.success) {
        pageRef.current = next;
        setPages((prev) => prev + 1);
        setAllQuestions((prev) => [...prev, ...QuestionRes.data.questions]);
        setTotalPages(QuestionRes.data.totalPages);
        setTotalQuestions(QuestionRes.data.totalQuestions);
        setAllUserSolvedQuestions((prev) => {
          let solvedQuestions = QuestionRes.data.allUserSolvedQuestions.map(
            (q) => q.questionId,
          );
          let set = new Set([...solvedQuestions, ...prev]);
          return Array.from(set);
        });

        pageRef.current = QuestionRes.data.currentPage;
        setCurrentPage(QuestionRes.data.currentPage);
        setPages(pageRef.current);
        cursorRef.current = QuestionRes.data.newCursor;
        hasMoreRef.current = QuestionRes.data.hasMoreRef;
        console.log("after res cursor", cursorRef.current);
      }
    } catch (error) {
      toast.error("Failed to fetch questions");
    } finally {
      setPageLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    let allSubjects = searchParams.getAll("subject");
    let allDifficulties = searchParams.getAll("difficulty");
    let allStatus = searchParams.getAll("status");

    setPages(1);
    setTotalPages(1);
    pageRef.current = 1;
    cursorRef.current = 0;

    console.log(allSubjects);

    if (allSubjects.length == 0) {
      allSubjects = ["OOPS", "DBMS", "OS", "CN", "DSA"];
      allDifficulties = ["Basic", "Easy", "Medium", "Hard"];
    }

    if (allDifficulties.length == 0) {
      allDifficulties = ["Basic", "Easy", "Medium", "Hard"];
    }

    if (allStatus.length == 0) {
      allStatus = "all";
    }

    (async () => {
      try {
        setAllQuestions([]);
        setAllUserSolvedQuestions([]);
        setMainLoading(true);
        const QuestionRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/question/v1/get/${allSubjects}/${allDifficulties}/1/${cursorRef.current}/${allStatus}`,
          {
            withCredentials: true,
          },
        );
        if (QuestionRes.data.success) {
          setAllQuestions(QuestionRes.data.questions);
          setTotalPages(QuestionRes.data.totalPages);
          setTotalQuestions(QuestionRes.data.totalQuestions);
          setAllUserSolvedQuestions((prev) => {
            let solvedQuestions = QuestionRes.data.allUserSolvedQuestions.map(
              (q) => q.questionId,
            );
            let set = new Set([...solvedQuestions, ...prev]);
            return Array.from(set);
          });
          pageRef.current = QuestionRes.data.currentPage;
          setCurrentPage(QuestionRes.data.currentPage);
          setPages(pageRef.current);
          cursorRef.current = QuestionRes.data.newCursor;
          hasMoreRef.current = QuestionRes.data.hasMoreRef;
          console.log("after res cursor", cursorRef.current);
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
        mainEl.scrollTop + mainEl.clientHeight >= mainEl.scrollHeight - 100 &&
        !mainLoading &&
        !pageLoading &&
        !fetchingRef.current
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
    <div className="w-full mt-16 flex min-h-screen md:pl-7 bg-white">
      {/* Sidebar (Desktop) */}
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
                checked={searchParams.getAll("subject").includes(subject)}
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
                checked={selectedStatus == status}
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

      {/* Main Section */}
      <div className="flex-1 flex px-2 flex-col">
        {/* Scroll Container */}
        <div
          ref={mainRef}
          className="overflow-y-scroll w-full scrollbar-minimal h-screen bg-white pt-3 pb-32"
        >
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full md:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center justify-between md:justify-end gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(true)}
                  className="px-4 py-2 md:hidden border rounded-lg bg-gray-100"
                >
                  Filters
                </button>

                <p className="text-sm text-gray-600 whitespace-nowrap">
                  Total {totalQuestions}
                </p>
              </div>

              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="newest">Newest</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
                <option value="interview">Most Asked</option>
              </select>
            </div>
          </div>

          {/* Question List */}
          <div className="flex flex-col gap-2  mx-auto w-full">
            {mainLoading ? (
              <div className="flex items-center justify-center mt-20">
                <BlackLoader />
              </div>
            ) : allQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 mt-20">
                <h2 className="text-xl text-gray-600">No questions found</h2>
              </div>
            ) : (
              allQuestions.map((q, index) => (
                <div
                  onClick={() =>
                    navigate(`/answer/${q.subject}/${q.slug}/${q._id}`)
                  }
                  key={q._id}
                  className="flex justify-between items-center border-b py-4 cursor-pointer hover:bg-gray-50 transition px-2 rounded-md"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-5 h-5 flex items-center justify-center">
                      {allUserSolvedQuestions.includes(q._id) && (
                        <Check className="text-green-600 w-5 h-5" />
                      )}
                    </div>

                    <h3 className="text-sm md:text-base text-gray-800">
                      {q.topicOrder + ". " + q.question}
                    </h3>
                  </div>

                  <span className="text-xs md:text-sm text-gray-500 ml-3">
                    {q.difficulty}
                  </span>
                </div>
              ))
            )}

            {pageLoading && (
              <div className="flex w-full items-center justify-center mt-6">
                <BlackLoader />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />

          <div className="absolute left-0 top-0 h-full w-80 max-w-[80%] bg-white shadow-xl p-6 overflow-y-auto animate-slideInLeft">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>

              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500"
              >
                Close
              </button>
            </div>

            {/* Subjects */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Subjects</h3>

              {subjectsList.map((subject) => (
                <label key={subject} className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={searchParams.getAll("subject").includes(subject)}
                    onChange={() => handleSubjectChange(subject)}
                    className="accent-blue-600 w-4 h-4"
                  />
                  {returnProperSubjectName(subject)}
                </label>
              ))}
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Difficulty</h3>

              {difficultyList.map((level) => (
                <label key={level} className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedDifficulty.includes(level)}
                    onChange={() => handleDifficultyChange(level)}
                    className="accent-blue-600 w-4 h-4"
                  />
                  {level}
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg mt-4"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
