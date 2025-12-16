import { FileUser, Linkedin, Sparkles, ArrowUpRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-white p-6 md:p-4">
      {/* ================= HEADER ================= */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-[#1f2430]">
          Welcome back, Madan 👋
        </h1>
        <p className="text-sm text-[#6b6b6b] mt-1">
          Overview of your resume and LinkedIn profile progress.
        </p>
      </div>

      {/* ================= SCORE CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <ScoreCard
          title="Resume Score"
          score={78}
          subtitle="ATS + clarity"
          accent="emerald"
          icon={<FileUser className="w-5 h-5" />}
        />

        <ScoreCard
          title="LinkedIn Score"
          score={71}
          subtitle="Profile strength"
          accent="indigo"
          icon={<Linkedin className="w-5 h-5" />}
        />

        {/* Credits */}
        <div className="rounded-2xl border border-[#e6e6e6] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-[#f1f5f9]">
              <Sparkles className="w-5 h-5 text-[#025149]" />
            </div>
            <h3 className="text-sm text-[#6b6b6b]">Credits</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6b6b6b]">Free</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b6b6b]">Paid</span>
              <span className="font-medium">40</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Resume */}
        <div className="rounded-2xl border border-[#e6e6e6] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileUser className="w-5 h-5 text-[#025149]" />
              <h2 className="text-lg font-semibold">Resume</h2>
            </div>

            <button
            
            onClick={()=>navigate("/editor/resume/1324")}
            className="text-sm text-[#025149] flex items-center gap-1 hover:underline">
              View full resume <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-5">
            <input
              className="border rounded-lg px-3 py-1.5 text-sm w-[65%]"
              value="First Resume"
              readOnly
            />

            <select className="border rounded-lg px-2 py-1.5 text-sm">
              <option>v0</option>
              <option>v1</option>
              <option>v2</option>
            </select>
          </div>

          <div className="space-y-4 text-sm text-[#4e5566]">
            <div>
              <p className="font-medium text-[#1f2430] mb-1">Summary</p>
              MERN Stack developer building scalable web & AI-powered tools.
            </div>

            <div>
              <p className="font-medium text-[#1f2430] mb-1">Experience</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Built full-stack apps using React & Node.js</li>
                <li>Integrated AI resume parsing workflows</li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-[#1f2430] mb-1">Skills</p>
              JavaScript, React, Node.js, MongoDB, Tailwind
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="rounded-2xl border border-[#e6e6e6] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-[#1B1C7E]" />
              <h2 className="text-lg font-semibold">LinkedIn Profile</h2>
            </div>

            <button className="text-sm text-[#1B1C7E] flex items-center gap-1 hover:underline">
              View full profile <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-sm text-[#4e5566]">
            <div>
              <p className="font-medium text-[#1f2430] mb-1">Headline</p>
              Full Stack Developer | MERN | AI Tools
            </div>

            <div>
              <p className="font-medium text-[#1f2430] mb-1">About</p>
              Building intelligent, scalable, user-focused products.
            </div>

            <div>
              <p className="font-medium text-[#1f2430] mb-1">Experience</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Developed SaaS platforms</li>
                <li>Worked on AI resume optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACTIVITY ================= */}
      <div className="rounded-2xl border border-[#e6e6e6] p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

        <ul className="space-y-3 text-sm">
          <li className="flex justify-between">
            <span>Resume parsed successfully</span>
            <span className="text-xs text-[#9aa0aa]">2 hours ago</span>
          </li>
          <li className="flex justify-between">
            <span>AI resume rewrite completed</span>
            <span className="text-xs text-[#9aa0aa]">Yesterday</span>
          </li>
          <li className="flex justify-between">
            <span>LinkedIn post draft generated</span>
            <span className="text-xs text-[#9aa0aa]">2 days ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

/* ================= SCORE CARD ================= */

const ScoreCard = ({ title, value, hint }) => {
  const icon =
    title === "Resume Score" ? (
      <FileUser className="w-5 h-5 text-[#025149]" />
    ) : (
      <Linkedin className="w-5 h-5 text-[#1B1C7E]" />
    );

  return (
    <div className="rounded-2xl border border-[#e6e6e6] p-6 bg-white">
      {/* Top */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-full bg-[#f1f3f5]">{icon}</div>
        <h3 className="text-sm font-medium text-[#6b6b6b]">{title}</h3>
      </div>

      {/* Score */}
      <div className="flex items-end gap-2 mb-1">
        <span className="text-3xl font-semibold text-[#1f2430] leading-none">
          72
        </span>
        <span className="text-sm text-[#9aa0aa] mb-0.5">/ 100</span>
      </div>

      {/* Hint */}
      <p className="text-xs text-[#9aa0aa]">{hint}</p>
    </div>
  );
};
