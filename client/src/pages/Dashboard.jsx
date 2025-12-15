import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] p-6 md:p-10">
      {/* ================= TOP STATS ================= */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1f2430]">
          Welcome back, Madan 👋
        </h1>
        <p className="text-sm text-[#6b6b6b] mt-1">
          Here’s the current state of your resume and LinkedIn profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {/* Resume Score */}
        <StatCard
          title="Resume Score"
          value="78 / 100"
          hint="ATS + clarity score"
        />

        {/* LinkedIn Score */}
        <StatCard
          title="LinkedIn Profile Score"
          value="71 / 100"
          hint="Visibility & content strength"
        />

        {/* Credits */}
        <div className="rounded-2xl bg-white border border-[#e6e6e6] p-5">
          <h3 className="text-sm text-[#6b6b6b]">Credits</h3>
          <div className="mt-3 space-y-2">
            <CreditRow label="Free Credits" value="12" />
            <CreditRow label="Paid Credits" value="40" />
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Resume Preview */}
        <div className="bg-white rounded-2xl border border-[#e6e6e6] p-6">
          <h2 className="text-lg font-semibold text-[#1f2430] mb-4">
            Your Current Resume
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium">Summary</h3>
              <p className="text-[#4e5566] mt-1">
                MERN Stack developer with experience building scalable web
                applications and AI-powered tools.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Experience</h3>
              <ul className="list-disc ml-5 mt-1 text-[#4e5566]">
                <li>Built full-stack applications using React and Node.js</li>
                <li>Integrated AI features for resume parsing</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Skills</h3>
              <p className="text-[#4e5566]">
                JavaScript, React, Node.js, MongoDB, Tailwind
              </p>
            </div>
          </div>
        </div>

        {/* LinkedIn Profile Preview */}
        <div className="bg-white rounded-2xl border border-[#e6e6e6] p-6">
          <h2 className="text-lg font-semibold text-[#1f2430] mb-4">
            Your LinkedIn Profile
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-base">Madan G S Nayak</p>
              <p className="text-[#6b6b6b]">
                Full Stack Developer | MERN | AI Tools
              </p>
            </div>

            <div>
              <h3 className="font-medium">About</h3>
              <p className="text-[#4e5566] mt-1">
                Passionate developer focused on building intelligent, scalable,
                and user-centric web products.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Experience</h3>
              <ul className="list-disc ml-5 mt-1 text-[#4e5566]">
                <li>Developed SaaS platforms using MERN stack</li>
                <li>Worked on AI-based resume optimization tools</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECENT ACTIVITY ================= */}
      <div className="bg-white rounded-2xl border border-[#e6e6e6] p-6">
        <h2 className="text-lg font-semibold text-[#1f2430] mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3 text-sm">
          <ActivityItem text="Resume parsed successfully" time="2 hours ago" />
          <ActivityItem text="AI resume rewrite completed" time="Yesterday" />
          <ActivityItem
            text="LinkedIn post draft generated"
            time="2 days ago"
          />
          <ActivityItem text="Resume exported as PDF" time="3 days ago" />
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

/* ================= SUB COMPONENTS ================= */

const StatCard = ({ title, value, hint }) => (
  <div className="rounded-2xl bg-white border border-[#e6e6e6] p-5">
    <h3 className="text-sm text-[#6b6b6b]">{title}</h3>
    <p className="text-2xl font-semibold text-[#1f2430] mt-2">{value}</p>
    <p className="text-xs text-[#9aa0aa] mt-1">{hint}</p>
  </div>
);

const CreditRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-[#6b6b6b]">{label}</span>
    <span className="font-medium text-[#1f2430]">{value}</span>
  </div>
);

const ActivityItem = ({ text, time }) => (
  <li className="flex justify-between border-b last:border-none pb-2">
    <span className="text-[#4e5566]">{text}</span>
    <span className="text-xs text-[#9aa0aa]">{time}</span>
  </li>
);
