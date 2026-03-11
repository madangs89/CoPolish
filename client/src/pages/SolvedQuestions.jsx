import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

const difficultyConfig = {
  Basic: {
    label: "Basic",
    pill: "bg-gray-100 text-gray-500",
    bar: "bg-gray-300",
    dot: "bg-gray-400",
  },
  Easy: {
    label: "Easy",
    pill: "bg-black text-white",
    bar: "bg-black",
    dot: "bg-black",
  },
  Medium: {
    label: "Medium",
    pill: "bg-gray-800 text-white",
    bar: "bg-gray-700",
    dot: "bg-gray-700",
  },
  Hard: {
    label: "Hard",
    pill: "bg-gray-900 text-white",
    bar: "bg-gray-900",
    dot: "bg-gray-900",
  },
};

const subjectPill = "bg-gray-100 text-gray-600";

const SkeletonRow = () => (
  <div className="flex items-center gap-6 px-8 py-5 animate-pulse border-b border-gray-50">
    <div className="h-3 bg-gray-100 rounded-full w-5 flex-shrink-0" />
    <div className="h-3 bg-gray-100 rounded-full flex-1" />
    <div className="h-6 bg-gray-100 rounded-full w-16 flex-shrink-0" />
    <div className="h-6 bg-gray-100 rounded-full w-16 flex-shrink-0" />
    <div className="h-3 bg-gray-100 rounded-full w-20 flex-shrink-0" />
  </div>
);

const StatCard = ({ label, count, config, loading, percentage }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      {loading ? (
        <div className="h-8 w-10 bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        <span className="text-3xl font-bold text-gray-900 tabular-nums leading-none">
          {count}
        </span>
      )}
    </div>
    <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
      {!loading && (
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${config.bar}`}
          style={{ width: `${percentage}%` }}
        />
      )}
    </div>
  </div>
);

const SolvedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [diffStats, setDiffStats] = useState({
    Basic: 0,
    Easy: 0,
    Medium: 0,
    Hard: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [totalSolved, setTotalSolved] = useState(0);

  const pageRef = useRef(0);
  const totalPagesRef = useRef(1);
  const scrollRef = useRef(null);
  const fetchingRef = useRef(false);

  const fetchDifficultyStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/get/questions/difficulty`,
        { withCredentials: true },
      );
      if (res.data.success) {
        setDiffStats(res.data.solvedQuestions);
        setTotalSolved(
          Object.values(res.data.solvedQuestions).reduce((a, b) => a + b, 0),
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const getPageWiseData = useCallback(async () => {
    if (fetchingRef.current || pageRef.current >= totalPagesRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/solved/questions/${pageRef.current + 1}/10`,
        { withCredentials: true },
      );
      if (res.data.success) {
        setQuestions((prev) => [...prev, ...res.data.questions]);
        pageRef.current = res.data.page;
        totalPagesRef.current = res.data.totalPages;
        setHasMore(res.data.page < res.data.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    fetchDifficultyStats();
    getPageWiseData();
  }, [fetchDifficultyStats, getPageWiseData]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80)
        getPageWiseData();
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [getPageWiseData]);

  const maxCount = Math.max(...Object.values(diffStats), 1);

  return (
    <div className="min-h-screen mt-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Interview Preparation
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Track your solved questions across all subjects
            </p>
          </div>
          {!statsLoading && (
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl px-5 py-2.5 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-black" />
              <span className="text-sm font-semibold text-gray-800">
                {totalSolved} solved
              </span>
            </div>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Object.entries(difficultyConfig).map(([label, config]) => (
            <StatCard
              key={label}
              label={label}
              count={diffStats[label] ?? 0}
              config={config}
              loading={statsLoading}
              percentage={Math.round(
                ((diffStats[label] ?? 0) / maxCount) * 100,
              )}
            />
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              Solved Questions
            </h2>
            {!initialLoad && (
              <span className="text-xs text-gray-400">
                {questions.length} of {totalSolved}
              </span>
            )}
          </div>

          {/* Column headers — desktop */}
          <div
            className="hidden sm:grid px-8 py-3 bg-gray-50 border-b border-gray-100"
            style={{ gridTemplateColumns: "2.5rem 1fr 7rem 8rem 8rem" }}
          >
            {["#", "Question", "Subject", "Difficulty", "Solved On"].map(
              (h, i) => (
                <span
                  key={h}
                  className={`text-xs font-semibold text-gray-400 uppercase tracking-wider
                  ${i === 2 || i === 3 ? "text-center" : ""}
                  ${i === 4 ? "text-right" : ""}`}
                >
                  {h}
                </span>
              ),
            )}
          </div>

          {/* List */}
          <div
            ref={scrollRef}
            className="overflow-y-auto divide-y divide-gray-50"
            style={{ maxHeight: "calc(100vh - 420px)", minHeight: "180px" }}
          >
            {initialLoad &&
              Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)}

            {questions.map((q, i) => {
              const diff = q.questionId?.difficulty || "Easy";
              const dc = difficultyConfig[diff] || difficultyConfig.Easy;
              const date = q.completedAt
                ? new Date(q.completedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—";

              return (
                <div
                  key={q._id || i}
                  className="group hover:bg-gray-50 transition-colors duration-100"
                >
                  {/* Desktop */}
                  <div
                    className="hidden sm:grid items-center gap-6 px-8 py-4"
                    style={{ gridTemplateColumns: "2.5rem 1fr 7rem 8rem 8rem" }}
                  >
                    <span className="text-sm text-gray-300 font-semibold tabular-nums group-hover:text-gray-400 transition-colors">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {q.questionId?.title || "Untitled"}
                    </span>
                    <div className="flex justify-center">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${subjectPill}`}
                      >
                        {q.subject}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${dc.pill}`}
                      >
                        {diff}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 text-right tabular-nums">
                      {date}
                    </span>
                  </div>

                  {/* Mobile */}
                  <div className="sm:hidden px-5 py-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-gray-800 leading-snug flex-1">
                        {q.questionId?.title || "Untitled"}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${dc.pill}`}
                      >
                        {diff}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${subjectPill}`}
                      >
                        {q.subject}
                      </span>
                      <span className="text-xs text-gray-400">{date}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && !initialLoad && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {!loading && !hasMore && questions.length > 0 && (
              <div className="text-center py-8 text-xs text-gray-300 font-semibold tracking-widest uppercase">
                You've reached the end
              </div>
            )}

            {!initialLoad && !loading && questions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                  📭
                </div>
                <p className="text-sm font-semibold text-gray-500">
                  No solved questions yet
                </p>
                <p className="text-xs text-gray-300">
                  Start solving to track your progress
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvedQuestions;
