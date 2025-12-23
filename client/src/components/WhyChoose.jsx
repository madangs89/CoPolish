// src/components/WhyChoose.jsx
import React from "react";

const defaultMetrics = [
  {
    id: "time",
    value: "42%",
    label: "lower average time-to-apply",
    note: "Users reduce resume prep time by nearly half (sample).",
    color: "linear-gradient(135deg,#DFF3FF,#CDE6FF)",
  },
  {
    id: "hours",
    value: "60k",
    label: "monthly hours saved",
    note: "Aggregate time saved across our user base.",
    color: "linear-gradient(135deg,#F5F5F5,#FFFFFF)",
  },
  {
    id: "engage",
    value: "5×",
    label: "increase in profile engagement",
    note: "More views & inbound messages after optimization.",
    color: "linear-gradient(135deg,#F0E8FF,#E6D8FF)",
  },
  {
    id: "clarity",
    value: "80%",
    label: "clarity / ATS friendliness",
    note: "Average clarity score after AI improvements.",
    color: "linear-gradient(135deg,#F7FDF2,#EEF9E0)",
  },
];

export default function WhyChoose({ metrics = defaultMetrics }) {
  return (
    <section className="max-w-6xl mx-auto px-6 lg:py-5">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
        {/* Left: Headline + description */}
        <div className="order-1 flex flex-col items-center justify-center lg:order-1">
          <h2 className="text-3xl md:text-4xl text-center font-semibold text-slate-900">
            Why Choose CoPolish
          </h2>
          <p className="mt-4 text-sm md:text-base text-center text-slate-600 max-w-xl">
            Unleash the power of AI to turn your experience into recruiter-ready
            content. From precise resume rewrites to optimized LinkedIn profiles
            and ready-to-post templates — CoPolish saves time and increases
            visibility while keeping you in control.
          </p>

          {/* <div className="mt-6 flex gap-3">
            <a
              href="#features"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-black text-white text-sm shadow-sm hover:opacity-95"
            >
              See Features
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
            >
              Pricing
            </a>
          </div> */}
        </div>

        {/* Right: Metrics grid */}
        <div className="order-2 lg:order-2">
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((m, i) => (
              <div
                key={m.id}
                className={`relative rounded-2xl p-6 shadow-md bg-white/80 backdrop-blur-sm border border-slate-100 min-h-[110px] flex flex-col justify-between`}
                role="region"
                aria-labelledby={`metric-${m.id}`}
              >
                {/* decorative accent square using inline style */}
                <div
                  className="absolute -left-3 -top-3 w-16 h-16 rounded-xl"
                  style={{
                    background:
                      m.color ||
                      (i % 2 === 0
                        ? "linear-gradient(135deg,#DFF0D9,#C6E8AD)"
                        : "linear-gradient(135deg,#FFF3E0,#FFE7B8)"),
                    filter: "saturate(1.02)",
                    opacity: 1,
                    zIndex: 0,
                  }}
                />

                <div className="relative z-10">
                  <div
                    id={`metric-${m.id}`}
                    className="text-3xl md:text-4xl font-extrabold text-slate-900"
                  >
                    {m.value}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{m.label}</div>
                </div>

                {m.note ? (
                  <div className="relative z-10 mt-4 text-xs text-slate-500">
                    {m.note}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
