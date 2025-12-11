// src/components/Pricing.jsx
import React, { useState } from "react";

/**
 * Pricing component (React + Tailwind)
 *
 * Usage:
 *  <Pricing onSelectPlan={(planId)=>{ /* open signup/checkout *\/ }} />
 *
 * Props:
 *  - onSelectPlan(planId) optional callback when user clicks CTA
 *  - userPlanId optional string to indicate current user's plan ("free"|"starter"|"pro")
 *  - showBlockedUploadNotice boolean to show the "Resume updates are available..." message
 */

export default function Pricing({
  onSelectPlan = (id) => {
    console.log("Select plan:", id);
  },
  userPlanId = null,
  showBlockedUploadNotice = false,
}) {
  const [selected, setSelected] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      freq: "forever",
      highlight: false,
      bullets: [
        "1 full LinkedIn optimization (one-time)",
        "3 mini LinkedIn optimizations / month",
        "1 resume upload allowed only once (first-time)",
        "Resume re-upload blocked (upgrade to continue)",
        "Limited speed (queue delay)",
        "PDF export (watermark)",
        "No scheduler",
        "No AI resume rewrite",
        "No auto photo extraction",
      ],
      rulesTitle: "Free User Resume Rules",
      rules: [
        "✔ First resume upload allowed",
        "❌ Re-upload = Not allowed",
        'Show message: "Resume updates are available in Starter plan (₹99/month). Upgrade to keep your profile synced."',
      ],
    },
    {
      id: "starter",
      name: "Starter",
      price: "₹99",
      freq: "/month",
      highlight: true,
      bullets: [
        "20 optimizations / month",
        "Full LinkedIn rewrite",
        "Full resume enhancement",
        "Unlimited resume re-uploads (count toward optimizations)",
        "Clean PDF / DOCX export",
        "Priority queue",
        "Version history",
        "10 LinkedIn post templates",
      ],
      rulesTitle: "Starter User Resume Rules",
      rules: [
        "✔ Resume re-upload allowed",
        "✔ Each re-upload deducts 1 optimization credit",
        "✔ Resume data overwrites previous extracted data",
        "✔ Auto-detect changes (skills, experience, etc.)",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹199",
      freq: "/month",
      highlight: false,
      bullets: [
        "100 optimizations / month",
        "Unlimited resume syncs",
        "ATS scoring",
        "AI keyword targeting",
        "Auto-posting",
        "A/B testing",
        "Faster queue",
        "Analytics dashboard",
      ],
      rulesTitle: "Pro User Resume Rules",
      rules: [
        "✔ Unlimited resume uploads",
        "✔ No deduction from credits",
        "✔ Real-time sync",
        "✔ ATS score after every upload",
      ],
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
          Your Plans
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
          Choose the plan that fits your job search. Start free — upgrade
          anytime for advanced features.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-2xl p-6 border ${
              p.highlight ? "border-indigo-300 shadow-lg" : "border-slate-100"
            } bg-white`}
          >
            {p.highlight && (
              <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                Popular
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {p.name}
                </h3>
                <div className="mt-1 text-sm text-slate-500">
                  {p.freq === "forever" ? "Forever" : p.freq}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold text-slate-900">
                  {p.price}
                </div>
                <div className="text-sm text-slate-500">
                  {p.freq === "forever" ? "" : p.freq}
                </div>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {p.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-1 text-green-500 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  setSelected(p.id);
                  onSelectPlan(p.id);
                }}
                className={`w-full px-4 py-3 rounded-full text-sm font-medium ${
                  p.highlight
                    ? "bg-indigo-600 text-white hover:opacity-95"
                    : "bg-black text-white hover:opacity-95"
                }`}
              >
                {userPlanId === p.id
                  ? "Current plan"
                  : p.id === "free"
                  ? "Create Free Account"
                  : `Upgrade to ${p.name}`}
              </button>

              <button
                onClick={() => alert(`${p.name} — Learn more`)}
                className="w-full px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
              >
                Learn more
              </button>
            </div>

            {/* resume rules accordion (simple) */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-sm text-slate-600">
              <div className="font-medium mb-2 text-slate-800">
                {p.rulesTitle}
              </div>
              <ul className="text-xs space-y-1">
                {p.rules.map((r, ri) => (
                  <li
                    key={ri}
                    className={`${
                      r.startsWith("✔")
                        ? "text-green-700"
                        : r.startsWith("❌")
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Blocked upload notice (shown for free users when they attempt re-upload) */}
      {showBlockedUploadNotice && (
        <div className="mt-8 max-w-3xl mx-auto bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-900 rounded">
          <strong>
            Resume updates are available in Starter plan (₹99/month).
          </strong>{" "}
          Upgrade to keep your profile synced.
        </div>
      )}

      <div className="mt-10 text-center text-sm text-slate-500">
        <p>
          All payments processed securely. Cancel anytime. Prices shown are in
          INR.
        </p>
      </div>
    </section>
  );
}
