import React from "react";
import { useEffect } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const [problemStats, setProblemStats] = useState({
    Basic: { solved: 0, total: 0 },
    Easy: { solved: 0, total: 0 },
    Medium: { solved: 0, total: 0 },
    Hard: { solved: 0, total: 0 },
  });

  const recentProblems = [
    { title: "What is OOP?", subject: "OOPS", difficulty: "Easy" },
    { title: "Deadlock in OS", subject: "OS", difficulty: "Medium" },
    { title: "TCP Handshake", subject: "CN", difficulty: "Hard" },
  ];

  const [resumes, setResumes] = useState([]);

  const payments = [
    { amount: 200, status: "success", date: "Mar 1" },
    { amount: 100, status: "success", date: "Feb 14" },
  ];

  const jobs = [
    { operation: "Resume Optimization", status: "completed", credits: 5 },
    { operation: "LinkedIn Optimization", status: "running", credits: 2 },
    { operation: "ATS Score", status: "failed", credits: 3 },
  ];

  const [creditData, setCreditData] = useState([]);

  const heatmap = Array.from({ length: 72 }, () =>
    Math.floor(Math.random() * 4),
  );

  useEffect(() => {
    (async () => {
      try {
        const allResume = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/all/versions`,
          {
            withCredentials: true,
          },
        );

        if (allResume.data.success) {
          setResumes(allResume.data.resumes);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const allQuestionsCount = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/question/v1/get/questions/difficulty`,
          {
            withCredentials: true,
          },
        );
        console.log(allQuestionsCount.data);

        if (allQuestionsCount.data.success) {
          const data = allQuestionsCount.data.questions;

          setProblemStats((prev) => {
            Object.keys(prev).forEach((key) => {
              prev[key].total = data[key] || 0;
            });
            return { ...prev };
          });
        }

        const allUserSolvedCount = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/get/questions/difficulty`,
          {
            withCredentials: true,
          },
        );
        console.log(allUserSolvedCount.data);

        if (allUserSolvedCount.data.success) {
          const data = allUserSolvedCount.data.solvedQuestions;

          setProblemStats((prev) => {
            Object.keys(prev).forEach((key) => {
              prev[key].solved = data[key] || 0;
            });
            return { ...prev };
          });
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const creditStats = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/v1/payment/monthly/stats`,
          {
            withCredentials: true,
          },
        );

        if (creditStats.data.success) {
          setCreditData(creditStats.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="w-full min-h-screen h-screen overflow-y-scroll bg-gray-50 flex justify-center pt-20 pb-24">
      <div className="w-full max-w-7xl p-6 space-y-8">
        {/* HEADER */}
        <h1 className="text-2xl font-bold">Profile Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard
            title="Credits"
            value={user.totalCredits}
            color="bg-indigo-100"
          />
          <StatCard
            title="Problems Solved"
            value={Object.entries(problemStats).reduce(
              (a, b) => a + b[1].solved,
              0,
            )}
            color="bg-green-100"
          />
          <StatCard
            title="Resumes"
            value={resumes.length}
            color="bg-blue-100"
          />
          <StatCard title="AI Jobs" value="12" color="bg-yellow-100" />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-3 space-y-6">
            {/* PROBLEM PROGRESS */}
            <Card title="Problem Progress">
              {Object.keys(problemStats).map((key) => {
                const data = problemStats[key];
                const percent = (data.solved / data.total) * 100;

                return (
                  <div key={key} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{key}</span>
                      <span className="text-gray-500">
                        {data.solved}/{data.total}
                      </span>
                    </div>

                    <div className="bg-gray-200 h-3 rounded-full">
                      <div
                        className={`h-3 rounded-full ${
                          key === "Easy"
                            ? "bg-green-500"
                            : key === "Medium"
                              ? "bg-yellow-500"
                              : key === "Hard"
                                ? "bg-red-500"
                                : "bg-blue-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </Card>

            {/* RECENT QUESTIONS */}
            <Card title="Recent Solved Questions">
              <div className="divide-y">
                {recentProblems.map((p, i) => (
                  <div key={i} className="flex justify-between py-3">
                    <span>{p.title}</span>

                    <span className="text-gray-400">{p.subject}</span>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        p.difficulty === "Easy"
                          ? "bg-green-100 text-green-700"
                          : p.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* RESUME LIBRARY */}
            <Card title="Resume Library">
              <div className="grid md:grid-cols-3 gap-4">
                {resumes.map((r, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 hover:shadow-sm transition"
                  >
                    <h3 className="font-semibold">{r.title}</h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {r.version} • {r.updated}
                    </p>

                    <button
                      onClick={() => navigate(`/editor/resume/${r._id}`)}
                      className="text-blue-600 cursor-pointer text-sm mt-3"
                    >
                      Open →
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* CREDIT CHART */}
            <Card title="Credit Usage">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={creditData}>
                  <XAxis dataKey="month" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="credits"
                    stroke="#4F46E5"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* HEATMAP */}
            <Card title="Activity">
              <div className="grid grid-cols-12 gap-1">
                {heatmap.map((d, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-sm ${
                      d === 0
                        ? "bg-gray-200"
                        : d === 1
                          ? "bg-green-200"
                          : d === 2
                            ? "bg-green-400"
                            : "bg-green-600"
                    }`}
                  />
                ))}
              </div>
            </Card>

            {/* JOB RUNS */}
            <Card title="AI Job Runs">
              <div className="space-y-3 text-sm">
                {jobs.map((job, i) => (
                  <div key={i} className="flex justify-between border-b pb-2">
                    <span>{job.operation}</span>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        job.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : job.status === "running"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {job.status}
                    </span>

                    <span className="text-gray-500">{job.credits} credits</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* PAYMENT HISTORY */}
            <Card title="Payment History">
              <div className="space-y-3 text-sm">
                {payments.map((p, i) => (
                  <div key={i} className="flex justify-between border-b pb-2">
                    <span>{p.amount} Credits</span>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        p.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>

                    <span className="text-gray-400">{p.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white border rounded-xl shadow-sm p-6">
    <h2 className="font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const StatCard = ({ title, value, color }) => (
  <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <div className={`w-10 h-10 rounded-lg ${color}`} />
  </div>
);

export default Profile;
