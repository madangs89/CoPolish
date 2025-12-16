import {
  FileUser,
  Linkedin,
  Sparkles,
  ArrowUpRight,
  Wand2,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import ResumeClassicV1 from "../components/ResumeTemplates/ResumeClassicV1";

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#fafafa] px-4 md:px-8 py-6">
      {/* ================= HERO ================= */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1f2430]">
          Your profile is visible — but not competitive yet
        </h1>
        <p className="text-sm text-[#6b6b6b] mt-2 max-w-2xl">
          AI analyzed your resume and LinkedIn profile. Fix key gaps to improve
          recruiter visibility.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => navigate("/editor/resume/1324")}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#025149] text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Wand2 className="w-4 h-4" />
          Improve Resume Now
        </button>
      </div>

      {/* ================= SCORE CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <ScoreCard
          title="Resume Score"
          score={78}
          hint="Good, but missing ATS keywords"
          icon={<FileUser className="w-5 h-5 text-[#025149]" />}
        />

        <ScoreCard
          title="LinkedIn Score"
          score={71}
          hint="Headline and experience need polish"
          icon={<Linkedin className="w-5 h-5 text-[#1B1C7E]" />}
        />

        {/* Credits */}
        <div className="rounded-2xl border border-[#e6e6e6] bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-full bg-[#f1f5f9]">
              <Sparkles className="w-5 h-5 text-[#025149]" />
            </div>
            <h3 className="text-sm font-medium text-[#6b6b6b]">Credits</h3>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Resume */}
        <div className="flex gap-2  flex-col">
          <div className="flex px-1.5  items-center justify-between">
            <div className="">{"Resume"}</div>
            <h3
              onClick={() => navigate("/editor/resume/1324")}
              className="text-sm text-[#025149] flex items-center gap-1 hover:underline"
            >
              {"View full resume"}
            </h3>
          </div>
          <ResumeClassicV1 />
        </div>

        {/* LinkedIn */}
        <ProfileCard
          title="LinkedIn Profile"
          icon={<Linkedin className="w-5 h-5 text-[#1B1C7E]" />}
          actionLabel="View full profile"
        >
          <ProfilePreview
            title="Headline"
            content="Full Stack Developer | MERN | AI Tools"
          />

          <ProfilePreview
            title="About"
            content="Building intelligent, scalable, user-focused products."
          />

          <ProfileList
            title="Experience"
            items={[
              "Developed SaaS platforms",
              "Worked on AI resume optimization",
            ]}
          />
        </ProfileCard>
      </div>

      {/* ================= ACTIVITY ================= */}
      <div className="rounded-2xl border border-[#e6e6e6] bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

        <ul className="space-y-3 text-sm">
          <ActivityItem label="Resume parsed successfully" time="2 hours ago" />
          <ActivityItem label="AI resume rewrite completed" time="Yesterday" />
          <ActivityItem
            label="LinkedIn post draft generated"
            time="2 days ago"
          />
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

/* ================= COMPONENTS ================= */

const ScoreCard = ({ title, score, hint, icon }) => {
  return (
    <div className="rounded-2xl border border-[#e6e6e6] bg-white p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-full bg-[#f1f3f5]">{icon}</div>
        <h3 className="text-sm font-medium text-[#6b6b6b]">{title}</h3>
      </div>

      <div className="flex items-end gap-2 mb-1">
        <span className="text-3xl font-semibold text-[#1f2430]">{score}</span>
        <span className="text-sm text-[#9aa0aa] mb-0.5">/ 100</span>
      </div>

      <p className="text-xs text-[#9aa0aa]">{hint}</p>
    </div>
  );
};

const ProfileCard = ({ title, icon, action, actionLabel, children }) => (
  <div className="rounded-2xl border border-[#e6e6e6] bg-white p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {actionLabel && (
        <button
          onClick={action}
          className="text-sm text-[#025149] flex items-center gap-1 hover:underline"
        >
          {actionLabel} <ArrowUpRight className="w-4 h-4" />
        </button>
      )}
    </div>

    <div className="space-y-4 text-sm text-[#4e5566]">{children}</div>
  </div>
);

const ProfilePreview = ({ title, content }) => (
  <div>
    <p className="font-medium text-[#1f2430] mb-1">{title}</p>
    {content}
  </div>
);

const ProfileList = ({ title, items }) => (
  <div>
    <p className="font-medium text-[#1f2430] mb-1">{title}</p>
    <ul className="list-disc ml-5 space-y-1">
      {items.map((i, idx) => (
        <li key={idx}>{i}</li>
      ))}
    </ul>
  </div>
);

const ActivityItem = ({ label, time }) => (
  <li className="flex justify-between">
    <span>{label}</span>
    <span className="text-xs text-[#9aa0aa]">{time}</span>
  </li>
);
