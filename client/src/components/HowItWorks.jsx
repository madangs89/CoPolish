// src/components/HowItWorks.jsx
import React from "react";

/**
 * HowItWorks
 * Props:
 *  - steps: optional array of { id, title, description, icon, badge } to override defaults
 *
 * Usage:
 *  <HowItWorks />
 *  OR
 *  <HowItWorks steps={customSteps} />
 */

const defaultSteps = [
  {
    id: "upload",
    title: "Upload Resume or LinkedIn Export",
    description:
      "Upload a PDF/DOCX resume or paste a LinkedIn-exported file. We parse text into structured fields so nothing important gets lost.",
    icon: "doc",
    badge: "Source: Resume or LinkedIn export",
  },
  {
    id: "parse",
    title: "Verify Parsed Profile",
    description:
      "Review parsed sections (Headline, Experience, Skills). Fix typos, reorder items, and confirm dates before AI suggestions.",
    icon: "edit",
    badge: "Editable fields: Headline • Experience • Skills",
  },
  {
    id: "analyze",
    title: "AI Analyze & Rewrite",
    description:
      "Our privacy-first AI rewrites headlines, bullets, and summaries into recruiter-ready language. We never invent facts — suggested metrics require your confirmation.",
    icon: "spark",
    badge: "Privacy-first • No invented facts",
  },
  {
    id: "generate",
    title: "Generate LinkedIn Posts & Export",
    description:
      "Create LinkedIn-ready post drafts from your polished profile, export a PDF/DOCX resume, or schedule drafts. You control what gets posted.",
    icon: "post",
    badge: "Outputs: LinkedIn drafts • PDF / DOCX export",
  },
];

export default function HowItWorks({ steps = defaultSteps }) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
          How It Works
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          A simple, privacy-first flow for resume and LinkedIn optimization:
          upload, verify, refine with AI, then export or schedule content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className="relative rounded-2xl p-6 bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm flex flex-col h-full"
            aria-labelledby={`how-step-${step.id}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center">
                {renderIcon(step.icon)}
              </div>
              <div>
                <div
                  id={`how-step-${step.id}`}
                  className="text-lg font-semibold text-slate-900"
                >
                  {idx + 1}. {step.title}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 flex-1">
              {step.description}
            </p>

            <div className="mt-4">
              {/* Contextual badge / microcopy per step */}
              <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                {step.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="mt-10 text-center">
        <a
          href="#signup"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black text-white text-sm font-medium shadow hover:opacity-95"
        >
          Get Started — It's Free
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div> */}
    </section>
  );
}

/* Helper that returns simple inline SVG icons for the cards */
function renderIcon(name) {
  switch (name) {
    case "doc":
      return (
        <svg
          className="w-6 h-6 text-slate-700"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 3v6h6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "edit":
      return (
        <svg
          className="w-6 h-6 text-slate-700"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M3 21v-3l11-11 3 3L6 21H3z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 7l3 3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "spark":
      return (
        <svg
          className="w-6 h-6 text-slate-700"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "post":
      return (
        <svg
          className="w-6 h-6 text-slate-700"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="w-6 h-6 text-slate-700"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      );
  }
}
