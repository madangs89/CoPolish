import puppeteer from "puppeteer";

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
