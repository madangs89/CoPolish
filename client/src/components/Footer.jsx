// src/components/Footer.jsx
import React from "react";

/**
 * Footer component
 *
 * Usage:
 * <Footer />
 */

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* left: brand + short */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-black text-white flex items-center justify-center font-bold">
                CP
              </div>
              <div>
                <div className="text-base font-semibold text-slate-900">
                  CoPolish
                </div>
                <div className="text-xs text-slate-500">
                  Resume & LinkedIn optimization
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 max-w-sm">
              Privacy-first AI that rewrites your resume, polishes your
              LinkedIn, and helps you get noticed — without making up facts.
            </p>
          </div>

          {/* middle: links */}
          <div className="flex gap-8">
            <div>
              <div className="text-sm font-semibold text-slate-900 mb-3">
                Product
              </div>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>
                  <a href="#features" className="hover:underline">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how" className="hover:underline">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:underline">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:underline">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900 mb-3">
                Company
              </div>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>
                  <a href="#faq" className="hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:underline">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:underline">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* right: newsletter */}
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-3">
              Get updates
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Join our newsletter for product updates and career tips.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed (demo)");
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                aria-label="Email address"
                placeholder="you@company.com"
                required
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm w-full"
              />
              <button className="px-4 py-2 rounded-lg bg-black text-white text-sm">
                Subscribe
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://twitter.com"
                className="text-slate-500 hover:text-slate-700"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M8 19c7.5 0 11.6-6.4 11.6-11.9v-.5A8.5 8.5 0 0022 4.6a8.2 8.2 0 01-2.4.7 4.1 4.1 0 001.8-2.3 8.2 8.2 0 01-2.6 1 4.1 4.1 0 00-7 3.7A11.6 11.6 0 013 4.8a4 4 0 001.3 5.5A4 4 0 012.8 9v.1a4.1 4.1 0 003.3 4 4.1 4.1 0 01-1.8.1 4.1 4.1 0 003.8 2.8A8.3 8.3 0 012 18.6a11.6 11.6 0 006 1.8" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com"
                className="text-slate-500 hover:text-slate-700"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M4.98 3.5C4.98 4.9 3.9 6 2.5 6S0 4.9 0 3.5 1.08 1 2.5 1 4.98 2.1 4.98 3.5zM0 8h5V24H0V8zM8 8h4.8v2.2h.1c.7-1.3 2.5-2.2 4.8-2.2 5.1 0 6 3.3 6 7.6V24h-5v-7.5c0-1.8 0-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4v7.6H8V8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} CoPolish — All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#terms" className="hover:underline">
              Terms
            </a>
            <a href="#privacy" className="hover:underline">
              Privacy
            </a>
            <a href="#security" className="hover:underline">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
