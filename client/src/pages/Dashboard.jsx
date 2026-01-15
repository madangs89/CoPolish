import { useState } from "react";
import { Linkedin, FileText } from "lucide-react";

const Dashboard = () => {
  const [userName] = useState("Madan");
  const [credits] = useState(52);

  const [resumeScore] = useState(84);
  const [linkedinScore] = useState(71);

  const [resumeUpdated] = useState("20 hours ago");
  const [linkedinChecked] = useState("2 days ago");

  const [portfolioStatus] = useState(true);
  const [portfolioUpdated] = useState("4 days ago");

  const [prepProgress] = useState({
    dsa: 70,
    oops: 30,
    dbms: 50,
  });

  return (
    <div className="min-h-screen mt-10 bg-[#f7f7f7] px-6 md:px-14 py-10">
      {/* ================= TOP MESSAGE ================= */}
      <div className="bg-[#eaf2ff] rounded-2xl px-6 py-4 flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
          ✓
        </div>
        <p className="text-sm md:text-base">
          <span className="font-medium">Nice progress, {userName} 👋</span>{" "}
          Your resume improved by <span className="font-semibold">+6 points</span>
        </p>
      </div>

      {/* ================= MAIN CARDS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= RESUME CARD ================= */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Resume</p>

          <div className="flex items-end gap-1">
            <span className="text-5xl font-semibold">{resumeScore}</span>
            <span className="text-gray-400">/100</span>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Last optimized: {resumeUpdated}
          </p>

          <div className="flex gap-3 mt-6">
            <button className="px-5 py-2 rounded-full border text-sm font-medium hover:bg-gray-50">
              View Resume
            </button>
            <button className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:opacity-90">
              Review Resume
            </button>
          </div>
        </div>

        {/* ================= LINKEDIN CARD ================= */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Linkedin className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium">LinkedIn</p>
          </div>

          <p className="text-sm text-gray-500 mb-3">
            Full Stack Developer | MERN | AI
          </p>

          <div className="flex items-end gap-1">
            <span className="text-5xl font-semibold">{linkedinScore}</span>
            <span className="text-gray-400">/100</span>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Last checked: {linkedinChecked}
          </p>

          <div className="flex gap-3 mt-6">
            <button className="px-5 py-2 rounded-full border text-sm font-medium hover:bg-gray-50">
              View Suggestions
            </button>
            <button className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:opacity-90">
              Improve LinkedIn →
            </button>
          </div>
        </div>

        {/* ================= PORTFOLIO CARD ================= */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-sm font-medium mb-3">Portfolio</p>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <p className="text-sm">
              {portfolioStatus ? "Published online" : "Not published"}
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Updated: {portfolioUpdated}
          </p>

          <button className="w-full px-5 py-3 rounded-full bg-black text-white text-sm font-medium hover:opacity-90">
            View Portfolio
          </button>
        </div>
      </div>

      {/* ================= INTERVIEW PREP ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* ================= PROGRESS ================= */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-lg font-medium mb-6">Interview Preparation</p>

          {/* DSA */}
          <Progress label="DSA" value={prepProgress.dsa} />

          {/* OOPS */}
          <Progress label="OOPS" value={prepProgress.oops} />

          {/* DBMS */}
          <Progress label="DBMS" value={prepProgress.dbms} />
        </div>

        {/* ================= CTA ================= */}
        <div className="bg-[#fff7e6] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm mb-3">
              Your LinkedIn profile still needs optimization to match recruiter
              searches.
            </p>
          </div>

          <button className="w-full mt-6 px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-medium hover:opacity-90">
            Optimize LinkedIn →
          </button>
        </div>
      </div>
    </div>
  );
};

const Progress = ({ label, value }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-blue-500 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
