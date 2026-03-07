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


import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";
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


const execFileAsync = promisify(execFile);

/**
 * generateDocx
 *
 * Renders HTML → PDF via Puppeteer, then converts PDF → DOCX via LibreOffice.
 * This gives a DOCX that looks identical to the PDF.
 *
 * Install LibreOffice on your server:
 *   Ubuntu:  sudo apt-get install -y libreoffice
 *   macOS:   brew install --cask libreoffice
 */
export const generateDocx = async ({ html, paddingPx = 1 }) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "resume-"));
  const pdfPath = path.join(tmpDir, "resume.pdf");
  const docxPath = path.join(tmpDir, "resume.docx");

  try {
    // Step 1: Render HTML → PDF (identical to your /download endpoint)
    const marginMm = (paddingPx * 0.2646).toFixed(2);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
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
    html, body { margin: 0; padding: 0; width: 794px; }
    @page { size: A4; margin: ${marginMm}mm; }
    p, li, h1, h2, h3, h4, h5, h6 {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  </style>
</head>
<body>${html}</body>
</html>`;

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 300));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    await browser.close();
    await fs.writeFile(pdfPath, pdfBuffer);

    // Step 2: Convert PDF → DOCX via LibreOffice
    await execFileAsync("libreoffice", [
      "--headless",
      "--convert-to",
      "docx",
      "--outdir",
      tmpDir,
      pdfPath,
    ]);

    // Step 3: Return DOCX buffer
    const docxBuffer = await fs.readFile(docxPath);
    return docxBuffer;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
};
