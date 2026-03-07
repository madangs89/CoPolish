import puppeteer from "puppeteer";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  LevelFormat,
  ExternalHyperlink,
  HeadingLevel,
  TabStopType,
  TabStopPosition,
} from "docx";

/**
 * generatePdf
 *
 * paddingPx MUST match config.page.padding used in PageRenderer.
 * If you set it to 1, the @page margin will be ~0.26mm (basically none).
 * If your resume template has its own internal padding, set paddingPx=0
 * and let the component handle spacing.
 *
 * The HTML received is a single continuous div (exportMode=true from PageRenderer).
 * Puppeteer paginates it naturally across A4 pages.
 */

const PX_TO_MM = 0.2646; // 1px = 0.2646mm at 96dpi

export const generatePdf = async ({ html, paddingPx = 16 }) => {
  const marginMm = (paddingPx * PX_TO_MM).toFixed(2);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Set viewport to exact A4 width so layout matches the preview
  await page.setViewport({ width: 794, height: 1122, deviceScaleFactor: 1 });

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 794px;
    }
    @page {
      size: A4;
      margin: ${marginMm}mm;
    }
    /* Avoid breaking inside these elements */
    p, li, h1, h2, h3, h4, h5, h6, blockquote {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  </style>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Prata&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Ruda:wght@400..900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
  ${html}
</body>
</html>`;

  await page.setContent(fullHtml, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  await new Promise((r) => setTimeout(r, 300));

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  await browser.close();
  return pdf;
};

const A4_W_DXA = 11906;
const MARGIN_DXA = 900; // ~0.625 inch
const CONTENT_W = A4_W_DXA - MARGIN_DXA * 2; // 10106 DXA

const FONT = "Calibri";
const COLOR_PRIMARY = "1a1a2e"; // dark navy — name / headings
const COLOR_SECTION = "2c3e50"; // section titles
const COLOR_MUTED = "666666"; // secondary info
const COLOR_ACCENT = "2980b9"; // links

const PT = (pt) => pt * 2; // docx uses half-points

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Horizontal rule under section titles */
const sectionRule = () =>
  new Paragraph({
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: COLOR_SECTION,
        space: 1,
      },
    },
    spacing: { after: 80 },
    children: [],
  });

/** Bold uppercase section heading + rule */
const sectionHeading = (title) => [
  new Paragraph({
    spacing: { before: 240, after: 40 },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: PT(11),
        font: FONT,
        color: COLOR_SECTION,
        allCaps: true,
      }),
    ],
  }),
  sectionRule(),
];

/** Right-aligned date using a right tab stop */
const twoColumnPara = (left, right, opts = {}) =>
  new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
    spacing: { after: 40 },
    children: [
      new TextRun({
        text: left,
        bold: opts.bold ?? false,
        font: FONT,
        size: PT(opts.size ?? 10.5),
        color: opts.color ?? COLOR_PRIMARY,
      }),
      new TextRun({ text: "\t" }),
      new TextRun({ text: right, font: FONT, size: PT(9), color: COLOR_MUTED }),
    ],
  });

/** Numbered / bulleted list item */
const listItem = (text, reference = "numbers") =>
  new Paragraph({
    numbering: { reference, level: 0 },
    spacing: { after: 40 },
    children: [
      new TextRun({ text, font: FONT, size: PT(10), color: COLOR_PRIMARY }),
    ],
  });

/** Plain paragraph */
const plainPara = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: opts.after ?? 60 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        font: FONT,
        size: PT(opts.size ?? 10),
        color: opts.color ?? COLOR_PRIMARY,
        bold: opts.bold ?? false,
        italics: opts.italic ?? false,
      }),
    ],
  });

/** Hyperlink */
const linkPara = (url, label) =>
  new Paragraph({
    spacing: { after: 40 },
    children: [
      new ExternalHyperlink({
        link: url.startsWith("http") ? url : `https://${url}`,
        children: [
          new TextRun({
            text: label || url,
            font: FONT,
            size: PT(9.5),
            color: COLOR_ACCENT,
            underline: {},
          }),
        ],
      }),
    ],
  });

// ─── SECTION BUILDERS ─────────────────────────────────────────────────────────

const buildHeader = (personal = {}) => {
  const paras = [];

  if (personal.name) {
    paras.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: personal.name.toUpperCase(),
            bold: true,
            font: FONT,
            size: PT(20),
            color: COLOR_PRIMARY,
          }),
        ],
      }),
    );
  }

  // Contact line
  const contactParts = [personal.title, personal.email, personal.phone].filter(
    Boolean,
  );
  if (contactParts.length) {
    paras.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: contactParts
          .map((part, i) => [
            new TextRun({
              text: part,
              font: FONT,
              size: PT(9.5),
              color: COLOR_MUTED,
            }),
            i < contactParts.length - 1
              ? new TextRun({
                  text: "  |  ",
                  font: FONT,
                  size: PT(9.5),
                  color: COLOR_MUTED,
                })
              : null,
          ])
          .flat()
          .filter(Boolean),
      }),
    );
  }

  return paras;
};

const buildSummary = (personal = {}) => {
  if (!personal.summary) return [];
  return [
    ...sectionHeading("Summary"),
    plainPara(personal.summary, { after: 80 }),
  ];
};

const buildEducation = (education = []) => {
  if (!education.length) return [];
  const items = education.flatMap((edu) => [
    twoColumnPara(edu.institute, `${edu.from ?? ""} – ${edu.to ?? ""}`, {
      bold: true,
    }),
    plainPara(edu.degree, { color: COLOR_MUTED, after: 80 }),
  ]);
  return [...sectionHeading("Education"), ...items];
};

const buildExperience = (experience = []) => {
  if (!experience.length) return [];
  const items = experience.flatMap((exp) => [
    twoColumnPara(exp.company, exp.duration ?? "", { bold: true }),
    plainPara(exp.role, { italic: true, after: 40 }),
    ...(exp.description ?? []).map((d) => listItem(d, "numbers")),
    new Paragraph({ spacing: { after: 80 }, children: [] }), // spacer
  ]);
  return [...sectionHeading("Experience"), ...items];
};

const buildProjects = (projects = []) => {
  if (!projects.length) return [];
  const items = projects.flatMap((p) => [
    plainPara(p.title, { bold: true, after: 30 }),
    ...(p.technologies?.length
      ? [
          plainPara(`Tech: ${p.technologies.join(", ")}`, {
            color: COLOR_MUTED,
            size: 9,
            after: 30,
          }),
        ]
      : []),
    ...(p.description ?? []).map((d) => listItem(d, "bullets")),
    ...(p.link ?? [])
      .filter((l) => l?.url)
      .map((l) => linkPara(l.url, l.title || l.url)),
    new Paragraph({ spacing: { after: 80 }, children: [] }),
  ]);
  return [...sectionHeading("Projects"), ...items];
};

const buildSkills = (skills = []) => {
  if (!skills.length) return [];
  return [
    ...sectionHeading("Skills"),
    plainPara(skills.join(", "), { after: 80 }),
  ];
};

const buildCertifications = (certifications = []) => {
  if (!certifications.length) return [];
  const items = certifications.flatMap((c) => [
    plainPara(c.name, { bold: true, after: 20 }),
    plainPara(`${c.issuer ?? ""}${c.year ? ` · ${c.year}` : ""}`, {
      color: COLOR_MUTED,
      after: 80,
    }),
  ]);
  return [...sectionHeading("Certifications"), ...items];
};

const buildAchievements = (achievements = []) => {
  if (!achievements.length) return [];
  return [
    ...sectionHeading("Achievements"),
    ...achievements.map((a) => listItem(a, "numbers")),
  ];
};

const buildExtracurricular = (extracurricular = []) => {
  if (!extracurricular.length) return [];
  const items = extracurricular.flatMap((e) => [
    plainPara(e.role, { bold: true, after: 20 }),
    plainPara(`${e.activity ?? ""}${e.year ? ` · ${e.year}` : ""}`, {
      color: COLOR_MUTED,
      after: 20,
    }),
    ...(e.description ? [plainPara(e.description, { after: 80 })] : []),
  ]);
  return [...sectionHeading("Extracurricular"), ...items];
};

const buildHobbies = (hobbies = []) => {
  if (!hobbies.length) return [];
  return [
    ...sectionHeading("Hobbies"),
    plainPara(hobbies.join(" · "), { after: 80 }),
  ];
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

/**
 * @param {object} data   — resume data object
 * @param {string[]} order — section order array (from config.content.order)
 * @returns {Promise<Buffer>} — .docx file as buffer
 */
export const generateDocx = async (data = {}, order = []) => {
  const defaultOrder = [
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
  const sections = order.length ? order : defaultOrder;

  const sectionMap = {
    summary: buildSummary(data.personal),
    education: buildEducation(data.education),
    experience: buildExperience(data.experience),
    projects: buildProjects(data.projects),
    skills: buildSkills(data.skills),
    certifications: buildCertifications(data.certifications),
    achievements: buildAchievements(data.achievements),
    extracurricular: buildExtracurricular(data.extracurricular),
    hobbies: buildHobbies(data.hobbies),
  };

  const children = [
    ...buildHeader(data.personal),
    ...sections.flatMap((s) => sectionMap[s] ?? []),
  ];

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "numbers",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 480, hanging: 300 } } },
            },
          ],
        },
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 480, hanging: 300 } } },
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: { font: FONT, size: PT(10), color: COLOR_PRIMARY },
          paragraph: { spacing: { line: 276, lineRule: "auto" } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: A4_W_DXA, height: 16838 },
            margin: {
              top: MARGIN_DXA,
              bottom: MARGIN_DXA,
              left: MARGIN_DXA,
              right: MARGIN_DXA,
            },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
};
