// src/components/Testimonials.jsx
import Marquee from "react-fast-marquee";
import React, { useState } from "react";


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

      <Marquee autoFill={true} gradient={true} gradientWidth={100} speed={40}
      pauseOnClick={true}>
        {testimonials.map((t) => (
          <article
            key={t.id}
            className="rounded-2xl mx-3 max-w-[400px] p-6 bg-white/90 border border-slate-100 shadow-sm"
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
      </Marquee>
    </section>
  );
}
