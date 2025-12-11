// src/components/FAQ.jsx
import React, { useState } from "react";

/**
 * FAQ component
 * - Accessible accordion (aria)
 * - Pass optional `items` prop to override defaults
 *
 * Usage:
 * <FAQ />
 * <FAQ items={myFaqItems} />
 */

const defaultItems = [
  {
    id: "faq-1",
    q: "Do I need a LinkedIn account to use CoPolish?",
    a: "No — you can upload your resume (PDF/DOCX) or paste a LinkedIn export. LinkedIn OAuth adds convenience (sync & one-click updates) but is optional.",
  },
  {
    id: "faq-2",
    q: "Will CoPolish invent accomplishments or metrics?",
    a: "Never. Our AI suggests phrasing and flags missing metrics as “METRIC_NEEDED”. Any numerical claims must be confirmed by you before export or posting.",
  },
  {
    id: "faq-3",
    q: "Is my resume/Profile data private?",
    a: "Yes. We use a privacy-first approach: profile parsing and LLM requests happen on the server, tokens and sensitive data are encrypted with KMS, and you control exports and deletions.",
  },
  {
    id: "faq-4",
    q: "What does an optimization credit cover?",
    a: "An optimization covers an end-to-end rewrite of a resume or a full LinkedIn profile suggestion. Mini-optimizations are smaller suggestions (e.g., 1-3 bullets or a headline).",
  },
  {
    id: "faq-5",
    q: "How do scheduler and auto-posting work?",
    a: "By default CoPolish creates drafts. Auto-posting requires explicit opt-in, two confirmations, and can be paused at any time. We keep audit logs for every outbound post.",
  },
];

export default function FAQ({ items = defaultItems }) {
  const [open, setOpen] = useState(items[0]?.id || null);

  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
          Answers to common questions about privacy, scheduling, billing, and
          how CoPolish works.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((it) => {
          const isOpen = open === it.id;
          return (
            <div
              key={it.id}
              className="bg-white/90 border border-slate-100 rounded-2xl p-4 shadow-sm"
            >
              <button
                onClick={() => toggle(it.id)}
                aria-expanded={isOpen}
                aria-controls={`${it.id}-panel`}
                className="w-full flex items-start justify-between gap-4 text-left"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {it.q}
                  </div>
                </div>

                <div className="flex items-center">
                  <svg
                    className={`w-5 h-5 text-slate-500 transform transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>

              <div
                id={`${it.id}-panel`}
                role="region"
                aria-labelledby={it.id}
                className={`mt-3 text-sm text-slate-600 overflow-hidden transition-all duration-200 ${
                  isOpen ? "max-h-96" : "max-h-0"
                }`}
                style={{ transitionProperty: "max-height" }}
              >
                <p className="leading-relaxed">{it.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
