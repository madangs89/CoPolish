import React from "react";

/* ================= CONSTANTS ================= */

const SECTIONS = [
  "personal",
  "summary",
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "achievements",
  "extracurricular",
  "hobbies",
];

const FONT_OPTIONS = [
  { label: "Inter (Modern)", value: "Inter, system-ui, sans-serif" },
  { label: "System Default", value: "system-ui, sans-serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Georgia", value: "Georgia, serif" },
];

/* ================= HELPERS ================= */

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const updateConfig = (prev, path, value) => {
  const keys = path.split(".");
  const copy = structuredClone(prev);
  let ref = copy;

  for (let i = 0; i < keys.length - 1; i++) {
    ref = ref[keys[i]];
  }

  ref[keys[keys.length - 1]] = value;
  return copy;
};

/* ================= COMPONENT ================= */

const ResumeConfigEditor = ({ config, setConfig }) => {
  const set = (path, value) => {
    setConfig((prev) => updateConfig(prev, path, value));
  };

  /* ================= SECTION ORDER ================= */

  const handleSectionChange = (index, newValue) => {
    const next = [...config.content.order];
    next[index] = newValue;

    // remove duplicates
    const unique = [...new Set(next)];

    // re-add missing sections at the end
    SECTIONS.forEach((s) => {
      if (!unique.includes(s)) unique.push(s);
    });

    set("content.order", unique);
  };

  return (
    <div className="space-y-10 p-6 rounded-xl border bg-white">
      {/* ================= SECTION ORDER ================= */}
      <section>
        <h3 className="text-sm font-semibold mb-2">Section Order</h3>
        <p className="text-xs text-gray-500 mb-3">
          Controls the vertical order of sections in the resume.
        </p>

        {config.content.order.map((section, index) => (
          <div key={`${section}-${index}`} className="flex items-center gap-3 mb-2">
            <span className="text-xs text-gray-400 w-6">{index + 1}.</span>

            <select
              value={section}
              onChange={(e) => handleSectionChange(index, e.target.value)}
              className="border rounded px-3 py-1 text-sm flex-1"
            >
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ))}
      </section>

      {/* ================= PAGE ================= */}
      <section>
        <h3 className="text-sm font-semibold mb-2">Page</h3>

        <label className="text-xs text-gray-500">Width (px)</label>
        <input
          type="number"
          min={700}
          max={900}
          value={config.page.width}
          onChange={(e) => set("page.width", clamp(+e.target.value, 700, 900))}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="text-xs text-gray-500">Min Height (px)</label>
        <input
          type="number"
          min={900}
          max={1400}
          value={config.page.minHeight}
          onChange={(e) =>
            set("page.minHeight", clamp(+e.target.value, 900, 1400))
          }
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="text-xs text-gray-500">Padding (px)</label>
        <input
          type="number"
          min={8}
          max={60}
          value={config.page.padding}
          onChange={(e) =>
            set("page.padding", clamp(+e.target.value, 8, 60))
          }
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="text-xs text-gray-500">Background</label>
        <input
          type="color"
          value={config.page.background}
          onChange={(e) => set("page.background", e.target.value)}
          className="mt-1 h-8 w-16"
        />
      </section>

      {/* ================= TYPOGRAPHY ================= */}
      <section>
        <h3 className="text-sm font-semibold mb-2">Typography</h3>

        <label className="text-xs text-gray-500">Heading Font</label>
        <select
          value={config.typography.fontFamily.heading}
          onChange={(e) =>
            set("typography.fontFamily.heading", e.target.value)
          }
          className="border rounded px-3 py-2 w-full mb-3 text-sm"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <label className="text-xs text-gray-500">Body Font</label>
        <select
          value={config.typography.fontFamily.body}
          onChange={(e) =>
            set("typography.fontFamily.body", e.target.value)
          }
          className="border rounded px-3 py-2 w-full mb-3 text-sm"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <label className="text-xs text-gray-500">Name Size</label>
        <input
          type="number"
          min={20}
          max={40}
          value={config.typography.fontSize.name}
          onChange={(e) =>
            set("typography.fontSize.name", clamp(+e.target.value, 20, 40))
          }
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="text-xs text-gray-500">Section Size</label>
        <input
          type="number"
          min={12}
          max={22}
          value={config.typography.fontSize.section}
          onChange={(e) =>
            set("typography.fontSize.section", clamp(+e.target.value, 12, 22))
          }
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="text-xs text-gray-500">Body Size</label>
        <input
          type="number"
          min={8}
          max={18}
          value={config.typography.fontSize.body}
          onChange={(e) =>
            set("typography.fontSize.body", clamp(+e.target.value, 8, 18))
          }
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="text-xs text-gray-500">Small Size</label>
        <input
          type="number"
          min={8}
          max={16}
          value={config.typography.fontSize.small}
          onChange={(e) =>
            set("typography.fontSize.small", clamp(+e.target.value, 8, 16))
          }
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="text-xs text-gray-500">Line Height</label>
        <input
          type="number"
          step="0.05"
          min={1}
          max={2}
          value={config.typography.lineHeight}
          onChange={(e) =>
            set("typography.lineHeight", clamp(+e.target.value, 1, 2))
          }
          className="border rounded px-3 py-2 w-full"
        />
      </section>

      {/* ================= COLORS ================= */}
      <section>
        <h3 className="text-sm font-semibold mb-2">Colors</h3>

        {Object.entries(config.colors).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between mb-2">
            <span className="text-xs capitalize text-gray-600">{key}</span>
            <input
              type="color"
              value={value}
              onChange={(e) => set(`colors.${key}`, e.target.value)}
              className="h-7 w-12"
            />
          </div>
        ))}
      </section>

      {/* ================= SPACING ================= */}
      <section>
        <h3 className="text-sm font-semibold mb-2">Spacing</h3>

        <label className="text-xs text-gray-500">Section Gap</label>
        <input
          type="number"
          min={6}
          max={48}
          value={config.spacing.sectionGap}
          onChange={(e) =>
            set("spacing.sectionGap", clamp(+e.target.value, 6, 48))
          }
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="text-xs text-gray-500">Item Gap</label>
        <input
          type="number"
          min={4}
          max={28}
          value={config.spacing.itemGap}
          onChange={(e) =>
            set("spacing.itemGap", clamp(+e.target.value, 4, 28))
          }
          className="border rounded px-3 py-2 w-full"
        />
      </section>

      {/* ================= LIST STYLE ================= */}
      <section>
        <h3 className="text-sm font-semibold mb-2">List Style</h3>
        <select
          value={config.listStyle}
          onChange={(e) => set("listStyle", e.target.value)}
          className="border rounded px-3 py-2 w-full text-sm"
        >
          <option value="numbers">Numbers</option>
          <option value="dots">Dots</option>
          <option value="bullets">Bullets</option>
          <option value="dash">Dash</option>
          <option value="none">None</option>
        </select>
      </section>
    </div>
  );
};

export default ResumeConfigEditor;
