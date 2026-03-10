import React from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const Profile = () => {
  const user = {
    name: "Madan G S",
    credits: 352,
  };

  const problemStats = {
    Easy: { solved: 45, total: 100 },
    Medium: { solved: 25, total: 60 },
    Hard: { solved: 10, total: 30 },
  };

  const recentProblems = [
    { title: "What is OOP?", subject: "OOPS", difficulty: "Easy" },
    { title: "Deadlock in OS", subject: "OS", difficulty: "Medium" },
    { title: "TCP Handshake", subject: "CN", difficulty: "Hard" },
  ];

  const resumes = [
    { title: "Backend Resume", version: "v3", updated: "Mar 10" },
    { title: "Intern Resume", version: "v2", updated: "Jan 24" },
    { title: "Full Stack Resume", version: "v1", updated: "Dec 12" },
  ];

  const payments = [
    { amount: 200, status: "success", date: "Mar 1" },
    { amount: 100, status: "success", date: "Feb 14" },
  ];

  const jobs = [
    { operation: "Resume Optimization", status: "completed", credits: 5 },
    { operation: "LinkedIn Optimization", status: "running", credits: 2 },
    { operation: "ATS Score", status: "failed", credits: 3 },
  ];

  const creditData = [
    { month: "Jan", credits: 120 },
    { month: "Feb", credits: 90 },
    { month: "Mar", credits: 150 },
    { month: "Apr", credits: 80 },
  ];

  const heatmap = Array.from({ length: 72 }, () =>
    Math.floor(Math.random() * 4),
  );

  return (
    <div className="w-full min-h-screen h-screen overflow-y-scroll bg-gray-50 flex justify-center pt-20 pb-24">
      <div className="w-full max-w-7xl p-6 space-y-8">
        {/* HEADER */}
        <h1 className="text-2xl font-bold">Profile Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard
            title="Credits"
            value={user.credits}
            color="bg-indigo-100"
          />
          <StatCard title="Problems Solved" value="80" color="bg-green-100" />
          <StatCard title="Resumes" value="3" color="bg-blue-100" />
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
                              : "bg-red-500"
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

                    <button className="text-blue-600 text-sm mt-3">
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
