// src/components/Testimonials.jsx
import React, { useState } from "react";

/**
 * Testimonials
 * Props:
 *  - testimonials: optional array of { id, name, role, company, quote, avatarUrl }
 *
 * Usage:
 *  <Testimonials />
 *  OR
 *  <Testimonials testimonials={myTestimonials} />
 */

const defaultTestimonials = [
  {
    id: "t1",
    name: "Aisha Khan",
    role: "Product Manager",
    company: "Finova",
    quote:
      "CoPolish transformed my resume and LinkedIn in minutes. I saw a noticeable uptick in recruiter interest within a week.",
    avatarUrl:
      "https://images.unsplash.com/photo-1545996124-1b5a1d9f2c7f?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3d9c2f7a1ef4a5a3d6a9e4b0f8c7a2c3",
  },
  {
    id: "t2",
    name: "Diego Martinez",
    role: "Software Engineer",
    company: "Stackline",
    quote:
      "The AI rewrite nailed my achievements and suggested great metrics — I only had to confirm them. The export looked professional.",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6f7b2a9c8d4e3f1a2b7c6d5e4f3a2b1c",
  },
  {
    id: "t3",
    name: "Priya Patel",
    role: "Marketing Lead",
    company: "Brandly",
    quote:
      "Generating LinkedIn post drafts from my polished profile saved me hours of content planning each month.",
    avatarUrl:
      "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=9d8a6c1b7f3c2a1b6e5c8d7a9b0c3d4e",
  },
];

export default function Testimonials({ testimonials = defaultTestimonials }) {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
          What People Are Saying
        </h2>
        <p className="mt-3 text-sm text-slate-600 max-w-2xl mx-auto">
          Real users share how CoPolish improved their resumes, profiles, and
          LinkedIn content.
        </p>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <article
            key={t.id}
            className="rounded-2xl p-6 bg-white/90 border border-slate-100 shadow-sm"
            aria-label={`Testimonial from ${t.name}`}
          >
            <div className="flex items-start gap-4">
              <img
                src={t.avatarUrl}
                alt={`${t.name} avatar`}
                className="w-12 h-12 rounded-full object-cover shadow-sm"
              />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {t.name}
                </div>
                <div className="text-xs text-slate-500">
                  {t.role} — {t.company}
                </div>
              </div>
            </div>

            <blockquote className="mt-4 text-slate-700 text-sm leading-relaxed">
              “{t.quote}”
            </blockquote>
          </article>
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden relative">
        <div className="rounded-2xl p-6 bg-white/90 border border-slate-100 shadow-sm">
          <div className="flex items-start gap-4">
            <img
              src={testimonials[index].avatarUrl}
              alt={`${testimonials[index].name} avatar`}
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {testimonials[index].name}
              </div>
              <div className="text-xs text-slate-500">
                {testimonials[index].role} — {testimonials[index].company}
              </div>
            </div>
          </div>

          <blockquote className="mt-4 text-slate-700 text-sm leading-relaxed">
            “{testimonials[index].quote}”
          </blockquote>
        </div>

        {/* Controls */}
        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full bg-white shadow inline-flex items-center justify-center text-slate-700 border border-slate-100"
            aria-label="Previous testimonial"
          >
            ‹
          </button>
        </div>
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
          <button
            onClick={next}
            className="w-9 h-9 rounded-full bg-white shadow inline-flex items-center justify-center text-slate-700 border border-slate-100"
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`w-2 h-2 rounded-full ${
                i === index ? "bg-slate-800" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>

   
     
    </section>
  );
}
