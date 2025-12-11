// src/components/FinalCTA.jsx
import React from "react";

/**
 * Final call-to-action block
 * - Use this near bottom of page before footer
 *
 * Usage:
 * <FinalCTA onPrimary={() => {}} onSecondary={() => {}} />
 */

export default function FinalCTA({ onPrimary = () => {}, onSecondary = () => {} }) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-10 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold">
              Ready to polish your career?
            </h3>
            <p className="mt-3 text-sm md:text-base text-white/90 max-w-xl">
              Start with a free account — upload your resume, verify parsed fields, and let our AI produce recruiter-ready results.
              Upgrade anytime for scheduling, ATS scoring, and auto-posting.
            </p>
          </div>

          <div className="flex items-center gap-3 justify-start md:justify-end">
            <button
              onClick={onPrimary}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-indigo-700 font-semibold shadow hover:opacity-95"
            >
              Start Free
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={onSecondary}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-white/30 text-white hover:bg-white/10"
            >
              How it works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
