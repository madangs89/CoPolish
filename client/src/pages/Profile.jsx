import React from "react";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";
import { setAuthFalse, setUser } from "../redux/slice/authSlice";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

const Card = ({ title, children, loading, minHeight }) => (
  <div className="bg-white rounded-3xl shadow-sm p-6">
    <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
    {loading ? (
      <div className="space-y-3" style={minHeight ? { minHeight } : {}}>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ) : (
      children
    )}
  </div>
);

const StatCard = ({ title, value, loading }) => (
  <div className="bg-white rounded-3xl p-5 shadow-sm">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    {loading ? (
      <Skeleton className="h-8 w-16 mt-1" />
    ) : (
      <p className="text-3xl font-semibold text-gray-900 tabular-nums leading-none">
        {value ?? "—"}
      </p>
    )}
  </div>
);

const diffBar = (key) =>
  ({
    Easy: "bg-gradient-to-r from-blue-500 to-indigo-500",
    Medium: "bg-gradient-to-r from-blue-500 to-indigo-500",
    Hard: "bg-gradient-to-r from-blue-500 to-indigo-500",
    Basic: "bg-gradient-to-r from-blue-500 to-indigo-500",
  })[key] || "bg-gradient-to-r from-blue-500 to-indigo-500";

const diffPill = (key) =>
  ({
    Easy: "bg-blue-50 text-blue-600",
    Medium: "bg-indigo-50 text-indigo-600",
    Hard: "bg-gray-100 text-gray-600",
    Basic: "bg-gray-100 text-gray-500",
  })[key] || "bg-gray-100 text-gray-500";

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [problemStats, setProblemStats] = useState({
    Basic: { solved: 0, total: 0 },
    Easy: { solved: 0, total: 0 },
    Medium: { solved: 0, total: 0 },
    Hard: { solved: 0, total: 0 },
  });
  const [recentProblems, setRecentProblems] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [creditData, setCreditData] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);


  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/logout`,
        {},
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success("Logged out successfully!");
        dispatch(setAuthFalse());
        dispatch(setUser({ isAuth: false, user: null }));
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/all/versions`,
          { withCredentials: true },
        );
        if (res.data.success) setResumes(res.data.resumes);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingResumes(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [totalRes, solvedRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/question/v1/get/questions/difficulty`,
            { withCredentials: true },
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/get/questions/difficulty`,
            { withCredentials: true },
          ),
        ]);
        setProblemStats((prev) => {
          const next = { ...prev };
          if (totalRes.data.success)
            Object.keys(next).forEach((k) => {
              next[k] = { ...next[k], total: totalRes.data.questions[k] || 0 };
            });
          if (solvedRes.data.success)
            Object.keys(next).forEach((k) => {
              next[k] = {
                ...next[k],
                solved: solvedRes.data.solvedQuestions[k] || 0,
              };
            });
          return next;
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingStats(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/v1/payment/monthly/stats`,
          { withCredentials: true },
        );
        if (res.data.success) setCreditData(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingCredits(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/solved/questions/1/5`,
          { withCredentials: true },
        );
        if (res.data.success) setRecentProblems(res.data.questions);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingRecent(false);
      }
    })();
  }, []);

  const totalSolved = Object.values(problemStats).reduce(
    (a, b) => a + b.solved,
    0,
  );

  return (
    <div className="w-full min-h-screen h-screen bg-[#f7f7f7] flex justify-center pt-16 pb-24 overflow-y-auto">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner */}
        <div className="bg-[#eaf2ff] rounded-2xl px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm flex-shrink-0">
            ✓
          </div>
          <p className="text-sm">
            <span className="font-medium">Profile Dashboard</span>
            {!loadingStats && (
              <>
                {" "}
                — <span className="font-semibold">
                  {totalSolved} problems
                </span>{" "}
                solved across all subjects.
              </>
            )}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 ml-2 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Credits"
            value={user?.totalCredits}
            loading={!user}
          />
          <StatCard
            title="Problems Solved"
            value={totalSolved}
            loading={loadingStats}
          />
          <StatCard
            title="Resumes"
            value={resumes.length}
            loading={loadingResumes}
          />
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left: 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            {/* Problem progress */}
            <Card
              title="Problem Progress"
              loading={loadingStats}
              minHeight="160px"
            >
              <div className="space-y-5">
                {Object.entries(problemStats).map(([key, data]) => {
                  const pct = data.total
                    ? Math.round((data.solved / data.total) * 100)
                    : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-400 tabular-nums">
                          {data.solved}/{data.total}
                        </span>
                      </div>
                      <div className="bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${diffBar(key)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Resume library */}
            <Card
              title="Resume Library"
              loading={loadingResumes}
              minHeight="100px"
            >
              {resumes.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {resumes.map((r, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/editor/resume/${r._id}`)}
                      className="group relative bg-gray-50 hover:bg-[#eaf2ff] border border-gray-100 hover:border-blue-100 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-sm"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
                          <FileText className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-full">
                          {r.version || "v1"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-sm text-gray-800 truncate mb-1">
                        {r.title || "Untitled Resume"}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">
                        {r.updated ? `Updated ${r.updated}` : "—"}
                      </p>

                      {/* Footer */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-500 group-hover:underline underline-offset-2">
                          Open →
                        </span>
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400 font-medium">
                    No resumes yet
                  </p>
                  <p className="text-xs text-gray-300">
                    Create your first resume to get started
                  </p>
                </div>
              )}
            </Card>

            {/* Recent questions */}
            <Card
              title="Recent Solved Questions"
              loading={loadingRecent}
              minHeight="120px"
            >
              <div className="divide-y divide-gray-50">
                {recentProblems.length > 0 ? (
                  recentProblems.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 gap-3"
                    >
                      <span className="text-sm font-medium text-gray-800 flex-1 truncate">
                        {p?.questionId?.title}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {p.subject}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${diffPill(p?.questionId?.difficulty)}`}
                      >
                        {p?.questionId?.difficulty}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 py-4">
                    No recent questions solved yet.
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate("/profile/solved")}
                className="text-sm font-semibold text-gray-900 mt-4 hover:underline underline-offset-2"
              >
                See all →
              </button>
            </Card>
          </div>

          {/* Right: 1 col */}
          <div className="space-y-6">
            {/* Credit chart */}
            <Card
              title="Credit Usage"
              loading={loadingCredits}
              minHeight="180px"
            >
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={creditData}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid #f3f4f6",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    itemStyle={{ color: "#111827" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="credits"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* CTA — matches dashboard's warm panel */}
            <div className="bg-[#fff7e6] rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
                Stay consistent
              </p>
              <p className="text-2xl font-semibold text-gray-900 mb-1">
                Practice daily 🔥
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Top candidates solve at least 3 questions a day. You're just a
                few clicks away from your next milestone.
              </p>
              <button
                onClick={() => navigate("/question")}
                className="w-full px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Solve Questions →
              </button>
            </div>

            {/* Payment history */}
            {/* <Card title="Payment History">
              <div className="space-y-3">
                {payments.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-gray-800">
                      {p.amount} Credits
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.status === "success"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-gray-400 text-xs">{p.date}</span>
                  </div>
                ))}
              </div>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
